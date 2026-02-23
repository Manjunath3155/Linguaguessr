import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { LocaleProvider } from "@/lib/i18n";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LinguaGuessr - Guess the Language, Pin the Map",
  description:
    "A GeoGuessr-style game where you hear audio clips of different languages and pin their origin on a world map. Solo and multiplayer modes!",
  openGraph: {
    title: "LinguaGuessr - Guess the Language, Pin the Map",
    description:
      "Hear a language, guess where it's from! A map-pinning language game with real-time multiplayer.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LocaleProvider>
          <Navbar />
          <main className="pt-16">{children}</main>
        </LocaleProvider>
      </body>
    </html>
  );
}
