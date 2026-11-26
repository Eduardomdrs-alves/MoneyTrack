import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Pencil, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryDialog } from "@/components/categories/category-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { Money } from "@/components/shared/money";
import { TypeBadge } from "@/components/shared/type-badge";
import { TransactionListItem } from "@/components/transactions/transaction-list-item";
import { currentMonth } from "@/lib/format";
import { requireUser } from "@/lib/session";
import { getCategory } from "@/services/category.service";
import { listTransactions } from "@/services/transaction.service";

/** Rota dinâmica: /categorias/[id] — detalhes e histórico de uma categoria */
type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const user = await requireUser();
  const { id } = await params;
  const category = await getCategory(user.id, id);
  return { title: category?.name ?? "Categoria não encontrada" };
}

export default async function CategoryDetailPage({ params }: Props) {
  const user = await requireUser();
  const { id } = await params;
  const category = await getCategory(user.id, id);
  if (!category) notFound();

  const transactions = await listTransactions(user.id, { categoryId: category.id });
  const month = currentMonth();
  const total = transactions.reduce((sum, t) => sum + t.amount, 0);
  const monthTotal = transactions
    .filter((t) => t.date.startsWith(month))
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild className="-ml-2">
        <Link href="/categorias">
          <ArrowLeft /> Voltar para categorias
        </Link>
      </Button>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span
            className="flex size-14 shrink-0 items-center justify-center rounded-2xl"
            style={{ backgroundColor: `${category.color}26` }}
            aria-hidden
          >
            <span className="size-5 rounded-full" style={{ backgroundColor: category.color }} />
          </span>
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{category.name}</h1>
            <TypeBadge type={category.type} />
          </div>
        </div>
        <CategoryDialog
          category={category}
          lockType={transactions.length > 0}
          trigger={
            <Button variant="outline">
              <Pencil /> Editar categoria
            </Button>
          }
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Total acumulado" value={<Money value={total} />} />
        <Stat label="Neste mês" value={<Money value={monthTotal} />} />
        <Stat label="Lançamentos" value={transactions.length} />
      </div>

      <Card className="gap-0 pb-2">
        <CardHeader className="pb-4">
          <CardTitle>Histórico</CardTitle>
          <CardDescription>Todas as transações desta categoria</CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          {transactions.length === 0 ? (
            <EmptyState icon={Receipt} title="Nenhuma transação nesta categoria" />
          ) : (
            <ul className="divide-y border-t">
              {transactions.map((transaction) => (
                <TransactionListItem key={transaction.id} transaction={transaction} />
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Card className="py-4">
      <CardContent className="px-4">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-1 text-xl font-semibold tracking-tight">{value}</p>
      </CardContent>
    </Card>
  );
}
