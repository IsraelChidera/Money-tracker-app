"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Plus, TrendingUp, Trash2, ArrowUpRight, ArrowDownRight,
  Edit2, AlertCircle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useInvestments } from "@/hooks/useInvestments";
import { investmentSchema, type InvestmentFormData } from "@/lib/validations";
import { formatCurrency, formatDate, calculateGrowthPct } from "@/lib/utils";
import { ASSET_CLASSES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { StatCard } from "@/components/ui/stat-card";
import { EmptyState } from "@/components/ui/empty-state";
import { AllocationChart } from "@/components/charts/allocation-chart";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Investment } from "@/types";

type Currency = "NGN" | "USD" | "GBP" | "EUR";

const CURRENCY_SYMBOL: Record<Currency, string> = {
  NGN: "₦", USD: "$", GBP: "£", EUR: "€",
};

const ASSET_COLORS: Record<string, string> = {
  Stocks: "#6366f1",
  ETF: "#10b981",
  Bonds: "#f59e0b",
  "Real Estate": "#ec4899",
  Crypto: "#f97316",
  "Fixed Income": "#06b6d4",
  "Mutual Fund": "#8b5cf6",
  Other: "#71717a",
};

function PageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="h-7 w-36 rounded-xl bg-white/5" />
          <div className="h-4 w-52 rounded bg-white/5" />
        </div>
        <div className="h-9 w-36 rounded-xl bg-white/5" />
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 rounded-2xl bg-white/5" />
        ))}
      </div>
      <div className="h-72 rounded-2xl bg-white/5" />
    </div>
  );
}

export default function InvestmentsPage() {
  const { profile } = useAuth();
  const { investments, totalValue, totalGain, loading, error, add, update, remove } =
    useInvestments();

  const currency = (profile?.currency ?? "NGN") as Currency;
  const fmt = (n: number) => formatCurrency(n, currency);
  const symbol = CURRENCY_SYMBOL[currency];

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InvestmentFormData>({
    resolver: zodResolver(investmentSchema),
    defaultValues: {
      platform: "",
      assetName: "",
      assetClass: "Stocks",
      quantity: 0,
      purchasePrice: 0,
      currentValue: 0,
      date: new Date().toISOString().slice(0, 10),
      notes: "",
    },
  });

  const openAdd = () => {
    setEditingId(null);
    setSubmitError(null);
    reset({
      platform: "",
      assetName: "",
      assetClass: "Stocks",
      quantity: 0,
      purchasePrice: 0,
      currentValue: 0,
      date: new Date().toISOString().slice(0, 10),
      notes: "",
    });
    setModalOpen(true);
  };

  const openEdit = (inv: Investment) => {
    setEditingId(inv.id);
    setSubmitError(null);
    reset({
      platform: inv.platform,
      assetName: inv.assetName,
      assetClass: inv.assetClass,
      quantity: inv.quantity,
      purchasePrice: inv.purchasePrice,
      currentValue: inv.currentValue,
      date: inv.date.slice(0, 10),
      notes: inv.notes ?? "",
    });
    setModalOpen(true);
  };

  const onSubmit = async (data: InvestmentFormData) => {
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
      // swallowed — item stays in list
    } finally {
      setDeletingId(null);
    }
  };

  const pieData = investments.map((inv) => ({
    name: inv.assetName,
    value: inv.currentValue,
    color: ASSET_COLORS[inv.assetClass] ?? "#6366f1",
  }));

  const totalCost = investments.reduce((s, i) => s + i.purchasePrice * i.quantity, 0);
  const returnPct = calculateGrowthPct(totalValue, totalCost);

  if (loading) return <PageSkeleton />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white">Investments</h1>
          <p className="mt-0.5 text-sm text-zinc-500">Monitor your investment portfolio</p>
        </div>
        <Button onClick={openAdd}>
          <Plus className="h-4 w-4" />
          <span className="lg:block hidden">Add Investment</span>
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
          label="Portfolio Value"
          value={fmt(totalValue)}
          icon={TrendingUp}
          accentColor="#6366f1"
        />
        <StatCard
          label="Total Cost"
          value={fmt(totalCost)}
          icon={TrendingUp}
          accentColor="#f59e0b"
        />
        <StatCard
          label="Total Return"
          value={fmt(Math.abs(totalGain))}
          icon={totalGain >= 0 ? ArrowUpRight : ArrowDownRight}
          accentColor={totalGain >= 0 ? "#10b981" : "#ef4444"}
        />
        <StatCard
          label="Return %"
          value={`${returnPct >= 0 ? "+" : ""}${returnPct.toFixed(1)}%`}
          icon={TrendingUp}
          accentColor={returnPct >= 0 ? "#10b981" : "#ef4444"}
        />
      </div>

      {/* Chart + table */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {investments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Allocation</CardTitle>
            </CardHeader>
            <AllocationChart data={pieData} totalNetWorth={totalValue} />
          </Card>
        )}

        <div
          className={cn(
            "overflow-hidden rounded-2xl border border-white/8 bg-zinc-900/80",
            investments.length > 0 ? "lg:col-span-2" : "lg:col-span-3"
          )}
        >
          {investments.length === 0 ? (
            <EmptyState
              icon={TrendingUp}
              title="No investments yet"
              description="Start tracking your portfolio by adding your first investment."
              action={{ label: "Add Investment", onClick: openAdd }}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    {["Asset", "Platform", "Class", "Qty", "Cost", "Value", "Return", ""].map(
                      (h) => (
                        <th
                          key={h}
                          className="px-4 py-3.5 text-left text-xs font-bold uppercase tracking-widest text-zinc-600"
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {investments.map((inv) => {
                    const cost = inv.purchasePrice * inv.quantity;
                    const ret = inv.currentValue - cost;
                    const retPct = calculateGrowthPct(inv.currentValue, cost);
                    return (
                      <tr key={inv.id} className="transition-colors hover:bg-white/3">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2.5">
                            <div
                              className="hidden lg:flex lg:h-8 lg:w-8 shrink-0 items-center justify-center rounded-xl"
                              style={{ background: `${ASSET_COLORS[inv.assetClass]}18` }}
                            >
                              <TrendingUp
                                className="h-3.5 w-3.5"
                                style={{ color: ASSET_COLORS[inv.assetClass] }}
                              />
                            </div>
                            <div>
                              <span className="text-sm font-bold text-white block">
                                {inv.assetName}
                              </span>
                              <span className="text-xs text-zinc-600">
                                {formatDate(inv.date)}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-zinc-400">{inv.platform}</td>
                        <td className="px-4 py-4">
                          <Badge variant="default" className="text-[10px]">
                            {inv.assetClass}
                          </Badge>
                        </td>
                        <td className="px-4 py-4 text-sm text-zinc-300">{inv.quantity}</td>
                        <td className="px-4 py-4 text-sm text-zinc-400">{fmt(cost)}</td>
                        <td className="px-4 py-4 text-sm font-bold text-white">
                          {fmt(inv.currentValue)}
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={cn(
                              "text-sm font-bold",
                              ret >= 0 ? "text-emerald-400" : "text-red-400"
                            )}
                          >
                            {ret >= 0 ? "+" : "−"}
                            {fmt(Math.abs(ret))}
                            <span className="ml-1 text-xs opacity-70">
                              ({ret >= 0 ? "+" : ""}
                              {retPct.toFixed(1)}%)
                            </span>
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex gap-1.5">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => openEdit(inv)}
                            >
                              <Edit2 className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="danger"
                              size="icon"
                              className="h-7 w-7"
                              loading={deletingId === inv.id}
                              onClick={() => handleDelete(inv.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => !isSubmitting && setModalOpen(false)}
        title={editingId ? "Edit Investment" : "Add Investment"}
        subtitle={
          editingId
            ? "Update your investment details — especially the current value"
            : "Track a new investment position"
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Platform"
              placeholder="e.g. Bamboo, Risevest"
              error={errors.platform?.message}
              {...register("platform")}
            />
            <Input
              label="Asset Name"
              placeholder="e.g. AAPL, Bitcoin"
              error={errors.assetName?.message}
              {...register("assetName")}
            />
          </div>
          <Select
            label="Asset Class"
            error={errors.assetClass?.message}
            options={ASSET_CLASSES.map((c) => ({ label: c, value: c }))}
            {...register("assetClass")}
          />
          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Quantity"
              type="number"
              min={0}
              step="any"
              placeholder="1"
              error={errors.quantity?.message}
              {...register("quantity", { valueAsNumber: true })}
            />
            <Input
              label={`Buy Price (${symbol})`}
              type="number"
              min={0}
              placeholder="0"
              error={errors.purchasePrice?.message}
              {...register("purchasePrice", { valueAsNumber: true })}
            />
            <Input
              label={`Current Value (${symbol})`}
              type="number"
              min={0}
              placeholder="0"
              error={errors.currentValue?.message}
              {...register("currentValue", { valueAsNumber: true })}
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
            placeholder="Any notes..."
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
              {editingId ? "Save Changes" : "Add Investment"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
