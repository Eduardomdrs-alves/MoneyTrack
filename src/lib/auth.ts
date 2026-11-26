import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { AUTH_RATE_LIMITS, enforceRateLimit, getClientIp, RateLimitError } from "@/lib/rate-limit";
import { RATE_LIMIT_ERROR_CODE } from "@/lib/rate-limit-message";
import { loginSchema } from "@/schemas";
import { User } from "@/models/User";

/**
 * Configuração central do NextAuth.js
 * - Provider de credenciais (e-mail + senha com hash bcrypt)
 * - Sessão persistida em um JWT assinado com NEXTAUTH_SECRET (cookie httpOnly)
 */
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credenciais",
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials, request) {
        const parsed = loginSchema.safeParse(credentials);

        try {
          await enforceRateLimit({
            scope: "login-ip",
            identifier: getClientIp(new Headers(request.headers)),
            ...AUTH_RATE_LIMITS.loginIp,
          });
          if (parsed.success) {
            await enforceRateLimit({
              scope: "login-account",
              identifier: parsed.data.email,
              ...AUTH_RATE_LIMITS.loginAccount,
            });
          }
        } catch (error) {
          if (error instanceof RateLimitError) {
            throw new Error(`${RATE_LIMIT_ERROR_CODE}:${error.retryAfter}`);
          }
          throw error;
        }

        if (!parsed.success) return null;

        await connectDB();

        // `select("+password")` força o retorno do campo oculto no schema
        const user = await User.findOne({ email: parsed.data.email }).select("+password");
        if (!user) return null;

        const passwordMatches = await bcrypt.compare(parsed.data.password, user.password);
        if (!passwordMatches) return null;

        // Este objeto é gravado no JWT (nunca inclua a senha!)
        return { id: user._id.toString(), name: user.name, email: user.email };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7, // 7 dias
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    // Executado ao criar/atualizar o token: copia o id do usuário para o JWT
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    // Executado ao ler a sessão: expõe o id do usuário em session.user.id
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id ?? token.sub ?? "";
      }
      return session;
    },
  },
};
