import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });

  const { courseId } = await req.json();
  const cid = Number(courseId);
  const uid = Number(session.user.id);
  if (!Number.isInteger(cid)) return NextResponse.json({ error: 'INVALID_ID' }, { status: 400 });

  const exists = await prisma.course.findUnique({ where: { id: cid, published: true } });
  if (!exists) return NextResponse.json({ error: 'COURSE_NOT_FOUND' }, { status: 404 });

  const enr = await prisma.enrollment.upsert({
    where: { userId_courseId: { userId: uid, courseId: cid } },
    update: {},
    create: { userId: uid, courseId: cid },
  });

  return NextResponse.json({ ok: true, id: enr.id });
}
