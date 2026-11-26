import { redirect } from "next/navigation";
import { AuthTemplate } from "@/components/templates/auth-template";
import { getCurrentUser } from "@/lib/session";

/**
 * Layout aninhado do grupo de rotas (auth): /login e /cadastro.
 * O "(auth)" entre parênteses organiza as pastas SEM aparecer na URL.
 */
export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  // Usuário já autenticado não precisa ver login/cadastro
  if (await getCurrentUser()) redirect("/dashboard");

  return <AuthTemplate>{children}</AuthTemplate>;
}
