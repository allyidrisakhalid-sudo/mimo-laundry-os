"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, StatusBadge } from "@mimo/ui";
import { ContextHelpBlock, useOnboardingMessages } from "../../../_components/p2Onboarding";

const timeline = [
  "Order created",
  "Picked up",
  "In washing",
  "Quality check pending",
];

export default function CustomerOrderDetailPage() {
  const { locale, t } = useOnboardingMessages();

  return (
    <main className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>{t.customerPortal.detail.title}</CardTitle>
          <CardDescription>{t.customerPortal.detail.subtitle}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge label="In washing" tone="info" />
            <span className="text-sm text-[var(--mimo-color-text-muted)]">ORD-24031</span>
          </div>

          <div className="grid gap-2">
            <div className="text-sm text-[var(--mimo-color-text-muted)]">{t.customerPortal.detail.summaryLabel}</div>
            <div className="text-sm">Express wash and fold  Door pickup</div>
          </div>

          <div className="grid gap-2">
            <div className="text-sm text-[var(--mimo-color-text-muted)]">{t.customerPortal.detail.timelineLabel}</div>
            <ul className="list-disc pl-5 text-sm">
              {timeline.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="grid gap-2">
            <div className="text-sm text-[var(--mimo-color-text-muted)]">{t.customerPortal.detail.paymentLabel}</div>
            <div className="text-sm">TZS 18,000  {t.customerPortal.detail.paymentState}</div>
          </div>
        </CardContent>
      </Card>

      <ContextHelpBlock locale={locale} title={t.customerPortal.detail.helpTitle} kind="order" />
    </main>
  );
}
