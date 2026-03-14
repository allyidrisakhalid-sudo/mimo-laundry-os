"use client";

import { useState } from "react";
import { LanguageToggle } from "@/components/LanguageToggle";
import { API_BASE_URL, apiFetch, login } from "@/lib/api";
import { clearSession, getAccessToken, getPhone, getRole, saveSession } from "@/lib/session";

type DriverTasksResponse = {
  data: {
    tasks: Array<{
      stopId: string;
      tripId: string;
      orderId: string;
      orderNumber: string;
      stopType: string;
      tripType: string;
      status: string;
      sequence: number;
      customerName?: string | null;
      customerPhone?: string | null;
      tagCode?: string | null;
    }>;
  };
};

type DriverStopDetailResponse = {
  data: unknown;
};

type DriverPickupResponse = {
  data: unknown;
};

type DriverDeliverResponse = {
  data: unknown;
};

type DriverReconciliationResponse = {
  data: unknown;
};

function prettyJson(value: unknown) {
  return JSON.stringify(value, null, 2);
}

export default function DriverPage() {
  const [phone, setPhone] = useState("+255700000003");
  const [password, setPassword] = useState("Pass123!");
  const [status, setStatus] = useState("");
  const [payload, setPayload] = useState("No data loaded yet.");
  const [loading, setLoading] = useState(false);

  const [stopId, setStopId] = useState("");
  const [tagCode, setTagCode] = useState("");
  const [deliveryOtp, setDeliveryOtp] = useState("");
  const [reconciliationDate, setReconciliationDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [submittedCashTzs, setSubmittedCashTzs] = useState("0");
  const [reconciliationNotes, setReconciliationNotes] = useState(
    "Driver reconciliation submitted from Chapter 12.1 dry-run."
  );

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

  async function handleLoadTasks() {
    const liveToken = getAccessToken();
    if (!liveToken) {
      setStatus("Missing token");
      return;
    }

    setLoading(true);
    setStatus("");
    try {
      const result = await apiFetch<DriverTasksResponse>("/v1/driver/tasks", {
        token: liveToken,
      });
      setPayload(prettyJson(result));
      setStatus(`Loaded ${result.data.tasks.length} driver task(s)`);

      const firstTask = result.data.tasks[0];
      if (firstTask?.stopId) {
        setStopId(firstTask.stopId);
      }
      if (firstTask?.tagCode) {
        setTagCode(firstTask.tagCode);
      }
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Load tasks failed");
      setPayload("");
    } finally {
      setLoading(false);
    }
  }

  async function handleLoadStopDetail() {
    const liveToken = getAccessToken();
    if (!liveToken) {
      setStatus("Missing token");
      return;
    }

    if (!stopId.trim()) {
      setStatus("stopId is required");
      return;
    }

    setLoading(true);
    setStatus("");
    try {
      const result = await apiFetch<DriverStopDetailResponse>(`/v1/driver/stops/${stopId.trim()}`, {
        token: liveToken,
      });
      setPayload(prettyJson(result));
      setStatus(`Loaded stop detail for ${stopId.trim()}`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Load stop detail failed");
      setPayload("");
    } finally {
      setLoading(false);
    }
  }

  async function handlePickup() {
    const liveToken = getAccessToken();
    if (!liveToken) {
      setStatus("Missing token");
      return;
    }

    if (!stopId.trim()) {
      setStatus("stopId is required");
      return;
    }

    setLoading(true);
    setStatus("");
    try {
      const result = await apiFetch<DriverPickupResponse>(
        `/v1/driver/stops/${stopId.trim()}/pickup`,
        {
          method: "POST",
          token: liveToken,
          body: JSON.stringify({
            tagCode: tagCode || null,
          }),
        }
      );
      setPayload(prettyJson(result));
      setStatus(`Pickup completed for stop ${stopId.trim()}`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Pickup failed");
      setPayload("");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeliver() {
    const liveToken = getAccessToken();
    if (!liveToken) {
      setStatus("Missing token");
      return;
    }

    if (!stopId.trim()) {
      setStatus("stopId is required");
      return;
    }

    setLoading(true);
    setStatus("");
    try {
      const result = await apiFetch<DriverDeliverResponse>(
        `/v1/driver/stops/${stopId.trim()}/deliver`,
        {
          method: "POST",
          token: liveToken,
          body: JSON.stringify({
            otp: deliveryOtp || null,
          }),
        }
      );
      setPayload(prettyJson(result));
      setStatus(`Delivery completed for stop ${stopId.trim()}`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Delivery failed");
      setPayload("");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitReconciliation() {
    const liveToken = getAccessToken();
    if (!liveToken) {
      setStatus("Missing token");
      return;
    }

    setLoading(true);
    setStatus("");
    try {
      const result = await apiFetch<DriverReconciliationResponse>(
        "/v1/driver/reconciliation/submit",
        {
          method: "POST",
          token: liveToken,
          body: JSON.stringify({
            date: reconciliationDate,
            submittedCashTzs: Number(submittedCashTzs),
            notes: reconciliationNotes || null,
          }),
        }
      );
      setPayload(prettyJson(result));
      setStatus(`Driver reconciliation submitted for ${reconciliationDate}`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Reconciliation submit failed");
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
            <h1 className="text-3xl font-semibold">Driver Portal</h1>
            <p className="mt-2 text-neutral-300">
              Executable driver operations surface for Chapter 12.1 dry-run.
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
            <strong>Expected role:</strong> DRIVER
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
              <button
                onClick={handleLoadTasks}
                disabled={loading}
                className="rounded-xl border border-neutral-700 px-4 py-2"
              >
                Load tasks
              </button>
              <button
                onClick={handleLoadStopDetail}
                disabled={loading}
                className="rounded-xl border border-neutral-700 px-4 py-2"
              >
                Load stop detail
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4 space-y-4">
            <h2 className="text-xl font-medium">Driver actions</h2>

            <label className="space-y-2 block">
              <span className="text-sm text-neutral-300">Stop ID</span>
              <input
                className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2"
                value={stopId}
                onChange={(e) => setStopId(e.target.value)}
                placeholder="Paste stop UUID here"
              />
            </label>

            <label className="space-y-2 block">
              <span className="text-sm text-neutral-300">Bag tag code</span>
              <input
                className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2"
                value={tagCode}
                onChange={(e) => setTagCode(e.target.value)}
                placeholder="BAG-..."
              />
            </label>

            <label className="space-y-2 block">
              <span className="text-sm text-neutral-300">Delivery OTP</span>
              <input
                className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2"
                value={deliveryOtp}
                onChange={(e) => setDeliveryOtp(e.target.value)}
                placeholder="6-digit OTP"
              />
            </label>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handlePickup}
                disabled={loading}
                className="rounded-xl bg-white px-4 py-2 text-black disabled:opacity-50"
              >
                Confirm pickup
              </button>
              <button
                onClick={handleDeliver}
                disabled={loading}
                className="rounded-xl border border-neutral-700 px-4 py-2"
              >
                Confirm delivery
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4 space-y-4">
          <h2 className="text-xl font-medium">Driver reconciliation</h2>

          <div className="grid gap-3 md:grid-cols-3">
            <label className="space-y-2">
              <span className="text-sm text-neutral-300">Date</span>
              <input
                type="date"
                className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2"
                value={reconciliationDate}
                onChange={(e) => setReconciliationDate(e.target.value)}
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm text-neutral-300">Submitted cash (TZS)</span>
              <input
                className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2"
                value={submittedCashTzs}
                onChange={(e) => setSubmittedCashTzs(e.target.value)}
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm text-neutral-300">Notes</span>
              <input
                className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2"
                value={reconciliationNotes}
                onChange={(e) => setReconciliationNotes(e.target.value)}
              />
            </label>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleSubmitReconciliation}
              disabled={loading}
              className="rounded-xl bg-white px-4 py-2 text-black disabled:opacity-50"
            >
              Submit reconciliation
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
