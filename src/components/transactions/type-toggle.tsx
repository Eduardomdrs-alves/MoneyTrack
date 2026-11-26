"use client";

import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TransactionType } from "@/types";

interface TypeToggleProps {
  value: TransactionType;
  onChange: (value: TransactionType) => void;
  disabled?: boolean;
}

const OPTIONS = [
  { value: "expense", label: "Despesa", icon: ArrowDownRight },
  { value: "income", label: "Receita", icon: ArrowUpRight },
] as const;

/** Seletor segmentado Despesa/Receita (acessível como radiogroup) */
export function TypeToggle({ value, onChange, disabled }: TypeToggleProps) {
  return (
    <div role="radiogroup" aria-label="Tipo" className="grid grid-cols-2 gap-1 rounded-lg bg-muted p-1">
      {OPTIONS.map((option) => {
        const selected = option.value === value;
        const Icon = option.icon;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={disabled}
            onClick={() => onChange(option.value)}
            className={cn(
              "flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-60",
              selected
                ? option.value === "income"
                  ? "bg-background text-income shadow-sm"
                  : "bg-background text-expense shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="size-4" aria-hidden />
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
