"use client";

import "@/i18n";
import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { login } from "@/lib/api";
import { getPortalRouteForRole } from "@/lib/auth";
import { getRole, hasSession, saveSession } from "@/lib/session";
import { LanguageToggle } from "@/components/LanguageToggle";

export function LoginScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!hasSession()) return;
    router.replace(getPortalRouteForRole(getRole()));
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      const result = await login(phone, password);
      saveSession(result.data.tokens.accessToken, result.data.user.role, result.data.user.phone);
      setStatus(t("auth.login.success"));
      router.replace(getPortalRouteForRole(result.data.user.role));
    } catch (error) {
      setStatus(error instanceof Error ? error.message : t("auth.login.error"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-16 text-neutral-50">
      <div className="mx-auto max-w-md space-y-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-neutral-400">Mimo Laundry OS</p>
            <h1 className="mt-3 text-4xl font-semibold">{t("auth.login.title")}</h1>
            <p className="mt-3 text-neutral-300">{t("auth.login.subtitle")}</p>
          </div>
          <LanguageToggle />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
          <label className="block space-y-2">
            <span className="text-sm text-neutral-300">{t("auth.login.phone")}</span>
            <input
              className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2"
              placeholder={t("auth.login.phonePlaceholder")}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="tel"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm text-neutral-300">{t("auth.login.password")}</span>
            <input
              type="password"
              className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2"
              placeholder={t("auth.login.passwordPlaceholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-white px-4 py-2 font-medium text-black disabled:opacity-50"
          >
            {loading ? t("auth.login.submitting") : t("auth.login.submit")}
          </button>

          <p className="text-sm text-amber-300">{status}</p>
        </form>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6 text-sm text-neutral-300">
          <p>{t("auth.signup.customerOnlyNote")}</p>
          <Link href="/signup" className="mt-3 inline-flex text-white underline underline-offset-4">
            {t("auth.signup.linkCta")}
          </Link>
        </div>
      </div>
    </main>
  );
}
