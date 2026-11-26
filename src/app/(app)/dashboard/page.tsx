import type { Metadata } from "next";
import { DashboardTemplate } from "@/components/templates/dashboard-template";
import { currentMonth, isValidMonth } from "@/lib/format";
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

  return <DashboardTemplate userName={user.name} month={month} summary={summary} />;
}
