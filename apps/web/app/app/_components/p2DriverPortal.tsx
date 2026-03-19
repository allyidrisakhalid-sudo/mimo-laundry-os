"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  StatusBadge,
} from "@mimo/ui";
import { PortalHelpEntry, useOnboardingMessages } from "./p2Onboarding";

type DriverTaskGroup = "next" | "upcoming" | "completed";
type SyncState = "online" | "weak" | "offline" | "syncing" | "failed" | "synced";
type ProofStep = "pickup" | "scan" | "otp" | "signature" | "delivery";

type DriverTask = {
  id: string;
  title: string;
  stopCode: string;
  customer: string;
  zone: string;
  window: string;
  address: string;
  group: DriverTaskGroup;
  cashRequired: boolean;
  cashAmount?: string;
  proofStep: ProofStep;
  issueOpen?: boolean;
};

const driverTasks: DriverTask[] = [
  {
    id: "DRV-24031",
    title: "Pickup from customer",
    stopCode: "STOP-01",
    customer: "Amina Hassan",
    zone: "Masaki",
    window: "09:00 - 10:00",
    address: "Slipway Road, Masaki",
    group: "next",
    cashRequired: true,
    cashAmount: "TZS 18,000",
    proofStep: "pickup",
  },
  {
    id: "DRV-24032",
    title: "Deliver cleaned order",
    stopCode: "STOP-02",
    customer: "Kelvin Mushi",
    zone: "Oysterbay",
    window: "11:00 - 12:00",
    address: "Coco Beach junction",
    group: "upcoming",
    cashRequired: false,
    proofStep: "otp",
  },
  {
    id: "DRV-24028",
    title: "Delivered order",
    stopCode: "STOP-00",
    customer: "Neema Paul",
    zone: "Msasani",
    window: "07:30 - 08:00",
    address: "Haile Selassie Road",
    group: "completed",
    cashRequired: false,
    proofStep: "delivery",
  },
];

const groupOrder: DriverTaskGroup[] = ["next", "upcoming", "completed"];

function toneForSync(state: SyncState): "success" | "warning" | "danger" | "info" | "neutral" {
  switch (state) {
    case "online":
    case "synced":
      return "success";
    case "weak":
    case "syncing":
      return "warning";
    case "offline":
    case "failed":
      return "danger";
    default:
      return "neutral";
  }
}

function proofTone(step: ProofStep): "info" | "warning" | "success" {
  if (step === "delivery") return "success";
  if (step === "otp" || step === "signature") return "warning";
  return "info";
}

export function useDriverPortalData() {
  const nextTask = driverTasks.find((task) => task.group === "next") ?? driverTasks[0];
  const groupedTasks = groupOrder.map((group) => ({
    group,
    tasks: driverTasks.filter((task) => task.group === group),
  }));

  return {
    tasks: driverTasks,
    nextTask,
    groupedTasks,
    cashSummary: {
      collected: "TZS 12,000",
      pending: "TZS 18,000",
      needsReview: true,
    },
    alerts: [
      t.driverPortal.today.alertCash,
      t.driverPortal.today.alertSync,
    ],
  };
}

export function DriverSyncBanner({
  state,
  onRetry,
}: {
  state: SyncState;
  onRetry?: () => void;
}) {
  const { t } = useOnboardingMessages();

  const label =
    state === "online"
      ? t.driverPortal.sync.online
      : state === "weak"
        ? t.driverPortal.sync.weak
        : state === "offline"
          ? t.driverPortal.sync.offline
          : state === "syncing"
            ? t.driverPortal.sync.syncing
            : state === "failed"
              ? t.driverPortal.sync.failed
              : t.driverPortal.sync.synced;

  return (
    <Card>
      <CardContent className="flex items-center justify-between gap-3 p-4">
        <div className="flex items-center gap-3">
          <StatusBadge label={label} tone={toneForSync(state)} />
          <span className="text-sm text-[var(--mimo-color-text-muted)]">{t.driverPortal.sync.statusHint}</span>
        </div>
        {state === "failed" ? <Button variant="secondary" onClick={onRetry}>{t.driverPortal.sync.retry}</Button> : null}
      </CardContent>
    </Card>
  );
}

export function DriverMobileTabs({ active }: { active: "today" | "tasks" | "profile" }) {
  const { t } = useOnboardingMessages();

  const tabs = [
    { key: "today", href: "/app/driver", label: t.driverPortal.nav.today },
    { key: "tasks", href: "/app/driver/tasks", label: t.driverPortal.nav.tasks },
    { key: "profile", href: "/app/driver/profile", label: t.driverPortal.nav.profile },
  ] as const;

  return (
    <nav className="sticky bottom-0 z-10 border-t border-[var(--mimo-color-border)] bg-[var(--mimo-color-surface)] px-3 py-2 md:hidden">
      <div className="grid grid-cols-3 gap-2">
        {tabs.map((tab) => (
          <Link
            key={tab.key}
            href={tab.href}
            className={`rounded-2xl px-3 py-3 text-center text-sm font-medium ${
              active === tab.key
                ? "bg-[var(--mimo-color-accent-subtle)] text-[var(--mimo-color-accent-strong)]"
                : "text-[var(--mimo-color-text-muted)]"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export function DriverTodayScreen() {
  const { locale, t } = useOnboardingMessages();
  const { groupedTasks, nextTask, cashSummary } = useDriverPortalData();
  const [syncState, setSyncState] = useState<SyncState>("weak");
  const [isLoadingToday] = useState(false);
  const alerts = [t.driverPortal.today.alertCash, t.driverPortal.today.alertSync];

  if (isLoadingToday) {
    return (
      <main className="grid gap-4 pb-24 md:pb-6">
        <Card>
          <CardContent className="p-4 text-sm text-[var(--mimo-color-text-muted)]">
            {t.driverPortal.states.loadingToday}
          </CardContent>
        </Card>
        <DriverMobileTabs active="today" />
      </main>
    );
  }

  return (
    <main className="grid gap-4 pb-24 md:pb-6">
      <div className="grid gap-1">
        <div className="text-sm text-[var(--mimo-color-text-muted)]">{t.driverPortal.today.headerEyebrow}</div>
        <h1 className="text-2xl font-semibold">{t.driverPortal.today.title}</h1>
        <p className="text-sm text-[var(--mimo-color-text-muted)]">{t.driverPortal.today.subtitle}</p>
      </div>

      <DriverSyncBanner state={syncState} onRetry={() => setSyncState("syncing")} />

      <Card>
        <CardContent className="grid grid-cols-2 gap-3 p-4">
          <div className="rounded-2xl border border-[var(--mimo-color-border)] p-3">
            <div className="text-xs text-[var(--mimo-color-text-muted)]">{t.driverPortal.today.summaryStops}</div>
            <div className="mt-1 text-lg font-semibold">3</div>
          </div>
          <div className="rounded-2xl border border-[var(--mimo-color-border)] p-3">
            <div className="text-xs text-[var(--mimo-color-text-muted)]">{t.driverPortal.today.summaryZone}</div>
            <div className="mt-1 text-lg font-semibold">Masaki</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t.driverPortal.today.nextTaskTitle}</CardTitle>
          <CardDescription>{t.driverPortal.today.nextTaskBody}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="rounded-2xl border border-[var(--mimo-color-border)] p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="grid gap-1">
                <div className="font-semibold">{nextTask.title}</div>
                <div className="text-sm text-[var(--mimo-color-text-muted)]">{nextTask.customer}  {nextTask.window}</div>
                <div className="text-sm text-[var(--mimo-color-text-muted)]">{nextTask.address}</div>
              </div>
              <StatusBadge label={t.driverPortal.today.nextBadge} tone="info" />
            </div>
          </div>

          <Link href={`/app/driver/tasks/${nextTask.id}`}>
            <Button className="w-full">{t.driverPortal.today.startNextTask}</Button>
          </Link>
        </CardContent>
      </Card>

      {groupedTasks.map((section) => (
        <Card key={section.group}>
          <CardHeader>
            <CardTitle>
              {section.group === "next"
                ? t.driverPortal.today.groupNext
                : section.group === "upcoming"
                  ? t.driverPortal.today.groupUpcoming
                  : t.driverPortal.today.groupCompleted}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {section.tasks.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[var(--mimo-color-border)] p-4 text-sm text-[var(--mimo-color-text-muted)]">
                {t.driverPortal.states.noTasks}
              </div>
            ) : (
              section.tasks.map((task) => (
                <Link
                  key={task.id}
                  href={`/app/driver/tasks/${task.id}`}
                  className="grid gap-2 rounded-2xl border border-[var(--mimo-color-border)] p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-medium">{task.title}</div>
                    <StatusBadge label={task.zone} tone="neutral" />
                  </div>
                  <div className="text-sm text-[var(--mimo-color-text-muted)]">{task.customer}  {task.window}</div>
                  {task.cashRequired ? (
                    <div className="text-sm text-[var(--mimo-color-text-muted)]">{t.driverPortal.cash.expectedLabel}: {task.cashAmount}</div>
                  ) : null}
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      ))}

      <Card>
        <CardHeader>
          <CardTitle>{t.driverPortal.cash.todaySummaryTitle}</CardTitle>
          <CardDescription>{t.driverPortal.cash.todaySummaryBody}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-[var(--mimo-color-text-muted)]">{t.driverPortal.cash.collectedLabel}</span>
            <span className="font-medium">{cashSummary.collected}</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-[var(--mimo-color-text-muted)]">{t.driverPortal.cash.pendingLabel}</span>
            <span className="font-medium">{cashSummary.pending}</span>
          </div>
          <div className="rounded-2xl border border-[var(--mimo-color-border)] p-3 text-sm">
            {cashSummary.needsReview ? t.driverPortal.cash.reviewNeeded : t.driverPortal.cash.reviewClear}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t.driverPortal.today.alertsTitle}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2">
          {alerts.map((alert) => (
            <div key={alert} className="rounded-2xl border border-[var(--mimo-color-border)] p-3 text-sm">
              {alert}
            </div>
          ))}
          <PortalHelpEntry locale={locale} />
        </CardContent>
      </Card>

      <DriverMobileTabs active="today" />
    </main>
  );
}

export function DriverTasksScreen() {
  const { t } = useOnboardingMessages();
  const { tasks } = useDriverPortalData();

  return (
    <main className="grid gap-4 pb-24 md:pb-6">
      <div className="grid gap-1">
        <div className="text-sm text-[var(--mimo-color-text-muted)]">{t.driverPortal.tasks.headerEyebrow}</div>
        <h1 className="text-2xl font-semibold">{t.driverPortal.tasks.title}</h1>
        <p className="text-sm text-[var(--mimo-color-text-muted)]">{t.driverPortal.tasks.subtitle}</p>
      </div>

      <Card>
        <CardContent className="grid gap-3 p-4">
          {tasks.map((task) => (
            <Link
              key={task.id}
              href={`/app/driver/tasks/${task.id}`}
              className="grid gap-2 rounded-2xl border border-[var(--mimo-color-border)] p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="font-medium">{task.title}</div>
                <StatusBadge label={task.zone} tone="neutral" />
              </div>
              <div className="text-sm text-[var(--mimo-color-text-muted)]">{task.customer}  {task.window}</div>
              <div className="text-sm text-[var(--mimo-color-text-muted)]">{task.address}</div>
            </Link>
          ))}
        </CardContent>
      </Card>

      <DriverMobileTabs active="tasks" />
    </main>
  );
}

export function DriverTaskDetailScreen({ taskId }: { taskId: string }) {
  const { locale, t } = useOnboardingMessages();
  const { tasks } = useDriverPortalData();
  const task = useMemo(() => tasks.find((entry) => entry.id === taskId) ?? tasks[0], [taskId, tasks]);
  const [isLoadingStop] = useState(false);
  const [syncState, setSyncState] = useState<SyncState>("offline");
  const [proofState, setProofState] = useState<"pending" | "sending" | "queued" | "failed" | "synced">("pending");
  const [cashState, setCashState] = useState<"due" | "sending" | "failed" | "synced">(
    task.cashRequired ? "due" : "synced"
  );
  const [issueReported, setIssueReported] = useState(false);

  if (isLoadingStop) {
    return (
      <main className="grid gap-4 pb-24 md:pb-6">
        <Card>
          <CardContent className="p-4 text-sm text-[var(--mimo-color-text-muted)]">
            {t.driverPortal.states.loadingStop}
          </CardContent>
        </Card>
        <DriverMobileTabs active="tasks" />
      </main>
    );
  }

  const proofActionLabel =
    task.proofStep === "pickup"
      ? t.driverPortal.proof.pickup
      : task.proofStep === "scan"
        ? t.driverPortal.proof.scan
        : task.proofStep === "otp"
          ? t.driverPortal.proof.otp
          : task.proofStep === "signature"
            ? t.driverPortal.proof.signature
            : t.driverPortal.proof.delivery;

  return (
    <main className="grid gap-4 pb-24 md:pb-6">
      <div className="grid gap-1">
        <div className="text-sm text-[var(--mimo-color-text-muted)]">{t.driverPortal.stop.headerEyebrow}</div>
        <h1 className="text-2xl font-semibold">{t.driverPortal.stop.title}</h1>
        <p className="text-sm text-[var(--mimo-color-text-muted)]">{task.stopCode}  {task.customer}</p>
      </div>

      <DriverSyncBanner state={syncState} onRetry={() => setSyncState("syncing")} />

      <Card>
        <CardHeader>
          <CardTitle>{t.driverPortal.stop.summaryTitle}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2">
          <div className="font-medium">{task.title}</div>
          <div className="text-sm text-[var(--mimo-color-text-muted)]">{task.window}</div>
          <div className="text-sm text-[var(--mimo-color-text-muted)]">{task.address}</div>
          <div className="flex items-center gap-2">
            <StatusBadge label={task.zone} tone="neutral" />
            <StatusBadge label={task.proofStep.toUpperCase()} tone={proofTone(task.proofStep)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t.driverPortal.proof.title}</CardTitle>
          <CardDescription>{t.driverPortal.proof.body}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          <Button
            className="w-full"
            onClick={() => {
              setProofState("sending");
              setSyncState("syncing");
            }}
          >
            {proofActionLabel}
          </Button>

          <div className="rounded-2xl border border-[var(--mimo-color-border)] p-3 text-sm">
            {proofState === "pending"
              ? t.driverPortal.states.pendingProof
              : proofState === "sending"
                ? t.driverPortal.sync.sending
                : proofState === "queued"
                  ? t.driverPortal.sync.queued
                  : proofState === "failed"
                    ? t.driverPortal.sync.failedAction
                    : t.driverPortal.sync.synced}
          </div>

          {proofState === "failed" ? (
            <Button variant="secondary" onClick={() => setProofState("sending")}>
              {t.driverPortal.sync.retry}
            </Button>
          ) : null}
        </CardContent>
      </Card>

      {task.cashRequired ? (
        <Card>
          <CardHeader>
            <CardTitle>{t.driverPortal.cash.title}</CardTitle>
            <CardDescription>{t.driverPortal.cash.body}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="rounded-2xl border border-[var(--mimo-color-border)] p-4">
              <div className="text-sm text-[var(--mimo-color-text-muted)]">{t.driverPortal.cash.expectedLabel}</div>
              <div className="mt-1 text-lg font-semibold">{task.cashAmount}</div>
            </div>

            <div className="rounded-2xl border border-[var(--mimo-color-border)] p-3 text-sm">
              {cashState === "due"
                ? t.driverPortal.states.cashDue
                : cashState === "sending"
                  ? t.driverPortal.sync.sending
                  : cashState === "failed"
                    ? t.driverPortal.sync.failedAction
                    : t.driverPortal.sync.synced}
            </div>

            <Button
              variant="secondary"
              className="w-full"
              onClick={() => {
                setCashState("sending");
                setSyncState("syncing");
              }}
            >
              {t.driverPortal.cash.confirmCollection}
            </Button>

            <div className="text-sm text-[var(--mimo-color-text-muted)]">{t.driverPortal.cash.proofNote}</div>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>{t.driverPortal.stop.issueTitle}</CardTitle>
          <CardDescription>{t.driverPortal.stop.issueBody}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          <Button variant="secondary" className="w-full" onClick={() => setIssueReported(true)}>
            {t.driverPortal.stop.reportIssue}
          </Button>
          {issueReported ? (
            <div className="rounded-2xl border border-[var(--mimo-color-border)] p-3 text-sm">
              {t.driverPortal.states.issueReported}
            </div>
          ) : null}
          <PortalHelpEntry locale={locale} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t.driverPortal.stop.detailsTitle}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm text-[var(--mimo-color-text-muted)]">
          <div>{task.customer}</div>
          <div>{task.address}</div>
          <div>{task.window}</div>
          <div>{t.driverPortal.stop.supportingDetails}</div>
        </CardContent>
      </Card>

      <DriverMobileTabs active="tasks" />
    </main>
  );
}

export function DriverProfileScreen() {
  const { locale, t } = useOnboardingMessages();

  return (
    <main className="grid gap-4 pb-24 md:pb-6">
      <div className="grid gap-1">
        <div className="text-sm text-[var(--mimo-color-text-muted)]">{t.driverPortal.profile.headerEyebrow}</div>
        <h1 className="text-2xl font-semibold">{t.driverPortal.profile.title}</h1>
        <p className="text-sm text-[var(--mimo-color-text-muted)]">{t.driverPortal.profile.subtitle}</p>
      </div>

      <Card>
        <CardContent className="grid gap-4 p-4">
          <div className="grid gap-1">
            <div className="text-sm text-[var(--mimo-color-text-muted)]">{t.driverPortal.profile.nameLabel}</div>
            <div className="font-medium">Driver One</div>
          </div>

          <div className="grid gap-1">
            <div className="text-sm text-[var(--mimo-color-text-muted)]">{t.driverPortal.profile.phoneLabel}</div>
            <div className="font-medium">+255 788 558 975</div>
          </div>

          <div className="grid gap-1">
            <div className="text-sm text-[var(--mimo-color-text-muted)]">{t.driverPortal.profile.zoneLabel}</div>
            <div className="font-medium">Masaki</div>
          </div>

          <div className="rounded-2xl border border-[var(--mimo-color-border)] p-3 text-sm">
            {t.driverPortal.cash.reconciliationEntry}
          </div>

          <PortalHelpEntry locale={locale} />
        </CardContent>
      </Card>

      <DriverMobileTabs active="profile" />
    </main>
  );
}


