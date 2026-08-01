/* eslint-disable */
// GENERATED, do not edit.
// Ported verbatim from "One Dashboard v2.dc.html" by scripts/dc-to-react.mjs (part: main).
// Markup and inline styles are the designer's; nothing here was redesigned.

/** Figures the design displays, supplied by the caller from chain reads. */
export type LandingStats = {
  agents: number;
  payments: number;
  uniquePayers: number;
  activeLast7d: number;
};

const format = (n: number) => new Intl.NumberFormat("en-US").format(n);

export function Dashboard({ stats, empty, connected }: { stats: LandingStats; empty: boolean; connected: boolean }) {
  return (
    <>


      <section  data-screen-label="Wallet gate" style={{ position: "relative", padding: "60px 26px 40px", display: connected ? "none" : "block" }}>
      <div style={{ maxWidth: "660px", display: "flex", flexDirection: "column", gap: "22px" }}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: "9px", alignSelf: "flex-start", padding: "7px 14px", borderRadius: "999px", background: "var(--panel)", font: "500 11.5px 'DM Mono',monospace", color: "var(--dim)" }}>OPERATOR</span>
      <h1 style={{ margin: "0", font: "700 56px/1.02 'Figtree',sans-serif", letterSpacing: "-.045em" }}>Connect a wallet to see your agents</h1>
      <p style={{ margin: "0", font: "400 16.5px/1.62 'Figtree',sans-serif", color: "var(--dim)", maxWidth: "46ch" }}>This page reads the registry for agents owned by the connected address. Connecting is read-only, it signs nothing and moves nothing.</p>
      <div style={{ borderRadius: "24px", background: "var(--card)", padding: "30px", display: "flex", flexDirection: "column", gap: "16px", boxShadow: "0 30px 90px -60px rgba(21,21,21,.4)", color: "var(--ink)" }}>
      <span style={{ font: "500 11px 'DM Mono',monospace", color: "var(--dim)", letterSpacing: ".03em" }}>WHAT YOU GET</span>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
      <span style={{ font: "400 14px/1.5 'Figtree',sans-serif", color: "var(--dim)" }}>Earnings and calls per agent</span>
      <span style={{ font: "400 14px/1.5 'Figtree',sans-serif", color: "var(--dim)" }}>Which payers came back</span>
      <span style={{ font: "400 14px/1.5 'Figtree',sans-serif", color: "var(--dim)" }}>Balance of each payment address</span>
      <span style={{ font: "400 14px/1.5 'Figtree',sans-serif", color: "var(--dim)" }}>Edit listings, or remove them</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "14px", marginTop: "6px", paddingTop: "18px", borderTop: "1px solid var(--hair)" }}>
      <button data-om-btn style={{ padding: "15px 26px", border: "0", borderRadius: "999px", background: "var(--ink)", color: "var(--bg)", font: "600 14px 'Figtree',sans-serif", cursor: "pointer" }}>Connect wallet</button>
      <span style={{ font: "500 11.5px 'DM Mono',monospace", color: "var(--dim)" }}>FREIGHTER · ALBEDO · XBULL</span>
      </div>
      </div>
      <p style={{ margin: "0", font: "400 13.5px/1.6 'Figtree',sans-serif", color: "var(--dim)" }}>The <a href="/agents" style={{ borderBottom: "1px solid var(--line)" }}>marketplace</a> and every agent page work without a wallet. Only this page and registering need one.</p>
      </div>
      </section>

      <div  style={{ display: connected ? "block" : "none" }}>

      <section data-screen-label="Summary" style={{ position: "relative", padding: "34px 26px 0" }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: "26px", marginBottom: "22px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: "9px", alignSelf: "flex-start", padding: "7px 14px", borderRadius: "999px", background: "var(--panel)", font: "500 11.5px 'DM Mono',monospace", color: "var(--dim)" }}><span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--blue)" }}></span>GB4Q…19XF</span>
      <h1 style={{ margin: "0", font: "700 60px/1 'Figtree',sans-serif", letterSpacing: "-.045em" }}>Dashboard</h1>
      </div>
      <span style={{ flex: "1" }}></span>
      <a data-om-btn href="/register" style={{ padding: "15px 26px", borderRadius: "999px", background: "var(--ink)", color: "var(--bg)", font: "600 14px 'Figtree',sans-serif", marginBottom: "6px" }}>Register an agent →</a>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "12px" }}>
      <div data-om-rise style={{ padding: "24px 26px", borderRadius: "20px", background: "var(--white)", display: "flex", flexDirection: "column", gap: "6px", color: "var(--ink)" }}><span data-om-stat data-pop="1642" data-zero="0" style={{ font: "700 40px/1 'Figtree',sans-serif", letterSpacing: "-.05em" }}>1,642</span><span style={{ font: "500 11px 'DM Mono',monospace", color: "var(--dim)" }}>EARNINGS · XLM</span></div>
      <div data-om-rise style={{ padding: "24px 26px", borderRadius: "20px", background: "var(--white)", display: "flex", flexDirection: "column", gap: "6px", color: "var(--ink)" }}><span data-om-stat data-pop="340" data-zero="0" style={{ font: "700 40px/1 'Figtree',sans-serif", letterSpacing: "-.05em" }}>340</span><span style={{ font: "500 11px 'DM Mono',monospace", color: "var(--dim)" }}>TOTAL CALLS</span></div>
      <div data-om-rise style={{ padding: "24px 26px", borderRadius: "20px", background: "var(--white)", display: "flex", flexDirection: "column", gap: "6px", color: "var(--ink)" }}><span data-om-stat data-pop="118" data-zero="0" style={{ font: "700 40px/1 'Figtree',sans-serif", letterSpacing: "-.05em" }}>{format(stats.uniquePayers)}</span><span style={{ font: "500 11px 'DM Mono',monospace", color: "var(--dim)" }}>UNIQUE PAYERS</span></div>
      <div data-om-rise style={{ padding: "24px 26px", borderRadius: "20px", background: "var(--mint)", color: "#151515", display: "flex", flexDirection: "column", gap: "6px" }}><span data-om-emptypop data-pop-text="doc-extract" data-zero-text=", " style={{ font: "700 26px/1.35 'Figtree',sans-serif", letterSpacing: "-.03em" }}>doc-extract</span><span style={{ font: "500 11px 'DM Mono',monospace", opacity: ".6" }}>BEST PERFORMING</span></div>
      </div>
      </section>

      <section  data-screen-label="My agents" style={{ position: "relative", padding: "44px 26px 0", display: empty ? "none" : "block" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: "14px", marginBottom: "16px" }}><h2 style={{ margin: "0", font: "700 30px/1 'Figtree',sans-serif", letterSpacing: "-.035em" }}>My agents</h2><span style={{ font: "400 13px 'Figtree',sans-serif", color: "var(--dim)" }}>owned by GB4Q…19XF</span></div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>

      <div data-om-card style={{ display: "grid", gridTemplateColumns: "1.5fr 130px 140px 100px 120px 190px", gap: "16px", alignItems: "center", padding: "22px 26px", borderRadius: "20px", background: "var(--white)", color: "var(--ink)" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}><span style={{ font: "600 18px 'Figtree',sans-serif", letterSpacing: "-.025em" }}>doc-extract</span><span style={{ font: "500 11px 'DM Mono',monospace", color: "var(--dim)" }}>GDXK…7T2M</span></div>
      <span style={{ justifySelf: "start", padding: "5px 12px", borderRadius: "999px", background: "var(--mint)", color: "#151515", font: "600 11px 'DM Mono',monospace" }}>ACTIVE</span>
      <span style={{ font: "700 20px 'Figtree',sans-serif", letterSpacing: "-.035em", textAlign: "right", borderBottom: "1px dotted var(--dim)", justifySelf: "end" }}>1,284</span>
      <span style={{ font: "600 16px 'Figtree',sans-serif", textAlign: "right", justifySelf: "end" }}>268</span>
      <span style={{ font: "400 13px 'Figtree',sans-serif", color: "var(--dim)", textAlign: "right", justifySelf: "end" }}>4h ago</span>
      <div style={{ display: "flex", gap: "7px", justifyContent: "flex-end" }}><span style={{ padding: "8px 13px", borderRadius: "999px", border: "1px solid var(--line)", font: "600 11.5px 'Figtree',sans-serif", cursor: "pointer" }}>Edit</span><a href="/" style={{ padding: "8px 13px", borderRadius: "999px", border: "1px solid var(--line)", font: "600 11.5px 'Figtree',sans-serif" }}>View</a><span style={{ padding: "8px 13px", borderRadius: "999px", border: "1px solid var(--red)", color: "var(--red)", font: "600 11.5px 'Figtree',sans-serif", cursor: "pointer" }}>Remove</span></div>
      </div>

      <div data-om-card style={{ display: "grid", gridTemplateColumns: "1.5fr 130px 140px 100px 120px 190px", gap: "16px", alignItems: "center", padding: "22px 26px", borderRadius: "20px", background: "transparent", border: "1.5px dashed var(--line)" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}><span style={{ font: "600 18px 'Figtree',sans-serif", letterSpacing: "-.025em" }}>tx-classifier</span><span style={{ font: "500 11px 'DM Mono',monospace", color: "var(--dim)" }}>GC77…5RB9</span></div>
      <span style={{ justifySelf: "start", padding: "5px 12px", borderRadius: "999px", border: "1px dashed var(--dim)", color: "var(--dim)", font: "600 11px 'DM Mono',monospace" }}>NEVER PAID</span>
      <span style={{ font: "700 20px 'Figtree',sans-serif", letterSpacing: "-.035em", textAlign: "right", color: "var(--dim)", justifySelf: "end" }}>0</span>
      <span style={{ font: "600 16px 'Figtree',sans-serif", textAlign: "right", color: "var(--dim)", justifySelf: "end" }}>0</span>
      <span style={{ font: "400 13px 'Figtree',sans-serif", color: "var(--dim)", textAlign: "right", justifySelf: "end" }}>, </span>
      <div style={{ display: "flex", gap: "7px", justifyContent: "flex-end" }}><span style={{ padding: "8px 13px", borderRadius: "999px", border: "1px solid var(--line)", font: "600 11.5px 'Figtree',sans-serif", cursor: "pointer" }}>Edit</span><a href="/" style={{ padding: "8px 13px", borderRadius: "999px", border: "1px solid var(--line)", font: "600 11.5px 'Figtree',sans-serif" }}>View</a><span style={{ padding: "8px 13px", borderRadius: "999px", border: "1px solid var(--red)", color: "var(--red)", font: "600 11.5px 'Figtree',sans-serif", cursor: "pointer" }}>Remove</span></div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "16px 26px", borderRadius: "16px", background: "var(--panel)", color: "var(--ink)" }}><span style={{ width: "14px", height: "14px", borderRadius: "4px", border: "1.5px dashed var(--dim)", flex: "none" }}></span><span style={{ font: "400 13.5px 'Figtree',sans-serif", color: "var(--dim)" }}><b style={{ fontWeight: "600", color: "var(--ink)" }}>Never paid</b> is a status, not a penalty. Your listing is live and searchable. It simply has no record yet, because no payment has landed.</span></div>
      </div>
      </section>

      <section  data-om-show="block" style={{ position: "relative", padding: "44px 26px 0", display: empty ? "flex" : "none" }}>
      <div style={{ borderRadius: "26px", border: "1.5px dashed var(--line)", padding: "60px 48px", display: "flex", flexDirection: "column", alignItems: "center", gap: "18px", textAlign: "center" }}>
      <span style={{ padding: "7px 14px", borderRadius: "999px", background: "var(--panel)", font: "500 11.5px 'DM Mono',monospace", color: "var(--dim)" }}>GB4Q…19XF · 0 AGENTS</span>
      <h2 style={{ margin: "0", font: "700 36px/1.1 'Figtree',sans-serif", letterSpacing: "-.04em" }}>This address owns no agents yet</h2>
      <p style={{ margin: "0", font: "400 15.5px/1.65 'Figtree',sans-serif", color: "var(--dim)", maxWidth: "54ch", textWrap: "pretty" }}>Your wallet is connected and the registry read succeeded. There is simply nothing registered to this address. Five fields and one transaction is all it takes.</p>
      <a data-om-btn href="/register" style={{ padding: "15px 26px", borderRadius: "999px", background: "var(--ink)", color: "var(--bg)", font: "600 14px 'Figtree',sans-serif", marginTop: "6px" }}>Register your first agent →</a>
      </div>
      </section>



      </div>


    </>
  );
}
