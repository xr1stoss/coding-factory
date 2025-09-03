import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <section className="container mx-auto py-16 grid gap-8 lg:grid-cols-2 items-center px-4">
      <div>
        <h1 className="text-4xl font-extrabold">
          Learn with <span className="text-blue-600">Goose Academy</span>
        </h1>
        <p className="mt-3 text-zinc-600">
          Udemy-style courses with videos, categories, enrollments & role-based
          access.
        </p>
        <div className="mt-6 flex gap-3">
          <Link className="btn" href="/courses">
            Browse Courses
          </Link>
        </div>
      </div>
      <div className="relative aspect-video rounded-xl overflow-hidden shadow border">
        <Image
          src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&q=80&auto=format&fit=crop"
          alt="Learning"
          fill
          className="object-cover"
        />
      </div>
    </section>
  );
}
