// types/next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth";
import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  // What your DB/user object can have
  interface User extends DefaultUser {
    id: string | number;
    role?: "ADMIN" | "INSTRUCTOR" | "STUDENT";
    username?: string | null;
  }

  // What ends up on `session`
  interface Session extends DefaultSession {
    user: {
      id?: string | number;
      role?: "ADMIN" | "INSTRUCTOR" | "STUDENT";
      username?: string | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "ADMIN" | "INSTRUCTOR" | "STUDENT";
    username?: string | null;
  }
}

export {};
