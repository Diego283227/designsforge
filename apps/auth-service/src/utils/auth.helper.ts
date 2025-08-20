import crypto from "crypto";




import { NextFunction, Request, Response } from "express";
import prisma from "./libs/prisma";
import redis from "./libs/redis";
import { ValidationError } from "@packages/error-handler";
import { sendEmail } from "./sendEmail";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateRegistrationData = (data: any, userType: "user" | "admin" = "user") => {
    const { name, email, password } = data;

    if (!name || !email || !password) {
        throw new ValidationError("Nombre, email y contraseña son obligatorios");
    }

    if (!emailRegex.test(email)) {
        throw new ValidationError("Formato de email inválido");
    }

    if (password.length < 6) {
        throw new ValidationError("La contraseña debe tener al menos 6 caracteres");
    }

    // Validar nombre
    if (name.trim().length < 2) {
        throw new ValidationError("El nombre debe tener al menos 2 caracteres");
    }
};

export const checkOtpRestriction = async (email: string, next: NextFunction) => {
    // Verificar si la cuenta está bloqueada por intentos fallidos
    if (await redis.get(`otp_lock:${email}`)) {
        return next(
            new ValidationError("Cuenta bloqueada por demasiados intentos fallidos. Intenta nuevamente después de 30 minutos")
        );
    }

    // Verificar si hay demasiadas peticiones OTP
    if (await redis.get(`otp_spam_lock:${email}`)) {
        return next(
            new ValidationError("Demasiadas peticiones OTP. Por favor espera 1 hora antes de solicitarlo nuevamente.")
        );
    }

    // Verificar cooldown entre peticiones
    if (await redis.get(`otp_cooldown:${email}`)) {
        return next(
            new ValidationError("Por favor espera 1 minuto antes de solicitar un nuevo OTP")
        );
    }
};

export const trackOtpRequest = async (email: string, next: NextFunction) => {
    const otpRequestKey = `otp_request_count:${email}`;
    let otpRequestCount = parseInt((await redis.get(otpRequestKey)) || "0");

    if (otpRequestCount >= 5) { // Aumentado de 2 a 5 para ser menos restrictivo
        await redis.set(`otp_spam_lock:${email}`, "locked", "EX", 3600);
        return next(
            new ValidationError("Demasiadas solicitudes OTP. Por favor espera 1 hora antes de solicitarlo de nuevo.")
        );
    }

    await redis.set(otpRequestKey, otpRequestCount + 1, "EX", 3600);
};

export const sendOtp = async (name: string, email: string, template: string) => {
    const otp = crypto.randomInt(100000, 999999).toString(); // 6 dígitos para mayor seguridad
    
    try {
        await sendEmail(email, "Verifica tu email - DesignsForge", template, { name, otp });
        await redis.set(`otp:${email}`, otp, "EX", 300); // 5 minutos
        await redis.set(`otp_cooldown:${email}`, "true", "EX", 60); // 1 minuto cooldown
        
        console.log(`OTP enviado a ${email}: ${otp}`); // Solo para desarrollo - REMOVER EN PRODUCCIÓN
    } catch (error) {
        console.error("Error enviando OTP:", error);
        throw new ValidationError("Error enviando código de verificación. Intenta nuevamente.");
    }
};

export const verifyOtp = async (email: string, otp: string, next: NextFunction) => {
    const storedOtp = await redis.get(`otp:${email}`);
    
    if (!storedOtp) {
        throw new ValidationError("Código OTP inválido o expirado");
    }

    const failedAttemptsKey = `otp_attempts:${email}`;
    const failedAttempts = parseInt((await redis.get(failedAttemptsKey)) || "0");

    if (storedOtp !== otp) {
        if (failedAttempts >= 2) {
            await redis.set(`otp_lock:${email}`, "locked", "EX", 1800); // 30 minutos
            await redis.del(`otp:${email}`, failedAttemptsKey);
            throw new ValidationError("Demasiados intentos fallidos. Tu cuenta será bloqueada por 30 minutos");
        }
        
        await redis.set(failedAttemptsKey, failedAttempts + 1, "EX", 300);
        throw new ValidationError(`Código OTP incorrecto. ${2 - failedAttempts} intentos restantes.`);
    }

    // OTP correcto - limpiar intentos fallidos
    await redis.del(`otp:${email}`, failedAttemptsKey);
};

export const handleForgotPassword = async (
    req: Request,
    res: Response,
    next: NextFunction,
    userType: "user" | "admin" = "user"
) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            throw new ValidationError("Email es requerido");
        }

        if (!emailRegex.test(email)) {
            throw new ValidationError("Formato de email inválido");
        }

        // Buscar usuario en la base de datos
        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() }
        });

        if (!user) {
            // Por seguridad, no revelamos si el email existe o no
            res.status(200).json({
                message: "Si el email existe, se ha enviado un código de recuperación."
            });
            return;
        }

        // Verificar que sea una cuenta local (no OAuth)
        if (user.provider !== "LOCAL") {
            throw new ValidationError("Esta cuenta usa autenticación externa. No se puede restablecer la contraseña.");
        }

        // Revisar restricciones OTP
        await checkOtpRestriction(email, next);
        await trackOtpRequest(email, next);

        // Generar OTP y enviar email
        await sendOtp(user.name, email, "forgot-password");

        res.status(200).json({
            message: "Si el email existe, se ha enviado un código de recuperación."
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
        
        if (!email || !otp) {
            throw new ValidationError("Email y código OTP son obligatorios");
        }

        await verifyOtp(email, otp, next);
        
        res.status(200).json({
            message: "Código verificado. Ahora puedes restablecer tu contraseña."
        });
    } catch (error) {
        next(error);
    }
};

// Nueva función para validar contraseñas
export const validatePassword = (password: string): boolean => {
    if (password.length < 6) {
        throw new ValidationError("La contraseña debe tener al menos 6 caracteres");
    }
    
    // Opcional: validaciones adicionales de seguridad
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
        throw new ValidationError("La contraseña debe contener al menos una mayúscula, una minúscula y un número");
    }
    
    return true;
};

// Nueva función para limpiar y normalizar datos de usuario
export const sanitizeUserInput = (data: any) => {
    return {
        name: data.name?.trim(),
        email: data.email?.toLowerCase().trim(),
        password: data.password,
    };
};

// Función para verificar si un email ya está en uso
export const checkEmailExists = async (email: string): Promise<boolean> => {
    const existingUser = await prisma.user.findUnique({
        where: { email: email.toLowerCase() }
    });
    return !!existingUser;
};

// Función para generar un token de verificación único
export const generateVerificationToken = (): string => {
    return crypto.randomBytes(32).toString('hex');
};

// Función para verificar fuerza de contraseña
export const getPasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
    if (password.length < 6) return 'weak';
    
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z\d]/.test(password)) score++; // Símbolos especiales
    
    if (score <= 2) return 'weak';
    if (score <= 4) return 'medium';
    return 'strong';
};