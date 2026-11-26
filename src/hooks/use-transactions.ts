"use client";

import { useRouter } from "next/navigation";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { transactionsApi } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import type { Transaction, TransactionFilters, TransactionInput } from "@/types";

/**
 * Hooks de dados das transações com TanStack Query.
 * - useQuery: cache, deduplicação de requisições, refetch ao focar a janela
 * - useMutation: grava via API Route e invalida o cache -> a lista se atualiza sozinha
 * Nada de useEffect + useState para buscar dados.
 */

export function useTransactions(filters: Omit<TransactionFilters, "search">) {
  return useQuery({
    queryKey: queryKeys.transactions.list(filters),
    queryFn: () => transactionsApi.list(filters),
    // Mantém a lista anterior visível enquanto busca o novo filtro (sem "piscar")
    placeholderData: keepPreviousData,
  });
}

export function useSaveTransaction() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ id, input }: { id?: string; input: TransactionInput }) =>
      id ? transactionsApi.update(id, input) : transactionsApi.create(input),
    onSuccess: (_data, { id }) => {
      toast.success(id ? "Transação atualizada!" : "Transação adicionada!");
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
      // Re-renderiza os Server Components da rota atual (dashboard, detalhes)
      router.refresh();
    },
  });
}

/** Exclusão com atualização otimista: o item some da lista na hora */
export function useDeleteTransaction(options?: { onDeleted?: () => void }) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (id: string) => transactionsApi.remove(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.transactions.all });
      const snapshot = queryClient.getQueriesData<Transaction[]>({
        queryKey: queryKeys.transactions.all,
      });
      queryClient.setQueriesData<Transaction[]>({ queryKey: queryKeys.transactions.all }, (old) =>
        old?.filter((t) => t.id !== id),
      );
      return { snapshot };
    },
    onError: (error, _id, context) => {
      // Desfaz a remoção otimista
      context?.snapshot.forEach(([key, data]) => queryClient.setQueryData(key, data));
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("Transação excluída.");
      if (options?.onDeleted) {
        // Ex.: página de detalhe navega para a listagem (que já busca dados novos)
        options.onDeleted();
      } else {
        router.refresh();
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
    },
  });
}
