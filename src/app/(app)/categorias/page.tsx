import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Tags } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryActions } from "@/components/categories/category-actions";
import { CategoryDialog } from "@/components/categories/category-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { formatCurrency } from "@/lib/format";
import { requireUser } from "@/lib/session";
import { listCategoriesWithUsage, type CategoryWithUsage } from "@/services/category.service";
import type { TransactionType } from "@/types";

export const metadata: Metadata = { title: "Categorias" };

/**
 * Categorias: Server Component que lê direto do banco.
 * As mutações usam Server Actions + revalidatePath("/categorias"),
 * então esta lista é re-renderizada no servidor automaticamente após cada alteração.
 */
export default async function CategoriesPage() {
  const user = await requireUser();
  const categories = await listCategoriesWithUsage(user.id);

  const groups: { type: TransactionType; title: string; description: string }[] = [
    { type: "expense", title: "Despesas", description: "Para onde o dinheiro vai" },
    { type: "income", title: "Receitas", description: "De onde o dinheiro vem" },
  ];

  return (
    <>
      <PageHeader title="Categorias" description="Organize seus lançamentos do seu jeito.">
        <CategoryDialog
          trigger={
            <Button>
              <Plus /> Nova categoria
            </Button>
          }
        />
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-2">
        {groups.map((group) => (
          <CategoryGroup
            key={group.type}
            {...group}
            categories={categories.filter((c) => c.type === group.type)}
          />
        ))}
      </div>
    </>
  );
}

function CategoryGroup({
  type,
  title,
  description,
  categories,
}: {
  type: TransactionType;
  title: string;
  description: string;
  categories: CategoryWithUsage[];
}) {
  return (
    <Card className="gap-0 pb-2">
      <CardHeader className="pb-4">
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {description} · {categories.length} categoria(s)
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        {categories.length === 0 ? (
          <EmptyState icon={Tags} title="Nenhuma categoria">
            <CategoryDialog
              defaultType={type}
              trigger={
                <Button variant="outline" size="sm">
                  <Plus /> Criar categoria
                </Button>
              }
            />
          </EmptyState>
        ) : (
          <ul className="divide-y border-t">
            {categories.map((category) => (
              <li key={category.id} className="flex items-center gap-3 px-6 py-3">
                <span
                  className="flex size-9 shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: `${category.color}26` }}
                  aria-hidden
                >
                  <span className="size-3 rounded-full" style={{ backgroundColor: category.color }} />
                </span>
                <div className="min-w-0 flex-1">
                  <Link href={`/categorias/${category.id}`} className="block truncate font-medium hover:underline">
                    {category.name}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {category.transactionCount === 0
                      ? "Sem lançamentos"
                      : `${category.transactionCount} lançamento(s) · ${formatCurrency(category.total)}`}
                  </p>
                </div>
                <CategoryActions
                  category={{ id: category.id, name: category.name, type: category.type, color: category.color }}
                  transactionCount={category.transactionCount}
                />
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
