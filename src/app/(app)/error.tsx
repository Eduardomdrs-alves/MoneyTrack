"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

/**
 * error.tsx: Error Boundary da área logada. Se um Server Component lançar erro
 * (ex.: banco fora do ar), só o conteúdo da página é trocado por esta tela —
 * o menu e o cabeçalho continuam funcionando.
 */
export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Card className="mx-auto max-w-lg">
      <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertTriangle className="size-6" aria-hidden />
        </span>
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">Algo deu errado</h2>
          <p className="text-sm text-muted-foreground">
            Não foi possível carregar esta página. Verifique sua conexão e tente novamente.
          </p>
          {error.digest && <p className="text-xs text-muted-foreground">Código: {error.digest}</p>}
        </div>
        <div className="flex gap-2">
          <Button onClick={reset}>
            <RotateCcw /> Tentar novamente
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard">Ir para o dashboard</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
