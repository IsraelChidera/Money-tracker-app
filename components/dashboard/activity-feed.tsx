import { ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { ActivityItem } from "@/types";
import { cn } from "@/lib/utils";

interface ActivityFeedProps {
  items: ActivityItem[];
  loading?: boolean;
}

export function ActivityFeed({ items, loading = false }: ActivityFeedProps) {
  if (loading) {
    return (
      <div className="divide-y divide-white/5 animate-pulse">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-white/5" />
              <div className="space-y-1.5">
                <div className="h-3 w-28 rounded bg-white/5" />
                <div className="h-2.5 w-20 rounded bg-white/5" />
              </div>
            </div>
            <div className="h-3.5 w-16 rounded bg-white/5" />
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-white/8 bg-white/4">
          <Activity className="h-5 w-5 text-zinc-600" />
        </div>
        <p className="text-sm font-semibold text-zinc-500">No activity yet</p>
        <p className="mt-0.5 text-xs text-zinc-600">
          Add savings or investments to see your activity here
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-white/5">
      {items.map((item) => (
        <div key={item.id} className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                item.direction === "in"
                  ? "bg-emerald-500/15 text-emerald-400"
                  : "bg-red-500/15 text-red-400"
              )}
            >
              {item.direction === "in" ? (
                <ArrowUpRight className="h-4 w-4" />
              ) : (
                <ArrowDownRight className="h-4 w-4" />
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{item.platform}</p>
              <p className="text-xs text-zinc-500">
                {item.description} · {formatDate(item.date, "d MMM")}
              </p>
            </div>
          </div>
          <span
            className={cn(
              "text-sm font-bold",
              item.direction === "in" ? "text-emerald-400" : "text-red-400"
            )}
          >
            {item.direction === "in" ? "+" : "−"}
            {formatCurrency(item.amount)}
          </span>
        </div>
      ))}
    </div>
  );
}
