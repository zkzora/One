/* eslint-disable */
// GENERATED, do not edit.
// Ported verbatim from "designs/One Landing v2.dc.html" by scripts/dc-to-react.mjs (part: chrome).
// Markup and inline styles are the designer's; nothing here was redesigned.
import { ThemeToggle } from "@/components/theme-toggle";

export function Chrome({ children }: { children: React.ReactNode }) {
  return (
    <>



      <div data-om-root style={{ position: "relative", minWidth: "1200px", background: "var(--bg)", color: "var(--ink)", overflow: "hidden" }}>

      <div data-om-wash style={{ position: "absolute", inset: "0", zIndex: "-1", pointerEvents: "none", background: "linear-gradient(180deg,var(--gtop) 0%,var(--gmid) 20%,var(--gmid) 52%,var(--gbot) 100%)" }}>
      <div style={{ position: "absolute", left: "-14%", bottom: "-6%", width: "62%", height: "52%", borderRadius: "50%", background: "radial-gradient(circle at 50% 50%,var(--g1) 0%,transparent 68%)", filter: "blur(100px)", animation: "om-mesh 34s ease-in-out infinite" }}></div>
      <div style={{ position: "absolute", right: "-16%", top: "34%", width: "52%", height: "44%", borderRadius: "50%", background: "radial-gradient(circle at 50% 50%,var(--g2) 0%,transparent 70%)", filter: "blur(110px)", animation: "om-mesh2 40s ease-in-out infinite" }}></div>
      <div style={{ position: "absolute", left: "-8%", top: "-8%", width: "44%", height: "34%", borderRadius: "50%", background: "radial-gradient(circle at 50% 50%,var(--g3) 0%,transparent 70%)", filter: "blur(90px)" }}></div>
      <div style={{ position: "absolute", left: "24%", bottom: "16%", width: "46%", height: "34%", borderRadius: "50%", background: "radial-gradient(circle at 50% 50%,var(--g2) 0%,transparent 72%)", filter: "blur(120px)", animation: "om-mesh 46s ease-in-out infinite" }}></div>
      </div>

      <header style={{ position: "relative", zIndex: "30", display: "flex", alignItems: "center", gap: "34px", padding: "20px 26px" }}>
      <a href="/" style={{ display: "flex", alignItems: "center", gap: "7px" }}>
      <img src="/one-logo-black.png" alt="" data-logo="light" width="24" height="29" style={{ height: "27px", width: "auto", marginRight: "-3px" }} /><img src="/one-logo-white.png" alt="" data-logo="dark" width="24" height="29" style={{ height: "27px", width: "auto", marginRight: "-3px" }} />
      <span style={{ font: "700 20px/1 'Figtree',sans-serif", letterSpacing: "-.03em" }}>One</span>
      </a>
      <nav style={{ display: "flex", alignItems: "center", gap: "26px", font: "500 14px 'Figtree',sans-serif" }}>
      <a href="/agents">Marketplace</a>
      <a href="/dashboard">Dashboard</a>
      <a href="/mcp">MCP</a>
      <a href="/docs">Docs</a>
      </nav>
      <span style={{ flex: "1" }}></span>

      <ThemeToggle />
      <button data-om-btn style={{ padding: "11px 20px", border: "0", borderRadius: "999px", background: "var(--ink)", color: "var(--bg)", font: "600 13px 'Figtree',sans-serif", cursor: "pointer" }}>Connect wallet</button>
      </header>
      {children}
      <footer data-screen-label="Footer" style={{ position: "relative", background: "var(--white)", borderTop: "1px solid var(--hair)", overflow: "hidden", marginTop: "20px", color: "var(--ink)" }}>
      <div style={{ position: "relative", height: "210px", overflow: "hidden" }}>
      <div data-om-blob style={{ position: "absolute", left: "2%", top: "-120px", width: "210px", height: "250px", background: "var(--yellow)", clipPath: "polygon(25% 0,75% 0,100% 50%,75% 100%,25% 100%,0 50%)", animation: "om-float 17s ease-in-out infinite" }}></div>
      <div data-om-blob style={{ position: "absolute", left: "17%", top: "-96px", width: "220px", height: "240px", background: "var(--sky)", borderRadius: "44% 46% 42% 48%", animation: "om-float 21s ease-in-out infinite" }}></div>
      <div data-om-blob style={{ position: "absolute", left: "33%", top: "-140px", width: "250px", height: "280px", background: "var(--lilac)", borderRadius: "50% 50% 14% 14%", animation: "om-float 24s ease-in-out infinite" }}></div>
      <div data-om-blob style={{ position: "absolute", left: "50%", top: "-104px", width: "240px", height: "250px", background: "var(--coral)", borderRadius: "58% 42% 52% 48% / 52% 56% 44% 48%", animation: "om-float 19s ease-in-out infinite" }}></div>
      <div data-om-blob style={{ position: "absolute", left: "66%", top: "-130px", width: "250px", height: "270px", background: "var(--pink)", borderRadius: "50% 50% 46% 46%", animation: "om-float 26s ease-in-out infinite" }}></div>
      <div data-om-blob style={{ position: "absolute", left: "82%", top: "-92px", width: "250px", height: "250px", background: "var(--lime)", borderRadius: "44% 56% 48% 52% / 50% 44% 56% 50%", animation: "om-float 22s ease-in-out infinite" }}></div>
      <a href="/mcp" style={{ position: "absolute", left: "8%", top: "52px", padding: "9px 18px", borderRadius: "999px", background: "var(--mint)", color: "#151515", font: "600 12.5px 'Figtree',sans-serif", transform: "rotate(-19deg)" }}>Install the MCP →</a>
      <a href="/docs" style={{ position: "absolute", left: "38%", top: "26px", padding: "9px 18px", borderRadius: "999px", background: "var(--mint)", color: "#151515", font: "600 12.5px 'Figtree',sans-serif", transform: "rotate(11deg)" }}>How the score works →</a>
      <a href="/docs" style={{ position: "absolute", right: "6%", top: "60px", padding: "9px 18px", borderRadius: "999px", background: "var(--mint)", color: "#151515", font: "600 12.5px 'Figtree',sans-serif", transform: "rotate(-13deg)" }}>View the contract →</a>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 190px 190px 190px", gap: "40px", padding: "48px 40px 40px", borderTop: "1px solid var(--hair)" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "18px", maxWidth: "34ch" }}>
      <h3 style={{ margin: "0", font: "600 26px/1.2 'Figtree',sans-serif", letterSpacing: "-.03em" }}>Reputation computed from payments, not claims.</h3>
      <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
      <span style={{ width: "36px", height: "36px", borderRadius: "50%", border: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "center", font: "600 12px 'DM Mono',monospace", color: "var(--dim)" }}>gh</span>
      <span style={{ width: "36px", height: "36px", borderRadius: "50%", border: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "center", font: "600 12px 'DM Mono',monospace", color: "var(--dim)" }}>x</span>
      <a data-om-btn href="/register" style={{ padding: "11px 20px", borderRadius: "999px", border: "1px solid var(--ink)", font: "600 12.5px 'Figtree',sans-serif" }}>Register an agent</a>
      </div>
      <span style={{ font: "500 11px/1.7 'DM Mono',monospace", color: "var(--dim)", marginTop: "4px" }}>CONTRACT CAZ4…9QK2<br />TESTNET · SOROBAN</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "11px" }}><span style={{ font: "600 12px 'Figtree',sans-serif", color: "var(--dim)" }}>Product</span><a href="/agents" style={{ font: "400 14px 'Figtree',sans-serif" }}>Marketplace</a><a href="/dashboard" style={{ font: "400 14px 'Figtree',sans-serif" }}>Dashboard</a><a href="/register" style={{ font: "400 14px 'Figtree',sans-serif" }}>Register</a><a href="/mcp" style={{ font: "400 14px 'Figtree',sans-serif" }}>MCP server</a></div>
      <div style={{ display: "flex", flexDirection: "column", gap: "11px" }}><span style={{ font: "600 12px 'Figtree',sans-serif", color: "var(--dim)" }}>Open</span><a href="/docs" style={{ font: "400 14px 'Figtree',sans-serif" }}>Contract on explorer</a><a href="/docs" style={{ font: "400 14px 'Figtree',sans-serif" }}>GitHub</a><a href="/docs" style={{ font: "400 14px 'Figtree',sans-serif" }}>How the score works</a><a href="/docs" style={{ font: "400 14px 'Figtree',sans-serif" }}>Limitations</a></div>
      <div style={{ display: "flex", flexDirection: "column", gap: "11px" }}><span style={{ font: "600 12px 'Figtree',sans-serif", color: "var(--dim)" }}>Network</span><a href="/" style={{ font: "400 14px 'Figtree',sans-serif" }}>Testnet</a><a href="/" style={{ font: "400 14px 'Figtree',sans-serif" }}>Mainnet</a><a href="/docs" style={{ font: "400 14px 'Figtree',sans-serif" }}>Status</a></div>
      </div>
      <div style={{ padding: "0 40px", overflow: "hidden" }}>
      <div data-om-wordmark style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "8px 0" }}><img src="/one-logo-full-black.png" alt="One" data-logo="light" style={{ height: "250px", width: "auto" }} /><img src="/one-logo-full-white.png" alt="One" data-logo="dark" style={{ height: "250px", width: "auto" }} /></div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "26px", padding: "20px 40px", borderTop: "1px solid var(--hair)", font: "400 12px 'Figtree',sans-serif", color: "var(--dim)" }}>
      <span>One · 2026</span>
      <span style={{ flex: "1" }}></span>
      <span>One records payments. It does not vouch for agents.</span>
      </div>
      </footer>

      </div>



    </>
  );
}
