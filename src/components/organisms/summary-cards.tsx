import { ArrowDownRight, ArrowUpRight, Receipt, Wallet } from "lucide-react";
import { Card, CardContent } from "@/components/atoms/card";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { DashboardSummary } from "@/types";

/** Cards de resumo do mês (Server Component — zero JS enviado ao navegador) */
export function SummaryCards({ summary }: { summary: DashboardSummary }) {
  const { balance, income, expense, transactionCount } = summary;
  const savingsRate = income > 0 ? Math.round((balance / income) * 100) : null;

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-[1.5fr_1fr_1fr_0.8fr]">
      {/* Saldo: o número principal da tela */}
      <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary to-emerald-700 text-primary-foreground sm:col-span-2 xl:col-span-1 dark:to-emerald-900">
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium opacity-90">Saldo do mês</p>
            <Wallet className="size-5 opacity-80" aria-hidden />
          </div>
          <p className="text-3xl font-semibold tracking-tight whitespace-nowrap sm:text-4xl xl:text-[2rem]">
            {formatCurrency(balance)}
          </p>
          <p className="text-xs opacity-85">
            {savingsRate === null
              ? "Sem receitas registradas neste mês"
              : savingsRate >= 0
                ? `Você guardou ${savingsRate}% do que recebeu`
                : "Você gastou mais do que recebeu"}
          </p>
        </CardContent>
      </Card>

      <StatCard
        label="Receitas"
        value={formatCurrency(income)}
        icon={ArrowUpRight}
        iconClass="bg-income/10 text-income"
      />
      <StatCard
        label="Despesas"
        value={formatCurrency(expense)}
        icon={ArrowDownRight}
        iconClass="bg-expense/10 text-expense"
      />
      <StatCard
        label="Lançamentos"
        value={String(transactionCount)}
        icon={Receipt}
        iconClass="bg-accent text-accent-foreground"
      />
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  iconClass,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  iconClass: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4">
        <span className={cn("flex size-11 shrink-0 items-center justify-center rounded-xl", iconClass)}>
          <Icon className="size-5" />
        </span>
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="truncate text-xl font-semibold tracking-tight">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
