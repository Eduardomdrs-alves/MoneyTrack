import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function TransactionDetailLoading() {
  return (
    <div className="mx-auto max-w-2xl space-y-6" aria-busy="true" aria-label="Carregando transação">
      <Skeleton className="h-8 w-48" />
      <Card>
        <CardHeader className="gap-3">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-7 w-2/3" />
          <Skeleton className="h-9 w-40" />
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
