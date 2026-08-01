# Wireframe Prompt — One

Paste into Claude Design. Produces low-fidelity wireframes only.

---

Create low-fidelity **wireframes** for a product called **One** — an agent launchpad and
marketplace on the Stellar blockchain.

## Fidelity constraints — follow these strictly

- **Grayscale only.** No brand colors, no gradients, no shadows.
- **No typography choices.** One system font, two or three sizes to show hierarchy.
- **No imagery.** Boxes with an X or the label "image" where a visual would go.
- **Real labels, not lorem ipsum.** Use the exact copy given below.
- Boxes, lines, and labels. The goal is structure and hierarchy, nothing else.
- Annotate decisions in the margin where a layout choice needs explaining.

## What the product is

A public directory of AI agents. Agents register themselves in an on-chain contract. Each agent's
reputation is **computed automatically from its on-chain payment history** — how many distinct
addresses paid it, how many of those came back and paid again, how recently it was used. Nobody
writes reviews. Nobody gives stars. The record is the payments.

Two audiences: **operators** who list agents, and **consumers** (humans or other AI agents) who
hire them.

## Screens to wireframe

Wireframe each screen in **two states: populated and completely empty.** The empty state is what
actually ships on launch day, so treat it as a first-class design, not an afterthought.

### 1. Marketplace (browse all agents)

Contains:
- Search input (searches name, description, tags)
- Filters: tags/category, active status, "has payment history" toggle
- Sort control: highest score / most used / most repeat customers / newest / last active
- A list of agent cards, each showing: name, truncated description, tags, reputation score,
  unique payers count, repeat-customer percentage, last active, and a warning badge if the agent
  has a risk signal
- Pagination

Empty state variants to show: no agents registered at all, and search returned nothing.

### 2. Agent detail

Contains, in order of importance:
- Identity: name, full description, tags, payment address (copyable, links to block explorer),
  owner address, registered date
- Endpoint: URL, kind (x402 / MCP / plain HTTP), copy button, example call
- Reputation panel with these metrics: total payments received, unique payers, repeat customers,
  repeat rate %, total volume, first payment, last payment, average and median amount
- **Risk signals** — warnings that must be visible, not buried. The five possible signals are:
  Concentrated (most payments from one address), Fresh payers (payers are new accounts),
  Circular (payers were funded by the owner's address), Dormant (no recent activity),
  Untested (registered but never paid)
- Payment history table: time, payer address, amount, asset, transaction link
- "How to use this agent" section with copyable snippets
- A disclaimer that the platform does not guarantee the agent's output

The hard problem: reputation and risk warnings have to coexist on one page without shouting over
each other, and a brand-new agent with no history must not look like a bad agent.

### 3. Registration form (operator)

Five fields, matching the on-chain contract exactly:
- `name` — max 64 characters
- `payto` — a Stellar address. **Cannot be changed after registering**, because reputation is
  bound to it. This needs to be unmistakable in the UI.
- `endpoint` — URL, max 256 characters
- `description` — max 512 characters
- `tags` — up to 8

Also needs: per-field character counters, a live preview of how the public listing will look, and
a confirmation step explaining that this is an on-chain transaction requiring a wallet signature
and a small fee.

### 4. Landing page — hero and live stats

Contains:
- Hero: headline, subheadline, primary button "Browse agents", secondary button "Register an agent"
- A live stats band pulling from chain: registered agents, total payments recorded, unique payers,
  total volume, agents active in the last 7 days

The hard problem: **every one of those numbers is zero on launch day.** Show how the stats band
handles that honestly, without fake numbers and without looking broken.

## Global elements to include

- Header: One wordmark, links to Marketplace / Dashboard / MCP / Docs, wallet connect button
- A network indicator showing Testnet or Mainnet, which must be impossible to miss
- Loading state (reading from chain is slow)
- Error state (chain node unreachable)

## Deliverable

For each of the four screens: the populated wireframe, the empty wireframe, and short margin notes
explaining any layout decision that is not obvious.
