"use client";

import { useState, useEffect, useCallback } from "react";

interface TranslationToastProps {
  languageName: string;
  show: boolean;
  onDone: () => void;
}

export default function TranslationToast({ languageName, show, onDone }: TranslationToastProps) {
  const [visible, setVisible] = useState(false);

  const handleDone = useCallback(() => {
    setVisible(false);
    setTimeout(onDone, 300);
  }, [onDone]);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(handleDone, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, handleDone]);

  if (!show && !visible) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3 shadow-2xl transition-all duration-300 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      <svg
        data-lingo-skip
        className="h-4 w-4 animate-spin text-accent"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="10" strokeDasharray="60" strokeDashoffset="20" />
      </svg>
      <span data-lingo-skip className="text-sm font-medium text-foreground">
        Translating to {languageName}...
      </span>
    </div>
  );
}
