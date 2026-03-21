"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import { onSnapshot } from "firebase/firestore";
import { doc } from "firebase/firestore";
import { auth } from "@/components/firebase";
import { db } from "@/lib/firestore";
import type { UserProfile } from "@/services/userService";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthContextValue {
  /** Firebase Auth user — null when signed out */
  user: User | null;
  /** Firestore profile (name, plan, currency, etc.) — null until loaded */
  profile: UserProfile | null;
  /** True while the initial auth check or profile fetch is in-flight */
  loading: boolean;
  signOut: () => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Track the Firestore profile listener so we can clean it up
    let unsubscribeProfile: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);

      // Tear down the previous profile listener whenever auth changes
      if (unsubscribeProfile) {
        unsubscribeProfile();
        unsubscribeProfile = null;
      }

      if (firebaseUser) {
        // Set the presence cookie for Next.js middleware
        document.cookie = "auth_session=1; path=/; SameSite=Strict";

        // Subscribe to the user's Firestore profile in real-time.
        // This means profile changes (e.g. currency, plan) propagate instantly.
        unsubscribeProfile = onSnapshot(
          doc(db, "users", firebaseUser.uid),
          (snap) => {
            if (snap.exists()) {
              const data = snap.data();
              setProfile({
                id: firebaseUser.uid,
                name: data.name ?? firebaseUser.displayName ?? "",
                email: data.email ?? firebaseUser.email ?? "",
                plan: data.plan ?? "free",
                currency: data.currency ?? "NGN",
                createdAt: data.createdAt?.toDate?.()?.toISOString() ?? "",
                updatedAt: data.updatedAt?.toDate?.()?.toISOString() ?? "",
              });
            } else {
              // Profile doc doesn't exist yet (race condition right after signup)
              setProfile(null);
            }
            setLoading(false);
          },
          () => {
            // Firestore read failed — fall back gracefully
            setProfile(null);
            setLoading(false);
          }
        );
      } else {
        // Signed out — clear everything
        document.cookie =
          "auth_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict";
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
    };
  }, []);

  const signOut = () => firebaseSignOut(auth);

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
