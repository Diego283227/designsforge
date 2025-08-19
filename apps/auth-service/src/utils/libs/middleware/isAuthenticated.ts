import jwt from "jsonwebtoken";

import { NextFunction, Response } from "express";
import prisma from "../prisma";


const isAuthenticated = async (req: any, res: Response, next: NextFunction) => {
  try {
    const token =
      req.cookies?.access_token || req.headers?.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "No autorizado! token es requerido" });
    }

    //   Verificar token

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as {
      id: string;
      role: "usuario" | "vendedor";
    };

    if (!decoded) {
      return res.status(401).json({
        message: "No autorizado! Token invalido.",
      });
    }

    const account = await prisma.users.findUnique({
      where: { id: decoded.id },
    });

    req.user = account;

    if (!account) {
      return res.status(401).json({
        message: "Cuenta no encontrada!",
      });
    }
    return next();
  } catch (error) {
    return res.status(401).json({
      message: "No autorizado! Token invalido o expirado.",
    });
  }
};

export default isAuthenticated;
