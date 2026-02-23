import { NextRequest, NextResponse } from "next/server";
import { LingoDotDevEngine } from "lingo.dev/sdk";

const engine = new LingoDotDevEngine({
  apiKey: process.env.LINGODOTDEV_API_KEY!,
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { text, targetLocale } = body;

  if (!text || !targetLocale) {
    return NextResponse.json({ error: "Missing text or targetLocale" }, { status: 400 });
  }

  if (!process.env.LINGODOTDEV_API_KEY) {
    return NextResponse.json({
      translated: text,
      source: "fallback",
      note: "Set LINGODOTDEV_API_KEY to enable real-time translation",
    });
  }

  try {
    const translated = await engine.localizeText(text, {
      sourceLocale: "en",
      targetLocale,
    });

    return NextResponse.json({
      translated,
      source: "lingo.dev",
    });
  } catch {
    return NextResponse.json({
      translated: text,
      source: "fallback",
      note: "Translation failed, returning original text",
    });
  }
}
