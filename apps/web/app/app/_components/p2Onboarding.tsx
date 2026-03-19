"use client";

import "@/i18n";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, StatusBadge } from "@mimo/ui";

export type Locale = "en" | "sw";
export type OperatorRole = "driver" | "hub" | "affiliate_staff" | "affiliate_admin";

const SUPPORT_WHATSAPP_URL = "https://wa.me/255788558975";

const STORAGE_KEYS = {
  customerDone: "mimo-onboarding-customer-done",
  locale: "i18nextLng",
  roleDonePrefix: "mimo-onboarding-role-done",
} as const;

function useResolvedLocale(): Locale {
  const { i18n } = useTranslation();
  return i18n.language === "sw" ? "sw" : "en";
}

export function useOnboardingMessages() {
  const { t, i18n } = useTranslation();
  const locale: Locale = i18n.language === "sw" ? "sw" : "en";

  const setLocale = (next: Locale) => {
    void i18n.changeLanguage(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEYS.locale, next);
    }
  };

  const dictionary = useMemo(
    () => ({
      common: {
        loading: t("onboarding.common.loading"),
        continue: t("onboarding.common.continue"),
        finish: t("onboarding.common.finish"),
        notNow: t("onboarding.common.notNow"),
        done: t("onboarding.common.done"),
        incomplete: t("onboarding.common.incomplete"),
        language: t("onboarding.common.language"),
        help: t("onboarding.common.help"),
        whatsapp: t("onboarding.common.whatsapp"),
        openHelp: t("onboarding.common.openHelp"),
      },
      help: {
        label: t("onboarding.help.label"),
        profileHelp: t("onboarding.help.profileHelp"),
        dashboardHelp: t("onboarding.help.dashboardHelp"),
        publicTitle: t("onboarding.help.publicTitle"),
        publicBody: t("onboarding.help.publicBody"),
        orderTitle: t("onboarding.help.orderTitle"),
        orderBody: t("onboarding.help.orderBody"),
        taskTitle: t("onboarding.help.taskTitle"),
        taskBody: t("onboarding.help.taskBody"),
        financeTitle: t("onboarding.help.financeTitle"),
        financeBody: t("onboarding.help.financeBody"),
        generalTitle: t("onboarding.help.generalTitle"),
        generalBody: t("onboarding.help.generalBody"),
        adminDevBody: t("onboarding.help.adminDevBody"),
      },
      customer: {
        firstRunTitle: t("onboarding.customer.firstRunTitle"),
        firstRunBody: t("onboarding.customer.firstRunBody"),
        stepOneTitle: t("onboarding.customer.stepOneTitle"),
        stepOneBody: t("onboarding.customer.stepOneBody"),
        stepTwoTitle: t("onboarding.customer.stepTwoTitle"),
        stepTwoBody: t("onboarding.customer.stepTwoBody"),
        nameLabel: t("onboarding.customer.nameLabel"),
        phoneLabel: t("onboarding.customer.phoneLabel"),
        startButton: t("onboarding.customer.startButton"),
        completeButton: t("onboarding.customer.completeButton"),
        skipButton: t("onboarding.customer.skipButton"),
        homeTitle: t("onboarding.customer.homeTitle"),
        homeBody: t("onboarding.customer.homeBody"),
        ordersTitle: t("onboarding.customer.ordersTitle"),
        ordersBody: t("onboarding.customer.ordersBody"),
        profileTitle: t("onboarding.customer.profileTitle"),
        orderDetailTitle: t("onboarding.customer.orderDetailTitle"),
      },
      driver: {
        homeTitle: t("onboarding.driver.homeTitle"),
        homeBody: t("onboarding.driver.homeBody"),
        taskDetailTitle: t("onboarding.driver.taskDetailTitle"),
        setupTitle: t("onboarding.driver.setupTitle"),
        setupBody: t("onboarding.driver.setupBody"),
        checklist: t("onboarding.driver.checklist", { returnObjects: true }) as string[],
        cta: t("onboarding.driver.cta"),
      },
      hub: {
        dashboardTitle: t("onboarding.hub.dashboardTitle"),
        dashboardBody: t("onboarding.hub.dashboardBody"),
        issueTitle: t("onboarding.hub.issueTitle"),
        setupTitle: t("onboarding.hub.setupTitle"),
        setupBody: t("onboarding.hub.setupBody"),
        checklist: t("onboarding.hub.checklist", { returnObjects: true }) as string[],
        cta: t("onboarding.hub.cta"),
      },
      affiliate: {
        dashboardTitle: t("onboarding.affiliate.dashboardTitle"),
        dashboardBody: t("onboarding.affiliate.dashboardBody"),
        orderDetailTitle: t("onboarding.affiliate.orderDetailTitle"),
        financeTitle: t("onboarding.affiliate.financeTitle"),
        staffSetupTitle: t("onboarding.affiliate.staffSetupTitle"),
        staffSetupBody: t("onboarding.affiliate.staffSetupBody"),
        adminSetupTitle: t("onboarding.affiliate.adminSetupTitle"),
        adminSetupBody: t("onboarding.affiliate.adminSetupBody"),
        staffChecklist: t("onboarding.affiliate.staffChecklist", { returnObjects: true }) as string[],
        adminChecklist: t("onboarding.affiliate.adminChecklist", { returnObjects: true }) as string[],
        cta: t("onboarding.affiliate.cta"),
      },
      adminDev: {
        title: t("onboarding.adminDev.title"),
      },
      customerPortal: {
        home: {
          title: t("customerPortal.home.title"),
          subtitle: t("customerPortal.home.subtitle"),
          activeOrderLabel: t("customerPortal.home.activeOrderLabel"),
          primaryCta: t("customerPortal.home.primaryCta"),
          secondaryCta: t("customerPortal.home.secondaryCta"),
          recentOrdersTitle: t("customerPortal.home.recentOrdersTitle"),
          recentOrdersBody: t("customerPortal.home.recentOrdersBody"),
          helpTitle: t("customerPortal.home.helpTitle"),
        },
        orders: {
          title: t("customerPortal.orders.title"),
          subtitle: t("customerPortal.orders.subtitle"),
        },
        detail: {
          title: t("customerPortal.detail.title"),
          subtitle: t("customerPortal.detail.subtitle"),
          summaryLabel: t("customerPortal.detail.summaryLabel"),
          timelineLabel: t("customerPortal.detail.timelineLabel"),
          paymentLabel: t("customerPortal.detail.paymentLabel"),
          paymentState: t("customerPortal.detail.paymentState"),
          helpTitle: t("customerPortal.detail.helpTitle"),
        },
        profile: {
          title: t("customerPortal.profile.title"),
          subtitle: t("customerPortal.profile.subtitle"),
          accountLabel: t("customerPortal.profile.accountLabel"),
          addressesLabel: t("customerPortal.profile.addressesLabel"),
          languageLabel: t("customerPortal.profile.languageLabel"),
          receiptsLabel: t("customerPortal.profile.receiptsLabel"),
        },
      },
    }),
    [t],
  );

  return { locale, setLocale, t: dictionary };
}

export function getAffiliateRoleFromUrl(): OperatorRole {
  if (typeof window === "undefined") {
    return "affiliate_staff";
  }

  const params = new URLSearchParams(window.location.search);
  return params.get("role") === "affiliate_admin" ? "affiliate_admin" : "affiliate_staff";
}

export function PortalHelpEntry(props: { locale: Locale; label?: string; href?: string }) {
  const { t } = useOnboardingMessages();
  const label = props.label ?? t.help.label;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <StatusBadge label={label} tone="info" />
      <Link href={props.href ?? "/help"} className="text-sm underline underline-offset-2">
        {t.common.openHelp}
      </Link>
      <a href={SUPPORT_WHATSAPP_URL} target="_blank" rel="noreferrer" className="text-sm underline underline-offset-2">
        {t.common.whatsapp}
      </a>
    </div>
  );
}

export function ContextHelpBlock(props: {
  locale: Locale;
  title: string;
  kind: "general" | "order" | "task" | "finance";
}) {
  const { t } = useOnboardingMessages();

  const content = {
    general: { title: t.help.generalTitle, body: t.help.generalBody },
    order: { title: t.help.orderTitle, body: t.help.orderBody },
    task: { title: t.help.taskTitle, body: t.help.taskBody },
    finance: { title: t.help.financeTitle, body: t.help.financeBody },
  }[props.kind];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{props.title}</CardTitle>
        <CardDescription>{content.title}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        <p className="text-sm text-[var(--mimo-color-text-muted)]">{content.body}</p>
        <PortalHelpEntry locale={props.locale} />
      </CardContent>
    </Card>
  );
}

export function useCustomerOnboardingGate() {
  const [ready, setReady] = useState(false);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    const done = typeof window !== "undefined" && window.localStorage.getItem(STORAGE_KEYS.customerDone) === "1";
    setNeedsOnboarding(!done);
    setReady(true);
  }, []);

  const markDone = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEYS.customerDone, "1");
    }
    setNeedsOnboarding(false);
  };

  return { ready, needsOnboarding, markDone };
}

export function CustomerFirstRun(props: { onDone: () => void }) {
  const { locale, setLocale, t } = useOnboardingMessages();
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const complete = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEYS.customerDone, "1");
    }
    props.onDone();
  };

  return (
    <main className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>{t.customer.firstRunTitle}</CardTitle>
          <CardDescription>{t.customer.firstRunBody}</CardDescription>
        </CardHeader>
      </Card>

            {step === 1 ? (
        <Card>
          <CardHeader>
            <CardTitle>{t.customer.stepOneTitle}</CardTitle>
            <CardDescription>{t.customer.stepOneBody}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge label={t.common.language} tone="neutral" />
              <StatusBadge label={locale.toUpperCase()} tone="success" />
            </div>

            <div className="flex flex-wrap gap-3">
              <Button variant={locale === "en" ? "primary" : "secondary"} onClick={() => setLocale("en")}>
                EN
              </Button>
              <Button variant={locale === "sw" ? "primary" : "secondary"} onClick={() => setLocale("sw")}>
                SW
              </Button>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button onClick={() => setStep(2)}>{t.customer.startButton}</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{t.customer.stepTwoTitle}</CardTitle>
            <CardDescription>{t.customer.stepTwoBody}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Input
              label={t.customer.nameLabel}
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={t.customer.nameLabel}
            />
            <Input
              label={t.customer.phoneLabel}
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="+255 7XX XXX XXX"
              inputType="phone"
            />

            <div className="flex flex-wrap gap-3">
              <Button onClick={complete}>{t.customer.completeButton}</Button>
              <Button variant="secondary" onClick={complete}>
                {t.customer.skipButton}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </main>
  );
}

export function OperatorSetupCard(props: { role: OperatorRole }) {
  const { locale, t } = useOnboardingMessages();
  const roleKey = `${STORAGE_KEYS.roleDonePrefix}-${props.role}`;
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setDone(window.localStorage.getItem(roleKey) === "1");
    }
  }, [roleKey, locale]);

  const complete = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(roleKey, "1");
    }
    setDone(true);
  };

  const content =
    props.role === "driver"
      ? {
          title: t.driver.setupTitle,
          body: t.driver.setupBody,
          checklist: t.driver.checklist,
          cta: t.driver.cta,
        }
      : props.role === "hub"
        ? {
            title: t.hub.setupTitle,
            body: t.hub.setupBody,
            checklist: t.hub.checklist,
            cta: t.hub.cta,
          }
        : props.role === "affiliate_admin"
          ? {
              title: t.affiliate.adminSetupTitle,
              body: t.affiliate.adminSetupBody,
              checklist: t.affiliate.adminChecklist,
              cta: t.affiliate.cta,
            }
          : {
              title: t.affiliate.staffSetupTitle,
              body: t.affiliate.staffSetupBody,
              checklist: t.affiliate.staffChecklist,
              cta: t.affiliate.cta,
            };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{content.title}</CardTitle>
        <CardDescription>{content.body}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge label={done ? t.common.done : t.common.incomplete} tone={done ? "success" : "warning"} />
          <PortalHelpEntry locale={locale} />
        </div>

        <ul className="list-disc pl-5 text-sm text-[var(--mimo-color-text-muted)]">
          {content.checklist.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        {!done ? <Button onClick={complete}>{content.cta}</Button> : null}
      </CardContent>
    </Card>
  );
}






