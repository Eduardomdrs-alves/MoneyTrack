import type { Metadata } from "next";
import { ExpensesByCategory } from "@/components/dashboard/expenses-by-category";
import { MonthSwitcher } from "@/components/dashboard/month-switcher";
import { MonthlyChart } from "@/components/dashboard/monthly-chart";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { PageHeader } from "@/components/shared/page-header";
import { currentMonth, firstName, formatMonth, isValidMonth } from "@/lib/format";
import { requireUser } from "@/lib/session";
import { getDashboardSummary } from "@/services/dashboard.service";

export const metadata: Metadata = { title: "Dashboard" };

/**
 * Dashboard (Server Component): busca os dados direto no banco, no servidor,
 * e entrega HTML pronto. Só o gráfico (Recharts) é Client Component.
 */
export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ mes?: string }>;
}) {
  const user = await requireUser();
  const { mes } = await searchParams;
  const month = isValidMonth(mes) ? mes : currentMonth();

  const summary = await getDashboardSummary(user.id, month);

  return (
    <>
      <PageHeader
        title={`Olá, ${firstName(user.name)}!`}
        description={`Resumo financeiro de ${formatMonth(month)}`}
      >
        <MonthSwitcher month={month} basePath="/dashboard" />
      </PageHeader>

      <SummaryCards summary={summary} />

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <MonthlyChart data={summary.monthly} />
        </div>
        <div className="lg:col-span-2">
          <ExpensesByCategory data={summary.expensesByCategory} />
        </div>
      </div>

      <RecentTransactions transactions={summary.recent} />
    </>
  );
}
