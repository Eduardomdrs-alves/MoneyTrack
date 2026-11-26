import type { Metadata } from "next";
import { CategoriesTemplate } from "@/components/templates/categories-template";
import { requireUser } from "@/lib/session";
import { listCategoriesWithUsage } from "@/services/category.service";

export const metadata: Metadata = { title: "Categorias" };

/**
 * Categorias: Server Component que lê direto do banco.
 * As mutações usam Server Actions + revalidatePath("/categorias"),
 * então esta lista é re-renderizada no servidor automaticamente após cada alteração.
 */
export default async function CategoriesPage() {
  const user = await requireUser();
  const categories = await listCategoriesWithUsage(user.id);

  return <CategoriesTemplate categories={categories} />;
}
