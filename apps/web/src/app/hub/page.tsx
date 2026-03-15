"use client";

import { useState } from "react";
import { LanguageToggle } from "@/components/LanguageToggle";
import { API_BASE_URL, apiFetch, login } from "@/lib/api";
import { clearSession, getAccessToken, getPhone, getRole, saveSession } from "@/lib/session";

type HubIntakeResponse = {
  data: {
    orderId: string;
    pricingSnapshot: unknown;
    totals: unknown;
  };
};

type TimelineEvent = {
  id: string;
  eventType: string;
  occurredAt: string;
  notes: string | null;
  actorUserId: string | null;
  actorRole: string | null;
  payloadJson?: unknown;
};

type OrderTimelineResponse = {
  data: {
    orderId?: string;
    events?: TimelineEvent[];
    timeline?: TimelineEvent[];
    order?: {
      id: string;
      orderNumber: string;
      statusCurrent: string;
      zoneId: string | null;
      hubId: string | null;
    };
  };
};

function prettyJson(value: unknown) {
  return JSON.stringify(value, null, 2);
}

export default function HubPage() {
  const [phone, setPhone] = useState("+255700000002");
  const [password, setPassword] = useState("Pass123!");
  const [status, setStatus] = useState("");
  const [payload, setPayload] = useState("No data loaded yet.");
  const [loading, setLoading] = useState(false);

  const [orderId, setOrderId] = useState("");
  const [actualWeightKg, setActualWeightKg] = useState("3.5");
  const [notes, setNotes] = useState("Hub intake recorded from production dry-run.");
  const [itemEntriesJson, setItemEntriesJson] = useState("[]");

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

  async function handleLoadTimeline() {
    const liveToken = getAccessToken();
    if (!liveToken) {
      setStatus("Missing token");
      return;
    }

    if (!orderId.trim()) {
      setStatus("orderId is required");
      return;
    }

    setLoading(true);
    setStatus("");
    try {
      const result = await apiFetch<OrderTimelineResponse>(
        `/v1/orders/${orderId.trim()}/timeline`,
        {
          token: liveToken,
        }
      );

      setPayload(prettyJson(result));

      const events = Array.isArray(result?.data?.events)
        ? result.data.events
        : Array.isArray(result?.data?.timeline)
          ? result.data.timeline
          : [];

      setStatus(`Loaded timeline with ${events.length} event(s)`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Load timeline failed");
      setPayload("");
    } finally {
      setLoading(false);
    }
  }

  async function handleHubIntake() {
    const liveToken = getAccessToken();
    if (!liveToken) {
      setStatus("Missing token");
      return;
    }

    if (!orderId.trim()) {
      setStatus("orderId is required");
      return;
    }

    setLoading(true);
    setStatus("");

    try {
      let itemEntries: unknown = [];
      try {
        itemEntries = JSON.parse(itemEntriesJson);
      } catch {
        throw new Error("itemEntriesJson must be valid JSON");
      }

      const result = await apiFetch<HubIntakeResponse>(
        `/v1/admin/orders/${orderId.trim()}/intake`,
        {
          method: "POST",
          token: liveToken,
          body: JSON.stringify({
            actualWeightKg: Number(actualWeightKg),
            itemEntries,
            notes: notes || null,
          }),
        }
      );

      setPayload(prettyJson(result));
      setStatus(`Hub intake finalized for order ${orderId.trim()}`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Hub intake failed");
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
            <h1 className="text-3xl font-semibold">Hub Portal</h1>
            <p className="mt-2 text-neutral-300">
              Executable hub intake surface for Chapter 12.1 dry-run.
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
            <strong>Expected role:</strong> HUB_STAFF
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
            <h2 className="text-xl font-medium">Hub intake</h2>

            <label className="space-y-2 block">
              <span className="text-sm text-neutral-300">Order ID</span>
              <input
                className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Paste order UUID here"
              />
            </label>

            <div className="grid gap-3 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm text-neutral-300">Actual weight (kg)</span>
                <input
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2"
                  value={actualWeightKg}
                  onChange={(e) => setActualWeightKg(e.target.value)}
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm text-neutral-300">Item entries JSON</span>
                <input
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2"
                  value={itemEntriesJson}
                  onChange={(e) => setItemEntriesJson(e.target.value)}
                />
              </label>
            </div>

            <label className="space-y-2 block">
              <span className="text-sm text-neutral-300">Notes</span>
              <textarea
                className="min-h-24 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </label>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleHubIntake}
                disabled={loading}
                className="rounded-xl bg-white px-4 py-2 text-black disabled:opacity-50"
              >
                Finalize intake
              </button>
              <button
                onClick={handleLoadTimeline}
                disabled={loading}
                className="rounded-xl border border-neutral-700 px-4 py-2"
              >
                Load order timeline
              </button>
            </div>
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
