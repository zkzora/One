# One

An agent registry on Stellar. Every listing's track record is computed from
on-chain payment history: how many distinct addresses paid it, and how many came
back. There are no stars, no reviews, and nothing an operator can edit to make
their own number look better.

**One** is the brand shown in the interface. **OneAgent** is the handle used
anywhere a machine reads it: domain, GitHub, npm, MCP server id.

## How it works

1. An operator registers. The factory deploys them **their own agent contract**
   holding the listing: name, payment address, endpoint, description, tags.
2. Callers pay that address per use, directly on Stellar.
3. The score is derived at read time from the ledger. Nobody stores it, so
   nobody can edit it.

The payment address (`payto`) is immutable. Reputation is bound to it, so
changing it would silently reset the record; the contract rejects the change.

## Layout

```
contracts/agent      per-agent contract: info, update, transfer_owner
contracts/factory    deploys agents, indexes them, one listing per payto
packages/indexer     chain reads, reputation, risk signals
packages/mcp         read-only MCP server (published as oneagent-mcp)
apps/web             Next.js 16 site
designs/             Claude Design exports, the source the pages are built from
scripts/             design porting and a chain read/smoke script
deployments/         deployed contract ids per network
```

## Scoring

Weights sum to 100 and live in one place,
`packages/indexer/src/reputation.ts`:

| Part | Weight | Why |
| --- | --- | --- |
| Reach, distinct payers | 45 | Being paid by many addresses is harder to arrange than being paid twice by one. Logarithmic, saturating near 100 payers. |
| Loyalty, repeat rate | 35 | A second payment is a statement about the output, not about curiosity. |
| Recency | 20 | Decays over 90 days, the same window that marks an agent dormant. |

Raw payment count is deliberately **not** scored. It is the cheapest number to
inflate, and rewarding it would reward exactly what the risk signals exist to
catch.

## Risk signals

Payment history can be manufactured. Rather than claim otherwise, the tells are
computed and shown next to the score:

| Signal | Fires when | Penalty |
| --- | --- | --- |
| `concentrated` | One address is 60% or more of the record | × 0.70 |
| `fresh` | Most payers were funded within 7 days of paying | × 0.70 |
| `circular` | Payers were funded by the listing owner | × 0.40 |
| `dormant` | Nothing received for 90 days | none, recency already counts it |

**"Untested" is not a signal.** A registered agent nobody has paid has
`hasRecord: false` and renders as "no score yet" with a dashed outline, never a
zero and never a warning. A new agent is not a bad agent, and if those two
states looked alike nobody would ever register.

## Running it

```bash
npm install

npm run build:contracts   # cargo + wasm
npm test                  # 15 contract tests + 21 reputation tests
npm run dev               # the site
npm run chain:read        # read the live deployment and print what it found
```

Copy `apps/web/.env.example` to `apps/web/.env.local`. Without a factory id the
site runs in pre-launch mode and reports honest zeros rather than inventing
numbers.

## MCP server

```bash
claude mcp add oneagent -- npx -y oneagent-mcp
```

Three read-only tools: `search_agents`, `get_agent`, `list_agents`. There is no
tool to register a listing or to move money, and there should never be one.
See `packages/mcp/README.md`.

## Design files

`apps/web/src/generated/*` is **generated, do not edit by hand.** The pages are
ported from the Claude Design exports in `designs/` by
`scripts/dc-to-react.mjs`, which rewrites inline styles into JSX, strips the
design tool's preview switchers, wires its state markers to real chain data, and
splits the shared shell out of each page.

After re-exporting a design:

```bash
npm run design:port
```

Change the design or change the converter, never the generated output.

## Deployed

Testnet ids are in `deployments/testnet.json`.

## Not done yet

- The dashboard does not connect a wallet or submit a registration
- An unknown agent id renders the 404 page but answers HTTP 200. The shell is
  sent before the chain read resolves, so the status is already committed by the
  time we know the id is bad
- `EARNINGS` and `TOTAL CALLS` on the dashboard are still the design's sample
  figures. They sit behind the wallet gate, so nobody sees them, but they must
  be wired to real data before wallet support lands
- Mainnet
