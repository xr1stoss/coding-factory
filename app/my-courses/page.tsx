import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function MyCourses() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const userId = Number(session.user.id);
  const rows = await prisma.enrollment.findMany({
    where: { userId },
    include: { course: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">My Courses</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map(r => (
          <div key={r.id} className="card">
            <div className="card-body">
              <h3 className="font-semibold">{r.course.title}</h3>
              <p className="text-sm text-zinc-600 line-clamp-2">{r.course.description}</p>
              <Link href={`/courses/${r.courseId}`} className="mt-3 inline-block rounded-md border px-3 py-1">Open</Link>
            </div>
          </div>
        ))}
        {rows.length === 0 && <p>You haven’t enrolled in any course yet.</p>}
      </div>
    </div>
  );
}
