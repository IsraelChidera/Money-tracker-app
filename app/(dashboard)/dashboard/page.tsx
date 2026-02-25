"use client";

import { Wallet, PiggyBank, TrendingUp, BarChart2 } from "lucide-react";
import { useAppStore, selectTotalSavings, selectTotalInvestments, selectNetWorth } from "@/store/app-store";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { WelcomeBanner } from "@/components/dashboard/welcome-banner";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { NetWorthChart } from "@/components/charts/net-worth-chart";
import { AllocationChart } from "@/components/charts/allocation-chart";
import { ContributionsChart } from "@/components/charts/contributions-chart";
import { NET_WORTH_DATA, CONTRIBUTION_DATA, ALLOCATION_DATA, MOCK_ACTIVITY } from "@/lib/mock-data";
import { formatCurrency, formatPercentage } from "@/lib/utils";

export default function DashboardPage() {
  const user = useAppStore((s) => s.user);
  const totalSavings = useAppStore(selectTotalSavings);
  const totalInvestments = useAppStore(selectTotalInvestments);
  const netWorth = useAppStore(selectNetWorth);

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <WelcomeBanner name={user.name} netWorth={netWorth} />

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Net Worth"
          value={formatCurrency(netWorth)}
          change={10.5}
          icon={Wallet}
          accentColor="#6366f1"
        />
        <StatCard
          label="Total Savings"
          value={formatCurrency(totalSavings)}
          change={5.2}
          icon={PiggyBank}
          accentColor="#10b981"
        />
        <StatCard
          label="Investments"
          value={formatCurrency(totalInvestments)}
          change={15.8}
          icon={TrendingUp}
          accentColor="#f59e0b"
        />
        <StatCard
          label="Monthly Growth"
          value={formatPercentage(12.4)}
          change={3.1}
          icon={BarChart2}
          accentColor="#ec4899"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Net worth area chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Net Worth Growth</CardTitle>
              <p className="mt-0.5 text-xs text-zinc-500">Last 7 months</p>
            </div>
          </CardHeader>
          <NetWorthChart data={NET_WORTH_DATA} />
        </Card>

        {/* Allocation donut */}
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Allocation</CardTitle>
          </CardHeader>
          <AllocationChart
            data={ALLOCATION_DATA}
            totalNetWorth={totalSavings + totalInvestments}
          />
        </Card>
      </div>

      {/* Contributions + Activity */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Monthly Contributions</CardTitle>
              <p className="mt-0.5 text-xs text-zinc-500">Savings vs Investments</p>
            </div>
          </CardHeader>
          <ContributionsChart data={CONTRIBUTION_DATA} />
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <ActivityFeed items={MOCK_ACTIVITY} />
        </Card>
      </div>
    </div>
  );
}
