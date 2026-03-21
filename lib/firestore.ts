/**
 * Central Firestore database instance + shared helpers.
 * Actual CRUD logic lives in /services/*.
 */

import { getFirestore, Timestamp } from "firebase/firestore";
import app from "@/components/firebase";

export const db = getFirestore(app);

/** Safely convert a Firestore Timestamp or string to ISO string */
export function toISO(value: unknown): string {
  if (value instanceof Timestamp) return value.toDate().toISOString();
  if (typeof value === "string") return value;
  return new Date().toISOString();
}
