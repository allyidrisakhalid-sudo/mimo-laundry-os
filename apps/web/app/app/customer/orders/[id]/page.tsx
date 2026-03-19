"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, StatusBadge } from "@mimo/ui";
import { ContextHelpBlock, useOnboardingMessages } from "../../../_components/p2Onboarding";
import { useTranslation } from "react-i18next";

const timeline = [
  "Order created",
  "Picked up",
  "In washing",
  "Quality check pending",
];

export default function CustomerOrderDetailPage() {
  const { locale, t } = useOnboardingMessages();
  const { t: i18nT } = useTranslation();

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
            <section className="grid gap-4 rounded-3xl border border-[var(--mimo-color-border)] bg-[var(--mimo-color-surface)] p-5 shadow-sm">
          <div className="grid gap-1">
            <h2 className="text-lg font-semibold text-[var(--mimo-color-foreground)]">{i18nT("support.issue.title")}</h2>
            <p className="text-sm text-[var(--mimo-color-text-muted)]">{i18nT("support.issue.subtitle")}</p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <label className="grid gap-2 text-sm">
              <span className="font-medium text-[var(--mimo-color-foreground)]">{i18nT("support.issue.typeLabel")}</span>
              <select
                className="rounded-2xl border border-[var(--mimo-color-border)] bg-transparent px-3 py-2 text-sm"
                defaultValue="delay"
              >
                <option value="damage">{i18nT("support.issue.type.damage")}</option>
                <option value="missingItem">{i18nT("support.issue.type.missingItem")}</option>
                <option value="delay">{i18nT("support.issue.type.delay")}</option>
                <option value="refundRequest">{i18nT("support.issue.type.refundRequest")}</option>
              </select>
            </label>

            <label className="grid gap-2 text-sm">
              <span className="font-medium text-[var(--mimo-color-foreground)]">{i18nT("support.issue.description")}</span>
              <textarea
                className="min-h-24 rounded-2xl border border-[var(--mimo-color-border)] bg-transparent px-3 py-2 text-sm"
                defaultValue=""
                placeholder={i18nT("support.issue.descriptionPlaceholder")}
              />
            </label>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="rounded-2xl bg-[var(--mimo-color-foreground)] px-4 py-2 text-sm font-medium text-[var(--mimo-color-background)]"
            >
              {i18nT("support.issue.submit")}
            </button>
            <button
              type="button"
              className="rounded-2xl border border-[var(--mimo-color-border)] px-4 py-2 text-sm font-medium"
            >
              {i18nT("support.help.contact")}
            </button>
          </div>

          <div className="grid gap-3 rounded-2xl border border-[var(--mimo-color-border)] bg-[var(--mimo-color-background)] p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="grid gap-1">
                <div className="text-sm font-medium text-[var(--mimo-color-foreground)]">{i18nT("support.issue.submitted")}</div>
                <div className="text-sm text-[var(--mimo-color-text-muted)]">{i18nT("support.state.issueNeedsReview")}</div>
              </div>
              <span className="rounded-full bg-[var(--mimo-color-accent-subtle)] px-3 py-1 text-xs font-medium">
                {i18nT("support.status.underReview.title")}
              </span>
            </div>

            <div className="grid gap-1 text-sm text-[var(--mimo-color-text-muted)]">
              <div>{i18nT("support.issue.type.delay")}</div>
              <div>{i18nT("support.status.underReview.body")}</div>
              <div>{i18nT("support.refund.nextStep")}</div>
            </div>

            <div className="flex flex-wrap gap-2 text-sm">
              <span className="rounded-full border border-[var(--mimo-color-border)] px-3 py-1">{i18nT("support.refund.requested")}</span>
              <span className="rounded-full border border-[var(--mimo-color-border)] px-3 py-1">{i18nT("support.refund.underReview")}</span>
              <span className="rounded-full border border-[var(--mimo-color-border)] px-3 py-1">{i18nT("support.credit.issued")}</span>
            </div>
          </div>
        </section>
      </main>
    );
}



