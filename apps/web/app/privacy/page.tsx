export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <article className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8">
        <h1 className="text-3xl font-semibold">Privacy</h1>
        <p className="text-sm leading-6 text-[var(--color-cloud)]">
          This page explains how Mimo handles customer and operational information.
        </p>
        <section>
          <h2 className="text-lg font-semibold">Information used</h2>
          <p className="mt-2 text-sm text-[var(--color-cloud)]">
            Contact details, addresses, and order-related information are used to operate the service.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold">Protection and access</h2>
          <p className="mt-2 text-sm text-[var(--color-cloud)]">
            Access is controlled by role and operational need.
          </p>
        </section>
      </article>
    </div>
  );
}
