"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, Cell,
} from "recharts";
import { BarChart3 } from "lucide-react";
import { formatCompact } from "@/lib/utils";
import type { ContributionDataPoint } from "@/types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ContributionsChartProps {
  data: ContributionDataPoint[];
  currency?: "NGN" | "USD" | "GBP" | "EUR";
  height?: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const CURRENCY_SYMBOL: Record<string, string> = {
  NGN: "₦", USD: "$", GBP: "£", EUR: "€",
};

// ─── Tooltip ──────────────────────────────────────────────────────────────────

function CustomTooltip({
  active, payload, label, symbol,
}: {
  active?: boolean;
  payload?: { name: string; value: number; fill: string }[];
  label?: string;
  symbol: string;
}) {
  if (!active || !payload?.length) return null;

  const total = payload.reduce((sum, p) => sum + (p.value ?? 0), 0);

  return (
    <div className="rounded-xl border border-white/10 bg-zinc-900 px-3.5 py-3 shadow-xl space-y-1.5">
      <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
        {label}
      </p>
      {payload.map((p) =>
        p.value > 0 ? (
          <div key={p.name} className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-1.5">
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ background: p.fill }}
              />
              <span className="text-xs text-zinc-400">{p.name}</span>
            </div>
            <span className="text-xs font-bold" style={{ color: p.fill }}>
              {symbol}{formatCompact(p.value).replace(/[₦$£€]/, "")}
            </span>
          </div>
        ) : null
      )}
      {total > 0 && (
        <div className="mt-2 border-t border-white/10 pt-1.5 flex items-center justify-between">
          <span className="text-xs text-zinc-600">Total</span>
          <span className="text-xs font-bold text-white">
            {symbol}{formatCompact(total).replace(/[₦$£€]/, "")}
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyChart({ height }: { height: number }) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3"
      style={{ height }}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-brand-500/20 bg-brand-500/10">
        <BarChart3 className="h-5 w-5 text-brand-400" />
      </div>
      <p className="text-sm text-zinc-500">
        Add savings or investments to see monthly contributions
      </p>
    </div>
  );
}

// ─── Chart ────────────────────────────────────────────────────────────────────

export function ContributionsChart({
  data,
  currency = "NGN",
  height = 220,
}: ContributionsChartProps) {
  const symbol = CURRENCY_SYMBOL[currency] ?? "₦";

  // Only render chart when there's at least one non-zero month
  const hasData = data.some((d) => d.savings > 0 || d.investments > 0);
  if (!hasData) return <EmptyChart height={height} />;

  // Filter out months with no data so the chart isn't padded with empty bars
  const chartData = data.filter((d) => d.savings > 0 || d.investments > 0);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={chartData}
        barGap={4}
        barCategoryGap="30%"
        margin={{ top: 4, right: 5, left: -10, bottom: 0 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(255,255,255,0.04)"
          vertical={false}
        />

        <XAxis
          dataKey="month"
          tick={{ fill: "#52525b", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />

        <YAxis
          tick={{ fill: "#52525b", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) =>
            v >= 1_000_000
              ? `${symbol}${(v / 1_000_000).toFixed(1)}M`
              : `${symbol}${(v / 1_000).toFixed(0)}k`
          }
        />

        <Tooltip
          content={<CustomTooltip symbol={symbol} />}
          cursor={{ fill: "rgba(255,255,255,0.03)" }}
        />

        <Legend
          wrapperStyle={{ fontSize: "11px", color: "#71717a", paddingTop: "12px" }}
          iconType="circle"
          iconSize={8}
        />

        <Bar dataKey="savings" name="Savings" fill="#10b981" radius={[4, 4, 0, 0]}>
          {chartData.map((_, i) => (
            <Cell key={i} fill="#10b981" fillOpacity={0.9} />
          ))}
        </Bar>

        <Bar dataKey="investments" name="Investments" fill="#6366f1" radius={[4, 4, 0, 0]}>
          {chartData.map((_, i) => (
            <Cell key={i} fill="#6366f1" fillOpacity={0.9} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
