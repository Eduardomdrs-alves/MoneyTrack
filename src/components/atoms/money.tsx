import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { TransactionType } from "@/types";

interface MoneyProps {
  value: number;
  /** Quando informado, mostra sinal (+/−) e cor de receita/despesa */
  type?: TransactionType;
  className?: string;
}

/** Valor monetário formatado em BRL. O sinal +/− garante leitura sem depender só da cor. */
export function Money({ value, type, className }: MoneyProps) {
  const sign = type === "income" ? "+ " : type === "expense" ? "− " : "";
  return (
    <span
      className={cn(
        "tabular font-medium whitespace-nowrap",
        type === "income" && "text-income",
        type === "expense" && "text-expense",
        className,
      )}
    >
      {sign}
      {formatCurrency(value)}
    </span>
  );
}
