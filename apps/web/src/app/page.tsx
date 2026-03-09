"use client";

import "@/i18n";
import { useTranslation } from "react-i18next";
import { LanguageToggle } from "@/components/LanguageToggle";

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <main className="p-8 space-y-6">
      <LanguageToggle />
      <div>
        <h1 className="text-3xl font-bold">{t("home.title")}</h1>
        <p className="mt-2 text-base">{t("home.subtitle")}</p>
      </div>
      <div>
        <h2 className="text-xl font-semibold">{t("auth.login.title")}</h2>
        <p>{t("auth.login.subtitle")}</p>
      </div>
    </main>
  );
}
