import { Logo } from "@/components/atoms/logo";
import { SidebarNav } from "@/components/molecules/sidebar-nav";

/** Menu lateral fixo (desktop). Server Component: só a navegação é interativa. */
export function AppSidebar() {
  return (
    <aside className="sticky top-0 hidden h-svh w-64 shrink-0 flex-col border-r bg-sidebar px-4 py-6 lg:flex">
      <Logo href="/dashboard" className="px-2" />
      <div className="mt-8 flex-1">
        <SidebarNav />
      </div>
      <p className="px-3 text-xs text-muted-foreground">
        MoneyTrack · controle seus gastos
      </p>
    </aside>
  );
}
