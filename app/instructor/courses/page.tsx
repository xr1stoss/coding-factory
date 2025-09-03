import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import type { Session } from "next-auth";

export default async function InstructorCourses() {
  const session: Session | null = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "INSTRUCTOR") {
    return (
      <p className="text-center py-10">
        Access denied. Please login as an instructor.
      </p>
    );
  }

  const courses = await prisma.course.findMany({
    where: { instructorId: Number(session.user.id) },
    orderBy: { createdAt: "desc" },
    include: {
      lessons: {
        orderBy: { order: "asc" },
        select: { id: true, title: true },
      },
    },
  });

  return (
    <div className="container mx-auto py-10 px-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Courses</h1>
        <Link
          href="/instructor/courses/new"
          className="rounded bg-blue-600 text-white px-4 py-2 text-sm"
        >
          + New Course
        </Link>
      </div>

      {courses.length === 0 ? (
        <p className="text-zinc-600">You haven’t created any courses yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
            >
              <h2 className="text-lg font-semibold">{course.title}</h2>
              <p className="text-sm text-zinc-600 mt-1 line-clamp-2">
                {course.description || "No description provided."}
              </p>

              <div className="mt-3 text-sm text-zinc-500">
                {course.lessons.length} lesson
                {course.lessons.length === 1 ? "" : "s"}
              </div>

              {course.lessons.length > 0 && (
                <ul className="mt-2 list-disc pl-5 text-sm text-zinc-700">
                  {course.lessons.slice(0, 3).map((lesson) => (
                    <li key={lesson.id}>{lesson.title}</li>
                  ))}
                  {course.lessons.length > 3 && (
                    <li className="text-zinc-500 italic">+ more</li>
                  )}
                </ul>
              )}

              {/* <Link
                href={`/instructor/courses/${course.id}`}
                className="mt-4 inline-block text-blue-600 text-sm font-medium"
              >
                Manage →
              </Link> */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
