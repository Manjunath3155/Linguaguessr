"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import enMessages from "@/locales/en.json";

type Messages = Record<string, unknown>;

const SUPPORTED_LOCALES = ["en", "es", "fr", "de", "ja", "hi", "ar", "pt"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

const RTL_LOCALES: Locale[] = ["ar"];

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType>({
  locale: "en",
  setLocale: () => {},
  t: (key: string) => key,
});

function getNestedValue(obj: Messages, path: string): string | undefined {
  const keys = path.split(".");
  let current: unknown = obj;
  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== "object") {
      return undefined;
    }
    current = (current as Record<string, unknown>)[key];
  }
  return typeof current === "string" ? current : undefined;
}

const localeLoaders: Record<string, () => Promise<Messages>> = {
  es: () => import("@/locales/es.json").then((m) => m.default),
  fr: () => import("@/locales/fr.json").then((m) => m.default),
  de: () => import("@/locales/de.json").then((m) => m.default),
  ja: () => import("@/locales/ja.json").then((m) => m.default),
  hi: () => import("@/locales/hi.json").then((m) => m.default),
  ar: () => import("@/locales/ar.json").then((m) => m.default),
  pt: () => import("@/locales/pt.json").then((m) => m.default),
};

function getInitialLocale(): Locale {
  if (typeof window === "undefined") return "en";
  const stored = localStorage.getItem("linguaguessr_locale");
  if (stored && SUPPORTED_LOCALES.includes(stored as Locale)) {
    return stored as Locale;
  }
  return "en";
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [messages, setMessages] = useState<Messages>(enMessages as Messages);

  // Load initial locale from localStorage on mount
  useEffect(() => {
    const initial = getInitialLocale();
    if (initial !== "en") {
      setLocaleState(initial);
      localeLoaders[initial]?.().then((m) => setMessages(m));
    }
    // Set document attributes
    document.documentElement.lang = initial;
    document.documentElement.dir = RTL_LOCALES.includes(initial) ? "rtl" : "ltr";
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("linguaguessr_locale", newLocale);
    document.documentElement.lang = newLocale;
    document.documentElement.dir = RTL_LOCALES.includes(newLocale) ? "rtl" : "ltr";

    if (newLocale === "en") {
      setMessages(enMessages as Messages);
    } else {
      localeLoaders[newLocale]?.().then((m) => setMessages(m));
    }
  }, []);

  const t = useCallback(
    (key: string): string => {
      return getNestedValue(messages, key) ?? getNestedValue(enMessages as Messages, key) ?? key;
    },
    [messages]
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  return useContext(I18nContext);
}
