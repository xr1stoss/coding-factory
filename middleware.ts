// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const { pathname } = req.nextUrl;

  // Redirect unauthenticated users trying to access protected routes
  if (pathname.startsWith("/admin")) {
    if (!token || token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  if (pathname.startsWith("/instructor")) {
    if (!token || (token.role !== "INSTRUCTOR" && token.role !== "ADMIN")) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  if (pathname.startsWith("/my-courses")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/instructor/:path*", "/my-courses/:path*"],
};
