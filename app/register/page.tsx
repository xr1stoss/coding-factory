"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner"; // ✅ Use Sonner directly

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    name: "",
    password: "",
    role: "STUDENT",
  });
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setBusy(false);

    if (res.ok) {
      toast.success("Account created!", {
        description: "You can now log in using your credentials.",
      });

      setTimeout(() => {
        router.push("/login?registered=1");
      }, 1500);
    } else {
      const { error } = await res.json();
      toast.error("Registration failed", {
        description: error || "Something went wrong.",
      });
    }
  }

  return (
    <div className="max-w-md mx-auto py-10 px-4 space-y-6">
      <h1 className="text-2xl font-bold">Create an account</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            id="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="role">Role</Label>
          <Select
            value={form.role}
            onValueChange={(val) => setForm({ ...form, role: val })}
          >
            <SelectTrigger id="role">
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="STUDENT">Student</SelectItem>
              <SelectItem value="INSTRUCTOR">Instructor</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <p className="text-sm text-muted-foreground">
          Only <strong>Student</strong> and <strong>Instructor</strong> roles
          are publicly available.
        </p>

        <Button type="submit" className="w-full" disabled={busy}>
          {busy ? "Creating..." : "Register"}
        </Button>
      </form>
    </div>
  );
}
