"use client";

import ScoreDisplay from "./ScoreDisplay";

interface RoundResultProps {
  languageName: string;
  country: string;
  distanceKm: number;
  score: number;
  funFact: string;
  onNext: () => void;
  isLastRound: boolean;
}

export default function RoundResult({
  languageName,
  country,
  distanceKm,
  score,
  funFact,
  onNext,
  isLastRound,
}: RoundResultProps) {
  const distanceFormatted =
    distanceKm < 1 ? "< 1 km" : `${Math.round(distanceKm).toLocaleString()} km`;

  return (
    <div className="flex flex-col items-center gap-6 rounded-2xl border border-border bg-surface/80 backdrop-blur-sm p-6 sm:p-8">
      {/* Language reveal */}
      <div className="text-center">
        <p className="text-sm font-medium text-muted uppercase tracking-wider mb-1">
          The language was
        </p>
        <h2 className="text-3xl font-bold gradient-text">{languageName}</h2>
        <p className="mt-1 text-muted flex items-center justify-center gap-1">
          <svg data-lingo-skip width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {country}
        </p>
      </div>

      {/* Score */}
      <ScoreDisplay score={score} animate />

      {/* Distance */}
      <div className="flex items-center gap-2 rounded-full bg-background/50 px-4 py-2 text-sm">
        <svg data-lingo-skip width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-400">
          <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" />
        </svg>
        <span className="text-muted">Your guess was</span>
        <span className="font-bold text-foreground">{distanceFormatted}</span>
        <span className="text-muted">away</span>
      </div>

      {/* Fun fact */}
      <div className="w-full max-w-md rounded-xl bg-accent/5 border border-accent/20 p-4">
        <div className="flex items-start gap-2">
          <svg data-lingo-skip width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0 text-accent">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
          </svg>
          <p className="text-sm text-muted leading-relaxed">{funFact}</p>
        </div>
      </div>

      {/* Next button */}
      <button
        onClick={onNext}
        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent to-accent-secondary px-6 py-3 font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:scale-105"
      >
        {isLastRound ? "See Final Score" : "Next Round"}
        <svg data-lingo-skip width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M5 12h14" />
          <path d="M12 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
