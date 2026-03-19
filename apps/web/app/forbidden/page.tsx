"use client";

import "@/i18n";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getPortalRouteFromSession, getRole } from "@/lib/session";
import { normalizeRole } from "@/lib/auth";

export default function ForbiddenPage() {
  const { t } = useTranslation();
  const [portalRoute, setPortalRoute] = useState<string | null>(null);

  useEffect(() => {
    const role = normalizeRole(getRole());

    if (role) {
      setPortalRoute(getPortalRouteFromSession());
    } else {
      setPortalRoute(null);
    }
  }, []);

  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-16 text-neutral-50">
      <div className="mx-auto max-w-2xl space-y-6 rounded-2xl border border-red-900/60 bg-neutral-900 p-8">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.2em] text-red-300">403</p>
          <h1 className="text-4xl font-semibold">{t("auth.forbidden.title")}</h1>
          <p className="text-neutral-300">{t("auth.forbidden.subtitle")}</p>
          <p className="text-neutral-400">{t("auth.forbidden.body")}</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href="/login" className="rounded-xl border border-neutral-700 px-4 py-2">
            {t("auth.forbidden.goToLogin")}
          </Link>

          {portalRoute ? (
            <Link href={portalRoute} className="rounded-xl bg-white px-4 py-2 text-black">
              {t("auth.forbidden.goToPortal")}
            </Link>
          ) : null}
        </div>
      </div>
    </main>
  );
}
