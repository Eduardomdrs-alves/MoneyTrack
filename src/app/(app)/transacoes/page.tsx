import type { Metadata } from "next";
import { TransactionsTemplate } from "@/components/templates/transactions-template";

export const metadata: Metadata = { title: "Transa??es" };

/** A composi??o da tela fica no template; a listagem interativa usa React Query. */
export default function TransactionsPage() {
  return <TransactionsTemplate />;
}
