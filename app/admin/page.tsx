// app/admin/page.tsx
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth"; // ✅ Correct path to your authOptions
import { getServerSession } from "next-auth";
import Link from "next/link";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  // 🚫 Guard: only ADMIN can see this page
  if (!session || session.user.role !== "ADMIN") return <p>Access Denied</p>;

  // ✅ Fetch instructors
  const instructors = await prisma.user.findMany({
    where: { role: "INSTRUCTOR" },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      courses: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          published: true,
          lessons: {
            orderBy: { order: "asc" },
            select: { id: true, title: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // ✅ Fetch students
  const students = await prisma.user.findMany({
    where: { role: "STUDENT" },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      enrollments: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          course: {
            select: { id: true, title: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container mx-auto py-10 space-y-10 px-4">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-sm text-zinc-600">
            Instructors with their courses & lessons, and students with their
            enrollments.
          </p>
        </div>
        <div className="text-sm text-zinc-600">
          Hello,{" "}
          <span className="font-semibold">
            {session.user.username || session.user.name || "Admin"}
          </span>
        </div>
      </header>

      {/* INSTRUCTORS SECTION */}
      <section className="card">
        <div className="card-body">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Instructors</h2>
            <div className="text-sm text-zinc-500">
              Total: {instructors.length}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {instructors.length ? (
              instructors.map((i) => (
                <div key={i.id} className="rounded border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">
                        {i.name}{" "}
                        <span className="text-xs text-zinc-500">
                          (@{i.username})
                        </span>
                      </div>
                      <div className="text-xs text-zinc-500">{i.email}</div>
                    </div>
                    <div className="text-xs text-zinc-500">
                      {i.courses.length} course
                      {i.courses.length === 1 ? "" : "s"}
                    </div>
                  </div>

                  <ul className="mt-3 space-y-2">
                    {i.courses.length ? (
                      i.courses.map((course) => (
                        <li key={course.id} className="rounded border p-2">
                          <div className="flex items-center justify-between">
                            <div className="font-medium">{course.title}</div>
                            <div className="text-xs text-zinc-500">
                              {course.published ? "Published" : "Draft"} •{" "}
                              {course.lessons.length} lesson
                              {course.lessons.length === 1 ? "" : "s"}
                            </div>
                          </div>
                          {course.lessons.length > 0 && (
                            <ol className="mt-2 list-decimal pl-5 text-sm text-zinc-700">
                              {course.lessons.map((lesson) => (
                                <li key={lesson.id}>{lesson.title}</li>
                              ))}
                            </ol>
                          )}
                          <div className="mt-2">
                            <Link
                              href={`/courses/${course.id}`}
                              className="text-xs rounded-md border px-2 py-1"
                            >
                              View course
                            </Link>
                          </div>
                        </li>
                      ))
                    ) : (
                      <li className="text-zinc-500 text-sm">No courses yet</li>
                    )}
                  </ul>
                </div>
              ))
            ) : (
              <p className="text-sm text-zinc-500">No instructors found.</p>
            )}
          </div>
        </div>
      </section>

      {/* STUDENTS SECTION */}
      <section className="card">
        <div className="card-body">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Students</h2>
            <div className="text-sm text-zinc-500">
              Total: {students.length}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {students.length ? (
              students.map((student) => (
                <div key={student.id} className="rounded border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">
                        {student.name}{" "}
                        <span className="text-xs text-zinc-500">
                          (@{student.username})
                        </span>
                      </div>
                      <div className="text-xs text-zinc-500">
                        {student.email}
                      </div>
                    </div>
                    <div className="text-xs text-zinc-500">
                      {student.enrollments.length} enrolled
                    </div>
                  </div>

                  <ul className="mt-3 list-disc pl-5 text-sm">
                    {student.enrollments.length ? (
                      student.enrollments.map((enr) => (
                        <li key={enr.id}>
                          <Link
                            href={`/courses/${enr.course.id}`}
                            className="hover:underline"
                          >
                            {enr.course.title}
                          </Link>
                        </li>
                      ))
                    ) : (
                      <li className="text-zinc-500">No enrollments</li>
                    )}
                  </ul>
                </div>
              ))
            ) : (
              <p className="text-sm text-zinc-500">No students found.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
