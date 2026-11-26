import { Plus } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { PageHeader } from "@/components/molecules/page-header";
import { CategoryDialog } from "@/components/organisms/category-dialog";
import { CategoryGroup } from "@/components/organisms/category-group";
import type { CategoryWithUsage } from "@/services/category.service";
import type { TransactionType } from "@/types";

export function CategoriesTemplate({ categories }: { categories: CategoryWithUsage[] }) {
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
