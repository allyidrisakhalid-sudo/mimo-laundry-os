"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

type AdminTabKey = "dashboard" | "orders" | "operations" | "finance";
type OrderStatus =
  | "admin.data.orderStatus.atPickup"
  | "admin.data.orderStatus.atHubIntake"
  | "admin.data.orderStatus.processing"
  | "admin.data.orderStatus.readyForDispatch"
  | "admin.data.orderStatus.outForDelivery"
  | "admin.data.orderStatus.delivered";
type PaymentState = "admin.data.payment.pending" | "admin.data.payment.partial" | "admin.data.payment.paid" | "admin.data.payment.refundReview";
type AttentionState = "admin.data.attention.normal" | "admin.data.attention.issue" | "admin.data.attention.delayed";

type DashboardKpi = {
  labelKey: string;
  value: string;
  tone: "default" | "danger" | "success";
  noteKey: string;
};

type QueueItem = {
  id: string;
  title: string;
  meta: string;
  href: string;
  tone: "default" | "danger" | "warning";
};

type GlobalOrder = {
  id: string;
  ref: string;
  source: string;
  customer: string;
  zone: string;
  hub: string;
  affiliate: string;
  driver: string;
  status: OrderStatus;
  payment: PaymentState;
  attention: AttentionState;
};

type NetworkZone = {
  name: string;
  hubs: number;
  affiliates: number;
  pressure: string;
};

type HubRecord = {
  name: string;
  zone: string;
  workload: string;
  exceptions: string;
};

type AffiliateRecord = {
  name: string;
  zone: string;
  activity: string;
  payoutFlag: string;
};

type DriverRecord = {
  name: string;
  homeZone: string;
  availability: string;
  workload: string;
};

type PricingPlan = {
  name: string;
  version: string;
  effectiveDate: string;
  state: "admin.data.pricingState.active" | "admin.data.pricingState.staged" | "admin.data.pricingState.historic";
};

type PaymentRefundItem = {
  ref: string;
  type: string;
  owner: string;
  amount: string;
  status: string;
};

type PayoutItem = {
  affiliate: string;
  period: string;
  amount: string;
  status: string;
};

type DailyCloseItem = {
  hub: string;
  status: string;
  blocker: string;
};

type AuditItem = {
  actor: string;
  action: string;
  target: string;
  time: string;
  result: string;
};

type FailedJobItem = {
  job: string;
  context: string;
  time: string;
  status: string;
};

const adminNav: Array<{ key: AdminTabKey; href: string; labelKey: string }> = [
  { key: "dashboard", href: "/app/admin", labelKey: "admin.nav.dashboard" },
  { key: "orders", href: "/app/admin/orders", labelKey: "admin.nav.orders" },
  { key: "operations", href: "/app/admin/operations", labelKey: "admin.nav.operations" },
  { key: "finance", href: "/app/admin/finance", labelKey: "admin.nav.finance" },
];

const dashboardKpis: DashboardKpi[] = [
  {
    labelKey: "admin.dashboard.kpi.activeOrders",
    value: "128",
    tone: "default",
    noteKey: "admin.dashboard.kpi.activeOrdersNote",
  },
  {
    labelKey: "admin.dashboard.kpi.exceptions",
    value: "09",
    tone: "danger",
    noteKey: "admin.dashboard.kpi.exceptionsNote",
  },
  {
    labelKey: "admin.dashboard.kpi.deliveredToday",
    value: "42",
    tone: "success",
    noteKey: "admin.dashboard.kpi.deliveredTodayNote",
  },
  {
    labelKey: "admin.dashboard.kpi.paidToday",
    value: "TZS 1.26M",
    tone: "success",
    noteKey: "admin.dashboard.kpi.paidTodayNote",
  },
  {
    labelKey: "admin.dashboard.kpi.flags",
    value: "05",
    tone: "danger",
    noteKey: "admin.dashboard.kpi.flagsNote",
  },
];

const queueItems: QueueItem[] = [
  {
    id: "queue-1",
    title: "admin.queue.item1.title",
    meta: "admin.queue.item1.meta",
    href: "/app/admin/operations",
    tone: "danger",
  },
  {
    id: "queue-2",
    title: "admin.queue.item2.title",
    meta: "admin.queue.item2.meta",
    href: "/app/admin/finance",
    tone: "warning",
  },
  {
    id: "queue-3",
    title: "admin.queue.item3.title",
    meta: "admin.queue.item3.meta",
    href: "/app/admin/orders",
    tone: "default",
  },
];

const globalOrders: GlobalOrder[] = [
  {
    id: "ord-1001",
    ref: "MIMO-1001",
    source: "admin.data.source.door",
    customer: "Amina M.",
    zone: "Msasani",
    hub: "Central Hub",
    affiliate: "",
    driver: "Juma",
    status: "admin.data.orderStatus.outForDelivery",
    payment: "admin.data.payment.pending",
    attention: "admin.data.attention.issue",
  },
  {
    id: "ord-1002",
    ref: "MIMO-1002",
    source: "admin.data.source.shop",
    customer: "Kariakoo Shop",
    zone: "Kariakoo",
    hub: "Central Hub",
    affiliate: "Kariakoo Express",
    driver: "Neema",
    status: "admin.data.orderStatus.readyForDispatch",
    payment: "admin.data.payment.paid",
    attention: "admin.data.attention.normal",
  },
  {
    id: "ord-1003",
    ref: "MIMO-1003",
    source: "admin.data.source.hybrid",
    customer: "John K.",
    zone: "Mbezi Beach",
    hub: "North Hub",
    affiliate: "Mbezi Corner",
    driver: "Hassan",
    status: "admin.data.orderStatus.processing",
    payment: "admin.data.payment.partial",
    attention: "admin.data.attention.delayed",
  },
  {
    id: "ord-1004",
    ref: "MIMO-1004",
    source: "admin.data.source.door",
    customer: "Zuwena P.",
    zone: "Tegeta",
    hub: "North Hub",
    affiliate: "",
    driver: "Asha",
    status: "admin.data.orderStatus.atHubIntake",
    payment: "admin.data.payment.refundReview",
    attention: "admin.data.attention.issue",
  },
];

const zones: NetworkZone[] = [
  { name: "Msasani", hubs: 1, affiliates: 2, pressure: "admin.data.pressure.stable" },
  { name: "Kariakoo", hubs: 1, affiliates: 3, pressure: "admin.data.pressure.pickupRush" },
  { name: "Mbezi Beach", hubs: 1, affiliates: 1, pressure: "admin.data.pressure.driverGap" },
];

const hubs: HubRecord[] = [
  { name: "Central Hub", zone: "Kariakoo", workload: "admin.data.workload.highIntake", exceptions: "admin.data.exceptions.twoUrgent" },
  { name: "North Hub", zone: "Mbezi Beach", workload: "admin.data.workload.balanced", exceptions: "admin.data.exceptions.oneRefundHold" },
];

const affiliates: AffiliateRecord[] = [
  { name: "Kariakoo Express", zone: "Kariakoo", activity: "admin.data.activity.eighteenOpenOrders", payoutFlag: "admin.data.flags.pendingPayoutReview" },
  { name: "Mbezi Corner", zone: "Mbezi Beach", activity: "admin.data.activity.sevenOpenOrders", payoutFlag: "admin.data.flags.clean" },
];

const drivers: DriverRecord[] = [
  { name: "Juma", homeZone: "Msasani", availability: "admin.data.availability.onRoute", workload: "admin.data.workload.sixAssignedStops" },
  { name: "Neema", homeZone: "Kariakoo", availability: "admin.data.availability.available", workload: "admin.data.workload.twoAssignedStops" },
  { name: "Hassan", homeZone: "Mbezi Beach", availability: "admin.data.availability.capacityRisk", workload: "admin.data.workload.eightAssignedStops" },
];

const pricingPlans: PricingPlan[] = [
  { name: "Core Retail", version: "v3", effectiveDate: "admin.data.pricing.activeSince", state: "admin.data.pricingState.active" },
  { name: "Core Retail", version: "v4", effectiveDate: "admin.data.pricing.activatesOn", state: "admin.data.pricingState.staged" },
  { name: "Core Retail", version: "v2", effectiveDate: "admin.data.pricing.retiredOn", state: "admin.data.pricingState.historic" },
];

const paymentRefundItems: PaymentRefundItem[] = [
  { ref: "PAY-204", type: "admin.data.financeType.collection", owner: "admin.data.financeOwner.driverCash", amount: "TZS 84,000", status: "admin.data.finance.pendingHandoff" },
  { ref: "RFD-028", type: "admin.data.financeType.refund", owner: "admin.data.financeOwner.customerWallet", amount: "TZS 18,000", status: "admin.data.finance.reviewRequired" },
  { ref: "PAY-205", type: "admin.data.financeType.collection", owner: "admin.data.financeOwner.affiliateCounter", amount: "TZS 122,000", status: "admin.data.finance.balanced" },
];

const payoutItems: PayoutItem[] = [
  { affiliate: "Kariakoo Express", period: "admin.data.period.week11", amount: "TZS 146,000", status: "admin.data.finance.pendingReview" },
  { affiliate: "Mbezi Corner", period: "admin.data.period.week11", amount: "TZS 58,000", status: "admin.data.finance.readyToMarkPaid" },
];

const dailyCloseItems: DailyCloseItem[] = [
  { hub: "Central Hub", status: "admin.data.finance.blocked", blocker: "admin.data.finance.driverCashVarianceNotCleared" },
  { hub: "North Hub", status: "admin.data.finance.ready", blocker: "admin.data.finance.noBlockers" },
];

const auditItems: AuditItem[] = [
  { actor: "admin.data.audit.actorAlly", action: "admin.data.audit.approvedPayoutPack", target: "admin.data.targets.kariakooExpress", time: "10:24", result: "admin.data.audit.recorded" },
  { actor: "admin.data.audit.actorRehema", action: "admin.data.audit.activatedPricingVersion", target: "admin.data.targets.coreRetailV3", time: "08:10", result: "admin.data.audit.live" },
];

const failedJobs: FailedJobItem[] = [
  { job: "admin.data.jobs.payoutExport", context: "admin.data.jobs.week11FinanceBundle", time: "09:05", status: "admin.data.jobs.needsRetryByDevAdmin" },
  { job: "admin.data.jobs.reminderDispatch", context: "admin.data.jobs.delayedDeliverySmsBatch", time: "07:42", status: "admin.data.jobs.partiallyFailed" },
];

function cardToneStyles(tone: "default" | "danger" | "success" | "warning") {
  if (tone === "danger") {
    return {
      border: "1px solid rgba(183, 57, 57, 0.24)",
      background: "rgba(183, 57, 57, 0.08)",
    };
  }
  if (tone === "success") {
    return {
      border: "1px solid rgba(56, 114, 75, 0.22)",
      background: "rgba(56, 114, 75, 0.08)",
    };
  }
  if (tone === "warning") {
    return {
      border: "1px solid rgba(180, 130, 32, 0.24)",
      background: "rgba(180, 130, 32, 0.1)",
    };
  }
  return {
    border: "1px solid var(--color-mist, #d7dce3)",
    background: "rgba(255,255,255,0.74)",
  };
}

function sectionCardStyle() {
  return {
    border: "1px solid var(--color-mist, #d7dce3)",
    borderRadius: 24,
    background: "rgba(255,255,255,0.76)",
    padding: 20,
    boxShadow: "0 16px 32px rgba(17, 24, 39, 0.06)",
  } as const;
}

function tableShellStyle() {
  return {
    width: "100%",
    borderCollapse: "collapse" as const,
    fontSize: 14,
  };
}

function thTdStyle() {
  return {
    textAlign: "left" as const,
    padding: "12px 10px",
    borderBottom: "1px solid rgba(215, 220, 227, 0.9)",
    verticalAlign: "top" as const,
  };
}

function StatusBadge({
  label,
  tone = "default",
}: {
  label: string;
  tone?: "default" | "danger" | "success" | "warning";
}) {
  const toneStyle = cardToneStyles(tone);
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 700,
        ...toneStyle,
      }}
    >
      {label}
    </span>
  );
}

function EmptyStateCard({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div
      style={{
        ...sectionCardStyle(),
        display: "grid",
        gap: 8,
        placeItems: "start",
      }}
    >
      <h3 style={{ margin: 0, fontSize: 16 }}>{title}</h3>
      <p style={{ margin: 0, color: "var(--color-ink, #1f2937)" }}>{body}</p>
    </div>
  );
}

function LoadingStateCard({
  label,
}: {
  label: string;
}) {
  return (
    <div
      style={{
        ...sectionCardStyle(),
        minHeight: 96,
        display: "grid",
        alignItems: "center",
        color: "var(--color-ink, #1f2937)",
        fontWeight: 600,
      }}
    >
      {label}
    </div>
  );
}

export function P2AdminPortal({ tab }: { tab: AdminTabKey }) {
  const { t } = useTranslation();
  const [filtersOn, setFiltersOn] = useState(false);

  const filteredOrders = useMemo(() => {
    if (!filtersOn) return globalOrders;
    return globalOrders.filter((item) => item.attention !== "admin.data.attention.normal");
  }, [filtersOn]);

  const pageTitle =
    tab === "dashboard"
      ? t("admin.page.dashboardTitle")
      : tab === "orders"
        ? t("admin.page.ordersTitle")
        : tab === "operations"
          ? t("admin.page.operationsTitle")
          : t("admin.page.financeTitle");

  const pageBody =
    tab === "dashboard"
      ? t("admin.page.dashboardBody")
      : tab === "orders"
        ? t("admin.page.ordersBody")
        : tab === "operations"
          ? t("admin.page.operationsBody")
          : t("admin.page.financeBody");

  const supportCases = [
    {
      id: "SUP-204",
      issueType: "delay",
      orderRef: "ORD-1048",
      status: "underReview",
      updatedAt: "10 min ago",
      finance: "refundReview",
      summary: "Customer reported a delivery delay and asked for an update."
    },
    {
      id: "SUP-198",
      issueType: "missingItem",
      orderRef: "ORD-1041",
      status: "actionInProgress",
      updatedAt: "32 min ago",
      finance: "creditIssued",
      summary: "One item is missing after handover and the case is under active follow-up."
    }
  ];

  return (
    <main
      style={{
        display: "grid",
        gap: 20,
        paddingBottom: 40,
      }}
    >
      <section
        style={{
          ...sectionCardStyle(),
          background:
            "linear-gradient(135deg, rgba(17,24,39,0.96), rgba(31,41,55,0.92))",
          color: "var(--color-silk, #f8f6f2)",
        }}
      >
        <div
          style={{
            display: "grid",
            gap: 14,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 16,
              alignItems: "flex-start",
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "grid", gap: 8, maxWidth: 860 }}>
              <span style={{ fontSize: 12, letterSpacing: 1.2, textTransform: "uppercase", opacity: 0.8 }}>
                {t("admin.page.eyebrow")}
              </span>
              <h1 style={{ margin: 0, fontSize: 32, lineHeight: 1.1 }}>{pageTitle}</h1>
              <p style={{ margin: 0, maxWidth: 760, opacity: 0.9 }}>{pageBody}</p>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <StatusBadge label={t("admin.state.auditVisible")} tone="default" />
              <StatusBadge label={t("admin.state.failedJobVisible")} tone="warning" />
            </div>
          </div>

          <nav
            aria-label={t("admin.nav.label")}
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            {adminNav.map((item) => {
              const active = item.key === tab;
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  style={{
                    textDecoration: "none",
                    padding: "10px 14px",
                    borderRadius: 999,
                    fontWeight: 700,
                    color: active ? "var(--color-midnight, #0f172a)" : "var(--color-silk, #f8f6f2)",
                    background: active ? "var(--color-silk, #f8f6f2)" : "rgba(255,255,255,0.08)",
                    border: active ? "1px solid transparent" : "1px solid rgba(255,255,255,0.14)",
                  }}
                >
                  {t(item.labelKey)}
                </Link>
              );
            })}
          </nav>
        </div>
      </section>

      {tab === "dashboard" && (
        <>
          <section style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(5, minmax(0, 1fr))" }}>
            {dashboardKpis.map((item) => (
              <div key={item.labelKey} style={{ ...sectionCardStyle(), ...cardToneStyles(item.tone) }}>
                <div style={{ display: "grid", gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 700 }}>{t(item.labelKey)}</span>
                  <strong style={{ fontSize: 28, lineHeight: 1 }}>{item.value}</strong>
                  <span style={{ fontSize: 13, color: "var(--color-ink, #1f2937)" }}>{t(item.noteKey)}</span>
                </div>
              </div>
            ))}
          </section>

          <section style={{ display: "grid", gap: 16, gridTemplateColumns: "1.4fr 1fr" }}>
            <div style={{ ...sectionCardStyle(), display: "grid", gap: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                <div style={{ display: "grid", gap: 4 }}>
                  <h2 style={{ margin: 0, fontSize: 20 }}>{t("admin.dashboard.actionQueueTitle")}</h2>
                  <p style={{ margin: 0, fontSize: 14 }}>{t("admin.dashboard.actionQueueBody")}</p>
                </div>
                <Link href="/app/admin/orders" style={{ fontWeight: 700, textDecoration: "none" }}>
                  {t("admin.common.openOrders")}
                </Link>
              </div>

              <div style={{ display: "grid", gap: 12 }}>
                {queueItems.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                      padding: 16,
                      borderRadius: 18,
                      display: "grid",
                      gap: 6,
                      ...cardToneStyles(item.tone),
                    }}
                  >
                    <strong style={{ fontSize: 15 }}>{t(item.title)}</strong>
                    <span style={{ fontSize: 13, opacity: 0.86 }}>{t(item.meta)}</span>
                  </Link>
                ))}
              </div>

              <EmptyStateCard
                title={t("admin.state.noUrgentIssuesTitle")}
                body={t("admin.state.noUrgentIssuesBody")}
              />
            </div>

            <div style={{ display: "grid", gap: 16 }}>
              <div style={{ ...sectionCardStyle(), display: "grid", gap: 8 }}>
                <h2 style={{ margin: 0, fontSize: 18 }}>{t("admin.dashboard.pressureSummaryTitle")}</h2>
                <p style={{ margin: 0, fontSize: 14 }}>{t("admin.dashboard.pressureSummaryBody")}</p>
                <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 8 }}>
                  <li>{t("admin.dashboard.pressureSummaryItem1")}</li>
                  <li>{t("admin.dashboard.pressureSummaryItem2")}</li>
                  <li>{t("admin.dashboard.pressureSummaryItem3")}</li>
                </ul>
              </div>

              <div style={{ ...sectionCardStyle(), display: "grid", gap: 8 }}>
                <h2 style={{ margin: 0, fontSize: 18 }}>{t("admin.dashboard.financeSignalTitle")}</h2>
                <p style={{ margin: 0, fontSize: 14 }}>{t("admin.dashboard.financeSignalBody")}</p>
                <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 8 }}>
                  <li>{t("admin.dashboard.financeSignalItem1")}</li>
                  <li>{t("admin.dashboard.financeSignalItem2")}</li>
                  <li>{t("admin.dashboard.financeSignalItem3")}</li>
                </ul>
              </div>
            </div>
          </section>

          <section style={{ ...sectionCardStyle(), display: "grid", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
              <div style={{ display: "grid", gap: 4 }}>
                <h2 style={{ margin: 0, fontSize: 20 }}>{t("admin.dashboard.globalListTitle")}</h2>
                <p style={{ margin: 0, fontSize: 14 }}>{t("admin.dashboard.globalListBody")}</p>
              </div>
              <button
                type="button"
                onClick={() => setFiltersOn((prev) => !prev)}
                style={{
                  borderRadius: 999,
                  border: "1px solid var(--color-mist, #d7dce3)",
                  padding: "10px 14px",
                  background: "white",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {filtersOn ? t("admin.orders.clearFilters") : t("admin.orders.showIssueFilters")}
              </button>
            </div>

            {filteredOrders.length === 0 ? (
              <EmptyStateCard
                title={t("admin.state.noFilteredOrdersTitle")}
                body={t("admin.state.noFilteredOrdersBody")}
              />
            ) : (
              <table style={tableShellStyle()}>
                <thead>
                  <tr>
                    <th style={thTdStyle()}>{t("admin.orders.columns.order")}</th>
                    <th style={thTdStyle()}>{t("admin.orders.columns.source")}</th>
                    <th style={thTdStyle()}>{t("admin.orders.columns.attribution")}</th>
                    <th style={thTdStyle()}>{t("admin.orders.columns.status")}</th>
                    <th style={thTdStyle()}>{t("admin.orders.columns.payment")}</th>
                    <th style={thTdStyle()}>{t("admin.orders.columns.urgency")}</th>
                    <th style={thTdStyle()}>{t("admin.orders.columns.action")}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id}>
                      <td style={thTdStyle()}>
                        <div style={{ display: "grid", gap: 4 }}>
                          <strong>{order.ref}</strong>
                          <span>{order.customer}</span>
                        </div>
                      </td>
                      <td style={thTdStyle()}>{t(order.source)}</td>
                      <td style={thTdStyle()}>
                        <div style={{ display: "grid", gap: 4 }}>
                          <span>{order.zone}</span>
                          <span>{order.hub}</span>
                          <span>{order.affiliate !== "" ? order.affiliate : order.driver}</span>
                        </div>
                      </td>
                      <td style={thTdStyle()}>{t(order.status)}</td>
                      <td style={thTdStyle()}>{t(order.payment)}</td>
                      <td style={thTdStyle()}>
                        <StatusBadge
                          label={t(order.attention)}
                          tone={
                            order.attention === "admin.data.attention.issue"
                              ? "danger"
                              : order.attention === "admin.data.attention.delayed"
                                ? "warning"
                                : "default"
                          }
                        />
                      </td>
                      <td style={thTdStyle()}>
                        <Link href={`/app/admin/orders/${order.id}`} style={{ fontWeight: 700, textDecoration: "none" }}>
                          {t("admin.common.open")}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </>
      )}

      {tab === "orders" && (
        <>
          <section style={{ ...sectionCardStyle(), display: "grid", gap: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ display: "grid", gap: 4 }}>
                <h2 style={{ margin: 0, fontSize: 20 }}>{t("admin.orders.filtersTitle")}</h2>
                <p style={{ margin: 0, fontSize: 14 }}>{t("admin.orders.filtersBody")}</p>
              </div>
              <button
                type="button"
                onClick={() => setFiltersOn((prev) => !prev)}
                style={{
                  borderRadius: 999,
                  border: "1px solid var(--color-mist, #d7dce3)",
                  padding: "10px 14px",
                  background: "white",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {filtersOn ? t("admin.orders.clearFilters") : t("admin.orders.showIssueFilters")}
              </button>
            </div>

            <div style={{ display: "grid", gap: 12, gridTemplateColumns: "2fr repeat(6, minmax(0, 1fr))" }}>
              <div style={{ ...sectionCardStyle(), padding: 14 }}>
                <strong>{t("admin.orders.searchLabel")}</strong>
                <p style={{ margin: "6px 0 0 0", fontSize: 14 }}>{t("admin.orders.searchValue")}</p>
              </div>
              <div style={{ ...sectionCardStyle(), padding: 14 }}><strong>{t("admin.orders.filter.status")}</strong></div>
              <div style={{ ...sectionCardStyle(), padding: 14 }}><strong>{t("admin.orders.filter.issue")}</strong></div>
              <div style={{ ...sectionCardStyle(), padding: 14 }}><strong>{t("admin.orders.filter.zone")}</strong></div>
              <div style={{ ...sectionCardStyle(), padding: 14 }}><strong>{t("admin.orders.filter.hub")}</strong></div>
              <div style={{ ...sectionCardStyle(), padding: 14 }}><strong>{t("admin.orders.filter.affiliate")}</strong></div>
              <div style={{ ...sectionCardStyle(), padding: 14 }}><strong>{t("admin.orders.filter.payment")}</strong></div>
            </div>
          </section>

          <section style={{ ...sectionCardStyle(), display: "grid", gap: 12 }}>
            <table style={tableShellStyle()}>
              <thead>
                <tr>
                  <th style={thTdStyle()}>{t("admin.orders.columns.order")}</th>
                  <th style={thTdStyle()}>{t("admin.orders.columns.source")}</th>
                  <th style={thTdStyle()}>{t("admin.orders.columns.attribution")}</th>
                  <th style={thTdStyle()}>{t("admin.orders.columns.status")}</th>
                  <th style={thTdStyle()}>{t("admin.orders.columns.payment")}</th>
                  <th style={thTdStyle()}>{t("admin.orders.columns.urgency")}</th>
                  <th style={thTdStyle()}>{t("admin.orders.columns.action")}</th>
                </tr>
              </thead>
              <tbody>
                {(filtersOn ? globalOrders.filter((order) => order.attention !== "admin.data.attention.normal") : globalOrders).map((order) => (
                  <tr key={order.id}>
                    <td style={thTdStyle()}>
                      <div style={{ display: "grid", gap: 4 }}>
                        <strong>{order.ref}</strong>
                        <span>{order.customer}</span>
                      </div>
                    </td>
                    <td style={thTdStyle()}>{t(order.source)}</td>
                    <td style={thTdStyle()}>
                      <div style={{ display: "grid", gap: 4 }}>
                        <span>{order.zone}</span>
                        <span>{order.hub}</span>
                        <span>{order.affiliate !== "" ? order.affiliate : order.driver}</span>
                      </div>
                    </td>
                    <td style={thTdStyle()}>{t(order.status)}</td>
                    <td style={thTdStyle()}>{t(order.payment)}</td>
                    <td style={thTdStyle()}>
                      <StatusBadge
                        label={t(order.attention)}
                        tone={
                          order.attention === "admin.data.attention.issue"
                            ? "danger"
                            : order.attention === "admin.data.attention.delayed"
                              ? "warning"
                              : "default"
                        }
                      />
                    </td>
                    <td style={thTdStyle()}>
                      <Link href={`/app/admin/orders/${order.id}`} style={{ fontWeight: 700, textDecoration: "none" }}>
                        {t("admin.common.view")}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filtersOn && globalOrders.filter((order) => order.attention !== "admin.data.attention.normal").length === 0 && (
              <EmptyStateCard
                title={t("admin.state.noFilteredOrdersTitle")}
                body={t("admin.state.noFilteredOrdersBody")}
              />
            )}

            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
              <span style={{ fontSize: 14 }}>{t("admin.orders.paginationSummary")}</span>
              <div style={{ display: "flex", gap: 10 }}>
                <StatusBadge label="1" tone="default" />
                <StatusBadge label="2" tone="default" />
                <StatusBadge label="3" tone="default" />
              </div>
            </div>
          </section>
        </>
      )}

      {tab === "operations" && (
        <>
          <LoadingStateCard label={t("admin.state.loadingOperations")} />

          <section style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
            <div style={{ ...sectionCardStyle(), display: "grid", gap: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                <h2 style={{ margin: 0, fontSize: 20 }}>{t("admin.operations.zonesTitle")}</h2>
                <StatusBadge label={t("admin.state.networkNeedsAttention")} tone="warning" />
              </div>
              <table style={tableShellStyle()}>
                <thead>
                  <tr>
                    <th style={thTdStyle()}>{t("admin.operations.columns.name")}</th>
                    <th style={thTdStyle()}>{t("admin.operations.columns.hubs")}</th>
                    <th style={thTdStyle()}>{t("admin.operations.columns.affiliates")}</th>
                    <th style={thTdStyle()}>{t("admin.operations.columns.pressure")}</th>
                  </tr>
                </thead>
                <tbody>
                  {zones.map((item) => (
                    <tr key={item.name}>
                      <td style={thTdStyle()}>{item.name}</td>
                      <td style={thTdStyle()}>{item.hubs}</td>
                      <td style={thTdStyle()}>{item.affiliates}</td>
                      <td style={thTdStyle()}>{t(item.pressure)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ ...sectionCardStyle(), display: "grid", gap: 12 }}>
              <h2 style={{ margin: 0, fontSize: 20 }}>{t("admin.operations.hubsTitle")}</h2>
              <table style={tableShellStyle()}>
                <thead>
                  <tr>
                    <th style={thTdStyle()}>{t("admin.operations.columns.name")}</th>
                    <th style={thTdStyle()}>{t("admin.operations.columns.zone")}</th>
                    <th style={thTdStyle()}>{t("admin.operations.columns.workload")}</th>
                    <th style={thTdStyle()}>{t("admin.operations.columns.exceptions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {hubs.map((item) => (
                    <tr key={item.name}>
                      <td style={thTdStyle()}>{item.name}</td>
                      <td style={thTdStyle()}>{item.zone}</td>
                      <td style={thTdStyle()}>{t(item.workload)}</td>
                      <td style={thTdStyle()}>{t(item.exceptions)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ ...sectionCardStyle(), display: "grid", gap: 12 }}>
              <h2 style={{ margin: 0, fontSize: 20 }}>{t("admin.operations.affiliatesTitle")}</h2>
              <table style={tableShellStyle()}>
                <thead>
                  <tr>
                    <th style={thTdStyle()}>{t("admin.operations.columns.name")}</th>
                    <th style={thTdStyle()}>{t("admin.operations.columns.zone")}</th>
                    <th style={thTdStyle()}>{t("admin.operations.columns.activity")}</th>
                    <th style={thTdStyle()}>{t("admin.operations.columns.flag")}</th>
                  </tr>
                </thead>
                <tbody>
                  {affiliates.map((item) => (
                    <tr key={item.name}>
                      <td style={thTdStyle()}>{item.name}</td>
                      <td style={thTdStyle()}>{item.zone}</td>
                      <td style={thTdStyle()}>{t(item.activity)}</td>
                      <td style={thTdStyle()}>{t(item.payoutFlag)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ ...sectionCardStyle(), display: "grid", gap: 12 }}>
              <h2 style={{ margin: 0, fontSize: 20 }}>{t("admin.operations.driversTitle")}</h2>
              <table style={tableShellStyle()}>
                <thead>
                  <tr>
                    <th style={thTdStyle()}>{t("admin.operations.columns.name")}</th>
                    <th style={thTdStyle()}>{t("admin.operations.columns.homeZone")}</th>
                    <th style={thTdStyle()}>{t("admin.operations.columns.availability")}</th>
                    <th style={thTdStyle()}>{t("admin.operations.columns.workload")}</th>
                  </tr>
                </thead>
                <tbody>
                  {drivers.map((item) => (
                    <tr key={item.name}>
                      <td style={thTdStyle()}>{item.name}</td>
                      <td style={thTdStyle()}>{item.homeZone}</td>
                      <td style={thTdStyle()}>{t(item.availability)}</td>
                      <td style={thTdStyle()}>{t(item.workload)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section style={{ ...sectionCardStyle(), display: "grid", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ display: "grid", gap: 4 }}>
                <h2 style={{ margin: 0, fontSize: 20 }}>{t("admin.operations.pricingTitle")}</h2>
                <p style={{ margin: 0, fontSize: 14 }}>{t("admin.operations.pricingBody")}</p>
              </div>
              <StatusBadge label={t("admin.state.stagedPricingAwaitingActivation")} tone="warning" />
            </div>

            <table style={tableShellStyle()}>
              <thead>
                <tr>
                  <th style={thTdStyle()}>{t("admin.operations.pricingColumns.plan")}</th>
                  <th style={thTdStyle()}>{t("admin.operations.pricingColumns.version")}</th>
                  <th style={thTdStyle()}>{t("admin.operations.pricingColumns.effectiveDate")}</th>
                  <th style={thTdStyle()}>{t("admin.operations.pricingColumns.state")}</th>
                </tr>
              </thead>
              <tbody>
                {pricingPlans.map((plan) => (
                  <tr key={`${plan.name}-${plan.version}`}>
                    <td style={thTdStyle()}>{plan.name}</td>
                    <td style={thTdStyle()}>{plan.version}</td>
                    <td style={thTdStyle()}>{t(plan.effectiveDate)}</td>
                    <td style={thTdStyle()}>
                      <StatusBadge
                        label={t(plan.state)}
                        tone={plan.state === "admin.data.pricingState.active" ? "success" : plan.state === "admin.data.pricingState.staged" ? "warning" : "default"}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <StatusBadge label={t("admin.operations.createPlanAction")} tone="default" />
              <StatusBadge label={t("admin.operations.stagePlanAction")} tone="warning" />
              <StatusBadge label={t("admin.operations.activatePlanAction")} tone="success" />
            </div>
          </section>
        </>
      )}

      {tab === "finance" && (
        <>
          <LoadingStateCard label={t("admin.state.loadingFinance")} />

          <section style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}>
            <div style={{ ...sectionCardStyle(), display: "grid", gap: 6 }}>
              <span>{t("admin.finance.summary.collections")}</span>
              <strong style={{ fontSize: 28 }}>TZS 2.84M</strong>
            </div>
            <div style={{ ...sectionCardStyle(), display: "grid", gap: 6 }}>
              <span>{t("admin.finance.summary.outstanding")}</span>
              <strong style={{ fontSize: 28 }}>TZS 412K</strong>
            </div>
            <div style={{ ...sectionCardStyle(), display: "grid", gap: 6 }}>
              <span>{t("admin.finance.summary.payoutsPending")}</span>
              <strong style={{ fontSize: 28 }}>02</strong>
            </div>
            <div style={{ ...sectionCardStyle(), display: "grid", gap: 6 }}>
              <span>{t("admin.finance.summary.flags")}</span>
              <strong style={{ fontSize: 28 }}>03</strong>
            </div>
          </section>

          <section style={{ display: "grid", gap: 16, gridTemplateColumns: "1.2fr 1fr" }}>
            <div style={{ ...sectionCardStyle(), display: "grid", gap: 12 }}>
              <h2 style={{ margin: 0, fontSize: 20 }}>{t("admin.finance.paymentsTitle")}</h2>
              <table style={tableShellStyle()}>
                <thead>
                  <tr>
                    <th style={thTdStyle()}>{t("admin.finance.columns.reference")}</th>
                    <th style={thTdStyle()}>{t("admin.finance.columns.type")}</th>
                    <th style={thTdStyle()}>{t("admin.finance.columns.owner")}</th>
                    <th style={thTdStyle()}>{t("admin.finance.columns.amount")}</th>
                    <th style={thTdStyle()}>{t("admin.finance.columns.status")}</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentRefundItems.map((item) => (
                    <tr key={item.ref}>
                      <td style={thTdStyle()}>{item.ref}</td>
                      <td style={thTdStyle()}>{t(item.type)}</td>
                      <td style={thTdStyle()}>{t(item.owner)}</td>
                      <td style={thTdStyle()}>{item.amount}</td>
                      <td style={thTdStyle()}>{t(item.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ ...sectionCardStyle(), display: "grid", gap: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                <h2 style={{ margin: 0, fontSize: 20 }}>{t("admin.finance.payoutsTitle")}</h2>
                <StatusBadge label={t("admin.state.payoutPendingReview")} tone="warning" />
              </div>
              <table style={tableShellStyle()}>
                <thead>
                  <tr>
                    <th style={thTdStyle()}>{t("admin.finance.columns.affiliate")}</th>
                    <th style={thTdStyle()}>{t("admin.finance.columns.period")}</th>
                    <th style={thTdStyle()}>{t("admin.finance.columns.amount")}</th>
                    <th style={thTdStyle()}>{t("admin.finance.columns.status")}</th>
                  </tr>
                </thead>
                <tbody>
                  {payoutItems.map((item) => (
                    <tr key={`${item.affiliate}-${item.period}`}>
                      <td style={thTdStyle()}>{item.affiliate}</td>
                      <td style={thTdStyle()}>{t(item.period)}</td>
                      <td style={thTdStyle()}>{item.amount}</td>
                      <td style={thTdStyle()}>{t(item.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr 1fr" }}>
            <div style={{ ...sectionCardStyle(), display: "grid", gap: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                <h2 style={{ margin: 0, fontSize: 20 }}>{t("admin.finance.dailyCloseTitle")}</h2>
                <StatusBadge label={t("admin.state.dailyCloseBlocked")} tone="danger" />
              </div>
              <table style={tableShellStyle()}>
                <thead>
                  <tr>
                    <th style={thTdStyle()}>{t("admin.finance.columns.hub")}</th>
                    <th style={thTdStyle()}>{t("admin.finance.columns.status")}</th>
                    <th style={thTdStyle()}>{t("admin.finance.columns.blocker")}</th>
                  </tr>
                </thead>
                <tbody>
                  {dailyCloseItems.map((item) => (
                    <tr key={item.hub}>
                      <td style={thTdStyle()}>{item.hub}</td>
                      <td style={thTdStyle()}>{t(item.status)}</td>
                      <td style={thTdStyle()}>{t(item.blocker)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: "grid", gap: 16 }}>
              <div style={{ ...sectionCardStyle(), display: "grid", gap: 12 }}>
                <h2 style={{ margin: 0, fontSize: 18 }}>{t("admin.finance.auditTitle")}</h2>
                <table style={tableShellStyle()}>
                  <thead>
                    <tr>
                      <th style={thTdStyle()}>{t("admin.finance.columns.actor")}</th>
                      <th style={thTdStyle()}>{t("admin.finance.columns.action")}</th>
                      <th style={thTdStyle()}>{t("admin.finance.columns.target")}</th>
                      <th style={thTdStyle()}>{t("admin.finance.columns.time")}</th>
                      <th style={thTdStyle()}>{t("admin.finance.columns.result")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditItems.map((item, index) => (
                      <tr key={`${item.actor}-${index}`}>
                        <td style={thTdStyle()}>{t(item.actor)}</td>
                        <td style={thTdStyle()}>{t(item.action)}</td>
                        <td style={thTdStyle()}>{t(item.target)}</td>
                        <td style={thTdStyle()}>{item.time}</td>
                        <td style={thTdStyle()}>{t(item.result)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ ...sectionCardStyle(), display: "grid", gap: 12 }}>
                <h2 style={{ margin: 0, fontSize: 18 }}>{t("admin.finance.failedJobsTitle")}</h2>
                <table style={tableShellStyle()}>
                  <thead>
                    <tr>
                      <th style={thTdStyle()}>{t("admin.finance.columns.jobType")}</th>
                      <th style={thTdStyle()}>{t("admin.finance.columns.context")}</th>
                      <th style={thTdStyle()}>{t("admin.finance.columns.time")}</th>
                      <th style={thTdStyle()}>{t("admin.finance.columns.status")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {failedJobs.map((item, index) => (
                      <tr key={`${item.job}-${index}`}>
                        <td style={thTdStyle()}>{t(item.job)}</td>
                        <td style={thTdStyle()}>{t(item.context)}</td>
                        <td style={thTdStyle()}>{item.time}</td>
                        <td style={thTdStyle()}>{t(item.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </>
      )}
      <section className="grid gap-4 rounded-3xl border border-[var(--mimo-color-border)] bg-[var(--mimo-color-surface)] p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="grid gap-1">
            <h2 className="text-lg font-semibold text-[var(--mimo-color-foreground)]">{t("support.queue.title")}</h2>
            <p className="text-sm text-[var(--mimo-color-text-muted)]">{t("support.queue.subtitle")}</p>
          </div>
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="rounded-full border border-[var(--mimo-color-border)] px-3 py-1">{t("support.queue.filter.issueType")}</span>
            <span className="rounded-full border border-[var(--mimo-color-border)] px-3 py-1">{t("support.queue.filter.status")}</span>
            <span className="rounded-full border border-[var(--mimo-color-border)] px-3 py-1">{t("support.queue.filter.refundCredit")}</span>
            <span className="rounded-full border border-[var(--mimo-color-border)] px-3 py-1">{t("support.queue.filter.recency")}</span>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="grid gap-3">
            {supportCases.map((supportCase) => (
              <div key={supportCase.id} className="grid gap-3 rounded-2xl border border-[var(--mimo-color-border)] bg-[var(--mimo-color-background)] p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="grid gap-1">
                    <div className="text-sm font-medium text-[var(--mimo-color-foreground)]">{supportCase.id}</div>
                    <div className="text-sm text-[var(--mimo-color-text-muted)]">
                      {t("support.queue.linkedOrder")}: {supportCase.orderRef}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-[var(--mimo-color-accent-subtle)] px-3 py-1">{t(`support.issue.type.${supportCase.issueType}`)}</span>
                    <span className="rounded-full border border-[var(--mimo-color-border)] px-3 py-1">{t(`support.queue.status.${supportCase.status}`)}</span>
                    <span className="rounded-full border border-[var(--mimo-color-border)] px-3 py-1">{supportCase.updatedAt}</span>
                    <span className="rounded-full border border-[var(--mimo-color-border)] px-3 py-1">{t(`support.queue.finance.${supportCase.finance}`)}</span>
                  </div>
                </div>

                <div className="text-sm text-[var(--mimo-color-text-muted)]">{supportCase.summary}</div>

                <div className="flex flex-wrap gap-2">
                  <button type="button" className="rounded-2xl bg-[var(--mimo-color-foreground)] px-4 py-2 text-sm font-medium text-[var(--mimo-color-background)]">
                    {t("support.queue.openCase")}
                  </button>
                  <button type="button" className="rounded-2xl border border-[var(--mimo-color-border)] px-4 py-2 text-sm font-medium">
                    {t("support.queue.addUpdate")}
                  </button>
                  <button type="button" className="rounded-2xl border border-[var(--mimo-color-border)] px-4 py-2 text-sm font-medium">
                    {t("support.queue.resolve")}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <aside className="grid gap-3 rounded-2xl border border-[var(--mimo-color-border)] bg-[var(--mimo-color-background)] p-4">
            <div className="grid gap-1">
              <div className="text-sm font-medium text-[var(--mimo-color-foreground)]">SUP-204</div>
              <div className="text-sm text-[var(--mimo-color-text-muted)]">{t("support.queue.linkedOrder")}: ORD-1048</div>
            </div>

            <div className="grid gap-2 text-sm text-[var(--mimo-color-text-muted)]">
              <div>{t("support.status.underReview.title")}</div>
              <div>{t("support.status.underReview.body")}</div>
              <div>{t("support.queue.finance.refundReview")}</div>
            </div>

            <div className="grid gap-2">
              <div className="text-sm font-medium text-[var(--mimo-color-foreground)]">{t("support.queue.timelineTitle")}</div>
              <ul className="grid gap-2 text-sm text-[var(--mimo-color-text-muted)]">
                <li>{t("support.audit.received")}</li>
                <li>{t("support.audit.reviewStarted")}</li>
                <li>{t("support.audit.financeCheck")}</li>
              </ul>
            </div>

            <label className="grid gap-2 text-sm">
              <span className="font-medium text-[var(--mimo-color-foreground)]">{t("support.queue.auditNote")}</span>
              <textarea
                className="min-h-24 rounded-2xl border border-[var(--mimo-color-border)] bg-transparent px-3 py-2 text-sm"
                placeholder={t("support.queue.auditPlaceholder")}
              />
            </label>

            <div className="flex flex-wrap gap-2">
              <button type="button" className="rounded-2xl bg-[var(--mimo-color-foreground)] px-4 py-2 text-sm font-medium text-[var(--mimo-color-background)]">
                {t("support.queue.underReview")}
              </button>
              <button type="button" className="rounded-2xl border border-[var(--mimo-color-border)] px-4 py-2 text-sm font-medium">
                {t("support.queue.actionInProgress")}
              </button>
              <button type="button" className="rounded-2xl border border-[var(--mimo-color-border)] px-4 py-2 text-sm font-medium">
                {t("support.queue.refundReview")}
              </button>
              <button type="button" className="rounded-2xl border border-[var(--mimo-color-border)] px-4 py-2 text-sm font-medium">
                {t("support.queue.resolve")}
              </button>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

export function P2AdminOrderDetail({ orderId }: { orderId: string }) {
  const { t } = useTranslation();
  const order = globalOrders.find((item) => item.id === orderId) ?? globalOrders[0]!;

  return (
    <main style={{ display: "grid", gap: 20, paddingBottom: 40 }}>
      <section
        style={{
          ...sectionCardStyle(),
          background:
            "linear-gradient(135deg, rgba(17,24,39,0.96), rgba(31,41,55,0.92))",
          color: "var(--color-silk, #f8f6f2)",
        }}
      >
        <div style={{ display: "grid", gap: 10 }}>
          <span style={{ fontSize: 12, letterSpacing: 1.2, textTransform: "uppercase", opacity: 0.8 }}>
            {t("admin.orderDetail.eyebrow")}
          </span>
          <h1 style={{ margin: 0, fontSize: 30 }}>{t("admin.orderDetail.title")}  {order.ref}</h1>
          <p style={{ margin: 0 }}>{t("admin.orderDetail.body")}</p>
        </div>
      </section>

      <section style={{ display: "grid", gap: 16, gridTemplateColumns: "1.1fr 0.9fr" }}>
        <div style={{ ...sectionCardStyle(), display: "grid", gap: 12 }}>
          <h2 style={{ margin: 0, fontSize: 20 }}>{t("admin.orderDetail.sourceOfTruthTitle")}</h2>
          <table style={tableShellStyle()}>
            <tbody>
              <tr><td style={thTdStyle()}><strong>{t("admin.orderDetail.fields.order")}</strong></td><td style={thTdStyle()}>{order.ref}</td></tr>
              <tr><td style={thTdStyle()}><strong>{t("admin.orderDetail.fields.source")}</strong></td><td style={thTdStyle()}>{t(order.source)}</td></tr>
              <tr><td style={thTdStyle()}><strong>{t("admin.orderDetail.fields.customer")}</strong></td><td style={thTdStyle()}>{order.customer}</td></tr>
              <tr><td style={thTdStyle()}><strong>{t("admin.orderDetail.fields.zone")}</strong></td><td style={thTdStyle()}>{order.zone}</td></tr>
              <tr><td style={thTdStyle()}><strong>{t("admin.orderDetail.fields.hub")}</strong></td><td style={thTdStyle()}>{order.hub}</td></tr>
              <tr><td style={thTdStyle()}><strong>{t("admin.orderDetail.fields.affiliate")}</strong></td><td style={thTdStyle()}>{order.affiliate}</td></tr>
              <tr><td style={thTdStyle()}><strong>{t("admin.orderDetail.fields.driver")}</strong></td><td style={thTdStyle()}>{order.driver}</td></tr>
              <tr><td style={thTdStyle()}><strong>{t("admin.orderDetail.fields.status")}</strong></td><td style={thTdStyle()}>{t(order.status)}</td></tr>
              <tr><td style={thTdStyle()}><strong>{t("admin.orderDetail.fields.payment")}</strong></td><td style={thTdStyle()}>{t(order.payment)}</td></tr>
            </tbody>
          </table>
        </div>

        <div style={{ display: "grid", gap: 16 }}>
          <div style={{ ...sectionCardStyle(), display: "grid", gap: 10 }}>
            <h2 style={{ margin: 0, fontSize: 18 }}>{t("admin.orderDetail.safeActionsTitle")}</h2>
            <StatusBadge label={t("admin.orderDetail.safeActionViewTimeline")} tone="default" />
            <StatusBadge label={t("admin.orderDetail.safeActionOpenFinance")} tone="warning" />
            <StatusBadge label={t("admin.orderDetail.safeActionOpenOperations")} tone="default" />
          </div>

          <div style={{ ...sectionCardStyle(), display: "grid", gap: 10 }}>
            <h2 style={{ margin: 0, fontSize: 18 }}>{t("admin.orderDetail.issueContextTitle")}</h2>
            <p style={{ margin: 0 }}>{t("admin.orderDetail.issueContextBody")}</p>
            <StatusBadge
              label={t(order.attention)}
              tone={order.attention === "admin.data.attention.issue" ? "danger" : order.attention === "admin.data.attention.delayed" ? "warning" : "default"}
            />
          </div>
        </div>
      </section>
      
    </main>
  );
}







