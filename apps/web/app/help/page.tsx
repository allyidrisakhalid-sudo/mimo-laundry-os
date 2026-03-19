import type { Metadata } from "next";
import { createPublicMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPublicMetadata("help");

export default function HelpPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16 text-slate-100">
      <div className="space-y-4">
        <h1 className="text-4xl font-semibold">Help and support</h1>
        <p className="text-slate-300">
          Get answers, support guidance, and the right next step for your order.
        </p>
      </div>
    </main>
  );
}
