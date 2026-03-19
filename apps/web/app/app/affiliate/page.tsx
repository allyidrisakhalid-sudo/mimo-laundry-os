"use client";

import { ContextHelpBlock, OperatorSetupCard, PortalHelpEntry, getAffiliateRoleFromUrl, useOnboardingMessages } from "../_components/p2Onboarding";

export default function AffiliatePage() {
  const { locale, t } = useOnboardingMessages();
  const role = getAffiliateRoleFromUrl();

  return (
    <main style={{ display: "grid", gap: 24 }}>
      <OperatorSetupCard role={role} />

      <section
        style={{
          border: "1px solid var(--color-mist, #d7dce3)",
          borderRadius: 24,
          padding: 24,
          background: "var(--color-silk, #f8f6f2)",
        }}
      >
        <div style={{ display: "grid", gap: 12 }}>
          <h1 style={{ margin: 0 }}>{t.affiliate.dashboardTitle}</h1>
          <p style={{ margin: 0 }}>{t.affiliate.dashboardBody}</p>
          <PortalHelpEntry locale={locale} label={t.help.dashboardHelp} />
        </div>
      </section>

      <ContextHelpBlock locale={locale} title={t.affiliate.orderDetailTitle} kind="order" />
      {role === "affiliate_admin" ? <ContextHelpBlock locale={locale} title={t.affiliate.financeTitle} kind="finance" /> : null}
    </main>
  );
}
