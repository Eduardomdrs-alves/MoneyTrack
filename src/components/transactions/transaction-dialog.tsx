"use client";

import { useShallow } from "zustand/react/shallow";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TransactionForm } from "@/components/transactions/transaction-form";
import { useTransactionDialog } from "@/store/transaction-dialog-store";

/**
 * Modal ÚNICO de criar/editar transação, montado no layout privado.
 * `useShallow` faz o componente re-renderizar só quando esses campos mudam.
 */
export function TransactionDialog() {
  const { isOpen, transaction, defaultType, close } = useTransactionDialog(
    useShallow((state) => ({
      isOpen: state.isOpen,
      transaction: state.transaction,
      defaultType: state.defaultType,
      close: state.close,
    })),
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
      <DialogContent className="max-h-[92svh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{transaction ? "Editar transação" : "Nova transação"}</DialogTitle>
          <DialogDescription>
            {transaction
              ? "Altere os dados e salve para atualizar o lançamento."
              : "Registre uma receita ou despesa."}
          </DialogDescription>
        </DialogHeader>
        {/* `key` recria o formulário (estado limpo) a cada transação aberta */}
        <TransactionForm
          key={transaction?.id ?? `new-${defaultType}`}
          transaction={transaction}
          defaultType={defaultType}
          onSuccess={close}
          onCancel={close}
        />
      </DialogContent>
    </Dialog>
  );
}
