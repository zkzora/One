import {
  getAgentCount,
  getAgentListing,
  getPayerOrigins,
  getPaymentsReceived,
  listAllAgentContracts,
} from "./chain";
import { computeReputation } from "./reputation";
import type { Agent, NetworkConfig, NetworkStats } from "./types";

export * from "./types";
export { computeReputation } from "./reputation";
export {
  getAgentCount,
  getAgentListing,
  getPaymentsReceived,
  listAgentContracts,
  listAllAgentContracts,
} from "./chain";

const WEEK = 7 * 86_400;

/** Read a listing and derive its track record from the ledger. */
export async function getAgent(
  config: NetworkConfig,
  contractId: string,
  now = Math.floor(Date.now() / 1000)
): Promise<Agent> {
  const listing = await getAgentListing(config, contractId);
  const payments = await getPaymentsReceived(config, listing.payto);

  const payers = [...new Set(payments.map((p) => p.from))];
  const origins = payers.length > 0 ? await getPayerOrigins(config, payers) : new Map();

  return {
    ...listing,
    reputation: computeReputation({
      payments,
      owner: listing.owner,
      origins,
      now,
    }),
  };
}

/**
 * Every listing with its track record.
 *
 * Reads run concurrently because each agent is independent, but the whole set
 * is awaited: a partial directory would rank agents against an incomplete
 * field, which is worse than waiting.
 */
export async function getAgents(
  config: NetworkConfig,
  now = Math.floor(Date.now() / 1000)
): Promise<Agent[]> {
  const contracts = await listAllAgentContracts(config);
  return Promise.all(contracts.map((id) => getAgent(config, id, now)));
}

/** Highest scoring first. Listings with no record sort last, not lowest. */
export function rankAgents(agents: Agent[]): Agent[] {
  return [...agents].sort((a, b) => {
    if (a.reputation.hasRecord !== b.reputation.hasRecord) {
      return a.reputation.hasRecord ? -1 : 1;
    }
    if (b.reputation.score !== a.reputation.score) {
      return b.reputation.score - a.reputation.score;
    }
    return b.registeredAt - a.registeredAt;
  });
}

/** Totals for the landing page, derived from the same reads as everything else. */
export async function getNetworkStats(
  config: NetworkConfig,
  now = Math.floor(Date.now() / 1000)
): Promise<NetworkStats> {
  if (!config.factory) {
    return {
      agents: 0,
      payments: 0,
      uniquePayers: 0,
      volume: 0,
      activeLast7d: 0,
      live: false,
    };
  }

  const contracts = await listAllAgentContracts(config);

  // One pass: each agent's payments are fetched once and used for every total.
  const perAgent = await Promise.all(
    contracts.map(async (id) => {
      const listing = await getAgentListing(config, id);
      return getPaymentsReceived(config, listing.payto);
    })
  );

  // Unique payers is a network-wide figure, so it has to be a set — summing
  // per-agent counts would double count anyone who paid two different agents.
  const payers = new Set<string>();
  let payments = 0;
  let volume = 0;
  let activeLast7d = 0;

  for (const received of perAgent) {
    payments += received.length;
    for (const payment of received) {
      payers.add(payment.from);
      volume += payment.amount;
    }
    const last = received.reduce((max, p) => Math.max(max, p.at), 0);
    if (last > 0 && now - last <= WEEK) activeLast7d += 1;
  }

  return {
    agents: contracts.length,
    payments,
    uniquePayers: payers.size,
    volume,
    activeLast7d,
    live: true,
  };
}

export { getAgentCount as getRegisteredCount };
