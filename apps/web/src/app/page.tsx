"use client";

import "@/i18n";
import { useEffect, useMemo, useState } from "react";
import { createApiClient } from "@mimo/sdk";
import { useTranslation } from "react-i18next";
import { LanguageToggle } from "@/components/LanguageToggle";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";
const ACCESS_TOKEN_STORAGE_KEY = "mimo-web-access-token";

type LoginResult = {
  user?: {
    id?: string | null;
    fullName?: string | null;
    phone?: string | null;
    role?: string | null;
  };
  tokens?: {
    accessToken?: string | null;
  };
};

export default function HomePage() {
  const { t } = useTranslation();
  const [phone, setPhone] = useState("+255712345678");
  const [password, setPassword] = useState("secret123");
  const [submitting, setSubmitting] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [apiConnected, setApiConnected] = useState<boolean | null>(null);
  const [message, setMessage] = useState("");
  const [loggedInUser, setLoggedInUser] = useState<LoginResult["user"] | null>(null);

  const isLoggedIn = useMemo(() => !!accessToken, [accessToken]);

  async function loadHealth() {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/health`);
      const payload = await response.json();
      setApiConnected(response.ok && payload.status === "ok");
    } catch {
      setApiConnected(false);
    }
  }

  useEffect(() => {
    const storedToken = window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
    if (storedToken) {
      setAccessToken(storedToken);
      setMessage(t("home.tokenStored"));
    }
    void loadHealth();
  }, [t]);

  async function handleLogin() {
    try {
      setSubmitting(true);
      setMessage("");

      const client = await createApiClient({ baseUrl: API_BASE_URL });
      const result = await client.POST("/v1/auth/login", {
        body: {
          phone,
          password,
        },
      });

      const data = result.data as { data?: LoginResult } | undefined;
      const token = data?.data?.tokens?.accessToken ?? null;
      const user = data?.data?.user ?? null;

      if (!result.response.ok || !token) {
        setMessage(t("auth.login.error"));
        return;
      }

      window.localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token);
      setAccessToken(token);
      setLoggedInUser(user);
      setMessage(t("auth.login.success"));
      await loadHealth();
    } catch {
      setMessage(t("auth.login.error"));
    } finally {
      setSubmitting(false);
    }
  }

  function handleLogout() {
    window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
    setAccessToken(null);
    setLoggedInUser(null);
    setMessage("");
  }

  return (
    <main className="min-h-screen bg-neutral-50 p-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{t("auth.welcome")}</h1>
            <p className="mt-2 text-base text-neutral-600">{t("auth.login.subtitle")}</p>
          </div>
          <LanguageToggle />
        </div>

        {!isLoggedIn ? (
          <section className="rounded-2xl border bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-2xl font-semibold">{t("auth.login.title")}</h2>

            <div className="space-y-2">
              <label className="block text-sm font-medium">{t("auth.login.phone")}</label>
              <input
                className="w-full rounded-xl border px-4 py-3"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder={t("auth.login.phonePlaceholder")}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">{t("auth.login.password")}</label>
              <input
                type="password"
                className="w-full rounded-xl border px-4 py-3"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder={t("auth.login.passwordPlaceholder")}
              />
            </div>

            <button
              className="rounded-xl border px-4 py-3 font-medium"
              onClick={() => void handleLogin()}
              disabled={submitting}
            >
              {submitting ? t("common.loading") : t("auth.login.submit")}
            </button>

            {message ? <p className="text-sm text-neutral-700">{message}</p> : null}
          </section>
        ) : (
          <section className="rounded-2xl border bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-2xl font-semibold">{t("home.dashboardTitle")}</h2>
            <p>
              {t("home.loggedInAs")}: {loggedInUser?.fullName ?? "-"} ({loggedInUser?.role ?? "-"})
            </p>
            <p>
              {t("home.apiStatusLabel")}:{" "}
              {apiConnected ? t("home.apiConnected") : t("home.apiDisconnected")}
            </p>
            <p>{t("home.tokenStored")}</p>
            <p>
              {t("home.apiBaseUrl")}: {API_BASE_URL}
            </p>

            <button className="rounded-xl border px-4 py-3 font-medium" onClick={handleLogout}>
              {t("home.logout")}
            </button>
          </section>
        )}
      </div>
    </main>
  );
}
