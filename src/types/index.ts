/**
 * Tipos de domínio compartilhados entre servidor e cliente.
 * Os documentos do Mongoose são sempre convertidos para estes tipos
 * "planos" (DTOs) antes de saírem da camada de serviço.
 */

export type TransactionType = "income" | "expense";

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  color: string;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  /** Data no formato ISO (YYYY-MM-DD) */
  date: string;
  notes: string;
  category: Category | null;
  createdAt: string;
  updatedAt: string;
}

/** Filtros da listagem de transações (estado de UI guardado no Zustand) */
export interface TransactionFilters {
  /** Mês no formato YYYY-MM */
  month: string;
  type: TransactionType | "all";
  categoryId: string | "all";
  search: string;
}

/** Corpo aceito pela API ao criar/editar uma transação */
export interface TransactionInput {
  description: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  date: string;
  notes?: string;
}

export interface CategoryInput {
  name: string;
  type: TransactionType;
  color: string;
}

export interface CategoryTotal {
  categoryId: string;
  name: string;
  color: string;
  total: number;
}

export interface MonthlyTotal {
  /** YYYY-MM */
  month: string;
  income: number;
  expense: number;
}

export interface DashboardSummary {
  month: string;
  income: number;
  expense: number;
  balance: number;
  transactionCount: number;
  expensesByCategory: CategoryTotal[];
  monthly: MonthlyTotal[];
  recent: Transaction[];
}

/** Retorno padrão das Server Actions */
export type ActionResult<T = undefined> =
  | { success: true; data?: T; message?: string }
  | { success: false; error: string; fieldErrors?: Record<string, string[] | undefined> };

/** Formato de erro devolvido pelas API Routes */
export interface ApiErrorBody {
  error: string;
  fieldErrors?: Record<string, string[] | undefined>;
}
