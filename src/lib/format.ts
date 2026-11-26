import { APP_TIMEZONE } from "@/lib/constants";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const compactCurrencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  notation: "compact",
  maximumFractionDigits: 1,
});

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}

export function formatCompactCurrency(value: number): string {
  return compactCurrencyFormatter.format(value);
}

const MONTH_REGEX = /^\d{4}-(0[1-9]|1[0-2])$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export function isValidMonth(value: unknown): value is string {
  return typeof value === "string" && MONTH_REGEX.test(value);
}

export function isValidISODate(value: string): boolean {
  if (!DATE_REGEX.test(value)) return false;
  const date = new Date(`${value}T12:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
}

/** Data de hoje (YYYY-MM-DD) no fuso da aplicação */
export function todayISO(): string {
  // O locale en-CA formata como YYYY-MM-DD
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: APP_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

/** Mês atual (YYYY-MM) no fuso da aplicação */
export function currentMonth(): string {
  return todayISO().slice(0, 7);
}

/** Avança/volta `delta` meses a partir de um mês YYYY-MM */
export function shiftMonth(month: string, delta: number): string {
  const [year, m] = month.split("-").map(Number);
  const date = new Date(Date.UTC(year, m - 1 + delta, 1));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

/** Intervalo [início, fim) de um mês em UTC, usado nas consultas ao banco */
export function monthRange(month: string): { start: Date; end: Date } {
  const [year, m] = month.split("-").map(Number);
  return {
    start: new Date(Date.UTC(year, m - 1, 1)),
    end: new Date(Date.UTC(year, m, 1)),
  };
}

/** "novembro de 2026" (long) ou "nov" (short) */
export function formatMonth(month: string, style: "long" | "short" = "long"): string {
  const [year, m] = month.split("-").map(Number);
  const date = new Date(Date.UTC(year, m - 1, 15));
  if (style === "short") {
    return new Intl.DateTimeFormat("pt-BR", { month: "short", timeZone: "UTC" })
      .format(date)
      .replace(".", "");
  }
  return new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

/** As datas são gravadas ao meio-dia UTC, então sempre formatamos em UTC */
export function formatDate(isoDate: string, style: "short" | "long" = "short"): string {
  const date = new Date(`${isoDate.slice(0, 10)}T12:00:00Z`);
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: style === "short" ? "short" : "long",
    year: "numeric",
    timeZone: "UTC",
  })
    .format(date)
    .replace(".", "");
}

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: APP_TIMEZONE,
  }).format(new Date(iso));
}

/** Converte YYYY-MM-DD em Date (meio-dia UTC evita "pular" de dia por causa do fuso) */
export function isoDateToDate(isoDate: string): Date {
  return new Date(`${isoDate}T12:00:00.000Z`);
}

/** "novembro de 2026" -> "Novembro de 2026" (só a primeira letra) */
export function capitalizeFirst(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function firstName(name?: string | null): string {
  return name?.trim().split(/\s+/)[0] ?? "";
}

export function initials(name?: string | null): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}
