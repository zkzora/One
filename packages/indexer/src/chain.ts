import {
  Account,
  BASE_FEE,
  Contract,
  Horizon,
  nativeToScVal,
  rpc,
  scValToNative,
  TransactionBuilder,
  type xdr,
} from "@stellar/stellar-sdk";
import type { AgentListing, NetworkConfig, PayerOrigin, Payment } from "./types";

/**
 * Simulation needs a source account but never submits, so any well-formed
 * address works. Using a fixed one keeps reads free of key management.
 */
const READ_ONLY_SOURCE =
  "GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF";

/** Read a contract function without submitting a transaction. */
async function readContract<T>(
  config: NetworkConfig,
  contractId: string,
  method: string,
  args: xdr.ScVal[] = []
): Promise<T> {
  const server = new rpc.Server(config.rpc, {
    allowHttp: config.rpc.startsWith("http://"),
  });
  const contract = new Contract(contractId);

  const tx = new TransactionBuilder(new Account(READ_ONLY_SOURCE, "0"), {
    fee: BASE_FEE,
    networkPassphrase: config.networkPassphrase,
  })
    .addOperation(contract.call(method, ...args))
    .setTimeout(30)
    .build();

  const sim = await server.simulateTransaction(tx);

  if (rpc.Api.isSimulationError(sim)) {
    throw new Error(`${contractId}.${method} failed: ${sim.error}`);
  }
  if (!sim.result) {
    throw new Error(`${contractId}.${method} returned nothing`);
  }

  return scValToNative(sim.result.retval) as T;
}

export async function getAgentCount(config: NetworkConfig): Promise<number> {
  return readContract<number>(config, config.factory, "count");
}

/** Agent contract addresses, paginated the same way the contract paginates. */
export async function listAgentContracts(
  config: NetworkConfig,
  start = 0,
  limit = 100
): Promise<string[]> {
  return readContract<string[]>(config, config.factory, "list", [
    nativeToScVal(start, { type: "u32" }),
    nativeToScVal(limit, { type: "u32" }),
  ]);
}

/** Every listing. Pages until the contract stops returning rows. */
export async function listAllAgentContracts(
  config: NetworkConfig
): Promise<string[]> {
  const total = await getAgentCount(config);
  const out: string[] = [];
  const page = 50;

  for (let start = 0; start < total; start += page) {
    const batch = await listAgentContracts(config, start, page);
    if (batch.length === 0) break;
    out.push(...batch);
  }

  return out;
}

/** Read one agent's own contract. */
export async function getAgentListing(
  config: NetworkConfig,
  contractId: string
): Promise<AgentListing> {
  const info = await readContract<{
    owner: string;
    payto: string;
    name: string;
    endpoint: string;
    description: string;
    tags: string[];
    registered_at: bigint;
    updated_at: bigint;
  }>(config, contractId, "info");

  return {
    contract: contractId,
    owner: info.owner,
    payto: info.payto,
    name: info.name,
    endpoint: info.endpoint,
    description: info.description,
    tags: info.tags ?? [],
    registeredAt: Number(info.registered_at),
    updatedAt: Number(info.updated_at),
  };
}

/**
 * Payments received by an address.
 *
 * Only incoming transfers count — an agent paying someone else says nothing
 * about whether anyone wanted its output. Payments from the address to itself
 * are dropped for the same reason.
 */
export async function getPaymentsReceived(
  config: NetworkConfig,
  address: string,
  limit = 200
): Promise<Payment[]> {
  const server = new Horizon.Server(config.horizon, {
    allowHttp: config.horizon.startsWith("http://"),
  });

  const payments: Payment[] = [];
  let page;

  try {
    page = await server.payments().forAccount(address).order("desc").limit(200).call();
  } catch (error) {
    // An address that has never been funded has no payment history, which is a
    // valid state ("untested"), not a failure.
    if (isNotFound(error)) return [];
    throw error;
  }

  while (page && payments.length < limit) {
    for (const record of page.records) {
      const parsed = toPayment(record, address);
      if (parsed) payments.push(parsed);
      if (payments.length >= limit) break;
    }
    if (payments.length >= limit || page.records.length === 0) break;
    page = await page.next();
  }

  return payments;
}

type PaymentRecord = {
  type: string;
  from?: string;
  to?: string;
  amount?: string;
  asset_type?: string;
  asset_code?: string;
  created_at: string;
};

function toPayment(record: unknown, recipient: string): Payment | null {
  const r = record as PaymentRecord;

  if (r.type !== "payment") return null;
  if (r.to !== recipient) return null;
  if (!r.from || r.from === recipient) return null;
  if (!r.amount) return null;

  return {
    from: r.from,
    amount: Number(r.amount),
    asset: r.asset_type === "native" ? "XLM" : (r.asset_code ?? "unknown"),
    at: Math.floor(new Date(r.created_at).getTime() / 1000),
  };
}

/**
 * Where each payer came from: when its account was created, and who paid to
 * create it. The first answers "fresh payers", the second answers "circular".
 * They are read together because both come from the same first operation.
 */
export async function getPayerOrigins(
  config: NetworkConfig,
  addresses: string[]
): Promise<Map<string, PayerOrigin>> {
  const server = new Horizon.Server(config.horizon, {
    allowHttp: config.horizon.startsWith("http://"),
  });
  const origins = new Map<string, PayerOrigin>();

  await Promise.all(
    addresses.map(async (address) => {
      try {
        const page = await server
          .operations()
          .forAccount(address)
          .order("asc")
          .limit(1)
          .call();

        const first = page.records[0] as
          | { type: string; funder?: string; created_at: string }
          | undefined;

        if (first?.type === "create_account") {
          origins.set(address, {
            createdAt: Math.floor(new Date(first.created_at).getTime() / 1000),
            funder: first.funder ?? null,
          });
        }
      } catch (error) {
        if (!isNotFound(error)) throw error;
      }
    })
  );

  return origins;
}

function isNotFound(error: unknown): boolean {
  const status = (error as { response?: { status?: number } })?.response?.status;
  return status === 404;
}
