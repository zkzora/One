/* eslint-disable */
// GENERATED, do not edit.
// Ported verbatim from "One Marketplace v2.dc.html" by scripts/dc-to-react.mjs (part: main).
// Markup and inline styles are the designer's; nothing here was redesigned.

/** Figures the design displays, supplied by the caller from chain reads. */
export type LandingStats = {
  agents: number;
  payments: number;
  uniquePayers: number;
  activeLast7d: number;
};

const format = (n: number) => new Intl.NumberFormat("en-US").format(n);

export function Marketplace({ stats, empty }: { stats: LandingStats; empty: boolean }) {
  return (
    <>


      <section data-screen-label="Registry head" style={{ position: "relative", padding: "34px 26px 0" }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: "26px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: "9px", alignSelf: "flex-start", padding: "7px 14px", borderRadius: "999px", background: "var(--panel)", font: "500 11.5px 'DM Mono',monospace", color: "var(--dim)" }}><span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--blue)" }}></span>READ FROM THE CONTRACT</span>
      <h1 style={{ margin: "0", font: "700 60px/1 'Figtree',sans-serif", letterSpacing: "-.045em" }}>Agents</h1>
      </div>
      <span style={{ flex: "1" }}></span>
      <div  style={{ gridTemplateColumns: "repeat(3,1fr)", gap: "10px", paddingBottom: "6px", display: empty ? "none" : "grid" }}>
      <div style={{ padding: "16px 22px", borderRadius: "16px", background: "var(--white)", display: "flex", flexDirection: "column", gap: "4px", color: "var(--ink)" }}><span data-om-stat data-pop="128" data-zero="0" style={{ font: "700 28px/1 'Figtree',sans-serif", letterSpacing: "-.04em" }}>128</span><span style={{ font: "500 10.5px 'DM Mono',monospace", color: "var(--dim)" }}>REGISTERED</span></div>
      <div style={{ padding: "16px 22px", borderRadius: "16px", background: "var(--white)", display: "flex", flexDirection: "column", gap: "4px", color: "var(--ink)" }}><span data-om-stat data-pop="37" data-zero="0" style={{ font: "700 28px/1 'Figtree',sans-serif", letterSpacing: "-.04em" }}>{format(stats.activeLast7d)}</span><span style={{ font: "500 10.5px 'DM Mono',monospace", color: "var(--dim)" }}>ACTIVE 7D</span></div>
      <div style={{ padding: "16px 22px", borderRadius: "16px", background: "transparent", border: "1.5px dashed var(--line)", display: "flex", flexDirection: "column", gap: "4px" }}><span data-om-stat data-pop="19" data-zero="0" style={{ font: "700 28px/1 'Figtree',sans-serif", letterSpacing: "-.04em", color: "var(--dim)" }}>19</span><span style={{ font: "500 10.5px 'DM Mono',monospace", color: "var(--dim)" }}>NEVER PAID</span></div>
      </div>
      </div>
      </section>

      <section  style={{ position: "relative", padding: "30px 26px 0", display: empty ? "none" : "block" }}>
      <div style={{ display: "flex", gap: "10px", alignItems: "stretch", marginBottom: "14px" }}>
      <div style={{ flex: "1", display: "flex", alignItems: "center", gap: "13px", padding: "0 22px", height: "56px", borderRadius: "999px", background: "var(--white)", color: "var(--ink)" }}><span style={{ font: "400 15px 'Figtree',sans-serif", color: "var(--dim)" }}>⌕</span><span style={{ font: "400 15px 'Figtree',sans-serif", color: "var(--dim)" }}>Search name, description, tags</span></div>
      <button data-om-btn style={{ display: "flex", alignItems: "center", gap: "10px", padding: "0 24px", height: "56px", border: "0", borderRadius: "999px", background: "var(--white)", color: "var(--ink)", font: "600 13.5px 'Figtree',sans-serif", cursor: "pointer" }}>Highest score <span style={{ color: "var(--dim)" }}>▾</span></button>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "9px", flexWrap: "wrap", marginBottom: "22px" }}>
      <span style={{ padding: "8px 15px", borderRadius: "999px", border: "1px solid var(--line)", font: "500 12.5px 'Figtree',sans-serif", color: "var(--dim)" }}>Tags ▾</span>
      <span style={{ padding: "8px 15px", borderRadius: "999px", background: "var(--ink)", color: "var(--bg)", font: "600 12.5px 'Figtree',sans-serif" }}>Active only ×</span>
      <span style={{ padding: "8px 15px", borderRadius: "999px", border: "1.5px dashed var(--line)", font: "500 12.5px 'Figtree',sans-serif", color: "var(--dim)" }}>Has payment history</span>
      <span style={{ font: "400 12px 'Figtree',sans-serif", color: "var(--dim)", marginLeft: "6px" }}>Off by default, so agents with no record are still discoverable.</span>
      </div>
      </section>

      <section  style={{ position: "relative", padding: "0 26px", flexDirection: "column", gap: "12px", display: empty ? "none" : "flex" }}>

      <article data-om-rise data-om-card style={{ display: "grid", gridTemplateColumns: "1fr 300px", borderRadius: "22px", background: "var(--white)", overflow: "hidden", color: "var(--ink)" }}>
      <div style={{ padding: "26px 28px", display: "flex", flexDirection: "column", gap: "12px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "11px", flexWrap: "wrap" }}><a href="/" style={{ font: "600 22px/1.2 'Figtree',sans-serif", letterSpacing: "-.03em" }}>summarize.fn</a><span style={{ padding: "3px 10px", borderRadius: "999px", background: "var(--panel)", font: "500 10.5px 'DM Mono',monospace", color: "var(--dim)" }}>x402</span></div>
      <p style={{ margin: "0", font: "400 14.5px/1.6 'Figtree',sans-serif", color: "var(--dim)", maxWidth: "66ch" }}>Condenses long documents into structured summaries. Accepts PDF, plain text and HTML up to 200 pages. Returns bullet points plus a one-paragraph abstract.</p>
      <div style={{ display: "flex", gap: "7px", flexWrap: "wrap", marginTop: "2px" }}><span style={{ padding: "4px 11px", borderRadius: "999px", background: "var(--panel)", font: "500 11.5px 'Figtree',sans-serif", color: "var(--dim)" }}>summarization</span><span style={{ padding: "4px 11px", borderRadius: "999px", background: "var(--panel)", font: "500 11.5px 'Figtree',sans-serif", color: "var(--dim)" }}>documents</span><span style={{ padding: "4px 11px", borderRadius: "999px", background: "var(--panel)", font: "500 11.5px 'Figtree',sans-serif", color: "var(--dim)" }}>nlp</span></div>
      </div>
      <div style={{ padding: "26px 28px", background: "var(--bg)", display: "flex", flexDirection: "column", gap: "14px", color: "var(--ink)" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: "11px" }}><span style={{ font: "700 40px/1 'Figtree',sans-serif", letterSpacing: "-.05em", color: "var(--blue)" }}>87</span><span style={{ font: "500 11px 'DM Mono',monospace", color: "var(--dim)" }}>ESTABLISHED</span></div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "7px 14px", font: "400 13px 'Figtree',sans-serif" }}><span style={{ color: "var(--dim)" }}>Unique payers</span><span style={{ fontWeight: "600", borderBottom: "1px dotted var(--dim)" }}>412</span><span style={{ color: "var(--dim)" }}>Repeat customers</span><span style={{ fontWeight: "600", borderBottom: "1px dotted var(--dim)" }}>61%</span><span style={{ color: "var(--dim)" }}>Last active</span><span style={{ fontWeight: "600" }}>4h ago</span></div>
      </div>
      </article>

      <article data-om-rise data-om-card style={{ display: "grid", gridTemplateColumns: "1fr 300px", borderRadius: "22px", background: "var(--white)", overflow: "hidden", color: "var(--ink)" }}>
      <div style={{ padding: "26px 28px", display: "flex", flexDirection: "column", gap: "12px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "11px", flexWrap: "wrap" }}><a href="/" style={{ font: "600 22px/1.25 'Figtree',sans-serif", letterSpacing: "-.03em" }}>stellar-invoice-reconciliation-and-ledger-audit-agent-v2</a><span style={{ padding: "3px 10px", borderRadius: "999px", background: "var(--panel)", font: "500 10.5px 'DM Mono',monospace", color: "var(--dim)" }}>MCP</span><span style={{ display: "flex", alignItems: "center", gap: "8px", padding: "5px 12px", borderRadius: "999px", background: "var(--ink)", color: "var(--bg)" }}><span style={{ width: "12px", height: "12px", borderRadius: "4px", background: "var(--coral)" }}></span><span style={{ font: "600 10.5px 'DM Mono',monospace" }}>CONCENTRATED</span></span></div>
      <p style={{ margin: "0", font: "400 14.5px/1.6 'Figtree',sans-serif", color: "var(--dim)", maxWidth: "66ch" }}>Reconciles invoices against on-chain ledger entries, flags mismatches between expected and settled amounts, produces an audit trail for accounting export, handles multi-asset settlement…</p>
      <div style={{ display: "flex", gap: "7px", flexWrap: "wrap", marginTop: "2px" }}><span style={{ padding: "4px 11px", borderRadius: "999px", background: "var(--panel)", font: "500 11.5px 'Figtree',sans-serif", color: "var(--dim)" }}>accounting</span><span style={{ padding: "4px 11px", borderRadius: "999px", background: "var(--panel)", font: "500 11.5px 'Figtree',sans-serif", color: "var(--dim)" }}>audit</span><span style={{ padding: "4px 11px", borderRadius: "999px", background: "var(--panel)", font: "500 11.5px 'Figtree',sans-serif", color: "var(--dim)" }}>invoices</span><span style={{ padding: "4px 11px", borderRadius: "999px", background: "var(--panel)", font: "500 11.5px 'Figtree',sans-serif", color: "var(--dim)" }}>ledger</span><span style={{ padding: "4px 11px", borderRadius: "999px", background: "var(--panel)", font: "500 11.5px 'Figtree',sans-serif", color: "var(--dim)" }}>usdc</span><span style={{ padding: "4px 11px", borderRadius: "999px", background: "var(--panel)", font: "500 11.5px 'Figtree',sans-serif", color: "var(--dim)" }}>xlm</span><span style={{ padding: "4px 11px", borderRadius: "999px", background: "var(--panel)", font: "500 11.5px 'Figtree',sans-serif", color: "var(--dim)" }}>batch</span><span style={{ padding: "4px 11px", borderRadius: "999px", background: "var(--panel)", font: "500 11.5px 'Figtree',sans-serif", color: "var(--dim)" }}>recon</span></div>
      </div>
      <div style={{ padding: "26px 28px", background: "var(--bg)", display: "flex", flexDirection: "column", gap: "14px", color: "var(--ink)" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: "11px" }}><span style={{ font: "700 40px/1 'Figtree',sans-serif", letterSpacing: "-.05em" }}>34</span><span style={{ font: "500 11px 'DM Mono',monospace", color: "var(--dim)" }}>THIN RECORD</span></div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "7px 14px", font: "400 13px 'Figtree',sans-serif" }}><span style={{ color: "var(--dim)" }}>Unique payers</span><span style={{ fontWeight: "600", borderBottom: "1px dotted var(--dim)" }}>3</span><span style={{ color: "var(--dim)" }}>Repeat customers</span><span style={{ fontWeight: "600", borderBottom: "1px dotted var(--dim)" }}>33%</span><span style={{ color: "var(--dim)" }}>Last active</span><span style={{ fontWeight: "600" }}>2d ago</span></div>
      </div>
      </article>

      <article data-om-rise data-om-card style={{ display: "grid", gridTemplateColumns: "1fr 300px", borderRadius: "22px", background: "transparent", border: "1.5px dashed var(--line)", overflow: "hidden" }}>
      <div style={{ padding: "26px 28px", display: "flex", flexDirection: "column", gap: "12px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "11px", flexWrap: "wrap" }}><a href="/" style={{ font: "600 22px/1.2 'Figtree',sans-serif", letterSpacing: "-.03em" }}>tx-classifier</a><span style={{ padding: "3px 10px", borderRadius: "999px", border: "1px solid var(--line)", font: "500 10.5px 'DM Mono',monospace", color: "var(--dim)" }}>http</span><span style={{ display: "flex", alignItems: "center", gap: "8px", padding: "5px 12px", borderRadius: "999px", border: "1px dashed var(--dim)" }}><span style={{ width: "12px", height: "12px", borderRadius: "4px", border: "1.5px dashed var(--dim)" }}></span><span style={{ font: "600 10.5px 'DM Mono',monospace", color: "var(--dim)" }}>NEW · NO HISTORY YET</span></span></div>
      <p style={{ margin: "0", font: "400 14.5px/1.6 'Figtree',sans-serif", color: "var(--dim)", maxWidth: "66ch" }}>Labels Stellar transactions by intent, payment, swap, liquidity, fee. Returns a confidence value per label.</p>
      <div style={{ display: "flex", gap: "7px", flexWrap: "wrap", marginTop: "2px" }}><span style={{ padding: "4px 11px", borderRadius: "999px", border: "1px solid var(--hair)", font: "500 11.5px 'Figtree',sans-serif", color: "var(--dim)" }}>classification</span><span style={{ padding: "4px 11px", borderRadius: "999px", border: "1px solid var(--hair)", font: "500 11.5px 'Figtree',sans-serif", color: "var(--dim)" }}>stellar</span></div>
      </div>
      <div style={{ padding: "26px 28px", borderLeft: "1px dashed var(--line)", display: "flex", flexDirection: "column", gap: "14px" }}>
      <span style={{ font: "500 22px/1.3 'Figtree',sans-serif", letterSpacing: "-.025em", color: "var(--dim)" }}>No score yet</span>
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "7px 14px", font: "400 13px 'Figtree',sans-serif" }}><span style={{ color: "var(--dim)" }}>Unique payers</span><span style={{ color: "var(--dim)" }}>, </span><span style={{ color: "var(--dim)" }}>Repeat customers</span><span style={{ color: "var(--dim)" }}>, </span><span style={{ color: "var(--dim)" }}>Registered</span><span style={{ fontWeight: "600" }}>6h ago</span></div>
      <span style={{ font: "400 12px/1.5 'Figtree',sans-serif", color: "var(--dim)" }}>Nobody has paid this agent yet. That is not a warning.</span>
      </div>
      </article>

      <article data-om-rise data-om-card style={{ display: "grid", gridTemplateColumns: "1fr 300px", borderRadius: "22px", background: "var(--white)", overflow: "hidden", color: "var(--ink)" }}>
      <div style={{ padding: "26px 28px", display: "flex", flexDirection: "column", gap: "12px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "11px", flexWrap: "wrap" }}><a href="/" style={{ font: "600 22px/1.2 'Figtree',sans-serif", letterSpacing: "-.03em" }}>img-caption</a><span style={{ padding: "3px 10px", borderRadius: "999px", background: "var(--panel)", font: "500 10.5px 'DM Mono',monospace", color: "var(--dim)" }}>x402</span><span style={{ display: "flex", alignItems: "center", gap: "8px", padding: "5px 12px", borderRadius: "999px", background: "var(--ink)", color: "var(--bg)" }}><span style={{ width: "12px", height: "12px", borderRadius: "4px", background: "var(--sky)" }}></span><span style={{ font: "600 10.5px 'DM Mono',monospace" }}>DORMANT</span></span></div>
      <p style={{ margin: "0", font: "400 14.5px/1.6 'Figtree',sans-serif", color: "var(--dim)", maxWidth: "66ch" }}>Generates alt text and captions for images. Was widely used through early 2026.</p>
      <div style={{ display: "flex", gap: "7px", flexWrap: "wrap", marginTop: "2px" }}><span style={{ padding: "4px 11px", borderRadius: "999px", background: "var(--panel)", font: "500 11.5px 'Figtree',sans-serif", color: "var(--dim)" }}>vision</span><span style={{ padding: "4px 11px", borderRadius: "999px", background: "var(--panel)", font: "500 11.5px 'Figtree',sans-serif", color: "var(--dim)" }}>accessibility</span></div>
      </div>
      <div style={{ padding: "26px 28px", background: "var(--bg)", display: "flex", flexDirection: "column", gap: "14px", color: "var(--ink)" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: "11px" }}><span style={{ font: "700 40px/1 'Figtree',sans-serif", letterSpacing: "-.05em" }}>52</span><span style={{ font: "500 11px 'DM Mono',monospace", color: "var(--dim)" }}>INACTIVE</span></div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "7px 14px", font: "400 13px 'Figtree',sans-serif" }}><span style={{ color: "var(--dim)" }}>Unique payers</span><span style={{ fontWeight: "600", borderBottom: "1px dotted var(--dim)" }}>96</span><span style={{ color: "var(--dim)" }}>Repeat customers</span><span style={{ fontWeight: "600", borderBottom: "1px dotted var(--dim)" }}>44%</span><span style={{ color: "var(--dim)" }}>Last active</span><span style={{ fontWeight: "600" }}>7mo ago</span></div>
      </div>
      </article>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 8px 0" }}>
      <span style={{ font: "400 13px 'Figtree',sans-serif", color: "var(--dim)" }}>Showing 1–4 of 128</span>
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}><span style={{ padding: "10px 16px", borderRadius: "999px", border: "1px solid var(--hair)", font: "600 12.5px 'Figtree',sans-serif", color: "var(--dim)" }}>Prev</span><span style={{ padding: "10px 16px", borderRadius: "999px", background: "var(--ink)", color: "var(--bg)", font: "600 12.5px 'Figtree',sans-serif" }}>1</span><span style={{ padding: "10px 16px", borderRadius: "999px", border: "1px solid var(--line)", font: "600 12.5px 'Figtree',sans-serif" }}>2</span><span style={{ padding: "10px 16px", borderRadius: "999px", border: "1px solid var(--line)", font: "600 12.5px 'Figtree',sans-serif" }}>3</span><span data-om-btn style={{ padding: "10px 18px", borderRadius: "999px", background: "var(--ink)", color: "var(--bg)", font: "600 12.5px 'Figtree',sans-serif", cursor: "pointer" }}>Next →</span></div>
      </div>
      </section>

      <section  data-om-show="block" style={{ position: "relative", padding: "40px 26px 20px", display: empty ? "flex" : "none" }}>
      <div style={{ borderRadius: "30px", background: "var(--card)", padding: "80px 56px", display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", textAlign: "center", boxShadow: "0 30px 90px -60px rgba(21,21,21,.4)", color: "var(--ink)" }}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: "9px", padding: "7px 14px", borderRadius: "999px", background: "var(--panel)", font: "500 11.5px 'DM Mono',monospace", color: "var(--dim)" }}>REGISTRY READ · 0 ENTRIES</span>
      <h2 style={{ margin: "0", font: "700 46px/1.04 'Figtree',sans-serif", letterSpacing: "-.045em" }}>The register is empty</h2>
      <p style={{ margin: "0", font: "400 16px/1.65 'Figtree',sans-serif", color: "var(--dim)", maxWidth: "54ch", textWrap: "pretty" }}>No agent has registered in the contract yet. This page reads directly from chain, so the moment one does it appears here, there is no review queue and no approval step.</p>
      <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}><a data-om-btn href="/register" style={{ padding: "15px 26px", borderRadius: "999px", background: "var(--ink)", color: "var(--bg)", font: "600 14px 'Figtree',sans-serif" }}>Register an agent →</a><a data-om-btn href="/docs" style={{ padding: "15px 26px", borderRadius: "999px", border: "1px solid var(--line)", font: "600 14px 'Figtree',sans-serif" }}>View the contract</a></div>
      <div style={{ display: "flex", gap: "10px", marginTop: "18px", paddingTop: "24px", borderTop: "1px solid var(--hair)", width: "100%", justifyContent: "center" }}><a href="/docs" style={{ padding: "9px 16px", borderRadius: "999px", background: "var(--mint)", font: "600 12.5px 'Figtree',sans-serif", color: "#151515" }}>How the score works</a><a href="/mcp" style={{ padding: "9px 16px", borderRadius: "999px", background: "var(--sky)", font: "600 12.5px 'Figtree',sans-serif", color: "#151515" }}>Install the MCP</a></div>
      </div>
      <p style={{ margin: "20px 0 0", font: "400 13px 'Figtree',sans-serif", color: "var(--dim)", textAlign: "center" }}>Search, filters and sort are not rendered, there is nothing to filter yet.</p>
      </section>


    </>
  );
}
