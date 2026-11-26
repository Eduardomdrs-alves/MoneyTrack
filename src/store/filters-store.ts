import { create } from "zustand";
import { currentMonth } from "@/lib/format";
import type { TransactionFilters } from "@/types";

/**
 * Filtros da tela de transações (estado exclusivo do cliente).
 * Ficam no Zustand para sobreviver à navegação entre páginas:
 * o usuário sai de /transacoes, abre um detalhe e volta com os filtros intactos.
 */
interface FiltersState extends TransactionFilters {
  setMonth: (month: string) => void;
  setType: (type: TransactionFilters["type"]) => void;
  setCategoryId: (categoryId: string) => void;
  setSearch: (search: string) => void;
  reset: () => void;
}

const initialFilters = (): TransactionFilters => ({
  month: currentMonth(),
  type: "all",
  categoryId: "all",
  search: "",
});

export const useFiltersStore = create<FiltersState>()((set) => ({
  ...initialFilters(),
  setMonth: (month) => set({ month }),
  // Ao trocar o tipo, a categoria escolhida pode não fazer mais sentido
  setType: (type) => set({ type, categoryId: "all" }),
  setCategoryId: (categoryId) => set({ categoryId }),
  setSearch: (search) => set({ search }),
  reset: () => set(initialFilters()),
}));
