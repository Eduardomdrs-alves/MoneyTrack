"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { FieldError } from "@/components/shared/field-error";
import { TypeToggle } from "@/components/transactions/type-toggle";
import { useCategories } from "@/hooks/use-categories";
import { useSaveTransaction } from "@/hooks/use-transactions";
import { ApiError } from "@/lib/api-client";
import { todayISO } from "@/lib/format";
import type { Transaction, TransactionType } from "@/types";

interface TransactionFormProps {
  transaction: Transaction | null;
  defaultType: TransactionType;
  onSuccess: () => void;
  onCancel: () => void;
}

export function TransactionForm({ transaction, defaultType, onSuccess, onCancel }: TransactionFormProps) {
  const isEditing = !!transaction;
  const [type, setType] = useState<TransactionType>(transaction?.type ?? defaultType);
  const [categoryId, setCategoryId] = useState(transaction?.category?.id ?? "");

  const categoriesQuery = useCategories();
  const saveMutation = useSaveTransaction();

  const categories = (categoriesQuery.data ?? []).filter((c) => c.type === type);
  const fieldErrors = saveMutation.error instanceof ApiError ? saveMutation.error.fieldErrors : undefined;
  const generalError = saveMutation.error && !fieldErrors ? saveMutation.error.message : null;

  function handleTypeChange(next: TransactionType) {
    setType(next);
    // A categoria precisa ser do mesmo tipo da transação
    const current = categoriesQuery.data?.find((c) => c.id === categoryId);
    if (current && current.type !== next) setCategoryId("");
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    saveMutation.mutate(
      {
        id: transaction?.id,
        input: {
          type,
          categoryId,
          description: String(form.get("description") ?? ""),
          amount: Number(String(form.get("amount") ?? "").replace(",", ".")),
          date: String(form.get("date") ?? ""),
          notes: String(form.get("notes") ?? ""),
        },
      },
      { onSuccess },
    );
  }

  const pending = saveMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <TypeToggle value={type} onChange={handleTypeChange} disabled={pending} />

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Input
          id="description"
          name="description"
          placeholder={type === "expense" ? "Ex.: Supermercado" : "Ex.: Salário de novembro"}
          defaultValue={transaction?.description}
          maxLength={100}
          autoFocus
          required
          aria-invalid={!!fieldErrors?.description}
          aria-describedby="description-error"
        />
        <FieldError id="description-error" messages={fieldErrors?.description} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="amount">Valor (R$)</Label>
          <Input
            id="amount"
            name="amount"
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0.01"
            placeholder="0,00"
            defaultValue={transaction?.amount}
            required
            aria-invalid={!!fieldErrors?.amount}
            aria-describedby="amount-error"
          />
          <FieldError id="amount-error" messages={fieldErrors?.amount} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Data</Label>
          <Input
            id="date"
            name="date"
            type="date"
            defaultValue={transaction?.date ?? todayISO()}
            required
            aria-invalid={!!fieldErrors?.date}
            aria-describedby="date-error"
          />
          <FieldError id="date-error" messages={fieldErrors?.date} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Categoria</Label>
        {categoriesQuery.isPending ? (
          <Skeleton className="h-9 w-full" />
        ) : categories.length === 0 ? (
          <p className="rounded-md border border-dashed p-3 text-sm text-muted-foreground">
            Nenhuma categoria de {type === "expense" ? "despesa" : "receita"}.{" "}
            <Link href="/categorias" className="font-medium text-primary underline-offset-4 hover:underline" onClick={onCancel}>
              Criar categoria
            </Link>
          </p>
        ) : (
          <Select value={categoryId} onValueChange={setCategoryId} disabled={pending}>
            <SelectTrigger
              id="category"
              className="w-full"
              aria-invalid={!!fieldErrors?.categoryId}
              aria-describedby="category-error"
            >
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  <span className="size-2.5 rounded-full" style={{ backgroundColor: category.color }} aria-hidden />
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        <FieldError id="category-error" messages={fieldErrors?.categoryId} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">
          Observações <span className="font-normal text-muted-foreground">(opcional)</span>
        </Label>
        <Textarea
          id="notes"
          name="notes"
          rows={2}
          maxLength={500}
          defaultValue={transaction?.notes}
          placeholder="Algum detalhe que queira lembrar"
        />
        <FieldError messages={fieldErrors?.notes} />
      </div>

      {generalError && (
        <p role="alert" className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {generalError}
        </p>
      )}

      <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onCancel} disabled={pending}>
          Cancelar
        </Button>
        <Button type="submit" disabled={pending}>
          {pending && <Loader2 className="animate-spin" />}
          {isEditing ? "Salvar alterações" : "Adicionar"}
        </Button>
      </div>
    </form>
  );
}
