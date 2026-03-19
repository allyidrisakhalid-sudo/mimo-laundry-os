"use client";

import { ContextHelpBlock, CustomerFirstRun, PortalHelpEntry, useCustomerOnboardingGate, useOnboardingMessages } from "../_components/p2Onboarding";

function CustomerHome() {
  const { locale, t } = useOnboardingMessages();

  return (
    <main style={{ display: "grid", gap: 24 }}>
      <section
        style={{
          border: "1px solid var(--color-mist, #d7dce3)",
          borderRadius: 24,
          padding: 24,
          background: "var(--color-silk, #f8f6f2)",
        }}
      >
        <div style={{ display: "grid", gap: 12 }}>
          <h1 style={{ margin: 0 }}>{t.customer.homeTitle}</h1>
          <p style={{ margin: 0 }}>{t.customer.homeBody}</p>
          <PortalHelpEntry locale={locale} />
        </div>
      </section>

      <section
        style={{
          border: "1px solid var(--color-mist, #d7dce3)",
          borderRadius: 24,
          padding: 24,
          background: "white",
        }}
      >
        <div style={{ display: "grid", gap: 10 }}>
          <h2 style={{ margin: 0 }}>{t.customer.ordersTitle}</h2>
          <p style={{ margin: 0 }}>{t.customer.ordersBody}</p>
        </div>
      </section>

      <ContextHelpBlock locale={locale} title={t.customer.profileTitle} kind="general" />
      <ContextHelpBlock locale={locale} title={t.customer.orderDetailTitle} kind="order" />
    </main>
  );
}

export default function CustomerPage() {
  const { ready, needsOnboarding, markDone } = useCustomerOnboardingGate();
  const { t } = useOnboardingMessages();

  if (!ready) {
    return <main><p>{t.common.loading}</p></main>;
  }

  if (needsOnboarding) {
    return <CustomerFirstRun onDone={markDone} />;
  }

  return <CustomerHome />;
}
