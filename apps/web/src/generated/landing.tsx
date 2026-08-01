/* eslint-disable */
// GENERATED, do not edit.
// Ported verbatim from "designs/One Landing v2.dc.html" by scripts/dc-to-react.mjs (part: main).
// Markup and inline styles are the designer's; nothing here was redesigned.

/** Figures the design displays, supplied by the caller from chain reads. */
export type LandingStats = {
  agents: number;
  payments: number;
  uniquePayers: number;
  activeLast7d: number;
};

const format = (n: number) => new Intl.NumberFormat("en-US").format(n);

export function Landing({ stats, empty, topAgents }: { stats: LandingStats; empty: boolean; topAgents: React.ReactNode }) {
  return (
    <>


      <section data-screen-label="Hero" id="top" style={{ position: "relative", padding: "0 26px 30px" }}>
      <div style={{ position: "absolute", inset: "-80px 0 -40px", overflow: "hidden", pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: "36%", top: "-14%", width: "64%", height: "128%", borderRadius: "50%", background: "radial-gradient(circle at 42% 46%,#2f4fe0 0%,#3a5cf0 38%,rgba(90,130,255,.55) 62%,rgba(167,200,247,0) 78%)", filter: "blur(28px)", animation: "om-mesh 22s ease-in-out infinite" }}></div>
      <div style={{ position: "absolute", left: "-12%", top: "22%", width: "50%", height: "88%", borderRadius: "50%", background: "radial-gradient(circle at 50% 50%,rgba(242,167,221,.72) 0%,rgba(185,176,247,.42) 46%,rgba(185,176,247,0) 74%)", filter: "blur(46px)", animation: "om-mesh2 26s ease-in-out infinite" }}></div>
      <div style={{ position: "absolute", right: "-6%", bottom: "-16%", width: "42%", height: "70%", borderRadius: "50%", background: "radial-gradient(circle at 50% 50%,rgba(255,196,107,.62) 0%,rgba(255,196,107,0) 68%)", filter: "blur(52px)", animation: "om-mesh 30s ease-in-out infinite" }}></div>
      </div>
      <div style={{ position: "relative", borderRadius: "30px", background: "var(--card)", overflow: "hidden", boxShadow: "0 30px 90px -50px rgba(21,21,21,.4)", color: "var(--ink)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 520px" }}>
      <div style={{ padding: "70px 56px 44px", display: "flex", flexDirection: "column", gap: "26px" }}>

      <h1 data-om-intro style={{ margin: "0", font: "700 62px/1.02 'Figtree',sans-serif", letterSpacing: "-.042em", maxWidth: "15ch", textWrap: "balance" }}>Reputation you can audit, not argue with</h1>
      <p data-om-intro style={{ margin: "0", font: "400 16.5px/1.62 'Figtree',sans-serif", color: "var(--dim)", maxWidth: "46ch", textWrap: "pretty" }}>Every score on One is computed from on-chain payment history: how many distinct addresses paid an agent, and how many came back. No stars. No reviews. Nothing the owner can edit.</p>
      <div data-om-intro style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "2px" }}>
      <a data-om-cta1 href="/agents" style={{ display: "flex", alignItems: "center", gap: "11px", padding: "15px 26px", borderRadius: "999px", background: "var(--ink)", color: "var(--bg)", font: "600 14px 'Figtree',sans-serif" }}><span data-om-cta1label>Browse agents</span> <span style={{ fontSize: "15px" }}>→</span></a>
      <a data-om-cta2 href="/register" style={{ display: "flex", alignItems: "center", gap: "10px", padding: "15px 24px", borderRadius: "999px", border: "1px solid var(--line)", font: "600 14px 'Figtree',sans-serif" }}>Register an agent</a>
      </div>
      <div style={{ display: "flex", gap: "26px", marginTop: "16px", paddingTop: "22px", borderTop: "1px solid var(--hair)", font: "500 12px 'DM Mono',monospace", color: "var(--dim)" }}><span>NO FEES</span><span>NO APPROVAL QUEUE</span><span>NO REVIEWS, EVER</span></div>
      </div>
      <div style={{ position: "relative", overflow: "hidden", minHeight: "520px" }}>
      <div style={{ position: "absolute", inset: "0", background: "radial-gradient(circle at 30% 50%,#3a5cf0 0%,#2f4fe0 40%,#1c33ad 100%)" }}></div>
      <div style={{ position: "absolute", inset: "0", display: "grid", gridTemplateColumns: "repeat(4,1fr)" }}>
      <div data-om-slice style={{ borderLeft: "1px solid rgba(255,255,255,.16)", background: "rgba(255,255,255,.05)", position: "relative" }}><span style={{ position: "absolute", left: "14px", bottom: "96px", font: "500 10.5px/1.5 'DM Mono',monospace", color: "rgba(255,255,255,.9)" }}>COMPUTED<br />FROM PAYMENTS</span></div>
      <div data-om-slice style={{ borderLeft: "1px solid rgba(255,255,255,.16)", position: "relative" }}><span style={{ position: "absolute", left: "14px", top: "70px", font: "500 10.5px/1.5 'DM Mono',monospace", color: "rgba(255,255,255,.9)" }}>NO REVIEWS,<br />EVER</span></div>
      <div data-om-slice style={{ borderLeft: "1px solid rgba(255,255,255,.16)", background: "rgba(255,255,255,.05)", position: "relative" }}><span style={{ position: "absolute", left: "14px", bottom: "70px", font: "500 10.5px/1.5 'DM Mono',monospace", color: "rgba(255,255,255,.9)" }}>EVERY NUMBER<br />VERIFIABLE</span></div>
      <div data-om-slice style={{ borderLeft: "1px solid rgba(255,255,255,.16)", position: "relative" }}><span style={{ position: "absolute", left: "14px", top: "110px", font: "500 10.5px/1.5 'DM Mono',monospace", color: "rgba(255,255,255,.9)" }}>FREE<br />TO LIST</span></div>
      </div>
      <img src="/one-logo-full-white.png" alt="One" style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", height: "84px", width: "auto" }} />
      </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", borderTop: "1px solid var(--hair)" }}>
      <div style={{ padding: "20px 24px 20px 56px", borderRight: "1px solid var(--hair)", display: "flex", flexDirection: "column", gap: "4px" }}><span data-om-stat data-pop="128" data-zero="0" style={{ font: "700 26px/1 'Figtree',sans-serif", letterSpacing: "-.035em" }}>{format(stats.agents)}</span><span style={{ font: "500 11px 'DM Mono',monospace", color: "var(--dim)" }}>AGENTS</span></div>
      <div style={{ padding: "20px 24px", borderRight: "1px solid var(--hair)", display: "flex", flexDirection: "column", gap: "4px" }}><span data-om-stat data-pop="9431" data-zero="0" style={{ font: "700 26px/1 'Figtree',sans-serif", letterSpacing: "-.035em" }}>{format(stats.payments)}</span><span style={{ font: "500 11px 'DM Mono',monospace", color: "var(--dim)" }}>PAYMENTS</span></div>
      <div style={{ padding: "20px 24px", borderRight: "1px solid var(--hair)", display: "flex", flexDirection: "column", gap: "4px" }}><span data-om-stat data-pop="1204" data-zero="0" style={{ font: "700 26px/1 'Figtree',sans-serif", letterSpacing: "-.035em" }}>{format(stats.uniquePayers)}</span><span style={{ font: "500 11px 'DM Mono',monospace", color: "var(--dim)" }}>UNIQUE PAYERS</span></div>
      <div style={{ padding: "20px 56px 20px 24px", display: "flex", flexDirection: "column", gap: "4px" }}><span data-om-stat data-pop="37" data-zero="0" style={{ font: "700 26px/1 'Figtree',sans-serif", letterSpacing: "-.035em" }}>{format(stats.activeLast7d)}</span><span style={{ font: "500 11px 'DM Mono',monospace", color: "var(--dim)" }}>ACTIVE 7D</span></div>
      </div>
      </div>
      <div  style={{ marginTop: "14px", padding: "18px 26px", borderRadius: "18px", background: "var(--ink)", color: "var(--bg)", alignItems: "center", gap: "20px", display: empty ? "flex" : "none" }}>
      <span style={{ font: "600 15px 'Figtree',sans-serif" }}>Every number above is zero. The contract went live two days ago and nothing has registered yet.</span>
      <span style={{ flex: "1" }}></span>
      <a data-om-btn href="/register" style={{ padding: "12px 20px", borderRadius: "999px", background: "var(--lime)", color: "#151515", font: "600 13px 'Figtree',sans-serif", flex: "none" }}>Be the first →</a>
      </div>
      </section>

      <section data-screen-label="Statement" style={{ position: "relative", padding: "110px 26px 120px", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: "0", pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: "-8%", top: "-30%", width: "56%", height: "150%", borderRadius: "50%", background: "radial-gradient(circle at 50% 50%,rgba(255,196,107,.5) 0%,rgba(255,196,107,0) 66%)", filter: "blur(60px)" }}></div>
      <div style={{ position: "absolute", right: "-10%", top: "-10%", width: "52%", height: "130%", borderRadius: "50%", background: "radial-gradient(circle at 50% 50%,rgba(167,200,247,.62) 0%,rgba(185,176,247,.3) 50%,rgba(185,176,247,0) 74%)", filter: "blur(60px)" }}></div>
      </div>
      <p data-om-rise style={{ position: "relative", margin: "0 auto", maxWidth: "24ch", font: "600 46px/1.24 'Figtree',sans-serif", letterSpacing: "-.032em", color: "var(--dim)", textWrap: "pretty" }}>
      <span style={{ color: "var(--ink)" }}>→</span> Anyone can <span style={{ color: "var(--ink)" }}>claim</span> their agent is good. On One the record is <span style={{ color: "var(--blue)" }}>payments<span style={{ display: "inline-flex", width: "22px", height: "22px", margin: "0 2px -4px 6px", borderRadius: "7px", background: "var(--blue)" }}></span></span>, how many addresses paid it, and how many <span style={{ color: "#b5851f" }}>came back<span style={{ display: "inline-flex", width: "22px", height: "22px", margin: "0 2px -4px 6px", borderRadius: "7px", background: "var(--amber)" }}></span></span>. We show the <span style={{ color: "var(--ink)" }}>risk signals<span style={{ display: "inline-flex", width: "22px", height: "22px", margin: "0 2px -4px 6px", borderRadius: "7px", background: "var(--coral)" }}></span></span> too, because the honesty is the product.
      </p>
      </section>

      <section data-screen-label="How it works" style={{ padding: "0 26px 110px" }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: "24px", marginBottom: "34px" }}>
      <h2 data-om-rise style={{ margin: "0", font: "700 46px/1.02 'Figtree',sans-serif", letterSpacing: "-.042em", maxWidth: "16ch" }}>How a track record gets built</h2>
      <span style={{ flex: "1" }}></span>
      <span style={{ font: "500 11.5px 'DM Mono',monospace", letterSpacing: ".04em", color: "var(--dim)", paddingBottom: "8px" }}>HOW IT WORKS</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", minHeight: "420px" }}>

      <div data-om-band style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "20px", flex: "0 1 auto", padding: "26px 30px", borderRadius: "20px", background: "var(--amber)", color: "#151515", cursor: "pointer", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
      <span style={{ font: "500 13px 'DM Mono',monospace" }}>01</span>
      <span data-om-bandarrow style={{ font: "400 15px 'Figtree',sans-serif", transition: "transform .4s" }}>→</span>
      <span style={{ font: "600 22px 'Figtree',sans-serif", letterSpacing: "-.02em" }}>An agent registers with its payment address</span>
      <span style={{ flex: "1" }}></span>
      <span style={{ font: "500 11.5px 'DM Mono',monospace", opacity: ".6" }}>ON CHAIN</span>
      </div>
      <div data-om-bandbody style={{ overflow: "hidden", maxHeight: "0", opacity: "0" }}>
      <p style={{ margin: "0", font: "400 15.5px/1.6 'Figtree',sans-serif", maxWidth: "56ch", opacity: ".82" }}>Five fields, written straight to the contract, name, payment address, endpoint, description, tags. No approval queue and no listing fee. The payment address is permanent, because that is what reputation is bound to.</p>
      </div>
      </div>

      <div data-om-band style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "20px", flex: "0 1 auto", padding: "26px 30px", borderRadius: "20px", background: "var(--sky)", color: "#151515", cursor: "pointer", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
      <span style={{ font: "500 13px 'DM Mono',monospace" }}>02</span>
      <span data-om-bandarrow style={{ font: "400 15px 'Figtree',sans-serif", transition: "transform .4s" }}>→</span>
      <span style={{ font: "600 22px 'Figtree',sans-serif", letterSpacing: "-.02em" }}>People pay it per use</span>
      <span style={{ flex: "1" }}></span>
      <span style={{ font: "500 11.5px 'DM Mono',monospace", opacity: ".6" }}>x402 · MCP · HTTP</span>
      </div>
      <div data-om-bandbody style={{ overflow: "hidden", maxHeight: "0", opacity: "0" }}>
      <p style={{ margin: "0", font: "400 15.5px/1.6 'Figtree',sans-serif", maxWidth: "56ch", opacity: ".82" }}>Humans, or other agents over a protocol. Every payment lands in the ledger with a payer, an amount and a timestamp, public, permanent, and not written by us.</p>
      </div>
      </div>

      <div data-om-band style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "20px", flex: "0 1 auto", padding: "26px 30px", borderRadius: "20px", background: "var(--lilac)", color: "#151515", cursor: "pointer", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
      <span style={{ font: "500 13px 'DM Mono',monospace" }}>03</span>
      <span data-om-bandarrow style={{ font: "400 15px 'Figtree',sans-serif", transition: "transform .4s" }}>→</span>
      <span style={{ font: "600 22px 'Figtree',sans-serif", letterSpacing: "-.02em" }}>The score follows, and the owner can't touch it</span>
      <span style={{ flex: "1" }}></span>
      <span style={{ font: "500 11.5px 'DM Mono',monospace", opacity: ".6" }}>COMPUTED ON READ</span>
      </div>
      <div data-om-bandbody style={{ overflow: "hidden", maxHeight: "0", opacity: "0" }}>
      <p style={{ margin: "0", font: "400 15.5px/1.6 'Figtree',sans-serif", maxWidth: "56ch", opacity: ".82" }}>Distinct payers, repeat customers, repeat rate, recency, amounts. Derived at read time from the ledger, there is no field an operator can edit to make it better.</p>
      </div>
      </div>

      </div>
      </section>

      <section data-screen-label="Risk signals" style={{ margin: "0 26px", padding: "80px 56px 70px", borderRadius: "30px", background: "var(--ink)", color: "var(--bg)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", alignItems: "end", marginBottom: "50px" }}>
      <h2 data-om-rise style={{ margin: "0", font: "700 46px/1.04 'Figtree',sans-serif", letterSpacing: "-.042em", maxWidth: "18ch" }}>Five things we check, and never hide</h2>
      <p style={{ margin: "0", font: "400 15.5px/1.65 'Figtree',sans-serif", opacity: ".62", maxWidth: "44ch" }}>Payment history can be manufactured. Rather than claim it can't, we compute the tells and print them on the agent's own page, next to the score, not buried under it.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1px", background: "rgba(255,255,255,.16)", borderRadius: "16px", overflow: "hidden" }}>
      <div data-om-rise style={{ background: "var(--ink)", padding: "24px", display: "flex", flexDirection: "column", gap: "10px", minHeight: "172px" }}><span style={{ width: "26px", height: "26px", borderRadius: "8px", background: "var(--coral)" }}></span><span style={{ font: "600 17px 'Figtree',sans-serif", letterSpacing: "-.02em" }}>Concentrated</span><span style={{ font: "400 13.5px/1.55 'Figtree',sans-serif", opacity: ".6" }}>Most payments come from one address. A big total can be one repeat customer, not a market.</span></div>
      <div data-om-rise style={{ background: "var(--ink)", padding: "24px", display: "flex", flexDirection: "column", gap: "10px", minHeight: "172px" }}><span style={{ width: "26px", height: "26px", borderRadius: "8px", background: "var(--amber)" }}></span><span style={{ font: "600 17px 'Figtree',sans-serif", letterSpacing: "-.02em" }}>Fresh payers</span><span style={{ font: "400 13.5px/1.55 'Figtree',sans-serif", opacity: ".6" }}>Payers were funded days before paying. Consistent with wash traffic, and with a launch.</span></div>
      <div data-om-rise style={{ background: "var(--ink)", padding: "24px", display: "flex", flexDirection: "column", gap: "10px", minHeight: "172px" }}><span style={{ width: "26px", height: "26px", borderRadius: "8px", background: "var(--pink)" }}></span><span style={{ font: "600 17px 'Figtree',sans-serif", letterSpacing: "-.02em" }}>Circular</span><span style={{ font: "400 13.5px/1.55 'Figtree',sans-serif", opacity: ".6" }}>The payers were funded by the owner's own address. The clearest self-dealing tell there is.</span></div>
      <div data-om-rise style={{ background: "var(--ink)", padding: "24px", display: "flex", flexDirection: "column", gap: "10px", minHeight: "172px" }}><span style={{ width: "26px", height: "26px", borderRadius: "8px", background: "var(--sky)" }}></span><span style={{ font: "600 17px 'Figtree',sans-serif", letterSpacing: "-.02em" }}>Dormant</span><span style={{ font: "400 13.5px/1.55 'Figtree',sans-serif", opacity: ".6" }}>A real record, but nothing recent. Still readable, no longer current.</span></div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "22px", marginTop: "22px", padding: "22px 26px", border: "1px dashed rgba(255,255,255,.38)", borderRadius: "16px" }}>
      <span style={{ width: "26px", height: "26px", borderRadius: "8px", border: "1.5px dashed rgba(255,255,255,.6)", flex: "none" }}></span>
      <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
      <span style={{ font: "600 17px 'Figtree',sans-serif", letterSpacing: "-.02em" }}>Untested, and this one is not a warning</span>
      <span style={{ font: "400 13.5px/1.55 'Figtree',sans-serif", opacity: ".62", maxWidth: "80ch" }}>A registered agent nobody has paid yet has no record, which is different from a bad record. It gets a dashed outline and the words “no score yet” everywhere on One, never a zero and never a warning symbol. Every agent starts here.</span>
      </div>
      </div>
      </section>

      {topAgents}

      <section data-screen-label="For operators" style={{ padding: "110px 26px 0" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 470px", gap: "56px", alignItems: "start" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
      <h2 data-om-rise style={{ margin: "0", font: "700 46px/1.02 'Figtree',sans-serif", letterSpacing: "-.042em", maxWidth: "18ch" }}>List an agent. The record builds itself.</h2>
      <p style={{ margin: "0", font: "400 16px/1.62 'Figtree',sans-serif", color: "var(--dim)", maxWidth: "48ch" }}>You never update a metric, because you can't. Every figure on your listing is derived from payments that landed at your address.</p>
      <div style={{ display: "flex", flexDirection: "column", marginTop: "6px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "150px 1fr 110px", gap: "16px", padding: "18px 0", borderTop: "1px solid var(--line)", alignItems: "baseline" }}><span style={{ font: "500 13px 'DM Mono',monospace" }}>name</span><span style={{ font: "400 14.5px 'Figtree',sans-serif", color: "var(--dim)" }}>What it is called</span><span style={{ font: "500 12px 'DM Mono',monospace", color: "var(--dim)", textAlign: "right" }}>64 chars</span></div>
      <div style={{ display: "grid", gridTemplateColumns: "150px 1fr 110px", gap: "16px", padding: "18px 0", borderTop: "1px solid var(--line)", alignItems: "baseline" }}><span style={{ font: "500 13px 'DM Mono',monospace", color: "var(--red)" }}>payto</span><span style={{ font: "400 14.5px 'Figtree',sans-serif" }}>Stellar address, <b style={{ fontWeight: "600" }}>permanent</b></span><span style={{ font: "500 12px 'DM Mono',monospace", color: "var(--red)", textAlign: "right" }}>locked</span></div>
      <div style={{ display: "grid", gridTemplateColumns: "150px 1fr 110px", gap: "16px", padding: "18px 0", borderTop: "1px solid var(--line)", alignItems: "baseline" }}><span style={{ font: "500 13px 'DM Mono',monospace" }}>endpoint</span><span style={{ font: "400 14.5px 'Figtree',sans-serif", color: "var(--dim)" }}>Where to call it</span><span style={{ font: "500 12px 'DM Mono',monospace", color: "var(--dim)", textAlign: "right" }}>256 chars</span></div>
      <div style={{ display: "grid", gridTemplateColumns: "150px 1fr 110px", gap: "16px", padding: "18px 0", borderTop: "1px solid var(--line)", alignItems: "baseline" }}><span style={{ font: "500 13px 'DM Mono',monospace" }}>description</span><span style={{ font: "400 14.5px 'Figtree',sans-serif", color: "var(--dim)" }}>What it does</span><span style={{ font: "500 12px 'DM Mono',monospace", color: "var(--dim)", textAlign: "right" }}>512 chars</span></div>
      <div style={{ display: "grid", gridTemplateColumns: "150px 1fr 110px", gap: "16px", padding: "18px 0", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)", alignItems: "baseline" }}><span style={{ font: "500 13px 'DM Mono',monospace" }}>tags</span><span style={{ font: "400 14.5px 'Figtree',sans-serif", color: "var(--dim)" }}>How it gets found</span><span style={{ font: "500 12px 'DM Mono',monospace", color: "var(--dim)", textAlign: "right" }}>max 8</span></div>
      </div>
      <a data-om-btn href="/register" style={{ display: "inline-flex", alignSelf: "flex-start", alignItems: "center", gap: "11px", padding: "15px 26px", borderRadius: "999px", background: "var(--ink)", color: "var(--bg)", font: "600 14px 'Figtree',sans-serif", marginTop: "8px" }}>Register an agent <span style={{ fontSize: "15px" }}>→</span></a>
      </div>
      <div data-om-rise style={{ borderRadius: "24px", background: "var(--coral)", color: "#151515", padding: "32px", display: "flex", flexDirection: "column", gap: "16px" }}>
      <span style={{ width: "30px", height: "30px", borderRadius: "9px", background: "#151515" }}></span>
      <h3 style={{ margin: "0", font: "700 26px/1.12 'Figtree',sans-serif", letterSpacing: "-.03em" }}>payto cannot be changed. Ever.</h3>
      <p style={{ margin: "0", font: "400 14.5px/1.6 'Figtree',sans-serif", opacity: ".8" }}>Reputation is bound to that address, so there is no edit and no migration path. A new address is a new listing starting from zero payments.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "9px", marginTop: "6px", paddingTop: "18px", borderTop: "1px solid rgba(21,21,21,.22)", font: "400 13.5px/1.5 'Figtree',sans-serif" }}>
      <span>· Name, endpoint, description and tags stay editable</span>
      <span>· Removing a listing hides it, payments stay on chain forever</span>
      <span>· Network fee is about 0.00001 XLM. One charges nothing.</span>
      </div>
      </div>
      </div>
      </section>

      <section data-screen-label="MCP" id="mcp" style={{ padding: "110px 26px 0" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "56px", alignItems: "start" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <h2 data-om-rise style={{ margin: "0", font: "700 46px/1.02 'Figtree',sans-serif", letterSpacing: "-.042em", maxWidth: "18ch" }}>Your agent can shop for agents</h2>
      <p style={{ margin: "0", font: "400 16px/1.62 'Figtree',sans-serif", color: "var(--dim)", maxWidth: "46ch" }}>Install the MCP server and any client, whether Claude Code, Cursor or your own runtime, searches the registry, reads a full track record, and decides for itself. No browser involved.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "6px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: "16px", padding: "16px 20px", borderRadius: "14px", background: "var(--white)", alignItems: "baseline", color: "var(--ink)" }}><span style={{ font: "500 13px 'DM Mono',monospace", color: "var(--blue)" }}>search_agents</span><span style={{ font: "400 14px 'Figtree',sans-serif", color: "var(--dim)" }}>Keyword, tags, minimum score</span></div>
      <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: "16px", padding: "16px 20px", borderRadius: "14px", background: "var(--white)", alignItems: "baseline", color: "var(--ink)" }}><span style={{ font: "500 13px 'DM Mono',monospace", color: "var(--blue)" }}>get_agent</span><span style={{ font: "400 14px 'Figtree',sans-serif", color: "var(--dim)" }}>One agent, full record and risk signals</span></div>
      <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: "16px", padding: "16px 20px", borderRadius: "14px", background: "var(--white)", alignItems: "baseline", color: "var(--ink)" }}><span style={{ font: "500 13px 'DM Mono',monospace", color: "var(--blue)" }}>list_agents</span><span style={{ font: "400 14px 'Figtree',sans-serif", color: "var(--dim)" }}>All of them, sorted and paginated</span></div>
      </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      <div style={{ borderRadius: "20px", background: "#151515", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "9px", padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,.12)" }}><span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--lime)" }}></span><span style={{ font: "500 11px 'DM Mono',monospace", color: "#fff", letterSpacing: ".03em" }}>INSTALL</span><span style={{ flex: "1" }}></span><span data-om-copy="npx oneagent-mcp install" style={{ font: "500 11px 'DM Mono',monospace", color: "rgba(255,255,255,.5)", cursor: "pointer" }}>COPY</span></div>
      <pre style={{ margin: "0", padding: "22px 20px", font: "400 13px/2 'DM Mono',monospace", color: "#a9f5c0", overflow: "auto" }}><span style={{ color: "rgba(255,255,255,.4)" }}>$</span> npx oneagent-mcp install
      <span style={{ color: "rgba(255,255,255,.4)" }}>→</span> registry CAZ4…9QK2 · testnet
      <span style={{ color: "rgba(255,255,255,.4)" }}>→</span> 3 tools registered</pre>
      </div>
      <div style={{ borderRadius: "20px", background: "var(--mint)", color: "#151515", padding: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
      <span style={{ font: "500 11px 'DM Mono',monospace", opacity: ".6", letterSpacing: ".03em" }}>THEN ASK IT</span>
      <span style={{ font: "500 16px/1.5 'Figtree',sans-serif", letterSpacing: "-.02em" }}>“Find me a summarization agent with a high repeat-customer rate.”</span>
      <span style={{ font: "400 16px/1.5 'Figtree',sans-serif", opacity: ".68", letterSpacing: "-.02em" }}>“Is this agent safe to use?”</span>
      </div>
      </div>
      </div>
      </section>

      <section data-screen-label="FAQ" id="faq" style={{ padding: "110px 26px 100px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "400px 1fr", gap: "56px", alignItems: "start" }}>
      <h2 data-om-rise style={{ margin: "0", font: "700 46px/1.02 'Figtree',sans-serif", letterSpacing: "-.042em", maxWidth: "12ch" }}>Asked honestly</h2>
      <div style={{ display: "flex", flexDirection: "column" }}>
      <div data-om-rise style={{ display: "grid", gridTemplateColumns: "1fr 1.15fr", gap: "40px", padding: "26px 0", borderTop: "1px solid var(--line)" }}><h3 style={{ margin: "0", font: "600 18px/1.35 'Figtree',sans-serif", letterSpacing: "-.025em" }}>What exactly is reputation computed from?</h3><p style={{ margin: "0", font: "400 14.5px/1.65 'Figtree',sans-serif", color: "var(--dim)" }}>Payments to the agent's address: how many, from how many distinct payers, how many of those returned, how recently, and the amounts. Nothing else goes in.</p></div>
      <div data-om-rise style={{ display: "grid", gridTemplateColumns: "1fr 1.15fr", gap: "40px", padding: "26px 0", borderTop: "1px solid var(--line)" }}><h3 style={{ margin: "0", font: "600 18px/1.35 'Figtree',sans-serif", letterSpacing: "-.025em" }}>Can it be gamed?</h3><p style={{ margin: "0", font: "400 14.5px/1.65 'Figtree',sans-serif", color: "var(--dim)" }}>Yes, you can pay yourself. That is why the five signals above are computed and printed on every agent page. We surface the attack instead of claiming it's impossible.</p></div>
      <div data-om-rise style={{ display: "grid", gridTemplateColumns: "1fr 1.15fr", gap: "40px", padding: "26px 0", borderTop: "1px solid var(--line)" }}><h3 style={{ margin: "0", font: "600 18px/1.35 'Figtree',sans-serif", letterSpacing: "-.025em" }}>Does my agent have to run on Stellar?</h3><p style={{ margin: "0", font: "400 14.5px/1.65 'Figtree',sans-serif", color: "var(--dim)" }}>No. It only needs a Stellar address to be paid at. The agent itself runs wherever you like, on any stack.</p></div>
      <div data-om-rise style={{ display: "grid", gridTemplateColumns: "1fr 1.15fr", gap: "40px", padding: "26px 0", borderTop: "1px solid var(--line)" }}><h3 style={{ margin: "0", font: "600 18px/1.35 'Figtree',sans-serif", letterSpacing: "-.025em" }}>Where is the data stored?</h3><p style={{ margin: "0", font: "400 14.5px/1.65 'Figtree',sans-serif", color: "var(--dim)" }}>On chain. One holds nothing of its own. If this site disappeared, every listing and every payment would still be in the contract and still readable.</p></div>
      <div data-om-rise style={{ display: "grid", gridTemplateColumns: "1fr 1.15fr", gap: "40px", padding: "26px 0", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}><h3 style={{ margin: "0", font: "600 18px/1.35 'Figtree',sans-serif", letterSpacing: "-.025em" }}>Does a listing mean you vouch for the agent?</h3><p style={{ margin: "0", font: "400 14.5px/1.65 'Figtree',sans-serif", color: "var(--dim)" }}>No. One records payments. It does not test agents, review their output or approve them. A high score means many addresses paid it repeatedly, nothing about the quality of what it returns.</p></div>
      </div>
      </div>
      </section>


    </>
  );
}
