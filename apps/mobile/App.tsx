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
    (async () => {
      const storedToken = await AsyncStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
      if (storedToken) {
        setAccessToken(storedToken);
        setMessage(t("home.tokenStored"));
      }
      await loadHealth();
    })();
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

  async function handleLogout() {
    await AsyncStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
    setAccessToken(null);
    setLoggedInUser(null);
    setMessage("");
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
          <View style={{ backgroundColor: "white", borderRadius: 16, padding: 20, gap: 12 }}>
            <Text style={{ fontSize: 22, fontWeight: "600" }}>{t("home.dashboardTitle")}</Text>
            <Text>
              {t("home.loggedInAs")}: {loggedInUser?.fullName ?? "-"} ({loggedInUser?.role ?? "-"})
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
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
