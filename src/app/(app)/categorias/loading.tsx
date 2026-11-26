import { Card, CardHeader } from "@/components/atoms/card";
import { Skeleton } from "@/components/atoms/skeleton";

export default function CategoriesLoading() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Carregando categorias">
      <div className="flex items-end justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-9 w-40" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, card) => (
          <Card key={card} className="gap-0">
            <CardHeader className="pb-4">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <div className="divide-y border-t">
              {Array.from({ length: 5 }).map((_, row) => (
                <div key={row} className="flex items-center gap-3 px-6 py-3">
                  <Skeleton className="size-9 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
