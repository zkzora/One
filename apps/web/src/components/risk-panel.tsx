import type { Reputation, RiskSignal } from "@one/indexer";

/**
 * What we checked, and what we found.
 *
 * Shown even when nothing fired: an agent that passes every check has earned
 * the reader's confidence, and a panel that only appears on bad news teaches
 * people that its absence means nothing was looked at.
 */
const CHECKS: Array<{ id: RiskSignal; name: string; found: string; clear: string }> = [
  {
    id: "concentrated",
    name: "Concentrated",
    found: "Most payments come from a single address. A large total can be one repeat customer rather than a market.",
    clear: "Payments come from several different addresses.",
  },
  {
    id: "fresh",
    name: "Fresh payers",
    found: "Most payers were funded days before they paid. Consistent with wash traffic, and equally consistent with a launch.",
    clear: "Payers are established accounts, not newly funded ones.",
  },
  {
    id: "circular",
    name: "Circular",
    found: "Payers were funded by the owner's own address. The clearest self-dealing tell there is.",
    clear: "No payer traces back to the owner's address.",
  },
  {
    id: "dormant",
    name: "Dormant",
    found: "A real record, but nothing recent. Still readable, no longer current.",
    clear: "The record is current.",
  },
];

export function RiskPanel({ reputation }: { reputation: Reputation }) {
  // An agent nobody has paid has nothing to check. Saying so is not the same as
  // clearing it, and it is certainly not a warning.
  if (!reputation.hasRecord) {
    return (
      <section style={{ padding: "40px 26px 0" }}>
        <div
          style={{
            padding: "26px 28px",
            borderRadius: "22px",
            border: "1.5px dashed var(--line)",
            background: "var(--card)",
          }}
        >
          <h2 style={{ margin: 0, font: "700 20px 'Figtree',sans-serif", letterSpacing: "-.02em" }}>
            Nothing to check yet
          </h2>
          <p
            style={{
              margin: "10px 0 0",
              maxWidth: "70ch",
              font: "400 14.5px/1.65 'Figtree',sans-serif",
              color: "var(--dim)",
            }}
          >
            This agent has never been paid, so there is no history to examine. That
            is different from a bad record. Every agent starts here.
          </p>
        </div>
      </section>
    );
  }

  const fired = CHECKS.filter((check) => reputation.signals.includes(check.id));
  const clear = CHECKS.filter((check) => !reputation.signals.includes(check.id));

  return (
    <section style={{ padding: "40px 26px 0" }}>
      <h2
        style={{
          margin: "0 0 6px",
          font: "700 26px 'Figtree',sans-serif",
          letterSpacing: "-.03em",
        }}
      >
        What we checked
      </h2>
      <p
        style={{
          margin: "0 0 20px",
          maxWidth: "70ch",
          font: "400 14.5px/1.6 'Figtree',sans-serif",
          color: "var(--dim)",
        }}
      >
        Payment history can be manufactured. Rather than claim otherwise, the
        tells are computed and printed here, next to the score rather than
        buried under it.
      </p>

      <div style={{ display: "grid", gap: "10px" }}>
        {fired.map((check) => (
          <Row key={check.id} name={check.name} body={check.found} fired />
        ))}
        {clear.map((check) => (
          <Row key={check.id} name={check.name} body={check.clear} />
        ))}
      </div>
    </section>
  );
}

function Row({ name, body, fired }: { name: string; body: string; fired?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "14px",
        padding: "18px 22px",
        borderRadius: "16px",
        background: "var(--white)",
        border: fired ? "1px solid var(--coral)" : "1px solid transparent",
      }}
    >
      <span
        aria-hidden
        style={{
          marginTop: "5px",
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          flex: "0 0 8px",
          background: fired ? "var(--coral)" : "var(--mint)",
        }}
      />
      <div>
        <p
          style={{
            margin: 0,
            font: "500 13px 'DM Mono',monospace",
            color: fired ? "var(--coral)" : "var(--ink)",
          }}
        >
          {name}
          {!fired && (
            <span style={{ color: "var(--dim)", fontWeight: 400 }}> · clear</span>
          )}
        </p>
        <p
          style={{
            margin: "6px 0 0",
            maxWidth: "72ch",
            font: "400 14px/1.6 'Figtree',sans-serif",
            color: "var(--dim)",
          }}
        >
          {body}
        </p>
      </div>
    </div>
  );
}
