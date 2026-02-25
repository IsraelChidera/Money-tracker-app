"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { loginSchema, type LoginFormData } from "@/lib/validations";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  const onSubmit = async (_data: LoginFormData) => {
    // Simulate API call
    await new Promise((r) => setTimeout(r, 800));
    router.push("/dashboard");
  };

  return (
    <div className="w-full max-w-md animate-slide-up">
      {/* Card */}
      <div className="rounded-2xl border border-white/10 bg-zinc-900/80 p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-black tracking-tight text-white">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Sign in to your MyMoney account
          </p>
        </div>

        {/* Social */}
        <div className="mb-6 grid grid-cols-2 gap-3">
          {["🔵 Google", "🍎 Apple"].map((s) => (
            <button
              key={s}
              type="button"
              className="rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm font-semibold text-zinc-300 transition-colors hover:bg-white/10"
            >
              {s}
            </button>
          ))}
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
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
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

          <Button
            type="submit"
            className="mt-2 w-full"
            size="lg"
            loading={isSubmitting}
          >
            Sign In
          </Button>
        </form>
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
