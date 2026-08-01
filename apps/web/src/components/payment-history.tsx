import type { Payment } from "@one/indexer";

/**
 * The evidence behind every figure on the page.
 *
 * Each row links to the payer on a block explorer so a reader can check the
 * claim rather than take it. That is the point of the site. A number nobody
 * can verify is just another review.
 */
export function PaymentHistory({
  payments,
  now,
  explorerBase,
}: {
  payments: Payment[];
  now: number;
  explorerBase: string;
}) {
  if (payments.length === 0) return null;

  // Newest first, and count how often each payer appears so repeat customers
  // are visible in the list rather than only in the summary.
  const ordered = [...payments].sort((a, b) => b.at - a.at);
  const counts = new Map<string, number>();
  for (const payment of payments) {
    counts.set(payment.from, (counts.get(payment.from) ?? 0) + 1);
  }

  return (
    <section style={{ padding: "40px 26px 0" }}>
      <h2
        style={{
          margin: "0 0 6px",
          font: "700 26px 'Figtree',sans-serif",
          letterSpacing: "-.03em",
        }}
      >
        Every payment
      </h2>
      <p
        style={{
          margin: "0 0 20px",
          font: "400 14.5px 'Figtree',sans-serif",
          color: "var(--dim)",
        }}
      >
        {payments.length} {payments.length === 1 ? "payment" : "payments"} from{" "}
        {counts.size} {counts.size === 1 ? "address" : "addresses"}. Read straight
        from the ledger.
      </p>

      <div style={{ borderRadius: "18px", background: "var(--white)", overflow: "hidden" }}>
        {ordered.map((payment, i) => {
          const repeat = (counts.get(payment.from) ?? 0) > 1;
          return (
            <div
              key={`${payment.from}-${payment.at}-${i}`}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto auto",
                alignItems: "center",
                gap: "16px",
                padding: "14px 22px",
                borderTop: i === 0 ? undefined : "1px solid var(--hair)",
              }}
            >
              <a
                href={`${explorerBase}/account/${payment.from}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  font: "400 12.5px 'DM Mono',monospace",
                  color: "var(--blue)",
                  wordBreak: "break-all",
                }}
              >
                {shorten(payment.from)}
                {repeat && (
                  <span
                    style={{
                      marginLeft: "9px",
                      padding: "2px 8px",
                      borderRadius: "999px",
                      background: "var(--panel)",
                      color: "var(--dim)",
                      font: "500 10px 'DM Mono',monospace",
                    }}
                  >
                    REPEAT
                  </span>
                )}
              </a>

              <span
                style={{
                  font: "600 13.5px 'Figtree',sans-serif",
                  fontVariantNumeric: "tabular-nums",
                  whiteSpace: "nowrap",
                }}
              >
                {Number(payment.amount.toFixed(4))} {payment.asset}
              </span>

              <span
                style={{
                  font: "400 12.5px 'DM Mono',monospace",
                  color: "var(--dim)",
                  whiteSpace: "nowrap",
                }}
              >
                {ago(payment.at, now)}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function shorten(address: string) {
  return address.length > 16
    ? `${address.slice(0, 8)}…${address.slice(-6)}`
    : address;
}

function ago(unixSeconds: number, now: number): string {
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
