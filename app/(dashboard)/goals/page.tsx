"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Target, CheckCircle, Clock } from "lucide-react";
import { useAppStore, selectActiveGoals, selectCompletedGoals } from "@/store/app-store";
import { goalSchema, type GoalFormData } from "@/lib/validations";
import { GOAL_PRESET_COLORS } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { StatCard } from "@/components/ui/stat-card";
import { EmptyState } from "@/components/ui/empty-state";
import { GoalCard } from "@/components/goals/goal-card";
import { cn } from "@/lib/utils";

export default function GoalsPage() {
  const { goals, addGoal, deleteGoal } = useAppStore();
  const activeGoals = useAppStore(selectActiveGoals);
  const completedGoals = useAppStore(selectCompletedGoals);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(GOAL_PRESET_COLORS[0]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<GoalFormData>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      name: "", description: "",
      targetAmount: 0, currentAmount: 0,
      deadline: "", color: GOAL_PRESET_COLORS[0],
    },
  });

  const openModal = () => {
    reset({
      name: "", description: "",
      targetAmount: 0, currentAmount: 0,
      deadline: "", color: GOAL_PRESET_COLORS[0],
    });
    setSelectedColor(GOAL_PRESET_COLORS[0]);
    setModalOpen(true);
  };

  const onSubmit = async (data: GoalFormData) => {
    await new Promise((r) => setTimeout(r, 400));
    addGoal({ ...data, status: "active" });
    setModalOpen(false);
  };

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
                  <GoalCard key={goal.id} goal={goal} onDelete={deleteGoal} />
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
                  <GoalCard key={goal.id} goal={goal} onDelete={deleteGoal} />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Create a New Goal" subtitle="Set a target and track your progress">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Goal Name" placeholder="e.g. Emergency Fund" error={errors.name?.message} {...register("name")} />
          <Input label="Description (optional)" placeholder="Why this goal matters to you..." {...register("description")} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Target Amount (₦)" type="number" min={0} placeholder="10000" error={errors.targetAmount?.message} {...register("targetAmount", { valueAsNumber: true })} />
            <Input label="Current Amount (₦)" type="number" min={0} placeholder="0" error={errors.currentAmount?.message} {...register("currentAmount", { valueAsNumber: true })} />
          </div>
          <Input label="Deadline" type="date" error={errors.deadline?.message} {...register("deadline")} />

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

          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" loading={isSubmitting}>Create Goal</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
