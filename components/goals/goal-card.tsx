"use client";

import { useState } from "react";
import { Trash2, Check, Pause, Play, CheckCheck, Plus } from "lucide-react";
import { clampPercent, daysUntil, formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import type { Goal } from "@/types";
import { cn } from "@/lib/utils";

type Currency = "NGN" | "USD" | "GBP" | "EUR";

interface GoalCardProps {
  goal: Goal;
  currency?: Currency;
  onDelete: (id: string) => void;
  onUpdate?: (id: string, currentAmount: number) => Promise<void>;
  onComplete?: (id: string) => void;
  onPause?: (id: string) => void;
  onResume?: (id: string) => void;
}

export function GoalCard({
  goal,
  currency = "NGN",
  onDelete,
  onUpdate,
  onComplete,
  onPause,
  onResume,
}: GoalCardProps) {
  const pct = clampPercent((goal.currentAmount / goal.targetAmount) * 100);
  const remaining = goal.targetAmount - goal.currentAmount;
  const days = daysUntil(goal.deadline);
  const completed = goal.status === "completed" || pct >= 100;

  const [contributeOpen, setContributeOpen] = useState(false);
  const [contribution, setContribution] = useState("");
  const [contributing, setContributing] = useState(false);
  const [contributeError, setContributeError] = useState<string | null>(null);

  const handleContribute = async () => {
    const amount = parseFloat(contribution);
    if (!amount || amount <= 0) {
      setContributeError("Enter a valid amount greater than 0");
      return;
    }
    if (!onUpdate) return;
    setContributeError(null);
    setContributing(true);
    try {
      const newAmount = Math.min(goal.currentAmount + amount, goal.targetAmount);
      await onUpdate(goal.id, newAmount);
      setContributeOpen(false);
      setContribution("");
    } catch {
      setContributeError("Failed to update goal. Please try again.");
    } finally {
      setContributing(false);
    }
  };

  const fmt = (n: number) => formatCurrency(n, currency);

  return (
    <>
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
                    : days === 0
                    ? "Due today"
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
              <span className="font-bold text-white">{fmt(goal.currentAmount)}</span>
            </span>
            <span>
              Target:{" "}
              <span className="font-bold text-white">{fmt(goal.targetAmount)}</span>
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          {!completed && remaining > 0 ? (
            <div className="rounded-lg bg-white/4 px-3 py-1.5">
              <p className="text-xs text-zinc-500">
                Still needed:{" "}
                <span className="font-bold text-white">{fmt(remaining)}</span>
              </p>
            </div>
          ) : (
            <div />
          )}
          <div className="flex items-center gap-1">
            {!completed && onUpdate && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setContribution("");
                  setContributeError(null);
                  setContributeOpen(true);
                }}
                className="text-zinc-600 hover:text-brand-400 h-7 w-7"
                title="Add contribution"
              >
                <Plus className="h-3.5 w-3.5" />
              </Button>
            )}
            {!completed && goal.status === "active" && onComplete && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onComplete(goal.id)}
                className="text-zinc-600 hover:text-emerald-400 h-7 w-7"
                title="Mark complete"
              >
                <CheckCheck className="h-3.5 w-3.5" />
              </Button>
            )}
            {goal.status === "active" && onPause && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onPause(goal.id)}
                className="text-zinc-600 hover:text-amber-400 h-7 w-7"
                title="Pause goal"
              >
                <Pause className="h-3.5 w-3.5" />
              </Button>
            )}
            {goal.status === "paused" && onResume && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onResume(goal.id)}
                className="text-zinc-600 hover:text-indigo-400 h-7 w-7"
                title="Resume goal"
              >
                <Play className="h-3.5 w-3.5" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(goal.id)}
              className="text-zinc-600 hover:text-red-400 h-7 w-7"
              title="Delete goal"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Contribute modal */}
      <Modal
        open={contributeOpen}
        onClose={() => !contributing && setContributeOpen(false)}
        title="Add Contribution"
        subtitle={`Adding progress to "${goal.name}"`}
        size="sm"
      >
        <div className="space-y-4">
          <div className="rounded-xl bg-white/4 p-4 space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Current progress</span>
              <span className="font-bold text-white">{fmt(goal.currentAmount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Target</span>
              <span className="font-bold text-white">{fmt(goal.targetAmount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Still needed</span>
              <span className="font-bold text-white">{fmt(remaining)}</span>
            </div>
          </div>

          <Input
            label="Amount to add"
            type="number"
            min={0.01}
            step="any"
            placeholder="0"
            value={contribution}
            onChange={(e) => {
              setContribution(e.target.value);
              setContributeError(null);
            }}
            error={contributeError ?? undefined}
            autoFocus
          />

          {contribution && parseFloat(contribution) > remaining && remaining > 0 && (
            <p className="text-xs text-amber-400">
              This will complete the goal (capped at remaining {fmt(remaining)})
            </p>
          )}

          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setContributeOpen(false)}
              disabled={contributing}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              loading={contributing}
              onClick={handleContribute}
            >
              Add {contribution && parseFloat(contribution) > 0 ? fmt(Math.min(parseFloat(contribution), remaining > 0 ? remaining : Infinity)) : ""}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
