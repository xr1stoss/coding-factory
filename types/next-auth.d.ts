// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: "ADMIN" | "INSTRUCTOR" | "STUDENT";
      username?: string;
    };
  }

  interface User {
    role?: "ADMIN" | "INSTRUCTOR" | "STUDENT";
    username?: string;
  }
}
