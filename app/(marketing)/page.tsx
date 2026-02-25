import Link from "next/link";
import {
  Wallet, BarChart2, TrendingUp, PiggyBank,
  Target, Shield, Zap, Check, Sparkles,
  ArrowRight, Twitter, Github, Linkedin, DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PRICING_PLANS } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MyMoney — Your Financial Life in One Place",
};

const features = [
  {
    icon: Wallet,
    title: "Unified Financial Overview",
    desc: "See all your accounts, savings, and investments in one beautiful dashboard.",
    color: "#6366f1",
  },
  {
    icon: BarChart2,
    title: "Smart Visual Reports",
    desc: "Understand your money with powerful charts and data visualizations.",
    color: "#10b981",
  },
  {
    icon: TrendingUp,
    title: "Investment Tracking",
    desc: "Monitor your portfolio performance across all platforms in real time.",
    color: "#f59e0b",
  },
  {
    icon: PiggyBank,
    title: "Savings Monitoring",
    desc: "Track every naira saved across all your savings platforms.",
    color: "#ec4899",
  },
  {
    icon: Target,
    title: "Goals & Milestones",
    desc: "Set financial goals and watch your progress with visual trackers.",
    color: "#06b6d4",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    desc: "Bank-grade security. Your data stays private, always.",
    color: "#8b5cf6",
  },
];

const steps = [
  { num: "01", title: "Create your account", desc: "Sign up for free and set up your profile in under 2 minutes." },
  { num: "02", title: "Add your accounts", desc: "Log your savings and investment platforms manually." },
  { num: "03", title: "Track & grow", desc: "Monitor your net worth, set goals, and get insights on your money." },
];

export default function HomePage() {
  return (
    <main>
      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-5 pb-24 pt-20 text-center lg:px-8 lg:pt-28">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center">
          <div className="h-72 w-[600px] rounded-full bg-brand-500/15 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-sm font-semibold text-brand-300">
            <Sparkles className="h-3.5 w-3.5" />
            All plans are currently free during launch
          </div>

          <h1 className="mb-6 text-5xl font-black leading-[1.06] tracking-tight text-white lg:text-6xl">
            See Your Entire{" "}
            <span className="text-gradient">Financial Life</span>
            <br />
            in One Place
          </h1>

          <p className="mx-auto mb-10 max-w-xl text-lg text-zinc-400 leading-relaxed">
            Track savings, monitor investments, visualize growth, and hit your
            financial goals — effortlessly.
          </p>

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button size="lg" asChild>
              <Link href="/register">
                <Zap className="h-4 w-4" />
                Get Started Free
              </Link>
            </Button>
            <Button variant="secondary" size="lg" asChild>
              <Link href="/pricing">
                View Pricing
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <p className="mt-4 text-sm text-zinc-600">
            No credit card required · All features unlocked
          </p>
        </div>
      </section>

      <section id="features" className="bg-zinc-900/40 px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <h2 className="mb-3 text-4xl font-black tracking-tight text-white">
              Everything you need
            </h2>
            <p className="text-zinc-400">
              Powerful tools to take full control of your financial future
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border border-white/8 bg-zinc-950/60 p-6 transition-all duration-300 hover:border-white/15 hover:bg-zinc-900/80"
              >
                <div
                  className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl"
                  style={{ background: `${f.color}18` }}
                >
                  <f.icon className="h-5 w-5" style={{ color: f.color }} />
                </div>
                <h3 className="mb-2 font-bold text-white">{f.title}</h3>
                <p className="text-sm leading-relaxed text-zinc-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ────────────────────────────────────────────── */}
      <section className="px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-3 text-4xl font-black tracking-tight text-white">
            How It Works
          </h2>
          <p className="mb-14 text-zinc-400">Get started in minutes</p>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {steps.map((s, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="mb-4 text-5xl font-black text-gradient">
                  {s.num}
                </div>
                <h3 className="mb-2 text-lg font-bold text-white">{s.title}</h3>
                <p className="text-sm leading-relaxed text-zinc-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing Preview ─────────────────────────────────────────── */}
      <section className="bg-zinc-900/40 px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-4xl font-black tracking-tight text-white">
              Simple Pricing
            </h2>
            <p className="text-zinc-400">All features unlocked for everyone right now</p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-accent-500/30 bg-accent-500/10 px-4 py-1.5 text-sm font-semibold text-accent-500">
              <Sparkles className="h-3.5 w-3.5" />
              All plans are completely free during launch
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {PRICING_PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`relative overflow-hidden rounded-2xl border p-7 ${
                  plan.highlighted
                    ? "border-brand-500/50 bg-brand-500/5"
                    : "border-white/8 bg-zinc-950/60"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500 to-transparent" />
                )}
                <div className="mb-6 flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-white">{plan.name}</h3>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="text-3xl font-black text-white">
                        {plan.price === 0 ? "₦0" : formatCurrency(plan.price)}
                      </span>
                      {plan.price > 0 && (
                        <span className="text-sm text-zinc-500">/mo</span>
                      )}
                    </div>
                  </div>
                  <Badge variant="free">{plan.badge}</Badge>
                </div>

                <ul className="mb-6 space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-zinc-400">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-500" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.highlighted ? "primary" : "secondary"}
                  className="w-full"
                  asChild
                >
                  <Link href="/register">{plan.cta}</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <footer className="border-t border-white/5 px-5 py-10 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-violet-500">
              <DollarSign className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-extrabold text-white">MyMoney</span>
          </div>

          <div className="flex gap-6">
            {["Privacy", "Terms", "Support", "Docs"].map((l) => (
              <a key={l} href="#" className="text-sm text-zinc-500 hover:text-white transition-colors">
                {l}
              </a>
            ))}
          </div>

          <div className="flex gap-2">
            {[Twitter, Github, Linkedin].map((Icon, i) => (
              <button
                key={i}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-zinc-500 hover:border-white/20 hover:text-white transition-colors"
              >
                <Icon className="h-3.5 w-3.5" />
              </button>
            ))}
          </div>
        </div>
        <p className="mt-8 text-center text-xs text-zinc-600">
          © {new Date().getFullYear()} MyMoney. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
