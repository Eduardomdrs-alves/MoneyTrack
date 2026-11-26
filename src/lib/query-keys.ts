import type { TransactionFilters } from "@/types";

/**
 * Chaves do React Query centralizadas.
 * Invalidar `queryKeys.transactions.all` atualiza TODAS as listas de transações
 * (qualquer combinação de filtros) de uma só vez.
 */
export const queryKeys = {
  transactions: {
    all: ["transactions"] as const,
    list: (filters: Omit<TransactionFilters, "search">) => ["transactions", "list", filters] as const,
  },
  categories: {
    all: ["categories"] as const,
  },
};
