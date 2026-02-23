# LinguaGuessr

**Guess the Language, Pin the Map!**

A GeoGuessr-style game where you hear audio clips of different languages and must pin the language's origin on a world map. Scored by geographic proximity using the Haversine formula. Supports solo and multiplayer modes with room codes.


## How It Works

1. **Listen** - Hear a clip of someone speaking a mystery language
2. **Pin** - Click on the world map to place your guess
3. **Score** - The closer your pin to the language's origin, the more points you earn (max 5,000 per round)
4. **Repeat** - 5 rounds per game, max 25,000 total points

## Features

- **25 Languages** from around the world (English, Spanish, French, German, Italian, Portuguese, Russian, Japanese, Korean, Mandarin, Hindi, Arabic, Turkish, Thai, Vietnamese, Swahili, Dutch, Polish, Greek, Hebrew, Tamil, Yoruba, Indonesian, Swedish, Amharic)
- **Solo Mode** with global leaderboard
- **Multiplayer Mode** with room codes and real-time gameplay via Supabase Realtime
- **Interactive World Map** powered by Leaflet/OpenStreetMap
- **Haversine Scoring** with forgiving distance curve (within 200km = perfect 5,000)
- **Cultural Fun Facts** about each language after every round
- **8 UI Languages** via Lingo.dev (English, Spanish, French, German, Japanese, Hindi, Arabic, Portuguese)
- **Dark Theme** with globe-inspired aesthetic

## Tech Stack

| Layer | Tool |
|-------|------|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS |
| Map | react-leaflet + OpenStreetMap |
| Database | Supabase (Postgres + Realtime) |
| Audio | Web Speech API (TTS fallback) |
| i18n | Lingo.dev (Compiler + SDK + CLI + CI/CD + MCP) |
| Deployment | Vercel |

## Lingo.dev Integration (All 5 Products)

### 1. Compiler
Wraps the Next.js build to auto-translate all JSX text in the game UI (buttons, labels, headings, instructions) to 8 languages at build time.

```ts
// next.config.ts (production)
import { withLingoDotDev } from "@lingo.dev/compiler/next";
export default withLingoDotDev(nextConfig, {
  sourceLocale: "en",
  targetLocales: ["es", "fr", "de", "ja", "hi", "ar", "pt"]
});
```

### 2. SDK
Runtime translation of cultural fun facts from the database into the player's selected language.

```ts
// /api/translate endpoint
import { LingoDotDevEngine } from "lingo.dev/sdk";
const engine = new LingoDotDevEngine({ apiKey: process.env.LINGODODEV_API_KEY });
const translated = await engine.localizeText(text, { sourceLocale: "en", targetLocale });
```

### 3. CLI
Translates static JSON locale files containing language names, country names, and error messages.

```bash
npx lingo.dev@latest i18n
```

### 4. CI/CD (GitHub Actions)
Auto-runs Lingo.dev translation on every push to main, ensuring no untranslated strings reach production.

```yaml
# .github/workflows/translate.yml
- name: Run Lingo.dev CLI
  run: npx lingo.dev@latest i18n
  env:
    LINGODODEV_API_KEY: ${{ secrets.LINGODODEV_API_KEY }}
```

### 5. MCP
Used during development with Claude Code to scaffold the i18n setup, generate locale files, and configure translation workflows.

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
git clone <your-repo-url>
cd linguaguessr
npm install
```

### Environment Variables

Copy the example env file and fill in your Supabase credentials:

```bash
cp .env.local.example .env.local
```

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon/public key
- `LINGODODEV_API_KEY` (optional) - For real-time translation via SDK

> **Note:** The app works without Supabase! Scores are stored in-memory and audio uses the Web Speech API as a fallback.

### Database Setup (Optional)

Run the SQL in `supabase-schema.sql` in your Supabase SQL Editor to create the required tables and seed language data.

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
npm run build
npm start
```

## Scoring Algorithm

Uses the **Haversine formula** to calculate great-circle distance:

- **Within 200km** = Perfect score (5,000 points)
- **Exponential decay** beyond 200km: `5000 * e^(-distance/3000)`
- At ~2,000km: ~2,500 points
- At ~5,000km: ~500 points
- At ~10,000km: ~50 points

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              - Root layout with Navbar
│   ├── page.tsx                - Landing page
│   ├── play/page.tsx           - Solo game
│   ├── multiplayer/
│   │   ├── page.tsx            - Create/join room
│   │   └── [code]/page.tsx     - Multiplayer game room
│   ├── leaderboard/page.tsx    - Global leaderboard
│   └── api/
│       ├── score/route.ts      - Score submission API
│       └── translate/route.ts  - Lingo.dev SDK translation
├── components/
│   ├── GameMap.tsx              - Leaflet map with click-to-pin
│   ├── AudioPlayer.tsx         - Audio playback (MP3 + Web Speech)
│   ├── ScoreDisplay.tsx        - Animated score counter
│   ├── RoundResult.tsx         - Round result with fun fact
│   ├── Leaderboard.tsx         - Score table
│   ├── RoomLobby.tsx           - Multiplayer waiting room
│   ├── LanguageSwitcher.tsx    - UI language toggle
│   └── Navbar.tsx              - Navigation bar
├── lib/
│   ├── supabase.ts             - Supabase client
│   ├── geo.ts                  - Haversine formula + scoring
│   ├── game.ts                 - Game logic
│   ├── audio-data.ts           - 25 language entries
│   └── generate-audio.ts       - Web Speech API phrases
└── locales/
    └── en.json                 - Static translation strings
```

## AI Usage Disclosure

This project was built with assistance from **Claude Code** (Claude Opus 4.6) by Anthropic. Claude was used for:
- Code generation and architecture design
- i18n scaffolding via Lingo.dev MCP
- Debugging and optimization

## License

MIT
