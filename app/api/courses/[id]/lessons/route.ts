import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const CreateLesson = z.object({
  title: z.string().min(3),
  content: z.string().optional(),
  videoUrl: z.string().url().optional(),
  order: z.number().int().positive().optional(),
});

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const cid = Number(params.id);
  const course = await prisma.course.findUnique({ where: { id: cid } });
  if (!course)
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  if (
    !(
      session?.user?.role === "ADMIN" ||
      Number(session?.user?.id) === course.instructorId
    )
  )
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });

  const data = CreateLesson.parse(await req.json());
  const last = await prisma.lesson.findFirst({
    where: { courseId: cid },
    orderBy: { order: "desc" },
  });
  const order = data.order ?? (last ? last.order + 1 : 1);

  const ls = await prisma.lesson.create({
    data: { ...data, order, courseId: cid },
  });
  return NextResponse.json(ls, { status: 201 });
}
