"use client";

/**
 * useGoals
 *
 * Real-time hook for the goals subcollection.
 *
 * Usage:
 *   const { goals, activeGoals, loading, error, add, update, complete, remove } = useGoals();
 */

import { useEffect, useState, useCallback } from "react";
import { onSnapshot } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import {
  defaultGoalsQuery,
  goalFromDoc,
  goalsService,
} from "@/services/goalsService";
import type { Goal } from "@/types";

interface UseGoalsReturn {
  goals: Goal[];
  /** Filtered to status === "active" — ready to use in dashboard widgets */
  activeGoals: Goal[];
  loading: boolean;
  error: string | null;
  add: (data: Omit<Goal, "id" | "status" | "createdAt" | "updatedAt">) => Promise<string>;
  update: (id: string, data: Partial<Omit<Goal, "id" | "createdAt" | "updatedAt">>) => Promise<void>;
  /** Mark as completed and cap currentAmount at targetAmount */
  complete: (id: string, targetAmount: number) => Promise<void>;
  pause: (id: string) => Promise<void>;
  resume: (id: string) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export function useGoals(): UseGoalsReturn {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setGoals([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = onSnapshot(
      defaultGoalsQuery(user.uid),
      (snap) => {
        setGoals(snap.docs.map((d) => goalFromDoc(d.id, d.data())));
        setLoading(false);
      },
      (err) => {
        console.error("[useGoals]", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [user]);

  const add = useCallback(
    (data: Omit<Goal, "id" | "status" | "createdAt" | "updatedAt">) => {
      if (!user) return Promise.reject(new Error("Not authenticated"));
      return goalsService.create(user.uid, data);
    },
    [user]
  );

  const update = useCallback(
    (id: string, data: Partial<Omit<Goal, "id" | "createdAt" | "updatedAt">>) => {
      if (!user) return Promise.reject(new Error("Not authenticated"));
      return goalsService.update(user.uid, id, data);
    },
    [user]
  );

  const complete = useCallback(
    (id: string, targetAmount: number) => {
      if (!user) return Promise.reject(new Error("Not authenticated"));
      return goalsService.complete(user.uid, id, targetAmount);
    },
    [user]
  );

  const pause = useCallback(
    (id: string) => {
      if (!user) return Promise.reject(new Error("Not authenticated"));
      return goalsService.pause(user.uid, id);
    },
    [user]
  );

  const resume = useCallback(
    (id: string) => {
      if (!user) return Promise.reject(new Error("Not authenticated"));
      return goalsService.resume(user.uid, id);
    },
    [user]
  );

  const remove = useCallback(
    (id: string) => {
      if (!user) return Promise.reject(new Error("Not authenticated"));
      return goalsService.delete(user.uid, id);
    },
    [user]
  );

  const activeGoals = goals.filter((g) => g.status === "active");

  return { goals, activeGoals, loading, error, add, update, complete, pause, resume, remove };
}
