// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import NavBar from "@/components/NavBar";
import { Providers } from "./providers"; // ✅ Import Providers

export const metadata: Metadata = {
  title: "Goose Academy",
  description: "Real-world Udemy-style app with roles",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-zinc-50 text-zinc-900">
        <Providers>
          {" "}
          {/* ✅ Wrap everything in SessionProvider */}
          <NavBar />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
