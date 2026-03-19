import type { Metadata } from "next";
import Link from "next/link";
import { createPublicMetadata } from "@/lib/seo/metadata";
import {
  getLocalBusinessStructuredData,
  getWebsiteStructuredData,
  toStructuredDataScript,
} from "@/lib/seo/structured-data";

export const metadata: Metadata = createPublicMetadata("home");

const websiteStructuredData = toStructuredDataScript(getWebsiteStructuredData());
const localBusinessStructuredData = toStructuredDataScript(getLocalBusinessStructuredData());

const links = [
  { href: "/track", label: "Track order", note: "Follow progress clearly from pickup to return." },
  { href: "/partners", label: "Partners", note: "Apply as an affiliate or business partner." },
  { href: "/help", label: "Help", note: "Get support guidance, answers, and next steps." },
  { href: "/login", label: "Log in", note: "Secure access for existing users." },
  { href: "/signup", label: "Sign up", note: "Create a new customer account." },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-slate-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: websiteStructuredData }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: localBusinessStructuredData }}
      />
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <section className="max-w-3xl space-y-4">
          <span className="inline-flex rounded-full border border-white/15 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-300">
            Mimo Laundry
          </span>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Laundry pickup, care, tracking, and return without confusion.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            Mimo Laundry keeps home and business laundry moving through one calm, premium flow with clear tracking and support.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:border-white/20 hover:bg-white/10"
            >
              <div className="text-xl font-medium">{link.label}</div>
              <div className="mt-2 text-sm text-slate-300">{link.note}</div>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
