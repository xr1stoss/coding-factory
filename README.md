# Goose Academy Pro (Udemy-style)

- Next.js 14 (App Router) + Tailwind CSS
- Prisma + NextAuth (Credentials)
- Roles: Student / Instructor / Admin (Admin is **seeded** only)
- Admin dashboard shows students + their enrollments and instructors + their courses (with lesson counts)
- Students: browse, enroll, see "My Courses"
- Instructors: create courses, manage own courses

## Run
```bash
pnpm install
cp .env.example .env  # fill DATABASE_URL + NEXTAUTH_SECRET
pnpm prisma generate
pnpm db:push
pnpm db:seed
pnpm dev
```
Seeded users:
- Admin: admin@goose.local / admin123
- Instructor: instructor@goose.local / instructor123
- Student: student@goose.local / student123
