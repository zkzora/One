/**
 * Reads the live deployment through the indexer and prints what it found.
 * This is the end-to-end check: contracts -> chain -> reputation.
 */
import { readFileSync } from "node:fs";
import { getAgents, getNetworkStats, rankAgents } from "../packages/indexer/src/index.ts";

const d = JSON.parse(readFileSync("deployments/testnet.json", "utf8"));
const config = {
  network: d.network,
  rpc: d.rpc,
  horizon: d.horizon,
  networkPassphrase: d.networkPassphrase,
  factory: d.factory,
};

console.log(`factory ${config.factory}\n`);

const stats = await getNetworkStats(config);
console.log("NETWORK");
for (const [k, v] of Object.entries(stats)) console.log(`  ${k.padEnd(14)} ${v}`);

const agents = rankAgents(await getAgents(config));
console.log(`\nAGENTS (${agents.length})`);
for (const a of agents) {
  const r = a.reputation;
  console.log(`\n  ${a.name}  ${a.contract}`);
  console.log(`    payto      ${a.payto}`);
  console.log(`    endpoint   ${a.endpoint}`);
  console.log(`    tags       ${a.tags.join(", ")}`);
  console.log(`    hasRecord  ${r.hasRecord}`);
  console.log(`    score      ${r.hasRecord ? r.score : "no score yet"}`);
  console.log(`    payers     ${r.uniquePayers} unique / ${r.payments} payments`);
  console.log(`    repeat     ${r.repeatRate}%`);
  console.log(`    signals    ${r.signals.length ? r.signals.join(", ") : "none"}`);
}
