import "server-only";
import { createHash } from "node:crypto";
import { isIP } from "node:net";
import { connectDB } from "@/lib/db";
import { AppError } from "@/lib/errors";
import { getRateLimitMessage } from "@/lib/rate-limit-message";
import { RateLimit } from "@/models/RateLimit";

const MINUTE = 60 * 1000;

export const AUTH_RATE_LIMITS = {
  loginIp: { limit: 30, windowMs: 15 * MINUTE },
  loginAccount: { limit: 5, windowMs: 15 * MINUTE },
  registerIp: { limit: 3, windowMs: 60 * MINUTE },
} as const;

export class RateLimitError extends AppError {
  constructor(public readonly retryAfter: number) {
    super(getRateLimitMessage(retryAfter), 429);
    this.name = "RateLimitError";
  }
}

/** A hospedagem deve sobrescrever os headers de IP antes de encaminhar a requisição. */
export function getClientIp(headers: Pick<Headers, "get">): string {
  const forwarded = process.env.VERCEL
    ? headers.get("x-vercel-forwarded-for")
    : headers.get("x-forwarded-for") ?? headers.get("x-real-ip");
  const ip = forwarded?.split(",")[0]?.trim();
  if (!ip || !isIP(ip)) return "unknown";

  // Evita contadores diferentes para representações equivalentes de IPv6.
  return isIP(ip) === 6 ? new URL(`http://[${ip}]/`).hostname.slice(1, -1) : ip;
}

interface RateLimitOptions {
  scope: string;
  identifier: string;
  limit: number;
  windowMs: number;
}

/** Contador atômico compartilhado entre processos, com janela fixa e limpeza por TTL. */
export async function enforceRateLimit({ scope, identifier, limit, windowMs }: RateLimitOptions): Promise<void> {
  await connectDB();

  const window = Math.floor(Date.now() / windowMs);
  const expiresAt = new Date((window + 1) * windowMs);
  const key = createHash("sha256").update(JSON.stringify([scope, identifier, window])).digest("hex");
  const consume = () =>
    RateLimit.findOneAndUpdate(
      { _id: key },
      { $inc: { attempts: 1 }, $setOnInsert: { expiresAt } },
      { upsert: true, returnDocument: "after" },
    ).lean();

  let bucket;
  try {
    bucket = await consume();
  } catch (error) {
    // Duas instâncias podem tentar criar o primeiro contador ao mesmo tempo.
    if (!error || typeof error !== "object" || !("code" in error) || error.code !== 11000) throw error;
    bucket = await consume();
  }

  if (!bucket) throw new Error("Não foi possível verificar o limite de tentativas.");
  if (bucket.attempts > limit) {
    throw new RateLimitError(Math.max(1, Math.ceil((expiresAt.getTime() - Date.now()) / 1000)));
  }
}
