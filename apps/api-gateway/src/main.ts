import express from "express";
import cors from "cors";
import proxy from "express-http-proxy";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:4200", "http://localhost:3000"],
    allowedHeaders: ["Authorization", "Content-Type"],
    credentials: true,
  })
);

app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());
app.set("trust-proxy", 1);

// Rate limiting mejorado
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    error: "Demasiadas solicitudes. Intenta nuevamente en 15 minutos.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting específico para autenticación
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    error: "Demasiados intentos de autenticación.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Health check con fetch nativo
app.get("/gateway-health", async (req, res) => {
  try {
    // Fetch nativo de Node.js 22 - sin imports
    const response = await fetch("http://localhost:6001/health", {
      method: "GET",
      signal: AbortSignal.timeout(5000), // Funciona perfecto en Node.js 22
    });

    if (response.ok) {
      res.json({
        status: "healthy",
        services: { auth: "up" },
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
      });
    } else {
      res.status(503).json({
        status: "degraded",
        services: { auth: "down" },
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    res.status(503).json({
      status: "unhealthy",
      services: { auth: "down" },
      error: "Auth service unavailable",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  }
});

// Rate limiting para rutas de auth específicas
app.use("/api/auth/login-user", authLimiter);
app.use("/api/auth/user-registration", authLimiter);

// Proxy con error handling
app.use(
  "/",
  proxy("http://localhost:6001", {
    timeout: 30000,
    proxyErrorHandler: function (err, res, next) {
      console.error("Proxy error:", err.message);

      res.status(503).json({
        error: "Servicio temporalmente no disponible",
        message: "El servicio de autenticación no está disponible",
        retryAfter: 30,
      });
    },
  })
);

const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
  console.log(`API Gateway corriendo en http://localhost:${port}`);
  console.log(`Health check: http://localhost:${port}/gateway-health`);
});

server.on("error", (err) => {
  console.error("Error del servidor:", err);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("Cerrando servidor...");
  server.close(() => {
    console.log("Servidor cerrado");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("Cerrando servidor...");
  server.close(() => {
    console.log("Servidor cerrado");
    process.exit(0);
  });
});
