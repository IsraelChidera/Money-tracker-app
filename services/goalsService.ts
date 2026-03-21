/**
 * goalsService
 *
 * Full CRUD for financial goals including status transitions.
 *
 * Firestore path:  users/{uid}/goals/{goalId}
 * Fields:
 *   name            string
 *   description     string?
 *   targetAmount    number
 *   currentAmount   number       updated as user contributes
 *   deadline        Timestamp
 *   color           string       hex colour e.g. "#6366f1"
 *   status          "active" | "completed" | "paused"
 *   createdAt       Timestamp
 *   updatedAt       Timestamp
 */

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  Timestamp,
  serverTimestamp,
  type DocumentData,
  type CollectionReference,
} from "firebase/firestore";
import { db, toISO } from "@/lib/firestore";
import type { Goal, GoalStatus } from "@/types";

// ─── Collection ref (exported so hooks can attach onSnapshot) ─────────────────

export const goalsCol = (uid: string): CollectionReference =>
  collection(db, "users", uid, "goals");

/** Default query — active goals sorted by nearest deadline */
export const defaultGoalsQuery = (uid: string) =>
  query(goalsCol(uid), orderBy("createdAt", "desc"));

/** Active-only query used on the dashboard */
export const activeGoalsQuery = (uid: string) =>
  query(
    goalsCol(uid),
    where("status", "==", "active"),
    orderBy("deadline", "asc")
  );

// ─── Converter ────────────────────────────────────────────────────────────────

export function goalFromDoc(id: string, data: DocumentData): Goal {
  return {
    id,
    name: data.name,
    description: data.description ?? undefined,
    targetAmount: data.targetAmount,
    currentAmount: data.currentAmount,
    deadline: toISO(data.deadline),
    color: data.color,
    status: data.status as GoalStatus,
    createdAt: toISO(data.createdAt),
    updatedAt: toISO(data.updatedAt),
  };
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const goalsService = {
  /** Create a new goal. Status defaults to "active". */
  async create(
    uid: string,
    data: Omit<Goal, "id" | "status" | "createdAt" | "updatedAt">
  ): Promise<string> {
    const ref = await addDoc(goalsCol(uid), {
      name: data.name,
      ...(data.description ? { description: data.description } : {}),
      targetAmount: data.targetAmount,
      currentAmount: data.currentAmount,
      deadline: Timestamp.fromDate(new Date(data.deadline)),
      color: data.color,
      status: "active" satisfies GoalStatus,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return ref.id;
  },

  /**
   * Update any goal fields — most commonly currentAmount as the user
   * adds contributions, or status to pause/resume a goal.
   */
  async update(
    uid: string,
    id: string,
    data: Partial<Omit<Goal, "id" | "createdAt" | "updatedAt">>
  ): Promise<void> {
    const ref = doc(goalsCol(uid), id);
    await updateDoc(ref, {
      ...data,
      ...(data.deadline
        ? { deadline: Timestamp.fromDate(new Date(data.deadline)) }
        : {}),
      updatedAt: serverTimestamp(),
    });
  },

  /**
   * Convenience method to mark a goal complete.
   * Also sets currentAmount = targetAmount if not already there.
   */
  async complete(uid: string, id: string, targetAmount: number): Promise<void> {
    await updateDoc(doc(goalsCol(uid), id), {
      status: "completed" satisfies GoalStatus,
      currentAmount: targetAmount,
      updatedAt: serverTimestamp(),
    });
  },

  /** Pause a goal without deleting it. */
  async pause(uid: string, id: string): Promise<void> {
    await updateDoc(doc(goalsCol(uid), id), {
      status: "paused" satisfies GoalStatus,
      updatedAt: serverTimestamp(),
    });
  },

  /** Resume a paused goal. */
  async resume(uid: string, id: string): Promise<void> {
    await updateDoc(doc(goalsCol(uid), id), {
      status: "active" satisfies GoalStatus,
      updatedAt: serverTimestamp(),
    });
  },

  /** Permanently delete a goal. */
  async delete(uid: string, id: string): Promise<void> {
    await deleteDoc(doc(goalsCol(uid), id));
  },
};
