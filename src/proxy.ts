import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Proxy (antigo "middleware" — renomeado no Next.js 16).
 *
 * 1ª camada de proteção (frontend/rede): roda ANTES da página ser renderizada.
 * - Sem token JWT válido em rota privada -> redireciona para /login
 * - Já logado tentando abrir /login ou /cadastro -> redireciona para /dashboard
 *
 * As outras camadas são: verificação de sessão nos Server Components/layout,
 * nas API Routes (withAuth) e nas Server Actions (requireUserId).
 */

const PRIVATE_ROUTES = ["/dashboard", "/transacoes", "/categorias"];
const AUTH_ROUTES = ["/login", "/cadastro"];

const matches = (pathname: string, routes: string[]) =>
  routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  if (!token && matches(pathname, PRIVATE_ROUTES)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  if (token && matches(pathname, AUTH_ROUTES)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/transacoes/:path*",
    "/categorias/:path*",
    "/login",
    "/cadastro",
  ],
};
