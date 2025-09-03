import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';

export default async function CoursesPage() {
  const courses = await prisma.course.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    select: { id:true,title:true,description:true,category:true,thumbnailUrl:true,instructor:{select:{name:true}} }
  });

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">All Courses</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map(c => (
          <Link key={c.id} href={`/courses/${c.id}`} className="card overflow-hidden hover:shadow">
            <div className="relative aspect-video">
              <Image src={c.thumbnailUrl ?? 'https://picsum.photos/800/450'} alt={c.title} fill className="object-cover"/>
            </div>
            <div className="card-body">
              <div className="text-xs text-blue-600">{c.category}</div>
              <h3 className="font-semibold">{c.title}</h3>
              <p className="text-sm text-zinc-600 line-clamp-2">{c.description}</p>
              <div className="mt-2 text-xs text-zinc-500">By {c.instructor?.name ?? 'Instructor'}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
