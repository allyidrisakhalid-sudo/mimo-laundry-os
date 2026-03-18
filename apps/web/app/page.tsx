import Link from "next/link";
import { PublicSupportCta } from "./(public)/components/PublicSupportCta";

function Section({ children }: { children: React.ReactNode }) {
  return <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">{children}</section>;
}

export default function HomePage() {
  return (
    <div>
      <Section>
        <div className="max-w-2xl space-y-6">
          <span className="inline-flex rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-[var(--color-cloud)]">
            Laundry that feels calm
          </span>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Pickup, care, and return without the usual laundry stress.
          </h1>
          <p className="max-w-xl text-base leading-7 text-[var(--color-cloud)]">
            Mimo makes it easy to place an order, follow progress clearly, and get support quickly when needed.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/signup"
              className="rounded-full bg-[var(--color-silk)] px-5 py-3 text-sm font-medium text-[var(--color-midnight)]"
            >
              Start now
            </Link>
            <Link
              href="/track"
              className="rounded-full border border-white/10 px-5 py-3 text-sm font-medium text-[var(--color-silk)]"
            >
              Track order
            </Link>
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold">How it works</h2>
            <p className="mt-3 text-sm text-[var(--color-cloud)]">
              Start your order, hand off your laundry, and follow every key update from intake to return.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold">Areas served</h2>
            <p className="mt-3 text-sm text-[var(--color-cloud)]">
              Service availability follows defined areas so pickup, processing, and return stay reliable.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold">Trust and service proof</h2>
            <p className="mt-3 text-sm text-[var(--color-cloud)]">
              Clear order tracking, careful handling, and human support help every order feel accountable.
            </p>
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold">Partner with Mimo</h2>
            <p className="mt-3 text-sm text-[var(--color-cloud)]">
              For shops and partners who want a reliable laundry operating layer without building it alone.
            </p>
            <div className="mt-5">
              <Link href="/partners" className="rounded-full border border-white/10 px-4 py-2 text-sm">
                Explore partnerships
              </Link>
            </div>
          </div>

          <PublicSupportCta context="home" />
        </div>
      </Section>

      <Section>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
          <h2 className="text-2xl font-semibold">Ready to start your first order?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-[var(--color-cloud)]">
            Open an account, place your request, and track everything with calm visibility.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/signup"
              className="rounded-full bg-[var(--color-silk)] px-5 py-3 text-sm font-medium text-[var(--color-midnight)]"
            >
              Start now
            </Link>
            <Link
              href="/help"
              className="rounded-full border border-white/10 px-5 py-3 text-sm font-medium"
            >
              Get help
            </Link>
          </div>
        </div>
      </Section>
    </div>
  );
}
