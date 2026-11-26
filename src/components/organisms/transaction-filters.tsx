"use client";

import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import { useCategories } from "@/hooks/use-categories";
import { capitalizeFirst, currentMonth, formatMonth, shiftMonth } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useFiltersStore } from "@/store/filters-store";
import type { TransactionFilters as Filters } from "@/types";

const TYPE_OPTIONS: { value: Filters["type"]; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "income", label: "Receitas" },
  { value: "expense", label: "Despesas" },
];

/** Barra de filtros — lê e escreve direto no store do Zustand */
export function TransactionFilters() {
  const filters = useFiltersStore(
    useShallow((s) => ({ month: s.month, type: s.type, categoryId: s.categoryId, search: s.search })),
  );
  const actions = useFiltersStore(
    useShallow((s) => ({
      setMonth: s.setMonth,
      setType: s.setType,
      setCategoryId: s.setCategoryId,
      setSearch: s.setSearch,
      reset: s.reset,
    })),
  );
  const { data: categories = [] } = useCategories();

  const visibleCategories =
    filters.type === "all" ? categories : categories.filter((c) => c.type === filters.type);
  const isCurrentMonth = filters.month === currentMonth();
  const hasActiveFilters =
    filters.type !== "all" || filters.categoryId !== "all" || filters.search !== "" || !isCurrentMonth;

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Navegação por mês */}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            aria-label="Mês anterior"
            onClick={() => actions.setMonth(shiftMonth(filters.month, -1))}
          >
            <ChevronLeft />
          </Button>
          <p className="min-w-40 text-center text-sm font-medium" aria-live="polite">
            {capitalizeFirst(formatMonth(filters.month))}
          </p>
          <Button
            variant="outline"
            size="icon"
            aria-label="Próximo mês"
            onClick={() => actions.setMonth(shiftMonth(filters.month, 1))}
          >
            <ChevronRight />
          </Button>
          {!isCurrentMonth && (
            <Button variant="ghost" size="sm" onClick={() => actions.setMonth(currentMonth())}>
              Hoje
            </Button>
          )}
        </div>

        {/* Tipo */}
        <div role="radiogroup" aria-label="Filtrar por tipo" className="inline-flex rounded-lg bg-muted p-1">
          {TYPE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={filters.type === option.value}
              onClick={() => actions.setType(option.value)}
              className={cn(
                "flex-1 rounded-md px-3 py-1 text-sm font-medium transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 md:flex-none",
                filters.type === option.value
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por descrição ou categoria"
            value={filters.search}
            onChange={(event) => actions.setSearch(event.target.value)}
            className="pl-9"
            aria-label="Buscar transações"
          />
        </div>

        <Select value={filters.categoryId} onValueChange={actions.setCategoryId}>
          <SelectTrigger className="w-full sm:w-56" aria-label="Filtrar por categoria">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as categorias</SelectItem>
            {visibleCategories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                <span className="size-2.5 rounded-full" style={{ backgroundColor: category.color }} aria-hidden />
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="ghost" onClick={actions.reset}>
            <X /> Limpar
          </Button>
        )}
      </div>
    </div>
  );
}
