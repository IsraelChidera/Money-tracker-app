/**
 * savingsService
 *
 * Full CRUD for savings entries. Every create automatically logs to the
 * activity feed via activityService.log().
 *
 * Firestore path:  users/{uid}/savings/{savingsId}
 * Fields:
 *   platform    string          e.g. "Piggyvest"
 *   amount      number          must be > 0
 *   category    SavingsCategory
 *   date        Timestamp       the entry date (not createdAt)
 *   notes       string?
 *   createdAt   Timestamp
 *   updatedAt   Timestamp
 */

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
  serverTimestamp,
  type DocumentData,
  type CollectionReference,
} from "firebase/firestore";
import { db, toISO } from "@/lib/firestore";
import { activityService } from "./activityService";
import type { SavingsEntry, SavingsCategory } from "@/types";

// ─── Collection ref (exported so hooks can attach onSnapshot) ─────────────────

export const savingsCol = (uid: string): CollectionReference =>
  collection(db, "users", uid, "savings");

export const defaultSavingsQuery = (uid: string) =>
  query(savingsCol(uid), orderBy("date", "desc"));

// ─── Converter ────────────────────────────────────────────────────────────────

export function savingsFromDoc(id: string, data: DocumentData): SavingsEntry {
  return {
    id,
    platform: data.platform,
    amount: data.amount,
    category: data.category as SavingsCategory,
    date: toISO(data.date),
    notes: data.notes ?? undefined,
    createdAt: toISO(data.createdAt),
    updatedAt: toISO(data.updatedAt),
  };
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const savingsService = {
  /**
   * Add a new savings entry and auto-log to activity feed.
   * Returns the new document ID.
   */
  async create(
    uid: string,
    data: Omit<SavingsEntry, "id" | "createdAt" | "updatedAt">
  ): Promise<string> {
    const ref = await addDoc(savingsCol(uid), {
      platform: data.platform,
      amount: data.amount,
      category: data.category,
      date: Timestamp.fromDate(new Date(data.date)),
      ...(data.notes ? { notes: data.notes } : {}),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Auto-log to activity feed
    await activityService.log(uid, {
      type: "savings",
      direction: "in",
      amount: data.amount,
      platform: data.platform,
      description: `${data.category} deposit`,
      refId: ref.id,
      date: data.date,
    });

    return ref.id;
  },

  /**
   * Partially update a savings entry.
   * Only the provided fields are overwritten.
   */
  async update(
    uid: string,
    id: string,
    data: Partial<Omit<SavingsEntry, "id" | "createdAt" | "updatedAt">>
  ): Promise<void> {
    const ref = doc(savingsCol(uid), id);
    await updateDoc(ref, {
      ...data,
      ...(data.date ? { date: Timestamp.fromDate(new Date(data.date)) } : {}),
      updatedAt: serverTimestamp(),
    });
  },

  /** Permanently delete a savings entry. */
  async delete(uid: string, id: string): Promise<void> {
    await deleteDoc(doc(savingsCol(uid), id));
  },
};
