import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

// next/font baixa as fontes no build e as serve do próprio domínio (sem layout shift)
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "MoneyTrack — Controle de gastos",
    template: "%s | MoneyTrack",
  },
  description:
    "MoneyTrack: registre receitas e despesas, organize por categorias e acompanhe seu saldo mês a mês.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#121816" },
  ],
};

/** Root layout (Server Component): estrutura HTML comum a todas as páginas */
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-svh font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
