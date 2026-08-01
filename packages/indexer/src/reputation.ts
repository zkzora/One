import type { PayerOrigin, Payment, Reputation, RiskSignal } from "./types";

const DAY = 86_400;

/** A payer holding this share of all payments makes the record one person's opinion. */
const CONCENTRATION_THRESHOLD = 0.6;
/** Accounts funded this recently before paying look like they were made to pay. */
const FRESH_PAYER_WINDOW = 7 * DAY;
/** Most payers being fresh is the tell, not one of them. */
const FRESH_PAYER_SHARE = 0.5;
/** No payment in this long and the record is history, not status. */
const DORMANT_AFTER = 90 * DAY;

/**
 * Score weights. They must sum to 100.
 *
 * Reach leads: being paid by many different addresses is harder to arrange than
 * being paid twice by one. Loyalty still carries real weight because a second
 * payment is a statement about the output rather than about curiosity. Recency
 * keeps a stale record from outranking a live one.
 *
 * Raw payment count is deliberately absent — it is the cheapest number to
 * inflate, and counting it would reward exactly the behaviour the risk signals
 * exist to catch.
 */
const WEIGHT_REACH = 45;
const WEIGHT_LOYALTY = 35;
const WEIGHT_RECENCY = 20;

/** Multipliers applied when a tell fires. Lower means a harsher penalty. */
const PENALTY_CONCENTRATED = 0.7;
const PENALTY_FRESH = 0.7;
const PENALTY_CIRCULAR = 0.4;

export type ReputationInput = {
  payments: Payment[];
  /** Listing owner, used to spot payments that came from the operator's side. */
  owner: string;
  /**
   * Payer address -> how that account came to exist. Callers that cannot
   * resolve origins pass an empty map, and the tells that depend on it are
   * simply never raised rather than guessed at.
   */
  origins?: Map<string, PayerOrigin>;
  /** Unix seconds. Injected so results are reproducible in tests. */
  now: number;
};

export function computeReputation({
  payments,
  owner,
  origins = new Map(),
  now,
}: ReputationInput): Reputation {
  if (payments.length === 0) {
    return {
      hasRecord: false,
      payments: 0,
      uniquePayers: 0,
      repeatPayers: 0,
      repeatRate: 0,
      volume: 0,
      firstPaymentAt: null,
      lastPaymentAt: null,
      averageAmount: 0,
      medianAmount: 0,
      score: 0,
      signals: [],
    };
  }

  const byPayer = new Map<string, Payment[]>();
  for (const payment of payments) {
    const existing = byPayer.get(payment.from);
    if (existing) existing.push(payment);
    else byPayer.set(payment.from, [payment]);
  }

  const uniquePayers = byPayer.size;
  const repeatPayers = [...byPayer.values()].filter((p) => p.length > 1).length;
  const repeatRate = Math.round((repeatPayers / uniquePayers) * 100);

  const amounts = payments.map((p) => p.amount).sort((a, b) => a - b);
  const volume = amounts.reduce((sum, a) => sum + a, 0);
  const times = payments.map((p) => p.at);
  const firstPaymentAt = Math.min(...times);
  const lastPaymentAt = Math.max(...times);

  const signals = detectSignals({
    payments,
    byPayer,
    owner,
    origins,
    now,
    lastPaymentAt,
  });

  return {
    hasRecord: true,
    payments: payments.length,
    uniquePayers,
    repeatPayers,
    repeatRate,
    volume,
    firstPaymentAt,
    lastPaymentAt,
    averageAmount: volume / payments.length,
    medianAmount: median(amounts),
    score: score({ uniquePayers, repeatRate, lastPaymentAt, now, signals }),
    signals,
  };
}

function detectSignals({
  payments,
  byPayer,
  owner,
  origins,
  now,
  lastPaymentAt,
}: {
  payments: Payment[];
  byPayer: Map<string, Payment[]>;
  owner: string;
  origins: Map<string, PayerOrigin>;
  now: number;
  lastPaymentAt: number;
}): RiskSignal[] {
  const signals: RiskSignal[] = [];

  // Concentrated — a large total can be one repeat customer, not a market.
  const largest = Math.max(...[...byPayer.values()].map((p) => p.length));
  if (byPayer.size > 1 && largest / payments.length >= CONCENTRATION_THRESHOLD) {
    signals.push("concentrated");
  } else if (byPayer.size === 1 && payments.length > 1) {
    signals.push("concentrated");
  }

  // Fresh payers — accounts funded days before they paid. Consistent with wash
  // traffic, and equally consistent with a genuine launch, which is why this is
  // shown as a tell rather than treated as proof.
  const firstSeen = new Map<string, number>();
  for (const [payer, list] of byPayer) {
    firstSeen.set(payer, Math.min(...list.map((p) => p.at)));
  }
  const fresh = [...byPayer.keys()].filter((payer) => {
    const origin = origins.get(payer);
    const seen = firstSeen.get(payer);
    if (!origin || seen === undefined) return false;
    return seen - origin.createdAt <= FRESH_PAYER_WINDOW;
  });
  if (byPayer.size > 0 && fresh.length / byPayer.size >= FRESH_PAYER_SHARE) {
    signals.push("fresh");
  }

  // Circular — the payers were funded by the listing owner.
  const circular = [...byPayer.keys()].some(
    (payer) => origins.get(payer)?.funder === owner
  );
  if (circular || byPayer.has(owner)) {
    signals.push("circular");
  }

  // Dormant — a real record, but nothing recent.
  if (now - lastPaymentAt > DORMANT_AFTER) {
    signals.push("dormant");
  }

  return signals;
}

/** 0–100. See the weight constants for what each part is worth and why. */
function score({
  uniquePayers,
  repeatRate,
  lastPaymentAt,
  now,
  signals,
}: {
  uniquePayers: number;
  repeatRate: number;
  lastPaymentAt: number;
  now: number;
  signals: RiskSignal[];
}): number {
  // Distinct payers, with diminishing returns: the tenth payer proves far more
  // than the hundredth. Saturates around 100 payers.
  const reach = Math.min(1, Math.log10(uniquePayers + 1) / 2);
  const loyalty = repeatRate / 100;
  // Decays to zero over the same window that marks an agent dormant, so the
  // score and the tell agree with each other.
  const recency = Math.max(0, 1 - (now - lastPaymentAt) / DORMANT_AFTER);

  let raw =
    reach * WEIGHT_REACH + loyalty * WEIGHT_LOYALTY + recency * WEIGHT_RECENCY;

  // Tells reduce the score rather than hiding the listing, so a flagged agent
  // still shows the record that earned the flag.
  if (signals.includes("concentrated")) raw *= PENALTY_CONCENTRATED;
  if (signals.includes("fresh")) raw *= PENALTY_FRESH;
  if (signals.includes("circular")) raw *= PENALTY_CIRCULAR;

  return Math.max(0, Math.min(100, Math.round(raw)));
}

function median(sorted: number[]): number {
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1]! + sorted[mid]!) / 2
    : sorted[mid]!;
}
