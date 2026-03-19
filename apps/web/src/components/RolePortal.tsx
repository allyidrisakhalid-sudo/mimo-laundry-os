"use client";

import "@/i18n";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { API_BASE_URL, apiFetch, login } from "@/lib/api";
import { getPortalRouteForRole, isRoleAllowedForExpected } from "@/lib/auth";
import { clearSession, getAccessToken, getPhone, getRole, hasSession, saveSession } from "@/lib/session";
import { LanguageToggle } from "@/components/LanguageToggle";

type RolePortalProps = {
  title: string;
  expectedRole?: string;
  loginPhone?: string;
  loginPassword?: string;
  loginEnabled?: boolean;
  dataPath?: string;
  description: string;
};

export function RolePortal({
  title,
  expectedRole,
  loginPhone = "",
  loginPassword = "Pass123!",
  loginEnabled = true,
  dataPath,
  description,
}: RolePortalProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation();

  const [phone, setPhone] = useState(loginPhone);
  const [password, setPassword] = useState(loginPassword);
  const [status, setStatus] = useState<string>("");
  const [payload, setPayload] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [currentRole, setCurrentRole] = useState<string | null>(null);
  const [currentPhone, setCurrentPhone] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  function refreshSessionView() {
    if (typeof window === "undefined") return;
    setCurrentRole(getRole());
    setCurrentPhone(getPhone());
  }

  useEffect(() => {
    setMounted(true);
    refreshSessionView();
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (!hasSession()) {
      router.replace("/login");
      return;
    }

    if (!isRoleAllowedForExpected(getRole(), expectedRole)) {
      router.replace("/forbidden");
    }
  }, [mounted, expectedRole, pathname, router]);

  async function handleLogin() {
    setLoading(true);
    setStatus("");

    try {
      const result = await login(phone, password);
      saveSession(result.data.tokens.accessToken, result.data.user.role, result.data.user.phone);
      refreshSessionView();
      setStatus(t("auth.login.success"));
      router.replace(getPortalRouteForRole(result.data.user.role));
    } catch (error) {
      setStatus(error instanceof Error ? error.message : t("auth.login.error"));
    } finally {
      setLoading(false);
    }
  }

  async function handleLoadData() {
    if (typeof window === "undefined") {
      setStatus(t("auth.session.notAvailable"));
      return;
    }

    const token = getAccessToken();

    if (!token || !dataPath) {
      setStatus(t("auth.session.missingTokenOrPath"));
      return;
    }

    setLoading(true);
    setStatus("");

    try {
      const result = await apiFetch<unknown>(dataPath, { token });
      setPayload(JSON.stringify(result, null, 2));
      setStatus(t("auth.session.dataLoadOk"));
    } catch (error) {
      const message = error instanceof Error ? error.message : t("auth.session.dataLoadFailed");

      setPayload("");
      setStatus(message);

      if (message.includes("401")) {
        clearSession();
        router.replace("/login");
      }
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    clearSession();
    refreshSessionView();
    setPayload("");
    setStatus(t("auth.session.loggedOut"));
    router.replace("/login");
  }

  if (mounted && (!hasSession() || !isRoleAllowedForExpected(currentRole, expectedRole))) {
    return null;
  }

  return (
    <main className="min-h-screen bg-neutral-950 p-6 text-neutral-50">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-neutral-400">Mimo Laundry OS</p>
            <h1 className="text-3xl font-semibold">{title}</h1>
            <p className="mt-2 text-neutral-300">{description}</p>
          </div>
          <LanguageToggle />
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
          <p>
            <strong>{t("auth.session.productionApi")}:</strong> {API_BASE_URL}
          </p>
          <p>
            <strong>{t("auth.session.currentPhone")}:</strong> {mounted ? (currentPhone ?? t("auth.session.none")) : t("common.loading")}
          </p>
          <p>
            <strong>{t("auth.session.currentRole")}:</strong> {mounted ? (currentRole ?? t("auth.session.none")) : t("common.loading")}
          </p>
          {expectedRole ? (
            <p>
              <strong>{t("auth.session.expectedRole")}:</strong> {expectedRole}
            </p>
          ) : null}
        </div>

        {loginEnabled ? (
          <div className="space-y-4 rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
            <h2 className="text-xl font-medium">{t("auth.login.title")}</h2>

            <div className="grid gap-3 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm text-neutral-300">{t("auth.login.phone")}</span>
                <input
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm text-neutral-300">{t("auth.login.password")}</span>
                <input
                  type="password"
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleLogin}
                disabled={loading}
                className="rounded-xl bg-white px-4 py-2 text-black disabled:opacity-50"
              >
                {loading ? t("auth.login.submitting") : t("auth.login.submit")}
              </button>

              <button
                onClick={handleLogout}
                className="rounded-xl border border-neutral-700 px-4 py-2"
              >
                {t("auth.actions.logout")}
              </button>

              {dataPath ? (
                <button
                  onClick={handleLoadData}
                  disabled={loading}
                  className="rounded-xl border border-neutral-700 px-4 py-2"
                >
                  {t("auth.actions.loadLiveData")}
                </button>
              ) : null}
            </div>

            <p className="text-sm text-amber-300">{status}</p>
          </div>
        ) : null}

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
          <h2 className="mb-3 text-xl font-medium">{t("auth.actions.liveDataPayload")}</h2>
          <pre className="overflow-auto whitespace-pre-wrap text-sm text-neutral-200">
            {payload || t("auth.actions.noDataLoaded")}
          </pre>
        </div>
      </div>
    </main>
  );
}

