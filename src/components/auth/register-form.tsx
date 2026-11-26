"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { AlertCircle, Loader2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { registerUser } from "@/actions/auth.actions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/shared/field-error";

type FieldErrors = Record<string, string[] | undefined>;

export function RegisterForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const data = {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
      confirmPassword: String(form.get("confirmPassword") ?? ""),
    };

    startTransition(async () => {
      // 1. Server Action: valida, gera o hash bcrypt e salva no MongoDB
      const result = await registerUser(data);
      if (!result.success) {
        setFieldErrors(result.fieldErrors ?? {});
        setError(result.fieldErrors ? null : result.error);
        return;
      }

      // 2. Login automático após o cadastro
      const login = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      toast.success("Conta criada! Bem-vindo ao MoneyTrack.");
      router.replace(login?.ok ? "/dashboard" : "/login");
      router.refresh();
    });
  }

  const field = (name: string) => ({
    "aria-invalid": !!fieldErrors[name],
    "aria-describedby": `${name}-error`,
  });

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Crie sua conta</h1>
        <p className="text-sm text-muted-foreground">
          Leva menos de um minuto. Já criamos categorias para você começar.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="space-y-2">
          <Label htmlFor="name">Nome</Label>
          <Input id="name" name="name" autoComplete="name" placeholder="Seu nome" {...field("name")} />
          <FieldError id="name-error" messages={fieldErrors.name} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="voce@email.com"
            {...field("email")}
          />
          <FieldError id="email-error" messages={fieldErrors.email} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="Mínimo 6 caracteres"
              {...field("password")}
            />
            <FieldError id="password-error" messages={fieldErrors.password} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar senha</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Repita a senha"
              {...field("confirmPassword")}
            />
            <FieldError id="confirmPassword-error" messages={fieldErrors.confirmPassword} />
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? <Loader2 className="animate-spin" /> : <UserPlus />}
          {isPending ? "Criando conta..." : "Criar conta"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Já tem conta?{" "}
        <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  );
}
