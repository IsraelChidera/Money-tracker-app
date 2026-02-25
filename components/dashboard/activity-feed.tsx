import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { ActivityItem } from "@/types";
import { cn } from "@/lib/utils";

interface ActivityFeedProps {
  items: ActivityItem[];
}

export function ActivityFeed({ items }: ActivityFeedProps) {
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
