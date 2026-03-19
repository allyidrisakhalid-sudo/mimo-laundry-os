import type { Metadata } from "next";
import { createPublicMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPublicMetadata("signup");

export default function SignupPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 text-slate-100">
      <div className="space-y-4">
        <h1 className="text-4xl font-semibold">Create your account</h1>
        <p className="text-slate-300">
          Create a new customer account through the correct entry path.
        </p>
      </div>
    </main>
  );
}
