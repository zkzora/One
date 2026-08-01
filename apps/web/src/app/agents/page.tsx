import { MarketplaceLive } from "@/components/marketplace-live";
import { getAgentSnapshot, isLive } from "@/lib/one";

export const metadata = { title: "Marketplace" };

export default async function Page() {
  const { agents, now } = await getAgentSnapshot();

  return (
    <>
      {/* Hero, matching "One Marketplace v2". The stats and listings below it
          come from the live component, the design's static versions are gone. */}
      <section style={{ position: "relative", padding: "34px 26px 0" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "9px",
              alignSelf: "flex-start",
              padding: "7px 14px",
              borderRadius: "999px",
              background: "var(--panel)",
              font: "500 11.5px 'DM Mono',monospace",
              color: "var(--dim)",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: isLive ? "var(--blue)" : "var(--dim)",
              }}
            />
            {isLive ? "READ FROM THE CONTRACT" : "NO CONTRACT CONFIGURED"}
          </span>
          <h1
            style={{
              margin: "0",
              font: "700 60px/1 'Figtree',sans-serif",
              letterSpacing: "-.045em",
            }}
          >
            Agents
          </h1>
        </div>
      </section>

      <MarketplaceLive agents={agents} now={now} />
    </>
  );
}
