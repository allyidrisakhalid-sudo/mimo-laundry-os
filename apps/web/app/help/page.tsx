import { PublicSupportCta } from "../(public)/components/PublicSupportCta";

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <section className="max-w-2xl space-y-3">
        <h1 className="text-3xl font-semibold">Help</h1>
        <p className="text-sm leading-6 text-[var(--color-cloud)]">
          Find quick guidance for common questions, order issues, and support paths.
        </p>
      </section>

      <section className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-semibold">Top questions</h2>
        <div className="mt-4 grid gap-4">
          <div>
            <h3 className="text-sm font-medium">How do I track my order?</h3>
            <p className="mt-1 text-sm text-[var(--color-cloud)]">
              Use the Track page with your order reference.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium">How do I get support?</h3>
            <p className="mt-1 text-sm text-[var(--color-cloud)]">
              Use the WhatsApp contact path for quick help.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold">Issue categories</h2>
          <ul className="mt-4 grid gap-2 text-sm text-[var(--color-cloud)]">
            <li>Tracking and timeline questions</li>
            <li>Pickup and delivery timing</li>
            <li>Payment or receipt questions</li>
            <li>Quality concerns and refund requests</li>
          </ul>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold">Policy summaries</h2>
          <ul className="mt-4 grid gap-2 text-sm text-[var(--color-cloud)]">
            <li>Terms explain service use and responsibilities.</li>
            <li>Privacy explains how data is handled.</li>
            <li>Refund Policy explains when refunds may apply.</li>
          </ul>
        </div>
      </section>

      <section className="mt-8">
        <PublicSupportCta context="help" />
      </section>
    </div>
  );
}
