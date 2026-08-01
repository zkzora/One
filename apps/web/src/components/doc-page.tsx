import Link from "next/link";

/**
 * Shared shell for documentation routes, styled to match the design's type
 * scale so docs do not read as a bolted-on afterthought.
 */
export function DocPage({
  eyebrow,
  title,
  intro,
  children,
  toc,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  children: React.ReactNode;
  toc?: Array<{ href: string; label: string }>;
}) {
  return (
    <div style={{ padding: "34px 26px 100px" }}>
      {/* Centred and capped: left unbounded, the prose column and the contents
          list drift to opposite edges of a wide screen with a hole between. */}
      <div
        style={{
          display: "flex",
          gap: "60px",
          alignItems: "flex-start",
          maxWidth: "1060px",
          margin: "0 auto",
        }}
      >
        <article style={{ flex: "1 1 auto", maxWidth: "76ch", minWidth: 0 }}>
          {eyebrow && (
            <p
              style={{
                margin: 0,
                font: "500 11.5px 'DM Mono',monospace",
                letterSpacing: ".04em",
                color: "var(--dim)",
              }}
            >
              {eyebrow.toUpperCase()}
            </p>
          )}
          <h1
            style={{
              margin: eyebrow ? "14px 0 0" : 0,
              font: "700 46px/1.05 'Figtree',sans-serif",
              letterSpacing: "-.042em",
            }}
          >
            {title}
          </h1>
          {intro && (
            <p
              style={{
                margin: "20px 0 0",
                font: "400 17px/1.7 'Figtree',sans-serif",
                color: "var(--dim)",
              }}
            >
              {intro}
            </p>
          )}
          <div style={{ marginTop: "44px" }}>{children}</div>
        </article>

        {toc && toc.length > 0 && (
          <nav
            aria-label="On this page"
            style={{
              flex: "0 0 210px",
              position: "sticky",
              top: "90px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <span
              style={{
                font: "500 10.5px 'DM Mono',monospace",
                letterSpacing: ".14em",
                color: "var(--dim)",
              }}
            >
              ON THIS PAGE
            </span>
            {toc.map((item) => (
              <a
                key={item.href}
                href={item.href}
                style={{ font: "400 13.5px 'Figtree',sans-serif", color: "var(--dim)" }}
              >
                {item.label}
              </a>
            ))}
          </nav>
        )}
      </div>
    </div>
  );
}

export function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} style={{ scrollMarginTop: "90px", marginBottom: "48px" }}>
      <h2
        style={{
          margin: "0 0 16px",
          font: "700 26px 'Figtree',sans-serif",
          letterSpacing: "-.03em",
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

export function P({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        margin: "0 0 16px",
        font: "400 15.5px/1.75 'Figtree',sans-serif",
        color: "var(--dim)",
      }}
    >
      {children}
    </p>
  );
}

export function Callout({
  title,
  children,
  tone = "neutral",
}: {
  title: string;
  children: React.ReactNode;
  tone?: "neutral" | "warn";
}) {
  return (
    <div
      style={{
        margin: "0 0 20px",
        padding: "20px 24px",
        borderRadius: "18px",
        background: "var(--white)",
        border:
          tone === "warn" ? "1px solid var(--coral)" : "1px solid var(--line)",
      }}
    >
      <p
        style={{
          margin: "0 0 8px",
          font: "600 14px 'Figtree',sans-serif",
          color: tone === "warn" ? "var(--coral)" : "var(--ink)",
        }}
      >
        {title}
      </p>
      <div style={{ font: "400 14.5px/1.7 'Figtree',sans-serif", color: "var(--dim)" }}>
        {children}
      </div>
    </div>
  );
}

export function Table({
  head,
  rows,
}: {
  head: string[];
  rows: Array<Array<React.ReactNode>>;
}) {
  return (
    <div
      style={{
        margin: "0 0 20px",
        borderRadius: "16px",
        background: "var(--white)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${head.length}, minmax(0,1fr))`,
          gap: "16px",
          padding: "13px 22px",
          borderBottom: "1px solid var(--hair)",
        }}
      >
        {head.map((cell) => (
          <span
            key={cell}
            style={{
              font: "500 10.5px 'DM Mono',monospace",
              letterSpacing: ".1em",
              color: "var(--dim)",
            }}
          >
            {cell.toUpperCase()}
          </span>
        ))}
      </div>
      {rows.map((row, i) => (
        <div
          key={i}
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${head.length}, minmax(0,1fr))`,
            gap: "16px",
            padding: "14px 22px",
            borderTop: i === 0 ? undefined : "1px solid var(--hair)",
            font: "400 14px/1.6 'Figtree',sans-serif",
          }}
        >
          {row.map((cell, j) => (
            <span key={j} style={{ color: j === 0 ? "var(--ink)" : "var(--dim)" }}>
              {cell}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

export function Code({ children }: { children: string }) {
  return (
    <pre
      style={{
        margin: "0 0 20px",
        padding: "20px 24px",
        borderRadius: "16px",
        background: "var(--ink)",
        color: "var(--bg)",
        overflowX: "auto",
        font: "400 13px/1.75 'DM Mono',monospace",
      }}
    >
      <code>{children}</code>
    </pre>
  );
}

export function Mono({ children }: { children: React.ReactNode }) {
  return (
    <code
      style={{
        padding: "2px 6px",
        borderRadius: "6px",
        background: "var(--panel)",
        font: "400 13px 'DM Mono',monospace",
      }}
    >
      {children}
    </code>
  );
}

export function NextLinks({
  links,
}: {
  links: Array<{ href: string; label: string; body: string }>;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))",
        gap: "12px",
        marginTop: "8px",
      }}
    >
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          style={{
            padding: "20px 22px",
            borderRadius: "18px",
            background: "var(--white)",
            border: "1px solid var(--line)",
          }}
        >
          <span
            style={{
              display: "block",
              font: "600 15px 'Figtree',sans-serif",
              color: "var(--blue)",
            }}
          >
            {link.label} →
          </span>
          <span
            style={{
              display: "block",
              marginTop: "6px",
              font: "400 13.5px/1.6 'Figtree',sans-serif",
              color: "var(--dim)",
            }}
          >
            {link.body}
          </span>
        </Link>
      ))}
    </div>
  );
}
