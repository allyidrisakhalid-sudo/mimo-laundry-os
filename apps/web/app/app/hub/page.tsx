"use client";

import { ContextHelpBlock, OperatorSetupCard, PortalHelpEntry, useOnboardingMessages } from "../_components/p2Onboarding";

export default function HubPage() {
  const { locale, t } = useOnboardingMessages();

  return (
    <main style={{ display: "grid", gap: 24 }}>
      <OperatorSetupCard role="hub" />

      <section
        style={{
          border: "1px solid var(--color-mist, #d7dce3)",
          borderRadius: 24,
          padding: 24,
          background: "var(--color-silk, #f8f6f2)",
        }}
      >
        <div style={{ display: "grid", gap: 12 }}>
          <h1 style={{ margin: 0 }}>{t.hub.dashboardTitle}</h1>
          <p style={{ margin: 0 }}>{t.hub.dashboardBody}</p>
          <PortalHelpEntry locale={locale} label={t.help.dashboardHelp} />
        </div>
      </section>

      <ContextHelpBlock locale={locale} title={t.hub.issueTitle} kind="order" />
    </main>
  );
}
