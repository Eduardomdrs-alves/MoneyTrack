import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock, FileText, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Money } from "@/components/shared/money";
import { TypeBadge } from "@/components/shared/type-badge";
import { TransactionDetailActions } from "@/components/transactions/transaction-detail-actions";
import { formatDate, formatDateTime } from "@/lib/format";
import { requireUser } from "@/lib/session";
import { getTransaction } from "@/services/transaction.service";

/** Rota dinâmica: /transacoes/[id] — o [id] vem da URL (params é uma Promise no Next 16) */
type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const user = await requireUser();
  const { id } = await params;
  // getTransaction usa React.cache: a página reaproveita este resultado
  const transaction = await getTransaction(user.id, id);
  return { title: transaction?.description ?? "Transação não encontrada" };
}

export default async function TransactionDetailPage({ params }: Props) {
  const user = await requireUser();
  const { id } = await params;
  const transaction = await getTransaction(user.id, id);

  // Inexistente OU de outro usuário -> 404 (não revelamos que o registro existe)
  if (!transaction) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Button variant="ghost" size="sm" asChild className="-ml-2">
        <Link href="/transacoes">
          <ArrowLeft /> Voltar para transações
        </Link>
      </Button>

      <Card>
        <CardHeader className="gap-3">
          <TypeBadge type={transaction.type} />
          <CardTitle className="text-2xl">{transaction.description}</CardTitle>
          <Money value={transaction.amount} type={transaction.type} className="text-3xl font-semibold" />
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2">
            <Detail icon={Tag} label="Categoria">
              {transaction.category ? (
                <Link
                  href={`/categorias/${transaction.category.id}`}
                  className="inline-flex items-center gap-2 hover:underline"
                >
                  <span
                    className="size-2.5 rounded-full"
                    style={{ backgroundColor: transaction.category.color }}
                    aria-hidden
                  />
                  {transaction.category.name}
                </Link>
              ) : (
                "Sem categoria"
              )}
            </Detail>
            <Detail icon={CalendarDays} label="Data">
              {formatDate(transaction.date, "long")}
            </Detail>
            <Detail icon={FileText} label="Observações" className="sm:col-span-2">
              {transaction.notes || <span className="text-muted-foreground">Nenhuma observação</span>}
            </Detail>
            <Detail icon={Clock} label="Última atualização" className="sm:col-span-2">
              {formatDateTime(transaction.updatedAt)}
            </Detail>
          </dl>

          <div className="mt-8 flex flex-wrap gap-2 border-t pt-6">
            <TransactionDetailActions transaction={transaction} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Detail({
  icon: Icon,
  label,
  children,
  className,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <dt className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <Icon className="size-3.5" /> {label}
      </dt>
      <dd className="mt-1 text-sm">{children}</dd>
    </div>
  );
}
