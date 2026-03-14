"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL, apiFetch, login } from "@/lib/api";
import { clearSession, getAccessToken, getPhone, getRole, saveSession } from "@/lib/session";
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

  async function handleLogin() {
    setLoading(true);
    setStatus("");
    try {
      const result = await login(phone, password);
      saveSession(result.data.tokens.accessToken, result.data.user.role, result.data.user.phone);
      refreshSessionView();
      setStatus(`Login ok for role ${result.data.user.role}`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleLoadData() {
    if (typeof window === "undefined") {
      setStatus("Browser session not available");
      return;
    }

    const token = getAccessToken();
    if (!token || !dataPath) {
      setStatus("Missing token or data path");
      return;
    }

    setLoading(true);
    setStatus("");
    try {
      const result = await apiFetch<unknown>(dataPath, { token });
      setPayload(JSON.stringify(result, null, 2));
      setStatus("Data load ok");
    } catch (error) {
      setPayload("");
      setStatus(error instanceof Error ? error.message : "Data load failed");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    clearSession();
    refreshSessionView();
    setPayload("");
    setStatus("Logged out");
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50 p-6">
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
            <strong>Production API:</strong> {API_BASE_URL}
          </p>
          <p>
            <strong>Current phone:</strong> {mounted ? (currentPhone ?? "none") : "loading..."}
          </p>
          <p>
            <strong>Current role:</strong> {mounted ? (currentRole ?? "none") : "loading..."}
          </p>
          {expectedRole ? (
            <p>
              <strong>Expected role:</strong> {expectedRole}
            </p>
          ) : null}
        </div>

        {loginEnabled ? (
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4 space-y-4">
            <h2 className="text-xl font-medium">Login</h2>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm text-neutral-300">Phone</span>
                <input
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm text-neutral-300">Password</span>
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
                Login
              </button>
              <button
                onClick={handleLogout}
                className="rounded-xl border border-neutral-700 px-4 py-2"
              >
                Logout
              </button>
              {dataPath ? (
                <button
                  onClick={handleLoadData}
                  disabled={loading}
                  className="rounded-xl border border-neutral-700 px-4 py-2"
                >
                  Load live data
                </button>
              ) : null}
            </div>
            <p className="text-sm text-amber-300">{status}</p>
          </div>
        ) : null}

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
          <h2 className="text-xl font-medium mb-3">Live data payload</h2>
          <pre className="overflow-auto whitespace-pre-wrap text-sm text-neutral-200">
            {payload || "No data loaded yet."}
          </pre>
        </div>
      </div>
    </main>
  );
}
