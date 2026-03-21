import { Sparkles } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

type Currency = "NGN" | "USD" | "GBP" | "EUR";

interface WelcomeBannerProps {
  name: string;
  netWorth: number;
  currency?: Currency;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function WelcomeBanner({ name, netWorth, currency = "NGN" }: WelcomeBannerProps) {
  const displayName = name || "there";

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-600 via-brand-500 to-violet-600 p-6 shadow-xl shadow-brand-500/20">
      {/* Background pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-10">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/30 blur-2xl" />
        <div className="absolute -bottom-4 left-12 h-24 w-24 rounded-full bg-white/20 blur-xl" />
      </div>

      <div className="relative flex items-center justify-between gap-4">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-white/70" />
            <span className="text-xs font-semibold uppercase tracking-widest text-white/70">
              {getGreeting()}
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">
            {displayName} 👋
          </h2>
          <p className="mt-0.5 text-sm text-white/60">
            Here&apos;s your financial overview
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/60 mb-1">
            Net Worth
          </p>
          <p className="text-3xl font-black tracking-tight text-white">
            {formatCurrency(netWorth, currency)}
          </p>
        </div>
      </div>
    </div>
  );
}
