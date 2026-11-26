import { create } from "zustand";

/** Menu lateral no celular (Sheet): aberto/fechado */
interface SidebarState {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const useSidebarStore = create<SidebarState>()((set) => ({
  mobileOpen: false,
  setMobileOpen: (mobileOpen) => set({ mobileOpen }),
}));
