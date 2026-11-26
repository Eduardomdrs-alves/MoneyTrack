import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { withAuth } from "@/lib/api-handler";
import { transactionFiltersSchema, transactionSchema } from "@/lib/validations";
import { createTransaction, listTransactions } from "@/services/transaction.service";

/**
 * GET /api/transactions?month=2026-11&type=expense&categoryId=...
 * Lista as transações do usuário logado (consumido pelo React Query).
 */
export const GET = withAuth(async (request, _context, userId) => {
  const params = Object.fromEntries(request.nextUrl.searchParams);
  const filters = transactionFiltersSchema.parse(params);
  const transactions = await listTransactions(userId, filters);
  return NextResponse.json(transactions);
});

/** POST /api/transactions — cria uma transação */
export const POST = withAuth(async (request, _context, userId) => {
  const body = await request.json();
  const input = transactionSchema.parse(body);
  const transaction = await createTransaction(userId, input);

  // Marca as páginas renderizadas no servidor como desatualizadas
  revalidatePath("/dashboard");
  revalidatePath("/categorias");

  return NextResponse.json(transaction, { status: 201 });
});
