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

type CreatedOrder = {
  id?: string | null;
  orderNumber?: string | null;
  statusCurrent?: string | null;
  createdAt?: string | null;
  zoneId?: string | null;
  hubId?: string | null;
  bagTagCode?: string | null;
};

type MeResult = {
  user?: {
    id?: string | null;
    fullName?: string | null;
    phone?: string | null;
    role?: string | null;
    status?: string | null;
  };
};

type AffiliateShopOption = {
  id?: string | null;
  name?: string | null;
  zoneId?: string | null;
};

type InvoiceLineItem = {
  id: string;
  type: string;
  description: string;
  quantity: string;
  unitPrice: number;
  amount: number;
};

type InvoiceData = {
  order?: {
    id: string;
    orderNumber: string;
    channel: string;
    tier: string;
    statusCurrent: string;
  };
  pricingSnapshot?: {
    quoteStatus?: string | null;
    pricingPlanId?: string | null;
  };
  lineItems?: InvoiceLineItem[];
  totals?: {
    subtotal: number;
    deliveryTotal: number;
    discountTotal: number;
    grandTotal: number;
    balanceDue: number;
  };
};

type ReceiptData = {
  receipt?: {
    receiptNumber: string;
    amountTzs: number;
    amountFormatted?: string;
    reference: string;
    paymentMethod?: string;
    issuedAt: string;
  };
};

type TimelineEvent = {
  id?: string | null;
  orderId?: string | null;
  eventType?: string | null;
  occurredAt?: string | null;
  actorUserId?: string | null;
  actorRole?: string | null;
  notes?: string | null;
  createdAt?: string | null;
};

export default function HomePage() {
  const { t } = useTranslation();
  const [phone, setPhone] = useState("+255700000005");
  const [password, setPassword] = useState("Pass123!");
  const [submitting, setSubmitting] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [apiConnected, setApiConnected] = useState<boolean | null>(null);
  const [message, setMessage] = useState("");
  const [loggedInUser, setLoggedInUser] = useState<LoginResult["user"] | null>(null);

  const [orderChannel, setOrderChannel] = useState("DOOR");
  const [orderTier, setOrderTier] = useState("STANDARD_48H");
  const [pickupAddressId, setPickupAddressId] = useState("addr_customer_home_a");
  const [dropoffAddressId, setDropoffAddressId] = useState("addr_customer_home_a");
  const [affiliateShopId, setAffiliateShopId] = useState("shop_mikocheni");
  const [selectedZoneId, setSelectedZoneId] = useState("zone_a");
  const [availableShops, setAvailableShops] = useState<AffiliateShopOption[]>([]);
  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const [latestOrder, setLatestOrder] = useState<CreatedOrder | null>(null);
  const [orderMessage, setOrderMessage] = useState("");
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);
  const [timelineRefreshing, setTimelineRefreshing] = useState(false);

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

  async function loadCurrentUser(token: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) return;

      const payload = (await response.json()) as { data?: MeResult };
      setLoggedInUser(payload.data?.user ?? null);
    } catch {
      return;
    }
  }

  async function loadAffiliateShops(zoneId: string) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/v1/affiliate-shops?zoneId=${encodeURIComponent(zoneId)}`
      );

      if (!response.ok) {
        setAvailableShops([]);
        setAffiliateShopId("");
        return;
      }

      const payload = (await response.json()) as {
        data?: {
          affiliateShops?: AffiliateShopOption[];
        };
      };

      const shops = payload.data?.affiliateShops ?? [];
      setAvailableShops(shops);
      setAffiliateShopId(shops[0]?.id ?? "");
    } catch {
      setAvailableShops([]);
      setAffiliateShopId("");
    }
  }

  async function loadInvoice(orderId: string, token: string) {
    const response = await fetch(`${API_BASE_URL}/v1/orders/${orderId}/invoice`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const payload = await response.json();
    if (response.ok) {
      setInvoice(payload.data ?? null);
    }
  }

  async function loadReceipt(orderId: string, token: string) {
    const response = await fetch(`${API_BASE_URL}/v1/orders/${orderId}/receipt`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.status === 404) {
      setReceipt(null);
      return;
    }
    const payload = await response.json();
    if (response.ok) {
      setReceipt(payload.data ?? null);
    }
  }

  async function loadTimeline(orderId: string, token: string, silent = false) {
    try {
      if (!silent) setTimelineRefreshing(true);

      const response = await fetch(`${API_BASE_URL}/v1/orders/${orderId}/timeline`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) return;

      const payload = (await response.json()) as {
        data?: {
          order?: CreatedOrder;
          timeline?: TimelineEvent[];
        };
      };

      if (payload.data?.order) {
        setLatestOrder((current) => ({
          ...(current ?? {}),
          ...(payload.data?.order ?? {}),
        }));
      }

      setTimeline(payload.data?.timeline ?? []);
    } catch {
      return;
    } finally {
      if (!silent) setTimelineRefreshing(false);
    }
  }

  useEffect(() => {
    const storedToken = window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
    if (storedToken) {
      setAccessToken(storedToken);
      setMessage(t("home.tokenStored"));
      void loadCurrentUser(storedToken);
    }
    void loadHealth();
  }, [t]);

  useEffect(() => {
    void loadAffiliateShops(selectedZoneId);
  }, [selectedZoneId]);

  useEffect(() => {
    if (!accessToken || !latestOrder?.id) return;

    void loadTimeline(latestOrder.id, accessToken);
    void loadInvoice(latestOrder.id, accessToken);
    void loadReceipt(latestOrder.id, accessToken);

    const activeStatuses = new Set([
      "CREATED",
      "PICKUP_SCHEDULED",
      "PICKED_UP",
      "RECEIVED_AT_HUB",
      "WASHING_STARTED",
      "DRYING_STARTED",
      "IRONING_STARTED",
      "PACKED",
      "OUT_FOR_DELIVERY",
      "PAYMENT_DUE",
    ]);

    if (!latestOrder.statusCurrent || !activeStatuses.has(latestOrder.statusCurrent)) {
      return;
    }

    const timer = window.setInterval(() => {
      void loadTimeline(latestOrder.id as string, accessToken, true);
    }, 10000);

    return () => window.clearInterval(timer);
  }, [accessToken, latestOrder?.id, latestOrder?.statusCurrent]);

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

  async function handleCreateOrder() {
    if (!accessToken) return;

    try {
      setOrderSubmitting(true);
      setOrderMessage("");

      const body: Record<string, string> = {
        channel: orderChannel,
        tier: orderTier,
      };

      if (orderChannel === "DOOR") {
        body.pickupAddressId = pickupAddressId;
      }

      if (orderChannel === "SHOP_DROP") {
        body.zoneId = selectedZoneId;
        body.affiliateShopId = affiliateShopId;
      }

      if (orderChannel === "HYBRID") {
        body.zoneId = selectedZoneId;
        body.affiliateShopId = affiliateShopId;
        body.dropoffAddressId = dropoffAddressId;
      }

      const response = await fetch(`${API_BASE_URL}/v1/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
      });

      const payload = (await response.json()) as {
        data?: { order?: CreatedOrder };
      };

      const order = payload.data?.order ?? null;

      if (!response.ok || !order) {
        setOrderMessage(t("orders.error"));
        return;
      }

      setLatestOrder(order);
      setOrderMessage(t("orders.success"));
      if (order.id) {
        await loadTimeline(order.id, accessToken);
        await loadInvoice(order.id, accessToken);
        await loadReceipt(order.id, accessToken);
      }
    } catch {
      setOrderMessage(t("orders.error"));
    } finally {
      setOrderSubmitting(false);
    }
  }

  function handleLogout() {
    window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
    setAccessToken(null);
    setLoggedInUser(null);
    setMessage("");
    setOrderMessage("");
    setLatestOrder(null);
    setTimeline([]);
    setInvoice(null);
    setReceipt(null);
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
          <div className="space-y-6">
            <section className="rounded-2xl border bg-white p-6 shadow-sm space-y-4">
              <h2 className="text-2xl font-semibold">{t("home.dashboardTitle")}</h2>
              <p>
                {t("home.loggedInAs")}: {loggedInUser?.fullName ?? "-"} ({loggedInUser?.role ?? "-"}
                )
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

            <section className="rounded-2xl border bg-white p-6 shadow-sm space-y-4">
              <h2 className="text-2xl font-semibold">{t("orders.sectionTitle")}</h2>

              <div className="space-y-2">
                <label className="block text-sm font-medium">{t("orders.channel")}</label>
                <select
                  className="w-full rounded-xl border px-4 py-3"
                  value={orderChannel}
                  onChange={(event) => setOrderChannel(event.target.value)}
                >
                  <option value="DOOR">{t("orders.door")}</option>
                  <option value="SHOP_DROP">{t("orders.shopDrop")}</option>
                  <option value="HYBRID">{t("orders.hybrid")}</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">{t("orders.tier")}</label>
                <select
                  className="w-full rounded-xl border px-4 py-3"
                  value={orderTier}
                  onChange={(event) => setOrderTier(event.target.value)}
                >
                  <option value="STANDARD_48H">{t("orders.standard48h")}</option>
                  <option value="EXPRESS_24H">{t("orders.express24h")}</option>
                  <option value="SAME_DAY">{t("orders.sameDay")}</option>
                </select>
              </div>

              {orderChannel === "DOOR" ? (
                <div className="space-y-2">
                  <label className="block text-sm font-medium">{t("orders.pickupAddress")}</label>
                  <select
                    className="w-full rounded-xl border px-4 py-3"
                    value={pickupAddressId}
                    onChange={(event) => setPickupAddressId(event.target.value)}
                  >
                    <option value="addr_customer_home_a">addr_customer_home_a</option>
                  </select>
                </div>
              ) : null}

              {orderChannel === "SHOP_DROP" || orderChannel === "HYBRID" ? (
                <>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">{t("orders.zoneId")}</label>
                    <select
                      className="w-full rounded-xl border px-4 py-3"
                      value={selectedZoneId}
                      onChange={(event) => setSelectedZoneId(event.target.value)}
                    >
                      <option value="zone_a">Zone A</option>
                      <option value="zone_b">Zone B</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium">{t("orders.affiliateShop")}</label>
                    <select
                      className="w-full rounded-xl border px-4 py-3"
                      value={affiliateShopId}
                      onChange={(event) => setAffiliateShopId(event.target.value)}
                    >
                      {availableShops.map((shop) => (
                        <option key={shop.id ?? ""} value={shop.id ?? ""}>
                          {shop.name ?? shop.id}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              ) : null}

              {orderChannel === "HYBRID" ? (
                <div className="space-y-2">
                  <label className="block text-sm font-medium">{t("orders.dropoffAddress")}</label>
                  <select
                    className="w-full rounded-xl border px-4 py-3"
                    value={dropoffAddressId}
                    onChange={(event) => setDropoffAddressId(event.target.value)}
                  >
                    <option value="addr_customer_home_a">addr_customer_home_a</option>
                  </select>
                </div>
              ) : null}

              <button
                className="rounded-xl border px-4 py-3 font-medium"
                onClick={() => void handleCreateOrder()}
                disabled={orderSubmitting}
              >
                {orderSubmitting ? t("common.loading") : t("orders.submit")}
              </button>

              {orderMessage ? <p className="text-sm text-neutral-700">{orderMessage}</p> : null}
            </section>

            {latestOrder ? (
              <section className="rounded-2xl border bg-white p-6 shadow-sm space-y-3">
                <h2 className="text-2xl font-semibold">{t("orders.detailsTitle")}</h2>
                <p>
                  {t("orders.orderNumber")}: {latestOrder.orderNumber ?? "-"}
                </p>
                <p>
                  {t("orders.statusCurrent")}: {latestOrder.statusCurrent ?? "-"}
                </p>
                <p>
                  {t("orders.zoneId")}: {latestOrder.zoneId ?? "-"}
                </p>
                <p>
                  {t("orders.hubId")}: {latestOrder.hubId ?? "-"}
                </p>
                <p>
                  {t("orders.bagTagCode")}: {latestOrder.bagTagCode ?? "-"}
                </p>

                <div className="pt-4">
                  <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
                    <h3 className="text-lg font-semibold">Invoice Breakdown</h3>
                    {!invoice ? (
                      <p className="mt-2 text-sm text-neutral-600">No invoice loaded yet.</p>
                    ) : (
                      <div className="mt-3 space-y-3">
                        <div className="text-sm text-neutral-700">
                          <div>Quote status: {invoice.pricingSnapshot?.quoteStatus ?? "N/A"}</div>
                          <div>Pricing plan: {invoice.pricingSnapshot?.pricingPlanId ?? "N/A"}</div>
                        </div>
                        <div className="space-y-2">
                          {(invoice.lineItems ?? []).map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between text-sm"
                            >
                              <div>
                                <div className="font-medium text-neutral-900">
                                  {item.description}
                                </div>
                                <div className="text-neutral-500">
                                  Qty {item.quantity} TZS {item.unitPrice.toLocaleString("en-TZ")}
                                </div>
                              </div>
                              <div className="font-semibold text-neutral-900">
                                TZS {item.amount.toLocaleString("en-TZ")}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="border-t border-neutral-200 pt-3 text-sm text-neutral-700">
                          <div>
                            Subtotal: TZS {invoice.totals?.subtotal?.toLocaleString("en-TZ") ?? "0"}
                          </div>
                          <div>
                            Delivery: TZS{" "}
                            {invoice.totals?.deliveryTotal?.toLocaleString("en-TZ") ?? "0"}
                          </div>
                          <div>
                            Discount: TZS{" "}
                            {invoice.totals?.discountTotal?.toLocaleString("en-TZ") ?? "0"}
                          </div>
                          <div className="font-semibold text-neutral-900">
                            Grand total: TZS{" "}
                            {invoice.totals?.grandTotal?.toLocaleString("en-TZ") ?? "0"}
                          </div>
                          <div className="font-semibold text-neutral-900">
                            Balance due: TZS{" "}
                            {invoice.totals?.balanceDue?.toLocaleString("en-TZ") ?? "0"}
                          </div>
                          <div className="mt-1 text-xs uppercase tracking-wide text-neutral-500">
                            {invoice.totals?.balanceDue === 0 ? "Paid" : "Payment due"}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
                    <h3 className="text-lg font-semibold">Receipt</h3>
                    {!receipt?.receipt ? (
                      <p className="mt-2 text-sm text-neutral-600">No receipt issued yet.</p>
                    ) : (
                      <div className="mt-3 space-y-2 text-sm text-neutral-700">
                        <div>
                          Receipt number:{" "}
                          <span className="font-semibold text-neutral-900">
                            {receipt.receipt.receiptNumber}
                          </span>
                        </div>
                        <div>
                          Amount:{" "}
                          <span className="font-semibold text-neutral-900">
                            {receipt.receipt.amountFormatted ??
                              `TZS ${receipt.receipt.amountTzs.toLocaleString("en-TZ")}`}
                          </span>
                        </div>
                        <div>
                          Reference:{" "}
                          <span className="font-semibold text-neutral-900">
                            {receipt.receipt.reference}
                          </span>
                        </div>
                        <div>
                          Method:{" "}
                          <span className="font-semibold text-neutral-900">
                            {receipt.receipt.paymentMethod ?? "N/A"}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <h3 className="text-lg font-semibold">{t("orders.timelineTitle")}</h3>
                  {timelineRefreshing ? (
                    <p className="text-sm text-neutral-600">{t("orders.refreshing")}</p>
                  ) : null}

                  {timeline.length === 0 ? (
                    <p className="text-sm text-neutral-600">{t("orders.emptyTimeline")}</p>
                  ) : (
                    <div className="mt-3 space-y-3">
                      {timeline.map((event) => (
                        <div
                          key={event.id ?? `${event.eventType}-${event.occurredAt}`}
                          className="rounded-xl border p-3"
                        >
                          <p className="font-medium">{event.eventType ?? "-"}</p>
                          <p className="text-sm text-neutral-600">{event.occurredAt ?? "-"}</p>
                          {event.notes ? <p className="text-sm">{event.notes}</p> : null}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            ) : null}
          </div>
        )}
      </div>
    </main>
  );
}
