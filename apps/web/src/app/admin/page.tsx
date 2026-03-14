"use client";

import { useState } from "react";
import { LanguageToggle } from "@/components/LanguageToggle";
import { API_BASE_URL, apiFetch, login } from "@/lib/api";
import { clearSession, getAccessToken, getPhone, getRole, saveSession } from "@/lib/session";

type DailyCloseResponse = { data: unknown };
type DriverCashResponse = { data: unknown };
type AdminCommissionsResponse = { data: unknown };
type CreatePayoutResponse = { data: unknown };
type PayoutReportResponse = { data: unknown };

function prettyJson(value: unknown) {
  return JSON.stringify(value, null, 2);
}

export default function AdminPage() {
  const [phone, setPhone] = useState("+255700000001");
  const [password, setPassword] = useState("Pass123!");
  const [status, setStatus] = useState("");
  const [payload, setPayload] = useState("No data loaded yet.");
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().slice(0, 10);

  const [reportDate, setReportDate] = useState(today);
  const [periodStart, setPeriodStart] = useState(today);
  const [periodEnd, setPeriodEnd] = useState(today);
  const [affiliateShopId, setAffiliateShopId] = useState("");
  const [payoutId, setPayoutId] = useState("");

  const currentRole = typeof window === "undefined" ? null : getRole();
  const currentPhone = typeof window === "undefined" ? null : getPhone();

  async function handleLogin() {
    setLoading(true);
    setStatus("");
    try {
      const result = await login(phone, password);
      saveSession(result.data.tokens.accessToken, result.data.user.role, result.data.user.phone);
      setStatus(`Login ok for role ${result.data.user.role}`);
      setPayload(prettyJson(result));
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    clearSession();
    setStatus("Logged out");
    setPayload("No data loaded yet.");
  }

  async function handleLoadDailyClose() {
    const liveToken = getAccessToken();
    if (!liveToken) {
      setStatus("Missing token");
      return;
    }

    setLoading(true);
    setStatus("");
    try {
      const result = await apiFetch<DailyCloseResponse>(
        `/v1/admin/reports/daily-close?date=${encodeURIComponent(reportDate)}`,
        { token: liveToken }
      );
      setPayload(prettyJson(result));
      setStatus(`Loaded daily close for ${reportDate}`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Load daily close failed");
      setPayload("");
    } finally {
      setLoading(false);
    }
  }

  async function handleLoadDriverCash() {
    const liveToken = getAccessToken();
    if (!liveToken) {
      setStatus("Missing token");
      return;
    }

    setLoading(true);
    setStatus("");
    try {
      const result = await apiFetch<DriverCashResponse>(
        `/v1/admin/reports/driver-cash?date=${encodeURIComponent(reportDate)}`,
        { token: liveToken }
      );
      setPayload(prettyJson(result));
      setStatus(`Loaded driver cash report for ${reportDate}`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Load driver cash report failed");
      setPayload("");
    } finally {
      setLoading(false);
    }
  }

  async function handleLoadCommissions() {
    const liveToken = getAccessToken();
    if (!liveToken) {
      setStatus("Missing token");
      return;
    }

    const query = new URLSearchParams();
    if (affiliateShopId.trim()) query.set("shopId", affiliateShopId.trim());
    if (periodStart) query.set("from", `${periodStart}T00:00:00.000Z`);
    if (periodEnd) query.set("to", `${periodEnd}T23:59:59.999Z`);

    setLoading(true);
    setStatus("");
    try {
      const result = await apiFetch<AdminCommissionsResponse>(
        `/v1/admin/commissions?${query.toString()}`,
        { token: liveToken }
      );
      setPayload(prettyJson(result));
      setStatus("Loaded admin commission ledger");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Load commissions failed");
      setPayload("");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreatePayout() {
    const liveToken = getAccessToken();
    if (!liveToken) {
      setStatus("Missing token");
      return;
    }

    if (!affiliateShopId.trim()) {
      setStatus("affiliateShopId is required");
      return;
    }

    setLoading(true);
    setStatus("");
    try {
      const result = await apiFetch<CreatePayoutResponse>("/v1/admin/payouts", {
        method: "POST",
        token: liveToken,
        body: JSON.stringify({
          affiliateShopId: affiliateShopId.trim(),
          periodStart,
          periodEnd,
        }),
      });
      setPayload(prettyJson(result));
      setStatus(`Created payout draft for shop ${affiliateShopId.trim()}`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Create payout draft failed");
      setPayload("");
    } finally {
      setLoading(false);
    }
  }

  async function handleLoadPayoutReport() {
    const liveToken = getAccessToken();
    if (!liveToken) {
      setStatus("Missing token");
      return;
    }

    const query = new URLSearchParams();
    if (affiliateShopId.trim()) query.set("affiliateShopId", affiliateShopId.trim());
    if (payoutId.trim()) query.set("payoutId", payoutId.trim());

    setLoading(true);
    setStatus("");
    try {
      const result = await apiFetch<PayoutReportResponse>(
        `/v1/admin/payouts/report${query.toString() ? `?${query.toString()}` : ""}`,
        { token: liveToken }
      );
      setPayload(prettyJson(result));
      setStatus("Loaded payout report");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Load payout report failed");
      setPayload("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-neutral-400">Mimo Laundry OS</p>
            <h1 className="text-3xl font-semibold">Admin Portal</h1>
            <p className="mt-2 text-neutral-300">
              Executable admin finance and reporting surface for Chapter 12.1 dry-run.
            </p>
          </div>
          <LanguageToggle />
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4 space-y-2">
          <p>
            <strong>Production API:</strong> {API_BASE_URL}
          </p>
          <p>
            <strong>Current phone:</strong> {currentPhone ?? "none"}
          </p>
          <p>
            <strong>Current role:</strong> {currentRole ?? "none"}
          </p>
          <p>
            <strong>Expected role:</strong> ADMIN
          </p>
          <p className="text-sm text-amber-300">{status}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4 space-y-4">
            <h2 className="text-xl font-medium">Login</h2>
            <div className="grid gap-3">
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
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4 space-y-4">
            <h2 className="text-xl font-medium">Reports</h2>

            <div className="grid gap-3 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm text-neutral-300">Report date</span>
                <input
                  type="date"
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2"
                  value={reportDate}
                  onChange={(e) => setReportDate(e.target.value)}
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm text-neutral-300">Affiliate shop ID</span>
                <input
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2"
                  value={affiliateShopId}
                  onChange={(e) => setAffiliateShopId(e.target.value)}
                  placeholder="Paste affiliate shop UUID here"
                />
              </label>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleLoadDailyClose}
                disabled={loading}
                className="rounded-xl bg-white px-4 py-2 text-black disabled:opacity-50"
              >
                Load daily close
              </button>
              <button
                onClick={handleLoadDriverCash}
                disabled={loading}
                className="rounded-xl border border-neutral-700 px-4 py-2"
              >
                Load driver cash
              </button>
              <button
                onClick={handleLoadCommissions}
                disabled={loading}
                className="rounded-xl border border-neutral-700 px-4 py-2"
              >
                Load commissions
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4 space-y-4">
          <h2 className="text-xl font-medium">Payout draft and report</h2>

          <div className="grid gap-3 md:grid-cols-3">
            <label className="space-y-2">
              <span className="text-sm text-neutral-300">Period start</span>
              <input
                type="date"
                className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2"
                value={periodStart}
                onChange={(e) => setPeriodStart(e.target.value)}
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm text-neutral-300">Period end</span>
              <input
                type="date"
                className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2"
                value={periodEnd}
                onChange={(e) => setPeriodEnd(e.target.value)}
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm text-neutral-300">Payout ID</span>
              <input
                className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2"
                value={payoutId}
                onChange={(e) => setPayoutId(e.target.value)}
                placeholder="Optional payout UUID"
              />
            </label>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleCreatePayout}
              disabled={loading}
              className="rounded-xl bg-white px-4 py-2 text-black disabled:opacity-50"
            >
              Create payout draft
            </button>
            <button
              onClick={handleLoadPayoutReport}
              disabled={loading}
              className="rounded-xl border border-neutral-700 px-4 py-2"
            >
              Load payout report
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
          <h2 className="mb-3 text-xl font-medium">Live payload</h2>
          <pre className="overflow-auto whitespace-pre-wrap text-sm text-neutral-200">
            {payload}
          </pre>
        </div>
      </div>
    </main>
  );
}
