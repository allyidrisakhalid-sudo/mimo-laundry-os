"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useI18n } from "@/src/i18n/useI18n";

type HealthState = "healthy" | "degraded" | "warning";
type RetryState = "idle" | "inProgress" | "complete" | "failed";
type OverrideState = "idle" | "awaitingReason" | "pending" | "applied" | "failed";

type HealthCard = {
  key: string;
  labelKey: string;
  valueKey: string;
  tone: HealthState;
};

type MonitoringSignal = {
  titleKey: string;
  summaryKey: string;
  tone: HealthState;
};

type FailedJob = {
  id: string;
  typeKey: string;
  failureTimeKey: string;
  stateKey: string;
  summaryKey: string;
  detailsKey: string;
};

type FeatureFlag = {
  id: string;
  nameKey: string;
  summaryKey: string;
  scopeKey: string;
  state: "enabled" | "disabled";
  sensitivity: "standard" | "high";
  lastChangedKey: string;
};

type OverrideTool = {
  id: string;
  nameKey: string;
  summaryKey: string;
  sensitivityKey: string;
  targetKey: string;
};

type ActivityItem = {
  id: string;
  actorKey: string;
  actionKey: string;
  targetKey: string;
  timeKey: string;
  outcomeKey: string;
  category: "retry" | "flag" | "override";
};

function toneClass(tone: HealthState) {
  if (tone === "healthy") return "mimo-badge mimo-badge--success";
  if (tone === "warning") return "mimo-badge mimo-badge--warning";
  return "mimo-badge mimo-badge--danger";
}

function actionToneClass(kind: "standard" | "danger") {
  return kind === "danger" ? "mimo-button mimo-button--danger" : "mimo-button mimo-button--primary";
}

function DevSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mimo-card mimo-stack-lg">
      <div className="mimo-stack-xs">
        <h2>{title}</h2>
        {description ? <p className="mimo-muted">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mimo-page-header">
      <div className="mimo-stack-xs">
        <h1>{title}</h1>
        <p className="mimo-muted">{subtitle}</p>
      </div>
      {actions ? <div className="mimo-page-header__actions">{actions}</div> : null}
    </div>
  );
}

function DevNav() {
  const { t } = useI18n();

  const links = [
    { href: "/app/dev", label: t("dev.nav.home") },
    { href: "/app/dev/diagnostics", label: t("dev.nav.diagnostics") },
    { href: "/app/dev/tools", label: t("dev.nav.tools") },
    { href: "/app/dev/activity", label: t("dev.nav.activity") },
  ];

  return (
    <div className="mimo-segmented-control">
      {links.map((link) => (
        <Link key={link.href} href={link.href} className="mimo-button mimo-button--ghost">
          {link.label}
        </Link>
      ))}
    </div>
  );
}

function useDevAdminData(t: (key: string) => string) {
  return useMemo(
    () => ({
      healthCards: [
        { key: "api", labelKey: "dev.health.api", valueKey: "dev.state.healthy", tone: "healthy" as const },
        { key: "workers", labelKey: "dev.health.workers", valueKey: "dev.state.degraded", tone: "degraded" as const },
        { key: "queue", labelKey: "dev.health.queue", valueKey: "dev.state.warning", tone: "warning" as const },
        { key: "audit", labelKey: "dev.health.audit", valueKey: "dev.state.healthy", tone: "healthy" as const },
      ] satisfies HealthCard[],
      monitoringSignals: [
        {
          titleKey: "dev.monitoring.signalBacklogTitle",
          summaryKey: "dev.monitoring.signalBacklogSummary",
          tone: "degraded" as const,
        },
        {
          titleKey: "dev.monitoring.signalLatencyTitle",
          summaryKey: "dev.monitoring.signalLatencySummary",
          tone: "warning" as const,
        },
        {
          titleKey: "dev.monitoring.signalAuditTitle",
          summaryKey: "dev.monitoring.signalAuditSummary",
          tone: "healthy" as const,
        },
      ] satisfies MonitoringSignal[],
      failedJobs: [
        {
          id: "job-fulfillment-sync",
          typeKey: "dev.jobs.typeFulfillment",
          failureTimeKey: "dev.jobs.failureTimeRecent",
          stateKey: "dev.jobs.stateFailed",
          summaryKey: "dev.jobs.summaryFulfillment",
          detailsKey: "dev.jobs.detailsFulfillment",
        },
        {
          id: "job-payout-close",
          typeKey: "dev.jobs.typePayout",
          failureTimeKey: "dev.jobs.failureTimeEarlier",
          stateKey: "dev.jobs.stateRetryReady",
          summaryKey: "dev.jobs.summaryPayout",
          detailsKey: "dev.jobs.detailsPayout",
        },
      ] satisfies FailedJob[],
      featureFlags: [
        {
          id: "express-rollout",
          nameKey: "dev.flags.expressRollout",
          summaryKey: "dev.flags.expressRolloutSummary",
          scopeKey: "dev.flags.scopeZoneA",
          state: "enabled" as const,
          sensitivity: "standard" as const,
          lastChangedKey: "dev.flags.lastChangedToday",
        },
        {
          id: "auto-dispatch",
          nameKey: "dev.flags.autoDispatch",
          summaryKey: "dev.flags.autoDispatchSummary",
          scopeKey: "dev.flags.scopeMultiZone",
          state: "disabled" as const,
          sensitivity: "high" as const,
          lastChangedKey: "dev.flags.lastChangedYesterday",
        },
      ] satisfies FeatureFlag[],
      overrideTools: [
        {
          id: "rebuild-order-feed",
          nameKey: "dev.override.rebuildFeed",
          summaryKey: "dev.override.rebuildFeedSummary",
          sensitivityKey: "dev.override.sensitivityMedium",
          targetKey: "dev.override.targetOrders",
        },
        {
          id: "release-driver-lock",
          nameKey: "dev.override.releaseDriverLock",
          summaryKey: "dev.override.releaseDriverLockSummary",
          sensitivityKey: "dev.override.sensitivityHigh",
          targetKey: "dev.override.targetDispatch",
        },
      ] satisfies OverrideTool[],
      activity: [
        {
          id: "activity-1",
          actorKey: "dev.activity.actorDevAdmin",
          actionKey: "dev.activity.actionRetry",
          targetKey: "dev.activity.targetFulfillment",
          timeKey: "dev.activity.timeRecent",
          outcomeKey: "dev.activity.outcomeComplete",
          category: "retry" as const,
        },
        {
          id: "activity-2",
          actorKey: "dev.activity.actorDevAdmin",
          actionKey: "dev.activity.actionFlagChange",
          targetKey: "dev.activity.targetAutoDispatch",
          timeKey: "dev.activity.timeEarlier",
          outcomeKey: "dev.activity.outcomeApplied",
          category: "flag" as const,
        },
        {
          id: "activity-3",
          actorKey: "dev.activity.actorDevAdmin",
          actionKey: "dev.activity.actionOverride",
          targetKey: "dev.activity.targetDriverLock",
          timeKey: "dev.activity.timeEarlier",
          outcomeKey: "dev.activity.outcomeFailed",
          category: "override" as const,
        },
      ] satisfies ActivityItem[],
    }),
    [t],
  );
}

export function DevAdminHomeView() {
  const { t } = useI18n();
  const data = useDevAdminData(t);

  return (
    <div className="mimo-stack-xl">
      <PageHeader
        title={t("dev.home.title")}
        subtitle={t("dev.home.subtitle")}
        actions={<DevNav />}
      />

      <div className="mimo-kpi-grid">
        {data.healthCards.map((card) => (
          <article key={card.key} className="mimo-kpi-card">
            <div className="mimo-kpi-card__label">{t(card.labelKey)}</div>
            <div className="mimo-kpi-card__value">{t(card.valueKey)}</div>
            <span className={toneClass(card.tone)}>{t(card.valueKey)}</span>
          </article>
        ))}
      </div>

      <DevSection title={t("dev.monitoring.title")} description={t("dev.monitoring.description")}>
        <div className="mimo-grid mimo-grid--three">
          {data.monitoringSignals.map((signal) => (
            <article key={signal.titleKey} className="mimo-card mimo-stack-sm">
              <div className="mimo-row">
                <strong>{t(signal.titleKey)}</strong>
                <span className={toneClass(signal.tone)}>{t(`dev.tone.${signal.tone}`)}</span>
              </div>
              <p>{t(signal.summaryKey)}</p>
            </article>
          ))}
        </div>
      </DevSection>

      <DevSection title={t("dev.jobs.snapshotTitle")} description={t("dev.jobs.snapshotDescription")}>
        <div className="mimo-table-wrap">
          <table className="mimo-table">
            <thead>
              <tr>
                <th>{t("dev.jobs.type")}</th>
                <th>{t("dev.jobs.failureTime")}</th>
                <th>{t("dev.jobs.state")}</th>
                <th>{t("dev.jobs.context")}</th>
              </tr>
            </thead>
            <tbody>
              {data.failedJobs.map((job) => (
                <tr key={job.id}>
                  <td>{t(job.typeKey)}</td>
                  <td>{t(job.failureTimeKey)}</td>
                  <td>{t(job.stateKey)}</td>
                  <td>{t(job.summaryKey)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DevSection>

      <div className="mimo-grid mimo-grid--two">
        <DevSection title={t("dev.awareness.title")} description={t("dev.awareness.description")}>
          <div className="mimo-stack-sm">
            <div className="mimo-inline-banner mimo-inline-banner--warning">{t("dev.awareness.flags")}</div>
            <div className="mimo-inline-banner mimo-inline-banner--danger">{t("dev.awareness.override")}</div>
          </div>
        </DevSection>

        <DevSection title={t("dev.activity.shortcutTitle")} description={t("dev.activity.shortcutDescription")}>
          <div className="mimo-stack-sm">
            <p>{t("dev.activity.shortcutBody")}</p>
            <Link href="/app/dev/activity" className="mimo-button mimo-button--primary">
              {t("dev.activity.open")}
            </Link>
          </div>
        </DevSection>
      </div>
    </div>
  );
}

export function DevAdminDiagnosticsView() {
  const { t } = useI18n();
  const data = useDevAdminData(t);

  return (
    <div className="mimo-stack-xl">
      <PageHeader
        title={t("dev.diagnostics.title")}
        subtitle={t("dev.diagnostics.subtitle")}
        actions={<DevNav />}
      />

      <DevSection title={t("dev.diagnostics.systemHealthTitle")} description={t("dev.diagnostics.systemHealthDescription")}>
        <div className="mimo-kpi-grid">
          {data.healthCards.map((card) => (
            <article key={card.key} className="mimo-kpi-card">
              <div className="mimo-kpi-card__label">{t(card.labelKey)}</div>
              <div className="mimo-kpi-card__value">{t(card.valueKey)}</div>
              <span className={toneClass(card.tone)}>{t(`dev.tone.${card.tone}`)}</span>
            </article>
          ))}
        </div>
      </DevSection>

      <DevSection title={t("dev.diagnostics.queueTitle")} description={t("dev.diagnostics.queueDescription")}>
        <div className="mimo-grid mimo-grid--two">
          <article className="mimo-card mimo-stack-sm">
            <strong>{t("dev.diagnostics.workerHealthTitle")}</strong>
            <p>{t("dev.diagnostics.workerHealthBody")}</p>
          </article>
          <article className="mimo-card mimo-stack-sm">
            <strong>{t("dev.diagnostics.queueBacklogTitle")}</strong>
            <p>{t("dev.diagnostics.queueBacklogBody")}</p>
          </article>
        </div>
      </DevSection>

      <DevSection title={t("dev.diagnostics.recentFailuresTitle")} description={t("dev.diagnostics.recentFailuresDescription")}>
        <div className="mimo-stack-sm">
          {data.failedJobs.map((job) => (
            <article key={job.id} className="mimo-card mimo-stack-xs">
              <div className="mimo-row">
                <strong>{t(job.typeKey)}</strong>
                <span className="mimo-badge mimo-badge--danger">{t(job.stateKey)}</span>
              </div>
              <p>{t(job.summaryKey)}</p>
              <p className="mimo-muted">{t(job.detailsKey)}</p>
            </article>
          ))}
        </div>
      </DevSection>

      <DevSection title={t("dev.diagnostics.escalationTitle")} description={t("dev.diagnostics.escalationDescription")}>
        <div className="mimo-inline-banner mimo-inline-banner--info">{t("dev.diagnostics.escalationBody")}</div>
      </DevSection>
    </div>
  );
}

export function DevAdminToolsView() {
  const { t } = useI18n();
  const data = useDevAdminData(t);

  const [selectedJobId, setSelectedJobId] = useState(data.failedJobs[0]?.id ?? "");
  const [retryState, setRetryState] = useState<RetryState>("idle");

  const [selectedFlagId, setSelectedFlagId] = useState(data.featureFlags[0]?.id ?? "");
  const [flagChanged, setFlagChanged] = useState(false);

  const [selectedOverrideId, setSelectedOverrideId] = useState(data.overrideTools[0]?.id ?? "");
  const [overrideReason, setOverrideReason] = useState("");
  const [overrideState, setOverrideState] = useState<OverrideState>("idle");

  const selectedJob = data.failedJobs.find((job) => job.id === selectedJobId) ?? data.failedJobs[0];
  const selectedFlag = data.featureFlags.find((flag) => flag.id === selectedFlagId) ?? data.featureFlags[0];
  const selectedOverride = data.overrideTools.find((tool) => tool.id === selectedOverrideId) ?? data.overrideTools[0];

  const handleRetry = () => {
    setRetryState("inProgress");
    window.setTimeout(() => {
      setRetryState(selectedJob.id === "job-payout-close" ? "complete" : "failed");
    }, 600);
  };

  const handleFlagChange = () => {
    setFlagChanged(true);
  };

  const handleOverride = () => {
    if (!overrideReason.trim()) {
      setOverrideState("awaitingReason");
      return;
    }

    setOverrideState("pending");
    window.setTimeout(() => {
      setOverrideState(selectedOverride.id === "release-driver-lock" ? "failed" : "applied");
    }, 700);
  };

  return (
    <div className="mimo-stack-xl">
      <PageHeader
        title={t("dev.tools.title")}
        subtitle={t("dev.tools.subtitle")}
        actions={<DevNav />}
      />

      <DevSection title={t("dev.jobs.title")} description={t("dev.jobs.description")}>
        <div className="mimo-grid mimo-grid--two">
          <div className="mimo-stack-sm">
            {data.failedJobs.map((job) => (
              <button
                key={job.id}
                type="button"
                className="mimo-card mimo-stack-xs mimo-text-left"
                onClick={() => {
                  setSelectedJobId(job.id);
                  setRetryState("idle");
                }}
              >
                <div className="mimo-row">
                  <strong>{t(job.typeKey)}</strong>
                  <span className="mimo-badge mimo-badge--danger">{t(job.stateKey)}</span>
                </div>
                <div>{t(job.failureTimeKey)}</div>
                <div className="mimo-muted">{t(job.summaryKey)}</div>
              </button>
            ))}
          </div>

          <article className="mimo-card mimo-stack-sm">
            <strong>{t("dev.jobs.detailTitle")}</strong>
            <div>{t(selectedJob.typeKey)}</div>
            <div className="mimo-muted">{t(selectedJob.detailsKey)}</div>
            <div className="mimo-inline-banner mimo-inline-banner--warning">{t("dev.jobs.retryAuditReminder")}</div>
            <button type="button" className="mimo-button mimo-button--primary" onClick={handleRetry}>
              {t("dev.jobs.retry")}
            </button>

            {retryState === "inProgress" ? <div className="mimo-badge mimo-badge--info">{t("dev.jobs.retryInProgress")}</div> : null}
            {retryState === "complete" ? <div className="mimo-badge mimo-badge--success">{t("dev.jobs.retryComplete")}</div> : null}
            {retryState === "failed" ? <div className="mimo-badge mimo-badge--danger">{t("dev.jobs.retryFailed")}</div> : null}
          </article>
        </div>
      </DevSection>

      <DevSection title={t("dev.flags.title")} description={t("dev.flags.description")}>
        <div className="mimo-grid mimo-grid--two">
          <div className="mimo-stack-sm">
            {data.featureFlags.map((flag) => (
              <button
                key={flag.id}
                type="button"
                className="mimo-card mimo-stack-xs mimo-text-left"
                onClick={() => {
                  setSelectedFlagId(flag.id);
                  setFlagChanged(false);
                }}
              >
                <div className="mimo-row">
                  <strong>{t(flag.nameKey)}</strong>
                  <span className={flag.sensitivity === "high" ? "mimo-badge mimo-badge--danger" : "mimo-badge mimo-badge--warning"}>
                    {flag.state === "enabled" ? t("dev.flags.enabled") : t("dev.flags.disabled")}
                  </span>
                </div>
                <div>{t(flag.scopeKey)}</div>
                <div className="mimo-muted">{t(flag.summaryKey)}</div>
              </button>
            ))}
          </div>

          <article className="mimo-card mimo-stack-sm">
            <strong>{t("dev.flags.detailTitle")}</strong>
            <div>{t(selectedFlag.nameKey)}</div>
            <div>{t(selectedFlag.summaryKey)}</div>
            <div className="mimo-muted">{t(selectedFlag.scopeKey)}</div>
            <div className="mimo-muted">{t(selectedFlag.lastChangedKey)}</div>
            <button
              type="button"
              className={actionToneClass(selectedFlag.sensitivity === "high" ? "danger" : "standard")}
              onClick={handleFlagChange}
            >
              {t("dev.flags.changeFlag")}
            </button>

            {flagChanged ? <div className="mimo-badge mimo-badge--success">{t("dev.flags.changeComplete")}</div> : null}
          </article>
        </div>
      </DevSection>

      <DevSection title={t("dev.override.title")} description={t("dev.override.description")}>
        <div className="mimo-grid mimo-grid--two">
          <div className="mimo-stack-sm">
            {data.overrideTools.map((tool) => (
              <button
                key={tool.id}
                type="button"
                className="mimo-card mimo-stack-xs mimo-text-left"
                onClick={() => {
                  setSelectedOverrideId(tool.id);
                  setOverrideReason("");
                  setOverrideState("idle");
                }}
              >
                <div className="mimo-row">
                  <strong>{t(tool.nameKey)}</strong>
                  <span className="mimo-badge mimo-badge--danger">{t(tool.sensitivityKey)}</span>
                </div>
                <div>{t(tool.summaryKey)}</div>
                <div className="mimo-muted">{t(tool.targetKey)}</div>
              </button>
            ))}
          </div>

          <article className="mimo-card mimo-stack-sm">
            <strong>{t("dev.override.detailTitle")}</strong>
            <div>{t(selectedOverride.nameKey)}</div>
            <div>{t(selectedOverride.summaryKey)}</div>
            <div className="mimo-inline-banner mimo-inline-banner--danger">{t("dev.override.auditWarning")}</div>

            <label className="mimo-field">
              <span>{t("dev.override.reasonLabel")}</span>
              <textarea
                className="mimo-input"
                value={overrideReason}
                onChange={(event) => setOverrideReason(event.target.value)}
                placeholder={t("dev.override.reasonPlaceholder")}
                rows={4}
              />
            </label>

            <button type="button" className="mimo-button mimo-button--danger" onClick={handleOverride}>
              {t("dev.override.apply")}
            </button>

            {overrideState === "awaitingReason" ? <div className="mimo-badge mimo-badge--warning">{t("dev.override.reasonRequired")}</div> : null}
            {overrideState === "pending" ? <div className="mimo-badge mimo-badge--info">{t("dev.override.pending")}</div> : null}
            {overrideState === "applied" ? <div className="mimo-badge mimo-badge--success">{t("dev.override.applied")}</div> : null}
            {overrideState === "failed" ? <div className="mimo-badge mimo-badge--danger">{t("dev.override.failed")}</div> : null}
          </article>
        </div>
      </DevSection>
    </div>
  );
}

export function DevAdminActivityView() {
  const { t } = useI18n();
  const data = useDevAdminData(t);
  const [filter, setFilter] = useState<"all" | "retry" | "flag" | "override">("all");

  const visibleItems = data.activity.filter((item) => filter === "all" || item.category === filter);

  return (
    <div className="mimo-stack-xl">
      <PageHeader
        title={t("dev.activity.title")}
        subtitle={t("dev.activity.subtitle")}
        actions={<DevNav />}
      />

      <DevSection title={t("dev.activity.filterTitle")} description={t("dev.activity.filterDescription")}>
        <div className="mimo-segmented-control">
          <button type="button" className="mimo-button mimo-button--ghost" onClick={() => setFilter("all")}>
            {t("dev.activity.filterAll")}
          </button>
          <button type="button" className="mimo-button mimo-button--ghost" onClick={() => setFilter("retry")}>
            {t("dev.activity.filterRetry")}
          </button>
          <button type="button" className="mimo-button mimo-button--ghost" onClick={() => setFilter("flag")}>
            {t("dev.activity.filterFlag")}
          </button>
          <button type="button" className="mimo-button mimo-button--ghost" onClick={() => setFilter("override")}>
            {t("dev.activity.filterOverride")}
          </button>
        </div>
      </DevSection>

      <DevSection title={t("dev.activity.logTitle")} description={t("dev.activity.logDescription")}>
        <div className="mimo-table-wrap">
          <table className="mimo-table">
            <thead>
              <tr>
                <th>{t("dev.activity.actor")}</th>
                <th>{t("dev.activity.action")}</th>
                <th>{t("dev.activity.target")}</th>
                <th>{t("dev.activity.time")}</th>
                <th>{t("dev.activity.outcome")}</th>
              </tr>
            </thead>
            <tbody>
              {visibleItems.map((item) => (
                <tr key={item.id}>
                  <td>{t(item.actorKey)}</td>
                  <td>{t(item.actionKey)}</td>
                  <td>{t(item.targetKey)}</td>
                  <td>{t(item.timeKey)}</td>
                  <td>{t(item.outcomeKey)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DevSection>
    </div>
  );
}
