import { Landing } from "@/generated/landing";
import { TopAgents } from "@/components/top-agents";
import { getAgentSnapshot, getNetworkStats } from "@/lib/one";

export default async function Page() {
  const [stats, snapshot] = await Promise.all([
    getNetworkStats(),
    getAgentSnapshot(),
  ]);

  return (
    <Landing
      stats={{
        agents: stats.agents,
        payments: stats.payments,
        uniquePayers: stats.uniquePayers,
        activeLast7d: stats.activeLast7d,
      }}
      empty={stats.agents === 0}
      topAgents={
        <TopAgents agents={snapshot.agents.slice(0, 4)} now={snapshot.now} />
      }
    />
  );
}
