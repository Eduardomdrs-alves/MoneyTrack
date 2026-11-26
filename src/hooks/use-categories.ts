"use client";

import { useQuery } from "@tanstack/react-query";
import { categoriesApi } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";

/** Categorias do usuário (cache compartilhado entre formulário e filtros) */
export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: () => categoriesApi.list(),
    staleTime: 5 * 60 * 1000, // categorias mudam pouco
  });
}
