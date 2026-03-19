"use client";

import Link from "next/link";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, StatusBadge } from "@mimo/ui";
import { ContextHelpBlock, CustomerFirstRun, PortalHelpEntry, useCustomerOnboardingGate, useOnboardingMessages } from "../_components/p2Onboarding";

const activeOrder = {
  id: "ORD-24031",
  status: "In washing",
  nextAction: "Track progress",
  eta: "Ready tomorrow, 18:00",
};

const recentOrders = [
  { id: "ORD-24031", status: "In washing", total: "TZS 18,000" },
  { id: "ORD-23984", status: "Delivered", total: "TZS 12,500" },
  { id: "ORD-23941", status: "Ready for pickup", total: "TZS 9,000" },
];

function CustomerHome() {
  const { locale, t } = useOnboardingMessages();

  return (
    <main className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>{t.customerPortal.home.title}</CardTitle>
          <CardDescription>{t.customerPortal.home.subtitle}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge label={activeOrder.status} tone="info" />
            <span className="text-sm text-[var(--mimo-color-text-muted)]">{activeOrder.eta}</span>
          </div>

          <div className="grid gap-2">
            <div className="text-sm text-[var(--mimo-color-text-muted)]">{t.customerPortal.home.activeOrderLabel}</div>
            <div className="text-lg font-semibold">{activeOrder.id}</div>
            <div className="text-sm text-[var(--mimo-color-text-muted)]">{activeOrder.nextAction}</div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/app/customer/orders/ORD-24031"><Button>{t.customerPortal.home.primaryCta}</Button></Link>
            <Link href="/app/customer/orders"><Button variant="secondary">{t.customerPortal.home.secondaryCta}</Button></Link>
          </div>

          <PortalHelpEntry locale={locale} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t.customerPortal.home.recentOrdersTitle}</CardTitle>
          <CardDescription>{t.customerPortal.home.recentOrdersBody}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          {recentOrders.map((order) => (
            <Link
              key={order.id}
              href={`/app/customer/orders/${order.id}`}
              className="grid gap-1 rounded-2xl border border-[var(--mimo-color-border)] p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-medium">{order.id}</span>
                <StatusBadge label={order.status} tone="neutral" />
              </div>
              <div className="text-sm text-[var(--mimo-color-text-muted)]">{order.total}</div>
            </Link>
          ))}
        </CardContent>
      </Card>

      <ContextHelpBlock locale={locale} title={t.customerPortal.home.helpTitle} kind="order" />
    </main>
  );
}

export default function CustomerPage() {
  const { ready, needsOnboarding, markDone } = useCustomerOnboardingGate();
  const { t } = useOnboardingMessages();

  if (!ready) {
    return (
      <main>
        <p>{t.common.loading}</p>
      </main>
    );
  }

  if (needsOnboarding) {
    return <CustomerFirstRun onDone={markDone} />;
  }

  return <CustomerHome />;
}

