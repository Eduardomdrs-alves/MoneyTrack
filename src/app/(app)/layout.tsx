import { AppTemplate } from "@/components/templates/app-template";
import { requireUser } from "@/lib/session";

/**
 * Layout aninhado da área logada: /dashboard, /transacoes, /categorias.
 * 2ª camada de proteção: mesmo que o proxy fosse ignorado, o layout
 * (Server Component) verifica a sessão no servidor antes de renderizar.
 */
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  return <AppTemplate user={user}>{children}</AppTemplate>;
}
