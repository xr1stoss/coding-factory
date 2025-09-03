import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const CreateCourse = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  category: z.string().min(2),
  thumbnailUrl: z.string().url().optional(),
  promoVideoUrl: z.string().url().optional(),
});

export async function GET() {
  const rows = await prisma.course.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    select: { id:true,title:true,description:true,category:true,thumbnailUrl:true,instructor:{select:{name:true}} },
  });
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  if (!role || (role !== 'INSTRUCTOR' && role !== 'ADMIN')) {
    return NextResponse.json({ error: 'FORBIDDEN' }, { status: 403 });
  }
  const data = CreateCourse.parse(await req.json());
  const course = await prisma.course.create({
    data: { ...data, instructorId: Number(session!.user!.id), published: true },
  });
  return NextResponse.json(course, { status: 201 });
}
