import { NextRequest, NextResponse } from "next/server";

/**
 * Translation API endpoint.
 *
 * In production with Lingo.dev SDK installed:
 *   import { LingoDotDevEngine } from "lingo.dev/sdk";
 *   const engine = new LingoDotDevEngine({ apiKey: process.env.LINGODODEV_API_KEY });
 *   const translated = await engine.localizeText(text, { sourceLocale, targetLocale });
 *
 * For now, returns original text as fallback when SDK is not installed.
 */
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { text, targetLocale } = body;

  if (!text || !targetLocale) {
    return NextResponse.json({ error: "Missing text or targetLocale" }, { status: 400 });
  }

  // When Lingo.dev SDK is installed and configured, add translation logic here.
  // The SDK call would be:
  //   const { LingoDotDevEngine } = await import("lingo.dev/sdk");
  //   const engine = new LingoDotDevEngine({ apiKey: process.env.LINGODODEV_API_KEY });
  //   const translated = await engine.localizeText(text, { sourceLocale: "en", targetLocale });

  return NextResponse.json({
    translated: text,
    source: "fallback",
    note: "Install lingo.dev and set LINGODODEV_API_KEY to enable real-time translation",
  });
}
