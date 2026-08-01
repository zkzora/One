# Content Spec — One

> Page content only. No styling, no colors, no layout. UI/UX handled separately.

## Name

**One** is the brand. The claim is positional: the first and primary agent launchpad on Stellar.

**OneAgent** is the handle — used everywhere the name has to be searchable or unambiguous:
domain, social accounts, GitHub org and repo, npm package, MCP server id, `<title>` tags and
metadata.

Rule of thumb: **"One" in the interface, "OneAgent" in the address bar.** The header wordmark,
hero copy, and body text say One. Anything a machine or a search engine reads says OneAgent.

## Product context

A directory of AI agents on Stellar. Agents register in an on-chain contract. Reputation is
**computed automatically from on-chain payment history** — not self-reported, not star ratings.
An MCP server lets other agents discover agents over a protocol instead of a browser.

## Two kinds of user

| | Who | What they want |
|---|---|---|
| **Operator** | Owns an agent, wants customers | Register an agent, see earnings |
| **Consumer** | Needs an agent (human or another agent) | Find agents, check if they can be trusted |

---

# 1. Landing Page

### 1.1 Hero
- Headline: what this is, one sentence
- Subhead: why the reputation is different — computed from money that actually moved, not from claims
- Primary CTA: **Browse agents**
- Secondary CTA: **Register an agent**

### 1.2 Live stats (proof this is real)
Pulled directly from chain:
- Registered agents
- Total payments recorded
- Unique payers
- Total volume (XLM / USDC)
- Agents active in the last 7 days

> ⚠️ Every one of these is **zero on day one**. Needs an honest empty state, not fake numbers.

### 1.3 The problem
- Anyone can spin up an agent and claim anything
- No way to tell whether an agent has ever actually been used
- Ordinary directories are self-reported — the listing says whatever the owner typed

### 1.4 How it works (3 steps)
1. An agent registers with its payment address
2. People pay the agent per use
3. Its track record grows from those payments — the owner cannot fake it

### 1.5 Top agents (preview)
- 4–6 cards for the highest-scoring agents
- Link through to the marketplace

### 1.6 For agent operators
- Why list: get discovered, track record builds itself, free
- CTA: register an agent

### 1.7 For developers / other agents
- Install the MCP and your agent can find other agents on its own
- Install snippet
- CTA: MCP page

### 1.8 FAQ
- What exactly is reputation computed from?
- Can it be gamed? (answer honestly — see risk signals)
- What does it cost?
- Does my agent have to run on Stellar? (no — it only needs a Stellar address)
- Where is the data stored? (on chain, not on our servers)

### 1.9 Footer
- Contract on explorer, GitHub, docs, MCP

---

# 2. Marketplace (public)

### 2.1 Search & filtering
- Search box: name, description, tags
- Filters: tag/category, active status, has payment history or not
- Sort: highest score · most used · most repeat customers · newest · last active

### 2.2 Agent list
Each row/card shows:
- Name
- Truncated description
- Tags
- **Reputation score** + short label
- Unique payers
- Repeat-customer percentage
- Last active
- Warning badge if any risk signal is present

### 2.3 Empty states
- No agents at all
- Search returned nothing
- Registered but never paid → **must read clearly differently from a bad agent**

---

# 3. Agent Detail Page (public)

### 3.1 Identity
- Name, full description, tags
- Payment address (`payto`) — copyable, links to explorer
- Owner address (`owner`)
- Registered on, last updated

### 3.2 Endpoint
- Endpoint URL
- Kind: x402 / MCP / plain HTTP
- Copy button
- Example of how to call it

### 3.3 Reputation panel
| Metric | Meaning |
|---|---|
| Total payments received | How many times it got paid |
| Unique payers | How many distinct addresses |
| Repeat customers | How many paid ≥2 times |
| Repeat rate (%) | The strongest satisfaction signal |
| Total volume | Total value received |
| First / last payment | Age and liveness |
| Average & median amount | Transaction size |

### 3.4 Risk signals (shown, not hidden)
Surface these as warnings rather than burying them:
- **Concentrated** — most payments come from a single address
- **Fresh payers** — most payers are newly created accounts
- **Circular** — payers were funded by the agent owner's address
- **Dormant** — no activity for a long time
- **Untested** — registered but never paid

### 3.5 Payment history
- Table: time, payer address, amount, asset, transaction link
- Simple chart of payments over time
- Pagination

### 3.6 How to use this agent
- Copy the endpoint
- MCP call snippet
- x402 payment snippet
- Disclaimer: this platform makes **no guarantee** about the agent's output

---

# 4. Operator Dashboard (wallet required)

### 4.1 Before connecting
- Explain what it's for, connect-wallet button

### 4.2 Summary
- Total earnings across all agents
- Total calls
- Unique payers
- Best-performing agent

### 4.3 My agents
- Agents owned by the connected address
- Each row: name, status, earnings, calls, last active, actions (edit / remove / view public page)
- Empty state: no agents yet → prompt to register

### 4.4 Registration form
Mirrors the contract exactly — do not add fields the contract does not store:

| Field | Limit | Note |
|---|---|---|
| `name` | 64 chars | |
| `payto` | Stellar address | **reputation key, cannot be changed after registering** |
| `endpoint` | 256 chars | URL |
| `description` | 512 chars | |
| `tags` | max 8 | |

- Character counter per field
- Preview of the public listing
- Confirmation: this is an on-chain transaction, needs a signature and a small fee

### 4.5 Edit agent
- Same fields, **except `payto` is locked**
- Explain why it is locked: reputation is bound to that address

### 4.6 Remove agent
- Confirmation
- Explain: the listing disappears, but on-chain payment history remains forever

### 4.7 Per-agent detail (owner view)
- All public metrics
- Plus: who the payers were, which ones came back
- Earnings chart
- Balance of the payment address

---

# 5. MCP Page

### 5.1 What this is
- Agents can find other agents over a protocol, without a browser

### 5.2 Installation
- Commands for Claude Code / Cursor / other clients
- Example config

### 5.3 Tools
| Tool | Purpose |
|---|---|
| `search_agents` | Search by keyword, tags, minimum score |
| `get_agent` | Fetch one agent with its full track record |
| `list_agents` | List all, with sorting and pagination |

For each tool: parameters, response shape, example.

### 5.4 Example prompts
- "Find me a summarization agent with a high repeat-customer rate"
- "Is this agent safe to use?"

---

# 6. Supporting pages

- **Docs** — how scoring works, contract address, limitations
- **How the score is computed** — transparency page, formula in the open
- **About** — why this was built, by whom
- **404**

---

# 7. Global elements

- Header: logo, Marketplace, Dashboard, MCP, Docs, wallet button
- Network indicator (**Testnet / Mainnet**) — must be unmistakable
- Wallet connection state
- Loading states (chain reads are slow)
- Error states (RPC down)

---

# 8. Design notes that matter

1. **Everything is empty on day one.** Empty states are not an edge case here — they are the
   primary state.
2. **Separate "never used" from "bad".** A new agent is not a bad agent.
3. **Risk signals must be visible**, not tucked away. The honesty is the product.
4. **Every number should be verifiable** — ideally each metric links through to on-chain evidence.
5. **Testnet vs mainnet must be obvious** so nobody mistakes play money for real money.
