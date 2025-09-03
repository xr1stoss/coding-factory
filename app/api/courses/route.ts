import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next"; // ✅ v4 App Router import
import { authOptions } from "@/lib/auth";
import { z } from "zod";

// minimal local typing for this file only
type SessionUser = {
  id?: string | number;
  role?: "ADMIN" | "INSTRUCTOR" | "STUDENT";
};
type AppSession = { user?: SessionUser } | null;

const UpdateCourse = z.object({
  title: z.string().min(3).optional(),
  description: z.string().min(10).optional(),
  category: z.string().min(2).optional(),
  thumbnailUrl: z.string().url().optional().nullable(),
  promoVideoUrl: z.string().url().optional().nullable(),
  published: z.boolean().optional(),
});

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      lessons: { orderBy: { order: "asc" } },
      instructor: { select: { name: true } },
    },
  });
  if (!course)
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  return NextResponse.json(course);
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  const session = (await getServerSession(authOptions)) as AppSession;
  const me = Number(session?.user?.id);
  const role = session?.user?.role;

  const course = await prisma.course.findUnique({ where: { id } });
  if (!course)
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });

  if (!(role === "ADMIN" || course.instructorId === me)) {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }

  const data = UpdateCourse.parse(await req.json());
  const updated = await prisma.course.update({ where: { id }, data });
  return NextResponse.json(updated);
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  const session = (await getServerSession(authOptions)) as AppSession;
  const me = Number(session?.user?.id);
  const role = session?.user?.role;

  const course = await prisma.course.findUnique({ where: { id } });
  if (!course)
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });

  if (!(role === "ADMIN" || course.instructorId === me)) {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }

  await prisma.course.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
