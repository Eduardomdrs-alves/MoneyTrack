import Link from "next/link";
import { Money } from "@/components/shared/money";
import { formatDate } from "@/lib/format";
import type { Transaction } from "@/types";

interface TransactionListItemProps {
  transaction: Transaction;
  /** Botões de ação opcionais (renderizados por um Client Component) */
  actions?: React.ReactNode;
}

/**
 * Linha de transação puramente visual: sem hooks e sem "use client".
 * Por isso pode ser usada tanto em Server Components (dashboard, detalhe da categoria)
 * quanto dentro de Client Components (listagem com React Query).
 */
export function TransactionListItem({ transaction, actions }: TransactionListItemProps) {
  const color = transaction.category?.color ?? "#64748b";

  return (
    <li className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/50 sm:px-6">
      {/* Identidade da categoria: círculo com fundo translúcido + ponto na cor dela */}
      <span
        className="flex size-9 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: `${color}26` }}
        aria-hidden
      >
        <span className="size-3 rounded-full" style={{ backgroundColor: color }} />
      </span>

      <div className="min-w-0 flex-1">
        <Link
          href={`/transacoes/${transaction.id}`}
          className="block truncate font-medium hover:underline focus-visible:underline"
        >
          {transaction.description}
        </Link>
        <p className="truncate text-xs text-muted-foreground">
          {transaction.category?.name ?? "Sem categoria"} · {formatDate(transaction.date)}
        </p>
      </div>

      <Money value={transaction.amount} type={transaction.type} className="text-sm sm:text-base" />

      {actions && <div className="flex shrink-0 items-center gap-1">{actions}</div>}
    </li>
  );
}
