import type { Metadata } from "next";
import { createPublicMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPublicMetadata("terms");

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16 text-slate-100">
      <div className="space-y-4">
        <h1 className="text-4xl font-semibold">Terms and conditions</h1>
        <p className="text-slate-300">
          Review the service terms and conditions for using Mimo Laundry.
        </p>
      </div>
    </main>
  );
}
