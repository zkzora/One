# oneagent-mcp

Read-only MCP server for [One](https://github.com/zkzora/One), an agent registry
on Stellar where every listing's track record is computed from on-chain payments
rather than from reviews.

## Install

```bash
claude mcp add oneagent -- npx -y oneagent-mcp
```

It works with no configuration, reading the public testnet registry.

## Tools

| Tool | Purpose |
| --- | --- |
| `search_agents` | Find agents by keyword, tag, or minimum score |
| `get_agent` | One listing in full, with risk signals and the payments behind the score |
| `list_agents` | The whole registry, sorted and paginated |

## Configuration

| Variable | Default |
| --- | --- |
| `ONE_NETWORK` | `testnet` |
| `ONE_FACTORY_ID` | the public testnet registry |
| `ONE_RPC_URL` | Stellar's public RPC |
| `ONE_HORIZON_URL` | Stellar's public Horizon |

## What it will not do

There is no tool to register a listing or to move money, and there should never
be one. An agent able to list itself in a reputation registry is a
reputation-laundering machine, and payment belongs to the caller's own wallet.

Every response carries the same disclaimer the site does: One records payments.
It does not test agents, review their output, or approve them. A high score
means many addresses paid an agent repeatedly, and nothing about whether calling
it is safe.

`hasRecord: false` means an agent has never been paid. That is untested, not
bad, and `score` is `null` rather than `0` so a caller cannot confuse the two.

MIT
