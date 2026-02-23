import { languages, LanguageData } from "./audio-data";

export const MIN_ROUNDS = 5;
export const MAX_ROUNDS = 15;
export const DEFAULT_ROUNDS = 5;
export const ROUNDS_PER_GAME = DEFAULT_ROUNDS; // backward compat alias
export const MAX_SCORE_PER_ROUND = 5000;
export const PERFECT_DISTANCE_KM = 200;

export interface RoundState {
  language: LanguageData;
  guessLat: number | null;
  guessLng: number | null;
  distanceKm: number | null;
  score: number | null;
  submitted: boolean;
}

export interface GameState {
  rounds: RoundState[];
  currentRound: number;
  totalScore: number;
  isFinished: boolean;
}

/**
 * Select N random languages from the pool without repeats.
 */
export function selectRandomLanguages(count: number = ROUNDS_PER_GAME): LanguageData[] {
  const shuffled = [...languages].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Initialize a new game state.
 */
export function createNewGame(roundCount: number = DEFAULT_ROUNDS): GameState {
  const selected = selectRandomLanguages(roundCount);
  return {
    rounds: selected.map((lang) => ({
      language: lang,
      guessLat: null,
      guessLng: null,
      distanceKm: null,
      score: null,
      submitted: false,
    })),
    currentRound: 0,
    totalScore: 0,
    isFinished: false,
  };
}

/**
 * Generate a random 6-character room code.
 */
export function generateRoomCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // No I/O/0/1 to avoid confusion
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
