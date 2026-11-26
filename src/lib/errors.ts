import { ZodError } from "zod";
import { getFieldErrors } from "@/schemas";

type FieldErrors = Record<string, string[] | undefined>;

/** Erro de domínio com status HTTP associado */
export class AppError extends Error {
  constructor(
    message: string,
    public readonly status: number = 400,
    public readonly fieldErrors?: FieldErrors,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Você precisa estar autenticado.") {
    super(message, 401);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Registro não encontrado.") {
    super(message, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message: string, fieldErrors?: FieldErrors) {
    super(message, 409, fieldErrors);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, fieldErrors?: FieldErrors) {
    super(message, 422, fieldErrors);
  }
}

/** Normaliza qualquer erro em { status, error, fieldErrors } */
export function normalizeError(error: unknown): {
  status: number;
  error: string;
  fieldErrors?: FieldErrors;
} {
  if (error instanceof AppError) {
    return { status: error.status, error: error.message, fieldErrors: error.fieldErrors };
  }
  if (error instanceof ZodError) {
    return { status: 422, error: "Dados inválidos.", fieldErrors: getFieldErrors(error) };
  }
  console.error("[MoneyTrack] Erro inesperado:", error);
  return { status: 500, error: "Erro interno do servidor. Tente novamente." };
}
