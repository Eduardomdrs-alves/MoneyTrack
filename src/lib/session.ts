import "server-only";
import { cache } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { UnauthorizedError } from "@/lib/errors";

/**
 * Lê a sessão no servidor. O `cache` do React evita ler/decodificar
 * o JWT várias vezes durante a mesma renderização (layout + página).
 */
export const getCurrentUser = cache(async () => {
  const session = await getServerSession(authOptions);
  return session?.user?.id ? session.user : null;
});

/** Para Server Components: redireciona para /login se não houver sessão */
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

/** Para Server Actions: lança erro 401 se não houver sessão */
export async function requireUserId(): Promise<string> {
  const user = await getCurrentUser();
  if (!user) throw new UnauthorizedError();
  return user.id;
}
