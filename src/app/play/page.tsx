"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import AudioPlayer from "@/components/AudioPlayer";
import RoundResult from "@/components/RoundResult";
import ScoreDisplay from "@/components/ScoreDisplay";
import RoundSelector from "@/components/RoundSelector";
import { createNewGame, GameState, DEFAULT_ROUNDS } from "@/lib/game";
import { haversineDistance, calculateScore } from "@/lib/geo";
import Link from "next/link";

const GameMap = dynamic(() => import("@/components/GameMap"), { ssr: false });

type GamePhase = "ready" | "playing" | "result" | "finished";

export default function PlayPage() {
  const [game, setGame] = useState<GameState | null>(null);
  const [phase, setPhase] = useState<GamePhase>("ready");
  const [guessPin, setGuessPin] = useState<{ lat: number; lng: number } | null>(null);
  const [playerName, setPlayerName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [roundCount, setRoundCount] = useState(DEFAULT_ROUNDS);

  const startGame = useCallback(() => {
    setGame(createNewGame(roundCount));
    setPhase("playing");
    setGuessPin(null);
    setSubmitted(false);
  }, [roundCount]);

  const handlePinPlaced = useCallback((lat: number, lng: number) => {
    setGuessPin({ lat, lng });
  }, []);

  const handleSubmitGuess = useCallback(() => {
    if (!game || !guessPin) return;

    const round = game.rounds[game.currentRound];
    const distance = haversineDistance(
      guessPin.lat,
      guessPin.lng,
      round.language.correctLat,
      round.language.correctLng
    );
    const score = calculateScore(distance);

    setGame((prev) => {
      if (!prev) return prev;
      const updatedRounds = [...prev.rounds];
      updatedRounds[prev.currentRound] = {
        ...updatedRounds[prev.currentRound],
        guessLat: guessPin.lat,
        guessLng: guessPin.lng,
        distanceKm: distance,
        score,
        submitted: true,
      };
      return {
        ...prev,
        rounds: updatedRounds,
        totalScore: prev.totalScore + score,
      };
    });
    setPhase("result");
  }, [game, guessPin]);

  const handleNextRound = useCallback(() => {
    if (!game) return;
    const nextRound = game.currentRound + 1;
    if (nextRound >= game.rounds.length) {
      setPhase("finished");
      setGame((prev) => (prev ? { ...prev, isFinished: true } : prev));
    } else {
      setGame((prev) => (prev ? { ...prev, currentRound: nextRound } : prev));
      setGuessPin(null);
      setPhase("playing");
    }
  }, [game]);

  const handleSubmitScore = useCallback(async () => {
    if (!game || !playerName.trim()) return;
    try {
      await fetch("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerName: playerName.trim(),
          totalScore: game.totalScore,
          roundsPlayed: game.rounds.length,
        }),
      });
      setSubmitted(true);
    } catch {
      // Silently fail — leaderboard is optional
      setSubmitted(true);
    }
  }, [game, playerName]);

  // Ready screen
  if (phase === "ready" || !game) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-accent/20 to-accent-secondary/20">
            <svg data-lingo-skip width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold">Solo Mode</h1>
          <p className="max-w-md text-muted">
            Listen to audio clips of different languages. Pin each one on the world map. The closer your guess, the more points you earn!
          </p>
          <RoundSelector value={roundCount} onChange={setRoundCount} />
          <div className="flex items-center gap-4 text-sm text-muted">
            <span>{roundCount} rounds</span>
            <span className="text-border">|</span>
            <span>Max 5,000 pts/round</span>
            <span className="text-border">|</span>
            <span>Max {(roundCount * 5000).toLocaleString()} total</span>
          </div>
          <button
            onClick={startGame}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent to-accent-secondary px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-accent/25 transition-all hover:shadow-xl hover:scale-105"
          >
            <svg data-lingo-skip width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            Start Game
          </button>
        </div>
      </div>
    );
  }

  const currentRound = game.rounds[game.currentRound];
  const totalRounds = game.rounds.length;

  // Finished screen
  if (phase === "finished") {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-xl flex flex-col items-center gap-8">
          <h1 className="text-4xl font-bold">Game Over!</h1>
          <ScoreDisplay
            score={game.totalScore}
            maxScore={totalRounds * 5000}
            label="Final Score"
            size="lg"
            animate
          />

          {/* Per-round breakdown */}
          <div className="w-full rounded-2xl border border-border bg-surface/80 overflow-hidden">
            <div className="border-b border-border px-4 py-3">
              <h3 className="text-sm font-semibold text-muted uppercase tracking-wider">
                Round Breakdown
              </h3>
            </div>
            {game.rounds.map((round, i) => (
              <div
                key={i}
                className={`flex items-center justify-between px-4 py-3 ${
                  i < game.rounds.length - 1 ? "border-b border-border/50" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-surface text-xs font-bold text-muted">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-medium">{round.language.name}</p>
                    <p className="text-xs text-muted">{round.language.country}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold tabular-nums">
                    {round.score?.toLocaleString() ?? 0}
                  </p>
                  <p className="text-xs text-muted">
                    {round.distanceKm
                      ? round.distanceKm < 1
                        ? "< 1 km"
                        : `${Math.round(round.distanceKm).toLocaleString()} km`
                      : "-"}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Submit score */}
          {!submitted ? (
            <div className="w-full flex flex-col items-center gap-3">
              <p className="text-sm text-muted">Submit your score to the leaderboard</p>
              <div className="flex w-full max-w-sm gap-2">
                <input
                  type="text"
                  placeholder="Your name"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  maxLength={20}
                  className="flex-1 rounded-lg border border-border bg-surface px-4 py-2 text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
                <button
                  onClick={handleSubmitScore}
                  disabled={!playerName.trim()}
                  className="rounded-lg bg-accent px-4 py-2 font-medium text-white transition-colors hover:bg-accent/80 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-green-400">Score submitted!</p>
          )}

          {/* Action buttons */}
          <div className="flex gap-4">
            <button
              onClick={startGame}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent to-accent-secondary px-6 py-3 font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:scale-105"
            >
              Play Again
            </button>
            <Link
              href="/leaderboard"
              className="flex items-center gap-2 rounded-xl border border-border px-6 py-3 font-semibold text-foreground transition-colors hover:bg-surface"
            >
              Leaderboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Playing & result screen
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col lg:flex-row">
      {/* Left panel */}
      <div className="flex flex-col items-center gap-4 p-4 sm:p-6 lg:w-[380px] lg:shrink-0 lg:border-r lg:border-border">
        {/* Round indicator */}
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted">Round</span>
            <div className="flex gap-1">
              {Array.from({ length: totalRounds }).map((_, i) => (
                <div
                  key={i}
                  className={`h-2 rounded-full transition-colors ${
                    totalRounds > 10 ? "w-4" : "w-8"
                  } ${
                    i < game.currentRound
                      ? "bg-green-500"
                      : i === game.currentRound
                        ? "bg-accent"
                        : "bg-surface"
                  }`}
                />
              ))}
            </div>
          </div>
          <span className="text-sm font-bold tabular-nums">
            {game.currentRound + 1}/{totalRounds}
          </span>
        </div>

        {/* Total score */}
        <div className="w-full rounded-xl border border-border bg-surface/50 p-3 text-center">
          <p className="text-xs text-muted uppercase tracking-wider">Total Score</p>
          <p className="text-2xl font-bold tabular-nums">{game.totalScore.toLocaleString()}</p>
        </div>

        {/* Audio player or result */}
        {phase === "playing" ? (
          <>
            <div className="flex flex-col items-center gap-2 py-4">
              <p className="text-sm text-muted">What language is this?</p>
              <AudioPlayer
                languageId={currentRound.language.id}
                audioUrl={currentRound.language.audioUrl}
              />
            </div>
            {guessPin ? (
              <button
                onClick={handleSubmitGuess}
                className="w-full rounded-xl bg-gradient-to-r from-accent to-accent-secondary py-3 font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:scale-[1.02]"
              >
                Submit Guess
              </button>
            ) : (
              <p className="text-sm text-muted/60 text-center">
                Click on the map to place your pin
              </p>
            )}
          </>
        ) : (
          <RoundResult
            languageName={currentRound.language.name}
            country={currentRound.language.country}
            distanceKm={currentRound.distanceKm ?? 0}
            score={currentRound.score ?? 0}
            funFact={currentRound.language.funFact}
            onNext={handleNextRound}
            isLastRound={game.currentRound === totalRounds - 1}
          />
        )}
      </div>

      {/* Map */}
      <div className="relative flex-1 p-2 sm:p-4 min-h-[400px] lg:h-[calc(100vh-4rem)]">
        <GameMap
          onPinPlaced={handlePinPlaced}
          guessPin={guessPin}
          correctPin={
            phase === "result"
              ? { lat: currentRound.language.correctLat, lng: currentRound.language.correctLng }
              : null
          }
          showResult={phase === "result"}
          disabled={phase === "result"}
        />
      </div>
    </div>
  );
}
