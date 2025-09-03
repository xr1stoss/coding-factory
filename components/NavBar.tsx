"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

type AppUser = {
  id?: string | number;
  role?: "ADMIN" | "INSTRUCTOR" | "STUDENT";
  username?: string | null;
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

export default function NavBar() {
  const { data: session, status } = useSession();
  const user = session?.user as AppUser | undefined; // 👈 cast here

  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto h-14 flex items-center justify-between px-4">
        <Link href="/" className="text-lg font-semibold text-blue-600">
          Goose Academy
        </Link>

        <div className="flex items-center gap-4 text-sm">
          <Link href="/courses">All Courses</Link>

          {user?.role === "STUDENT" && (
            <Link href="/my-courses">My Courses</Link>
          )}

          {user?.role === "INSTRUCTOR" && (
            <Link href="/instructor/courses">My Courses</Link>
          )}

          {user?.role === "ADMIN" && <Link href="/admin">Admin</Link>}

          {status === "loading" ? null : !user ? (
            <>
              <Link href="/login">Login</Link>
              <Link
                href="/register"
                className="rounded-md bg-blue-600 px-3 py-1 text-white"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <span className="text-zinc-600">
                Hello, <b>{user.username ?? user.name ?? "User"}</b>
              </span>
              <form action="/api/auth/signout" method="post">
                <button type="submit" className="rounded-md border px-3 py-1">
                  Logout
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
