"use client";

import { useMemo } from "react";
import { Wallet, PiggyBank, TrendingUp, BarChart2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useSavings } from "@/hooks/useSavings";
import { useInvestments } from "@/hooks/useInvestments";
import { useActivity } from "@/hooks/useActivity";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardHeader, CardTitle, CardSubtitle } from "@/components/ui/card";
import { WelcomeBanner } from "@/components/dashboard/welcome-banner";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { NetWorthChart } from "@/components/charts/net-worth-chart";
import { AllocationChart } from "@/components/charts/allocation-chart";
import { ContributionsChart } from "@/components/charts/contributions-chart";
import { formatCurrency, formatPercentage } from "@/lib/utils";
import type { NetWorthDataPoint, ContributionDataPoint } from "@/types";

const ASSET_COLORS: Record<string, string> = {
  Stocks: "#6366f1",
  ETF: "#10b981",
  Bonds: "#f59e0b",
  "Real Estate": "#ec4899",
  Crypto: "#f97316",
  "Fixed Income": "#06b6d4",
  "Mutual Fund": "#8b5cf6",
  Other: "#71717a",
};

type Currency = "NGN" | "USD" | "GBP" | "EUR";

/** Returns month-over-month % change for a list of amount+date items. */
function calcMonthlyChange(
  items: { date: string; amount: number }[]
): number | undefined {
  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

  const thisMonth = items
    .filter((i) => new Date(i.date) >= thisMonthStart)
    .reduce((sum, i) => sum + i.amount, 0);

  const lastMonth = items
    .filter((i) => {
      const d = new Date(i.date);
      return d >= lastMonthStart && d <= lastMonthEnd;
    })
    .reduce((sum, i) => sum + i.amount, 0);

  if (lastMonth === 0) return undefined;
  return ((thisMonth - lastMonth) / lastMonth) * 100;
}

export default function DashboardPage() {
  const { profile } = useAuth();
  const { savings, loading: savingsLoading } = useSavings();
  const { investments, totalValue: totalInvestments, loading: investLoading } = useInvestments();
  const { activity, loading: activityLoading } = useActivity(8);

  const currency = (profile?.currency ?? "NGN") as Currency;

  const totalSavings = savings.reduce((sum, s) => sum + s.amount, 0);
  const netWorth = totalSavings + totalInvestments;

  // ── Month-over-month changes ─────────────────────────────────────────────
  const savingsChange = useMemo(
    () => calcMonthlyChange(savings.map((s) => ({ date: s.date, amount: s.amount }))),
    [savings]
  );
  const investChange = useMemo(
    () =>
      calcMonthlyChange(investments.map((i) => ({ date: i.date, amount: i.currentValue }))),
    [investments]
  );
  const allChange = useMemo(() => {
    if (savingsChange === undefined && investChange === undefined) return undefined;
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    const thisMo =
      savings.filter((s) => new Date(s.date) >= thisMonthStart).reduce((sum, s) => sum + s.amount, 0) +
      investments.filter((i) => new Date(i.date) >= thisMonthStart).reduce((sum, i) => sum + i.currentValue, 0);

    const lastMo =
      savings
        .filter((s) => { const d = new Date(s.date); return d >= lastMonthStart && d <= lastMonthEnd; })
        .reduce((sum, s) => sum + s.amount, 0) +
      investments
        .filter((i) => { const d = new Date(i.date); return d >= lastMonthStart && d <= lastMonthEnd; })
        .reduce((sum, i) => sum + i.currentValue, 0);

    if (lastMo === 0) return undefined;
    return ((thisMo - lastMo) / lastMo) * 100;
  }, [savings, investments]);

  // ── Net worth timeline ─────────────────────────────────────────────────────
  const netWorthData = useMemo((): NetWorthDataPoint[] => {
    if (savings.length === 0 && investments.length === 0) return [];

    const allDates = [
      ...savings.map((s) => new Date(s.date).getTime()),
      ...investments.map((i) => new Date(i.date).getTime()),
    ];
    const earliest = new Date(Math.min(...allDates));
    const now = new Date();
    const points: NetWorthDataPoint[] = [];

    let cursor = new Date(earliest.getFullYear(), earliest.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    while (cursor <= lastMonth) {
      const endOfMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0, 23, 59, 59);

      const savingsTotal = savings
        .filter((s) => new Date(s.date) <= endOfMonth)
        .reduce((sum, s) => sum + s.amount, 0);

      const investTotal = investments
        .filter((i) => new Date(i.date) <= endOfMonth)
        .reduce((sum, i) => sum + i.currentValue, 0);

      points.push({
        month: cursor.toLocaleString("en", { month: "short" }),
        value: savingsTotal + investTotal,
      });

      cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
    }

    return points.slice(-12);
  }, [savings, investments]);

  const chartSubtitle =
    netWorthData.length === 0
      ? "No data yet"
      : netWorthData.length === 1
      ? "1 month of data"
      : `Last ${netWorthData.length} months`;

  // ── Monthly contributions (last 7 months) ──────────────────────────────────
  const contributionsData = useMemo((): ContributionDataPoint[] => {
    const now = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (6 - i), 1);
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);

      const monthSavings = savings
        .filter((s) => { const d = new Date(s.date); return d >= date && d <= endOfMonth; })
        .reduce((sum, s) => sum + s.amount, 0);

      const monthInvestments = investments
        .filter((inv) => { const d = new Date(inv.date); return d >= date && d <= endOfMonth; })
        .reduce((sum, inv) => sum + inv.currentValue, 0);

      return {
        month: date.toLocaleString("en", { month: "short" }),
        savings: monthSavings,
        investments: monthInvestments,
      };
    });
  }, [savings, investments]);

  // ── Portfolio allocation ───────────────────────────────────────────────────
  const allocationData = investments.map((inv) => ({
    name: inv.assetName,
    value: inv.currentValue,
    color: ASSET_COLORS[inv.assetClass] ?? "#6366f1",
  }));

  const loading = savingsLoading || investLoading;

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-28 rounded-2xl bg-white/5" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 rounded-2xl bg-white/5" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="lg:col-span-2 h-72 rounded-2xl bg-white/5" />
          <div className="h-72 rounded-2xl bg-white/5" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <WelcomeBanner
        name={profile?.name ?? ""}
        netWorth={netWorth}
        currency={currency}
      />

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Net Worth"
          value={formatCurrency(netWorth, currency)}
          change={allChange}
          icon={Wallet}
          accentColor="#6366f1"
        />
        <StatCard
          label="Total Savings"
          value={formatCurrency(totalSavings, currency)}
          change={savingsChange}
          icon={PiggyBank}
          accentColor="#10b981"
        />
        <StatCard
          label="Investments"
          value={formatCurrency(totalInvestments, currency)}
          change={investChange}
          icon={TrendingUp}
          accentColor="#f59e0b"
        />
        <StatCard
          label="Monthly Growth"
          value={allChange !== undefined ? formatPercentage(allChange) : "—"}
          icon={BarChart2}
          accentColor="#ec4899"
          subtext={allChange === undefined ? "Add data to track" : "vs last month"}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Net Worth Growth</CardTitle>
              <CardSubtitle>{chartSubtitle}</CardSubtitle>
            </div>
          </CardHeader>
          <NetWorthChart data={netWorthData} currency={currency} />
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Portfolio Allocation</CardTitle>
          </CardHeader>
          <AllocationChart
            data={
              allocationData.length > 0
                ? allocationData
                : [{ name: "No investments", value: 1, color: "#3f3f46" }]
            }
            totalNetWorth={netWorth}
          />
        </Card>
      </div>

      {/* Contributions + Activity */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Monthly Contributions</CardTitle>
              <CardSubtitle>Savings vs Investments</CardSubtitle>
            </div>
          </CardHeader>
          <ContributionsChart data={contributionsData} currency={currency} />
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <ActivityFeed items={activity} loading={activityLoading} />
        </Card>
      </div>
    </div>
  );
}
