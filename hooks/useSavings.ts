"use client";

/**
 * useSavings
 *
 * Real-time hook for the savings subcollection.
 * Uses onSnapshot so the UI updates automatically when Firestore changes.
 *
 * Returns data, loading/error states, and CRUD action functions.
 *
 * Usage:
 *   const { savings, loading, error, add, update, remove } = useSavings();
 */

import { useEffect, useState, useCallback } from "react";
import { onSnapshot } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import {
  defaultSavingsQuery,
  savingsFromDoc,
  savingsService,
} from "@/services/savingsService";
import type { SavingsEntry } from "@/types";

interface UseSavingsReturn {
  savings: SavingsEntry[];
  loading: boolean;
  error: string | null;
  /** Add a new savings entry */
  add: (data: Omit<SavingsEntry, "id" | "createdAt" | "updatedAt">) => Promise<string>;
  /** Update a savings entry by id */
  update: (id: string, data: Partial<Omit<SavingsEntry, "id" | "createdAt" | "updatedAt">>) => Promise<void>;
  /** Delete a savings entry by id */
  remove: (id: string) => Promise<void>;
}

export function useSavings(): UseSavingsReturn {
  const { user } = useAuth();
  const [savings, setSavings] = useState<SavingsEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setSavings([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = onSnapshot(
      defaultSavingsQuery(user.uid),
      (snap) => {
        setSavings(snap.docs.map((d) => savingsFromDoc(d.id, d.data())));
        setLoading(false);
      },
      (err) => {
        console.error("[useSavings]", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [user]);

  const add = useCallback(
    (data: Omit<SavingsEntry, "id" | "createdAt" | "updatedAt">) => {
      if (!user) return Promise.reject(new Error("Not authenticated"));
      return savingsService.create(user.uid, data);
    },
    [user]
  );

  const update = useCallback(
    (id: string, data: Partial<Omit<SavingsEntry, "id" | "createdAt" | "updatedAt">>) => {
      if (!user) return Promise.reject(new Error("Not authenticated"));
      return savingsService.update(user.uid, id, data);
    },
    [user]
  );

  const remove = useCallback(
    (id: string) => {
      if (!user) return Promise.reject(new Error("Not authenticated"));
      return savingsService.delete(user.uid, id);
    },
    [user]
  );

  return { savings, loading, error, add, update, remove };
}
