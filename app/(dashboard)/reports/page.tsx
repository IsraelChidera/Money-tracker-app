"use client";

import { useMemo, useState } from "react";
import {
  Download, TrendingUp, PiggyBank,
  Wallet, ChevronDown, BarChart3,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useSavings } from "@/hooks/useSavings";
import { useInvestments } from "@/hooks/useInvestments";
import { formatCurrency, formatCompact } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardHeader, CardTitle, CardSubtitle } from "@/components/ui/card";
import { ContributionsChart } from "@/components/charts/contributions-chart";
import { AllocationChart } from "@/components/charts/allocation-chart";

// ─── Constants ────────────────────────────────────────────────────────────────

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const CATEGORY_COLORS: Record<string, string> = {
  "Emergency Fund": "#10b981",
  "Travel":         "#6366f1",
  "House":          "#f59e0b",
  "Car":            "#ec4899",
  "Education":      "#06b6d4",
  "Business":       "#8b5cf6",
  "Retirement":     "#f97316",
  "General":        "#14b8a6",
};

const ASSET_COLORS: Record<string, string> = {
  "Stocks":        "#6366f1",
  "ETF":           "#10b981",
  "Bonds":         "#f59e0b",
  "Real Estate":   "#ec4899",
  "Crypto":        "#f97316",
  "Fixed Income":  "#06b6d4",
  "Mutual Fund":   "#8b5cf6",
  "Other":         "#71717a",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-56 rounded-xl bg-white/5" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 rounded-2xl bg-white/5" />
        ))}
      </div>
      <div className="h-72 rounded-2xl bg-white/5" />
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="h-64 rounded-2xl bg-white/5" />
        <div className="h-64 rounded-2xl bg-white/5" />
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-500/10 border border-brand-500/20">
        <BarChart3 className="h-7 w-7 text-brand-400" />
      </div>
      <h3 className="text-base font-bold text-white mb-2">No data yet</h3>
      <p className="text-sm text-zinc-500 max-w-xs">
        Add savings or investments to start seeing your reports here.
      </p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ReportsPage() {
  const { profile } = useAuth();
  const { savings, loading: savingsLoading } = useSavings();
  const { investments, loading: investmentsLoading } = useInvestments();

  const loading = savingsLoading || investmentsLoading;
  const hasData = savings.length > 0 || investments.length > 0;
  const currency = (profile?.currency ?? "NGN") as "NGN" | "USD" | "GBP" | "EUR";
  const fmt = (n: number) => formatCurrency(n, currency);

  // ── Year selector ──────────────────────────────────────────────────────────
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const availableYears = useMemo(() => {
    const years = new Set<number>([currentYear]);
    savings.forEach((s) => years.add(new Date(s.date).getFullYear()));
    investments.forEach((i) => years.add(new Date(i.date).getFullYear()));
    return Array.from(years).sort((a, b) => b - a);
  }, [savings, investments, currentYear]);

  // ── Year-filtered data ─────────────────────────────────────────────────────
  const yearlySavings = useMemo(
    () => savings.filter((s) => new Date(s.date).getFullYear() === selectedYear),
    [savings, selectedYear]
  );
  const yearlyInvestments = useMemo(
    () => investments.filter((i) => new Date(i.date).getFullYear() === selectedYear),
    [investments, selectedYear]
  );

  // ── All-time totals ────────────────────────────────────────────────────────
  const totalSavings   = useMemo(() => savings.reduce((s, e) => s + e.amount, 0), [savings]);
  const totalInvested  = useMemo(() => investments.reduce((s, i) => s + i.currentValue, 0), [investments]);
  const netWorth       = totalSavings + totalInvested;

  // ── Yearly totals ──────────────────────────────────────────────────────────
  const yearlyTotalSavings    = useMemo(() => yearlySavings.reduce((s, e) => s + e.amount, 0), [yearlySavings]);
  const yearlyTotalInvested   = useMemo(() => yearlyInvestments.reduce((s, i) => s + i.currentValue, 0), [yearlyInvestments]);

  // ── Monthly breakdown (chart + table) ─────────────────────────────────────
  const monthlyData = useMemo(() =>
    MONTHS.map((month, idx) => ({
      month,
      savings: yearlySavings
        .filter((s) => new Date(s.date).getMonth() === idx)
        .reduce((sum, s) => sum + s.amount, 0),
      investments: yearlyInvestments
        .filter((i) => new Date(i.date).getMonth() === idx)
        .reduce((sum, i) => sum + i.currentValue, 0),
    })),
    [yearlySavings, yearlyInvestments]
  );

  const activeMonths = useMemo(
    () => monthlyData.filter((m) => m.savings > 0 || m.investments > 0),
    [monthlyData]
  );

  // ── Best month (highest savings) ───────────────────────────────────────────
  const bestMonth = useMemo(() =>
    monthlyData.reduce(
      (best, m) => (m.savings > best.savings ? m : best),
      { month: "–", savings: 0, investments: 0 }
    ),
    [monthlyData]
  );

  // ── Category breakdown (all-time) ─────────────────────────────────────────
  const categoryData = useMemo(() => {
    const map = new Map<string, number>();
    savings.forEach((s) => map.set(s.category, (map.get(s.category) ?? 0) + s.amount));
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value, color: CATEGORY_COLORS[name] ?? "#71717a" }))
      .sort((a, b) => b.value - a.value);
  }, [savings]);

  // ── Investment by asset class (all-time) ───────────────────────────────────
  const assetClassData = useMemo(() => {
    const map = new Map<string, number>();
    investments.forEach((i) => map.set(i.assetClass, (map.get(i.assetClass) ?? 0) + i.currentValue));
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value, color: ASSET_COLORS[name] ?? "#71717a" }))
      .sort((a, b) => b.value - a.value);
  }, [investments]);

  // ── Top platforms (all-time, savings + investments combined) ──────────────
  const platformData = useMemo(() => {
    const map = new Map<string, number>();
    savings.forEach((s) => map.set(s.platform, (map.get(s.platform) ?? 0) + s.amount));
    investments.forEach((i) => map.set(i.platform, (map.get(i.platform) ?? 0) + i.currentValue));
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [savings, investments]);

  // ── CSV export ─────────────────────────────────────────────────────────────
  const exportCSV = () => {
    const header = ["Date", "Type", "Platform", "Category / Asset", "Amount / Value", "Notes"];
    const savingsRows = savings.map((s) => [
      s.date, "Savings", s.platform, s.category, String(s.amount), s.notes ?? "",
    ]);
    const investRows = investments.map((i) => [
      i.date, "Investment", i.platform,
      `${i.assetName} (${i.assetClass})`,
      String(i.currentValue), i.notes ?? "",
    ]);
    const rows = [...savingsRows, ...investRows].sort((a, b) => a[0].localeCompare(b[0]));
    const csv = [header, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `mymoney-report-${selectedYear}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  if (loading) return <Skeleton />;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white">Reports</h1>
          <p className="mt-0.5 text-sm text-zinc-500">
            {hasData
              ? `${savings.length + investments.length} total records across all time`
              : "No financial data recorded yet"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Year selector */}
          <div className="relative">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="h-9 appearance-none rounded-xl border border-white/10 bg-zinc-900 pl-3 pr-8 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            >
              {availableYears.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={exportCSV}
            disabled={!hasData}
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Empty state */}
      {!hasData && <EmptyState />}

      {hasData && (
        <>
          {/* Summary stats */}
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 xl:grid-cols-4">
            <StatCard
              label="Total Savings"
              value={fmt(totalSavings)}
              icon={PiggyBank}
              accentColor="#10b981"
              subtext={`${savings.length} entr${savings.length === 1 ? "y" : "ies"}`}
            />
            <StatCard
              label="Total Invested"
              value={fmt(totalInvested)}
              icon={TrendingUp}
              accentColor="#6366f1"
              subtext={`${investments.length} position${investments.length === 1 ? "" : "s"}`}
            />
            <StatCard
              label="Net Worth"
              value={fmt(netWorth)}
              icon={Wallet}
              accentColor="#f59e0b"
              subtext="Savings + Investments"
            />
            <StatCard
              label={`Best Month (${selectedYear})`}
              value={bestMonth.savings > 0 ? bestMonth.month : "—"}
              icon={TrendingUp}
              accentColor="#ec4899"
              subtext={
                bestMonth.savings > 0
                  ? `${fmt(bestMonth.savings)} saved`
                  : `No data for ${selectedYear}`
              }
            />
          </div>

          {/* Monthly contributions chart */}
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Monthly Contributions</CardTitle>
                <CardSubtitle>Savings & investments added per month</CardSubtitle>
              </div>
              <Badge variant="default">{selectedYear}</Badge>
            </CardHeader>
            {activeMonths.length > 0 ? (
              <ContributionsChart data={monthlyData} currency={currency} height={260} />
            ) : (
              <p className="py-10 text-center text-sm text-zinc-600">
                No activity in {selectedYear} — try a different year
              </p>
            )}
          </Card>

          {/* Category + Asset class allocation */}
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <div>
                  <CardTitle>Savings by Category</CardTitle>
                  <CardSubtitle>All-time distribution</CardSubtitle>
                </div>
              </CardHeader>
              {categoryData.length > 0 ? (
                <AllocationChart data={categoryData} totalNetWorth={totalSavings} />
              ) : (
                <p className="py-8 text-center text-sm text-zinc-600">No savings recorded</p>
              )}
            </Card>

            <Card>
              <CardHeader>
                <div>
                  <CardTitle>Investments by Asset Class</CardTitle>
                  <CardSubtitle>Current portfolio allocation</CardSubtitle>
                </div>
              </CardHeader>
              {assetClassData.length > 0 ? (
                <AllocationChart data={assetClassData} totalNetWorth={totalInvested} />
              ) : (
                <p className="py-8 text-center text-sm text-zinc-600">No investments recorded</p>
              )}
            </Card>
          </div>

          {/* Top platforms */}
          {platformData.length > 0 && (
            <Card>
              <CardHeader>
                <div>
                  <CardTitle>Top Platforms</CardTitle>
                  <CardSubtitle>Combined savings + investment value</CardSubtitle>
                </div>
                <Badge variant="outline">{platformData.length} platforms</Badge>
              </CardHeader>
              <div className="space-y-4">
                {platformData.map((p, i) => {
                  const pct = netWorth > 0 ? (p.value / netWorth) * 100 : 0;
                  return (
                    <div key={p.name}>
                      <div className="mb-1.5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-zinc-600">#{i + 1}</span>
                          <span className="text-sm font-semibold text-white">{p.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-zinc-500">{pct.toFixed(1)}%</span>
                          <span className="text-sm font-bold text-white">{fmt(p.value)}</span>
                        </div>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                        <div
                          className="h-1.5 rounded-full bg-gradient-to-r from-brand-500 to-violet-500 transition-all duration-500"
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* Monthly breakdown table */}
          <div className="overflow-hidden rounded-2xl border border-white/8 bg-zinc-900/80">
            <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
              <h3 className="font-bold text-white">
                Monthly Breakdown — {selectedYear}
              </h3>
              <span className="text-xs text-zinc-600">
                {activeMonths.length} active month{activeMonths.length !== 1 ? "s" : ""}
              </span>
            </div>

            {activeMonths.length === 0 ? (
              <p className="py-12 text-center text-sm text-zinc-600">
                No transactions in {selectedYear} — select a different year above
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      {["Month", "Savings Added", "Invested", "Total Added", "Savings %"].map((h) => (
                        <th
                          key={h}
                          className="px-5 py-3 text-left text-xs font-bold uppercase tracking-widest text-zinc-600"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-white/5">
                    {monthlyData.map((row) => {
                      const total = row.savings + row.investments;
                      if (total === 0) return null;
                      const savingsPct = total > 0 ? (row.savings / total) * 100 : 0;
                      return (
                        <tr key={row.month} className="transition-colors hover:bg-white/3">
                          <td className="px-5 py-3.5 font-semibold text-white">
                            {row.month}
                          </td>
                          <td className="px-5 py-3.5 text-sm font-bold text-emerald-400">
                            {row.savings > 0 ? fmt(row.savings) : <span className="text-zinc-700">—</span>}
                          </td>
                          <td className="px-5 py-3.5 text-sm font-bold text-brand-400">
                            {row.investments > 0 ? fmt(row.investments) : <span className="text-zinc-700">—</span>}
                          </td>
                          <td className="px-5 py-3.5 text-sm font-bold text-white">
                            {fmt(total)}
                          </td>
                          <td className="px-5 py-3.5">
                            {row.savings > 0 && (
                              <Badge
                                variant={
                                  savingsPct >= 60 ? "success"
                                  : savingsPct >= 40 ? "default"
                                  : "warning"
                                }
                              >
                                {savingsPct.toFixed(1)}%
                              </Badge>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>

                  {/* Totals footer */}
                  <tfoot>
                    <tr className="border-t border-white/10 bg-white/3">
                      <td className="px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-zinc-500">
                        Year Total
                      </td>
                      <td className="px-5 py-3.5 text-sm font-bold text-emerald-400">
                        {fmt(yearlyTotalSavings)}
                      </td>
                      <td className="px-5 py-3.5 text-sm font-bold text-brand-400">
                        {fmt(yearlyTotalInvested)}
                      </td>
                      <td className="px-5 py-3.5 text-sm font-bold text-white">
                        {fmt(yearlyTotalSavings + yearlyTotalInvested)}
                      </td>
                      <td className="px-5 py-3.5">
                        {yearlyTotalSavings + yearlyTotalInvested > 0 && (
                          <span className="text-xs text-zinc-500">
                            {(
                              (yearlyTotalSavings /
                                (yearlyTotalSavings + yearlyTotalInvested)) *
                              100
                            ).toFixed(1)}
                            % saved
                          </span>
                        )}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
