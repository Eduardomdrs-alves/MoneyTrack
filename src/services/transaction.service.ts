import "server-only";
import { cache } from "react";
import { Types, isValidObjectId, type QueryFilter } from "mongoose";
import { connectDB } from "@/lib/db";
import { NotFoundError, ValidationError } from "@/lib/errors";
import { isoDateToDate, monthRange } from "@/lib/format";
import type { TransactionFiltersSchema, TransactionSchema } from "@/schemas";
import { Category as CategoryModel, type ICategory } from "@/models/Category";
import { Transaction as TransactionModel, type ITransaction } from "@/models/Transaction";
import type { Transaction } from "@/types";
import { toTransactionDTO } from "@/services/mappers";

/**
 * Camada de serviço de Transações (CRUD completo).
 * Toda operação recebe o userId da sessão e o inclui no filtro,
 * garantindo que cada usuário só leia/altere os próprios lançamentos.
 */

const MAX_RESULTS = 500;

export async function listTransactions(
  userId: string,
  filters: TransactionFiltersSchema = {},
): Promise<Transaction[]> {
  await connectDB();

  const query: QueryFilter<ITransaction> = { userId: new Types.ObjectId(userId) };

  if (filters.month) {
    const { start, end } = monthRange(filters.month);
    query.date = { $gte: start, $lt: end };
  }
  if (filters.type && filters.type !== "all") {
    query.type = filters.type;
  }
  if (filters.categoryId && filters.categoryId !== "all") {
    query.category = new Types.ObjectId(filters.categoryId);
  }

  const docs = await TransactionModel.find(query)
    .sort({ date: -1, createdAt: -1 })
    .limit(MAX_RESULTS)
    .populate<{ category: ICategory | null }>("category")
    .lean();

  return docs.map(toTransactionDTO);
}

export const getTransaction = cache(async (userId: string, id: string): Promise<Transaction | null> => {
  if (!isValidObjectId(id)) return null;
  await connectDB();
  const doc = await TransactionModel.findOne({ _id: id, userId: new Types.ObjectId(userId) })
    .populate<{ category: ICategory | null }>("category")
    .lean();
  return doc ? toTransactionDTO(doc) : null;
});

/** Garante que a categoria existe, pertence ao usuário e é do mesmo tipo da transação */
async function assertValidCategory(userId: string, input: TransactionSchema) {
  const category = await CategoryModel.findOne({
    _id: input.categoryId,
    userId: new Types.ObjectId(userId),
  }).lean();

  if (!category) {
    throw new ValidationError("Categoria inválida.", { categoryId: ["Categoria não encontrada"] });
  }
  if (category.type !== input.type) {
    throw new ValidationError("A categoria não corresponde ao tipo da transação.", {
      categoryId: ["Escolha uma categoria do mesmo tipo da transação"],
    });
  }
}

function toPersistence(input: TransactionSchema) {
  return {
    description: input.description,
    amount: input.amount,
    type: input.type,
    category: new Types.ObjectId(input.categoryId),
    date: isoDateToDate(input.date),
    notes: input.notes ?? "",
  };
}

export async function createTransaction(userId: string, input: TransactionSchema): Promise<Transaction> {
  await connectDB();
  await assertValidCategory(userId, input);

  const doc = await TransactionModel.create({
    ...toPersistence(input),
    userId: new Types.ObjectId(userId),
  });
  await doc.populate<{ category: ICategory | null }>("category");

  return toTransactionDTO(doc.toObject());
}

export async function updateTransaction(
  userId: string,
  id: string,
  input: TransactionSchema,
): Promise<Transaction> {
  if (!isValidObjectId(id)) throw new NotFoundError("Transação não encontrada.");
  await connectDB();
  await assertValidCategory(userId, input);

  const doc = await TransactionModel.findOneAndUpdate(
    { _id: id, userId: new Types.ObjectId(userId) },
    toPersistence(input),
    { returnDocument: "after", runValidators: true },
  )
    .populate<{ category: ICategory | null }>("category")
    .lean();

  if (!doc) throw new NotFoundError("Transação não encontrada.");
  return toTransactionDTO(doc);
}

export async function deleteTransaction(userId: string, id: string): Promise<void> {
  if (!isValidObjectId(id)) throw new NotFoundError("Transação não encontrada.");
  await connectDB();
  const result = await TransactionModel.deleteOne({ _id: id, userId: new Types.ObjectId(userId) });
  if (result.deletedCount === 0) throw new NotFoundError("Transação não encontrada.");
}
