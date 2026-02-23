import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lingo.dev Compiler will wrap this config at build time:
  // import { withLingoDotDev } from "@lingo.dev/compiler/next";
  // export default withLingoDotDev(nextConfig, { sourceLocale: "en", targetLocales: ["es","fr","de","ja","hi","ar","pt"] });
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
