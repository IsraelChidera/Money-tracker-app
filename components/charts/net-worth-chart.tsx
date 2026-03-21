"use client";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";
import { TrendingUp } from "lucide-react";
import { formatCompact } from "@/lib/utils";
import type { NetWorthDataPoint } from "@/types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface NetWorthChartProps {
  data: NetWorthDataPoint[];
  currency?: "NGN" | "USD" | "GBP" | "EUR";
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const CURRENCY_SYMBOL: Record<string, string> = {
  NGN: "₦", USD: "$", GBP: "£", EUR: "€",
};

// ─── Tooltip ──────────────────────────────────────────────────────────────────

function CustomTooltip({
  active, payload, label, symbol, color,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
  symbol: string;
  color: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/10 bg-zinc-900 px-3.5 py-2.5 shadow-xl">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-zinc-500">
        {label}
      </p>
      <p className="text-sm font-bold" style={{ color }}>
        {symbol}{formatCompact(payload[0].value).replace(/[₦$£€]/, "")}
      </p>
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyChart() {
  return (
    <div className="flex h-[220px] flex-col items-center justify-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-brand-500/20 bg-brand-500/10">
        <TrendingUp className="h-5 w-5 text-brand-400" />
      </div>
      <p className="text-sm text-zinc-500">
        Add savings or investments to track your net worth growth
      </p>
    </div>
  );
}

// ─── Chart ────────────────────────────────────────────────────────────────────

export function NetWorthChart({ data, currency = "NGN" }: NetWorthChartProps) {
  if (data.length === 0) return <EmptyChart />;

  const symbol = CURRENCY_SYMBOL[currency] ?? "₦";

  // Determine trend — green if growing or flat, red if declining
  const isGrowing =
    data.length < 2 || data[data.length - 1].value >= data[0].value;
  const lineColor = isGrowing ? "#6366f1" : "#ef4444";

  // Growth amount shown as a reference annotation
  const growthValue =
    data.length >= 2
      ? data[data.length - 1].value - data[0].value
      : 0;
  const growthPct =
    data.length >= 2 && data[0].value > 0
      ? ((growthValue / data[0].value) * 100).toFixed(1)
      : null;

  // Y-axis domain — add 10% padding above the max value
  const maxValue  = Math.max(...data.map((d) => d.value));
  const minValue  = Math.min(...data.map((d) => d.value));
  const padding   = (maxValue - minValue) * 0.15 || maxValue * 0.1;
  const yDomainMin = Math.max(0, minValue - padding);
  const yDomainMax = maxValue + padding;

  return (
    <div className="space-y-3">
      {/* Growth badge */}
      {growthPct !== null && (
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold ${
              isGrowing
                ? "bg-emerald-500/15 text-emerald-400"
                : "bg-red-500/15 text-red-400"
            }`}
          >
            {isGrowing ? "▲" : "▼"} {Math.abs(Number(growthPct))}%
          </span>
          <span className="text-xs text-zinc-600">
            {isGrowing ? "+" : ""}
            {symbol}
            {formatCompact(Math.abs(growthValue)).replace(/[₦$£€]/, "")} over this period
          </span>
        </div>
      )}

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 8, right: 5, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="nwGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={lineColor} stopOpacity={0.22} />
              <stop offset="95%" stopColor={lineColor} stopOpacity={0.02} />
            </linearGradient>
          </defs>

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
            domain={[yDomainMin, yDomainMax]}
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
            content={
              <CustomTooltip symbol={symbol} color={lineColor} />
            }
          />

          {/* Baseline reference at first data point */}
          {data.length >= 2 && (
            <ReferenceLine
              y={data[0].value}
              stroke="rgba(255,255,255,0.06)"
              strokeDasharray="4 4"
            />
          )}

          <Area
            type="monotone"
            dataKey="value"
            stroke={lineColor}
            strokeWidth={2.5}
            fill="url(#nwGradient)"
            dot={false}
            activeDot={{
              r: 5,
              fill: lineColor,
              strokeWidth: 2,
              stroke: "#18181b",
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
