export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <article className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8">
        <h1 className="text-3xl font-semibold">Terms</h1>
        <p className="text-sm leading-6 text-[var(--color-cloud)]">
          These terms explain the basic rules for using Mimo services.
        </p>
        <section>
          <h2 className="text-lg font-semibold">Service use</h2>
          <p className="mt-2 text-sm text-[var(--color-cloud)]">
            Orders, support, and account activity must be used responsibly and accurately.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold">Order handling</h2>
          <p className="mt-2 text-sm text-[var(--color-cloud)]">
            Timelines, intake details, and service outcomes follow operational records and applicable policies.
          </p>
        </section>
      </article>
    </div>
  );
}
