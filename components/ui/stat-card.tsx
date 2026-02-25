import { ArrowUpRight, ArrowDownRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  change?: number;
  subtext?: string;
  icon: LucideIcon;
  accentColor?: string;
  className?: string;
}

export function StatCard({
  label,
  value,
  change,
  subtext,
  icon: Icon,
  accentColor = "#6366f1",
  className,
}: StatCardProps) {
  const positive = change !== undefined && change >= 0;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/80 p-5",
        className
      )}
    >
      {/* Top accent */}
      <div
        className="absolute inset-x-0 top-0 h-0.5"
        style={{ background: `linear-gradient(90deg, ${accentColor}, transparent)` }}
      />

      <div className="flex items-start justify-between mb-4">
        <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
          {label}
        </span>
        <div
          className="flex h-9 w-9 items-center justify-center rounded-xl"
          style={{ background: `${accentColor}18` }}
        >
          <Icon className="h-4 w-4" style={{ color: accentColor }} />
        </div>
      </div>

      <div className="text-2xl font-extrabold tracking-tight text-white leading-none">
        {value}
      </div>

      {subtext && !change && (
        <p className="mt-1.5 text-xs text-zinc-500">{subtext}</p>
      )}

      {change !== undefined && (
        <div className="mt-2 flex items-center gap-1.5">
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-bold",
              positive
                ? "bg-emerald-500/15 text-emerald-400"
                : "bg-red-500/15 text-red-400"
            )}
          >
            {positive ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            {Math.abs(change).toFixed(1)}%
          </span>
          <span className="text-xs text-zinc-600">vs last month</span>
        </div>
      )}
    </div>
  );
}
