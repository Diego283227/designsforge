import { NextFunction, Request, Response } from "express";
import {
  checkOtpRestriction,
  handleForgotPassword,
  sendOtp,
  trackOtpRequest,
  validateRegistrationData,
  verifyForgotPasswordOtp,
  verifyOtp,
} from "../utils/auth.helper";


import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { setCookie } from "../utils/cookies/setCookies";
import prisma from "../utils/libs/prisma";
import { AuthError, ValidationError } from "@packages/error-handler";

// Generar tokens JWT
const generateTokens = (userId: string, role: string) => {
  const accessToken = jwt.sign(
    { id: userId, role },
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { id: userId, role },
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};

// Configurar cookies de manera segura
const setTokenCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string
) => {
  // Access token con menor duración
  res.cookie("access_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 15 * 60 * 1000, // 15 minutos
  });

  // Refresh token con duración completa usando tu función setCookie
  setCookie(res, "refresh_token", refreshToken);
};

// Registrar un nuevo usuario
export const userRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    validateRegistrationData(req.body, "user");
    const { name, email } = req.body;

    // Verificar si el usuario ya existe (usando el nuevo modelo 'user')
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      return next(new ValidationError("Usuario ya registrado con este email"));
    }

    await checkOtpRestriction(email, next);
    await trackOtpRequest(email, next);
    await sendOtp(name, email, "user-activation-mail");

    res.status(200).json({
      message: "OTP enviado al email. Por favor verifica tu cuenta.",
    });
  } catch (error) {
    return next(error);
  }
};

// Verificar usuario con OTP
export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, otp, password, name } = req.body;

    if (!email || !otp || !password || !name) {
      return next(new ValidationError("Todos los campos son requeridos"));
    }

    // Sanitizar datos
    const sanitizedEmail = email.toLowerCase().trim();
    const sanitizedName = name.trim();

    // Verificar que el usuario no exista ya
    const existingUser = await prisma.user.findUnique({
      where: { email: sanitizedEmail },
    });
    if (existingUser) {
      return next(new ValidationError("Email ya está en uso"));
    }

    // Verificar OTP
    await verifyOtp(sanitizedEmail, otp, next);

    // Validar contraseña (mínimo 6 caracteres)
    if (password.length < 6) {
      return next(
        new ValidationError("La contraseña debe tener al menos 6 caracteres")
      );
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 12);

    // Crear usuario con el nuevo schema
    const user = await prisma.user.create({
      data: {
        name: sanitizedName,
        email: sanitizedEmail,
        password: hashedPassword,
        isVerified: true,
        role: "USER",
        provider: "LOCAL",
      },
    });

    // Generar tokens
    const { accessToken, refreshToken } = generateTokens(user.id, user.role);

    // Configurar cookies
    setTokenCookies(res, accessToken, refreshToken);

    res.status(201).json({
      success: true,
      message: "Usuario registrado exitosamente",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    return next(error);
  }
};

// Iniciar sesión
export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ValidationError("Email y contraseña son obligatorios"));
    }

    // Sanitizar email
    const sanitizedEmail = email.toLowerCase().trim();

    // Buscar usuario (usando el nuevo modelo 'user')
    const user = await prisma.user.findUnique({
      where: { email: sanitizedEmail },
    });

    if (!user) {
      return next(new AuthError("Credenciales inválidas"));
    }

    // Verificar que sea una cuenta local
    if (user.provider !== "LOCAL" || !user.password) {
      return next(
        new ValidationError(
          "Esta cuenta usa autenticación externa. Usa el botón correspondiente para iniciar sesión."
        )
      );
    }

    // Verificar contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new AuthError("Credenciales inválidas"));
    }

    // Verificar que la cuenta esté verificada
    if (!user.isVerified) {
      // Reenviar OTP de verificación
      await sendOtp(user.name, user.email, "user-activation-mail");
      return next(
        new ValidationError(
          "Cuenta no verificada. Se ha enviado un nuevo código a tu email."
        )
      );
    }

    // Generar tokens
    const { accessToken, refreshToken } = generateTokens(user.id, user.role);

    // Configurar cookies
    setTokenCookies(res, accessToken, refreshToken);

    res.status(200).json({
      message: "Inicio de sesión exitoso",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    return next(error);
  }
};

// Token de actualización
export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshTokenFromCookie = req.cookies.refresh_token;

    if (!refreshTokenFromCookie) {
      throw new ValidationError(
        "No autorizado! Token de actualización no proporcionado."
      );
    }

    // Verificar refresh token
    const decoded = jwt.verify(
      refreshTokenFromCookie,
      process.env.REFRESH_TOKEN_SECRET as string
    ) as { id: string; role: string };

    if (!decoded || !decoded.id || !decoded.role) {
      throw new ValidationError("Token de actualización inválido.");
    }

    // Verificar que el usuario aún existe
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) {
      throw new AuthError("Usuario no encontrado.");
    }

    // Generar nuevos tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(
      user.id,
      user.role
    );

    // Configurar cookies
    setTokenCookies(res, accessToken, newRefreshToken);

    return res.status(200).json({
      success: true,
      message: "Token actualizado exitosamente",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    return next(error);
  }
};

// Obtener usuario logueado
export const getUser = async (req: any, res: Response, next: NextFunction) => {
  try {
    const user = req.user;

    if (!user) {
      return next(new ValidationError("Usuario no autenticado"));
    }

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        isVerified: user.isVerified,
        provider: user.provider,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Logout
export const logoutUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Limpiar cookies
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");

    res.status(200).json({
      success: true,
      message: "Logout exitoso",
    });
  } catch (error) {
    next(error);
  }
};

// Olvidé contraseña
export const userForgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await handleForgotPassword(req, res, next, "user");
};

// Verificar OTP contraseña olvidada
export const verifyUserForgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await verifyForgotPasswordOtp(req, res, next);
};

// Restablecer contraseña
export const resetUserPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return next(
        new ValidationError(
          "Email, código OTP y nueva contraseña son obligatorios"
        )
      );
    }

    // Sanitizar email
    const sanitizedEmail = email.toLowerCase().trim();

    // Verificar OTP una vez más
    await verifyOtp(sanitizedEmail, otp, next);

    // Validar nueva contraseña
    if (newPassword.length < 6) {
      return next(
        new ValidationError(
          "La nueva contraseña debe tener al menos 6 caracteres"
        )
      );
    }

    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { email: sanitizedEmail },
    });
    if (!user) {
      return next(new ValidationError("Usuario no encontrado"));
    }

    // Verificar que no sea la misma contraseña
    if (user.password) {
      const isSamePassword = await bcrypt.compare(newPassword, user.password);
      if (isSamePassword) {
        return next(
          new ValidationError(
            "La nueva contraseña no puede ser la misma que la anterior"
          )
        );
      }
    }

    // Hash de la nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Actualizar contraseña
    await prisma.user.update({
      where: { email: sanitizedEmail },
      data: { password: hashedPassword },
    });

    res.status(200).json({
      success: true,
      message: "Contraseña restablecida exitosamente",
    });
  } catch (error) {
    next(error);
  }
};

// Cambiar contraseña (usuario autenticado)
export const changePassword = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user?.id;

    if (!currentPassword || !newPassword) {
      return next(
        new ValidationError(
          "Contraseña actual y nueva contraseña son obligatorias"
        )
      );
    }

    if (!userId) {
      return next(new ValidationError("Usuario no autenticado"));
    }

    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.password) {
      return next(new ValidationError("Usuario no encontrado o cuenta OAuth"));
    }

    // Verificar contraseña actual
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isCurrentPasswordValid) {
      return next(new ValidationError("Contraseña actual incorrecta"));
    }

    // Validar nueva contraseña
    if (newPassword.length < 6) {
      return next(
        new ValidationError(
          "La nueva contraseña debe tener al menos 6 caracteres"
        )
      );
    }

    // Verificar que no sea la misma contraseña
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return next(
        new ValidationError(
          "La nueva contraseña debe ser diferente a la actual"
        )
      );
    }

    // Hash de la nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Actualizar contraseña
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    res.status(200).json({
      success: true,
      message: "Contraseña cambiada exitosamente",
    });
  } catch (error) {
    next(error);
  }
};

// Actualizar perfil de usuario
export const updateUserProfile = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, preferences } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return next(new ValidationError("Usuario no autenticado"));
    }

    const updateData: any = {};

    if (name && name.trim().length >= 2) {
      updateData.name = name.trim();
    }

    if (preferences && typeof preferences === "object") {
      updateData.preferences = preferences;
    }

    if (Object.keys(updateData).length === 0) {
      return next(new ValidationError("No hay datos para actualizar"));
    }

    // Actualizar usuario
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        role: true,
        isVerified: true,
        preferences: true,
        updatedAt: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "Perfil actualizado exitosamente",
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};
