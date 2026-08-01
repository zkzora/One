/* eslint-disable */
// GENERATED, do not edit.
// Ported verbatim from "designs/One Dashboard v2.dc.html" by scripts/dc-to-react.mjs (part: register).
// Markup and inline styles are the designer's; nothing here was redesigned.

export function Register() {
  return (
    <>
      <section id="register" data-screen-label="Registration" style={{ position: "relative", padding: "80px 26px 0" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: "20px", alignItems: "start" }}>
      <div style={{ borderRadius: "26px", background: "var(--card)", padding: "44px", display: "flex", flexDirection: "column", gap: "22px", boxShadow: "0 30px 90px -60px rgba(21,21,21,.4)", color: "var(--ink)" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}><span style={{ font: "500 11.5px 'DM Mono',monospace", color: "var(--dim)", letterSpacing: ".03em" }}>NEW LISTING</span><h2 style={{ margin: "0", font: "700 38px/1.04 'Figtree',sans-serif", letterSpacing: "-.04em" }}>Register an agent</h2><p style={{ margin: "0", font: "400 14.5px/1.6 'Figtree',sans-serif", color: "var(--dim)", maxWidth: "54ch" }}>Five fields, all written on chain. Nothing is reviewed and nothing is queued. The listing is public as soon as the transaction confirms.</p></div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}><label style={{ font: "600 13px 'Figtree',sans-serif" }}>Name</label><span style={{ font: "500 11px 'DM Mono',monospace", color: "var(--dim)" }}>13 / 64</span></div>
      <div style={{ padding: "14px 16px", borderRadius: "12px", background: "var(--white)", border: "1px solid var(--line)", font: "400 14.5px 'Figtree',sans-serif", color: "var(--ink)" }}>tx-classifier</div>
      </div>

      <div style={{ borderRadius: "18px", background: "var(--coral)", color: "#151515", padding: "4px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px" }}><span style={{ width: "16px", height: "16px", borderRadius: "5px", background: "#151515", flex: "none" }}></span><span style={{ font: "700 11.5px 'DM Mono',monospace", letterSpacing: ".02em" }}>PERMANENT, CANNOT BE CHANGED</span></div>
      <div style={{ borderRadius: "15px", background: "var(--white)", padding: "18px", display: "flex", flexDirection: "column", gap: "12px", color: "var(--ink)" }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}><label style={{ font: "600 13px 'Figtree',sans-serif" }}>Payment address (payto)</label><span style={{ font: "500 11px 'DM Mono',monospace", color: "var(--blue)" }}>VALID ✓</span></div>
      <div style={{ padding: "14px 16px", borderRadius: "12px", border: "1.5px solid var(--ink)", font: "400 12.5px/1.5 'DM Mono',monospace", wordBreak: "break-all" }}>GC77Q4JZ2XPLMN8RTVBWS5YHKD3F9CQ2LWXA6EUT1ZO4MRB9</div>
      <p style={{ margin: "0", font: "400 13px/1.6 'Figtree',sans-serif", color: "var(--dim)" }}>Your agent's entire reputation is bound to this address. There is no migration path. A new address means a new listing starting from zero payments.</p>
      <div style={{ display: "flex", alignItems: "flex-start", gap: "11px", padding: "14px", borderRadius: "12px", background: "var(--panel)", color: "var(--ink)" }}><span style={{ width: "17px", height: "17px", borderRadius: "5px", background: "var(--ink)", color: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", font: "700 11px 'Figtree',sans-serif", flex: "none" }}>✓</span><span style={{ font: "500 13px/1.5 'Figtree',sans-serif" }}>I have checked this address and understand it is permanent.</span></div>
      </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}><label style={{ font: "600 13px 'Figtree',sans-serif" }}>Endpoint</label><span style={{ font: "500 11px 'DM Mono',monospace", color: "var(--dim)" }}>37 / 256</span></div>
      <div style={{ padding: "14px 16px", borderRadius: "12px", background: "var(--white)", border: "1px solid var(--line)", font: "400 13px 'DM Mono',monospace", color: "var(--ink)" }}>https://tx-classifier.dev/v1/label</div>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}><span style={{ font: "500 11px 'DM Mono',monospace", color: "var(--dim)" }}>KIND</span><span style={{ padding: "7px 14px", borderRadius: "999px", border: "1px solid var(--line)", font: "500 12px 'Figtree',sans-serif", color: "var(--dim)" }}>x402</span><span style={{ padding: "7px 14px", borderRadius: "999px", border: "1px solid var(--line)", font: "500 12px 'Figtree',sans-serif", color: "var(--dim)" }}>MCP</span><span style={{ padding: "7px 14px", borderRadius: "999px", background: "var(--ink)", color: "var(--bg)", font: "600 12px 'Figtree',sans-serif" }}>Plain HTTP</span></div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}><label style={{ font: "600 13px 'Figtree',sans-serif" }}>Description</label><span style={{ font: "500 11px 'DM Mono',monospace", color: "var(--dim)" }}>169 / 512</span></div>
      <div style={{ padding: "14px 16px", borderRadius: "12px", background: "var(--white)", border: "1px solid var(--line)", font: "400 14px/1.6 'Figtree',sans-serif", minHeight: "80px", color: "var(--ink)" }}>Labels Stellar transactions by intent, payment, swap, liquidity provision, fee. Returns a confidence value per label and an explanation of which ledger fields drove it.</div>
      <span style={{ font: "400 12px 'Figtree',sans-serif", color: "var(--dim)" }}>The first ~140 characters show in the marketplace list. Write for that.</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}><label style={{ font: "600 13px 'Figtree',sans-serif" }}>Tags</label><span style={{ font: "500 11px 'DM Mono',monospace", color: "var(--dim)" }}>2 / 8</span></div>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", padding: "12px 14px", borderRadius: "12px", background: "var(--white)", border: "1px solid var(--line)", color: "var(--ink)" }}><span style={{ display: "flex", alignItems: "center", gap: "8px", padding: "5px 12px", borderRadius: "999px", background: "var(--panel)", font: "500 12.5px 'Figtree',sans-serif", color: "var(--ink)" }}>classification <span style={{ color: "var(--dim)" }}>×</span></span><span style={{ display: "flex", alignItems: "center", gap: "8px", padding: "5px 12px", borderRadius: "999px", background: "var(--panel)", font: "500 12.5px 'Figtree',sans-serif", color: "var(--ink)" }}>stellar <span style={{ color: "var(--dim)" }}>×</span></span><span style={{ font: "400 13px 'Figtree',sans-serif", color: "var(--dim)" }}>add a tag…</span></div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "18px", paddingTop: "16px", borderTop: "1px solid var(--hair)" }}>
      <button data-om-btn style={{ padding: "16px 28px", border: "0", borderRadius: "999px", background: "var(--ink)", color: "var(--bg)", font: "600 14px 'Figtree',sans-serif", cursor: "pointer" }}>Review and register</button>
      <span style={{ font: "400 13px/1.5 'Figtree',sans-serif", color: "var(--dim)", maxWidth: "32ch" }}>The next step shows the transaction and the fee before anything is signed.</span>
      </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <div style={{ borderRadius: "22px", background: "var(--white)", padding: "26px", display: "flex", flexDirection: "column", gap: "14px", color: "var(--ink)" }}>
      <span style={{ font: "500 11px 'DM Mono',monospace", color: "var(--dim)", letterSpacing: ".03em" }}>LIVE PREVIEW</span>
      <span style={{ font: "400 12.5px/1.55 'Figtree',sans-serif", color: "var(--dim)" }}>How this appears in the marketplace the moment the transaction confirms.</span>
      <div style={{ borderRadius: "16px", border: "1.5px dashed var(--line)", padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px" }}><span style={{ font: "600 18px 'Figtree',sans-serif", letterSpacing: "-.025em" }}>tx-classifier</span><span style={{ font: "500 13px 'Figtree',sans-serif", color: "var(--dim)", flex: "none" }}>No score yet</span></div>
      <div style={{ display: "flex", gap: "7px", flexWrap: "wrap" }}><span style={{ display: "flex", alignItems: "center", gap: "7px", padding: "4px 11px", borderRadius: "999px", border: "1px dashed var(--dim)" }}><span style={{ width: "11px", height: "11px", borderRadius: "3px", border: "1.5px dashed var(--dim)" }}></span><span style={{ font: "600 10px 'DM Mono',monospace", color: "var(--dim)" }}>NEW · NO HISTORY</span></span><span style={{ padding: "4px 11px", borderRadius: "999px", border: "1px solid var(--line)", font: "500 10px 'DM Mono',monospace", color: "var(--dim)" }}>http</span></div>
      <p style={{ margin: "0", font: "400 13px/1.55 'Figtree',sans-serif", color: "var(--dim)" }}>Labels Stellar transactions by intent, payment, swap, liquidity provision, fee. Returns a confidence value per label and an…</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "8px", paddingTop: "12px", borderTop: "1px dashed var(--hair)" }}><div style={{ display: "flex", flexDirection: "column", gap: "2px" }}><span style={{ font: "600 16px 'Figtree',sans-serif", color: "var(--dim)" }}>, </span><span style={{ font: "500 9.5px 'DM Mono',monospace", color: "var(--dim)" }}>PAYERS</span></div><div style={{ display: "flex", flexDirection: "column", gap: "2px" }}><span style={{ font: "600 16px 'Figtree',sans-serif", color: "var(--dim)" }}>, </span><span style={{ font: "500 9.5px 'DM Mono',monospace", color: "var(--dim)" }}>REPEAT</span></div><div style={{ display: "flex", flexDirection: "column", gap: "2px" }}><span style={{ font: "600 16px 'Figtree',sans-serif", letterSpacing: "-.03em" }}>now</span><span style={{ font: "500 9.5px 'DM Mono',monospace", color: "var(--dim)" }}>LISTED</span></div></div>
      </div>
      </div>
      <div style={{ borderRadius: "22px", background: "var(--sky)", color: "#151515", padding: "24px", display: "flex", flexDirection: "column", gap: "10px" }}><span style={{ font: "600 15px 'Figtree',sans-serif", letterSpacing: "-.02em" }}>What happens after</span><span style={{ font: "400 13.5px/1.6 'Figtree',sans-serif", opacity: ".78" }}>Your listing is visible immediately with no payment history, and stays that way until someone pays your address. Then the score and metrics appear on their own.</span></div>
      <div style={{ borderRadius: "22px", background: "var(--ink)", color: "var(--bg)", padding: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
      <span style={{ font: "500 11px 'DM Mono',monospace", opacity: ".6", letterSpacing: ".03em" }}>ON-CHAIN TRANSACTION</span>
      <div style={{ display: "flex", flexDirection: "column", gap: "7px", font: "400 13.5px/1.5 'Figtree',sans-serif" }}><span style={{ opacity: ".72" }}>Your wallet asks you to sign once</span><span style={{ opacity: ".72" }}>Network fee ~0.00001 XLM · One charges nothing</span><span style={{ opacity: ".72" }}>Name, endpoint, description and tags stay editable</span><span style={{ color: "var(--coral)" }}>The payment address does not</span></div>
      </div>
      </div>
      </div>
      </section>
    </>
  );
}
