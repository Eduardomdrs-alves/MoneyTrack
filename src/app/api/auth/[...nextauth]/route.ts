import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Endpoints do NextAuth: /api/auth/signin, /api/auth/callback, /api/auth/session, /api/auth/signout...
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
