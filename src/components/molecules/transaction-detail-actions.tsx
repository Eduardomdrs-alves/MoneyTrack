"use client";

import { useRouter } from "next/navigation";
import { TransactionRowActions } from "@/components/molecules/transaction-row-actions";
import type { Transaction } from "@/types";

/** Ações da página de detalhe: após excluir, volta para a listagem */
export function TransactionDetailActions({ transaction }: { transaction: Transaction }) {
  const router = useRouter();
  return (
    <TransactionRowActions
      transaction={transaction}
      showLabels
      onDeleted={() => router.push("/transacoes")}
    />
  );
}
