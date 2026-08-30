import type { Metadata } from "next";
import { Manrope, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const display = Manrope({
  subsets: ["latin"],
  weight: ["500", "700", "800"],
  variable: "--font-display",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-body",
});

const SITE_URL = "https://prepwise-drab.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "PrepWise — JEE, NEET & CUET Preparation",
    template: "%s | PrepWise",
  },
  description:
    "Notes, PYQs, formula sheets and timed mock tests for Class 11, Class 12, JEE Main, JEE Advanced, NEET and CUET.",
  openGraph: {
    siteName: "PrepWise",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${mono.variable}`}>
      <body className="font-body">{children}</body>
    </html>
  );
}
