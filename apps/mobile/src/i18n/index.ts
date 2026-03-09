import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./en.json";
import sw from "./sw.json";

const STORAGE_KEY = "mimo-language";

const resources = {
  en: { translation: en },
  sw: { translation: sw },
} as const;

const languageDetector = {
  type: "languageDetector" as const,
  async: true,
  detect: async (callback: (lang: string) => void) => {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    callback(stored ?? "en");
  },
  init: () => {},
  cacheUserLanguage: async (lng: string) => {
    await AsyncStorage.setItem(STORAGE_KEY, lng);
  },
};

if (!i18n.isInitialized) {
  i18n
    .use(languageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: "en",
      supportedLngs: ["en", "sw"],
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
    });
}

export default i18n;
