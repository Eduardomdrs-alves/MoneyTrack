import "server-only";
import { cache } from "react";
import { Types, isValidObjectId } from "mongoose";
import { connectDB } from "@/lib/db";
import { DEFAULT_CATEGORIES } from "@/constants";
import { ConflictError, NotFoundError, ValidationError } from "@/lib/errors";
import type { CategorySchema } from "@/schemas";
import { Category as CategoryModel } from "@/models/Category";
import { Transaction as TransactionModel } from "@/models/Transaction";
import type { Category, TransactionType } from "@/types";
import { roundMoney, toCategoryDTO } from "@/services/mappers";

/**
 * Camada de serviço de Categorias: concentra o acesso ao banco.
 * É usada tanto pelas Server Actions quanto pelos Server Components e API Routes.
 * TODA consulta filtra por userId: um usuário nunca enxerga dados de outro.
 */

export interface CategoryWithUsage extends Category {
  transactionCount: number;
  total: number;
}

function isDuplicateKeyError(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === 11000;
}

export async function listCategories(userId: string, type?: TransactionType): Promise<Category[]> {
  await connectDB();
  const docs = await CategoryModel.find({
    userId: new Types.ObjectId(userId),
    ...(type ? { type } : {}),
  })
    .sort({ type: 1, name: 1 })
    .lean();
  return docs.map(toCategoryDTO);
}

export async function listCategoriesWithUsage(userId: string): Promise<CategoryWithUsage[]> {
  await connectDB();
  const uid = new Types.ObjectId(userId);

  const [categories, usage] = await Promise.all([
    CategoryModel.find({ userId: uid }).sort({ name: 1 }).lean(),
    TransactionModel.aggregate<{ _id: Types.ObjectId; count: number; total: number }>([
      { $match: { userId: uid } },
      { $group: { _id: "$category", count: { $sum: 1 }, total: { $sum: "$amount" } } },
    ]),
  ]);

  const usageById = new Map(usage.map((u) => [u._id.toString(), u]));

  return categories.map((doc) => {
    const stats = usageById.get(doc._id.toString());
    return {
      ...toCategoryDTO(doc),
      transactionCount: stats?.count ?? 0,
      total: roundMoney(stats?.total ?? 0),
    };
  });
}

/** `cache` deduplica a chamada entre generateMetadata e a página na mesma requisição */
export const getCategory = cache(async (userId: string, id: string): Promise<Category | null> => {
  if (!isValidObjectId(id)) return null;
  await connectDB();
  const doc = await CategoryModel.findOne({ _id: id, userId: new Types.ObjectId(userId) }).lean();
  return doc ? toCategoryDTO(doc) : null;
});

export async function createCategory(userId: string, input: CategorySchema): Promise<Category> {
  await connectDB();
  try {
    const doc = await CategoryModel.create({ ...input, userId: new Types.ObjectId(userId) });
    return toCategoryDTO(doc);
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      throw new ConflictError("Você já possui uma categoria com esse nome.", {
        name: ["Já existe uma categoria com esse nome para este tipo"],
      });
    }
    throw error;
  }
}

export async function updateCategory(
  userId: string,
  id: string,
  input: CategorySchema,
): Promise<Category> {
  const current = await getCategory(userId, id);
  if (!current) throw new NotFoundError("Categoria não encontrada.");

  await connectDB();

  // Mudar o tipo quebraria a consistência das transações já lançadas
  if (current.type !== input.type) {
    const used = await TransactionModel.countDocuments({ category: id });
    if (used > 0) {
      throw new ValidationError("Não é possível mudar o tipo de uma categoria que já possui transações.", {
        type: ["Categoria em uso: o tipo não pode ser alterado"],
      });
    }
  }

  try {
    const doc = await CategoryModel.findOneAndUpdate(
      { _id: id, userId: new Types.ObjectId(userId) },
      input,
      { returnDocument: "after", runValidators: true },
    ).lean();
    if (!doc) throw new NotFoundError("Categoria não encontrada.");
    return toCategoryDTO(doc);
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      throw new ConflictError("Você já possui uma categoria com esse nome.", {
        name: ["Já existe uma categoria com esse nome para este tipo"],
      });
    }
    throw error;
  }
}

export async function deleteCategory(userId: string, id: string): Promise<void> {
  const current = await getCategory(userId, id);
  if (!current) throw new NotFoundError("Categoria não encontrada.");

  await connectDB();
  const used = await TransactionModel.countDocuments({ category: id });
  if (used > 0) {
    throw new ConflictError(
      `Esta categoria possui ${used} transação(ões). Exclua ou altere essas transações antes.`,
    );
  }

  await CategoryModel.deleteOne({ _id: id, userId: new Types.ObjectId(userId) });
}

/** Cria as categorias padrão para um novo usuário */
export async function seedDefaultCategories(userId: string): Promise<void> {
  await connectDB();
  const uid = new Types.ObjectId(userId);
  await CategoryModel.insertMany(DEFAULT_CATEGORIES.map((c) => ({ ...c, userId: uid })));
}
