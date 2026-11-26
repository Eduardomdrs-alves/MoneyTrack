import Link from "next/link";
import { Plus, Tags } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/atoms/card";
import { CategoryActions } from "@/components/organisms/category-actions";
import { CategoryDialog } from "@/components/organisms/category-dialog";
import { EmptyState } from "@/components/molecules/empty-state";
import { formatCurrency } from "@/lib/format";
import type { TransactionType } from "@/types";
import type { CategoryWithUsage } from "@/services/category.service";

export function CategoryGroup({
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
