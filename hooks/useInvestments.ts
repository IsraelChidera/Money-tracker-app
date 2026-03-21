"use client";

/**
 * useInvestments
 *
 * Real-time hook for the investments subcollection.
 *
 * Usage:
 *   const { investments, loading, error, add, update, remove } = useInvestments();
 */

import { useEffect, useState, useCallback } from "react";
import { onSnapshot } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import {
  defaultInvestmentsQuery,
  investmentFromDoc,
  investmentsService,
} from "@/services/investmentsService";
import type { Investment } from "@/types";

interface UseInvestmentsReturn {
  investments: Investment[];
  loading: boolean;
  error: string | null;
  /** Total current value across all positions */
  totalValue: number;
  /** Total gain/loss vs. purchase price */
  totalGain: number;
  add: (data: Omit<Investment, "id" | "createdAt" | "updatedAt">) => Promise<string>;
  update: (id: string, data: Partial<Omit<Investment, "id" | "createdAt" | "updatedAt">>) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export function useInvestments(): UseInvestmentsReturn {
  const { user } = useAuth();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setInvestments([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = onSnapshot(
      defaultInvestmentsQuery(user.uid),
      (snap) => {
        setInvestments(snap.docs.map((d) => investmentFromDoc(d.id, d.data())));
        setLoading(false);
      },
      (err) => {
        console.error("[useInvestments]", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [user]);

  const add = useCallback(
    (data: Omit<Investment, "id" | "createdAt" | "updatedAt">) => {
      if (!user) return Promise.reject(new Error("Not authenticated"));
      return investmentsService.create(user.uid, data);
    },
    [user]
  );

  const update = useCallback(
    (id: string, data: Partial<Omit<Investment, "id" | "createdAt" | "updatedAt">>) => {
      if (!user) return Promise.reject(new Error("Not authenticated"));
      return investmentsService.update(user.uid, id, data);
    },
    [user]
  );

  const remove = useCallback(
    (id: string) => {
      if (!user) return Promise.reject(new Error("Not authenticated"));
      return investmentsService.delete(user.uid, id);
    },
    [user]
  );

  // Derived totals — computed from state so no extra reads
  const totalValue = investments.reduce((sum, i) => sum + i.currentValue, 0);
  const totalGain = investments.reduce(
    (sum, i) => sum + (i.currentValue - i.purchasePrice * i.quantity),
    0
  );

  return { investments, loading, error, totalValue, totalGain, add, update, remove };
}
