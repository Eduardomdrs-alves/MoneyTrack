"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { capitalizeFirst, formatCompactCurrency, formatCurrency, formatMonth } from "@/lib/format";
import type { MonthlyTotal } from "@/types";

const SERIES = [
  { key: "income", label: "Receitas", color: "var(--color-chart-income)" },
  { key: "expense", label: "Despesas", color: "var(--color-chart-expense)" },
] as const;

/**
 * Gráfico de barras agrupadas (Client Component: o Recharts precisa do DOM).
 * Recebe os dados já calculados pelo Server Component via props.
 */
export function MonthlyChart({ data }: { data: MonthlyTotal[] }) {
  const chartData = data.map((item) => ({ ...item, label: formatMonth(item.month, "short") }));

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1.5">
          <CardTitle>Receitas x despesas</CardTitle>
          <CardDescription>Últimos {data.length} meses</CardDescription>
        </div>
        {/* Legenda: identidade nunca depende só da cor */}
        <ul className="flex gap-4 text-sm text-muted-foreground">
          {SERIES.map((series) => (
            <li key={series.key} className="flex items-center gap-2">
              <span className="size-2.5 rounded-sm" style={{ backgroundColor: series.color }} aria-hidden />
              {series.label}
            </li>
          ))}
        </ul>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full" aria-hidden>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barGap={2} barCategoryGap="24%" margin={{ top: 8, right: 4, left: 4, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="var(--chart-grid)" strokeWidth={1} />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={72}
                tickFormatter={(value: number) => formatCompactCurrency(value)}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              />
              <Tooltip
                cursor={{ fill: "var(--muted)", opacity: 0.6 }}
                content={(props) => <ChartTooltip active={props.active} payload={props.payload} />}
              />
              {SERIES.map((series) => (
                <Bar
                  key={series.key}
                  dataKey={series.key}
                  name={series.label}
                  fill={series.color}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={24}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Versão em tabela para leitores de tela */}
        <table className="sr-only">
          <caption>Receitas e despesas por mês</caption>
          <thead>
            <tr>
              <th scope="col">Mês</th>
              <th scope="col">Receitas</th>
              <th scope="col">Despesas</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.month}>
                <th scope="row">{formatMonth(item.month)}</th>
                <td>{formatCurrency(item.income)}</td>
                <td>{formatCurrency(item.expense)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

type ChartRow = MonthlyTotal & { label: string };

interface ChartTooltipProps {
  active?: boolean;
  payload?: ReadonlyArray<{ payload?: unknown }>;
}

function ChartTooltip({ active, payload }: ChartTooltipProps) {
  if (!active || !payload?.length || !payload[0].payload) return null;
  const row = payload[0].payload as ChartRow;
  const balance = row.income - row.expense;

  return (
    <div className="min-w-44 rounded-lg border bg-popover px-3 py-2 text-sm text-popover-foreground shadow-md">
      <p className="mb-1.5 font-medium">{capitalizeFirst(formatMonth(row.month))}</p>
      {SERIES.map((series) => (
        <div key={series.key} className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-2 text-muted-foreground">
            <span className="size-2.5 rounded-sm" style={{ backgroundColor: series.color }} aria-hidden />
            {series.label}
          </span>
          <span className="tabular font-medium">{formatCurrency(row[series.key])}</span>
        </div>
      ))}
      <div className="mt-1.5 flex items-center justify-between gap-4 border-t pt-1.5">
        <span className="text-muted-foreground">Saldo</span>
        <span className="tabular font-medium">{formatCurrency(balance)}</span>
      </div>
    </div>
  );
}
