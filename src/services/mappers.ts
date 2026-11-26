import "server-only";
import type { Types } from "mongoose";
import type { Category, Transaction, TransactionType } from "@/types";

/**
 * Mappers: convertem documentos do Mongoose (com ObjectId, Date...)
 * em objetos simples e serializáveis, que podem atravessar a fronteira
 * Server Component -> Client Component ou virar JSON numa API Route.
 */

interface CategoryLike {
  _id: Types.ObjectId;
  name: string;
  type: TransactionType;
  color: string;
}

interface TransactionLike {
  _id: Types.ObjectId;
  description: string;
  amount: number;
  type: TransactionType;
  date: Date;
  notes?: string;
  category?: CategoryLike | Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

export function toCategoryDTO(doc: CategoryLike): Category {
  return {
    id: doc._id.toString(),
    name: doc.name,
    type: doc.type,
    color: doc.color,
  };
}

function isPopulatedCategory(value: TransactionLike["category"]): value is CategoryLike {
  return !!value && typeof value === "object" && "name" in value;
}

export function toTransactionDTO(doc: TransactionLike): Transaction {
  return {
    id: doc._id.toString(),
    description: doc.description,
    amount: doc.amount,
    type: doc.type,
    date: doc.date.toISOString().slice(0, 10),
    notes: doc.notes ?? "",
    category: isPopulatedCategory(doc.category) ? toCategoryDTO(doc.category) : null,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

export function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}
