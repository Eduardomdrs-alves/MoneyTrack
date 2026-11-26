import { Loader2 } from "lucide-react";

/** Carregamento das rotas públicas (landing, login, cadastro) */
export default function RootLoading() {
  return (
    <div className="flex min-h-svh items-center justify-center" aria-busy="true" aria-label="Carregando">
      <Loader2 className="size-8 animate-spin text-primary" />
    </div>
  );
}
