import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { NewTransactionButton } from "@/components/transactions/new-transaction-button";
import { TransactionsView } from "@/components/transactions/transactions-view";

export const metadata: Metadata = { title: "Transações" };

/**
 * A página em si é um Server Component (cabeçalho estático).
 * A listagem interativa (filtros + React Query) fica no Client Component <TransactionsView />.
 */
export default function TransactionsPage() {
  return (
    <>
      <PageHeader title="Transações" description="Todas as suas receitas e despesas, mês a mês.">
        <NewTransactionButton type="income" label="Nova receita" variant="outline" />
        <NewTransactionButton type="expense" label="Nova despesa" />
      </PageHeader>
      <TransactionsView />
    </>
  );
}
