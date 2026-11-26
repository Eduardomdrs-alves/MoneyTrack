"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useDeleteTransaction } from "@/hooks/use-transactions";
import { useTransactionDialog } from "@/store/transaction-dialog-store";
import type { Transaction } from "@/types";

interface TransactionRowActionsProps {
  transaction: Transaction;
  /** Executado após excluir (ex.: voltar para a listagem) */
  onDeleted?: () => void;
  showLabels?: boolean;
}

/** Botões Editar/Excluir de uma transação */
export function TransactionRowActions({ transaction, onDeleted, showLabels = false }: TransactionRowActionsProps) {
  const openEdit = useTransactionDialog((state) => state.openEdit);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const deleteMutation = useDeleteTransaction({ onDeleted });

  function handleDelete() {
    deleteMutation.mutate(transaction.id);
    setConfirmOpen(false);
  }

  if (showLabels) {
    return (
      <>
        <Button variant="outline" onClick={() => openEdit(transaction)}>
          <Pencil /> Editar
        </Button>
        <Button variant="outline" className="text-destructive hover:text-destructive" onClick={() => setConfirmOpen(true)}>
          <Trash2 /> Excluir
        </Button>
        <DeleteConfirm
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          description={transaction.description}
          pending={deleteMutation.isPending}
          onConfirm={handleDelete}
        />
      </>
    );
  }

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label="Editar" onClick={() => openEdit(transaction)}>
            <Pencil />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Editar</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Excluir"
            className="text-muted-foreground hover:text-destructive"
            onClick={() => setConfirmOpen(true)}
          >
            <Trash2 />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Excluir</TooltipContent>
      </Tooltip>
      <DeleteConfirm
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        description={transaction.description}
        pending={deleteMutation.isPending}
        onConfirm={handleDelete}
      />
    </>
  );
}

function DeleteConfirm(props: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  description: string;
  pending: boolean;
  onConfirm: () => void;
}) {
  return (
    <ConfirmDialog
      open={props.open}
      onOpenChange={props.onOpenChange}
      title="Excluir transação?"
      description={
        <>
          A transação <strong>{props.description}</strong> será removida permanentemente.
        </>
      }
      pending={props.pending}
      onConfirm={props.onConfirm}
    />
  );
}
