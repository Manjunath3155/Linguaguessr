"use client";

import { MIN_ROUNDS, MAX_ROUNDS } from "@/lib/game";

interface RoundSelectorProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export default function RoundSelector({ value, onChange, disabled }: RoundSelectorProps) {
  return (
    <div className="w-full max-w-sm">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-muted">
          Rounds
        </label>
        <span className="text-sm font-bold text-accent tabular-nums">{value}</span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={MIN_ROUNDS}
          max={MAX_ROUNDS}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          disabled={disabled}
          className="w-full h-2 rounded-full appearance-none cursor-pointer bg-surface border border-border accent-accent disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <div className="flex justify-between mt-1">
          <span className="text-xs text-muted">{MIN_ROUNDS}</span>
          <span className="text-xs text-muted">{MAX_ROUNDS}</span>
        </div>
      </div>
    </div>
  );
}
