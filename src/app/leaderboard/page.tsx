"use client";

import { useEffect, useState } from "react";
import Leaderboard from "@/components/Leaderboard";
import { useTranslation } from "@/lib/i18n";
import Link from "next/link";

interface LeaderboardEntry {
  id: string;
  player_name: string;
  total_score: number;
  rounds_played: number;
  created_at: string;
}

export default function LeaderboardPage() {
  const { t } = useTranslation();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchScores() {
      try {
        const res = await fetch("/api/score");
        if (res.ok) {
          const data = await res.json();
          setEntries(data.scores || []);
        }
      } catch {
        // Use empty leaderboard on error
      } finally {
        setLoading(false);
      }
    }
    fetchScores();
  }, []);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("leaderboard.title")}</h1>
          <p className="mt-1 text-sm text-muted">{t("leaderboard.subtitle")}</p>
        </div>
        <Link
          href="/play"
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent to-accent-secondary px-4 py-2 text-sm font-semibold text-white shadow transition-all hover:shadow-lg hover:scale-105"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          {t("leaderboard.playNow")}
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex items-center gap-2 text-muted">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" strokeDasharray="60" strokeDashoffset="20" />
            </svg>
            {t("leaderboard.loadingScores")}
          </div>
        </div>
      ) : (
        <Leaderboard entries={entries} />
      )}
    </div>
  );
}
