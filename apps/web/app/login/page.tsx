import type { Metadata } from "next";
import { createPublicMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPublicMetadata("login");

export default function LoginPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 text-slate-100">
      <div className="space-y-4">
        <h1 className="text-4xl font-semibold">Log in</h1>
        <p className="text-slate-300">
          Secure sign-in for existing Mimo Laundry users.
        </p>
      </div>
    </main>
  );
}
