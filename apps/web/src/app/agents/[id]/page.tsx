import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PaymentHistory } from "@/components/payment-history";
import { RiskPanel } from "@/components/risk-panel";
import {
  chain,
  explorerAccount,
  explorerContract,
  getAgentDetail,
} from "@/lib/one";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const detail = await getAgentDetail(id);
  return { title: detail?.agent.name ?? "Agent" };
}

/**
 * Which agent is being viewed is runtime data, deliberately.
 *
 * The obvious alternative is `generateStaticParams` listing every registered
 * agent, and it was that until it wedged the build: with Cache Components an
 * empty return is a build error, so a registry nobody has registered with yet —
 * day one, exactly — cannot be built at all. It also made every deploy depend on
 * a Stellar read succeeding from the build machine, and pinned the set of
 * viewable pages to whoever had registered at build time.
 *
 * So the shell is prerendered and the agent loads per request instead. The reads
 * are still cached (`use cache` in lib/one), so this costs a chain round trip
 * per cache window, not per visitor.
 */
export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<Loading />}>
      <Detail params={params} />
    </Suspense>
  );
}

async function Detail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const detail = await getAgentDetail(id);

  if (!detail) notFound();

  const { agent, payments, now } = detail;
  const rep = agent.reputation;
  const untested = !rep.hasRecord;

  return (
    <>
      <section style={{ position: "relative", padding: "34px 26px 0" }}>
        <Link
          href="/agents"
          style={{ font: "500 13px 'Figtree',sans-serif", color: "var(--dim)" }}
        >
          ← All agents
        </Link>

        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "32px",
            marginTop: "18px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: "1 1 480px" }}>
            <h1
              style={{
                margin: 0,
                font: "700 46px/1.05 'Figtree',sans-serif",
                letterSpacing: "-.042em",
              }}
            >
              {agent.name}
            </h1>
            <p
              style={{
                margin: "16px 0 0",
                maxWidth: "62ch",
                font: "400 16px/1.65 'Figtree',sans-serif",
                color: "var(--dim)",
              }}
            >
              {agent.description}
            </p>

            {agent.tags.length > 0 && (
              <div style={{ display: "flex", gap: "7px", flexWrap: "wrap", marginTop: "18px" }}>
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

          {/* Score sits opposite the identity so a reader meets the claim and
              the evidence at the same moment. */}
          <div
            style={{
              flex: "0 0 280px",
              padding: "24px 26px",
              borderRadius: "22px",
              background: "var(--white)",
              border: untested ? "1.5px dashed var(--line)" : undefined,
            }}
          >
            {untested ? (
              <p
                style={{
                  margin: 0,
                  font: "400 18px 'Figtree',sans-serif",
                  color: "var(--dim)",
                  fontStyle: "italic",
                }}
              >
                No score yet
              </p>
            ) : (
              <p
                style={{
                  margin: 0,
                  font: "700 52px/1 'Figtree',sans-serif",
                  letterSpacing: "-.05em",
                  color: "var(--blue)",
                }}
              >
                {rep.score}
              </p>
            )}
            <p
              style={{
                margin: "10px 0 0",
                font: "500 11px 'DM Mono',monospace",
                color: "var(--dim)",
              }}
            >
              {statusOf(agent)}
            </p>
            <p
              style={{
                margin: "16px 0 0",
                paddingTop: "14px",
                borderTop: "1px solid var(--hair)",
                font: "400 12.5px/1.6 'Figtree',sans-serif",
                color: "var(--dim)",
              }}
            >
              Computed from payments at read time. Nothing here is stored, so
              nobody can edit it.
            </p>
          </div>
        </div>
      </section>

      <section style={{ padding: "36px 26px 0" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: "12px",
          }}
        >
          <Field label="Endpoint" value={agent.endpoint} mono />
          <Field
            label="Paid at"
            value={agent.payto}
            mono
            href={explorerAccount(agent.payto)}
          />
          <Field
            label="Owner"
            value={agent.owner}
            mono
            href={explorerAccount(agent.owner)}
          />
          <Field
            label="Contract"
            value={agent.contract}
            mono
            href={explorerContract(agent.contract)}
          />
        </div>
      </section>

      <section style={{ padding: "36px 26px 0" }}>
        <h2
          style={{
            margin: "0 0 18px",
            font: "700 26px 'Figtree',sans-serif",
            letterSpacing: "-.03em",
          }}
        >
          The record
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))",
            gap: "12px",
          }}
        >
          <Metric label="Payments" value={untested ? ", " : String(rep.payments)} />
          <Metric label="Unique payers" value={untested ? ", " : String(rep.uniquePayers)} />
          <Metric
            label="Repeat customers"
            value={untested ? ", " : `${rep.repeatPayers} · ${rep.repeatRate}%`}
          />
          <Metric
            label="Volume"
            value={untested ? ", " : `${round(rep.volume)} XLM`}
          />
          <Metric
            label="Median payment"
            value={untested ? ", " : `${round(rep.medianAmount)} XLM`}
          />
          <Metric
            label={untested ? "Listed" : "Last active"}
            value={ago(untested ? agent.registeredAt : (rep.lastPaymentAt ?? 0), now)}
          />
        </div>
      </section>

      <RiskPanel reputation={rep} />

      <PaymentHistory payments={payments} now={now} explorerBase={chain.explorer} />

      <section style={{ padding: "40px 26px 100px" }}>
        <p
          style={{
            margin: 0,
            maxWidth: "70ch",
            font: "400 13.5px/1.7 'Figtree',sans-serif",
            color: "var(--dim)",
          }}
        >
          One records payments. It does not test agents, review their output or
          approve them. A high score means many addresses paid this agent
          repeatedly, nothing about the quality of what it returns.
        </p>
      </section>
    </>
  );
}

/**
 * Shown while the chain read resolves.
 *
 * It holds the shape of the real page rather than centring a spinner, so the
 * layout does not jump when the data lands.
 */
function Loading() {
  return (
    <section style={{ padding: "34px 26px 120px" }}>
      <Link
        href="/agents"
        style={{ font: "500 13px 'Figtree',sans-serif", color: "var(--dim)" }}
      >
        ← All agents
      </Link>
      <div
        style={{
          marginTop: "18px",
          height: "50px",
          width: "min(340px,70%)",
          borderRadius: "12px",
          background: "var(--panel)",
        }}
      />
      <div
        style={{
          marginTop: "16px",
          height: "17px",
          width: "min(560px,90%)",
          borderRadius: "8px",
          background: "var(--panel)",
        }}
      />
      <p
        style={{
          margin: "26px 0 0",
          font: "500 11px 'DM Mono',monospace",
          color: "var(--dim)",
        }}
      >
        READING THE CHAIN
      </p>
    </section>
  );
}

function Field({
  label,
  value,
  mono,
  href,
}: {
  label: string;
  value: string;
  mono?: boolean;
  href?: string;
}) {
  const body = (
    <span
      style={{
        font: mono
          ? "400 12.5px 'DM Mono',monospace"
          : "400 14px 'Figtree',sans-serif",
        wordBreak: "break-all",
        color: href ? "var(--blue)" : undefined,
      }}
    >
      {value}
    </span>
  );

  return (
    <div
      style={{
        padding: "16px 20px",
        borderRadius: "16px",
        background: "var(--white)",
        display: "flex",
        flexDirection: "column",
        gap: "6px",
      }}
    >
      <span style={{ font: "500 10.5px 'DM Mono',monospace", color: "var(--dim)" }}>
        {label.toUpperCase()}
      </span>
      {href ? (
        <a href={href} target="_blank" rel="noreferrer">
          {body}
        </a>
      ) : (
        body
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        padding: "18px 22px",
        borderRadius: "16px",
        background: "var(--white)",
        display: "flex",
        flexDirection: "column",
        gap: "5px",
      }}
    >
      <span style={{ font: "700 26px/1 'Figtree',sans-serif", letterSpacing: "-.035em" }}>
        {value}
      </span>
      <span style={{ font: "500 10.5px 'DM Mono',monospace", color: "var(--dim)" }}>
        {label.toUpperCase()}
      </span>
    </div>
  );
}

function statusOf(agent: { reputation: { hasRecord: boolean; signals: string[]; uniquePayers: number } }) {
  const rep = agent.reputation;
  if (!rep.hasRecord) return "NEW · NO HISTORY YET";
  if (rep.signals.includes("dormant")) return "INACTIVE";
  if (rep.uniquePayers < 10) return "THIN RECORD";
  return "ESTABLISHED";
}

function round(n: number) {
  return Number(n.toFixed(4)).toString();
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
