import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryDetailTemplate } from "@/components/templates/category-detail-template";
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
    <CategoryDetailTemplate
      category={category}
      transactions={transactions}
      total={total}
      monthTotal={monthTotal}
    />
  );
}
