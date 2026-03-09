"use client";

import "@/i18n";
import { useTranslation } from "react-i18next";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  ToastProvider,
  useToast,
} from "@mimo/ui";
import { formatDateTime, formatMoneyTzs, formatPhoneTz } from "@mimo/types";
import { LanguageToggle } from "@/components/LanguageToggle";

function GalleryInner() {
  const { t, i18n } = useTranslation();
  const { showError, showInfo, showSuccess } = useToast();
  const locale = i18n.language === "sw" ? "sw" : "en";
  const demoDate = new Date("2026-01-29T14:30:00");

  return (
    <main className="p-8 space-y-8">
      <LanguageToggle />

      <div>
        <h1 className="text-4xl font-bold">{t("componentsPage.title")}</h1>
        <p className="mt-3">{t("componentsPage.subtitle")}</p>
      </div>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">{t("componentsPage.buttons")}</h2>
        <div className="flex flex-wrap gap-3">
          <Button size="sm">Primary SM</Button>
          <Button size="md">Primary MD</Button>
          <Button size="lg">Primary LG</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button disabled>Disabled</Button>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() =>
              showSuccess(
                t("componentsPage.toastSuccessTitle"),
                t("componentsPage.toastSuccessDescription")
              )
            }
          >
            {t("componentsPage.showSuccess")}
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              showInfo(t("componentsPage.toastInfoTitle"), t("componentsPage.toastInfoDescription"))
            }
          >
            {t("componentsPage.showInfo")}
          </Button>
          <Button
            variant="danger"
            onClick={() =>
              showError(
                t("componentsPage.toastErrorTitle"),
                t("componentsPage.toastErrorDescription")
              )
            }
          >
            {t("componentsPage.showError")}
          </Button>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">{t("componentsPage.inputs")}</h2>
        <div className="space-y-3 max-w-md">
          <label className="block">
            <span>{t("componentsPage.customerName")}</span>
            <Input placeholder={t("componentsPage.enterFullName")} />
          </label>
          <p>{t("componentsPage.requiredForOrderCreation")}</p>
          <label className="block">
            <span>{t("componentsPage.phoneNumber")}</span>
            <Input placeholder="+255 7XX XXX XXX" />
          </label>
          <p>{t("componentsPage.tzFormatLater")}</p>
          <label className="block">
            <span>{t("componentsPage.password")}</span>
            <Input type="password" placeholder={t("componentsPage.enterPassword")} />
          </label>
          <label className="block">
            <span>{t("componentsPage.errorExample")}</span>
            <Input placeholder={t("componentsPage.invalidValue")} />
          </label>
          <p>{t("componentsPage.fieldRequired")}</p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">{t("componentsPage.cards")}</h2>
        <Card>
          <CardHeader>
            <CardTitle>{t("componentsPage.defaultCard")}</CardTitle>
            <CardDescription>{t("componentsPage.standardSurface")}</CardDescription>
          </CardHeader>
          <CardContent>{t("componentsPage.useForDashboards")}</CardContent>
        </Card>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">{t("componentsPage.formatting")}</h2>
        <div className="space-y-2">
          <p>
            {t("componentsPage.moneyExample")}: {formatMoneyTzs(45000, locale)}
          </p>
          <p>
            {t("componentsPage.dateExample")}: {formatDateTime(demoDate, locale)}
          </p>
          <p>
            {t("componentsPage.phoneExample")}: {formatPhoneTz("0712345678")}
          </p>
        </div>
        <div className="flex gap-2">
          <Badge>EN/SW</Badge>
          <Badge>{t("componentsPage.languageToggle")}</Badge>
        </div>
      </section>
    </main>
  );
}

export default function ComponentsPage() {
  return (
    <ToastProvider>
      <GalleryInner />
    </ToastProvider>
  );
}
