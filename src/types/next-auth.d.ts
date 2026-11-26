import type { DefaultSession } from "next-auth";

// Module augmentation: adiciona o `id` do usuário à sessão e ao JWT
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
  }
}
