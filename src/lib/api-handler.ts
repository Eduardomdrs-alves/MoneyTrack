import "server-only";
import { NextResponse, type NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { normalizeError } from "@/lib/errors";
import type { ApiErrorBody } from "@/types";

type AuthedHandler<Ctx> = (request: NextRequest, context: Ctx, userId: string) => Promise<Response>;

/**
 * Proteção das API Routes (camada de backend).
 * Envolve o handler, valida a sessão JWT e centraliza o tratamento de erros.
 * Sem sessão -> 401, mesmo que alguém chame a API diretamente (curl/Postman).
 */
export function withAuth<Ctx>(handler: AuthedHandler<Ctx>) {
  return async (request: NextRequest, context: Ctx): Promise<Response> => {
    try {
      const session = await getServerSession(authOptions);
      if (!session?.user?.id) {
        return NextResponse.json<ApiErrorBody>(
          { error: "Não autenticado. Faça login para continuar." },
          { status: 401 },
        );
      }
      return await handler(request, context, session.user.id);
    } catch (error) {
      const { status, error: message, fieldErrors } = normalizeError(error);
      return NextResponse.json<ApiErrorBody>({ error: message, fieldErrors }, { status });
    }
  };
}
