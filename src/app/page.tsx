import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BarChart3, ShieldCheck, Smartphone, Tags } from "lucide-react";
import hero from "@/assets/hero.png";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";
import { getCurrentUser } from "@/lib/session";

const FEATURES = [
  {
    icon: BarChart3,
    title: "Visão clara do mês",
    description: "Saldo, receitas e despesas calculados automaticamente, com gráfico dos últimos meses.",
  },
  {
    icon: Tags,
    title: "Categorias do seu jeito",
    description: "Crie categorias com cores próprias e descubra para onde vai cada real.",
  },
  {
    icon: ShieldCheck,
    title: "Seus dados protegidos",
    description: "Senhas criptografadas com bcrypt e sessão segura via JWT.",
  },
  {
    icon: Smartphone,
    title: "Funciona no celular",
    description: "Interface responsiva para registrar um gasto em segundos, onde estiver.",
  },
];

/** Landing page (Server Component) */
export default async function HomePage() {
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-svh flex-col">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <Logo priority />
        <nav className="flex items-center gap-2">
          {user ? (
            <Button asChild>
              <Link href="/dashboard">Abrir dashboard</Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Entrar</Link>
              </Button>
              <Button asChild>
                <Link href="/cadastro">Criar conta</Link>
              </Button>
            </>
          )}
        </nav>
      </header>

      <main className="flex-1">
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:py-20">
          <div className="space-y-6">
            <span className="inline-flex items-center rounded-full border bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
              Controle financeiro pessoal
            </span>
            <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              Saiba exatamente para onde vai o seu dinheiro.
            </h1>
            <p className="max-w-xl text-lg text-pretty text-muted-foreground">
              O MoneyTrack organiza suas receitas e despesas por categoria e mostra, mês a mês,
              quanto entrou, quanto saiu e quanto sobrou.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <Link href={user ? "/dashboard" : "/cadastro"}>
                  {user ? "Ir para o dashboard" : "Começar agora"} <ArrowRight />
                </Link>
              </Button>
              {!user && (
                <Button size="lg" variant="outline" asChild>
                  <Link href="/login">Já tenho conta</Link>
                </Button>
              )}
            </div>
          </div>

          {/* <Image>: gera WebP/AVIF em vários tamanhos e serve o ideal para cada tela */}
          <Image
            src={hero}
            alt="Ilustração do painel do MoneyTrack com gráfico de barras e gráfico de categorias"
            priority
            placeholder="blur"
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="h-auto w-full"
          />
        </section>

        <section className="border-t bg-muted/40">
          <div className="mx-auto grid max-w-6xl gap-6 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <div key={title} className="space-y-3">
                <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" aria-hidden />
                </span>
                <h2 className="font-semibold">{title}</h2>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        MoneyTrack · Projeto acadêmico de Desenvolvimento Web II
      </footer>
    </div>
  );
}
