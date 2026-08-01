import { Dashboard } from "@/generated/dashboard";
import { getNetworkStats } from "@/lib/one";

export const metadata = { title: "Dashboard" };

export default async function Page() {
  const stats = await getNetworkStats();

  return (
    <Dashboard
      stats={{
        agents: stats.agents,
        payments: stats.payments,
        uniquePayers: stats.uniquePayers,
        activeLast7d: stats.activeLast7d,
      }}
      empty={stats.agents === 0}
      // No wallet integration yet, so the honest state is the gate. Showing the
      // dashboard would mean showing figures that belong to nobody.
      connected={false}
    />
  );
}
