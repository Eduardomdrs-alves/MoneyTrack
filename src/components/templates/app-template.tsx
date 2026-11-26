import type { ReactNode } from "react";
import { AppHeader } from "@/components/organisms/app-header";
import { AppSidebar } from "@/components/organisms/app-sidebar";
import { NewTransactionButton } from "@/components/molecules/new-transaction-button";
import { TransactionDialog } from "@/components/organisms/transaction-dialog";

interface AppTemplateProps {
  children: ReactNode;
  user: { name?: string | null; email?: string | null };
}

export function AppTemplate({ children, user }: AppTemplateProps) {
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
