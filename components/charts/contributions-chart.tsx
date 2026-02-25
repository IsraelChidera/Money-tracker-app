"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { formatCompact } from "@/lib/utils";
import type { ContributionDataPoint } from "@/types";

interface ContributionsChartProps {
  data: ContributionDataPoint[];
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/10 bg-zinc-900 px-3 py-2.5 shadow-xl space-y-1">
      <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
        {label}
      </p>
      {payload.map((p: any) => (
        <p key={p.name} className="text-xs font-bold" style={{ color: p.fill }}>
          {p.name}: {formatCompact(p.value)}
        </p>
      ))}
    </div>
  );
}

export function ContributionsChart({ data }: ContributionsChartProps) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} barGap={4} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
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
          tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: "11px", color: "#71717a", paddingTop: "8px" }}
          iconType="circle"
          iconSize={8}
        />
        <Bar dataKey="savings" name="Savings" fill="#10b981" radius={[4, 4, 0, 0]} />
        <Bar dataKey="investments" name="Investments" fill="#6366f1" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
