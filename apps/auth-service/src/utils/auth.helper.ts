import crypto from "crypto";
import { ValidationError } from "@packages/error-handler";
import { sendEmail } from "./sendMail";

import { NextFunction, Request, Response } from "express";
import prisma from "./libs/prisma";
import redis from "./libs/redis";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateRegistrationData = (
  data: any,
  userType: "usuario"
) => {
  const { name, email, password} = data;

  if (
    !name ||
    !email ||
    !password 
  ) {
    throw new ValidationError(`Campos requeridos!`);
  }
  if (!emailRegex.test(email)) {
    throw new ValidationError("Formato email invalido!");
  }
};

export const checkOtpRestriction = async (
  email: string,
  next: NextFunction
) => {
  if (await redis.get(`otp_lock:${email}`)) {
    return next(
      new ValidationError(
        "Cuenta bloqueada por demasiados intentos fallidos. Intente nuevamente despues de 30 minutos"
      )
    );
  }
  if (await redis.get(`otp_spam_lock:${email}`)) {
    return next(
      new ValidationError(
        "Demasiadas peticiones OTP. Porfavor espera 1 hora antes de solicitarle nuevamente."
      )
    );
  }
  if (await redis.get(`otp_cooldown:${email}`)) {
    return next(
      new ValidationError(
        "Porfavor espera 1 minutos antes de solicitar un nuevo OTP!"
      )
    );
  }
};

export const trackOtpRequest = async (email: string, next: NextFunction) => {
  const otpRequestKey = `otp_request_count:${email}`;
  let otpRequest = parseInt((await redis.get(otpRequestKey)) || "0");

  if (otpRequest >= 2) {
    await redis.set(`otp_spam_lock:${email}`, "locked", "EX", 3600);
    return next(
      new ValidationError(
        "Demasiadas solicitudes OTP. Porfavor espera 1 hora antes de solicitarla de nuevo."
      )
    );
  }
  await redis.set(otpRequestKey, otpRequest + 1, "EX", 3600);
};

export const sendOtp = async (
  name: string,
  email: string,
  template: string
) => {
  const otp = crypto.randomInt(1000, 9999).toString();
  await sendEmail(email, "Verifica tu email", template, { name, otp });
  await redis.set(`otp:${email}`, otp, "EX", 300);
  await redis.set(`otp_cooldown:${email}`, "true", "EX", 60);
};

export const verifyOtp = async (
  email: string,
  otp: string,
  next: NextFunction
) => {
  const storedOtp = await redis.get(`otp:${email}`);
  if (!storedOtp) {
    throw new ValidationError("Otp Invalido o Expirado!");
  }
  const failedAttemptsKey = `otp_attempts:${email}`;
  const failedAttempts = parseInt((await redis.get(failedAttemptsKey)) || "0");

  if (storedOtp !== otp) {
    if (failedAttempts >= 2) {
      await redis.set(`otp_lock:${email}`, "locked", "EX", 1800);
      await redis.del(`otp:${email}`, failedAttemptsKey);
      throw new ValidationError(
        "Demasiados intentos fallidos. Tu cuenta sera bloqueda por 30 minutos!"
      );
    }
    await redis.set(failedAttemptsKey, failedAttempts + 1, "EX", 300);
    throw new ValidationError(
      `OTP Incorrecto. ${2 - failedAttempts} intentos restantes.`
    );
  }

  await redis.del(`otp:${email}`, failedAttemptsKey);
};

export const handleForgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
  userType: "usuario" | "vendedor"
) => {
  try {
    const { email } = req.body;
    if (!email) throw new ValidationError("Email es requerido!");

    //  Encontrar al Usuario/Vendedor en nuestra DB
    const user =
      userType === "usuario"
        ? await prisma.users.findUnique({ where: { email } })
        : await prisma.sellers.findUnique({ where: { email } });

    if (!user) throw new ValidationError(`${userType} no Encntrado!`);

    // Revisar las restricciones otp
    await checkOtpRestriction(email, next);
    await trackOtpRequest(email, next);

    // Generar OTP y enviar Email
    await sendOtp(
      user.name,
      email,
      userType === "usuario"
        ? "forgot-password-user-mail"
        : "forgot-password-seller-mail"
    );

    res.status(200).json({
      message: "OTP enviado al email. Porfavor verifica tu cuenta.",
    });
  } catch (error) {
    next(error);
  }
};

export const verifyForgotPasswordOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      throw new ValidationError("Email y OTP son oblogatorios!");

    await verifyOtp(email, otp, next);
    res.status(200).json({
      message: "OTP Verificado. Ahora puedes restablecer tu password.",
    });
  } catch (error) {
    next(error);
  }
};
