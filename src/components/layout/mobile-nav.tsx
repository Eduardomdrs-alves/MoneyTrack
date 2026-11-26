"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "@/components/shared/logo";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { useSidebarStore } from "@/store/sidebar-store";

/** Menu em gaveta para telas pequenas; aberto/fechado controlado pelo Zustand */
export function MobileNav() {
  const open = useSidebarStore((state) => state.mobileOpen);
  const setOpen = useSidebarStore((state) => state.setMobileOpen);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Abrir menu">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="border-b p-4">
          <SheetTitle asChild>
            <div>
              <Logo href="/dashboard" />
            </div>
          </SheetTitle>
        </SheetHeader>
        <div className="p-4">
          <SidebarNav />
        </div>
      </SheetContent>
    </Sheet>
  );
}
