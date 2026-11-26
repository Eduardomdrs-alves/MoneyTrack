import { PageHeader } from "@/components/molecules/page-header";
import { NewTransactionButton } from "@/components/molecules/new-transaction-button";
import { TransactionsView } from "@/components/organisms/transactions-view";

export function TransactionsTemplate() {
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
