import Link from "next/link";
import { DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-5 text-center">
      {/* Glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center">
        <div className="h-72 w-72 rounded-full bg-brand-500/10 blur-3xl" />
      </div>

      <div className="relative">
        <div className="mb-6 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-violet-500 shadow-xl shadow-brand-500/30">
            <DollarSign className="h-7 w-7 text-white" />
          </div>
        </div>

        <div className="mb-4 text-8xl font-black text-gradient">404</div>
        <h1 className="mb-2 text-2xl font-black text-white">Page not found</h1>
        <p className="mb-8 text-zinc-400">
          Looks like this page wandered off. Let&apos;s get you back on track.
        </p>

        <div className="flex gap-3 justify-center">
          <Button asChild>
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
