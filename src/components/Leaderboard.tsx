"use client";

import { useTranslation } from "@/lib/i18n";

interface LeaderboardEntry {
  id: string;
  player_name: string;
  total_score: number;
  rounds_played: number;
  created_at: string;
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
}

export default function Leaderboard({ entries }: LeaderboardProps) {
  const { t } = useTranslation();

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-surface/50 p-8 text-center">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted/50">
          <path d="M8 21h8M12 17v4M7 4h10l-1.2 5.3a4 4 0 0 1-7.6 0L7 4z" />
          <path d="M5 4h14" />
        </svg>
        <p className="text-muted">{t("leaderboard.noScores")}</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface/80">
      <div className="border-b border-border px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted">
          <span>{t("leaderboard.player")}</span>
          <span>{t("leaderboard.score")}</span>
        </div>
      </div>
      <div className="divide-y divide-border/50">
        {entries.map((entry, index) => (
          <div
            key={entry.id}
            className={`flex items-center justify-between px-4 py-3 sm:px-6 transition-colors hover:bg-surface-hover ${
              index < 3 ? "bg-accent/5" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                  index === 0
                    ? "bg-yellow-500/20 text-yellow-400"
                    : index === 1
                      ? "bg-gray-400/20 text-gray-300"
                      : index === 2
                        ? "bg-orange-500/20 text-orange-400"
                        : "bg-surface text-muted"
                }`}
              >
                {index + 1}
              </span>
              <span className="font-medium">{entry.player_name}</span>
            </div>
            <div className="text-right">
              <span className="font-bold tabular-nums text-lg">
                {entry.total_score.toLocaleString()}
              </span>
              <span className="ml-2 text-xs text-muted">
                / {(entry.rounds_played * 5000).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
