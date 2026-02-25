"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { formatCompact } from "@/lib/utils";
import type { AllocationDataPoint } from "@/types";

interface AllocationChartProps {
  data: AllocationDataPoint[];
  totalNetWorth: number;
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 shadow-xl">
      <p className="text-xs font-semibold text-zinc-400 mb-0.5">
        {payload[0].name}
      </p>
      <p className="text-sm font-bold" style={{ color: payload[0].payload.color }}>
        {formatCompact(payload[0].value)}
      </p>
    </div>
  );
}

export function AllocationChart({ data, totalNetWorth }: AllocationChartProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <ResponsiveContainer width={160} height={160}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={72}
              dataKey="value"
              paddingAngle={3}
              startAngle={90}
              endAngle={450}
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} strokeWidth={0} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        {/* Center label */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-xs text-zinc-500">Total</p>
          <p className="text-sm font-bold text-white">
            {formatCompact(totalNetWorth)}
          </p>
        </div>
      </div>

      {/* Legend */}
      <div className="w-full space-y-2">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="h-2.5 w-2.5 rounded-sm"
                style={{ background: item.color }}
              />
              <span className="text-xs text-zinc-400">{item.name}</span>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-white">
                {((item.value / totalNetWorth) * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
