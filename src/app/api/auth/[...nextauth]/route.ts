import NextAuth from "next-auth";
import type { NextRequest } from "next/server";
import { authOptions } from "@/lib/auth";
import { getRateLimitMessage, parseRateLimitError } from "@/lib/rate-limit-message";

type Context = { params: Promise<{ nextauth: string[] }> };

// Endpoints do NextAuth: /api/auth/signin, /api/auth/callback, /api/auth/session, /api/auth/signout...
const handler: (request: NextRequest, context: Context) => Promise<Response> = NextAuth(authOptions);

export { handler as GET };

export async function POST(request: NextRequest, context: Context): Promise<Response> {
  const response = await handler(request, context);
  if (response.status !== 401 && response.status !== 302) return response;

  // O NextAuth v4 transforma erros de authorize em 401. Preservamos seu contrato,
  // mas usamos 429 e Retry-After quando o motivo é o rate limiting.
  let errorUrl = response.headers.get("Location");
  if (!errorUrl && response.headers.get("Content-Type")?.includes("application/json")) {
    const body: unknown = await response.clone().json();
    if (body && typeof body === "object" && "url" in body && typeof body.url === "string") {
      errorUrl = body.url;
    }
  }

  const retryAfter = errorUrl
    ? parseRateLimitError(new URL(errorUrl, request.url).searchParams.get("error"))
    : null;
  if (!retryAfter) return response;

  const responseHeaders = new Headers(response.headers);
  responseHeaders.delete("Location");
  responseHeaders.set("Retry-After", String(retryAfter));
  responseHeaders.set("Cache-Control", "no-store");

  return Response.json(
    { url: errorUrl, error: getRateLimitMessage(retryAfter) },
    { status: 429, headers: responseHeaders },
  );
}
