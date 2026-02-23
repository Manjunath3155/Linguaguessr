import type { NextConfig } from "next";
import { withLingo } from "@lingo.dev/compiler/next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
};

export default async function (): Promise<NextConfig> {
  return await withLingo(nextConfig, {
    sourceLocale: "en",
    targetLocales: ["es", "fr", "de", "ja", "hi", "ar", "pt"],
    models: "lingo.dev",
  });
}
