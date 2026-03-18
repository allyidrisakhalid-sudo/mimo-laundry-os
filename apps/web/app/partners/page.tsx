import Link from "next/link";
import { PublicSupportCta } from "../(public)/components/PublicSupportCta";

export default function PartnersPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <section className="max-w-2xl space-y-4">
        <h1 className="text-3xl font-semibold">Partner with Mimo</h1>
        <p className="text-sm leading-6 text-[var(--color-cloud)]">
          Join a laundry operating model designed to help trusted shops serve customers with more structure and visibility.
        </p>
      </section>

      <section className="mt-10 grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold">Why partner with Mimo</h2>
          <p className="mt-3 text-sm text-[var(--color-cloud)]">
            Clear workflows, order visibility, and service consistency help shops operate with confidence.
          </p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold">How partnership works</h2>
          <p className="mt-3 text-sm text-[var(--color-cloud)]">
            Your shop captures orders, stays inside its own scope, and follows a simple service flow.
          </p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold">Who this is for</h2>
          <p className="mt-3 text-sm text-[var(--color-cloud)]">
            Best for shops that want a structured, trustworthy laundry operating partner.
          </p>
        </div>
      </section>

      <section className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold">Ready to explore partnership?</h2>
          <p className="mt-3 text-sm text-[var(--color-cloud)]">
            Start with a conversation and understand the fit before any deeper onboarding step.
          </p>
          <div className="mt-5">
            <Link
              href="/signup"
              className="rounded-full bg-[var(--color-silk)] px-5 py-3 text-sm font-medium text-[var(--color-midnight)]"
            >
              Start now
            </Link>
          </div>
        </div>

        <PublicSupportCta context="partners" />
      </section>

      <section className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-semibold">Mini FAQ</h2>
        <div className="mt-4 grid gap-4">
          <div>
            <h3 className="text-sm font-medium">Do I need a large team?</h3>
            <p className="mt-1 text-sm text-[var(--color-cloud)]">
              No. The model is designed to stay clear and manageable.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium">Will I see other shops data?</h3>
            <p className="mt-1 text-sm text-[var(--color-cloud)]">
              No. Each partner stays within its own scoped workspace.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
