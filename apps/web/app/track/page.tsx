import type { Metadata } from "next";
import { createPublicMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPublicMetadata("track");

export default function TrackPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16 text-slate-100">
      <div className="space-y-4">
        <h1 className="text-4xl font-semibold">Track your order</h1>
        <p className="text-slate-300">
          Follow progress clearly from pickup to return.
        </p>
      </div>
    </main>
  );
}
