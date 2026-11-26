import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TransactionDetailTemplate } from "@/components/templates/transaction-detail-template";
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

  return <TransactionDetailTemplate transaction={transaction} />;
}
