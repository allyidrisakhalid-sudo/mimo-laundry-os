"use client";

import { PortalHelpEntry, useOnboardingMessages } from "../_components/p2Onboarding";

export default function DevPage() {
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
          <h1 style={{ margin: 0 }}>{t.adminDev.title}</h1>
          <p style={{ margin: 0 }}>{t.help.adminDevBody}</p>
          <PortalHelpEntry locale={locale} label={t.help.label} />
        </div>
      </section>
    </main>
  );
}
