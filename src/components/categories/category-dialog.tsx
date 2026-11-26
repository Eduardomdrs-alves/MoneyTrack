"use client";

import { useState, useTransition } from "react";
import { Check, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createCategoryAction, updateCategoryAction } from "@/actions/category.actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/shared/field-error";
import { TypeToggle } from "@/components/transactions/type-toggle";
import { CATEGORY_COLORS } from "@/lib/constants";
import { queryKeys } from "@/lib/query-keys";
import { cn } from "@/lib/utils";
import type { Category, TransactionType } from "@/types";

interface CategoryDialogProps {
  /** Sem categoria = modo de criação */
  category?: Category;
  defaultType?: TransactionType;
  /** Impede trocar o tipo quando a categoria já tem transações */
  lockType?: boolean;
  trigger: React.ReactNode;
}

/**
 * Criar/editar categoria via Server Action.
 * O estado "aberto/fechado" é local (useState) porque só este componente o usa.
 */
export function CategoryDialog({ category, defaultType = "expense", lockType, trigger }: CategoryDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{category ? "Editar categoria" : "Nova categoria"}</DialogTitle>
          <DialogDescription>
            Categorias organizam suas transações e alimentam os gráficos do dashboard.
          </DialogDescription>
        </DialogHeader>
        <CategoryForm
          category={category}
          defaultType={defaultType}
          lockType={lockType}
          onDone={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

function CategoryForm({
  category,
  defaultType,
  lockType,
  onDone,
}: {
  category?: Category;
  defaultType: TransactionType;
  lockType?: boolean;
  onDone: () => void;
}) {
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();
  const [type, setType] = useState<TransactionType>(category?.type ?? defaultType);
  const [color, setColor] = useState<string>(category?.color ?? CATEGORY_COLORS[0]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[] | undefined>>({});
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = String(new FormData(event.currentTarget).get("name") ?? "");
    const input = { name, type, color };

    startTransition(async () => {
      const result = category
        ? await updateCategoryAction(category.id, input)
        : await createCategoryAction(input);

      if (!result.success) {
        setFieldErrors(result.fieldErrors ?? {});
        setError(result.fieldErrors ? null : result.error);
        return;
      }

      toast.success(result.message);
      // A página já foi revalidada no servidor (revalidatePath);
      // aqui sincronizamos também o cache do React Query usado no formulário de transações.
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
      onDone();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="space-y-2">
        <Label>Tipo</Label>
        <TypeToggle value={type} onChange={setType} disabled={isPending || lockType} />
        {lockType && (
          <p className="text-xs text-muted-foreground">
            O tipo não pode ser alterado porque a categoria já possui transações.
          </p>
        )}
        <FieldError messages={fieldErrors.type} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category-name">Nome</Label>
        <Input
          id="category-name"
          name="name"
          defaultValue={category?.name}
          placeholder="Ex.: Mercado, Pets, Assinaturas"
          maxLength={40}
          autoFocus
          aria-invalid={!!fieldErrors.name}
        />
        <FieldError messages={fieldErrors.name} />
      </div>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">Cor</legend>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Cor da categoria">
          {CATEGORY_COLORS.map((swatch) => {
            const selected = swatch === color;
            return (
              <button
                key={swatch}
                type="button"
                role="radio"
                aria-checked={selected}
                aria-label={`Cor ${swatch}`}
                onClick={() => setColor(swatch)}
                className={cn(
                  "flex size-8 items-center justify-center rounded-full ring-offset-2 ring-offset-background transition-transform outline-none hover:scale-110 focus-visible:ring-2 focus-visible:ring-ring",
                  selected && "ring-2 ring-foreground",
                )}
                style={{ backgroundColor: swatch }}
              >
                {selected && <Check className="size-4 text-white drop-shadow" aria-hidden />}
              </button>
            );
          })}
        </div>
        <FieldError messages={fieldErrors.color} />
      </fieldset>

      {error && (
        <p role="alert" className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </p>
      )}

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onDone} disabled={isPending}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="animate-spin" />}
          {category ? "Salvar" : "Criar categoria"}
        </Button>
      </DialogFooter>
    </form>
  );
}
