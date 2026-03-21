/**
 * activityService
 *
 * Append-only activity feed. Written automatically by savingsService and
 * investmentsService on every create. Activity documents are never updated
 * or deleted — they form an immutable audit trail.
 *
 * Firestore path:  users/{uid}/activity/{activityId}
 * Fields:
 *   type          "savings" | "investment"
 *   direction     "in" | "out"
 *   amount        number
 *   platform      string
 *   description   string
 *   refId         string    ID of the source savings / investment doc
 *   date          Timestamp the transaction date (not createdAt)
 *   createdAt     Timestamp
 */

import {
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  where,
  Timestamp,
  serverTimestamp,
  type DocumentData,
  type CollectionReference,
  type QueryConstraint,
} from "firebase/firestore";
import { db, toISO } from "@/lib/firestore";
import type { ActivityItem } from "@/types";

// ─── Collection ref (exported so hooks can attach onSnapshot) ─────────────────

export const activityCol = (uid: string): CollectionReference =>
  collection(db, "users", uid, "activity");

export const recentActivityQuery = (uid: string, count = 10) =>
  query(activityCol(uid), orderBy("date", "desc"), limit(count));

// ─── Log input type ───────────────────────────────────────────────────────────

export interface ActivityLogInput {
  type: "savings" | "investment";
  direction: "in" | "out";
  amount: number;
  platform: string;
  description: string;
  refId: string;
  date: string; // ISO string — converted to Timestamp internally
}

// ─── Converter ────────────────────────────────────────────────────────────────

export function activityFromDoc(id: string, data: DocumentData): ActivityItem {
  return {
    id,
    type: data.type,
    direction: data.direction,
    amount: data.amount,
    platform: data.platform,
    description: data.description,
    date: toISO(data.date),
  };
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const activityService = {
  /**
   * Internal — called by savingsService.create and investmentsService.create.
   * You should not need to call this directly from components.
   */
  async log(uid: string, data: ActivityLogInput): Promise<void> {
    await addDoc(activityCol(uid), {
      type: data.type,
      direction: data.direction,
      amount: data.amount,
      platform: data.platform,
      description: data.description,
      refId: data.refId,
      date: Timestamp.fromDate(new Date(data.date)),
      createdAt: serverTimestamp(),
    });
  },

  /**
   * Log a withdrawal or manual adjustment from components.
   * Use direction:"out" for withdrawals.
   */
  async logManual(uid: string, data: ActivityLogInput): Promise<void> {
    await this.log(uid, data);
  },
};
