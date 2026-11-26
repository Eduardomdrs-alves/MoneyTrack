import { ExpensesByCategory } from "@/components/organisms/expenses-by-category";
import { MonthSwitcher } from "@/components/molecules/month-switcher";
import { MonthlyChart } from "@/components/organisms/monthly-chart";
import { RecentTransactions } from "@/components/organisms/recent-transactions";
import { SummaryCards } from "@/components/organisms/summary-cards";
import { PageHeader } from "@/components/molecules/page-header";
import { firstName, formatMonth } from "@/lib/format";
import type { DashboardSummary } from "@/types";

interface DashboardTemplateProps {
  userName?: string | null;
  month: string;
  summary: DashboardSummary;
}

export function DashboardTemplate({ userName, month, summary }: DashboardTemplateProps) {
  return (
    <>
      <PageHeader
        title={`Olá, ${firstName(userName)}!`}
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
