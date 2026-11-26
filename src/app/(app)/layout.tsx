import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { NewTransactionButton } from "@/components/transactions/new-transaction-button";
import { TransactionDialog } from "@/components/transactions/transaction-dialog";
import { requireUser } from "@/lib/session";

/**
 * Layout aninhado da área logada: /dashboard, /transacoes, /categorias.
 * 2ª camada de proteção: mesmo que o proxy fosse ignorado, o layout
 * (Server Component) verifica a sessão no servidor antes de renderizar.
 */
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  return (
    <div className="flex min-h-svh">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader user={user} />
        <main className="mx-auto w-full max-w-6xl flex-1 space-y-6 px-4 py-6 pb-24 sm:px-6 sm:pb-8 lg:py-8">
          {children}
        </main>
      </div>

      {/* Componentes globais da área logada */}
      <TransactionDialog />
      <NewTransactionButton floating className="sm:hidden" />
    </div>
  );
}
