import Link from "next/link";
import { DollarSign } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      {/* Minimal header */}
      <header className="flex h-16 items-center px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-violet-500 shadow-lg shadow-brand-500/30">
            <DollarSign className="h-4 w-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-lg font-extrabold tracking-tight text-white">
            MyMoney
          </span>
        </Link>
      </header>

      {/* Content */}
      <div className="flex flex-1 items-center justify-center p-5">
        {children}
      </div>

      <footer className="py-5 text-center text-xs text-zinc-600">
        By continuing, you agree to our{" "}
        <a href="#" className="text-zinc-400 hover:text-white transition-colors">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="text-zinc-400 hover:text-white transition-colors">
          Privacy Policy
        </a>
        .
      </footer>
    </div>
  );
}
