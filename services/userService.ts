/**
 * userService
 *
 * Manages the users/{uid} document — profile creation, fetch, and update.
 * Called once on register, then on every login via AuthContext.
 *
 * Firestore path:  users/{uid}
 * Fields:
 *   name        string
 *   email       string
 *   plan        "free" | "pro" | "premium"
 *   currency    "NGN" | "USD" | "GBP" | "EUR"
 *   createdAt   Timestamp
 *   updatedAt   Timestamp
 */

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  type DocumentData,
} from "firebase/firestore";
import { db, toISO } from "@/lib/firestore";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  plan: "free" | "pro" | "premium";
  currency: "NGN" | "USD" | "GBP" | "EUR";
  createdAt: string;
  updatedAt: string;
}

export type UpdateProfileInput = Partial<
  Pick<UserProfile, "name" | "email" | "plan" | "currency">
>;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const userRef = (uid: string) => doc(db, "users", uid);

function fromDoc(uid: string, data: DocumentData): UserProfile {
  return {
    id: uid,
    name: data.name ?? "",
    email: data.email ?? "",
    plan: data.plan ?? "free",
    currency: data.currency ?? "NGN",
    createdAt: toISO(data.createdAt),
    updatedAt: toISO(data.updatedAt),
  };
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const userService = {
  /**
   * Create the user document right after Firebase Auth registration.
   * Uses setDoc with merge:true so re-registration is safe.
   */
  async create(uid: string, name: string, email: string): Promise<void> {
    await setDoc(
      userRef(uid),
      {
        name,
        email,
        plan: "free",
        currency: "NGN",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  },

  /** Fetch the user profile once (used in AuthContext after login). */
  async get(uid: string): Promise<UserProfile | null> {
    const snap = await getDoc(userRef(uid));
    if (!snap.exists()) return null;
    return fromDoc(uid, snap.data());
  },

  /**
   * Update editable profile fields.
   * Automatically stamps updatedAt.
   */
  async update(uid: string, data: UpdateProfileInput): Promise<void> {
    await updateDoc(userRef(uid), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  },
};
