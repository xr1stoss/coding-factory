import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Image from "next/image";
import EnrollButton from "./_EnrollButton";

export default async function CoursePage({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  const session = await getServerSession(authOptions);
  const user = session?.user;

  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      lessons: { orderBy: { order: "asc" } },
      instructor: { select: { name: true } },
    },
  });

  if (!course) {
    return (
      <div className="container mx-auto py-10 px-4">Course not found.</div>
    );
  }

  let isEnrolled = false;
  if (user?.id && user.role === "STUDENT") {
    const existing = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: Number(user.id),
          courseId: id,
        },
      },
      select: { id: true },
    });
    isEnrolled = !!existing;
  }

  return (
    <div className="container mx-auto py-10 grid gap-8 lg:grid-cols-3 px-4">
      <div className="lg:col-span-2 space-y-4">
        <div className="relative aspect-video rounded-lg overflow-hidden border">
          <Image
            src={course.thumbnailUrl ?? "https://picsum.photos/1200/675"}
            alt={course.title}
            fill
            className="object-cover"
          />
        </div>
        <h1 className="text-3xl font-bold">{course.title}</h1>
        <p className="text-zinc-600">{course.description}</p>
        <h2 className="font-semibold mt-6">Lessons</h2>
        <ol className="list-decimal pl-5 space-y-1">
          {course.lessons.map((lesson) => (
            <li key={lesson.id}>{lesson.title}</li>
          ))}
        </ol>
      </div>

      <aside className="space-y-3">
        <div className="card">
          <div className="card-body">
            <div className="text-sm text-zinc-500">Instructor</div>
            <div className="font-medium">{course.instructor?.name}</div>

            {/* 🧠 ENROLL LOGIC */}
            <div className="mt-4">
              {!user && (
                <a className="btn" href="/login">
                  Login to enroll
                </a>
              )}

              {user?.role === "STUDENT" && !isEnrolled && (
                <EnrollButton courseId={id} />
              )}

              {user?.role === "STUDENT" && isEnrolled && (
                <span className="inline-block rounded bg-green-100 px-3 py-1 text-green-700">
                  Enrolled
                </span>
              )}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
