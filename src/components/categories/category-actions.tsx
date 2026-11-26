"use client";

import { useState, useTransition } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteCategoryAction } from "@/actions/category.actions";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CategoryDialog } from "@/components/categories/category-dialog";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { queryKeys } from "@/lib/query-keys";
import type { Category } from "@/types";

interface CategoryActionsProps {
  category: Category;
  transactionCount: number;
}

/** Editar/Excluir categoria (folha interativa dentro de uma lista renderizada no servidor) */
export function CategoryActions({ category, transactionCount }: CategoryActionsProps) {
  const queryClient = useQueryClient();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const inUse = transactionCount > 0;

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteCategoryAction(category.id);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success(result.message);
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
      setConfirmOpen(false);
    });
  }

  return (
    <div className="flex items-center gap-1">
      <CategoryDialog
        category={category}
        lockType={inUse}
        trigger={
          <Button variant="ghost" size="icon-sm" aria-label={`Editar ${category.name}`}>
            <Pencil />
          </Button>
        }
      />

      <Tooltip>
        <TooltipTrigger asChild>
          {/* span permite mostrar o tooltip mesmo com o botão desabilitado */}
          <span tabIndex={inUse ? 0 : -1}>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={`Excluir ${category.name}`}
              className="text-muted-foreground hover:text-destructive"
              disabled={inUse}
              onClick={() => setConfirmOpen(true)}
            >
              <Trash2 />
            </Button>
          </span>
        </TooltipTrigger>
        <TooltipContent>
          {inUse ? "Categoria em uso — não pode ser excluída" : "Excluir"}
        </TooltipContent>
      </Tooltip>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Excluir categoria?"
        description={
          <>
            A categoria <strong>{category.name}</strong> será removida.
          </>
        }
        pending={isPending}
        onConfirm={handleDelete}
      />
    </div>
  );
}
