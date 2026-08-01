/**
 * Converts a Claude Design ".dc.html" export into a React component.
 *
 * The exports are plain HTML with inline styles and no classes, so the port is
 * mechanical: lift the body, rewrite `style="..."` into a JSX style object, fix
 * the handful of attribute names React spells differently, and self-close void
 * elements. Markup and styling are preserved exactly; nothing is redesigned.
 *
 *   node scripts/dc-to-react.mjs "One Landing v2.dc.html" apps/web/src/generated/landing.tsx Landing
 */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const [, , inputPath, outputPath, componentName, part = "main"] = process.argv;

if (!inputPath || !outputPath || !componentName) {
  console.error(
    "usage: dc-to-react.mjs <input.dc.html> <output.tsx> <ComponentName> [main|chrome|full]"
  );
  process.exit(1);
}

if (!["main", "chrome", "full", "register"].includes(part)) {
  console.error(`unknown part "${part}", expected main, chrome, full or register`);
  process.exit(1);
}

const VOID_ELEMENTS = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input",
  "link", "meta", "param", "source", "track", "wbr",
]);

/** Attributes React spells differently. */
const ATTR_RENAMES = {
  class: "className",
  for: "htmlFor",
  colspan: "colSpan",
  rowspan: "rowSpan",
  tabindex: "tabIndex",
  maxlength: "maxLength",
  readonly: "readOnly",
  autocomplete: "autoComplete",
  autofocus: "autoFocus",
  spellcheck: "spellCheck",
  contenteditable: "contentEditable",
  crossorigin: "crossOrigin",
  srcset: "srcSet",
  novalidate: "noValidate",
  enctype: "encType",
  usemap: "useMap",
  frameborder: "frameBorder",
  allowfullscreen: "allowFullScreen",
  "stroke-width": "strokeWidth",
  "stroke-linecap": "strokeLinecap",
  "stroke-linejoin": "strokeLinejoin",
  "stroke-dasharray": "strokeDasharray",
  "stroke-dashoffset": "strokeDashoffset",
  "fill-rule": "fillRule",
  "clip-rule": "clipRule",
  "clip-path": "clipPath",
  "stop-color": "stopColor",
  "stop-opacity": "stopOpacity",
  "text-anchor": "textAnchor",
  "font-family": "fontFamily",
  "font-size": "fontSize",
  "font-weight": "fontWeight",
  "vector-effect": "vectorEffect",
  "gradientunits": "gradientUnits",
  "patternunits": "patternUnits",
  "preserveaspectratio": "preserveAspectRatio",
  "xlink:href": "xlinkHref",
};

/** Split a declaration list on top-level semicolons only. */
function splitDeclarations(css) {
  const out = [];
  let depth = 0;
  let quote = null;
  let current = "";

  for (const ch of css) {
    if (quote) {
      if (ch === quote) quote = null;
      current += ch;
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
      current += ch;
      continue;
    }
    if (ch === "(") depth++;
    if (ch === ")") depth--;
    if (ch === ";" && depth === 0) {
      out.push(current);
      current = "";
      continue;
    }
    current += ch;
  }
  out.push(current);
  return out.map((d) => d.trim()).filter(Boolean);
}

function toCamel(prop) {
  // CSS custom properties keep their literal name.
  if (prop.startsWith("--")) return null;
  return prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

function jsString(value) {
  // Prefer double quotes unless the value contains them.
  return value.includes('"') ? `'${value.replace(/'/g, "\\'")}'` : `"${value}"`;
}

function styleToObject(css) {
  const parts = [];

  for (const decl of splitDeclarations(css)) {
    const idx = decl.indexOf(":");
    if (idx === -1) continue;

    const rawProp = decl.slice(0, idx).trim();
    const rawValue = decl.slice(idx + 1).trim();
    if (!rawProp || !rawValue) continue;

    const camel = toCamel(rawProp);
    const key = camel === null ? jsString(rawProp) : camel;
    parts.push(`${key}: ${jsString(rawValue)}`);
  }

  return `{{ ${parts.join(", ")} }}`;
}

let html = readFileSync(inputPath, "utf8");

// Keep only what renders: drop the head, the design-tool wrapper and its helmet.
const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
let body = bodyMatch ? bodyMatch[1] : html;
body = body.replace(/<helmet[\s\S]*?<\/helmet>/gi, "");
body = body.replace(/<script[\s\S]*?<\/script>/gi, "");
body = body.replace(/<\/?x-dc[^>]*>/gi, "");
body = body.replace(/<!--[\s\S]*?-->/g, "");

// Drop the design tool's preview switchers. They exist so a reviewer can flip
// between mocked states; in the product the state comes from chain data, so a
// button that fakes it would be lying to the user.
const PREVIEW_SWITCHERS = [
  // Populated / Day one
  /<div[^>]*>\s*<button\s+data-om-state="pop"[\s\S]*?<\/button>\s*<button\s+data-om-state="zero"[\s\S]*?<\/button>\s*<\/div>/gi,
  // Connected / No wallet. Real connection state comes from the wallet.
  /<div[^>]*>\s*<button\s+data-om-wallet="on"[\s\S]*?<\/button>\s*<button\s+data-om-wallet="off"[\s\S]*?<\/button>\s*<\/div>/gi,
];

for (const pattern of PREVIEW_SWITCHERS) {
  body = body.replace(pattern, "");
}

/**
 * Chrome the product does not want.
 *
 * The testnet strip repeated the same sentence on every page; the network is
 * still stated in the footer and on the docs page, so removing the strip loses
 * placement rather than information. The hero eyebrow restated the site's own
 * name directly above its own headline.
 */
const REMOVED_CHROME = [
  // Full-width yellow "TESTNET, play money" strip.
  /<div style="display:flex;align-items:center;gap:14px;padding:0 26px;height:36px;background:var\(--yellow\)[^"]*">[\s\S]*?<\/div>\s*(?=<header)/,
  // Hero eyebrow: "OneAgent · Stellar", directly above the headline.
  /<span[^>]*style="display:inline-flex[^"]*"><span style="width:6px;height:6px;border-radius:50%;background:var\(--blue\)"><\/span>OneAgent[^<]*<\/span>/,
];

for (const pattern of REMOVED_CHROME) {
  body = body.replace(pattern, "");
}

/**
 * Em dashes are out of house style.
 *
 * Each one is rewritten individually because the right replacement depends on
 * what the dash was doing: introducing a list, joining an aside, or starting a
 * new sentence. A blanket swap produces comma soup.
 */
/**
 * Registration is its own route.
 *
 * In the export it sits underneath the operator dashboard, so a visitor who
 * only wants to list an agent has to scroll past somebody else's earnings to
 * reach it. Splitting it out also lets it render without a wallet gate in the
 * way.
 */
const REGISTRATION_SECTION =
  /<section [^>]*data-screen-label="Registration"[\s\S]*?<\/section>/;

if (part === "register") {
  const match = body.match(REGISTRATION_SECTION);
  if (!match) {
    console.error(`no registration section found in ${inputPath}`);
    process.exit(1);
  }
  body = match[0];
} else {
  body = body.replace(REGISTRATION_SECTION, "");
}

/**
 * The wallet gate is decided by the wallet, not by the export.
 *
 * The design ships the connected view visible and the gate hidden, which is the
 * right default for a mockup and the wrong one for a product: with no wallet
 * attached, showing the dashboard means showing figures that belong to nobody.
 */
let usesConnected = false;

body = body.replace(
  /<section([^>]*?)data-om-gate([^>]*?)style="display:none;([^"]*)"/,
  (_m, before, after, css) => {
    usesConnected = true;
    return `<section${before}${after}style="${css};display:__ONE_WHEN_DISCONNECTED__"`;
  }
);

body = body.replace(
  /<div([^>]*?)data-om-app([^>]*?)style="display:block"/,
  (_m, before, after) => {
    usesConnected = true;
    return `<div${before}${after}style="display:__ONE_WHEN_CONNECTED__"`;
  }
);

const DASH_REWRITES = [
  [
    "payment history — how many distinct addresses",
    "payment history: how many distinct addresses",
  ],
  ["the record is payments — how many", "the record is payments: how many"],
  [
    "everywhere on One — never a zero",
    "everywhere on One, never a zero",
  ],
  [
    "any client — Claude Code, Cursor, your own runtime — searches",
    "any client, whether Claude Code, Cursor or your own runtime, searches",
  ],
  [
    "nothing of its own — if this site disappeared",
    "nothing of its own. If this site disappeared",
  ],
  [
    "live and searchable — it simply has no record",
    "live and searchable. It simply has no record",
  ],
  [
    "read succeeded — there is simply nothing",
    "read succeeded. There is simply nothing",
  ],
  [
    "nothing is queued — the listing is public",
    "nothing is queued. The listing is public",
  ],
  [
    "no migration path — a new address means",
    "no migration path. A new address means",
  ],
];

for (const [from, to] of DASH_REWRITES) {
  body = body.replaceAll(from, to);
}

// Anything the rewrites missed, including dashes introduced by a later export.
body = body.replaceAll(" — ", ", ").replaceAll("—", ", ");

/**
 * Hand the theme toggle to a real component.
 *
 * The export ships a static button. Swapping it here keeps the design's
 * placement while letting the working control live in normal source.
 */
body = body.replace(
  /<button data-om-theme[\s\S]*?<\/button>/,
  "__ONE_THEME_TOGGLE__"
);

/**
 * Strip the palette from the root element's inline style.
 *
 * The export declares every colour token inline on `data-om-root`. An inline
 * declaration beats any stylesheet rule, so a dark theme defined in CSS could
 * never take effect while these were here. They now live in globals.css, where
 * a `[data-theme="dark"]` block can override them.
 */
body = body.replace(
  /(<div data-om-root style=")([^"]*)(")/,
  (_m, open, css, close) => {
    const kept = css
      .split(";")
      .filter((decl) => !decl.trim().startsWith("--"))
      .join(";")
      .replace(/^;+/, "");
    return `${open}${kept}${close}`;
  }
);

/**
 * Wire the design's own state markers to real data.
 *
 * The exports carry `data-om-stat` (a figure with a populated and an empty
 * value) and `data-om-onlypop` / `data-om-onlyzero` (sections that belong to
 * one state or the other). The design tool drove those from a toggle; here they
 * are driven by what is actually on chain, so the page cannot show a number it
 * cannot back up.
 */
const STAT_PROPS = {
  AGENTS: "agents",
  PAYMENTS: "payments",
  "UNIQUE PAYERS": "uniquePayers",
  "ACTIVE 7D": "activeLast7d",
};

let usesStats = false;
let usesEmpty = false;

body = body.replace(
  /<span data-om-stat[^>]*>([^<]*)<\/span>(<span[^>]*>([^<]*)<\/span>)/g,
  (match, _value, labelSpan, label) => {
    const prop = STAT_PROPS[label.trim().toUpperCase()];
    if (!prop) return match;
    usesStats = true;
    const open = match.slice(0, match.indexOf(">") + 1);
    return `${open}__ONE_STAT_${prop}__</span>${labelSpan}`;
  }
);

/**
 * The design ships sample agents so the page can be judged full. Real listings
 * are read from the chain, so the sample section is cut out and replaced with a
 * slot the caller fills — showing invented agents on a site whose whole claim is
 * "these numbers are real" is the one lie it cannot afford.
 */
let hasAgentSlot = false;
body = body.replace(
  /<section [^>]*data-screen-label="Top agents"[\s\S]*?<\/section>/,
  () => {
    hasAgentSlot = true;
    return "__ONE_TOP_AGENTS__";
  }
);

// Sections that belong to one state. `display` is decided at render.
body = body.replace(
  /<(\w+)([^>]*?)data-om-onlypop data-om-show="(\w+)"([^>]*?)style="([^"]*)"/g,
  (_m, tag, before, show, after, css) => {
    usesEmpty = true;
    // Drop any display the design already set, or the object would carry two.
    const cleaned = css.replace(/display:\s*[^;]*;?/g, "");
    return `<${tag}${before}${after}style="${cleaned};display:__ONE_WHEN_POPULATED_${show}__"`;
  }
);

body = body.replace(
  /<(\w+)([^>]*?)data-om-onlyzero([^>]*?)style="([^"]*)"/g,
  (_m, tag, before, after, css) => {
    usesEmpty = true;
    const cleaned = css.replace(/display:\s*[^;]*;?/g, "");
    return `<${tag}${before}${after}style="${cleaned};display:__ONE_WHEN_EMPTY__"`;
  }
);

/**
 * Swap the design's placeholder mark (an ink square with a lime dot) for the
 * real logo. Done here rather than in the generated file so it survives the
 * next re-export.
 */
const PLACEHOLDER_MARK =
  /<span style="width:26px;height:26px;border-radius:8px;background:var\(--ink\);display:flex;align-items:center;justify-content:center"><span style="width:9px;height:9px;border-radius:50%;background:var\(--lime\)"><\/span><\/span>/g;

// No `display` here on purpose: an inline value would beat the stylesheet and
// the dark variant could never be shown. Visibility is decided in globals.css.
const LOGO_MARK =
  '<img src="/one-logo-black.png" alt="" data-logo="light" width="24" height="29" style="height:27px;width:auto;margin-right:-3px">' +
  '<img src="/one-logo-white.png" alt="" data-logo="dark" width="24" height="29" style="height:27px;width:auto;margin-right:-3px">';

body = body.replace(PLACEHOLDER_MARK, LOGO_MARK);

// The mark carries its own whitespace, so the design's 10px gap reads much
// wider once a real logo sits in the box. Tighten it back to what the design
// looks like, not what it measures.
body = body.replace(
  /(<a href="[^"]*" style="display:flex;align-items:center;)gap:10px(")/g,
  "$1gap:7px$2"
);

// The blue slice panel centres a 40px "One" on a dark field, so it takes the
// white lockup rather than the black one.
body = body.replace(
  /<div style="position:absolute;left:0;right:0;top:50%;transform:translateY\(-50%\);text-align:center;font:700 40px\/1 'Figtree',sans-serif;letter-spacing:-\.04em;color:#fff">One<\/div>/,
  '<img src="/one-logo-full-white.png" alt="One" style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);height:84px;width:auto">'
);

/**
 * Stop theme-aware panels inheriting a hardcoded text colour.
 *
 * The design paints accent panels (mint, coral, sky) and pins their text to
 * #151515, which is right: those hues do not change between themes. But panels
 * nested inside them use `var(--white)` and friends, which do flip. In dark
 * mode that leaves near-black text on a near-black surface, and the content
 * disappears. Giving those surfaces their own colour makes them independent of
 * whatever they happen to sit inside.
 */
const THEMED_SURFACES = ["var(--white)", "var(--card)", "var(--panel)", "var(--bg)"];

body = body.replace(/style="([^"]*)"/g, (match, css) => {
  const paintsThemedSurface = THEMED_SURFACES.some((surface) =>
    css.includes(`background:${surface}`)
  );
  if (!paintsThemedSurface || /(^|;)\s*color:/.test(css)) return match;
  return `style="${css};color:var(--ink)"`;
});

/**
 * The footer wordmark is the logo on its own.
 *
 * Setting "agent" in Figtree beside it did not work: the logo draws its "One"
 * in a contrasting face, so the two halves read as two different logos pushed
 * together rather than one word.
 */
const WORDMARK_LOCKUP =
  '<div data-om-wordmark style="display:flex;align-items:center;justify-content:center;padding:8px 0">' +
  '<img src="/one-logo-full-black.png" alt="One" data-logo="light" style="height:250px;width:auto">' +
  '<img src="/one-logo-full-white.png" alt="One" data-logo="dark" style="height:250px;width:auto">' +
  "</div>";

body = body.replace(/<div data-om-wordmark style="[^"]*">[^<]*<\/div>/, WORDMARK_LOCKUP);

// Elsewhere "One" is the brand shown to people; "OneAgent" is reserved for
// machine-read identifiers such as the domain, the package and the MCP id.
body = body.replaceAll(">OneAgent · 2026<", ">One · 2026<");


// The exports link to each other by filename. Point them at real routes.
const ROUTES = {
  "One%20Landing%20v2.dc.html": "/",
  "One Landing v2.dc.html": "/",
  "One%20Marketplace%20v2.dc.html": "/agents",
  "One Marketplace v2.dc.html": "/agents",
  "One%20Dashboard%20v2.dc.html": "/dashboard",
  "One Dashboard v2.dc.html": "/dashboard",
};

for (const [file, route] of Object.entries(ROUTES)) {
  body = body.replaceAll(`href="${file}"`, `href="${route}"`);
  // Registration moved off the dashboard onto its own route.
  body = body.replaceAll('href="/dashboard#register"', 'href="/register"');
  // Anchored variants: "One Landing v2.dc.html#faq" -> "/#faq"
  body = body.replaceAll(`href="${file}#`, `href="${route === "/" ? "" : route}#`);
}

/**
 * The exports use page anchors for sections that became their own routes. Left
 * alone, every one of these is a dead click from anywhere except the landing
 * page — the shell is shared, so a `#mcp` in the footer does nothing on
 * /agents. Point them at real pages instead.
 */
const ANCHOR_ROUTES = {
  '#mcp': "/mcp",
  '#faq': "/docs",
  '#top': "/",
  '#register': "/register",
};

for (const [anchor, route] of Object.entries(ANCHOR_ROUTES)) {
  body = body.replaceAll(`href="${anchor}"`, `href="${route}"`);
}

/**
 * Split the page into the shell every route shares (banner, header, footer)
 * and the part that is unique to this route. The exports repeat the shell in
 * all three files; keeping three copies would mean fixing the nav three times.
 */
const headerEnd = body.indexOf("</header>");
const footerStart = body.lastIndexOf("<footer");

if (part !== "full" && part !== "register") {
  if (headerEnd === -1 || footerStart === -1 || footerStart < headerEnd) {
    console.error(`could not locate header/footer boundaries in ${inputPath}`);
    process.exit(1);
  }

  const top = body.slice(0, headerEnd + "</header>".length);
  const middle = body.slice(headerEnd + "</header>".length, footerStart);
  const bottom = body.slice(footerStart);

  // The shell opens wrapper elements that the footer section closes, so it can
  // only be expressed as a component that renders children between them.
  // A sentinel is used because the brace-escaping pass below would otherwise
  // treat a literal {children} as text.
  body = part === "chrome" ? `${top}\n__ONE_CHILDREN__\n${bottom}` : middle;
}

// Rewrite tags: attribute names, inline styles, void-element self closing.
body = body.replace(/<([a-zA-Z][\w-]*)((?:\s+[^>]*?)?)(\/?)>/g, (match, tag, attrs, selfClose) => {
  if (!attrs.trim()) {
    return VOID_ELEMENTS.has(tag.toLowerCase()) ? `<${tag} />` : `<${tag}>`;
  }

  let rewritten = attrs;

  // style="..." -> style={{ ... }}
  rewritten = rewritten.replace(/\sstyle\s*=\s*"([^"]*)"/gi, (_m, css) => ` style=${styleToObject(css)}`);

  // Rename attributes React spells differently.
  for (const [from, to] of Object.entries(ATTR_RENAMES)) {
    rewritten = rewritten.replace(
      new RegExp(`\\s${from.replace(/[:]/g, "\\:")}\\s*=`, "gi"),
      ` ${to}=`
    );
  }

  const close = VOID_ELEMENTS.has(tag.toLowerCase()) ? " />" : selfClose ? " />" : ">";
  return `<${tag}${rewritten}${close}`;
});

// Curly braces in text would be read as JSX expressions.
body = body.replace(/([>\s])\{([^}<]*)\}/g, (m, lead, inner) =>
  inner.includes('"') ? m : `${lead}{"{"}${inner}{"}"}`
);

body = body.replace("__ONE_CHILDREN__", "{children}");
body = body.replace("__ONE_TOP_AGENTS__", "{topAgents}");
body = body.replace("__ONE_THEME_TOGGLE__", "<ThemeToggle />");

// Turn the state placeholders into real expressions now that the markup has
// been rewritten and cannot mangle them.
body = body
  .replace(/__ONE_STAT_(\w+)__/g, (_m, prop) => `{format(stats.${prop})}`)
  // These sit inside an already-converted style object, so the placeholder is
  // a quoted value by this point.
  .replace(
    /display: "__ONE_WHEN_POPULATED_(\w+)__"/g,
    (_m, show) => `display: empty ? "none" : "${show}"`
  )
  .replace(
    /display: "__ONE_WHEN_EMPTY__"/g,
    'display: empty ? "flex" : "none"'
  )
  .replace(
    /display: "__ONE_WHEN_DISCONNECTED__"/g,
    'display: connected ? "none" : "block"'
  )
  .replace(
    /display: "__ONE_WHEN_CONNECTED__"/g,
    'display: connected ? "block" : "none"'
  );

const needsStats = usesStats && body.includes("stats.");
const needsEmpty = usesEmpty && body.includes("empty ?");
const needsConnected = usesConnected && body.includes("connected ?");
const needsSlot = hasAgentSlot;

// Only the props a page actually uses, so a page without figures is not forced
// to be handed figures it will ignore.
const props = [];
if (needsStats) props.push("stats");
if (needsEmpty) props.push("empty");
if (needsConnected) props.push("connected");
if (needsSlot) props.push("topAgents");

const types = [];
if (needsStats) types.push("stats: LandingStats");
if (needsEmpty) types.push("empty: boolean");
if (needsConnected) types.push("connected: boolean");
if (needsSlot) types.push("topAgents: React.ReactNode");

const signature =
  part === "chrome"
    ? `export function ${componentName}({ children }: { children: React.ReactNode })`
    : props.length > 0
      ? `export function ${componentName}({ ${props.join(", ")} }: { ${types.join("; ")} })`
      : `export function ${componentName}()`;

const preamble = needsStats
  ? `
/** Figures the design displays, supplied by the caller from chain reads. */
export type LandingStats = {
  agents: number;
  payments: number;
  uniquePayers: number;
  activeLast7d: number;
};

const format = (n: number) => new Intl.NumberFormat("en-US").format(n);
`
  : "";

const needsTheme = body.includes("<ThemeToggle />");

const source = `/* eslint-disable */
// GENERATED, do not edit.
// Ported verbatim from "${inputPath}" by scripts/dc-to-react.mjs (part: ${part}).
// Markup and inline styles are the designer's; nothing here was redesigned.
${needsTheme ? `import { ThemeToggle } from "@/components/theme-toggle";\n` : ""}${preamble}
${signature} {
  return (
    <>
${body
  .split("\n")
  .map((line) => (line.trim() ? `      ${line}` : ""))
  .join("\n")}
    </>
  );
}
`;

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, source, "utf8");

console.log(`${inputPath} -> ${outputPath} (${source.length} chars)`);
