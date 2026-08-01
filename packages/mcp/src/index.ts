/**
 * One, MCP server.
 *
 * Lets an agent ask the same question the website answers for a person: has
 * this agent actually been paid, by how many different people, and did any of
 * them come back?
 *
 * Read-only by design. There is no tool here to register a listing or to move
 * money, and there should never be one: an agent able to list itself in a
 * reputation registry is a reputation-laundering machine, and payment belongs
 * to the caller's own wallet, not to a directory.
 *
 * Tools are declared with plain JSON Schema against the SDK's low-level
 * request handlers rather than the zod helper. The helper's generics infer
 * through two zod major versions at once and collapse into "type instantiation
 * is excessively deep"; JSON Schema is what crosses the wire anyway.
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import {
  getAgent,
  getAgents,
  getNetworkStats,
  getPaymentsReceived,
  rankAgents,
  type Agent,
  type NetworkConfig,
} from "@one/indexer";

const NETWORKS = {
  testnet: {
    rpc: "https://soroban-testnet.stellar.org",
    horizon: "https://horizon-testnet.stellar.org",
    networkPassphrase: "Test SDF Network ; September 2015",
    explorer: "https://stellar.expert/explorer/testnet",
  },
  mainnet: {
    rpc: "https://mainnet.sorobanrpc.com",
    horizon: "https://horizon.stellar.org",
    networkPassphrase: "Public Global Stellar Network ; September 2015",
    explorer: "https://stellar.expert/explorer/public",
  },
} as const;

const network = process.env.ONE_NETWORK === "mainnet" ? "mainnet" : "testnet";
const chain = NETWORKS[network];
/**
 * The live testnet registry, so a fresh install works without configuration.
 *
 * The address is public and anyone can verify it on an explorer, so baking it
 * in gives away nothing. Override it to point at a different deployment.
 */
const DEFAULT_FACTORY: Record<string, string> = {
  testnet: "CDW2TQPSXZ74GNIZKYX7B4N4WJQRXSMYYMFMAEVTEYHGTAISSMPDYGZF",
  mainnet: "",
};

const factory = process.env.ONE_FACTORY_ID ?? DEFAULT_FACTORY[network] ?? "";

const config: NetworkConfig = {
  network,
  rpc: process.env.ONE_RPC_URL ?? chain.rpc,
  horizon: process.env.ONE_HORIZON_URL ?? chain.horizon,
  networkPassphrase: chain.networkPassphrase,
  factory,
};

/**
 * Chain reads are slow and the same listings get asked for repeatedly inside a
 * single task. A short window stops a multi-step job re-reading the registry on
 * every call, without letting a listing go stale enough to mislead.
 */
const CACHE_MS = 60_000;
let cache: { at: number; agents: Agent[] } | null = null;

async function loadAgents(): Promise<Agent[]> {
  if (cache && Date.now() - cache.at < CACHE_MS) return cache.agents;
  const agents = rankAgents(await getAgents(config));
  cache = { at: Date.now(), agents };
  return agents;
}

const SORTS = ["score", "payers", "repeat", "recent", "newest"] as const;
type Sort = (typeof SORTS)[number];

const SIGNAL_MEANING: Record<string, string> = {
  concentrated:
    "One address accounts for most payments. A large total can be a single repeat customer rather than a market.",
  fresh:
    "Most payers were funded within days of paying. Consistent with wash traffic, and equally consistent with a genuine launch.",
  circular:
    "Payers were funded by the listing owner's own address. The clearest self-dealing tell available.",
  dormant: "A real record, but nothing recent.",
};

/**
 * The shape every tool returns for an agent.
 *
 * `hasRecord` leads, and `score` is null rather than 0 when there is no
 * history. A caller reading only the number would otherwise treat an untested
 * agent as a bad one: both look like a low score, and they are not the same
 * state. The distinction matters as much for a model as for a person.
 */
function summarise(agent: Agent) {
  const r = agent.reputation;
  return {
    name: agent.name,
    contract: agent.contract,
    endpoint: agent.endpoint,
    description: agent.description,
    tags: agent.tags,
    payto: agent.payto,
    hasRecord: r.hasRecord,
    score: r.hasRecord ? r.score : null,
    uniquePayers: r.uniquePayers,
    repeatPayers: r.repeatPayers,
    repeatRate: r.repeatRate,
    payments: r.payments,
    volume: r.volume,
    lastPaymentAt: r.lastPaymentAt,
    registeredAt: agent.registeredAt,
    /** Always present, never filtered. A caller may ignore these; it may not be denied them. */
    signals: r.signals,
    explorer: `${chain.explorer}/contract/${agent.contract}`,
  };
}

function interpretation(agent: Agent): string {
  const r = agent.reputation;
  if (!r.hasRecord) {
    return "No payment history. An untested listing, which is not the same as a poorly rated one; no conclusion about quality can be drawn either way.";
  }
  if (r.signals.length === 0) {
    return "Payments come from several independent addresses with no tells raised. Evidence the record was not manufactured, and nothing about output quality.";
  }
  return r.signals.map((s) => SIGNAL_MEANING[s] ?? s).join(" ");
}

/** Untested listings sort last in every mode: unranked, not worst. */
function sortAgents(agents: Agent[], sort: Sort): Agent[] {
  return [...agents].sort((a, b) => {
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
}

const DISCLAIMER =
  "One records payments. It does not test agents, review their output, or approve them. A high score means many addresses paid this agent repeatedly, and nothing about whether calling it is safe.";

const TOOLS = [
  {
    name: "search_agents",
    description:
      "Find agents in the One registry by keyword, tag, or minimum score. Every result carries its risk signals alongside its score. A result with hasRecord false has never been paid: untested, not bad.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Matched against name, description and tags.",
        },
        tags: {
          type: "array",
          items: { type: "string" },
          description: "Every listed tag must be present on the agent.",
        },
        minScore: { type: "number", minimum: 0, maximum: 100 },
        hasRecord: {
          type: "boolean",
          description:
            "True returns only agents with payment history. Omit to include untested listings, which is the default because a new agent is not a bad one.",
        },
        sort: { type: "string", enum: SORTS, default: "score" },
        limit: { type: "number", minimum: 1, maximum: 50, default: 10 },
      },
    },
  },
  {
    name: "get_agent",
    description:
      "Read one listing in full: its complete track record, what each raised signal means, and the individual payments the score was derived from. Use this before calling an agent with anything that matters.",
    inputSchema: {
      type: "object",
      properties: {
        contract: {
          type: "string",
          description: "The agent's contract address, starting with C.",
        },
        includePayments: {
          type: "boolean",
          default: true,
          description:
            "Return the raw payment list so the score can be checked rather than trusted.",
        },
      },
      required: ["contract"],
    },
  },
  {
    name: "list_agents",
    description:
      "Every listing in the registry, sorted and paginated, plus network totals. Use search_agents when looking for something specific.",
    inputSchema: {
      type: "object",
      properties: {
        sort: { type: "string", enum: SORTS, default: "score" },
        offset: { type: "number", minimum: 0, default: 0 },
        limit: { type: "number", minimum: 1, maximum: 50, default: 20 },
      },
    },
  },
] as const;

const server = new Server(
  { name: "oneagent", version: "0.1.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOLS as unknown as Array<{
    name: string;
    description: string;
    inputSchema: object;
  }>,
}));

function reply(value: unknown, isError = false) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(value, null, 2) }],
    isError,
  };
}

function str(v: unknown): string | undefined {
  return typeof v === "string" ? v : undefined;
}

function num(v: unknown): number | undefined {
  return typeof v === "number" && Number.isFinite(v) ? v : undefined;
}

function sortOf(v: unknown): Sort {
  return SORTS.includes(v as Sort) ? (v as Sort) : "score";
}

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name } = request.params;
  const args = (request.params.arguments ?? {}) as Record<string, unknown>;

  if (!factory) {
    return reply(
      {
        error: "No registry configured",
        detail:
          "Set ONE_FACTORY_ID to the One factory contract address. Without it there is nothing to read.",
        network,
      },
      true
    );
  }

  try {
    if (name === "search_agents") {
      const query = str(args.query)?.trim().toLowerCase();
      const tags = Array.isArray(args.tags) ? (args.tags as string[]) : undefined;
      const minScore = num(args.minScore);
      const hasRecord =
        typeof args.hasRecord === "boolean" ? args.hasRecord : undefined;
      const limit = Math.min(num(args.limit) ?? 10, 50);

      const found = sortAgents(
        (await loadAgents()).filter((a) => {
          const r = a.reputation;
          if (hasRecord !== undefined && r.hasRecord !== hasRecord) return false;
          if (minScore !== undefined && (!r.hasRecord || r.score < minScore)) return false;
          if (tags?.length && !tags.every((t) => a.tags.includes(t))) return false;
          if (!query) return true;
          return (
            a.name.toLowerCase().includes(query) ||
            a.description.toLowerCase().includes(query) ||
            a.tags.some((t) => t.toLowerCase().includes(query))
          );
        }),
        sortOf(args.sort)
      );

      return reply({
        network,
        matched: found.length,
        agents: found.slice(0, limit).map(summarise),
        disclaimer: DISCLAIMER,
      });
    }

    if (name === "get_agent") {
      const contract = str(args.contract);
      if (!contract) {
        return reply({ error: "contract is required" }, true);
      }

      let agent: Agent;
      try {
        agent = await getAgent(config, contract);
      } catch {
        return reply(
          { error: "Not found", detail: `No listing at ${contract} on ${network}.` },
          true
        );
      }

      const includePayments = args.includePayments !== false;
      const payments = includePayments
        ? await getPaymentsReceived(config, agent.payto)
        : undefined;

      return reply({
        network,
        agent: summarise(agent),
        interpretation: interpretation(agent),
        signalMeanings: Object.fromEntries(
          agent.reputation.signals.map((s) => [s, SIGNAL_MEANING[s] ?? s])
        ),
        payments: payments?.map((p) => ({
          from: p.from,
          amount: p.amount,
          asset: p.asset,
          at: p.at,
        })),
        // Repeated on every read rather than left to documentation nobody loads.
        disclaimer: DISCLAIMER,
      });
    }

    if (name === "list_agents") {
      const offset = num(args.offset) ?? 0;
      const limit = Math.min(num(args.limit) ?? 20, 50);
      const [all, stats] = await Promise.all([loadAgents(), getNetworkStats(config)]);
      const sorted = sortAgents(all, sortOf(args.sort));

      return reply({
        network,
        stats: {
          agents: stats.agents,
          payments: stats.payments,
          uniquePayers: stats.uniquePayers,
          activeLast7d: stats.activeLast7d,
        },
        total: sorted.length,
        offset,
        agents: sorted.slice(offset, offset + limit).map(summarise),
        disclaimer: DISCLAIMER,
      });
    }

    return reply({ error: `Unknown tool: ${name}` }, true);
  } catch (error) {
    // A failed chain read is reported as a failure, never as an empty registry:
    // "we could not check" and "there is nothing" must not look alike.
    return reply(
      {
        error: "Chain read failed",
        detail: error instanceof Error ? error.message : String(error),
        network,
      },
      true
    );
  }
});

/**
 * Wrapped rather than awaited at the top level: the bundle is emitted as CJS so
 * that the CommonJS dependencies inside stellar-sdk keep working, and CJS has
 * no top-level await.
 */
async function main() {
  await server.connect(new StdioServerTransport());
}

main().catch((error) => {
  console.error("[oneagent] failed to start:", error);
  process.exit(1);
});
