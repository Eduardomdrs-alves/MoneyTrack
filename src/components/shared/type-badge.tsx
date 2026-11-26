import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TRANSACTION_TYPE_LABEL } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { TransactionType } from "@/types";

export function TypeBadge({ type, className }: { type: TransactionType; className?: string }) {
  const Icon = type === "income" ? ArrowUpRight : ArrowDownRight;
  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1",
        type === "income"
          ? "border-income/30 bg-income/10 text-income"
          : "border-expense/30 bg-expense/10 text-expense",
        className,
      )}
    >
      <Icon className="size-3" aria-hidden />
      {TRANSACTION_TYPE_LABEL[type]}
    </Badge>
  );
}
