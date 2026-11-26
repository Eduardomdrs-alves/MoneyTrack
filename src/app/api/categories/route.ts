import { NextResponse } from "next/server";
import { withAuth } from "@/lib/api-handler";
import { listCategories } from "@/services/category.service";

/**
 * GET /api/categories?type=expense
 * Usado pelo formulário de transações (React Query) para popular o <Select>.
 * A criação/edição de categorias é feita via Server Actions (ver src/actions).
 */
export const GET = withAuth(async (request, _context, userId) => {
  const typeParam = request.nextUrl.searchParams.get("type");
  const type = typeParam === "income" || typeParam === "expense" ? typeParam : undefined;
  const categories = await listCategories(userId, type);
  return NextResponse.json(categories);
});
