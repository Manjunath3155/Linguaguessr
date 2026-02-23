"use client";

import { useTranslation } from "@/lib/i18n";
import RoundSelector from "./RoundSelector";

interface Player {
  name: string;
  isHost: boolean;
}

interface RoomLobbyProps {
  roomCode: string;
  players: Player[];
  isHost: boolean;
  onStartGame: () => void;
  roundCount: number;
  onRoundCountChange: (count: number) => void;
}

export default function RoomLobby({
  roomCode,
  players,
  isHost,
  onStartGame,
  roundCount,
  onRoundCountChange,
}: RoomLobbyProps) {
  const { t } = useTranslation();

  const copyCode = () => {
    navigator.clipboard.writeText(roomCode);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Room code */}
      <div className="text-center">
        <p className="text-sm font-medium text-muted uppercase tracking-wider mb-2">
          {t("multiplayer.roomCode")}
        </p>
        <button
          onClick={copyCode}
          className="group flex items-center gap-2 rounded-xl border-2 border-dashed border-accent/50 px-6 py-3 transition-colors hover:border-accent hover:bg-accent/5"
        >
          <span className="text-4xl font-mono font-bold tracking-[0.3em] text-accent">
            {roomCode}
          </span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted group-hover:text-accent transition-colors">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        </button>
        <p className="mt-2 text-xs text-muted">{t("multiplayer.clickToCopy")} &middot; {t("multiplayer.shareWithFriends")}</p>
      </div>

      {/* Round selector — host can change, others see read-only */}
      <RoundSelector
        value={roundCount}
        onChange={onRoundCountChange}
        disabled={!isHost}
      />

      {/* Players list */}
      <div className="w-full max-w-sm rounded-2xl border border-border bg-surface/80 overflow-hidden">
        <div className="border-b border-border px-4 py-3">
          <h3 className="text-sm font-semibold text-muted uppercase tracking-wider">
            {t("multiplayer.players")} ({players.length})
          </h3>
        </div>
        <div className="divide-y divide-border/50">
          {players.map((player, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-accent/20 to-accent-secondary/20">
                  <span className="text-sm font-bold text-accent">
                    {player.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="font-medium">{player.name}</span>
              </div>
              {player.isHost && (
                <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
                  {t("multiplayer.host")}
                </span>
              )}
            </div>
          ))}
          {players.length < 2 && (
            <div className="flex items-center gap-3 px-4 py-3 text-muted/50">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-dashed border-border">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </div>
              <span className="text-sm">{t("multiplayer.waitingForPlayers")}</span>
            </div>
          )}
        </div>
      </div>

      {/* Start button (host only) */}
      {isHost && (
        <button
          onClick={onStartGame}
          disabled={players.length < 2}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent to-accent-secondary px-8 py-3 font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          {players.length < 2 ? t("multiplayer.needPlayers") : t("game.startGame")}
        </button>
      )}
      {!isHost && (
        <p className="text-sm text-muted">{t("multiplayer.waitingForHost")}</p>
      )}
    </div>
  );
}
