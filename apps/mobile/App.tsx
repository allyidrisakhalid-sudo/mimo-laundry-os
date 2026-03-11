import React, { useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createApiClient } from "@mimo/sdk";
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";
import "./src/i18n";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:3001";
const ACCESS_TOKEN_STORAGE_KEY = "mimo-mobile-access-token";

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

type MeResult = {
  user?: {
    id?: string | null;
    fullName?: string | null;
    phone?: string | null;
    role?: string | null;
    status?: string | null;
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

function LanguageButtons() {
  const { t, i18n } = useTranslation();

  return (
    <View style={{ flexDirection: "row", gap: 12, marginBottom: 20 }}>
      <Pressable
        onPress={() => void i18n.changeLanguage("en")}
        style={{ borderWidth: 1, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 }}
      >
        <Text>{t("common.english")}</Text>
      </Pressable>
      <Pressable
        onPress={() => void i18n.changeLanguage("sw")}
        style={{ borderWidth: 1, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 }}
      >
        <Text>{t("common.swahili")}</Text>
      </Pressable>
    </View>
  );
}

export default function App() {
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
  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const [latestOrder, setLatestOrder] = useState<CreatedOrder | null>(null);
  const [orderMessage, setOrderMessage] = useState("");
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
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
    (async () => {
      const storedToken = await AsyncStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
      if (storedToken) {
        setAccessToken(storedToken);
        setMessage(t("home.tokenStored"));
        await loadCurrentUser(storedToken);
      }
      await loadHealth();
    })();
  }, [t]);

  useEffect(() => {
    if (!accessToken || !latestOrder?.id) return;

    void loadTimeline(latestOrder.id, accessToken);

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

    const timer = setInterval(() => {
      void loadTimeline(latestOrder.id as string, accessToken, true);
    }, 10000);

    return () => clearInterval(timer);
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

      await AsyncStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token);
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
        body.affiliateShopId = affiliateShopId;
      }

      if (orderChannel === "HYBRID") {
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
      }
    } catch {
      setOrderMessage(t("orders.error"));
    } finally {
      setOrderSubmitting(false);
    }
  }

  async function handleLogout() {
    await AsyncStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
    setAccessToken(null);
    setLoggedInUser(null);
    setMessage("");
    setOrderMessage("");
    setLatestOrder(null);
    setTimeline([]);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <ScrollView contentContainerStyle={{ padding: 24, gap: 20 }}>
        <View>
          <Text style={{ fontSize: 28, fontWeight: "700", marginBottom: 8 }}>
            {t("auth.welcome")}
          </Text>
          <Text>{t("auth.login.subtitle")}</Text>
        </View>

        <LanguageButtons />

        {!isLoggedIn ? (
          <View style={{ backgroundColor: "white", borderRadius: 16, padding: 20, gap: 12 }}>
            <Text style={{ fontSize: 22, fontWeight: "600" }}>{t("auth.login.title")}</Text>

            <Text>{t("auth.login.phone")}</Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder={t("auth.login.phonePlaceholder")}
              autoCapitalize="none"
              style={{
                borderWidth: 1,
                borderRadius: 12,
                paddingHorizontal: 12,
                paddingVertical: 10,
                backgroundColor: "white",
              }}
            />

            <Text>{t("auth.login.password")}</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder={t("auth.login.passwordPlaceholder")}
              secureTextEntry
              style={{
                borderWidth: 1,
                borderRadius: 12,
                paddingHorizontal: 12,
                paddingVertical: 10,
                backgroundColor: "white",
              }}
            />

            <Pressable
              onPress={() => void handleLogin()}
              style={{
                borderWidth: 1,
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 12,
                alignItems: "center",
              }}
            >
              {submitting ? <ActivityIndicator /> : <Text>{t("auth.login.submit")}</Text>}
            </Pressable>

            {message ? <Text>{message}</Text> : null}
          </View>
        ) : (
          <View style={{ gap: 20 }}>
            <View style={{ backgroundColor: "white", borderRadius: 16, padding: 20, gap: 12 }}>
              <Text style={{ fontSize: 22, fontWeight: "600" }}>{t("home.dashboardTitle")}</Text>
              <Text>
                {t("home.loggedInAs")}: {loggedInUser?.fullName ?? "-"} ({loggedInUser?.role ?? "-"}
                )
              </Text>
              <Text>
                {t("home.apiStatusLabel")}:{" "}
                {apiConnected ? t("home.apiConnected") : t("home.apiDisconnected")}
              </Text>
              <Text>{t("home.tokenStored")}</Text>
              <Text>
                {t("home.apiBaseUrl")}: {API_BASE_URL}
              </Text>

              <Pressable
                onPress={() => void handleLogout()}
                style={{
                  borderWidth: 1,
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  alignItems: "center",
                }}
              >
                <Text>{t("home.logout")}</Text>
              </Pressable>
            </View>

            <View style={{ backgroundColor: "white", borderRadius: 16, padding: 20, gap: 12 }}>
              <Text style={{ fontSize: 22, fontWeight: "600" }}>{t("orders.sectionTitle")}</Text>

              <Text>{t("orders.channel")}</Text>
              <TextInput
                value={orderChannel}
                onChangeText={setOrderChannel}
                style={{
                  borderWidth: 1,
                  borderRadius: 12,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  backgroundColor: "white",
                }}
              />

              <Text>{t("orders.tier")}</Text>
              <TextInput
                value={orderTier}
                onChangeText={setOrderTier}
                style={{
                  borderWidth: 1,
                  borderRadius: 12,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  backgroundColor: "white",
                }}
              />

              {orderChannel === "DOOR" ? (
                <>
                  <Text>{t("orders.pickupAddress")}</Text>
                  <TextInput
                    value={pickupAddressId}
                    onChangeText={setPickupAddressId}
                    style={{
                      borderWidth: 1,
                      borderRadius: 12,
                      paddingHorizontal: 12,
                      paddingVertical: 10,
                      backgroundColor: "white",
                    }}
                  />
                </>
              ) : null}

              {orderChannel === "SHOP_DROP" || orderChannel === "HYBRID" ? (
                <>
                  <Text>{t("orders.affiliateShop")}</Text>
                  <TextInput
                    value={affiliateShopId}
                    onChangeText={setAffiliateShopId}
                    style={{
                      borderWidth: 1,
                      borderRadius: 12,
                      paddingHorizontal: 12,
                      paddingVertical: 10,
                      backgroundColor: "white",
                    }}
                  />
                </>
              ) : null}

              {orderChannel === "HYBRID" ? (
                <>
                  <Text>{t("orders.dropoffAddress")}</Text>
                  <TextInput
                    value={dropoffAddressId}
                    onChangeText={setDropoffAddressId}
                    style={{
                      borderWidth: 1,
                      borderRadius: 12,
                      paddingHorizontal: 12,
                      paddingVertical: 10,
                      backgroundColor: "white",
                    }}
                  />
                </>
              ) : null}

              <Pressable
                onPress={() => void handleCreateOrder()}
                style={{
                  borderWidth: 1,
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  alignItems: "center",
                }}
              >
                {orderSubmitting ? <ActivityIndicator /> : <Text>{t("orders.submit")}</Text>}
              </Pressable>

              {orderMessage ? <Text>{orderMessage}</Text> : null}
            </View>

            {latestOrder ? (
              <View style={{ backgroundColor: "white", borderRadius: 16, padding: 20, gap: 12 }}>
                <Text style={{ fontSize: 22, fontWeight: "600" }}>{t("orders.detailsTitle")}</Text>
                <Text>
                  {t("orders.orderNumber")}: {latestOrder.orderNumber ?? "-"}
                </Text>
                <Text>
                  {t("orders.statusCurrent")}: {latestOrder.statusCurrent ?? "-"}
                </Text>
                <Text>
                  {t("orders.zoneId")}: {latestOrder.zoneId ?? "-"}
                </Text>
                <Text>
                  {t("orders.hubId")}: {latestOrder.hubId ?? "-"}
                </Text>
                <Text>
                  {t("orders.bagTagCode")}: {latestOrder.bagTagCode ?? "-"}
                </Text>

                <Text style={{ fontSize: 18, fontWeight: "600", marginTop: 8 }}>
                  {t("orders.timelineTitle")}
                </Text>

                {timelineRefreshing ? <Text>{t("orders.refreshing")}</Text> : null}

                {timeline.length === 0 ? (
                  <Text>{t("orders.emptyTimeline")}</Text>
                ) : (
                  <View style={{ gap: 10 }}>
                    {timeline.map((event) => (
                      <View
                        key={event.id ?? `${event.eventType}-${event.occurredAt}`}
                        style={{ borderWidth: 1, borderRadius: 12, padding: 12, gap: 4 }}
                      >
                        <Text style={{ fontWeight: "600" }}>{event.eventType ?? "-"}</Text>
                        <Text>{event.occurredAt ?? "-"}</Text>
                        {event.notes ? <Text>{event.notes}</Text> : null}
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ) : null}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
