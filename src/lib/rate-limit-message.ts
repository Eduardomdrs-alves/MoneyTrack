export const RATE_LIMIT_ERROR_CODE = "RateLimitExceeded";

export function parseRateLimitError(error: string | null | undefined): number | null {
  const prefix = `${RATE_LIMIT_ERROR_CODE}:`;
  if (!error?.startsWith(prefix)) return null;

  const seconds = Number(error.slice(prefix.length));
  return Number.isSafeInteger(seconds) && seconds > 0 ? seconds : null;
}

export function getRateLimitMessage(retryAfter: number): string {
  const minutes = Math.ceil(retryAfter / 60);
  return `Muitas tentativas. Tente novamente em ${minutes} ${minutes === 1 ? "minuto" : "minutos"}.`;
}
