"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, StatusBadge } from "@mimo/ui";
import { PortalHelpEntry, useOnboardingMessages } from "../../_components/p2Onboarding";

export default function CustomerProfilePage() {
  const { locale, t } = useOnboardingMessages();

  return (
    <main className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>{t.customerPortal.profile.title}</CardTitle>
          <CardDescription>{t.customerPortal.profile.subtitle}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-1">
            <div className="text-sm text-[var(--mimo-color-text-muted)]">{t.customerPortal.profile.accountLabel}</div>
            <div className="font-medium">Ally Idrisa</div>
            <div className="text-sm text-[var(--mimo-color-text-muted)]">+255 788 558 975</div>
          </div>

          <div className="grid gap-1">
            <div className="text-sm text-[var(--mimo-color-text-muted)]">{t.customerPortal.profile.addressesLabel}</div>
            <div className="text-sm">Masaki, Dar es Salaam</div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge label={t.customerPortal.profile.languageLabel} tone="neutral" />
            <StatusBadge label={locale.toUpperCase()} tone="success" />
          </div>

          <div className="text-sm text-[var(--mimo-color-text-muted)]">{t.customerPortal.profile.receiptsLabel}</div>
          <PortalHelpEntry locale={locale} />
        </CardContent>
      </Card>
    </main>
  );
}
