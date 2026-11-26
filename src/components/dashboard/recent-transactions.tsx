import Link from "next/link";
import { ArrowRight, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { NewTransactionButton } from "@/components/transactions/new-transaction-button";
import { TransactionListItem } from "@/components/transactions/transaction-list-item";
import type { Transaction } from "@/types";

/** Últimos lançamentos do mês (Server Component) */
export function RecentTransactions({ transactions }: { transactions: Transaction[] }) {
  return (
    <Card className="gap-0 pb-2">
      <CardHeader className="pb-4">
        <CardTitle>Últimas transações</CardTitle>
        <CardDescription>Os lançamentos mais recentes do mês</CardDescription>
        <CardAction>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/transacoes">
              Ver todas <ArrowRight />
            </Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="px-0">
        {transactions.length === 0 ? (
          <EmptyState
            icon={Receipt}
            title="Nenhuma transação neste mês"
            description="Registre sua primeira receita ou despesa para acompanhar seu saldo."
          >
            <NewTransactionButton variant="outline" />
          </EmptyState>
        ) : (
          <ul className="divide-y border-t">
            {transactions.map((transaction) => (
              <TransactionListItem key={transaction.id} transaction={transaction} />
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
