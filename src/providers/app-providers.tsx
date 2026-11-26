"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/atoms/sonner";
import { TooltipProvider } from "@/components/atoms/tooltip";

/**
 * Providers de cliente agrupados em um único componente.
 * O root layout continua sendo Server Component e só "embrulha" os filhos aqui.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  // useState garante um QueryClient por sessão do navegador (não compartilhado entre usuários no SSR)
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30 * 1000,
            retry: 1,
          },
        },
      }),
  );

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider delayDuration={300}>
          {children}
          <Toaster richColors position="top-right" closeButton />
        </TooltipProvider>
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
