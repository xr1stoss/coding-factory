// ✅ [1] BACKEND: /app/api/auth/register/route.ts

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, username, name, password, role } = body;

  if (!email || !password || !username || !name) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "Email already registered" },
      { status: 400 }
    );
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      username,
      name,
      password: hashed,
      role: role || "STUDENT",
    },
  });

  return NextResponse.json(user);
}
