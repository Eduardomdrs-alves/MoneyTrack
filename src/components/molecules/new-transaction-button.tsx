"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { cn } from "@/lib/utils";
import { useTransactionDialog } from "@/store/transaction-dialog-store";
import type { TransactionType } from "@/types";

interface NewTransactionButtonProps {
  type?: TransactionType;
  label?: string;
  className?: string;
  variant?: "default" | "outline";
  /** Botão flutuante redondo (atalho no celular) */
  floating?: boolean;
}

/** Abre o modal global de transação (estado no Zustand) */
export function NewTransactionButton({
  type = "expense",
  label = "Nova transação",
  className,
  variant = "default",
  floating = false,
}: NewTransactionButtonProps) {
  const openCreate = useTransactionDialog((state) => state.openCreate);

  if (floating) {
    return (
      <Button
        size="icon"
        aria-label={label}
        onClick={() => openCreate(type)}
        className={cn("fixed right-5 bottom-5 z-40 size-14 rounded-full shadow-lg [&_svg]:size-6", className)}
      >
        <Plus />
      </Button>
    );
  }

  return (
    <Button variant={variant} className={className} onClick={() => openCreate(type)}>
      <Plus />
      {label}
    </Button>
  );
}
