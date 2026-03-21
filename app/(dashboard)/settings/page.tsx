"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Check, Sun, Moon, Shield, Bell,
  User, Palette, Trash2, AlertTriangle, Eye, EyeOff,
} from "lucide-react";
import {
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  deleteUser,
} from "firebase/auth";
import {
  collection, getDocs, deleteDoc, doc, writeBatch,
} from "firebase/firestore";
import { auth } from "@/components/firebase";
import { db } from "@/lib/firestore";
import { useAuth } from "@/context/AuthContext";
import { userService } from "@/services/userService";
import { getAuthErrorMessage } from "@/lib/auth-errors";
import {
  profileSchema, changePasswordSchema,
  type ProfileFormData, type ChangePasswordFormData,
} from "@/lib/validations";
import { CURRENCIES } from "@/lib/constants";
import { useAppStore } from "@/store/app-store";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const BATCH_LIMIT = 490; // Firestore batch write limit is 500

/** Delete every document in every subcollection, then the user root doc. */
async function deleteAllUserData(uid: string): Promise<void> {
  const subcollections = ["savings", "investments", "goals", "activity"];

  // Collect all refs first
  const allRefs: ReturnType<typeof doc>[] = [];
  for (const sub of subcollections) {
    const snap = await getDocs(collection(db, "users", uid, sub));
    snap.docs.forEach((d) => allRefs.push(d.ref));
  }
  allRefs.push(doc(db, "users", uid));

  // Write in batches respecting the 500-doc limit
  for (let i = 0; i < allRefs.length; i += BATCH_LIMIT) {
    const batch = writeBatch(db);
    allRefs.slice(i, i + BATCH_LIMIT).forEach((ref) => batch.delete(ref));
    await batch.commit();
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionTitle({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="mb-5 flex items-center gap-2">
      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-500/15">
        <Icon className="h-3.5 w-3.5 text-brand-400" />
      </div>
      <h2 className="font-bold text-white">{title}</h2>
    </div>
  );
}

function FeedbackMessage({ success, error }: { success?: string; error?: string }) {
  if (error) {
    return (
      <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
        {error}
      </p>
    );
  }
  if (success) {
    return (
      <p className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
        <Check className="h-4 w-4 shrink-0" /> {success}
      </p>
    );
  }
  return null;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const router = useRouter();
  const { user, profile, signOut } = useAuth();
  const { theme, toggleTheme } = useAppStore();

  // ── Profile section state
  const [profileMsg, setProfileMsg] = useState<{ success?: string; error?: string }>({});
  const [showReauthForEmail, setShowReauthForEmail] = useState(false);
  const [reauthPassword, setReauthPassword] = useState("");
  const [pendingProfileData, setPendingProfileData] = useState<ProfileFormData | null>(null);
  const [reauthLoading, setReauthLoading] = useState(false);

  // ── Password section state
  const [passwordMsg, setPasswordMsg] = useState<{ success?: string; error?: string }>({});
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  // ── Delete modal state
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [showDeletePw, setShowDeletePw] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // ── Notifications (UI-only for now)
  const [notifications, setNotifications] = useState({
    email: true, push: false, weekly: true, goalAlerts: true,
  });

  // ── Profile form
  const {
    register: regProfile,
    handleSubmit: handleProfile,
    formState: { errors: profileErrors, isSubmitting: profileSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile?.name ?? "",
      email: user?.email ?? "",
      currency: profile?.currency ?? "NGN",
    },
  });

  const onProfileSubmit = async (data: ProfileFormData) => {
    if (!user) return;
    setProfileMsg({});

    const emailChanged = data.email !== user.email;

    // If email is changing, we need to re-authenticate first
    if (emailChanged) {
      setPendingProfileData(data);
      setReauthPassword("");
      setShowReauthForEmail(true);
      return;
    }

    try {
      await userService.update(user.uid, {
        name: data.name,
        currency: data.currency,
      });
      setProfileMsg({ success: "Profile updated successfully." });
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? "";
      setProfileMsg({ error: getAuthErrorMessage(code) });
    }
  };

  const confirmEmailChange = async () => {
    if (!user || !user.email || !pendingProfileData) return;
    setReauthLoading(true);
    try {
      const credential = EmailAuthProvider.credential(user.email, reauthPassword);
      await reauthenticateWithCredential(user, credential);
      await updateEmail(user, pendingProfileData.email);
      await userService.update(user.uid, {
        name: pendingProfileData.name,
        email: pendingProfileData.email,
        currency: pendingProfileData.currency,
      });
      setShowReauthForEmail(false);
      setProfileMsg({ success: "Profile and email updated successfully." });
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? "";
      setProfileMsg({ error: getAuthErrorMessage(code) });
      setShowReauthForEmail(false);
    } finally {
      setReauthLoading(false);
      setPendingProfileData(null);
    }
  };

  // ── Password form
  const {
    register: regPassword,
    handleSubmit: handlePassword,
    reset: resetPassword,
    formState: { errors: passwordErrors, isSubmitting: passwordSubmitting },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const onPasswordSubmit = async (data: ChangePasswordFormData) => {
    if (!user || !user.email) return;
    setPasswordMsg({});
    try {
      const credential = EmailAuthProvider.credential(user.email, data.currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, data.newPassword);
      resetPassword();
      setPasswordMsg({ success: "Password updated successfully." });
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? "";
      setPasswordMsg({ error: getAuthErrorMessage(code) });
    }
  };

  // ── Delete account
  const handleDeleteAccount = async () => {
    if (!user || !user.email) return;
    setDeleteError(null);
    setDeleteLoading(true);
    try {
      const credential = EmailAuthProvider.credential(user.email, deletePassword);
      await reauthenticateWithCredential(user, credential);
      await deleteAllUserData(user.uid);
      await deleteUser(user);
      router.push("/");
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? "";
      setDeleteError(getAuthErrorMessage(code));
      setDeleteLoading(false);
    }
  };

  const displayName = profile?.name ?? user?.displayName ?? "User";

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-white">Settings</h1>
        <p className="mt-0.5 text-sm text-zinc-500">Manage your account preferences</p>
      </div>

      {/* ── Profile ───────────────────────────────────────────────────────── */}
      <Card>
        <SectionTitle icon={User} title="Profile" />

        {/* Avatar preview */}
        <div className="mb-6 flex items-center gap-3 rounded-xl bg-white/4 p-4">
          <Avatar name={displayName} size="lg" />
          <div>
            <p className="font-bold text-white">{displayName}</p>
            <p className="text-sm text-zinc-500">{user?.email}</p>
            <Badge variant="free" className="mt-1 capitalize">
              {profile?.plan ?? "free"} Plan
            </Badge>
          </div>
        </div>

        <form onSubmit={handleProfile(onProfileSubmit)} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="Your name"
            error={profileErrors.name?.message}
            {...regProfile("name")}
          />
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            error={profileErrors.email?.message}
            {...regProfile("email")}
          />
          <Select
            label="Default Currency"
            options={CURRENCIES.map((c) => ({ label: c.label, value: c.value }))}
            error={profileErrors.currency?.message}
            {...regProfile("currency")}
          />

          <FeedbackMessage {...profileMsg} />

          <div className="flex justify-end">
            <Button type="submit" loading={profileSubmitting}>
              Save Changes
            </Button>
          </div>
        </form>
      </Card>

      {/* ── Appearance ────────────────────────────────────────────────────── */}
      <Card>
        <SectionTitle icon={Palette} title="Appearance" />
        <div className="flex items-center justify-between rounded-xl bg-white/4 p-4">
          <div>
            <p className="font-semibold text-white">Theme</p>
            <p className="text-sm text-zinc-500">
              Currently using {theme === "dark" ? "dark" : "light"} mode
            </p>
          </div>
          <Button variant="secondary" size="sm" onClick={toggleTheme}>
            {theme === "dark" ? (
              <><Sun className="h-4 w-4" /> Light Mode</>
            ) : (
              <><Moon className="h-4 w-4" /> Dark Mode</>
            )}
          </Button>
        </div>
      </Card>

      {/* ── Notifications ─────────────────────────────────────────────────── */}
      <Card>
        <SectionTitle icon={Bell} title="Notifications" />
        <p className="mb-4 text-xs text-zinc-600">
          Notification preferences are saved locally on this device.
        </p>
        <Toggle
          label="Email Notifications"
          description="Receive weekly summaries via email"
          checked={notifications.email}
          onChange={(v) => setNotifications((p) => ({ ...p, email: v }))}
        />
        <Toggle
          label="Push Notifications"
          description="Real-time updates on your device"
          checked={notifications.push}
          onChange={(v) => setNotifications((p) => ({ ...p, push: v }))}
        />
        <Toggle
          label="Weekly Reports"
          description="Automated weekly financial summary"
          checked={notifications.weekly}
          onChange={(v) => setNotifications((p) => ({ ...p, weekly: v }))}
        />
        <Toggle
          label="Goal Alerts"
          description="Notify when you're close to reaching a goal"
          checked={notifications.goalAlerts}
          onChange={(v) => setNotifications((p) => ({ ...p, goalAlerts: v }))}
        />
      </Card>

      {/* ── Security / Change Password ────────────────────────────────────── */}
      <Card>
        <SectionTitle icon={Shield} title="Security" />
        <form onSubmit={handlePassword(onPasswordSubmit)} className="space-y-4">
          <Input
            label="Current Password"
            type={showCurrent ? "text" : "password"}
            placeholder="••••••••"
            error={passwordErrors.currentPassword?.message}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowCurrent((p) => !p)}
                className="text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
            {...regPassword("currentPassword")}
          />
          <Input
            label="New Password"
            type={showNew ? "text" : "password"}
            placeholder="••••••••"
            error={passwordErrors.newPassword?.message}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowNew((p) => !p)}
                className="text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
            {...regPassword("newPassword")}
          />
          <Input
            label="Confirm New Password"
            type="password"
            placeholder="••••••••"
            error={passwordErrors.confirmPassword?.message}
            {...regPassword("confirmPassword")}
          />

          <FeedbackMessage {...passwordMsg} />

          <div className="flex justify-end">
            <Button type="submit" loading={passwordSubmitting}>
              Update Password
            </Button>
          </div>
        </form>
      </Card>

      {/* ── Danger Zone ───────────────────────────────────────────────────── */}
      <Card className="border-red-500/20">
        <h2 className="mb-4 font-bold text-red-400">Danger Zone</h2>
        <div className="flex items-center justify-between rounded-xl border border-red-500/15 bg-red-500/5 p-4">
          <div>
            <p className="font-semibold text-white">Delete Account</p>
            <p className="text-sm text-zinc-500">
              Permanently delete your account and all data. This cannot be undone.
            </p>
          </div>
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              setDeletePassword("");
              setDeleteError(null);
              setDeleteOpen(true);
            }}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </Card>

      {/* ── Email Re-auth Modal ─────────────────────────────────────────────── */}
      <Modal
        open={showReauthForEmail}
        onClose={() => !reauthLoading && setShowReauthForEmail(false)}
        title="Confirm Email Change"
        subtitle="Enter your current password to update your email address."
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-zinc-400">
            New email: <span className="font-semibold text-white">{pendingProfileData?.email}</span>
          </p>
          <Input
            label="Current Password"
            type="password"
            placeholder="••••••••"
            value={reauthPassword}
            onChange={(e) => setReauthPassword(e.target.value)}
            autoFocus
          />
          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setShowReauthForEmail(false)}
              disabled={reauthLoading}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              loading={reauthLoading}
              disabled={!reauthPassword || reauthLoading}
              onClick={confirmEmailChange}
            >
              Confirm Change
            </Button>
          </div>
        </div>
      </Modal>

      {/* ── Delete Confirmation Modal ──────────────────────────────────────── */}
      <Modal
        open={deleteOpen}
        onClose={() => !deleteLoading && setDeleteOpen(false)}
        title="Delete Account"
        subtitle="This action is permanent and cannot be undone."
        size="sm"
      >
        <div className="mb-5 flex gap-3 rounded-xl border border-red-500/25 bg-red-500/10 p-4">
          <AlertTriangle className="h-5 w-5 shrink-0 text-red-400 mt-0.5" />
          <div className="text-sm text-red-300 space-y-1">
            <p className="font-semibold">Everything will be deleted:</p>
            <ul className="list-disc list-inside text-red-400 space-y-0.5">
              <li>All savings entries</li>
              <li>All investment positions</li>
              <li>All goals and progress</li>
              <li>Your account and profile</li>
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <Input
            label="Enter your password to confirm"
            type={showDeletePw ? "text" : "password"}
            placeholder="••••••••"
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowDeletePw((p) => !p)}
                className="text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                {showDeletePw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
          />

          {deleteError && (
            <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {deleteError}
            </p>
          )}

          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setDeleteOpen(false)}
              disabled={deleteLoading}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              className="flex-1"
              loading={deleteLoading}
              disabled={!deletePassword || deleteLoading}
              onClick={handleDeleteAccount}
            >
              Yes, Delete Everything
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
