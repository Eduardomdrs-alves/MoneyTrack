import { Logo } from "@/components/atoms/logo";
import { MobileNav } from "@/components/organisms/mobile-nav";
import { ThemeToggle } from "@/components/molecules/theme-toggle";
import { UserMenu } from "@/components/molecules/user-menu";
import { NewTransactionButton } from "@/components/molecules/new-transaction-button";

interface AppHeaderProps {
  user: { name?: string | null; email?: string | null };
}

/** Barra superior (Server Component). Apenas os botões são Client Components. */
export function AppHeader({ user }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b bg-background/85 px-4 backdrop-blur sm:px-6">
      <MobileNav />
      <Logo href="/dashboard" className="lg:hidden" showText={false} size={28} />
      <div className="flex-1" />
      <NewTransactionButton className="hidden sm:inline-flex" />
      <ThemeToggle />
      <UserMenu name={user.name ?? "Usuário"} email={user.email ?? ""} />
    </header>
  );
}
