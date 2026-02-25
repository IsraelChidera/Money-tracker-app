import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PRICING_PLANS } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Pricing" };

const faqs = [
  {
    q: "Is MyMoney really free?",
    a: "Yes! We're in our launch phase and all plans — including Pro and Premium — are completely free. No credit card needed.",
  },
  {
    q: "How do I add my savings accounts?",
    a: "You manually enter your savings across platforms like Piggyvest, Opay, First Bank, etc. We keep it simple and private.",
  },
  {
    q: "Is my data secure?",
    a: "Your data is stored locally in your browser. We never sell or share your financial data with anyone.",
  },
  {
    q: "Can I export my data?",
    a: "Pro and Premium users can export their full financial history as CSV or PDF.",
  },
];

export default function PricingPage() {
  return (
    <main className="mx-auto max-w-5xl px-5 py-16 lg:px-8">
      {/* Header */}
      <div className="mb-14 text-center">
        <h1 className="mb-4 text-5xl font-black tracking-tight text-white lg:text-6xl">
          Plans & Pricing
        </h1>
        <p className="mb-5 text-lg text-zinc-400">
          Start for free. Upgrade whenever you're ready.
        </p>
        <div className="inline-flex items-center gap-2 rounded-full border border-accent-500/30 bg-accent-500/10 px-4 py-1.5 text-sm font-semibold text-accent-500">
          <Sparkles className="h-3.5 w-3.5" />
          All plans free during our launch period
        </div>
      </div>

      {/* Plans */}
      <div className="mb-20 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {PRICING_PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`relative overflow-hidden rounded-2xl border p-7 ${
              plan.highlighted
                ? "border-brand-500/50 bg-gradient-to-b from-brand-500/8 to-transparent"
                : "border-white/8 bg-zinc-950/60"
            }`}
          >
            {plan.highlighted && (
              <>
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500 to-transparent" />
                <div className="absolute right-4 top-4">
                  <span className="rounded-full bg-brand-500 px-2.5 py-0.5 text-xs font-bold text-white">
                    Popular
                  </span>
                </div>
              </>
            )}

            <div className="mb-2 flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">{plan.name}</h3>
              <Badge variant="free">{plan.badge}</Badge>
            </div>

            <div className="mb-3 flex items-baseline gap-1">
              <span className="text-4xl font-black text-white">
                {plan.price === 0 ? "Free" : formatCurrency(plan.price)}
              </span>
              {plan.price > 0 && (
                <span className="text-sm text-zinc-500">/ month</span>
              )}
            </div>

            <p className="mb-6 text-sm leading-relaxed text-zinc-500">
              {plan.description}
            </p>

            <ul className="mb-8 space-y-3">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent-500/20">
                    <Check className="h-2.5 w-2.5 text-accent-500" />
                  </div>
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

      {/* FAQ */}
      <div className="mx-auto max-w-2xl">
        <h2 className="mb-8 text-center text-3xl font-black text-white">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq.q}
              className="rounded-2xl border border-white/8 bg-zinc-950/60 p-5"
            >
              <h3 className="mb-2 font-bold text-white">{faq.q}</h3>
              <p className="text-sm leading-relaxed text-zinc-400">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
