"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { generateRoomCode } from "@/lib/game";
import { useTranslation } from "@/lib/i18n";

export default function MultiplayerPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [joinCode, setJoinCode] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [mode, setMode] = useState<"menu" | "create" | "join">("menu");
  const [error, setError] = useState("");

  const handleCreateRoom = useCallback(() => {
    if (!playerName.trim()) {
      setError(t("errors.enterName"));
      return;
    }
    const code = generateRoomCode();
    // Store player info in sessionStorage for the room page
    sessionStorage.setItem(
      "linguaguessr_player",
      JSON.stringify({ name: playerName.trim(), isHost: true })
    );
    router.push(`/multiplayer/${code}`);
  }, [playerName, router, t]);

  const handleJoinRoom = useCallback(() => {
    if (!playerName.trim()) {
      setError(t("errors.enterName"));
      return;
    }
    if (joinCode.length !== 6) {
      setError(t("errors.invalidCode"));
      return;
    }
    sessionStorage.setItem(
      "linguaguessr_player",
      JSON.stringify({ name: playerName.trim(), isHost: false })
    );
    router.push(`/multiplayer/${joinCode.toUpperCase()}`);
  }, [playerName, joinCode, router, t]);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4">
      <div className="w-full max-w-md flex flex-col items-center gap-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">{t("multiplayer.title")}</h1>
          <p className="text-muted">
            {t("multiplayer.description")}
          </p>
        </div>

        {mode === "menu" && (
          <div className="w-full flex flex-col gap-4">
            <button
              onClick={() => setMode("create")}
              className="group flex items-center justify-center gap-3 rounded-xl border-2 border-accent/30 bg-accent/5 p-6 transition-all hover:border-accent hover:bg-accent/10"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/20">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-semibold text-lg">{t("multiplayer.createRoom")}</p>
                <p className="text-sm text-muted">{t("multiplayer.createRoomDesc")}</p>
              </div>
            </button>

            <button
              onClick={() => setMode("join")}
              className="group flex items-center justify-center gap-3 rounded-xl border-2 border-accent-secondary/30 bg-accent-secondary/5 p-6 transition-all hover:border-accent-secondary hover:bg-accent-secondary/10"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-secondary/20">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent-secondary">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-semibold text-lg">{t("multiplayer.joinRoom")}</p>
                <p className="text-sm text-muted">{t("multiplayer.joinRoomDesc")}</p>
              </div>
            </button>
          </div>
        )}

        {(mode === "create" || mode === "join") && (
          <div className="w-full flex flex-col gap-4">
            <button
              onClick={() => {
                setMode("menu");
                setError("");
              }}
              className="flex items-center gap-1 text-sm text-muted hover:text-foreground transition-colors self-start"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5" />
                <path d="M12 19l-7-7 7-7" />
              </svg>
              {t("multiplayer.back")}
            </button>

            <h2 className="text-2xl font-bold">
              {mode === "create" ? t("multiplayer.createRoom") : t("multiplayer.joinRoom")}
            </h2>

            <div>
              <label className="block text-sm font-medium text-muted mb-1.5">
                {t("multiplayer.yourName")}
              </label>
              <input
                type="text"
                placeholder={t("multiplayer.yourName")}
                value={playerName}
                onChange={(e) => {
                  setPlayerName(e.target.value);
                  setError("");
                }}
                maxLength={20}
                className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/50"
              />
            </div>

            {mode === "join" && (
              <div>
                <label className="block text-sm font-medium text-muted mb-1.5">
                  {t("multiplayer.roomCode")}
                </label>
                <input
                  type="text"
                  placeholder="e.g. ABC123"
                  value={joinCode}
                  onChange={(e) => {
                    setJoinCode(e.target.value.toUpperCase().slice(0, 6));
                    setError("");
                  }}
                  maxLength={6}
                  className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-foreground font-mono text-lg tracking-[0.2em] uppercase placeholder:text-muted/50 placeholder:tracking-normal placeholder:font-sans placeholder:text-base focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
              </div>
            )}

            {error && (
              <p className="text-sm text-red-400">{error}</p>
            )}

            <button
              onClick={mode === "create" ? handleCreateRoom : handleJoinRoom}
              className="w-full rounded-xl bg-gradient-to-r from-accent to-accent-secondary py-3 font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:scale-[1.02]"
            >
              {mode === "create" ? t("multiplayer.createAndStart") : t("multiplayer.joinRoom")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
