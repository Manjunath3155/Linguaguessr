"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import AudioPlayer from "@/components/AudioPlayer";
import RoundResult from "@/components/RoundResult";
import ScoreDisplay from "@/components/ScoreDisplay";
import RoomLobby from "@/components/RoomLobby";
import { selectRandomLanguages, DEFAULT_ROUNDS } from "@/lib/game";
import { haversineDistance, calculateScore } from "@/lib/geo";
import { useTranslation } from "@/lib/i18n";
import type { LanguageData } from "@/lib/audio-data";
import Link from "next/link";

const GameMap = dynamic(() => import("@/components/GameMap"), { ssr: false });

interface PlayerInfo {
  name: string;
  isHost: boolean;
}

interface PlayerScore {
  name: string;
  scores: number[];
  totalScore: number;
}

type RoomPhase = "lobby" | "playing" | "result" | "finished";

export default function MultiplayerRoomPage() {
  const params = useParams();
  const roomCode = (params.code as string) || "";
  const { t } = useTranslation();

  const [player, setPlayer] = useState<PlayerInfo | null>(null);
  const [players, setPlayers] = useState<PlayerInfo[]>([]);
  const [phase, setPhase] = useState<RoomPhase>("lobby");
  const [languages, setLanguages] = useState<LanguageData[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [guessPin, setGuessPin] = useState<{ lat: number; lng: number } | null>(null);
  const [roundScores, setRoundScores] = useState<number[]>([]);
  const [allPlayerScores, setAllPlayerScores] = useState<PlayerScore[]>([]);
  const [roundCount, setRoundCount] = useState(DEFAULT_ROUNDS);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const channelRef = useRef<any>(null);

  // Load player info from session
  useEffect(() => {
    const stored = sessionStorage.getItem("linguaguessr_player");
    if (stored) {
      const p = JSON.parse(stored) as PlayerInfo;
      setPlayer(p);
      setPlayers([p]);
    } else {
      // Default player if no session data
      setPlayer({ name: "Player", isHost: true });
      setPlayers([{ name: "Player", isHost: true }]);
    }
  }, []);

  // Try to set up Supabase Realtime channel
  useEffect(() => {
    if (!player || !roomCode) return;

    async function setupChannel() {
      try {
        if (
          !process.env.NEXT_PUBLIC_SUPABASE_URL ||
          !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
          process.env.NEXT_PUBLIC_SUPABASE_URL === "your_supabase_url_here"
        ) {
          return; // No Supabase — run in local-only mode
        }

        const { createClient } = await import("@supabase/supabase-js");
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const channel = supabase.channel(`room:${roomCode}`, {
          config: { presence: { key: player!.name } },
        });

        channel
          .on("presence", { event: "sync" }, () => {
            const state = channel.presenceState();
            const playerList: PlayerInfo[] = Object.values(state).flatMap(
              (presences) =>
                (presences as unknown as { name: string; isHost: boolean }[]).map((p) => ({
                  name: p.name,
                  isHost: p.isHost,
                }))
            );
            setPlayers(playerList);
          })
          .on("broadcast", { event: "game_start" }, ({ payload }) => {
            setLanguages(payload.languages);
            setCurrentRound(0);
            setRoundScores([]);
            setPhase("playing");
          })
          .on("broadcast", { event: "guess_submitted" }, ({ payload }) => {
            setAllPlayerScores((prev) => {
              const existing = prev.find((p) => p.name === payload.playerName);
              if (existing) {
                return prev.map((p) =>
                  p.name === payload.playerName
                    ? {
                        ...p,
                        scores: [...p.scores, payload.score],
                        totalScore: p.totalScore + payload.score,
                      }
                    : p
                );
              }
              return [
                ...prev,
                {
                  name: payload.playerName,
                  scores: [payload.score],
                  totalScore: payload.score,
                },
              ];
            });
          })
          .on("broadcast", { event: "next_round" }, ({ payload }) => {
            setCurrentRound(payload.round);
            setGuessPin(null);
            setPhase("playing");
          })
          .on("broadcast", { event: "game_finished" }, () => {
            setPhase("finished");
          })
          .subscribe(async (status) => {
            if (status === "SUBSCRIBED") {
              await channel.track({
                name: player!.name,
                isHost: player!.isHost,
              });
            }
          });

        channelRef.current = channel;
      } catch {
        // Supabase not available, continue in local mode
      }
    }

    setupChannel();

    return () => {
      if (channelRef.current) {
        channelRef.current.unsubscribe();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player?.name, roomCode]);

  const handleStartGame = useCallback(() => {
    const selected = selectRandomLanguages(roundCount);
    setLanguages(selected);
    setCurrentRound(0);
    setRoundScores([]);
    setAllPlayerScores([]);
    setPhase("playing");

    // Broadcast to other players if channel exists
    if (channelRef.current) {
      channelRef.current.send({
        type: "broadcast",
        event: "game_start",
        payload: { languages: selected, roundCount },
      });
    }
  }, [roundCount]);

  const handlePinPlaced = useCallback((lat: number, lng: number) => {
    setGuessPin({ lat, lng });
  }, []);

  const handleSubmitGuess = useCallback(() => {
    if (!guessPin || !languages[currentRound]) return;

    const lang = languages[currentRound];
    const distance = haversineDistance(
      guessPin.lat,
      guessPin.lng,
      lang.correctLat,
      lang.correctLng
    );
    const score = calculateScore(distance);
    const newScores = [...roundScores, score];
    setRoundScores(newScores);

    // Update own scores in allPlayerScores
    setAllPlayerScores((prev) => {
      const myName = player?.name || "Player";
      const existing = prev.find((p) => p.name === myName);
      if (existing) {
        return prev.map((p) =>
          p.name === myName
            ? {
                ...p,
                scores: [...p.scores, score],
                totalScore: p.totalScore + score,
              }
            : p
        );
      }
      return [...prev, { name: myName, scores: [score], totalScore: score }];
    });

    // Broadcast guess to other players
    if (channelRef.current) {
      channelRef.current.send({
        type: "broadcast",
        event: "guess_submitted",
        payload: {
          playerName: player?.name || "Player",
          round: currentRound,
          score,
          lat: guessPin.lat,
          lng: guessPin.lng,
        },
      });
    }

    setPhase("result");
  }, [guessPin, languages, currentRound, roundScores, player]);

  const handleNextRound = useCallback(() => {
    const nextRound = currentRound + 1;
    if (nextRound >= languages.length) {
      setPhase("finished");
      if (channelRef.current) {
        channelRef.current.send({
          type: "broadcast",
          event: "game_finished",
          payload: {},
        });
      }
    } else {
      setCurrentRound(nextRound);
      setGuessPin(null);
      setPhase("playing");
      if (channelRef.current) {
        channelRef.current.send({
          type: "broadcast",
          event: "next_round",
          payload: { round: nextRound },
        });
      }
    }
  }, [currentRound, languages.length]);

  if (!player) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <p className="text-muted">{t("errors.loadingMap")}</p>
      </div>
    );
  }

  const totalScore = roundScores.reduce((a, b) => a + b, 0);
  const totalRounds = languages.length;

  // Lobby
  if (phase === "lobby") {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-8">
        <RoomLobby
          roomCode={roomCode}
          players={players}
          isHost={player.isHost}
          onStartGame={handleStartGame}
          roundCount={roundCount}
          onRoundCountChange={setRoundCount}
        />
      </div>
    );
  }

  // Finished
  if (phase === "finished") {
    const sortedPlayers = [...allPlayerScores].sort(
      (a, b) => b.totalScore - a.totalScore
    );

    return (
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-xl flex flex-col items-center gap-8">
          <h1 className="text-4xl font-bold">{t("game.gameOver")}</h1>

          <ScoreDisplay
            score={totalScore}
            maxScore={totalRounds * 5000}
            label={t("multiplayer.yourScore")}
            size="lg"
            animate
          />

          {/* Player rankings */}
          <div className="w-full rounded-2xl border border-border bg-surface/80 overflow-hidden">
            <div className="border-b border-border px-4 py-3">
              <h3 className="text-sm font-semibold text-muted uppercase tracking-wider">
                {t("multiplayer.finalRankings")}
              </h3>
            </div>
            {sortedPlayers.map((p, i) => (
              <div
                key={p.name}
                className={`flex items-center justify-between px-4 py-3 ${
                  i < sortedPlayers.length - 1 ? "border-b border-border/50" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                      i === 0
                        ? "bg-yellow-500/20 text-yellow-400"
                        : i === 1
                          ? "bg-gray-400/20 text-gray-300"
                          : "bg-surface text-muted"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className={`font-medium ${p.name === player.name ? "text-accent" : ""}`}>
                    {p.name}
                    {p.name === player.name && " (You)"}
                  </span>
                </div>
                <span className="font-bold tabular-nums text-lg">
                  {p.totalScore.toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <Link
              href="/multiplayer"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent to-accent-secondary px-6 py-3 font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:scale-105"
            >
              {t("game.playAgain")}
            </Link>
            <Link
              href="/"
              className="flex items-center gap-2 rounded-xl border border-border px-6 py-3 font-semibold text-foreground transition-colors hover:bg-surface"
            >
              {t("multiplayer.home")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Playing & result
  const currentLang = languages[currentRound];
  if (!currentLang) return null;

  const currentDistance =
    phase === "result" && guessPin
      ? haversineDistance(guessPin.lat, guessPin.lng, currentLang.correctLat, currentLang.correctLng)
      : 0;

  const currentScore =
    phase === "result" ? roundScores[roundScores.length - 1] || 0 : 0;

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col lg:flex-row">
      {/* Left panel */}
      <div className="flex flex-col items-center gap-4 p-4 sm:p-6 lg:w-[380px] lg:shrink-0 lg:border-r lg:border-border">
        {/* Round indicator */}
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
              {roomCode}
            </span>
            <div className="flex gap-1">
              {Array.from({ length: totalRounds }).map((_, i) => (
                <div
                  key={i}
                  className={`h-2 rounded-full transition-colors ${
                    totalRounds > 10 ? "w-4" : "w-8"
                  } ${
                    i < currentRound
                      ? "bg-green-500"
                      : i === currentRound
                        ? "bg-accent"
                        : "bg-surface"
                  }`}
                />
              ))}
            </div>
          </div>
          <span className="text-sm font-bold tabular-nums">
            {currentRound + 1}/{totalRounds}
          </span>
        </div>

        {/* Score */}
        <div className="w-full rounded-xl border border-border bg-surface/50 p-3 text-center">
          <p className="text-xs text-muted uppercase tracking-wider">{t("multiplayer.yourScore")}</p>
          <p className="text-2xl font-bold tabular-nums">{totalScore.toLocaleString()}</p>
        </div>

        {phase === "playing" ? (
          <>
            <div className="flex flex-col items-center gap-2 py-4">
              <p className="text-sm text-muted">{t("game.whatLanguage")}</p>
              <AudioPlayer
                languageId={currentLang.id}
                audioUrl={currentLang.audioUrl}
              />
            </div>
            {guessPin ? (
              <button
                onClick={handleSubmitGuess}
                className="w-full rounded-xl bg-gradient-to-r from-accent to-accent-secondary py-3 font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:scale-[1.02]"
              >
                {t("game.submitGuess")}
              </button>
            ) : (
              <p className="text-sm text-muted/60 text-center">
                {t("game.clickToPin")}
              </p>
            )}
          </>
        ) : (
          <RoundResult
            languageName={currentLang.name}
            country={currentLang.country}
            distanceKm={currentDistance}
            score={currentScore}
            funFact={currentLang.funFact}
            onNext={handleNextRound}
            isLastRound={currentRound === totalRounds - 1}
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
              ? { lat: currentLang.correctLat, lng: currentLang.correctLng }
              : null
          }
          showResult={phase === "result"}
          disabled={phase === "result"}
        />
      </div>
    </div>
  );
}
