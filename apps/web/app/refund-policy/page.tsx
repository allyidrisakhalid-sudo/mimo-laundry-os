export default function RefundPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <article className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8">
        <h1 className="text-3xl font-semibold">Refund Policy</h1>
        <p className="text-sm leading-6 text-[var(--color-cloud)]">
          This page explains the basic conditions for refund review and resolution.
        </p>
        <section>
          <h2 className="text-lg font-semibold">When refunds may apply</h2>
          <p className="mt-2 text-sm text-[var(--color-cloud)]">
            Refund requests may apply when service outcomes materially fail against agreed expectations.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold">How requests are handled</h2>
          <p className="mt-2 text-sm text-[var(--color-cloud)]">
            Support reviews the issue, checks the order record, and communicates the outcome clearly.
          </p>
        </section>
      </article>
    </div>
  );
}
