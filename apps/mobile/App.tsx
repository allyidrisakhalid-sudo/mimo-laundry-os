import React from "react";
import { Pressable, SafeAreaView, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import "./src/i18n";
import { formatDateTime, formatMoneyTzs, formatPhoneTz } from "@mimo/types";

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
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "sw" ? "sw" : "en";
  const demoDate = new Date("2026-01-29T14:30:00");

  return (
    <SafeAreaView style={{ flex: 1, padding: 24 }}>
      <Text style={{ fontSize: 28, fontWeight: "700", marginBottom: 16 }}>{t("auth.welcome")}</Text>

      <LanguageButtons />

      <View style={{ marginBottom: 24 }}>
        <Text style={{ fontSize: 22, fontWeight: "600" }}>{t("auth.login.title")}</Text>
        <Text style={{ marginTop: 8 }}>{t("auth.login.subtitle")}</Text>
        <Text style={{ marginTop: 8 }}>{t("auth.login.submit")}</Text>
      </View>

      <View style={{ marginBottom: 24 }}>
        <Text style={{ fontSize: 22, fontWeight: "600" }}>{t("home.title")}</Text>
        <Text style={{ marginTop: 8 }}>{t("home.subtitle")}</Text>
      </View>

      <View style={{ marginBottom: 24 }}>
        <Text style={{ fontSize: 22, fontWeight: "600" }}>{t("settings.title")}</Text>
        <Text style={{ marginTop: 8 }}>{t("settings.language")}</Text>
      </View>

      <View>
        <Text style={{ fontSize: 22, fontWeight: "600", marginBottom: 8 }}>
          {t("formatting.title")}
        </Text>
        <Text>
          {t("formatting.money")}: {formatMoneyTzs(45000, locale)}
        </Text>
        <Text style={{ marginTop: 8 }}>
          {t("formatting.date")}: {formatDateTime(demoDate, locale)}
        </Text>
        <Text style={{ marginTop: 8 }}>
          {t("formatting.phone")}: {formatPhoneTz("0712345678")}
        </Text>
      </View>
    </SafeAreaView>
  );
}
