import { Skeleton } from "@/components/ui/skeleton";

/**
 * loading.tsx: o Next.js envolve a página num <Suspense> e mostra este
 * esqueleto imediatamente enquanto o Server Component busca os dados.
 */
export default function AppLoading() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Carregando">
      <div className="space-y-2">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-72" />
      </div>
      <Skeleton className="h-40 w-full rounded-xl" />
      <Skeleton className="h-72 w-full rounded-xl" />
    </div>
  );
}
