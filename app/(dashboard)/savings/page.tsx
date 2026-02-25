"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, PiggyBank, Wallet, Edit2, Trash2 } from "lucide-react";
import { useAppStore, selectTotalSavings } from "@/store/app-store";
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

export default function SavingsPage() {
  const { savings, addSavings, updateSavings, deleteSavings } = useAppStore();
  const totalSavings = useAppStore(selectTotalSavings);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SavingsFormData>({
    resolver: zodResolver(savingsSchema),
    defaultValues: { platform: "", amount: 0, category: "General", date: "", notes: "" },
  });

  const openAdd = () => {
    setEditingId(null);
    reset({ platform: "", amount: 0, category: "General", date: new Date().toISOString().slice(0, 10), notes: "" });
    setModalOpen(true);
  };

  const openEdit = (entry: SavingsEntry) => {
    setEditingId(entry.id);
    reset({
      platform: entry.platform,
      amount: entry.amount,
      category: entry.category,
      date: entry.date,
      notes: entry.notes ?? "",
    });
    setModalOpen(true);
  };

  const onSubmit = async (data: SavingsFormData) => {
    await new Promise((r) => setTimeout(r, 400));
    if (editingId) {
      updateSavings(editingId, data);
    } else {
      addSavings({ ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    setModalOpen(false);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white">Savings</h1>
          <p className="mt-0.5 text-sm text-zinc-500">Track all your savings accounts</p>
        </div>
        <Button onClick={openAdd}>
          <Plus className="h-4 w-4" />
          Add Savings
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Total Savings" value={formatCurrency(totalSavings)} change={5.2} icon={PiggyBank} accentColor="#10b981" className="sm:col-span-2" />
        <StatCard label="Accounts" value={String(savings.length)} icon={Wallet} accentColor="#6366f1" />
        <StatCard
          label="Avg. per Account"
          value={savings.length > 0 ? formatCurrency(Math.round(totalSavings / savings.length)) : "₦0"}
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
                  {["Platform", "Category", "Amount", "Date", "Actions"].map((h) => (
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
                      {formatCurrency(entry.amount)}
                    </td>
                    <td className="px-5 py-4 text-sm text-zinc-500">
                      {formatDate(entry.date)}
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
                          onClick={() => deleteSavings(entry.id)}
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

      {/* Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
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
              label="Amount (₦)"
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
          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
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
