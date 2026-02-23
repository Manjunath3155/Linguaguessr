"use client";

import { useState, useRef, useEffect } from "react";
import { useLingoContext } from "@lingo.dev/compiler/react";
import TranslationToast from "./TranslationToast";

const UI_LANGUAGES: { code: string; name: string; flag: string }[] = [
  { code: "en", name: "English", flag: "EN" },
  { code: "es", name: "Espanol", flag: "ES" },
  { code: "fr", name: "Francais", flag: "FR" },
  { code: "de", name: "Deutsch", flag: "DE" },
  { code: "ja", name: "Japanese", flag: "JA" },
  { code: "hi", name: "Hindi", flag: "HI" },
  { code: "ar", name: "Arabic", flag: "AR" },
  { code: "pt", name: "Portugues", flag: "PT" },
];

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [toastLang, setToastLang] = useState("");
  const [showToast, setShowToast] = useState(false);
  const { locale, setLocale } = useLingoContext();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = UI_LANGUAGES.find((l) => l.code === locale) || UI_LANGUAGES[0];

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-hover"
      >
        <svg data-lingo-skip width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        {selected.flag}
        <svg data-lingo-skip width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transition-transform ${isOpen ? "rotate-180" : ""}`}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 rounded-xl border border-border bg-surface shadow-2xl">
          {UI_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                if (lang.code !== locale && lang.code !== "en") {
                  setToastLang(lang.name);
                  setShowToast(true);
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                setLocale(lang.code as any);
                setIsOpen(false);
              }}
              className={`flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm transition-colors first:rounded-t-xl last:rounded-b-xl ${
                locale === lang.code
                  ? "bg-accent/10 text-accent"
                  : "text-foreground hover:bg-surface-hover"
              }`}
            >
              <span className="w-7 text-xs font-bold text-muted">{lang.flag}</span>
              {lang.name}
            </button>
          ))}
        </div>
      )}
      <TranslationToast
        languageName={toastLang}
        show={showToast}
        onDone={() => setShowToast(false)}
      />
    </div>
  );
}
