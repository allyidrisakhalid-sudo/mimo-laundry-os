"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, StatusBadge } from "@mimo/ui";
import { PortalHelpEntry, useOnboardingMessages } from "../../_components/p2Onboarding";

const orders = [
  { id: "ORD-24031", status: "In washing", total: "TZS 18,000" },
  { id: "ORD-23984", status: "Delivered", total: "TZS 12,500" },
  { id: "ORD-23941", status: "Ready for pickup", total: "TZS 9,000" },
];

export default function CustomerOrdersPage() {
  const { locale, t } = useOnboardingMessages();

  return (
    <main className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>{t.customerPortal.orders.title}</CardTitle>
          <CardDescription>{t.customerPortal.orders.subtitle}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/app/customer/orders/${order.id}`}
              className="grid gap-2 rounded-2xl border border-[var(--mimo-color-border)] p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-medium">{order.id}</span>
                <StatusBadge label={order.status} tone="info" />
              </div>
              <div className="text-sm text-[var(--mimo-color-text-muted)]">{order.total}</div>
            </Link>
          ))}
          <PortalHelpEntry locale={locale} />
        </CardContent>
      </Card>
    </main>
  );
}
