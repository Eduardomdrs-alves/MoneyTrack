import Image from "next/image";
import { redirect } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import hero from "@/assets/hero.png";
import { Logo } from "@/components/shared/logo";
import { getCurrentUser } from "@/lib/session";

/**
 * Layout aninhado do grupo de rotas (auth): /login e /cadastro.
 * O "(auth)" entre parênteses organiza as pastas SEM aparecer na URL.
 */
export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  // Usuário já autenticado não precisa ver login/cadastro
  if (await getCurrentUser()) redirect("/dashboard");

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-100 p-10 lg:flex dark:from-emerald-950 dark:to-teal-950">
        <Logo />
        <div className="space-y-6">
          <Image
            src={hero}
            alt=""
            sizes="(min-width: 1024px) 40vw, 0px"
            className="mx-auto h-auto w-full max-w-lg"
            placeholder="blur"
          />
          <ul className="space-y-2 text-sm text-emerald-950/80 dark:text-emerald-50/80">
            {["Receitas e despesas organizadas por categoria", "Saldo e gráficos atualizados na hora", "Seus dados protegidos com criptografia"].map(
              (item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-primary" aria-hidden />
                  {item}
                </li>
              ),
            )}
          </ul>
        </div>
        <p className="text-xs text-emerald-950/60 dark:text-emerald-50/60">© MoneyTrack</p>
      </aside>

      <main className="flex flex-col items-center justify-center px-4 py-10 sm:px-8">
        <div className="mb-8 lg:hidden">
          <Logo />
        </div>
        <div className="w-full max-w-sm">{children}</div>
      </main>
    </div>
  );
}
