"use client";

import { Download, TrendingUp, TrendingDown, PiggyBank } from "lucide-react";
import { useAppStore, selectTotalSavings, selectTotalInvestments } from "@/store/app-store";
import { MONTHLY_REPORTS } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { YearlyOverviewChart } from "@/components/charts/yearly-overview-chart";

export default function ReportsPage() {
  const totalSavings = useAppStore(selectTotalSavings);
  const totalInvestments = useAppStore(selectTotalInvestments);

  const totalIncome = MONTHLY_REPORTS.reduce((s, r) => s + r.income, 0);
  const totalExpenses = MONTHLY_REPORTS.reduce((s, r) => s + r.expenses, 0);
  const totalSavedReported = MONTHLY_REPORTS.reduce((s, r) => s + r.savings, 0);
  const avgSavingsRate = (totalSavedReported / totalIncome) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white">Reports</h1>
          <p className="mt-0.5 text-sm text-zinc-500">Financial performance overview for 2025</p>
        </div>
        <Button variant="secondary">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Income" value={formatCurrency(totalIncome)} change={8.3} icon={TrendingUp} accentColor="#10b981" />
        <StatCard label="Total Expenses" value={formatCurrency(totalExpenses)} change={-2.1} icon={TrendingDown} accentColor="#ef4444" />
        <StatCard label="Net Savings" value={formatCurrency(totalSavedReported)} change={12.4} icon={PiggyBank} accentColor="#6366f1" />
        <StatCard
          label="Avg. Savings Rate"
          value={`${avgSavingsRate.toFixed(1)}%`}
          icon={TrendingUp}
          accentColor="#f59e0b"
          subtext="Of total income saved"
        />
      </div>

      {/* Yearly chart */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Yearly Financial Overview</CardTitle>
            <p className="mt-0.5 text-xs text-zinc-500">Income, Expenses & Savings by month</p>
          </div>
          <Badge variant="default">2025</Badge>
        </CardHeader>
        <YearlyOverviewChart data={MONTHLY_REPORTS} />
      </Card>

      {/* Monthly breakdown table */}
      <div className="overflow-hidden rounded-2xl border border-white/8 bg-zinc-900/80">
        <div className="border-b border-white/5 px-5 py-4">
          <h3 className="font-bold text-white">Monthly Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {["Month", "Income", "Expenses", "Savings", "Investments", "Savings Rate"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-bold uppercase tracking-widest text-zinc-600">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {MONTHLY_REPORTS.map((row, i) => {
                const rate = ((row.savings / row.income) * 100).toFixed(1);
                const rateNum = parseFloat(rate);
                return (
                  <tr key={i} className="transition-colors hover:bg-white/3">
                    <td className="px-5 py-3.5 font-semibold text-white">{row.month}</td>
                    <td className="px-5 py-3.5 text-sm font-bold text-emerald-400">
                      {formatCurrency(row.income)}
                    </td>
                    <td className="px-5 py-3.5 text-sm font-bold text-red-400">
                      {formatCurrency(row.expenses)}
                    </td>
                    <td className="px-5 py-3.5 text-sm font-bold text-white">
                      {formatCurrency(row.savings)}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-zinc-400">
                      {formatCurrency(row.investments)}
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge
                        variant={rateNum >= 30 ? "success" : rateNum >= 20 ? "default" : "warning"}
                      >
                        {rate}%
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
