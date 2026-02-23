"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-accent-secondary">
            <svg data-lingo-skip width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight">
            Lingua<span className="text-accent">Guessr</span>
          </span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-4">
          <Link
            href="/play"
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              pathname === "/play"
                ? "bg-surface text-accent"
                : "text-muted hover:text-foreground"
            }`}
          >
            Play
          </Link>
          <Link
            href="/multiplayer"
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              pathname?.startsWith("/multiplayer")
                ? "bg-surface text-accent"
                : "text-muted hover:text-foreground"
            }`}
          >
            Multiplayer
          </Link>
          <Link
            href="/leaderboard"
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              pathname === "/leaderboard"
                ? "bg-surface text-accent"
                : "text-muted hover:text-foreground"
            }`}
          >
            Leaderboard
          </Link>
          <div className="ml-2 hidden sm:block">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </nav>
  );
}
