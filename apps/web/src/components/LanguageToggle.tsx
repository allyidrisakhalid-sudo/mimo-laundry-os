"use client";

import "@/i18n";
import { useTranslation } from "react-i18next";

export function LanguageToggle() {
  const { i18n, t } = useTranslation();

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm">{t("common.language")}:</span>
      <button
        type="button"
        className="rounded border px-3 py-1 text-sm"
        onClick={() => void i18n.changeLanguage("en")}
      >
        {t("common.english")}
      </button>
      <button
        type="button"
        className="rounded border px-3 py-1 text-sm"
        onClick={() => void i18n.changeLanguage("sw")}
      >
        {t("common.swahili")}
      </button>
    </div>
  );
}
