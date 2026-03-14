"use client";

import { useState } from "react";
import { LanguageToggle } from "@/components/LanguageToggle";
import { API_BASE_URL, apiFetch, login } from "@/lib/api";
import { clearSession, getAccessToken, getPhone, getRole, saveSession } from "@/lib/session";

type AffiliateOrdersResponse = {
  data: {
    orders: Array<{
      id: string;
      orderNumber: string;
      sourceType: string;
      affiliateShopId: string;
      channel: string;
      customerName: string;
      customerPhone: string;
      tier: string;
      zoneId: string;
      hubId: string;
      statusCurrent: string;
      createdAt: string;
      updatedAt: string;
    }>;
  };
};

type AffiliateCreateResponse = {
  data: {
    order: {
      id: string;
      orderNumber: string;
      sourceType: string;
      affiliateShopId: string;
      channel: string;
      customerName: string;
      customerPhone: string;
      tier: string;
      zoneId: string;
      hubId: string;
      statusCurrent: string;
      bagTagCode: string;
      returnMethod: string;
      dropoffAddressId: string | null;
    };
  };
};

type AffiliateCommissionsResponse = {
  data: {
    commissions: Array<{
      id: string;
      orderId: string;
      orderNumber: string;
      amountTzs: number;
      status: string;
      earnedAt: string;
      payoutId: string | null;
    }>;
  };
};

type AffiliatePayoutsResponse = {
  data: {
    payouts: Array<{
      id: string;
      periodStart: string;
      periodEnd: string;
      totalAmountTzs: number;
      status: string;
      paymentMethod: string | null;
      paymentReference: string | null;
      createdAt: string;
    }>;
  };
};

function prettyJson(value: unknown) {
  return JSON.stringify(value, null, 2);
}

function tzs(value: number | null | undefined) {
  return new Intl.NumberFormat("en-TZ", {
    style: "currency",
    currency: "TZS",
    maximumFractionDigits: 0,
  }).format(Number(value ?? 0));
}

export default function AffiliatePage() {
  const [phone, setPhone] = useState("+255700000004");
  const [password, setPassword] = useState("Pass123!");
  const [status, setStatus] = useState("");
  const [payload, setPayload] = useState("No data loaded yet.");
  const [loading, setLoading] = useState(false);

  const [customerName, setCustomerName] = useState("Walk-in Customer");
  const [customerPhone, setCustomerPhone] = useState("+255700000099");
  const [tier, setTier] = useState("STANDARD_48H");
  const [returnMethod, setReturnMethod] = useState("PICKUP_AT_SHOP");
  const [notes, setNotes] = useState("");

  const [dropoffAddressLine1, setDropoffAddressLine1] = useState("Mikocheni Block A");
  const [dropoffAddressArea, setDropoffAddressArea] = useState("Mikocheni");
  const [dropoffAddressCity, setDropoffAddressCity] = useState("Dar es Salaam");
  const [dropoffAddressNotes, setDropoffAddressNotes] = useState("");
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

  async function handleLoadOrders() {
    const liveToken = getAccessToken();
    if (!liveToken) {
      setStatus("Missing token");
      return;
    }

    setLoading(true);
    setStatus("");
    try {
      const result = await apiFetch<AffiliateOrdersResponse>("/v1/affiliate/orders", {
        token: liveToken,
      });
      setPayload(prettyJson(result));
      setStatus(`Loaded ${result.data.orders.length} affiliate order(s)`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Load orders failed");
      setPayload("");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateOrder() {
    const liveToken = getAccessToken();
    if (!liveToken) {
      setStatus("Missing token");
      return;
    }

    setLoading(true);
    setStatus("");
    try {
      const body: Record<string, unknown> = {
        customerName,
        customerPhone,
        tier,
        returnMethod,
        notes: notes || null,
      };

      if (returnMethod === "DELIVER_TO_DOOR") {
        body.dropoffAddressLine1 = dropoffAddressLine1;
        body.dropoffAddressArea = dropoffAddressArea;
        body.dropoffAddressCity = dropoffAddressCity;
        body.dropoffAddressNotes = dropoffAddressNotes || null;
      }

      const result = await apiFetch<AffiliateCreateResponse>("/v1/affiliate/orders", {
        method: "POST",
        token: liveToken,
        body: JSON.stringify(body),
      });

      setPayload(prettyJson(result));
      setStatus(`Affiliate order created: ${result.data.order.orderNumber}`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Create order failed");
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

    setLoading(true);
    setStatus("");
    try {
      const result = await apiFetch<AffiliateCommissionsResponse>("/v1/affiliate/commissions", {
        token: liveToken,
      });
      setPayload(prettyJson(result));
      const total = result.data.commissions.reduce(
        (sum, row) => sum + Number(row.amountTzs ?? 0),
        0
      );
      setStatus(
        `Loaded ${result.data.commissions.length} commission entr${result.data.commissions.length === 1 ? "y" : "ies"} totaling ${tzs(total)}`
      );
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Load commissions failed");
      setPayload("");
    } finally {
      setLoading(false);
    }
  }

  async function handleLoadPayouts() {
    const liveToken = getAccessToken();
    if (!liveToken) {
      setStatus("Missing token");
      return;
    }

    setLoading(true);
    setStatus("");
    try {
      const result = await apiFetch<AffiliatePayoutsResponse>("/v1/affiliate/payouts", {
        token: liveToken,
      });
      setPayload(prettyJson(result));
      setStatus(`Loaded ${result.data.payouts.length} payout record(s)`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Load payouts failed");
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
            <h1 className="text-3xl font-semibold">Affiliate Portal</h1>
            <p className="mt-2 text-neutral-300">
              Executable affiliate operations surface for Chapter 12.1 dry-run.
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
            <strong>Expected role:</strong> AFFILIATE_STAFF
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
                onClick={handleLoadOrders}
                disabled={loading}
                className="rounded-xl border border-neutral-700 px-4 py-2"
              >
                Load affiliate orders
              </button>
              <button
                onClick={handleLoadCommissions}
                disabled={loading}
                className="rounded-xl border border-neutral-700 px-4 py-2"
              >
                Load commissions
              </button>
              <button
                onClick={handleLoadPayouts}
                disabled={loading}
                className="rounded-xl border border-neutral-700 px-4 py-2"
              >
                Load payouts
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4 space-y-4">
            <h2 className="text-xl font-medium">Create affiliate order</h2>

            <div className="grid gap-3">
              <label className="space-y-2">
                <span className="text-sm text-neutral-300">Customer name</span>
                <input
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm text-neutral-300">Customer phone</span>
                <input
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                />
              </label>

              <div className="grid gap-3 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm text-neutral-300">Tier</span>
                  <select
                    className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2"
                    value={tier}
                    onChange={(e) => setTier(e.target.value)}
                  >
                    <option value="STANDARD_48H">STANDARD_48H</option>
                    <option value="EXPRESS_24H">EXPRESS_24H</option>
                    <option value="SAME_DAY">SAME_DAY</option>
                  </select>
                </label>

                <label className="space-y-2">
                  <span className="text-sm text-neutral-300">Return method</span>
                  <select
                    className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2"
                    value={returnMethod}
                    onChange={(e) => setReturnMethod(e.target.value)}
                  >
                    <option value="PICKUP_AT_SHOP">PICKUP_AT_SHOP</option>
                    <option value="DELIVER_TO_DOOR">DELIVER_TO_DOOR</option>
                  </select>
                </label>
              </div>

              <label className="space-y-2">
                <span className="text-sm text-neutral-300">Notes</span>
                <textarea
                  className="min-h-24 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </label>

              {returnMethod === "DELIVER_TO_DOOR" ? (
                <div className="rounded-xl border border-neutral-800 p-4 space-y-3">
                  <h3 className="text-lg font-medium">Door return address</h3>
                  <label className="space-y-2">
                    <span className="text-sm text-neutral-300">Address line 1</span>
                    <input
                      className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2"
                      value={dropoffAddressLine1}
                      onChange={(e) => setDropoffAddressLine1(e.target.value)}
                    />
                  </label>
                  <div className="grid gap-3 md:grid-cols-2">
                    <label className="space-y-2">
                      <span className="text-sm text-neutral-300">Area</span>
                      <input
                        className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2"
                        value={dropoffAddressArea}
                        onChange={(e) => setDropoffAddressArea(e.target.value)}
                      />
                    </label>
                    <label className="space-y-2">
                      <span className="text-sm text-neutral-300">City</span>
                      <input
                        className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2"
                        value={dropoffAddressCity}
                        onChange={(e) => setDropoffAddressCity(e.target.value)}
                      />
                    </label>
                  </div>
                  <label className="space-y-2">
                    <span className="text-sm text-neutral-300">Address notes</span>
                    <input
                      className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2"
                      value={dropoffAddressNotes}
                      onChange={(e) => setDropoffAddressNotes(e.target.value)}
                    />
                  </label>
                </div>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleCreateOrder}
                disabled={loading}
                className="rounded-xl bg-white px-4 py-2 text-black disabled:opacity-50"
              >
                Create affiliate order
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
