export type Network = "testnet" | "mainnet";

export type NetworkConfig = {
  network: Network;
  rpc: string;
  horizon: string;
  networkPassphrase: string;
  factory: string;
};

/** What the agent's own contract stores. Written by its operator. */
export type AgentListing = {
  /** The agent's contract address. */
  contract: string;
  owner: string;
  /** Payment address. Immutable — the reputation key. */
  payto: string;
  name: string;
  endpoint: string;
  description: string;
  tags: string[];
  registeredAt: number;
  updatedAt: number;
};

/** How a payer's account came to exist. Feeds the "fresh" and "circular" tells. */
export type PayerOrigin = {
  createdAt: number;
  /** The account that funded it, when the ledger records one. */
  funder: string | null;
};

export type Payment = {
  from: string;
  /** Normalised to a number of whole units. */
  amount: number;
  asset: string;
  at: number;
};

/**
 * Risk tells, computed from payment history.
 *
 * `untested` is not in this list on purpose: having no record is not a warning,
 * and the UI must never render it as one.
 */
export type RiskSignal = "concentrated" | "fresh" | "circular" | "dormant";

export type Reputation = {
  /** False when nobody has paid this agent yet. */
  hasRecord: boolean;
  payments: number;
  uniquePayers: number;
  /** Payers who paid more than once. */
  repeatPayers: number;
  /** repeatPayers / uniquePayers, as a percentage. */
  repeatRate: number;
  volume: number;
  firstPaymentAt: number | null;
  lastPaymentAt: number | null;
  averageAmount: number;
  medianAmount: number;
  /** 0–100. Only meaningful when `hasRecord` is true. */
  score: number;
  signals: RiskSignal[];
};

export type Agent = AgentListing & { reputation: Reputation };

export type NetworkStats = {
  agents: number;
  payments: number;
  uniquePayers: number;
  volume: number;
  activeLast7d: number;
  /** False before a factory is configured, so the UI can say so honestly. */
  live: boolean;
};
