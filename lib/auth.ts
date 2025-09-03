// lib/auth.ts
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { getServerSession } from "next-auth/next";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";

import type { Session } from "next-auth";
import type { JWT } from "next-auth/jwt";

type Role = "ADMIN" | "INSTRUCTOR" | "STUDENT";

export const authOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: Record<string, unknown> | undefined) {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;

        const user = await prisma.user.findUnique({
          where: { email },
          select: {
            id: true,
            name: true,
            email: true,
            username: true,
            role: true,
            password: true, // for compare only
          },
        });
        if (!user) return null;

        const ok = await compare(password, user.password);
        if (!ok) return null;

        return {
          id: String(user.id),
          name: user.name,
          email: user.email,
          username: user.username ?? null,
          role: user.role as Role | null,
        };
      },
    }),
  ],

  // literal keeps TS happy (no wider `string`)
  session: { strategy: "jwt" as const },

  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: any }): Promise<JWT> {
      // On sign-in, merge user props into the token
      if (user) {
        (token as any).username = (user as any).username ?? null;
        (token as any).role = (user as any).role ?? null;
      }
      return token;
    },

    async session({
      session,
      token,
    }: {
      session: Session;
      token: JWT;
    }): Promise<Session> {
      if (session.user) {
        (session.user as any).id = (token as any).sub;
        (session.user as any).username = (token as any).username ?? null;
        (session.user as any).role = (token as any).role ?? null;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
};

// Server-only helper to avoid repeating casts at call sites
export const getSession = () => getServerSession(authOptions as any);
