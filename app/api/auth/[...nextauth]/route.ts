import NextAuth from "next-auth/next";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions as any); // cast to avoid type drift
export { handler as GET, handler as POST };
