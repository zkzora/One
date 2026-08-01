import { cacheLife } from "next/cache";
import {
  getAgent as readAgent,
  getPaymentsReceived,
  getAgents as readAgents,
  getNetworkStats as readNetworkStats,
  rankAgents,
  type Agent,
  type NetworkConfig,
  type NetworkStats,
  type Payment,
} from "@one/indexer";

const NETWORKS = {
  testnet: {
    rpc: "https://soroban-testnet.stellar.org",
    horizon: "https://horizon-testnet.stellar.org",
    networkPassphrase: "Test SDF Network ; September 2015",
    explorer: "https://stellar.expert/explorer/testnet",
    label: "Testnet",
  },
  mainnet: {
    rpc: "https://mainnet.sorobanrpc.com",
    horizon: "https://horizon.stellar.org",
    networkPassphrase: "Public Global Stellar Network ; September 2015",
    explorer: "https://stellar.expert/explorer/public",
    label: "Mainnet",
  },
} as const;

export const network =
  process.env.NEXT_PUBLIC_STELLAR_NETWORK === "mainnet" ? "mainnet" : "testnet";

export const chain = NETWORKS[network];

/** Empty until a factory is deployed and configured. */
export const factoryId = process.env.NEXT_PUBLIC_FACTORY_ID ?? "";

/** True once the site can read real data instead of reporting honest zeros. */
export const isLive = factoryId.length > 0;

const config: NetworkConfig = {
  network,
  rpc: chain.rpc,
  horizon: chain.horizon,
  networkPassphrase: chain.networkPassphrase,
  factory: factoryId,
};

const EMPTY_STATS: NetworkStats = {
  agents: 0,
  payments: 0,
  uniquePayers: 0,
  volume: 0,
  activeLast7d: 0,
  live: false,
};

/**
 * Chain reads are slow and every visitor sees the same answer, so they are
 * cached. The window is short because a listing that just registered should
 * appear quickly — the point of the site is that the numbers are current.
 */
export async function getNetworkStats(): Promise<NetworkStats> {
  "use cache";
  cacheLife("minutes");

  if (!isLive) return EMPTY_STATS;

  try {
    return await readNetworkStats(config);
  } catch (error) {
    // A failed read is not the same as an empty registry. Report it as not
    // live so the UI says "we could not read the chain" instead of inventing
    // zeros that look like measurements.
    console.error("[one] network stats read failed", error);
    return EMPTY_STATS;
  }
}

export type AgentSnapshot = {
  agents: Agent[];
  /**
   * The clock the snapshot was taken against, in unix seconds.
   *
   * Time is resolved here rather than in the browser because relative labels
   * ("4h ago") and the seven-day active count must not be recomputed during
   * prerender — a non-deterministic render is rejected outright, and a value
   * that differs between server and client causes a hydration mismatch. Coming
   * out of a cached function, this refreshes with the cache rather than on
   * every request.
   */
  now: number;
};

export async function getAgentSnapshot(): Promise<AgentSnapshot> {
  "use cache";
  cacheLife("minutes");

  const now = Math.floor(Date.now() / 1000);

  if (!isLive) return { agents: [], now };

  try {
    return { agents: rankAgents(await readAgents(config, now)), now };
  } catch (error) {
    console.error("[one] agent list read failed", error);
    return { agents: [], now };
  }
}

export async function getAgents(): Promise<Agent[]> {
  return (await getAgentSnapshot()).agents;
}

export async function getAgent(contractId: string): Promise<Agent | null> {
  return (await getAgentDetail(contractId))?.agent ?? null;
}

export type AgentDetail = {
  agent: Agent;
  /** The payments the score was derived from, so the page can show its work. */
  payments: Payment[];
  now: number;
};

export async function getAgentDetail(
  contractId: string
): Promise<AgentDetail | null> {
  "use cache";
  cacheLife("minutes");

  if (!isLive) return null;

  const now = Math.floor(Date.now() / 1000);

  try {
    const agent = await readAgent(config, contractId, now);
    const payments = await getPaymentsReceived(config, agent.payto);
    return { agent, payments, now };
  } catch (error) {
    console.error(`[one] agent read failed for ${contractId}`, error);
    return null;
  }
}

export function explorerContract(contractId: string) {
  return `${chain.explorer}/contract/${contractId}`;
}

export function explorerAccount(address: string) {
  return `${chain.explorer}/account/${address}`;
}

export type { Agent, NetworkStats, Payment };
