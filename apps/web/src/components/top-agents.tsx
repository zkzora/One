import Link from "next/link";
import type { Agent } from "@one/indexer";

/**
 * The landing page's "Ranked by money that moved" section.
 *
 * Fills the slot the design's sample cards used to occupy. If nothing is
 * registered the section renders as an invitation rather than an empty grid, * on launch day that is the honest state, not an error.
 */
export function TopAgents({ agents, now }: { agents: Agent[]; now: number }) {
  return (
    <section style={{ position: "relative", padding: "110px 26px 0" }}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: "24px",
          marginBottom: "28px",
        }}
      >
        <h2
          style={{
            margin: 0,
            font: "700 46px/1.02 'Figtree',sans-serif",
            letterSpacing: "-.042em",
            maxWidth: "16ch",
          }}
        >
          Ranked by money that moved
        </h2>
        {agents.length > 0 && (
          <Link
            href="/agents"
            style={{
              font: "600 13.5px 'Figtree',sans-serif",
              color: "var(--blue)",
              whiteSpace: "nowrap",
            }}
          >
            All {agents.length === 1 ? "agents" : `${agents.length} agents`} →
          </Link>
        )}
      </div>

      {agents.length === 0 ? (
        <div
          style={{
            padding: "56px 26px",
            borderRadius: "22px",
            border: "1.5px dashed var(--line)",
            textAlign: "center",
          }}
        >
          <p style={{ margin: 0, font: "700 22px 'Figtree',sans-serif", letterSpacing: "-.02em" }}>
            Nothing listed yet
          </p>
          <p
            style={{
              margin: "10px auto 0",
              maxWidth: "42ch",
              font: "400 15px/1.6 'Figtree',sans-serif",
              color: "var(--dim)",
            }}
          >
            The registry is live and empty. The first agent to register will sit here on
            its own.
          </p>
          <Link
            href="/dashboard"
            style={{
              display: "inline-block",
              marginTop: "22px",
              padding: "12px 24px",
              borderRadius: "999px",
              background: "var(--blue)",
              color: "#fff",
              font: "600 14px 'Figtree',sans-serif",
            }}
          >
            Register an agent →
          </Link>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))",
            gap: "12px",
          }}
        >
          {agents.map((agent) => (
            <Card key={agent.contract} agent={agent} now={now} />
          ))}
        </div>
      )}
    </section>
  );
}

function Card({ agent, now }: { agent: Agent; now: number }) {
  const { reputation: rep } = agent;
  const untested = !rep.hasRecord;

  return (
    <Link
      href={`/agents/${agent.contract}`}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        padding: "24px",
        borderRadius: "22px",
        background: "var(--white)",
        // Dashed, never a warning colour: a listing with no record is new,
        // not bad.
        border: untested ? "1.5px dashed var(--line)" : "1.5px solid transparent",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "9px", flexWrap: "wrap" }}>
        <span style={{ font: "600 17px/1.2 'Figtree',sans-serif", letterSpacing: "-.02em" }}>
          {agent.name}
        </span>
        <span
          style={{
            padding: "3px 10px",
            borderRadius: "999px",
            background: "var(--panel)",
            font: "500 10.5px 'DM Mono',monospace",
            color: "var(--dim)",
          }}
        >
          {protocolOf(agent.endpoint)}
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
        {untested ? (
          <span
            style={{
              font: "400 15px 'Figtree',sans-serif",
              color: "var(--dim)",
              fontStyle: "italic",
            }}
          >
            No score yet
          </span>
        ) : (
          <span
            style={{
              font: "700 34px/1 'Figtree',sans-serif",
              letterSpacing: "-.05em",
              color: "var(--blue)",
            }}
          >
            {rep.score}
          </span>
        )}
        <span style={{ font: "500 10.5px 'DM Mono',monospace", color: "var(--dim)" }}>
          {statusOf(agent)}
        </span>
      </div>

      <p
        style={{
          margin: 0,
          font: "400 13.5px/1.55 'Figtree',sans-serif",
          color: "var(--dim)",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {agent.description}
      </p>

      {rep.signals.length > 0 && (
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {rep.signals.map((signal) => (
            <span
              key={signal}
              style={{
                padding: "3px 9px",
                borderRadius: "999px",
                border: "1px solid var(--coral)",
                color: "var(--coral)",
                font: "500 10px 'DM Mono',monospace",
              }}
            >
              {signal.toUpperCase()}
            </span>
          ))}
        </div>
      )}

      <dl
        style={{
          margin: "4px 0 0",
          paddingTop: "14px",
          borderTop: "1px solid var(--hair)",
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: "10px",
        }}
      >
        <Metric label="PAYERS" value={untested ? ", " : String(rep.uniquePayers)} />
        <Metric label="REPEAT" value={untested ? ", " : `${rep.repeatRate}%`} />
        <Metric
          label={untested ? "LISTED" : "ACTIVE"}
          value={ago(untested ? agent.registeredAt : (rep.lastPaymentAt ?? 0), now)}
        />
      </dl>
    </Link>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dd style={{ margin: 0, font: "600 15px 'Figtree',sans-serif" }}>{value}</dd>
      <dt style={{ marginTop: "2px", font: "500 10px 'DM Mono',monospace", color: "var(--dim)" }}>
        {label}
      </dt>
    </div>
  );
}

function statusOf(agent: Agent): string {
  const { reputation: rep } = agent;
  if (!rep.hasRecord) return "NEW · NO HISTORY";
  if (rep.signals.includes("dormant")) return "INACTIVE";
  if (rep.uniquePayers < 10) return "THIN RECORD";
  return "ESTABLISHED";
}

function protocolOf(endpoint: string): string {
  const url = endpoint.toLowerCase();
  if (url.includes("x402")) return "x402";
  if (url.includes("mcp")) return "MCP";
  return "http";
}

function ago(unixSeconds: number, now: number): string {
  if (!unixSeconds) return ", ";
  const seconds = Math.max(0, now - unixSeconds);
  const units: Array<[number, string]> = [
    [31_536_000, "y"],
    [2_592_000, "mo"],
    [86_400, "d"],
    [3_600, "h"],
    [60, "m"],
  ];
  for (const [size, suffix] of units) {
    if (seconds >= size) return `${Math.floor(seconds / size)}${suffix}`;
  }
  return "now";
}
