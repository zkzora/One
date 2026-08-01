"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Agent, RiskSignal } from "@one/indexer";

/**
 * The working marketplace.
 *
 * Styling is lifted from "One Marketplace v2.dc.html" so the functional version
 * is visually identical to the design; the difference is that these controls
 * actually filter, and every figure comes from the chain.
 */

type Sort = "score" | "payers" | "repeat" | "recent" | "newest";

const SORTS: Array<{ id: Sort; label: string }> = [
  { id: "score", label: "Highest score" },
  { id: "payers", label: "Most payers" },
  { id: "repeat", label: "Most repeat customers" },
  { id: "recent", label: "Last active" },
  { id: "newest", label: "Newest" },
];

const SIGNAL_LABELS: Record<RiskSignal, string> = {
  concentrated: "Concentrated",
  fresh: "Fresh payers",
  circular: "Circular",
  dormant: "Dormant",
};

export function MarketplaceLive({ agents, now }: { agents: Agent[]; now: number }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("score");
  const [tags, setTags] = useState<string[]>([]);
  const [activeOnly, setActiveOnly] = useState(false);
  // Off by default on purpose: an agent with no record is still discoverable,
  // because "never used" is not the same as "bad".
  const [withHistoryOnly, setWithHistoryOnly] = useState(false);
  const [tagsOpen, setTagsOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const allTags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const agent of agents) {
      for (const tag of agent.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([tag]) => tag);
  }, [agents]);

  const stats = useMemo(() => {
    return {
      registered: agents.length,
      active7d: agents.filter(
        (a) =>
          a.reputation.lastPaymentAt !== null &&
          now - a.reputation.lastPaymentAt <= 7 * 86_400
      ).length,
      neverPaid: agents.filter((a) => !a.reputation.hasRecord).length,
    };
  }, [agents, now]);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();

    let list = agents.filter((agent) => {
      if (withHistoryOnly && !agent.reputation.hasRecord) return false;
      if (activeOnly && agent.reputation.signals.includes("dormant")) return false;
      if (tags.length > 0 && !tags.every((t) => agent.tags.includes(t))) return false;
      if (!q) return true;
      return (
        agent.name.toLowerCase().includes(q) ||
        agent.description.toLowerCase().includes(q) ||
        agent.tags.some((t) => t.toLowerCase().includes(q))
      );
    });

    list = [...list].sort((a, b) => {
      // Listings with no record sort last in every mode rather than sorting
      // lowest, so they read as unranked instead of worst.
      if (a.reputation.hasRecord !== b.reputation.hasRecord) {
        return a.reputation.hasRecord ? -1 : 1;
      }
      switch (sort) {
        case "payers":
          return b.reputation.uniquePayers - a.reputation.uniquePayers;
        case "repeat":
          return b.reputation.repeatRate - a.reputation.repeatRate;
        case "recent":
          return (b.reputation.lastPaymentAt ?? 0) - (a.reputation.lastPaymentAt ?? 0);
        case "newest":
          return b.registeredAt - a.registeredAt;
        default:
          return b.reputation.score - a.reputation.score;
      }
    });

    return list;
  }, [agents, query, sort, tags, activeOnly, withHistoryOnly]);

  const sortLabel = SORTS.find((s) => s.id === sort)?.label ?? "Highest score";

  return (
    <>
      <section style={{ position: "relative", padding: "30px 26px 0" }}>
        <div style={{ display: "flex", gap: "12px", marginBottom: "22px", flexWrap: "wrap" }}>
          <Stat value={stats.registered} label="REGISTERED" />
          <Stat value={stats.active7d} label="ACTIVE 7D" />
          <Stat value={stats.neverPaid} label="NEVER PAID" dashed />
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "stretch", marginBottom: "14px" }}>
          <div
            style={{
              flex: "1",
              display: "flex",
              alignItems: "center",
              gap: "13px",
              padding: "0 22px",
              height: "56px",
              borderRadius: "999px",
              background: "var(--white)",
            }}
          >
            <span style={{ font: "400 15px 'Figtree',sans-serif", color: "var(--dim)" }}>⌕</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, description, tags"
              aria-label="Search agents"
              style={{
                flex: 1,
                border: 0,
                outline: "none",
                background: "transparent",
                font: "400 15px 'Figtree',sans-serif",
                color: "var(--ink)",
              }}
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                style={{
                  border: 0,
                  background: "transparent",
                  cursor: "pointer",
                  color: "var(--dim)",
                  font: "400 15px 'Figtree',sans-serif",
                }}
              >
                ×
              </button>
            )}
          </div>

          <div style={{ position: "relative" }}>
            <button
              type="button"
              onClick={() => {
                setSortOpen((v) => !v);
                setTagsOpen(false);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "0 24px",
                height: "56px",
                border: "0",
                borderRadius: "999px",
                background: "var(--white)",
                color: "var(--ink)",
                font: "600 13.5px 'Figtree',sans-serif",
                cursor: "pointer",
              }}
            >
              {sortLabel} <span style={{ color: "var(--dim)" }}>▾</span>
            </button>
            {sortOpen && (
              <Menu>
                {SORTS.map((option) => (
                  <MenuItem
                    key={option.id}
                    selected={option.id === sort}
                    onClick={() => {
                      setSort(option.id);
                      setSortOpen(false);
                    }}
                  >
                    {option.label}
                  </MenuItem>
                ))}
              </Menu>
            )}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "9px",
            flexWrap: "wrap",
            marginBottom: "22px",
          }}
        >
          <div style={{ position: "relative" }}>
            <Chip
              onClick={() => {
                setTagsOpen((v) => !v);
                setSortOpen(false);
              }}
              active={tags.length > 0}
            >
              {tags.length > 0 ? `Tags · ${tags.length}` : "Tags"} ▾
            </Chip>
            {tagsOpen && (
              <Menu>
                {allTags.length === 0 && (
                  <span style={{ padding: "10px 14px", color: "var(--dim)", font: "400 13px 'Figtree',sans-serif" }}>
                    No tags yet
                  </span>
                )}
                {allTags.map((tag) => (
                  <MenuItem
                    key={tag}
                    selected={tags.includes(tag)}
                    onClick={() =>
                      setTags((current) =>
                        current.includes(tag)
                          ? current.filter((t) => t !== tag)
                          : [...current, tag]
                      )
                    }
                  >
                    {tag}
                  </MenuItem>
                ))}
              </Menu>
            )}
          </div>

          <Chip active={activeOnly} onClick={() => setActiveOnly((v) => !v)}>
            Active only {activeOnly && "×"}
          </Chip>

          <Chip
            dashed
            active={withHistoryOnly}
            onClick={() => setWithHistoryOnly((v) => !v)}
          >
            Has payment history {withHistoryOnly && "×"}
          </Chip>

          <span
            style={{
              font: "400 12px 'Figtree',sans-serif",
              color: "var(--dim)",
              marginLeft: "6px",
            }}
          >
            Off by default, so agents with no record are still discoverable.
          </span>
        </div>
      </section>

      <section
        style={{
          position: "relative",
          padding: "0 26px 100px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {shown.length === 0 ? (
          <Empty hasAgents={agents.length > 0} />
        ) : (
          shown.map((agent) => <Card key={agent.contract} agent={agent} now={now} />)
        )}
      </section>
    </>
  );
}

function Card({ agent, now }: { agent: Agent; now: number }) {
  const { reputation: rep } = agent;
  const untested = !rep.hasRecord;

  return (
    <Link
      href={`/agents/${agent.contract}`}
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 300px",
        borderRadius: "22px",
        background: "var(--white)",
        overflow: "hidden",
        // Dashed for a listing with no record: different from a bad one.
        border: untested ? "1.5px dashed var(--line)" : "1.5px solid transparent",
      }}
    >
      <div style={{ padding: "26px 28px", display: "flex", flexDirection: "column", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "11px", flexWrap: "wrap" }}>
          <span style={{ font: "600 22px/1.2 'Figtree',sans-serif", letterSpacing: "-.03em" }}>
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
          {rep.signals.map((signal) => (
            <span
              key={signal}
              style={{
                padding: "3px 10px",
                borderRadius: "999px",
                border: "1px solid var(--coral)",
                color: "var(--coral)",
                font: "500 10.5px 'DM Mono',monospace",
              }}
            >
              {SIGNAL_LABELS[signal].toUpperCase()}
            </span>
          ))}
        </div>

        <p
          style={{
            margin: "0",
            font: "400 14.5px/1.6 'Figtree',sans-serif",
            color: "var(--dim)",
            maxWidth: "66ch",
          }}
        >
          {agent.description}
        </p>

        {agent.tags.length > 0 && (
          <div style={{ display: "flex", gap: "7px", flexWrap: "wrap", marginTop: "2px" }}>
            {agent.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  padding: "4px 11px",
                  borderRadius: "999px",
                  background: "var(--panel)",
                  font: "500 11.5px 'Figtree',sans-serif",
                  color: "var(--dim)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div
        style={{
          padding: "26px 28px",
          background: "var(--bg)",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: "11px" }}>
          {untested ? (
            <span
              style={{
                font: "400 17px 'Figtree',sans-serif",
                color: "var(--dim)",
                fontStyle: "italic",
              }}
            >
              No score yet
            </span>
          ) : (
            <span
              style={{
                font: "700 40px/1 'Figtree',sans-serif",
                letterSpacing: "-.05em",
                color: "var(--blue)",
              }}
            >
              {rep.score}
            </span>
          )}
          <span style={{ font: "500 11px 'DM Mono',monospace", color: "var(--dim)" }}>
            {statusOf(agent)}
          </span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: "7px 14px",
            font: "400 13px 'Figtree',sans-serif",
          }}
        >
          <Row label="Unique payers" value={untested ? ", " : String(rep.uniquePayers)} dotted />
          <Row label="Repeat customers" value={untested ? ", " : `${rep.repeatRate}%`} dotted />
          <Row
            label={untested ? "Listed" : "Last active"}
            value={untested ? ago(agent.registeredAt, now) : ago(rep.lastPaymentAt ?? 0, now)}
          />
        </div>
      </div>
    </Link>
  );
}

function Row({ label, value, dotted }: { label: string; value: string; dotted?: boolean }) {
  return (
    <>
      <span style={{ color: "var(--dim)" }}>{label}</span>
      <span
        style={{
          fontWeight: "600",
          borderBottom: dotted ? "1px dotted var(--dim)" : undefined,
        }}
      >
        {value}
      </span>
    </>
  );
}

function Stat({ value, label, dashed }: { value: number; label: string; dashed?: boolean }) {
  return (
    <div
      style={{
        padding: "16px 22px",
        borderRadius: "16px",
        background: dashed ? "transparent" : "var(--white)",
        border: dashed ? "1.5px dashed var(--line)" : undefined,
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        minWidth: "128px",
      }}
    >
      <span
        style={{
          font: "700 28px/1 'Figtree',sans-serif",
          letterSpacing: "-.04em",
          color: dashed ? "var(--dim)" : undefined,
        }}
      >
        {value}
      </span>
      <span style={{ font: "500 10.5px 'DM Mono',monospace", color: "var(--dim)" }}>{label}</span>
    </div>
  );
}

function Chip({
  children,
  onClick,
  active,
  dashed,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  dashed?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      style={{
        padding: "8px 15px",
        borderRadius: "999px",
        cursor: "pointer",
        background: active ? "var(--ink)" : "transparent",
        color: active ? "var(--bg)" : "var(--dim)",
        border: active
          ? "1px solid var(--ink)"
          : dashed
            ? "1.5px dashed var(--line)"
            : "1px solid var(--line)",
        font: active
          ? "600 12.5px 'Figtree',sans-serif"
          : "500 12.5px 'Figtree',sans-serif",
      }}
    >
      {children}
    </button>
  );
}

function Menu({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        position: "absolute",
        top: "calc(100% + 8px)",
        left: 0,
        zIndex: 40,
        minWidth: "220px",
        maxHeight: "300px",
        overflowY: "auto",
        padding: "6px",
        borderRadius: "16px",
        background: "var(--white)",
        border: "1px solid var(--line)",
        boxShadow: "0 12px 34px rgba(21,21,21,.10)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {children}
    </div>
  );
}

function MenuItem({
  children,
  selected,
  onClick,
}: {
  children: React.ReactNode;
  selected?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        textAlign: "left",
        padding: "9px 13px",
        border: 0,
        borderRadius: "11px",
        cursor: "pointer",
        background: selected ? "var(--panel)" : "transparent",
        color: "var(--ink)",
        font: selected
          ? "600 13px 'Figtree',sans-serif"
          : "400 13px 'Figtree',sans-serif",
      }}
    >
      {children}
    </button>
  );
}

function Empty({ hasAgents }: { hasAgents: boolean }) {
  return (
    <div
      style={{
        padding: "60px 26px",
        borderRadius: "22px",
        border: "1.5px dashed var(--line)",
        textAlign: "center",
      }}
    >
      <p style={{ margin: 0, font: "600 19px 'Figtree',sans-serif" }}>
        {hasAgents ? "Nothing matches those filters" : "Nothing registered yet"}
      </p>
      <p
        style={{
          margin: "8px 0 0",
          font: "400 14px 'Figtree',sans-serif",
          color: "var(--dim)",
        }}
      >
        {hasAgents
          ? "Try clearing a filter or widening the search."
          : "The registry is live and empty. The first agent to register will sit here on its own."}
      </p>
    </div>
  );
}

function statusOf(agent: Agent): string {
  const { reputation: rep } = agent;
  if (!rep.hasRecord) return "NEW · NO HISTORY YET";
  if (rep.signals.includes("dormant")) return "INACTIVE";
  if (rep.uniquePayers < 10) return "THIN RECORD";
  return "ESTABLISHED";
}

/** Best guess at how an agent is called, from its endpoint. */
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
    if (seconds >= size) return `${Math.floor(seconds / size)}${suffix} ago`;
  }
  return "just now";
}
