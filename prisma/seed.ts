import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();

async function main() {
  // Admin seeded
  const adminPass = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@goose.local' },
    update: { role: Role.ADMIN },
    create: {
      username: 'admin',
      email: 'admin@goose.local',
      name: 'Admin',
      password: adminPass,
      role: Role.ADMIN,
    },
  });

  // Example instructor & student
  const instrPass = await bcrypt.hash('instructor123', 10);
  const studPass  = await bcrypt.hash('student123', 10);

  const instructor = await prisma.user.upsert({
    where: { email: 'instructor@goose.local' },
    update: { role: Role.INSTRUCTOR },
    create: {
      username: 'instructor',
      email: 'instructor@goose.local',
      name: 'John Instructor',
      password: instrPass,
      role: Role.INSTRUCTOR,
    },
  });

  const student = await prisma.user.upsert({
    where: { email: 'student@goose.local' },
    update: { role: Role.STUDENT },
    create: {
      username: 'student',
      email: 'student@goose.local',
      name: 'Alice Student',
      password: studPass,
      role: Role.STUDENT,
    },
  });

  // Courses
  const react = await prisma.course.create({
    data: {
      title: 'React & Next.js Bootcamp',
      description: 'Build production-grade apps with Next.js App Router, Tailwind, Prisma, and Auth.',
      category: 'Web Development',
      thumbnailUrl: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=1200&q=80&auto=format&fit=crop',
      instructorId: instructor.id,
      published: true,
      lessons: { create: [
        { title: 'Welcome & Setup', content: 'Install Node, pnpm, and VS Code', order: 1 },
        { title: 'App Router Basics', content: 'Routes, layouts, metadata', order: 2 },
        { title: 'Data Layer with Prisma', content: 'Models, migrations, queries', order: 3 },
      ]},
    },
  });

  const sql = await prisma.course.create({
    data: {
      title: 'Relational Databases with SQL',
      description: 'Design schemas, write queries, and use ORMs like Prisma.',
      category: 'Data',
      thumbnailUrl: 'https://picsum.photos/seed/sql/1200/675',
      instructorId: instructor.id,
      published: true,
      lessons: { create: [
        { title: 'ER Modeling', content: 'Entities & relationships', order: 1 },
        { title: 'SQL Queries', content: 'SELECT/INSERT/UPDATE/DELETE', order: 2 },
        { title: 'Prisma ORM', content: 'Models, relations, migrations', order: 3 },
      ]},
    },
  });

  for (const c of [react, sql]) {
    await prisma.enrollment.upsert({
      where: { userId_courseId: { userId: student.id, courseId: c.id } },
      update: {},
      create: { userId: student.id, courseId: c.id },
    });
  }

  console.log('Seeded ✓');
}

main().finally(() => prisma.$disconnect());
