"use client";

import { useEffect, useState } from "react";

interface ScoreDisplayProps {
  score: number;
  maxScore?: number;
  label?: string;
  animate?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function ScoreDisplay({
  score,
  maxScore = 5000,
  label = "Score",
  animate = true,
  size = "md",
}: ScoreDisplayProps) {
  const [displayScore, setDisplayScore] = useState(animate ? 0 : score);

  useEffect(() => {
    if (!animate) {
      setDisplayScore(score);
      return;
    }

    setDisplayScore(0);
    const duration = 1000;
    const steps = 30;
    const increment = score / steps;
    let current = 0;
    let step = 0;

    const interval = setInterval(() => {
      step++;
      current = Math.min(Math.round(increment * step), score);
      setDisplayScore(current);
      if (step >= steps) {
        clearInterval(interval);
        setDisplayScore(score);
      }
    }, duration / steps);

    return () => clearInterval(interval);
  }, [score, animate]);

  const percentage = (displayScore / maxScore) * 100;

  const textSizes = {
    sm: "text-2xl",
    md: "text-4xl",
    lg: "text-6xl",
  };

  const barColors =
    percentage >= 80
      ? "from-green-400 to-emerald-500"
      : percentage >= 50
        ? "from-yellow-400 to-orange-500"
        : percentage >= 20
          ? "from-orange-400 to-red-500"
          : "from-red-400 to-red-600";

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-sm font-medium text-muted uppercase tracking-wider">{label}</p>
      <p className={`${textSizes[size]} font-extrabold tabular-nums animate-count-up`}>
        {displayScore.toLocaleString()}
      </p>
      <div className="h-2 w-full max-w-[200px] rounded-full bg-surface overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${barColors} transition-all duration-1000`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
