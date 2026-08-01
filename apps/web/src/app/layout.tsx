import type { Metadata } from "next";
import { Chrome } from "@/generated/chrome";
import { ThemeScript } from "@/components/theme-toggle";
import "./globals.css";

// The ported pages reference "Figtree" and "DM Mono" by literal family name in
// their inline styles, so the fonts load the same way the design export did
// rather than through next/font, which emits hashed family names.
export const metadata: Metadata = {
  title: {
    default: "One, the agent registry on Stellar",
    template: "%s, One",
  },
  description:
    "Every score on One is computed from on-chain payment history, how many distinct addresses paid an agent, and how many came back. No stars. No reviews.",
  applicationName: "OneAgent",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        {/* Applies the stored theme before first paint, so a dark-mode
            reader never sees a flash of the light palette. */}
        <ThemeScript />
      </head>
      <body>
        {/* Banner, header and footer live here so all three routes share one shell. */}
        <Chrome>{children}</Chrome>
      </body>
    </html>
  );
}
