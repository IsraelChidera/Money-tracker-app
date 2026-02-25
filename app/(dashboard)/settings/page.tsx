"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Sun, Moon, Shield, Bell, User, Palette } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { profileSchema, changePasswordSchema, type ProfileFormData, type ChangePasswordFormData } from "@/lib/validations";
import { CURRENCIES } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

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

export default function SettingsPage() {
  const { user, updateUser, theme, toggleTheme } = useAppStore();
  const [profileSaved, setProfileSaved] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true, push: false, weekly: true, goalAlerts: true,
  });

  // Profile form
  const {
    register: regProfile,
    handleSubmit: handleProfile,
    formState: { errors: profileErrors, isSubmitting: profileSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user.name, email: user.email, currency: user.currency },
  });

  const onProfileSubmit = async (data: ProfileFormData) => {
    await new Promise((r) => setTimeout(r, 500));
    updateUser(data);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  // Password form
  const {
    register: regPassword,
    handleSubmit: handlePassword,
    reset: resetPassword,
    formState: { errors: passwordErrors, isSubmitting: passwordSubmitting },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const onPasswordSubmit = async (_data: ChangePasswordFormData) => {
    await new Promise((r) => setTimeout(r, 500));
    resetPassword();
    setPasswordSaved(true);
    setTimeout(() => setPasswordSaved(false), 2500);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-white">Settings</h1>
        <p className="mt-0.5 text-sm text-zinc-500">Manage your account preferences</p>
      </div>

      {/* Profile */}
      <Card>
        <SectionTitle icon={User} title="Profile" />

        {/* User preview */}
        <div className="mb-6 flex items-center gap-3 rounded-xl bg-white/4 p-4">
          <Avatar name={user.name} size="lg" />
          <div>
            <p className="font-bold text-white">{user.name}</p>
            <p className="text-sm text-zinc-500">{user.email}</p>
            <Badge variant="free" className="mt-1">Free Plan</Badge>
          </div>
        </div>

        <form onSubmit={handleProfile(onProfileSubmit)} className="space-y-4">
          <Input label="Full Name" error={profileErrors.name?.message} {...regProfile("name")} />
          <Input label="Email" type="email" error={profileErrors.email?.message} {...regProfile("email")} />
          <Select
            label="Default Currency"
            options={CURRENCIES.map((c) => ({ label: c.label, value: c.value }))}
            error={profileErrors.currency?.message}
            {...regProfile("currency")}
          />
          <div className="flex justify-end">
            <Button type="submit" loading={profileSubmitting}>
              {profileSaved ? (
                <>
                  <Check className="h-4 w-4" /> Saved!
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </Card>

      {/* Appearance */}
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

      {/* Notifications */}
      <Card>
        <SectionTitle icon={Bell} title="Notifications" />
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

      {/* Security */}
      <Card>
        <SectionTitle icon={Shield} title="Security" />
        <form onSubmit={handlePassword(onPasswordSubmit)} className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            placeholder="••••••••"
            error={passwordErrors.currentPassword?.message}
            {...regPassword("currentPassword")}
          />
          <Input
            label="New Password"
            type="password"
            placeholder="••••••••"
            error={passwordErrors.newPassword?.message}
            {...regPassword("newPassword")}
          />
          <Input
            label="Confirm New Password"
            type="password"
            placeholder="••••••••"
            error={passwordErrors.confirmPassword?.message}
            {...regPassword("confirmPassword")}
          />
          <div className="flex justify-end">
            <Button type="submit" loading={passwordSubmitting}>
              {passwordSaved ? (
                <><Check className="h-4 w-4" /> Password Updated!</>
              ) : (
                "Update Password"
              )}
            </Button>
          </div>
        </form>
      </Card>

      {/* Danger zone */}
      <Card className="border-red-500/20">
        <h2 className="mb-4 font-bold text-red-400">Danger Zone</h2>
        <div className="flex items-center justify-between rounded-xl border border-red-500/15 bg-red-500/5 p-4">
          <div>
            <p className="font-semibold text-white">Delete Account</p>
            <p className="text-sm text-zinc-500">Permanently delete your account and all data</p>
          </div>
          <Button variant="danger" size="sm">Delete Account</Button>
        </div>
      </Card>
    </div>
  );
}
