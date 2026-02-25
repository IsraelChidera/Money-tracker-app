"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SavingsEntry, Investment, Goal, User } from "@/types";
import {
  MOCK_SAVINGS,
  MOCK_INVESTMENTS,
  MOCK_GOALS,
  MOCK_USER,
} from "@/lib/mock-data";
import { generateId } from "@/lib/utils";

// ─── Savings slice ────────────────────────────────────────────────────────────
interface SavingsSlice {
  savings: SavingsEntry[];
  addSavings: (entry: Omit<SavingsEntry, "id" | "createdAt" | "updatedAt">) => void;
  updateSavings: (id: string, updates: Partial<SavingsEntry>) => void;
  deleteSavings: (id: string) => void;
}

// ─── Investments slice ────────────────────────────────────────────────────────
interface InvestmentsSlice {
  investments: Investment[];
  addInvestment: (inv: Omit<Investment, "id" | "createdAt" | "updatedAt">) => void;
  updateInvestment: (id: string, updates: Partial<Investment>) => void;
  deleteInvestment: (id: string) => void;
}

// ─── Goals slice ──────────────────────────────────────────────────────────────
interface GoalsSlice {
  goals: Goal[];
  addGoal: (goal: Omit<Goal, "id" | "createdAt" | "updatedAt">) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
}

// ─── UI slice ─────────────────────────────────────────────────────────────────
interface UISlice {
  theme: "dark" | "light";
  sidebarOpen: boolean;
  toggleTheme: () => void;
  setSidebarOpen: (open: boolean) => void;
}

// ─── User slice ───────────────────────────────────────────────────────────────
interface UserSlice {
  user: User;
  updateUser: (updates: Partial<User>) => void;
}

// ─── Combined store ───────────────────────────────────────────────────────────
type AppStore = SavingsSlice & InvestmentsSlice & GoalsSlice & UISlice & UserSlice;

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      // ─── Savings ───────────────────────────────────────────────────────────
      savings: MOCK_SAVINGS,
      addSavings: (entry) =>
        set((state) => ({
          savings: [
            ...state.savings,
            {
              ...entry,
              id: generateId("s"),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
        })),
      updateSavings: (id, updates) =>
        set((state) => ({
          savings: state.savings.map((s) =>
            s.id === id ? { ...s, ...updates, updatedAt: new Date().toISOString() } : s
          ),
        })),
      deleteSavings: (id) =>
        set((state) => ({ savings: state.savings.filter((s) => s.id !== id) })),

      // ─── Investments ───────────────────────────────────────────────────────
      investments: MOCK_INVESTMENTS,
      addInvestment: (inv) =>
        set((state) => ({
          investments: [
            ...state.investments,
            {
              ...inv,
              id: generateId("i"),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
        })),
      updateInvestment: (id, updates) =>
        set((state) => ({
          investments: state.investments.map((i) =>
            i.id === id ? { ...i, ...updates, updatedAt: new Date().toISOString() } : i
          ),
        })),
      deleteInvestment: (id) =>
        set((state) => ({
          investments: state.investments.filter((i) => i.id !== id),
        })),

      // ─── Goals ─────────────────────────────────────────────────────────────
      goals: MOCK_GOALS,
      addGoal: (goal) =>
        set((state) => ({
          goals: [
            ...state.goals,
            {
              ...goal,
              id: generateId("g"),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
        })),
      updateGoal: (id, updates) =>
        set((state) => ({
          goals: state.goals.map((g) =>
            g.id === id ? { ...g, ...updates, updatedAt: new Date().toISOString() } : g
          ),
        })),
      deleteGoal: (id) =>
        set((state) => ({ goals: state.goals.filter((g) => g.id !== id) })),

      // ─── UI ────────────────────────────────────────────────────────────────
      theme: "dark",
      sidebarOpen: false,
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === "dark" ? "light" : "dark" })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      // ─── User ──────────────────────────────────────────────────────────────
      user: MOCK_USER,
      updateUser: (updates) =>
        set((state) => ({ user: { ...state.user, ...updates } })),
    }),
    {
      name: "mymoney-store",
      partialize: (state) => ({
        savings: state.savings,
        investments: state.investments,
        goals: state.goals,
        theme: state.theme,
        user: state.user,
      }),
    }
  )
);

// ─── Derived selectors ────────────────────────────────────────────────────────
export const selectTotalSavings = (state: AppStore) =>
  state.savings.reduce((sum, s) => sum + s.amount, 0);

export const selectTotalInvestments = (state: AppStore) =>
  state.investments.reduce((sum, i) => sum + i.currentValue, 0);

export const selectNetWorth = (state: AppStore) =>
  selectTotalSavings(state) + selectTotalInvestments(state);

export const selectActiveGoals = (state: AppStore) =>
  state.goals.filter((g) => g.status === "active");

export const selectCompletedGoals = (state: AppStore) =>
  state.goals.filter(
    (g) => g.currentAmount >= g.targetAmount || g.status === "completed"
  );
