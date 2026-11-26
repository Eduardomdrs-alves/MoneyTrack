import { z } from "zod";
import { isValidISODate } from "@/lib/format";

/**
 * Schemas Zod: a MESMA regra de validação é usada no servidor
 * (API Routes / Server Actions) e os tipos são inferidos a partir dela.
 */

const objectId = (message: string) => z.string().regex(/^[a-f\d]{24}$/i, message);

const email = z.string().trim().toLowerCase().pipe(z.email("Informe um e-mail válido"));

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Informe seu nome (mínimo 2 caracteres)")
      .max(60, "Nome muito longo"),
    email,
    // O bcrypt considera no máximo 72 bytes
    password: z
      .string()
      .min(6, "A senha deve ter pelo menos 6 caracteres")
      .max(72, "A senha deve ter no máximo 72 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não conferem",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Informe sua senha"),
});

export const transactionSchema = z.object({
  description: z
    .string()
    .trim()
    .min(2, "A descrição deve ter pelo menos 2 caracteres")
    .max(100, "Máximo de 100 caracteres"),
  amount: z.coerce
    .number({ message: "Informe um valor numérico" })
    .positive("O valor deve ser maior que zero")
    .max(1_000_000_000, "Valor muito alto")
    .transform((value) => Math.round(value * 100) / 100),
  type: z.enum(["income", "expense"], { message: "Tipo inválido" }),
  categoryId: objectId("Selecione uma categoria"),
  date: z.string().refine(isValidISODate, "Informe uma data válida"),
  notes: z.string().trim().max(500, "Máximo de 500 caracteres").optional().default(""),
});

export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "O nome deve ter pelo menos 2 caracteres")
    .max(40, "Máximo de 40 caracteres"),
  type: z.enum(["income", "expense"], { message: "Tipo inválido" }),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Cor inválida"),
});

/** Query string aceita por GET /api/transactions */
export const transactionFiltersSchema = z.object({
  month: z
    .string()
    .regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Mês inválido")
    .optional(),
  type: z.enum(["all", "income", "expense"]).optional(),
  categoryId: z.union([z.literal("all"), objectId("Categoria inválida")]).optional(),
});

export type RegisterSchema = z.infer<typeof registerSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
export type TransactionSchema = z.infer<typeof transactionSchema>;
export type CategorySchema = z.infer<typeof categorySchema>;
export type TransactionFiltersSchema = z.infer<typeof transactionFiltersSchema>;

/** Converte um ZodError em { campo: [mensagens] } */
export function getFieldErrors(error: z.ZodError): Record<string, string[] | undefined> {
  return z.flattenError(error).fieldErrors as Record<string, string[] | undefined>;
}
