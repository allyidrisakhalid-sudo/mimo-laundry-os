"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import i18n from "../../../src/i18n";

type HubStage = "readyForProcessing" | "inProcessing" | "qcNeeded" | "readyForDispatch";
type HubIssueState = "none" | "open";
type ServiceTier = "Standard" | "Express" | "Same-day";

type HubOrder = {
  id: string;
  ref: string;
  customer: string;
  zone: string;
  tier: ServiceTier;
  stage: HubStage;
  issue: HubIssueState;
  sla: string;
  bags: number;
  driver?: string;
};

type HubDriver = {
  id: string;
  name: string;
  zone: string;
  availability: "available" | "busy";
};

const hubOrdersSeed: HubOrder[] = [
  {
    id: "HUB-1001",
    ref: "MM-240301",
    customer: "Asha M.",
    zone: "Msasani",
    tier: "Express",
    stage: "readyForProcessing",
    issue: "none",
    sla: "2h to wash start",
    bags: 2,
  },
  {
    id: "HUB-1002",
    ref: "MM-240302",
    customer: "John K.",
    zone: "Mikocheni",
    tier: "Standard",
    stage: "inProcessing",
    issue: "open",
    sla: "QC by 18:00",
    bags: 1,
  },
  {
    id: "HUB-1003",
    ref: "MM-240303",
    customer: "Neema T.",
    zone: "Msasani",
    tier: "Same-day",
    stage: "qcNeeded",
    issue: "none",
    sla: "Dispatch in 45m",
    bags: 3,
  },
  {
    id: "HUB-1004",
    ref: "MM-240304",
    customer: "Peter J.",
    zone: "Sinza",
    tier: "Standard",
    stage: "readyForDispatch",
    issue: "none",
    sla: "Dispatch by 16:00",
    bags: 2,
  },
  {
    id: "HUB-1005",
    ref: "MM-240305",
    customer: "Mariam R.",
    zone: "Sinza",
    tier: "Express",
    stage: "readyForDispatch",
    issue: "open",
    sla: "Dispatch by 15:30",
    bags: 1,
  },
];

const intakeQueueSeed: HubOrder[] = [
  hubOrdersSeed[0]!,
  {
    id: "HUB-1006",
    ref: "MM-240306",
    customer: "Kelvin P.",
    zone: "Mikocheni",
    tier: "Standard",
    stage: "readyForProcessing",
    issue: "none",
    sla: "Receive now",
    bags: 1,
  },
  {
    id: "HUB-1007",
    ref: "MM-240307",
    customer: "Halima N.",
    zone: "Msasani",
    tier: "Same-day",
    stage: "readyForProcessing",
    issue: "open",
    sla: "Priority receive",
    bags: 4,
  },
];

const driversSeed: HubDriver[] = [
  { id: "DRV-01", name: "Hassan", zone: "Msasani", availability: "available" },
  { id: "DRV-02", name: "Yusuph", zone: "Mikocheni", availability: "available" },
  { id: "DRV-03", name: "Rehema", zone: "Sinza", availability: "busy" },
];

function stageKey(stage: HubStage) {
  return `hub.processing.stages.${stage}` as const;
}

function issueTone(issue: HubIssueState) {
  return issue === "open"
    ? "border-[color:var(--color-danger)] bg-[color:rgba(220,38,38,0.08)] text-[color:var(--color-danger)]"
    : "border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-muted)]";
}

function tierTone(tier: ServiceTier) {
  if (tier === "Same-day") return "bg-[color:rgba(245,158,11,0.15)] text-[color:var(--color-warning)]";
  if (tier === "Express") return "bg-[color:rgba(59,130,246,0.15)] text-[color:var(--color-info)]";
  return "bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-muted)]";
}

export function HubPageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-[28px] border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-5 md:flex-row md:items-center md:justify-between">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-[color:var(--color-text)]">{title}</h1>
        <p className="text-sm text-[color:var(--color-text-muted)]">{subtitle}</p>
      </div>
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </div>
  );
}

export function HubDashboardView() {
  const t = i18n.t.bind(i18n);

  const metrics = [
    { label: t("hub.dashboard.kpis.intakeWaiting"), value: intakeQueueSeed.length, href: "/app/hub/intake" },
    {
      label: t("hub.dashboard.kpis.inProcessing"),
      value: hubOrdersSeed.filter((item) => item.stage === "inProcessing").length,
      href: "/app/hub/processing",
    },
    {
      label: t("hub.dashboard.kpis.readyForDispatch"),
      value: hubOrdersSeed.filter((item) => item.stage === "readyForDispatch").length,
      href: "/app/hub/processing?dispatch=1",
    },
    {
      label: t("hub.dashboard.kpis.exceptions"),
      value: hubOrdersSeed.filter((item) => item.issue === "open").length,
      href: "/app/hub/processing?issue=open",
    },
  ];

  const actionQueue = [
    {
      label: t("hub.dashboard.actionQueue.receiveIntake"),
      detail: t("hub.dashboard.actionQueue.receiveIntakeDetail"),
      href: "/app/hub/intake",
    },
    {
      label: t("hub.dashboard.actionQueue.processQc"),
      detail: t("hub.dashboard.actionQueue.processQcDetail"),
      href: "/app/hub/processing",
    },
    {
      label: t("hub.dashboard.actionQueue.dispatchReady"),
      detail: t("hub.dashboard.actionQueue.dispatchReadyDetail"),
      href: "/app/hub/processing?dispatch=1",
    },
  ];

  const activeList = hubOrdersSeed.slice(0, 4);

  return (
    <div className="space-y-6">
      <HubPageHeader
        title={t("hub.dashboard.title")}
        subtitle={t("hub.dashboard.subtitle")}
        actions={
          <>
            <Link href="/app/hub/intake" className="rounded-full bg-[color:var(--color-text)] px-4 py-2 text-sm font-medium text-[color:var(--color-surface)]">
              {t("hub.actions.openIntake")}
            </Link>
            <Link href="/app/hub/processing" className="rounded-full border border-[color:var(--color-border)] px-4 py-2 text-sm font-medium text-[color:var(--color-text)]">
              {t("hub.actions.openProcessing")}
            </Link>
          </>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <Link
            key={metric.label}
            href={metric.href}
            className="rounded-[24px] border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-5 transition hover:-translate-y-0.5"
          >
            <div className="text-sm text-[color:var(--color-text-muted)]">{metric.label}</div>
            <div className="mt-2 text-3xl font-semibold text-[color:var(--color-text)]">{metric.value}</div>
          </Link>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[24px] border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[color:var(--color-text)]">{t("hub.dashboard.actionQueue.title")}</h2>
            <span className="text-sm text-[color:var(--color-text-muted)]">{t("hub.dashboard.actionQueue.priorityLabel")}</span>
          </div>
          <div className="space-y-3">
            {actionQueue.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block rounded-[18px] border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] p-4"
              >
                <div className="font-medium text-[color:var(--color-text)]">{item.label}</div>
                <div className="mt-1 text-sm text-[color:var(--color-text-muted)]">{item.detail}</div>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-[24px] border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[color:var(--color-text)]">{t("hub.dashboard.activeList.title")}</h2>
            <span className="text-sm text-[color:var(--color-text-muted)]">{t("hub.dashboard.activeList.liveLabel")}</span>
          </div>
          <div className="space-y-3">
            {activeList.map((order) => (
              <Link
                key={order.id}
                href={`/app/hub/orders/${order.id}`}
                className="block rounded-[18px] border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="font-medium text-[color:var(--color-text)]">{order.ref}</div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${tierTone(order.tier)}`}>{order.tier}</span>
                </div>
                <div className="mt-1 text-sm text-[color:var(--color-text-muted)]">
                  {order.customer}  {order.zone}
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-[color:var(--color-text-muted)]">
                  <span>{t(stageKey(order.stage))}</span>
                  <span>{order.sla}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export function HubIntakeView() {
  const t = i18n.t.bind(i18n);
  const [scanValue, setScanValue] = useState("");
  const [selectedId, setSelectedId] = useState(intakeQueueSeed[0]?.id ?? "");
  const [lastMessage, setLastMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const activeItem = intakeQueueSeed.find((item) => item.id === selectedId) ?? intakeQueueSeed[0] ?? null;

  function openFromScan() {
    setLoading(true);
    const normalized = scanValue.trim().toLowerCase();
    const found =
      intakeQueueSeed.find((item) => item.id.toLowerCase() === normalized || item.ref.toLowerCase() === normalized) ?? null;

    setTimeout(() => {
      if (found) {
        setSelectedId(found.id);
        setLastMessage(t("hub.intake.scanFound"));
      } else {
        setLastMessage(t("hub.intake.scanMissing"));
      }
      setLoading(false);
    }, 300);
  }

  return (
    <div className="space-y-6">
      <HubPageHeader
        title={t("hub.intake.title")}
        subtitle={t("hub.intake.subtitle")}
        actions={
          <Link href="/app/hub/processing" className="rounded-full border border-[color:var(--color-border)] px-4 py-2 text-sm font-medium text-[color:var(--color-text)]">
            {t("hub.actions.openProcessing")}
          </Link>
        }
      />

      <section className="rounded-[24px] border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-5">
        <div className="mb-3 text-sm font-medium text-[color:var(--color-text)]">{t("hub.intake.scanLabel")}</div>
        <div className="flex flex-col gap-3 md:flex-row">
          <input
            value={scanValue}
            onChange={(event) => setScanValue(event.target.value)}
            placeholder={t("hub.intake.scanPlaceholder")}
            className="min-h-12 flex-1 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-4 text-sm text-[color:var(--color-text)] outline-none"
          />
          <button
            type="button"
            onClick={openFromScan}
            className="min-h-12 rounded-full bg-[color:var(--color-text)] px-5 text-sm font-medium text-[color:var(--color-surface)]"
          >
            {loading ? t("hub.states.loadingIntake") : t("hub.intake.openItem")}
          </button>
        </div>
        <div className="mt-3 text-sm text-[color:var(--color-text-muted)]">{t("hub.intake.scanSupport")}</div>
        {lastMessage ? (
          <div className="mt-4 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-3 text-sm text-[color:var(--color-text)]">
            {lastMessage}
          </div>
        ) : null}
      </section>

      {activeItem?.issue === "open" ? (
        <section className="rounded-[24px] border border-[color:var(--color-danger)] bg-[color:rgba(220,38,38,0.08)] p-4">
          <div className="text-sm font-medium text-[color:var(--color-danger)]">{t("hub.states.issueReported")}</div>
          <div className="mt-1 text-sm text-[color:var(--color-text)]">{t("hub.intake.issueStrip")}</div>
        </section>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[24px] border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[color:var(--color-text)]">{t("hub.intake.queueTitle")}</h2>
            <span className="text-sm text-[color:var(--color-text-muted)]">{intakeQueueSeed.length}</span>
          </div>

          {intakeQueueSeed.length === 0 ? (
            <div className="rounded-[18px] border border-dashed border-[color:var(--color-border)] p-5 text-sm text-[color:var(--color-text-muted)]">
              {t("hub.states.noIntakeItems")}
            </div>
          ) : (
            <div className="space-y-3">
              {intakeQueueSeed.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedId(item.id)}
                  className={`w-full rounded-[18px] border p-4 text-left ${
                    item.id === activeItem?.id
                      ? "border-[color:var(--color-text)] bg-[color:var(--color-surface-muted)]"
                      : "border-[color:var(--color-border)] bg-[color:var(--color-panel)]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-medium text-[color:var(--color-text)]">{item.ref}</div>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${tierTone(item.tier)}`}>{item.tier}</span>
                  </div>
                  <div className="mt-1 text-sm text-[color:var(--color-text-muted)]">
                    {item.customer}  {item.zone}
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-[color:var(--color-text-muted)]">
                    <span>{item.bags} {t("hub.intake.bags")}</span>
                    <span>{item.sla}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-[24px] border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[color:var(--color-text)]">{t("hub.intake.activeTitle")}</h2>
            {activeItem ? (
              <Link href={`/app/hub/orders/${activeItem.id}`} className="text-sm font-medium text-[color:var(--color-text)] underline">
                {t("hub.intake.openDetail")}
              </Link>
            ) : null}
          </div>

          {!activeItem ? (
            <div className="rounded-[18px] border border-dashed border-[color:var(--color-border)] p-5 text-sm text-[color:var(--color-text-muted)]">
              {t("hub.states.noIntakeItems")}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-[18px] border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] p-4">
                <div className="text-sm text-[color:var(--color-text-muted)]">{t("hub.labels.orderRef")}</div>
                <div className="mt-1 text-lg font-semibold text-[color:var(--color-text)]">{activeItem.ref}</div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-[18px] border border-[color:var(--color-border)] p-4">
                  <div className="text-sm text-[color:var(--color-text-muted)]">{t("hub.labels.customer")}</div>
                  <div className="mt-1 font-medium text-[color:var(--color-text)]">{activeItem.customer}</div>
                </div>
                <div className="rounded-[18px] border border-[color:var(--color-border)] p-4">
                  <div className="text-sm text-[color:var(--color-text-muted)]">{t("hub.labels.zone")}</div>
                  <div className="mt-1 font-medium text-[color:var(--color-text)]">{activeItem.zone}</div>
                </div>
                <div className="rounded-[18px] border border-[color:var(--color-border)] p-4">
                  <div className="text-sm text-[color:var(--color-text-muted)]">{t("hub.labels.bags")}</div>
                  <div className="mt-1 font-medium text-[color:var(--color-text)]">{activeItem.bags}</div>
                </div>
                <div className="rounded-[18px] border border-[color:var(--color-border)] p-4">
                  <div className="text-sm text-[color:var(--color-text-muted)]">{t("hub.labels.sla")}</div>
                  <div className="mt-1 font-medium text-[color:var(--color-text)]">{activeItem.sla}</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button type="button" className="rounded-full bg-[color:var(--color-text)] px-4 py-2 text-sm font-medium text-[color:var(--color-surface)]">
                  {t("hub.intake.receiveAction")}
                </button>
                <Link href="/app/hub/processing" className="rounded-full border border-[color:var(--color-border)] px-4 py-2 text-sm font-medium text-[color:var(--color-text)]">
                  {t("hub.intake.moveToProcessing")}
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export function HubProcessingView() {
  const t = i18n.t.bind(i18n);
  const [issueFilter, setIssueFilter] = useState<"all" | "open">("all");
  const [tierFilter, setTierFilter] = useState<"all" | ServiceTier>("all");
  const [dispatchZone, setDispatchZone] = useState("Msasani");
  const [dispatchDriver, setDispatchDriver] = useState("");
  const [assignmentMessage, setAssignmentMessage] = useState<string | null>(null);
  const [qcState, setQcState] = useState<Record<string, HubIssueState>>({});
  const [stageState, setStageState] = useState<Record<string, HubStage>>({});

  const orders = useMemo(
    () =>
      hubOrdersSeed.map((item) => ({
        ...item,
        issue: qcState[item.id] ?? item.issue,
        stage: stageState[item.id] ?? item.stage,
      })),
    [qcState, stageState],
  );

  const visibleOrders = orders.filter((item) => {
    if (issueFilter === "open" && item.issue !== "open") return false;
    if (tierFilter !== "all" && item.tier !== tierFilter) return false;
    return true;
  });

  const columns: { key: HubStage; title: string }[] = [
    { key: "readyForProcessing", title: t("hub.processing.stages.readyForProcessing") },
    { key: "inProcessing", title: t("hub.processing.stages.inProcessing") },
    { key: "qcNeeded", title: t("hub.processing.stages.qcNeeded") },
    { key: "readyForDispatch", title: t("hub.processing.stages.readyForDispatch") },
  ];

  const dispatchReady = orders.filter((item) => item.stage === "readyForDispatch" && item.zone === dispatchZone);
  const zoneDrivers = driversSeed.filter((driver) => driver.zone === dispatchZone);

  function advanceStage(order: HubOrder) {
    const nextMap: Record<HubStage, HubStage> = {
      readyForProcessing: "inProcessing",
      inProcessing: "qcNeeded",
      qcNeeded: "readyForDispatch",
      readyForDispatch: "readyForDispatch",
    };
    setStageState((current) => ({ ...current, [order.id]: nextMap[order.stage] }));
  }

  function markQc(order: HubOrder, result: "pass" | "fail") {
    if (result === "pass") {
      setQcState((current) => ({ ...current, [order.id]: "none" }));
      setStageState((current) => ({ ...current, [order.id]: "readyForDispatch" }));
      setAssignmentMessage(t("hub.states.assignmentComplete"));
      return;
    }

    setQcState((current) => ({ ...current, [order.id]: "open" }));
    setStageState((current) => ({ ...current, [order.id]: "qcNeeded" }));
    setAssignmentMessage(t("hub.states.qcIssueOpen"));
  }

  function assignDispatch() {
    if (!dispatchDriver || dispatchReady.length === 0) {
      setAssignmentMessage(t("hub.states.noDriverAvailable"));
      return;
    }

    setStageState((current) => {
      const next = { ...current };
      for (const item of dispatchReady) {
        next[item.id] = "inProcessing";
      }
      return next;
    });

    setAssignmentMessage(t("hub.dispatch.assignmentComplete"));
  }

  return (
    <div className="space-y-6">
      <HubPageHeader
        title={t("hub.processing.title")}
        subtitle={t("hub.processing.subtitle")}
        actions={
          <>
            <Link href="/app/hub/intake" className="rounded-full border border-[color:var(--color-border)] px-4 py-2 text-sm font-medium text-[color:var(--color-text)]">
              {t("hub.actions.openIntake")}
            </Link>
            <Link href="/app/hub" className="rounded-full border border-[color:var(--color-border)] px-4 py-2 text-sm font-medium text-[color:var(--color-text)]">
              {t("hub.actions.openDashboard")}
            </Link>
          </>
        }
      />

      <section className="rounded-[24px] border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-5">
        <div className="grid gap-3 md:grid-cols-3">
          <label className="space-y-2">
            <span className="text-sm text-[color:var(--color-text-muted)]">{t("hub.processing.filters.issue")}</span>
            <select
              value={issueFilter}
              onChange={(event) => setIssueFilter(event.target.value as "all" | "open")}
              className="min-h-12 w-full rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-4 text-sm text-[color:var(--color-text)]"
            >
              <option value="all">{t("hub.processing.filterValues.allIssues")}</option>
              <option value="open">{t("hub.processing.filterValues.openIssues")}</option>
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm text-[color:var(--color-text-muted)]">{t("hub.processing.filters.tier")}</span>
            <select
              value={tierFilter}
              onChange={(event) => setTierFilter(event.target.value as "all" | ServiceTier)}
              className="min-h-12 w-full rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-4 text-sm text-[color:var(--color-text)]"
            >
              <option value="all">{t("hub.processing.filterValues.allTiers")}</option>
              <option value="Standard">Standard</option>
              <option value="Express">Express</option>
              <option value="Same-day">Same-day</option>
            </select>
          </label>

          <div className="space-y-2">
            <span className="text-sm text-[color:var(--color-text-muted)]">{t("hub.processing.filters.sla")}</span>
            <div className="min-h-12 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-4 py-3 text-sm text-[color:var(--color-text-muted)]">
              {t("hub.processing.filterValues.livePriority")}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-4">
        {columns.map((column) => {
          const items = visibleOrders.filter((item) => item.stage === column.key);

          return (
            <div key={column.key} className="rounded-[24px] border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-4">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-semibold text-[color:var(--color-text)]">{column.title}</h2>
                <span className="text-sm text-[color:var(--color-text-muted)]">{items.length}</span>
              </div>

              {items.length === 0 ? (
                <div className="rounded-[18px] border border-dashed border-[color:var(--color-border)] p-4 text-sm text-[color:var(--color-text-muted)]">
                  {t("hub.states.noProcessingItems")}
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="rounded-[18px] border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] p-4">
                      <div className="flex items-center justify-between gap-3">
                        <Link href={`/app/hub/orders/${item.id}`} className="font-medium text-[color:var(--color-text)] underline">
                          {item.ref}
                        </Link>
                        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${tierTone(item.tier)}`}>{item.tier}</span>
                      </div>

                      <div className="mt-1 text-sm text-[color:var(--color-text-muted)]">
                        {item.zone}  {item.sla}
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${issueTone(item.issue)}`}>
                          {item.issue === "open" ? t("hub.labels.issueOpen") : t("hub.labels.noIssue")}
                        </span>
                        <span className="rounded-full border border-[color:var(--color-border)] px-2.5 py-1 text-xs font-medium text-[color:var(--color-text-muted)]">
                          {t(stageKey(item.stage))}
                        </span>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {item.stage !== "readyForDispatch" ? (
                          <button
                            type="button"
                            onClick={() => advanceStage(item)}
                            className="rounded-full border border-[color:var(--color-border)] px-3 py-2 text-xs font-medium text-[color:var(--color-text)]"
                          >
                            {t("hub.processing.advanceAction")}
                          </button>
                        ) : null}

                        {(item.stage === "qcNeeded" || item.issue === "open") ? (
                          <>
                            <button
                              type="button"
                              onClick={() => markQc(item, "pass")}
                              className="rounded-full bg-[color:var(--color-text)] px-3 py-2 text-xs font-medium text-[color:var(--color-surface)]"
                            >
                              {t("hub.qc.pass")}
                            </button>
                            <button
                              type="button"
                              onClick={() => markQc(item, "fail")}
                              className="rounded-full border border-[color:var(--color-border)] px-3 py-2 text-xs font-medium text-[color:var(--color-text)]"
                            >
                              {t("hub.qc.fail")}
                            </button>
                          </>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[24px] border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[color:var(--color-text)]">{t("hub.dispatch.title")}</h2>
            <span className="text-sm text-[color:var(--color-text-muted)]">{t("hub.dispatch.readyOnly")}</span>
          </div>

          <div className="space-y-2">
            <label className="space-y-2">
              <span className="text-sm text-[color:var(--color-text-muted)]">{t("hub.dispatch.zoneFilter")}</span>
              <select
                value={dispatchZone}
                onChange={(event) => setDispatchZone(event.target.value)}
                className="min-h-12 w-full rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-4 text-sm text-[color:var(--color-text)]"
              >
                <option value="Msasani">Msasani</option>
                <option value="Mikocheni">Mikocheni</option>
                <option value="Sinza">Sinza</option>
              </select>
            </label>
          </div>

          <div className="mt-4 space-y-3">
            {dispatchReady.length === 0 ? (
              <div className="rounded-[18px] border border-dashed border-[color:var(--color-border)] p-4 text-sm text-[color:var(--color-text-muted)]">
                {t("hub.states.noDispatchReady")}
              </div>
            ) : (
              dispatchReady.map((item) => (
                <div key={item.id} className="rounded-[18px] border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-medium text-[color:var(--color-text)]">{item.ref}</div>
                    <Link href={`/app/hub/orders/${item.id}`} className="text-sm text-[color:var(--color-text)] underline">
                      {t("hub.dispatch.openOrder")}
                    </Link>
                  </div>
                  <div className="mt-1 text-sm text-[color:var(--color-text-muted)]">
                    {item.customer}  {item.zone}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-[24px] border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[color:var(--color-text)]">{t("hub.dispatch.driverTitle")}</h2>
            <span className="text-sm text-[color:var(--color-text-muted)]">{t("hub.dispatch.zoneFiltered")}</span>
          </div>

          {zoneDrivers.length === 0 ? (
            <div className="rounded-[18px] border border-dashed border-[color:var(--color-border)] p-4 text-sm text-[color:var(--color-text-muted)]">
              {t("hub.states.noDriverAvailable")}
            </div>
          ) : (
            <div className="space-y-3">
              {zoneDrivers.map((driver) => (
                <label key={driver.id} className="flex items-center gap-3 rounded-[18px] border border-[color:var(--color-border)] p-4">
                  <input
                    type="radio"
                    name="dispatch-driver"
                    value={driver.id}
                    checked={dispatchDriver === driver.id}
                    onChange={(event) => setDispatchDriver(event.target.value)}
                  />
                  <div className="flex-1">
                    <div className="font-medium text-[color:var(--color-text)]">{driver.name}</div>
                    <div className="mt-1 text-sm text-[color:var(--color-text-muted)]">
                      {driver.zone}  {t(`hub.dispatch.availability.${driver.availability}` as const)}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={assignDispatch}
              className="rounded-full bg-[color:var(--color-text)] px-4 py-2 text-sm font-medium text-[color:var(--color-surface)]"
            >
              {t("hub.dispatch.assignAction")}
            </button>
            <div className="rounded-full border border-[color:var(--color-border)] px-4 py-2 text-sm text-[color:var(--color-text-muted)]">
              {dispatchReady.length} {t("hub.dispatch.itemsReady")}
            </div>
          </div>

          {assignmentMessage ? (
            <div className="mt-4 rounded-[18px] border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] p-4 text-sm text-[color:var(--color-text)]">
              {assignmentMessage}
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}

export function HubOrderDetailView({ orderId }: { orderId: string }) {
  const t = i18n.t.bind(i18n);
  const [issueState, setIssueState] = useState<HubIssueState>("none");
  const [qcMessage, setQcMessage] = useState<string | null>(null);

  const order = hubOrdersSeed.find((item) => item.id === orderId) ?? hubOrdersSeed[2]!;

  function markPass() {
    setIssueState("none");
    setQcMessage(t("hub.qc.passComplete"));
  }

  function markFail() {
    setIssueState("open");
    setQcMessage(t("hub.qc.failComplete"));
  }

  return (
    <div className="space-y-6">
      <HubPageHeader
        title={t("hub.orderDetail.title")}
        subtitle={`${order.ref}  ${order.customer}`}
        actions={
          <>
            <Link href="/app/hub/processing" className="rounded-full border border-[color:var(--color-border)] px-4 py-2 text-sm font-medium text-[color:var(--color-text)]">
              {t("hub.actions.openProcessing")}
            </Link>
            <Link href="/app/hub/intake" className="rounded-full border border-[color:var(--color-border)] px-4 py-2 text-sm font-medium text-[color:var(--color-text)]">
              {t("hub.actions.openIntake")}
            </Link>
          </>
        }
      />

      <section className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
        <div className="rounded-[24px] border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-5">
          <h2 className="text-lg font-semibold text-[color:var(--color-text)]">{t("hub.orderDetail.summaryTitle")}</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-[18px] border border-[color:var(--color-border)] p-4">
              <div className="text-sm text-[color:var(--color-text-muted)]">{t("hub.labels.orderRef")}</div>
              <div className="mt-1 font-medium text-[color:var(--color-text)]">{order.ref}</div>
            </div>
            <div className="rounded-[18px] border border-[color:var(--color-border)] p-4">
              <div className="text-sm text-[color:var(--color-text-muted)]">{t("hub.labels.zone")}</div>
              <div className="mt-1 font-medium text-[color:var(--color-text)]">{order.zone}</div>
            </div>
            <div className="rounded-[18px] border border-[color:var(--color-border)] p-4">
              <div className="text-sm text-[color:var(--color-text-muted)]">{t("hub.labels.stage")}</div>
              <div className="mt-1 font-medium text-[color:var(--color-text)]">{t(stageKey(order.stage))}</div>
            </div>
            <div className="rounded-[18px] border border-[color:var(--color-border)] p-4">
              <div className="text-sm text-[color:var(--color-text-muted)]">{t("hub.labels.sla")}</div>
              <div className="mt-1 font-medium text-[color:var(--color-text)]">{order.sla}</div>
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-5">
          <h2 className="text-lg font-semibold text-[color:var(--color-text)]">{t("hub.qc.title")}</h2>
          <div className="mt-3 text-sm text-[color:var(--color-text-muted)]">{t("hub.qc.subtitle")}</div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={markPass}
              className="rounded-full bg-[color:var(--color-text)] px-4 py-2 text-sm font-medium text-[color:var(--color-surface)]"
            >
              {t("hub.qc.pass")}
            </button>
            <button
              type="button"
              onClick={markFail}
              className="rounded-full border border-[color:var(--color-border)] px-4 py-2 text-sm font-medium text-[color:var(--color-text)]"
            >
              {t("hub.qc.fail")}
            </button>
          </div>

          <div className="mt-4 rounded-[18px] border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] p-4">
            <div className="text-sm text-[color:var(--color-text-muted)]">{t("hub.qc.issueReason")}</div>
            <div className="mt-2 min-h-16 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-4 py-3 text-sm text-[color:var(--color-text-muted)]">
              {issueState === "open" ? t("hub.states.qcIssueOpen") : t("hub.labels.noIssue")}
            </div>
          </div>

          {qcMessage ? (
            <div className="mt-4 rounded-[18px] border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] p-4 text-sm text-[color:var(--color-text)]">
              {qcMessage}
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}




