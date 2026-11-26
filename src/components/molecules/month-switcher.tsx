import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { capitalizeFirst, currentMonth, formatMonth, shiftMonth } from "@/lib/format";

/**
 * Troca de mês SEM JavaScript no cliente: são apenas <Link>s com ?mes=YYYY-MM.
 * O Next.js faz prefetch dos meses vizinhos e o Server Component re-renderiza.
 */
export function MonthSwitcher({ month, basePath }: { month: string; basePath: string }) {
  const prev = shiftMonth(month, -1);
  const next = shiftMonth(month, 1);
  const isCurrent = month === currentMonth();

  return (
    <nav className="flex items-center gap-1" aria-label="Selecionar mês">
      <Button variant="outline" size="icon" asChild>
        <Link href={`${basePath}?mes=${prev}`} aria-label={`Ver ${formatMonth(prev)}`} scroll={false}>
          <ChevronLeft />
        </Link>
      </Button>
      <span className="min-w-36 text-center text-sm font-medium">{capitalizeFirst(formatMonth(month))}</span>
      <Button variant="outline" size="icon" asChild>
        <Link href={`${basePath}?mes=${next}`} aria-label={`Ver ${formatMonth(next)}`} scroll={false}>
          <ChevronRight />
        </Link>
      </Button>
      {!isCurrent && (
        <Button variant="ghost" size="sm" asChild>
          <Link href={basePath} scroll={false}>
            Hoje
          </Link>
        </Button>
      )}
    </nav>
  );
}
