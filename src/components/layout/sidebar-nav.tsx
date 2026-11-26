"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeftRight, LayoutDashboard, Tags } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/store/sidebar-store";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/transacoes", label: "Transações", icon: ArrowLeftRight },
  { href: "/categorias", label: "Categorias", icon: Tags },
] as const;

/**
 * Client Component "folha": só precisa do cliente para saber a rota ativa
 * (usePathname) e fechar o menu mobile ao navegar.
 */
export function SidebarNav() {
  const pathname = usePathname();
  const setMobileOpen = useSidebarStore((state) => state.setMobileOpen);

  return (
    <nav className="flex flex-col gap-1" aria-label="Navegação principal">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            onClick={() => setMobileOpen(false)}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="size-4" aria-hidden />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
