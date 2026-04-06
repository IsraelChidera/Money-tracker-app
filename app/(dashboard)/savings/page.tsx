"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, PiggyBank, Wallet, Edit2, Trash2, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useSavings } from "@/hooks/useSavings";
import { savingsSchema, type SavingsFormData } from "@/lib/validations";
import { formatCurrency, formatDate } from "@/lib/utils";
import { SAVINGS_CATEGORIES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { StatCard } from "@/components/ui/stat-card";
import { EmptyState } from "@/components/ui/empty-state";
import type { SavingsEntry } from "@/types";

type Currency = "NGN" | "USD" | "GBP" | "EUR";

const CURRENCY_SYMBOL: Record<Currency, string> = {
  NGN: "₦", USD: "$", GBP: "£", EUR: "€",
};

const categoryColors: Record<string, string> = {
  "Emergency Fund": "success",
  "Travel": "default",
  "House": "warning",
  "Car": "default",
  "Education": "default",
  "Business": "success",
  "Retirement": "warning",
  "General": "outline",
};

function PageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="h-7 w-28 rounded-xl bg-white/5" />
          <div className="h-4 w-48 rounded bg-white/5" />
        </div>
        <div className="h-9 w-32 rounded-xl bg-white/5" />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-32 rounded-2xl bg-white/5" />
        ))}
      </div>
      <div className="h-64 rounded-2xl bg-white/5" />
    </div>
  );
}

export default function SavingsPage() {
  const { profile } = useAuth();
  const { savings, loading, error, add, update, remove } = useSavings();
  const currency = (profile?.currency ?? "NGN") as Currency;
  const fmt = (n: number) => formatCurrency(n, currency);
  const symbol = CURRENCY_SYMBOL[currency];

  const totalSavings = savings.reduce((sum, s) => sum + s.amount, 0);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SavingsFormData>({
    resolver: zodResolver(savingsSchema),
    defaultValues: { platform: "", amount: 0, category: "General", date: "", notes: "" },
  });

  const openAdd = () => {
    setEditingId(null);
    setSubmitError(null);
    reset({
      platform: "",
      amount: 0,
      category: "General",
      date: new Date().toISOString().slice(0, 10),
      notes: "",
    });
    setModalOpen(true);
  };

  const openEdit = (entry: SavingsEntry) => {
    setEditingId(entry.id);
    setSubmitError(null);
    reset({
      platform: entry.platform,
      amount: entry.amount,
      category: entry.category,
      date: entry.date.slice(0, 10),
      notes: entry.notes ?? "",
    });
    setModalOpen(true);
  };

  const onSubmit = async (data: SavingsFormData) => {
    setSubmitError(null);
    try {
      if (editingId) {
        await update(editingId, data);
      } else {
        await add(data);
      }
      setModalOpen(false);
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await remove(id);
    } catch {
      // error is swallowed — entry stays in list
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <PageSkeleton />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white">Savings</h1>
          <p className="mt-0.5 text-sm text-zinc-500">Track all your savings accounts</p>
        </div>
        <Button  onClick={openAdd}>
          <Plus className="h-4 w-4" />
          <span className="lg:block hidden">Add Savings</span>
          <span className="lg:hidden block">Add</span>
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
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 xl:grid-cols-4">
        <StatCard
          label="Total Savings"
          value={fmt(totalSavings)}
          icon={PiggyBank}
          accentColor="#10b981"
          className="sm:col-span-2"
        />
        <StatCard
          label="Accounts"
          value={String(savings.length)}
          icon={Wallet}
          accentColor="#6366f1"
        />
        <StatCard
          label="Avg. per Account"
          value={savings.length > 0 ? fmt(Math.round(totalSavings / savings.length)) : fmt(0)}
          icon={PiggyBank}
          accentColor="#f59e0b"
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-white/8 bg-zinc-900/80">
        {savings.length === 0 ? (
          <EmptyState
            icon={PiggyBank}
            title="No savings entries yet"
            description="Start tracking your savings by adding your first account."
            action={{ label: "Add Savings", onClick: openAdd }}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {["Platform", "Category", "Amount", "Date", "Notes", "Actions"].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-widest text-zinc-600"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {savings.map((entry) => (
                  <tr key={entry.id} className="group transition-colors hover:bg-white/3">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-500/10">
                          <PiggyBank className="h-4 w-4 text-accent-500" />
                        </div>
                        <span className="font-semibold text-white">{entry.platform}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={(categoryColors[entry.category] ?? "default") as any}>
                        {entry.category}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 font-bold text-white">
                      {fmt(entry.amount)}
                    </td>
                    <td className="px-5 py-4 text-sm text-zinc-500">
                      {formatDate(entry.date)}
                    </td>
                    <td className="px-5 py-4 text-sm text-zinc-500 max-w-[160px] truncate">
                      {entry.notes ?? <span className="text-zinc-700">-</span>}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => openEdit(entry)}
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="danger"
                          size="icon"
                          className="h-8 w-8"
                          loading={deletingId === entry.id}
                          onClick={() => handleDelete(entry.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => !isSubmitting && setModalOpen(false)}
        title={editingId ? "Edit Savings Entry" : "Add Savings Entry"}
        subtitle="Track a savings account or deposit"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Platform Name"
            placeholder="e.g. Piggyvest, First Bank"
            error={errors.platform?.message}
            {...register("platform")}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label={`Amount (${symbol})`}
              type="number"
              min={0}
              placeholder="0"
              error={errors.amount?.message}
              {...register("amount", { valueAsNumber: true })}
            />
            <Select
              label="Category"
              error={errors.category?.message}
              options={SAVINGS_CATEGORIES.map((c) => ({ label: c, value: c }))}
              {...register("category")}
            />
          </div>
          <Input
            label="Date"
            type="date"
            error={errors.date?.message}
            {...register("date")}
          />
          <Input
            label="Notes (optional)"
            placeholder="Any notes about this entry..."
            {...register("notes")}
          />

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
              {editingId ? "Save Changes" : "Add Entry"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
