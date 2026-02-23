import { NextRequest, NextResponse } from "next/server";

// In-memory fallback when Supabase is not configured
let inMemoryScores: {
  id: string;
  player_name: string;
  total_score: number;
  rounds_played: number;
  created_at: string;
}[] = [];

function getSupabase() {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_URL === "your_supabase_url_here"
  ) {
    return null;
  }
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createClient } = require("@supabase/supabase-js");
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export async function GET() {
  const supabase = getSupabase();

  if (supabase) {
    const { data, error } = await supabase
      .from("scores")
      .select("*")
      .order("total_score", { ascending: false })
      .limit(50);

    if (error) {
      return NextResponse.json({ scores: inMemoryScores.sort((a: { total_score: number }, b: { total_score: number }) => b.total_score - a.total_score).slice(0, 50) });
    }
    return NextResponse.json({ scores: data });
  }

  return NextResponse.json({
    scores: inMemoryScores
      .sort((a, b) => b.total_score - a.total_score)
      .slice(0, 50),
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { playerName, totalScore, roundsPlayed } = body;

  if (!playerName || typeof totalScore !== "number") {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const supabase = getSupabase();

  if (supabase) {
    const { data, error } = await supabase
      .from("scores")
      .insert({
        player_name: playerName,
        total_score: totalScore,
        rounds_played: roundsPlayed || 5,
      })
      .select()
      .single();

    if (error) {
      // Fallback to in-memory
      const entry = {
        id: crypto.randomUUID(),
        player_name: playerName,
        total_score: totalScore,
        rounds_played: roundsPlayed || 5,
        created_at: new Date().toISOString(),
      };
      inMemoryScores.push(entry);
      return NextResponse.json({ score: entry });
    }
    return NextResponse.json({ score: data });
  }

  const entry = {
    id: crypto.randomUUID(),
    player_name: playerName,
    total_score: totalScore,
    rounds_played: roundsPlayed || 5,
    created_at: new Date().toISOString(),
  };
  inMemoryScores.push(entry);
  return NextResponse.json({ score: entry });
}
