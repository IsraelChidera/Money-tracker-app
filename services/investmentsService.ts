/**
 * investmentsService
 *
 * Full CRUD for investment positions. Every create auto-logs to the
 * activity feed via activityService.log().
 *
 * Firestore path:  users/{uid}/investments/{investmentId}
 * Fields:
 *   platform        string      e.g. "Bamboo"
 *   assetName       string      e.g. "AAPL"
 *   assetClass      AssetClass
 *   quantity        number
 *   purchasePrice   number      cost per unit at time of purchase
 *   currentValue    number      total current market value
 *   date            Timestamp   purchase date
 *   notes           string?
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
  Timestamp,
  serverTimestamp,
  type DocumentData,
  type CollectionReference,
} from "firebase/firestore";
import { db, toISO } from "@/lib/firestore";
import { activityService } from "./activityService";
import type { Investment, AssetClass } from "@/types";

// ─── Collection ref (exported so hooks can attach onSnapshot) ─────────────────

export const investmentsCol = (uid: string): CollectionReference =>
  collection(db, "users", uid, "investments");

export const defaultInvestmentsQuery = (uid: string) =>
  query(investmentsCol(uid), orderBy("date", "desc"));

// ─── Converter ────────────────────────────────────────────────────────────────

export function investmentFromDoc(id: string, data: DocumentData): Investment {
  return {
    id,
    platform: data.platform,
    assetName: data.assetName,
    assetClass: data.assetClass as AssetClass,
    quantity: data.quantity,
    purchasePrice: data.purchasePrice,
    currentValue: data.currentValue,
    date: toISO(data.date),
    notes: data.notes ?? undefined,
    createdAt: toISO(data.createdAt),
    updatedAt: toISO(data.updatedAt),
  };
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const investmentsService = {
  /**
   * Add a new investment position and auto-log to activity feed.
   * Returns the new document ID.
   */
  async create(
    uid: string,
    data: Omit<Investment, "id" | "createdAt" | "updatedAt">
  ): Promise<string> {
    const ref = await addDoc(investmentsCol(uid), {
      platform: data.platform,
      assetName: data.assetName,
      assetClass: data.assetClass,
      quantity: data.quantity,
      purchasePrice: data.purchasePrice,
      currentValue: data.currentValue,
      date: Timestamp.fromDate(new Date(data.date)),
      ...(data.notes ? { notes: data.notes } : {}),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Auto-log to activity feed
    await activityService.log(uid, {
      type: "investment",
      direction: "in",
      amount: data.currentValue,
      platform: data.platform,
      description: `${data.assetName} (${data.assetClass}) purchased`,
      refId: ref.id,
      date: data.date,
    });

    return ref.id;
  },

  /**
   * Update an investment — most commonly used to refresh currentValue
   * as the market price changes.
   */
  async update(
    uid: string,
    id: string,
    data: Partial<Omit<Investment, "id" | "createdAt" | "updatedAt">>
  ): Promise<void> {
    const ref = doc(investmentsCol(uid), id);
    await updateDoc(ref, {
      ...data,
      ...(data.date ? { date: Timestamp.fromDate(new Date(data.date)) } : {}),
      updatedAt: serverTimestamp(),
    });
  },

  /** Remove an investment position permanently. */
  async delete(uid: string, id: string): Promise<void> {
    await deleteDoc(doc(investmentsCol(uid), id));
  },
};
