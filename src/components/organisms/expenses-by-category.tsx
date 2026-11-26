import Link from "next/link";
import { PieChart } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/atoms/card";
import { EmptyState } from "@/components/molecules/empty-state";
import { formatCurrency } from "@/lib/format";
import type { CategoryTotal } from "@/types";

const MAX_ROWS = 6;

/**
 * Despesas por categoria como lista de barras horizontais (Server Component).
 * Barras horizontais comparam tamanhos melhor que pizza e não precisam de JS.
 * Acima de 6 categorias, o restante é agrupado em "Outras".
 */
export function ExpensesByCategory({ data }: { data: CategoryTotal[] }) {
  const total = data.reduce((sum, item) => sum + item.total, 0);

  const rows =
    data.length > MAX_ROWS
      ? [
          ...data.slice(0, MAX_ROWS - 1),
          {
            categoryId: "others",
            name: "Outras",
            color: "#94a3b8",
            total: data.slice(MAX_ROWS - 1).reduce((sum, item) => sum + item.total, 0),
          },
        ]
      : data;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Gastos por categoria</CardTitle>
        <CardDescription>Para onde foi o seu dinheiro neste mês</CardDescription>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <EmptyState icon={PieChart} title="Sem despesas no mês" className="py-8" />
        ) : (
          <ul className="space-y-4">
            {rows.map((item) => {
              const share = total > 0 ? (item.total / total) * 100 : 0;
              const label = (
                <span className="flex min-w-0 items-center gap-2">
                  <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: item.color }} aria-hidden />
                  <span className="truncate">{item.name}</span>
                </span>
              );
              return (
                <li key={item.categoryId} className="space-y-1.5">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    {item.categoryId === "others" ? (
                      label
                    ) : (
                      <Link href={`/categorias/${item.categoryId}`} className="min-w-0 hover:underline">
                        {label}
                      </Link>
                    )}
                    <span className="shrink-0 tabular">
                      <span className="font-medium">{formatCurrency(item.total)}</span>
                      <span className="ml-2 inline-block w-10 text-right text-xs text-muted-foreground">
                        {Math.round(share)}%
                      </span>
                    </span>
                  </div>
                  <div
                    className="h-2 overflow-hidden rounded-full bg-muted"
                    role="meter"
                    aria-label={`${item.name}: ${Math.round(share)}% das despesas`}
                    aria-valuenow={Math.round(share)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${Math.max(share, 1)}%`, backgroundColor: item.color }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
