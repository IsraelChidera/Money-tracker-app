"use client";

import { Trash2, Check } from "lucide-react";
import { clampPercent, daysUntil, formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Goal } from "@/types";
import { cn } from "@/lib/utils";

interface GoalCardProps {
  goal: Goal;
  onDelete: (id: string) => void;
}

export function GoalCard({ goal, onDelete }: GoalCardProps) {
  const pct = clampPercent((goal.currentAmount / goal.targetAmount) * 100);
  const remaining = goal.targetAmount - goal.currentAmount;
  const days = daysUntil(goal.deadline);
  const completed = pct >= 100;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/80 p-5">
      {/* Color bar at top */}
      <div
        className="absolute inset-x-0 top-0 h-0.5"
        style={{ background: goal.color }}
      />

      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0 pr-3">
          <h3 className="font-bold text-white text-sm truncate">{goal.name}</h3>
          {goal.description && (
            <p className="text-xs text-zinc-500 mt-0.5 line-clamp-1">
              {goal.description}
            </p>
          )}
          <div className="mt-1.5">
            {completed ? (
              <Badge variant="success">
                <Check className="h-3 w-3" /> Completed!
              </Badge>
            ) : (
              <span
                className={cn(
                  "text-xs font-semibold",
                  days < 0
                    ? "text-red-400"
                    : days < 30
                    ? "text-amber-400"
                    : "text-zinc-500"
                )}
              >
                {days < 0
                  ? `${Math.abs(days)} days overdue`
                  : `${days} days left`}
              </span>
            )}
          </div>
        </div>

        {/* Circular progress */}
        <div className="relative shrink-0">
          <svg className="h-12 w-12 -rotate-90" viewBox="0 0 36 36">
            <circle
              cx="18"
              cy="18"
              r="15"
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="3"
            />
            <circle
              cx="18"
              cy="18"
              r="15"
              fill="none"
              stroke={goal.color}
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={`${(pct / 100) * 94.2} 94.2`}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="text-[10px] font-extrabold"
              style={{ color: goal.color }}
            >
              {pct.toFixed(0)}%
            </span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/8">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${pct}%`,
              background: goal.color,
              boxShadow: `0 0 8px ${goal.color}60`,
            }}
          />
        </div>
        <div className="mt-2 flex justify-between text-xs text-zinc-500">
          <span>
            Saved:{" "}
            <span className="font-bold text-white">
              {formatCurrency(goal.currentAmount)}
            </span>
          </span>
          <span>
            Target:{" "}
            <span className="font-bold text-white">
              {formatCurrency(goal.targetAmount)}
            </span>
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        {!completed && (
          <div className="rounded-lg bg-white/4 px-3 py-1.5">
            <p className="text-xs text-zinc-500">
              Still needed:{" "}
              <span className="font-bold text-white">
                {formatCurrency(remaining)}
              </span>
            </p>
          </div>
        )}
        {completed && <div />}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(goal.id)}
          className="text-zinc-600 hover:text-red-400 h-7 w-7"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
