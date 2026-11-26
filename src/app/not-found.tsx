import type { Metadata } from "next";
import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { Logo } from "@/components/atoms/logo";

export const metadata: Metadata = { title: "Página não encontrada" };

export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 px-4 text-center">
      <Logo />
      <div className="flex size-14 items-center justify-center rounded-full bg-accent text-accent-foreground">
        <Compass className="size-7" aria-hidden />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium text-primary">Erro 404</p>
        <h1 className="text-3xl font-semibold tracking-tight">Página não encontrada</h1>
        <p className="text-muted-foreground">O endereço que você tentou acessar não existe.</p>
      </div>
      <Button asChild>
        <Link href="/">Voltar ao início</Link>
      </Button>
    </main>
  );
}
