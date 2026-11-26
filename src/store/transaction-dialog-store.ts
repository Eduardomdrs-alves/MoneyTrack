import { create } from "zustand";
import type { Transaction, TransactionType } from "@/types";

/**
 * Estado de UI (somente cliente): o modal de criar/editar transação.
 * Um único <TransactionDialog /> fica montado no layout e qualquer botão
 * da aplicação pode abri-lo chamando `openCreate()` ou `openEdit(tx)`,
 * sem prop drilling e sem Context re-renderizando a árvore inteira.
 */
interface TransactionDialogState {
  isOpen: boolean;
  /** null = modo de criação */
  transaction: Transaction | null;
  defaultType: TransactionType;
  openCreate: (type?: TransactionType) => void;
  openEdit: (transaction: Transaction) => void;
  close: () => void;
}

export const useTransactionDialog = create<TransactionDialogState>()((set) => ({
  isOpen: false,
  transaction: null,
  defaultType: "expense",
  openCreate: (type = "expense") => set({ isOpen: true, transaction: null, defaultType: type }),
  openEdit: (transaction) =>
    set({ isOpen: true, transaction, defaultType: transaction.type }),
  close: () => set({ isOpen: false }),
}));
