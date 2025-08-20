import jwt from "jsonwebtoken";
import { NextFunction, Response } from "express";
import { AuthError } from "@packages/error-handler";

const isAuthenticated = async (req: any, res: Response, next: NextFunction) => {
  try {
    const token =
      req.cookies?.access_token || req.headers?.authorization?.split(" ")[1];
    if (!token) {
      throw new AuthError("No autorizado! token es requerido");
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as {
      id: string;
      role: "USER" | "ADMIN";
    };

    if (!decoded) {
      throw new AuthError("No autorizado! Token invalido");
    }

    // Cambiar de prisma.users a prisma.user
    const { PrismaClient } = require("@prisma/client");
    const prisma = new PrismaClient();

    const account = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    req.user = account;

    if (!account) {
      throw new AuthError("Cuenta no encontrada!");
    }

    await prisma.$disconnect();
    return next();
  } catch (error) {
    return next(new AuthError("No autorizado! Token invalido o expirado."));
  }
};

export default isAuthenticated;
