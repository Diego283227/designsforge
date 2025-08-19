export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: any;

  constructor(
    message: string,
    statusCode: number,
    isOperational = true,
    details?: any
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;
    Error.captureStackTrace(this);
  }
}

// Error no econtrado

export class NotFoundError extends AppError {
  constructor(message = "Recurso no Encontrado") {
    super(message, 404);
  }
}

export class ValidationError extends AppError {
  constructor(message = "Peticion Invalida", details?: any) {
    super(message, 400, true, details);
  }
}

// Error de autenticacion

export class AuthError extends AppError {
  constructor(message = "No Autorizado") {
    super(message, 401);
  }
}

// Error permisos insuficientes

export class ForbiddenError extends AppError {
  constructor(message = "Acceso no permitido") {
    super(message, 403);
  }
}

// Error en la base de datos

export class DatabaseError extends AppError {
  constructor(message = "Error en la Base de Datos", details?: any) {
    super(message, 500, true, details);
  }
}

// Error al exceder los limites de la API

export class RateLimitError extends AppError {
  constructor(message = "Demasiadas solicitudes. Intenta mas tarde!") {
    super(message, 429);
  }
}
