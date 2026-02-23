"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n";

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/5 blur-[100px]" />
        <div className="absolute right-1/4 top-2/3 h-[300px] w-[300px] rounded-full bg-accent-secondary/5 blur-[80px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Globe icon */}
        <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-accent/20 to-accent-secondary/20 globe-glow">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            <path d="M4.93 4.93l14.14 14.14" opacity="0.3" />
          </svg>
        </div>

        {/* Title */}
        <h1 className="mb-4 text-5xl font-extrabold tracking-tight sm:text-7xl">
          Lingua<span className="gradient-text">Guessr</span>
        </h1>

        {/* Subtitle */}
        <p className="mb-2 max-w-lg text-lg text-muted sm:text-xl">
          {t("home.heroSubtitle")}
        </p>
        <p className="mb-10 text-sm text-muted/60">
          {t("home.stats")} &middot; {t("game.maxPoints")}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <Link
            href="/play"
            className="group flex h-14 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent to-accent-secondary px-8 text-lg font-semibold text-white shadow-lg shadow-accent/25 transition-all hover:shadow-xl hover:shadow-accent/30 hover:scale-105"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="transition-transform group-hover:scale-110">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            {t("home.playSolo")}
          </Link>
          <Link
            href="/multiplayer"
            className="flex h-14 items-center justify-center gap-2 rounded-xl border-2 border-accent-secondary/50 px-8 text-lg font-semibold text-foreground transition-all hover:bg-accent-secondary/10 hover:border-accent-secondary hover:scale-105"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            {t("home.playMultiplayer")}
          </Link>
        </div>

        {/* How it works */}
        <div className="mt-20 grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-surface/50 p-6 text-center">
            <div className="mb-3 flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-accent/10">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent">
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
              </svg>
            </div>
            <h3 className="mb-1 font-semibold">{t("home.listen")}</h3>
            <p className="text-sm text-muted">{t("home.listenDesc")}</p>
          </div>
          <div className="rounded-xl border border-border bg-surface/50 p-6 text-center">
            <div className="mb-3 flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-accent-secondary/10">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent-secondary">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <h3 className="mb-1 font-semibold">{t("home.pin")}</h3>
            <p className="text-sm text-muted">{t("home.pinDesc")}</p>
          </div>
          <div className="rounded-xl border border-border bg-surface/50 p-6 text-center">
            <div className="mb-3 flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-green-500/10">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-400">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h3 className="mb-1 font-semibold">{t("home.score")}</h3>
            <p className="text-sm text-muted">{t("home.scoreDesc")}</p>
          </div>
        </div>

        {/* Footer badge */}
        <div className="mt-16 flex items-center gap-2 rounded-full border border-border bg-surface/50 px-4 py-2 text-xs text-muted">
          <span>{t("home.builtWith")}</span>
          <span className="font-semibold text-accent">Lingo.dev</span>
          <span>&middot;</span>
          <span>{t("home.translatedInto")}</span>
        </div>
      </div>
    </div>
  );
}
