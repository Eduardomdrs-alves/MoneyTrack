import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "Entrar" };

/** Aceita apenas caminhos internos para evitar "open redirect" */
function safeCallbackUrl(value: string | string[] | undefined): string {
  const url = Array.isArray(value) ? value[0] : value;
  return url && url.startsWith("/") && !url.startsWith("//") ? url : "/dashboard";
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string | string[] }>;
}) {
  const { callbackUrl } = await searchParams;
  return <LoginForm callbackUrl={safeCallbackUrl(callbackUrl)} />;
}
