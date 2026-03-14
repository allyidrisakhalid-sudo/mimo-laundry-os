"use client";

import { useMemo, useState } from "react";
import { LanguageToggle } from "@/components/LanguageToggle";
import { API_BASE_URL, apiFetch, login } from "@/lib/api";
import { clearSession, getAccessToken, getPhone, getRole, saveSession } from "@/lib/session";

type CustomerAddressesResponse = {
  data: {
    addresses: Array<{
      id: string;
      label: string | null;
      contactName: string | null;
      phone: string | null;
      line1: string | null;
      zoneId: string | null;
      notes: string | null;
      createdAt: string;
      updatedAt: string;
    }>;
  };
};

type CustomerOrderReadResponse = {
  data: unknown;
};

type CustomerCreateOrderResponse = {
  data: {
    order: {
      id: string;
      orderNumber: string;
      statusCurrent: string;
      createdAt: string;
      zoneId: string;
      hubId: string;
      bagTagCode: string;
    };
  };
};

function prettyJson(value: unknown) {
  return JSON.stringify(value, null, 2);
}

export default function CustomerPage() {
  const [phone, setPhone] = useState("+255700000005");
  const [password, setPassword] = useState("Pass123!");
  const [status, setStatus] = useState("");
  const [payload, setPayload] = useState("No data loaded yet.");
  const [loading, setLoading] = useState(false);

  const [addresses, setAddresses] = useState<
    Array<{
      id: string;
      label: string | null;
      contactName: string | null;
      phone: string | null;
      line1: string | null;
      zoneId: string | null;
      notes: string | null;
      createdAt: string;
      updatedAt: string;
    }>
  >([]);

  const [channel, setChannel] = useState("DOOR");
  const [tier, setTier] = useState("STANDARD_48H");
  const [pickupAddressId, setPickupAddressId] = useState("");
  const [dropoffAddressId, setDropoffAddressId] = useState("");

  const currentRole = typeof window === "undefined" ? null : getRole();
  const currentPhone = typeof window === "undefined" ? null : getPhone();

  const doorAddressOptions = useMemo(
    () =>
      addresses.map((address) => ({
        id: address.id,
        label: address.label || address.line1 || address.contactName || address.id,
        zoneId: address.zoneId,
      })),
    [addresses]
  );

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
    setAddresses([]);
    setPickupAddressId("");
    setDropoffAddressId("");
    setStatus("Logged out");
    setPayload("No data loaded yet.");
  }

  async function handleLoadAddresses() {
    const liveToken = getAccessToken();
    if (!liveToken) {
      setStatus("Missing token");
      return;
    }

    setLoading(true);
    setStatus("");
    try {
      const result = await apiFetch<CustomerAddressesResponse>("/v1/customer-addresses", {
        token: liveToken,
      });
      setAddresses(result.data.addresses);
      if (!pickupAddressId && result.data.addresses[0]?.id) {
        setPickupAddressId(result.data.addresses[0].id);
      }
      if (!dropoffAddressId && result.data.addresses[0]?.id) {
        setDropoffAddressId(result.data.addresses[0].id);
      }
      setPayload(prettyJson(result));
      setStatus(`Loaded ${result.data.addresses.length} customer address(es)`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Load addresses failed");
      setPayload("");
    } finally {
      setLoading(false);
    }
  }

  async function handleLoadSeedOrder() {
    const liveToken = getAccessToken();
    if (!liveToken) {
      setStatus("Missing token");
      return;
    }

    setLoading(true);
    setStatus("");
    try {
      const result = await apiFetch<CustomerOrderReadResponse>("/v1/orders/order_customer_a", {
        token: liveToken,
      });
      setPayload(prettyJson(result));
      setStatus("Loaded seeded customer order");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Load seeded order failed");
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
        channel,
        tier,
      };

      if (channel === "DOOR") {
        body.pickupAddressId = pickupAddressId;
      } else if (channel === "HYBRID") {
        body.affiliateShopId = null;
        body.dropoffAddressId = dropoffAddressId;
      }

      const result = await apiFetch<CustomerCreateOrderResponse>("/v1/orders", {
        method: "POST",
        token: liveToken,
        body: JSON.stringify(body),
      });

      setPayload(prettyJson(result));
      setStatus(`Customer order created: ${result.data.order.orderNumber}`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Create order failed");
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
            <h1 className="text-3xl font-semibold">Customer Portal</h1>
            <p className="mt-2 text-neutral-300">
              Executable customer order surface for Chapter 12.1 dry-run.
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
            <strong>Expected role:</strong> CUSTOMER
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
                onClick={handleLoadAddresses}
                disabled={loading}
                className="rounded-xl border border-neutral-700 px-4 py-2"
              >
                Load addresses
              </button>
              <button
                onClick={handleLoadSeedOrder}
                disabled={loading}
                className="rounded-xl border border-neutral-700 px-4 py-2"
              >
                Load seeded order
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4 space-y-4">
            <h2 className="text-xl font-medium">Create customer order</h2>

            <div className="grid gap-3">
              <div className="grid gap-3 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm text-neutral-300">Channel</span>
                  <select
                    className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2"
                    value={channel}
                    onChange={(e) => setChannel(e.target.value)}
                  >
                    <option value="DOOR">DOOR</option>
                  </select>
                </label>

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
              </div>

              <label className="space-y-2">
                <span className="text-sm text-neutral-300">Pickup address</span>
                <select
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2"
                  value={pickupAddressId}
                  onChange={(e) => setPickupAddressId(e.target.value)}
                >
                  <option value="">Select address after loading addresses</option>
                  {doorAddressOptions.map((address) => (
                    <option key={address.id} value={address.id}>
                      {address.label} {address.zoneId ? `(${address.zoneId})` : ""}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleCreateOrder}
                disabled={loading}
                className="rounded-xl bg-white px-4 py-2 text-black disabled:opacity-50"
              >
                Create customer order
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
