"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/components/firebase";
import { signInWithGoogle } from "@/lib/auth-google-login";
import { loginSchema, type LoginFormData } from "@/lib/validations";
import { getAuthErrorMessage } from "@/lib/auth-errors";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";

// Isolated to a child component so it can be wrapped in Suspense —
// useSearchParams() requires a Suspense boundary during static generation.
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      const from = searchParams.get("from") ?? "/dashboard";
      router.push(from);
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? "";
      setAuthError(getAuthErrorMessage(code));
    } finally {
      setGoogleLoading(false);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  const onSubmit = async (data: LoginFormData) => {
    setAuthError(null);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      const from = searchParams.get("from") ?? "/dashboard";
      router.push(from);
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? "";
      setAuthError(getAuthErrorMessage(code));
    }
  };

  return (
    <>
      <div className="mb-6">
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={googleLoading}
          className="w-full rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 py-2.5 text-sm font-semibold text-zinc-300 flex items-center gap-2 justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {googleLoading ? (
            <span className="h-4 w-4 rounded-full border-2 border-zinc-500 border-t-white animate-spin" />
          ) : (
            <Image src="/google.png" alt="google" width={20} height={20} />
          )}
          Continue with Google
        </button>
      </div>

      <div className="mb-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-white/8" />
        <span className="text-xs text-zinc-600">or continue with email</span>
        <div className="h-px flex-1 bg-white/8" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email")}
        />

        <Input
          label="Password"
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          error={errors.password?.message}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
          {...register("password")}
        />

        <div className="flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-400">
            <input
              type="checkbox"
              className="rounded border-white/20 bg-zinc-800 accent-brand-500"
              {...register("rememberMe")}
            />
            Remember me
          </label>
          <a
            href="#"
            className="text-sm font-semibold text-brand-400 hover:text-brand-300 transition-colors"
          >
            Forgot password?
          </a>
        </div>

        {authError && (
          <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {authError}
          </p>
        )}

        <Button type="submit" className="mt-2 w-full" size="lg" loading={isSubmitting}>
          Sign In
        </Button>
      </form>
    </>
  );
}

export default function LoginPage() {
  return (
    <div className="w-full max-w-md animate-slide-up">
      <div className="rounded-2xl border border-white/10 bg-zinc-900/80 p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-black tracking-tight text-white">Welcome back</h1>
          <p className="mt-1 text-sm text-zinc-400">Sign in to your MyMoney account</p>
        </div>

        <Suspense fallback={<div className="h-64 animate-pulse rounded-xl bg-white/5" />}>
          <LoginForm />
        </Suspense>
      </div>

      <p className="mt-5 text-center text-sm text-zinc-500">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-semibold text-brand-400 hover:text-brand-300 transition-colors"
        >
          Sign up free
        </Link>
      </p>
    </div>
  );
}
