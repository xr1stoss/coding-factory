"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"; // ✅ Sonner toast

export default function NewCourse() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "General",
    thumbnailUrl: "",
    promoVideoUrl: "",
  });

  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);

    const res = await fetch("/api/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        thumbnailUrl: form.thumbnailUrl || undefined,
        promoVideoUrl: form.promoVideoUrl || undefined,
      }),
    });

    setSaving(false);

    if (res.ok) {
      const course = await res.json();
      toast.success("Course created!");
      router.push(`/courses/${course.id}`);
    } else {
      toast.error("Failed to create course");
    }
  }

  return (
    <div className="container mx-auto py-10 max-w-2xl px-4">
      <h1 className="text-2xl font-bold mb-6">Create Course</h1>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="Course title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Course description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            placeholder="e.g. Web Dev"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="thumbnailUrl">Thumbnail URL</Label>
          <Input
            id="thumbnailUrl"
            placeholder="https://example.com/image.png"
            value={form.thumbnailUrl}
            onChange={(e) => setForm({ ...form, thumbnailUrl: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="promoVideoUrl">Promo Video URL</Label>
          <Input
            id="promoVideoUrl"
            placeholder="https://example.com/video.mp4 (optional)"
            value={form.promoVideoUrl}
            onChange={(e) =>
              setForm({ ...form, promoVideoUrl: e.target.value })
            }
          />
        </div>

        <Button type="submit" disabled={saving} className="w-full">
          {saving ? "Creating…" : "Create Course"}
        </Button>
      </form>
    </div>
  );
}
