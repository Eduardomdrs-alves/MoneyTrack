"use client";

import { useDeferredValue, useMemo } from "react";
import { AlertCircle, Loader2, Receipt, RotateCcw } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { Money } from "@/components/shared/money";
import { NewTransactionButton } from "@/components/transactions/new-transaction-button";
import { TransactionFilters } from "@/components/transactions/transaction-filters";
import { TransactionListItem } from "@/components/transactions/transaction-list-item";
import { TransactionRowActions } from "@/components/transactions/transaction-row-actions";
import { useTransactions } from "@/hooks/use-transactions";
import { capitalizeFirst, formatMonth } from "@/lib/format";
import { useFiltersStore } from "@/store/filters-store";

/**
 * Listagem de transações (Client Component).
 * - Filtros de UI vêm do Zustand
 * - Dados vêm do React Query (cache por combinação de filtros)
 * - A busca textual é feita em memória sobre os dados já carregados
 */
export function TransactionsView() {
  const { month, type, categoryId, search } = useFiltersStore(
    useShallow((s) => ({ month: s.month, type: s.type, categoryId: s.categoryId, search: s.search })),
  );
  const query = useTransactions({ month, type, categoryId });

  // useDeferredValue mantém a digitação fluida mesmo com listas grandes
  const deferredSearch = useDeferredValue(search);

  const transactions = useMemo(() => {
    const data = query.data ?? [];
    const term = deferredSearch.trim().toLowerCase();
    if (!term) return data;
    return data.filter(
      (t) =>
        t.description.toLowerCase().includes(term) ||
        t.category?.name.toLowerCase().includes(term),
    );
  }, [query.data, deferredSearch]);

  const totals = useMemo(
    () =>
      transactions.reduce(
        (acc, t) => {
          acc[t.type] += t.amount;
          return acc;
        },
        { income: 0, expense: 0 },
      ),
    [transactions],
  );

  return (
    <div className="space-y-6">
      <TransactionFilters />

      <div className="grid grid-cols-3 gap-3">
        <SummaryPill label="Receitas" value={<Money value={totals.income} type="income" />} />
        <SummaryPill label="Despesas" value={<Money value={totals.expense} type="expense" />} />
        <SummaryPill label="Saldo" value={<Money value={totals.income - totals.expense} />} />
      </div>

      <Card className="gap-0 py-0">
        <CardHeader className="flex flex-row items-center justify-between border-b px-4 py-4 sm:px-6 [.border-b]:pb-4">
          <CardTitle className="text-base">
            {capitalizeFirst(formatMonth(month))}
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              {query.isSuccess && `${transactions.length} lançamento(s)`}
            </span>
          </CardTitle>
          {query.isFetching && !query.isPending && (
            <Loader2 className="size-4 animate-spin text-muted-foreground" aria-label="Atualizando" />
          )}
        </CardHeader>

        <CardContent className="p-0">
          {query.isPending ? (
            <ListSkeleton />
          ) : query.isError ? (
            <div className="p-4 sm:p-6">
              <Alert variant="destructive">
                <AlertCircle />
                <AlertTitle>Não foi possível carregar as transações</AlertTitle>
                <AlertDescription>
                  <p>{query.error.message}</p>
                  <Button variant="outline" size="sm" className="mt-2" onClick={() => query.refetch()}>
                    <RotateCcw /> Tentar novamente
                  </Button>
                </AlertDescription>
              </Alert>
            </div>
          ) : transactions.length === 0 ? (
            <EmptyState
              icon={Receipt}
              title="Nenhuma transação encontrada"
              description={
                search
                  ? "Nenhum lançamento corresponde à busca. Tente outro termo."
                  : "Não há lançamentos para os filtros selecionados."
              }
            >
              <NewTransactionButton variant="outline" />
            </EmptyState>
          ) : (
            <ul className="divide-y" aria-busy={query.isFetching}>
              {transactions.map((transaction) => (
                <TransactionListItem
                  key={transaction.id}
                  transaction={transaction}
                  actions={<TransactionRowActions transaction={transaction} />}
                />
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function SummaryPill({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-card px-3 py-2.5 sm:px-4 sm:py-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="mt-0.5 truncate text-sm sm:text-base">{value}</div>
    </div>
  );
}

function ListSkeleton() {
  return (
    <ul className="divide-y" aria-label="Carregando transações">
      {Array.from({ length: 5 }).map((_, index) => (
        <li key={index} className="flex items-center gap-3 px-4 py-3 sm:px-6">
          <Skeleton className="size-9 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/4" />
          </div>
          <Skeleton className="h-4 w-20" />
        </li>
      ))}
    </ul>
  );
}
