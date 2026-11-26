import type { CategoryInput } from "@/types";

export const APP_NAME = "MoneyTrack";

/** Fuso usado para calcular "hoje" e o "mês atual" de forma igual no servidor e no cliente */
export const APP_TIMEZONE = "America/Sao_Paulo";

/** Paleta oferecida ao criar/editar categorias */
export const CATEGORY_COLORS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#10b981",
  "#14b8a6",
  "#0ea5e9",
  "#6366f1",
  "#a855f7",
  "#ec4899",
  "#78716c",
  "#64748b",
] as const;

/** Categorias criadas automaticamente quando um usuário se cadastra */
export const DEFAULT_CATEGORIES: CategoryInput[] = [
  { name: "Alimentação", type: "expense", color: "#f97316" },
  { name: "Moradia", type: "expense", color: "#6366f1" },
  { name: "Transporte", type: "expense", color: "#0ea5e9" },
  { name: "Saúde", type: "expense", color: "#ef4444" },
  { name: "Lazer", type: "expense", color: "#a855f7" },
  { name: "Educação", type: "expense", color: "#eab308" },
  { name: "Compras", type: "expense", color: "#ec4899" },
  { name: "Outros gastos", type: "expense", color: "#64748b" },
  { name: "Salário", type: "income", color: "#10b981" },
  { name: "Freelance", type: "income", color: "#14b8a6" },
  { name: "Investimentos", type: "income", color: "#22c55e" },
  { name: "Outras receitas", type: "income", color: "#78716c" },
];

export const TRANSACTION_TYPE_LABEL = {
  income: "Receita",
  expense: "Despesa",
} as const;
