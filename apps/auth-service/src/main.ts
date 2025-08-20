import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import router from "./routes/auth.routes";
import { errorMiddleware } from "@packages/error-handler/error-middleware";

const app = express();

// Security headers
app.use(
  helmet({
    crossOriginEmbedderPolicy: false, // Para compatibilidad con desarrollo
  })
);

// Logging
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// CORS mejorado
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://designsforge.com", "https://app.designsforge.com"]
        : [
            "http://localhost:4200",
            "http://localhost:3000",
            "http://localhost:8080",
          ],
    allowedHeaders: ["Authorization", "Content-Type", "X-Request-ID"],
    credentials: true,
    maxAge: 86400, // Cache preflight por 24 horas
  })
);

// Body parsing con límites seguros
app.use(express.json({ limit: "1mb" })); // Más restrictivo para auth
app.use(express.urlencoded({ limit: "1mb", extended: true }));
app.use(cookieParser());

// Trust proxy para load balancers
app.set("trust-proxy", 1);

// Rate limiting específico para auth
const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // 10 intentos por IP (más restrictivo que gateway)
  message: {
    error: "Demasiados intentos de autenticación desde esta IP",
    retryAfter: "15 minutos",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting para health checks
    return req.path === "/health" || req.path === "/";
  },
});

app.use(authRateLimit);

// Health check endpoint
app.get("/health", async (req, res) => {
  try {
    // Test database connection
    const { PrismaClient } = require("@prisma/client");
    const prisma = new PrismaClient();

    await prisma.$queryRaw`SELECT 1`;
    await prisma.$disconnect();

    res.json({
      status: "healthy",
      service: "auth-service",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.SERVICE_VERSION || "1.0.0",
      checks: {
        database: "connected",
      },
    });
  } catch (error) {
    res.status(503).json({
      status: "unhealthy",
      service: "auth-service",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      checks: {
        database: "disconnected",
      },
      error: "Database connection failed",
    });
  }
});

// Ready check para Kubernetes
app.get("/ready", async (req, res) => {
  try {
    const { PrismaClient } = require("@prisma/client");
    const prisma = new PrismaClient();

    await prisma.$queryRaw`SELECT 1`;
    await prisma.$disconnect();

    res.json({ status: "ready" });
  } catch (error) {
    res.status(503).json({
      status: "not ready",
      reason: "Database unavailable",
    });
  }
});

// Root endpoint mejorado
app.get("/", (req, res) => {
  res.json({
    service: "DesignsForge Auth Service",
    version: process.env.SERVICE_VERSION || "1.0.0",
    status: "running",
    timestamp: new Date().toISOString(),
    endpoints: {
      health: "/health",
      ready: "/ready",
      api: "/api",
    },
  });
});

// Request ID middleware para trazabilidad
app.use((req, res, next) => {
  (req as any).id =
    req.headers["x-request-id"] ||
    `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  res.setHeader("X-Request-ID", (req as any).id);
  next();
});

// Rutas de API
app.use("/api", router);

// Error handling middleware (debe ir al final)
app.use(errorMiddleware);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Endpoint not found",
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
  });
});

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  console.log(`Received ${signal}, shutting down gracefully...`);

  server.close(async () => {
    console.log("HTTP server closed");

    try {
      // Cerrar conexiones de Prisma
      const { PrismaClient } = require("@prisma/client");
      const prisma = new PrismaClient();
      await prisma.$disconnect();
      console.log("Database connections closed");
    } catch (error) {
      console.error("Error closing database connections:", error);
    }

    process.exit(0);
  });

  // Force close after 10 seconds
  setTimeout(() => {
    console.error(
      "Could not close connections in time, forcefully shutting down"
    );
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

const port = process.env.PORT || 6001;
const server = app.listen(port, () => {
  console.log(`Auth Service running on http://localhost:${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`Health check: http://localhost:${port}/health`);
  console.log(`API endpoints: http://localhost:${port}/api`);
});

server.on("error", (err) => {
  console.error("Auth Service startup error:", err);
  process.exit(1);
});
