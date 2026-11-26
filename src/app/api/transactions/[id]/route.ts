import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { withAuth } from "@/lib/api-handler";
import { NotFoundError } from "@/lib/errors";
import { transactionSchema } from "@/schemas";
import {
  deleteTransaction,
  getTransaction,
  updateTransaction,
} from "@/services/transaction.service";

// No Next.js 16 os params de rotas dinâmicas são uma Promise
type Context = { params: Promise<{ id: string }> };

function revalidateTransactionPaths(id: string) {
  revalidatePath("/dashboard");
  revalidatePath("/categorias");
  revalidatePath(`/transacoes/${id}`);
}

/** GET /api/transactions/:id */
export const GET = withAuth<Context>(async (_request, { params }, userId) => {
  const { id } = await params;
  const transaction = await getTransaction(userId, id);
  if (!transaction) throw new NotFoundError("Transação não encontrada.");
  return NextResponse.json(transaction);
});

/** PUT /api/transactions/:id — atualiza todos os campos */
export const PUT = withAuth<Context>(async (request, { params }, userId) => {
  const { id } = await params;
  const input = transactionSchema.parse(await request.json());
  const transaction = await updateTransaction(userId, id, input);
  revalidateTransactionPaths(id);
  return NextResponse.json(transaction);
});

/** DELETE /api/transactions/:id */
export const DELETE = withAuth<Context>(async (_request, { params }, userId) => {
  const { id } = await params;
  await deleteTransaction(userId, id);
  revalidateTransactionPaths(id);
  return new NextResponse(null, { status: 204 });
});
