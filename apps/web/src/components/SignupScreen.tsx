"use client";

import "@/i18n";
import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { API_BASE_URL } from "@/lib/api";
import { getPortalRouteForRole } from "@/lib/auth";
import { getRole, hasSession, saveSession } from "@/lib/session";
import { LanguageToggle } from "@/components/LanguageToggle";

type SignupResponse = {
  data?: {
    tokens?: {
      accessToken?: string;
    };
    user?: {
      role?: string;
      phone?: string;
    };
  };
  message?: string;
};

export function SignupScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  const [fullName, setFullName] = useState("");
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
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          phone,
          password,
          role: "CUSTOMER",
        }),
      });

      const result = (await response.json()) as SignupResponse;

      if (!response.ok) {
        throw new Error(result.message || t("auth.signup.error"));
      }

      const accessToken = result.data?.tokens?.accessToken;
      const role = result.data?.user?.role;
      const signedUpPhone = result.data?.user?.phone ?? phone;

      if (accessToken && role) {
        saveSession(accessToken, role, signedUpPhone);
        router.replace(getPortalRouteForRole(role));
        return;
      }

      setStatus(t("auth.signup.success"));
      router.replace("/login");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : t("auth.signup.error"));
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
            <h1 className="mt-3 text-4xl font-semibold">{t("auth.signup.title")}</h1>
            <p className="mt-3 text-neutral-300">{t("auth.signup.subtitle")}</p>
          </div>
          <LanguageToggle />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
          <label className="block space-y-2">
            <span className="text-sm text-neutral-300">{t("auth.signup.fullName")}</span>
            <input
              className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2"
              placeholder={t("auth.signup.fullNamePlaceholder")}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              autoComplete="name"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm text-neutral-300">{t("auth.signup.phone")}</span>
            <input
              className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2"
              placeholder={t("auth.signup.phonePlaceholder")}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="tel"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm text-neutral-300">{t("auth.signup.password")}</span>
            <input
              type="password"
              className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2"
              placeholder={t("auth.signup.passwordPlaceholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-white px-4 py-2 font-medium text-black disabled:opacity-50"
          >
            {loading ? t("auth.signup.submitting") : t("auth.signup.submit")}
          </button>

          <p className="text-sm text-amber-300">{status}</p>
        </form>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6 text-sm text-neutral-300">
          <p>{t("auth.signup.customerOnlyNote")}</p>
          <Link href="/login" className="mt-3 inline-flex text-white underline underline-offset-4">
            {t("auth.signup.loginCta")}
          </Link>
        </div>
      </div>
    </main>
  );
}
