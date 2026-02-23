"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { samplePhrases } from "@/lib/generate-audio";
import { useTranslation } from "@/lib/i18n";

interface AudioPlayerProps {
  languageId: string;
  audioUrl: string;
  disabled?: boolean;
}

export default function AudioPlayer({ languageId, audioUrl, disabled }: AudioPlayerProps) {
  const { t } = useTranslation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [useWebSpeech, setUseWebSpeech] = useState(false);
  const [showTextFallback, setShowTextFallback] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Reset when language changes
  useEffect(() => {
    setIsPlaying(false);
    setHasPlayed(false);
    setShowTextFallback(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    window.speechSynthesis?.cancel();
  }, [languageId]);

  const playWithWebSpeech = useCallback(() => {
    const phrase = samplePhrases[languageId];
    if (!phrase) {
      setShowTextFallback(true);
      setHasPlayed(true);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(phrase.text);
    utterance.lang = phrase.lang;
    utterance.rate = 0.9;
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => {
      setIsPlaying(false);
      setHasPlayed(true);
    };
    utterance.onerror = () => {
      setIsPlaying(false);
      setHasPlayed(true);
      setShowTextFallback(true);
    };
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [languageId]);

  const handlePlay = useCallback(() => {
    if (disabled) return;

    if (isPlaying) {
      // Stop
      if (useWebSpeech) {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
      } else if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlaying(false);
      }
      return;
    }

    // Try MP3 first, fall back to Web Speech API
    if (!useWebSpeech && audioUrl && !audioUrl.startsWith("/audio/")) {
      if (!audioRef.current) {
        audioRef.current = new Audio(audioUrl);
        audioRef.current.onerror = () => {
          setUseWebSpeech(true);
          playWithWebSpeech();
        };
        audioRef.current.onplay = () => setIsPlaying(true);
        audioRef.current.onended = () => {
          setIsPlaying(false);
          setHasPlayed(true);
        };
      }
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {
        setUseWebSpeech(true);
        playWithWebSpeech();
      });
    } else {
      setUseWebSpeech(true);
      playWithWebSpeech();
    }
  }, [disabled, isPlaying, useWebSpeech, audioUrl, playWithWebSpeech]);

  const phrase = samplePhrases[languageId];

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onClick={handlePlay}
        disabled={disabled}
        className={`relative flex h-20 w-20 items-center justify-center rounded-full transition-all ${
          isPlaying
            ? "bg-gradient-to-br from-accent to-accent-secondary scale-110"
            : "bg-gradient-to-br from-accent/80 to-accent-secondary/80 hover:scale-105 hover:shadow-lg hover:shadow-accent/20"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        {isPlaying && (
          <div className="absolute inset-0 rounded-full bg-accent/30 animate-pulse-ring" />
        )}
        {isPlaying ? (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        )}
      </button>
      <p className="text-sm text-muted">
        {isPlaying ? t("game.playing") : hasPlayed ? t("game.clickToReplay") : t("game.clickToListen")}
      </p>
      {showTextFallback && phrase && (
        <div className="w-full max-w-xs rounded-lg border border-accent/20 bg-accent/5 p-3 text-center">
          <p className="text-xs text-muted mb-1">{t("game.audioUnavailable")}</p>
          <p className="text-sm font-medium text-foreground italic">&ldquo;{phrase.text}&rdquo;</p>
        </div>
      )}
    </div>
  );
}
