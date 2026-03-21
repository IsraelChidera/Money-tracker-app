"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home, PiggyBank, TrendingUp, FileText,
  Target, Settings, LogOut, DollarSign,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { getAuthErrorMessage } from "@/lib/auth-errors";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/savings", label: "Savings", icon: PiggyBank },
  { href: "/investments", label: "Investments", icon: TrendingUp },
  { href: "/reports", label: "Reports", icon: FileText },
  { href: "/goals", label: "Goals", icon: Target },
  { href: "/settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const { user, profile, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [authError, setAuthError] = useState<string | null>(null);

  const displayName = profile?.name ?? user?.displayName ?? user?.email ?? "User";

  const handleLogOut = async () => {
    setAuthError(null);
    try {
      await signOut();
      router.push("/login");
    } catch (error: unknown) {
      const code = (error as { code?: string }).code ?? "";
      setAuthError(getAuthErrorMessage(code));
    }
  };

  return (
    <aside className="flex h-full flex-col bg-zinc-950 border-r border-white/5">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-white/5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-violet-500 shadow-lg shadow-brand-500/30">
          <DollarSign className="h-4 w-4 text-white" strokeWidth={2.5} />
        </div>
        <span className="text-lg font-extrabold tracking-tight text-white">
          MyMoney
        </span>
      </div>

      {/* User card */}
      <div className="mx-3 mt-4 mb-2 rounded-xl bg-brand-500/8 border border-brand-500/15 p-3">
        <div className="flex items-center gap-2.5">
          <Avatar name={displayName} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">
              {displayName}
            </p>
            <p className="truncate text-xs text-zinc-500">{user?.email}</p>
          </div>
          <Badge variant="free" className="text-[10px] capitalize">
            {profile?.plan ?? "free"}
          </Badge>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 px-3 py-2">
        <p className="px-2 pb-2 pt-1 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
          Menu
        </p>
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                "border-l-2",
                active
                  ? "border-brand-500 bg-brand-500/10 text-brand-400"
                  : "border-transparent text-zinc-500 hover:bg-white/5 hover:text-zinc-300"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-white/5 p-3 space-y-2">
        {authError && (
          <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {authError}
          </p>
        )}
        <button
          onClick={handleLogOut}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-500 hover:bg-white/5 hover:text-zinc-300 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
