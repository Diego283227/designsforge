import jwt from "jsonwebtoken";
import { NextFunction, Response } from "express";
import axios from "axios";

const isAuthenticated = async (req: any, res: Response, next: NextFunction) => {
  try {
    const token =
      req.cookies?.access_token || req.headers?.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "No autorizado! token es requerido" });
    }

    // Verificar token localmente (más eficiente)
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as {
      id: string;
      role: "usuario" | "vendedor";
    };

    if (!decoded) {
      return res.status(401).json({
        message: "No autorizado! Token invalido.",
      });
    }

    // Validar usuario llamando al auth-service
    try {
      const response = await axios.get(
        `${
          process.env.AUTH_SERVICE_URL || "http://localhost:6001"
        }/api/validate-user/${decoded.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 5000, // 5 segundos timeout
        }
      );

      req.user = response.data.user;
      return next();
    } catch (authServiceError: any) {
      // Si el auth-service no responde o usuario no existe
      if (authServiceError.response?.status === 404) {
        return res.status(401).json({
          message: "Cuenta no encontrada!",
        });
      }

      // Error de comunicación con auth-service
      return res.status(503).json({
        message: "Servicio de autenticación no disponible",
      });
    }
  } catch (error) {
    return res.status(401).json({
      message: "No autorizado! Token invalido o expirado.",
    });
  }
};

export default isAuthenticated;
