"use client";

/**
 * useActivity
 *
 * Real-time hook for the activity feed. Read-only from the component side
 * — all writes happen automatically inside savingsService and investmentsService.
 *
 * Usage:
 *   const { activity, loading, error } = useActivity();
 *   const { activity } = useActivity(5); // limit to 5 items
 */

import { useEffect, useState } from "react";
import { onSnapshot } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { recentActivityQuery, activityFromDoc } from "@/services/activityService";
import type { ActivityItem } from "@/types";

interface UseActivityReturn {
  activity: ActivityItem[];
  loading: boolean;
  error: string | null;
}

export function useActivity(count = 10): UseActivityReturn {
  const { user } = useAuth();
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setActivity([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = onSnapshot(
      recentActivityQuery(user.uid, count),
      (snap) => {
        setActivity(snap.docs.map((d) => activityFromDoc(d.id, d.data())));
        setLoading(false);
      },
      (err) => {
        console.error("[useActivity]", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [user, count]);

  return { activity, loading, error };
}
