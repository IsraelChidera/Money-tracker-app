"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Target, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useGoals } from "@/hooks/useGoals";
import { goalSchema, type GoalFormData } from "@/lib/validations";
import { GOAL_PRESET_COLORS } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { StatCard } from "@/components/ui/stat-card";
import { EmptyState } from "@/components/ui/empty-state";
import { GoalCard } from "@/components/goals/goal-card";
import { cn } from "@/lib/utils";

type Currency = "NGN" | "USD" | "GBP" | "EUR";

const CURRENCY_SYMBOL: Record<Currency, string> = {
  NGN: "₦", USD: "$", GBP: "£", EUR: "€",
};

function PageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="h-7 w-24 rounded-xl bg-white/5" />
          <div className="h-4 w-48 rounded bg-white/5" />
        </div>
        <div className="h-9 w-28 rounded-xl bg-white/5" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-32 rounded-2xl bg-white/5" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-52 rounded-2xl bg-white/5" />
        ))}
      </div>
    </div>
  );
}

export default function GoalsPage() {
  const { profile } = useAuth();
  const { goals, activeGoals, loading, error, add, update, remove, complete, pause, resume } =
    useGoals();
  const currency = (profile?.currency ?? "NGN") as Currency;
  const symbol = CURRENCY_SYMBOL[currency];

  const completedGoals = goals.filter(
    (g) => g.currentAmount >= g.targetAmount || g.status === "completed"
  );
  const pausedGoals = goals.filter((g) => g.status === "paused");

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(GOAL_PRESET_COLORS[0]);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<GoalFormData>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      name: "",
      description: "",
      targetAmount: 0,
      currentAmount: 0,
      deadline: "",
      color: GOAL_PRESET_COLORS[0],
    },
  });

  const openModal = () => {
    setSubmitError(null);
    reset({
      name: "",
      description: "",
      targetAmount: 0,
      currentAmount: 0,
      deadline: "",
      color: GOAL_PRESET_COLORS[0],
    });
    setSelectedColor(GOAL_PRESET_COLORS[0]);
    setModalOpen(true);
  };

  const onSubmit = async (data: GoalFormData) => {
    setSubmitError(null);
    try {
      const { createdAt: _createdAt, ...rest } = data;
      await add(rest);
      setModalOpen(false);
    } catch {
      setSubmitError("Failed to create goal. Please try again.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await remove(id);
    } catch {
      // swallowed
    }
  };

  const handleContribute = async (id: string, newAmount: number) => {
    await update(id, { currentAmount: newAmount });
  };

  if (loading) return <PageSkeleton />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white">Goals</h1>
          <p className="mt-0.5 text-sm text-zinc-500">Track your financial milestones</p>
        </div>
        <Button onClick={openModal}>
          <Plus className="h-4 w-4" />
          New Goal
        </Button>
      </div>

      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Total Goals" value={String(goals.length)} icon={Target} accentColor="#6366f1" />
        <StatCard label="Active" value={String(activeGoals.length)} icon={Clock} accentColor="#f59e0b" />
        <StatCard label="Completed" value={String(completedGoals.length)} icon={CheckCircle} accentColor="#10b981" />
      </div>

      {/* Goals grid */}
      {goals.length === 0 ? (
        <div className="rounded-2xl border border-white/8 bg-zinc-900/80">
          <EmptyState
            icon={Target}
            title="No goals yet"
            description="Set a financial goal and start working toward it."
            action={{ label: "Create Goal", onClick: openModal }}
          />
        </div>
      ) : (
        <>
          {activeGoals.length > 0 && (
            <div>
              <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-zinc-500">
                Active Goals
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {activeGoals.map((goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    currency={currency}
                    onDelete={handleDelete}
                    onUpdate={handleContribute}
                    onComplete={(id) => complete(id, goal.targetAmount)}
                    onPause={pause}
                    onResume={resume}
                  />
                ))}
              </div>
            </div>
          )}

          {pausedGoals.length > 0 && (
            <div>
              <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-zinc-500">
                Paused Goals
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {pausedGoals.map((goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    currency={currency}
                    onDelete={handleDelete}
                    onUpdate={handleContribute}
                    onResume={resume}
                  />
                ))}
              </div>
            </div>
          )}

          {completedGoals.length > 0 && (
            <div>
              <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-zinc-500">
                Completed Goals 🎉
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {completedGoals.map((goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    currency={currency}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Create Goal Modal */}
      <Modal
        open={modalOpen}
        onClose={() => !isSubmitting && setModalOpen(false)}
        title="Create a New Goal"
        subtitle="Set a target and track your progress"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Goal Name"
            placeholder="e.g. Emergency Fund"
            error={errors.name?.message}
            {...register("name")}
          />
          <Input
            label="Description (optional)"
            placeholder="Why this goal matters to you..."
            {...register("description")}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label={`Target Amount (${symbol})`}
              type="number"
              min={0}
              placeholder="10000"
              error={errors.targetAmount?.message}
              {...register("targetAmount", { valueAsNumber: true })}
            />
            <Input
              label={`Starting Amount (${symbol})`}
              type="number"
              min={0}
              placeholder="0"
              error={errors.currentAmount?.message}
              {...register("currentAmount", { valueAsNumber: true })}
            />
          </div>
          <Input
            label="Deadline"
            type="date"
            error={errors.deadline?.message}
            {...register("deadline")}
          />

          {/* Color picker */}
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-zinc-400">
              Color
            </label>
            <div className="flex gap-2.5">
              {GOAL_PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => {
                    setSelectedColor(color);
                    setValue("color", color);
                  }}
                  className={cn(
                    "h-7 w-7 rounded-lg transition-all",
                    selectedColor === color
                      ? "ring-2 ring-white ring-offset-2 ring-offset-zinc-900 scale-110"
                      : "opacity-70 hover:opacity-100"
                  )}
                  style={{ background: color }}
                />
              ))}
            </div>
          </div>

          {submitError && (
            <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {submitError}
            </p>
          )}

          <div className="flex gap-3 justify-end pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              Create Goal
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
