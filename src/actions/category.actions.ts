"use server";

import { revalidatePath } from "next/cache";
import { normalizeError } from "@/lib/errors";
import { requireUserId } from "@/lib/session";
import { categorySchema, getFieldErrors } from "@/lib/validations";
import { createCategory, deleteCategory, updateCategory } from "@/services/category.service";
import type { ActionResult, Category, CategoryInput } from "@/types";

/**
 * Server Actions de categorias.
 * Estratégia de sincronização: após gravar no banco chamamos `revalidatePath`,
 * que invalida o cache das rotas afetadas e faz o Next.js re-renderizar
 * os Server Components com os dados novos — sem useEffect no cliente.
 */

function revalidateCategoryPaths(id?: string) {
  revalidatePath("/categorias");
  if (id) revalidatePath(`/categorias/${id}`);
  revalidatePath("/dashboard");
  revalidatePath("/transacoes");
}

function toActionError(error: unknown): ActionResult<never> {
  const { error: message, fieldErrors } = normalizeError(error);
  return { success: false, error: message, fieldErrors };
}

export async function createCategoryAction(input: CategoryInput): Promise<ActionResult<Category>> {
  try {
    const userId = await requireUserId(); // proteção no backend
    const parsed = categorySchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: "Dados inválidos.", fieldErrors: getFieldErrors(parsed.error) };
    }

    const category = await createCategory(userId, parsed.data);
    revalidateCategoryPaths();
    return { success: true, data: category, message: "Categoria criada!" };
  } catch (error) {
    return toActionError(error);
  }
}

export async function updateCategoryAction(
  id: string,
  input: CategoryInput,
): Promise<ActionResult<Category>> {
  try {
    const userId = await requireUserId();
    const parsed = categorySchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: "Dados inválidos.", fieldErrors: getFieldErrors(parsed.error) };
    }

    const category = await updateCategory(userId, id, parsed.data);
    revalidateCategoryPaths(id);
    return { success: true, data: category, message: "Categoria atualizada!" };
  } catch (error) {
    return toActionError(error);
  }
}

export async function deleteCategoryAction(id: string): Promise<ActionResult> {
  try {
    const userId = await requireUserId();
    await deleteCategory(userId, id);
    revalidateCategoryPaths();
    return { success: true, message: "Categoria excluída." };
  } catch (error) {
    return toActionError(error);
  }
}
