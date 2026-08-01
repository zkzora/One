"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "one-theme";

/**
 * Light/dark switch.
 *
 * Renders the design's pill. The actual switching is a `data-theme` attribute
 * on the root element, which the palette in globals.css keys off.
 */
export function ThemeToggle() {
  // Starts undefined so the server and the first client render agree; the real
  // value is only knowable in the browser.
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const stored = document.documentElement.dataset.theme as Theme | undefined;
    setTheme(stored ?? "light");
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Private browsing can refuse storage. The theme still applies for this
      // page view; it just will not be remembered.
    }
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isDark}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "9px 15px",
        border: "1px solid var(--line)",
        borderRadius: "999px",
        background: "transparent",
        color: "var(--ink)",
        font: "600 12px 'Figtree',sans-serif",
        cursor: "pointer",
      }}
    >
      <span
        aria-hidden
        style={{
          width: "9px",
          height: "9px",
          borderRadius: "50%",
          border: "1.5px solid var(--ink)",
          background: isDark ? "var(--ink)" : "transparent",
        }}
      />
      {/* Empty until mounted, so the label never contradicts the actual theme. */}
      <span style={{ minWidth: "30px", textAlign: "left" }}>
        {theme === null ? "" : isDark ? "Dark" : "Light"}
      </span>
    </button>
  );
}

/**
 * Applies the stored theme before first paint.
 *
 * Without this the page renders light, then corrects itself once React
 * hydrates, which is a visible flash on every navigation for anyone using dark.
 */
export function ThemeScript() {
  const script = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
    STORAGE_KEY
  )});if(!t){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.dataset.theme=t}catch(e){}})()`;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
