"use client";

import { usePathname } from "next/navigation";
import { Menu, Bell } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/savings": "Savings",
  "/investments": "Investments",
  "/reports": "Reports",
  "/goals": "Goals",
  "/settings": "Settings",
};

interface TopbarProps {
  onMenuClick: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const pathname = usePathname();
  const { user, profile } = useAuth();
  const title = pageTitles[pathname] ?? "MyMoney";
  const displayName = profile?.name ?? user?.displayName ?? user?.email ?? "User";

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-white/5 bg-zinc-950/80 px-5 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-sm font-bold text-white">{title}</h1>
          <p className="text-xs text-zinc-500 hidden sm:block">
            {formatDate(new Date(), "EEEE, d MMMM yyyy")}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-accent-500" />
        </Button>

        {/* Avatar */}
        <Avatar name={displayName} size="sm" />
      </div>
    </header>
  );
}
