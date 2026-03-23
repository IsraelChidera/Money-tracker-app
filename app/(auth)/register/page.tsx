"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Check } from "lucide-react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/components/firebase";
import { signInWithGoogle } from "@/lib/auth-google-login";
import { userService } from "@/services/userService";
import { registerSchema, type RegisterFormData } from "@/lib/validations";
import { getAuthErrorMessage } from "@/lib/auth-errors";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const passwordRules = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One number", test: (p: string) => /[0-9]/.test(p) },
];

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleSignUp = async () => {
    setAuthError(null);
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      router.push("/dashboard");
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
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setAuthError(null);
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      // Set displayName on the Auth profile
      await updateProfile(user, { displayName: data.name });
      // Create the Firestore user document
      await userService.create(user.uid, data.name, data.email);
      router.push("/dashboard");
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? "";
      setAuthError(getAuthErrorMessage(code));
    }
  };

  return (
    <div className="w-full max-w-md animate-slide-up">
      <div className="rounded-2xl border border-white/10 bg-zinc-900/80 p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-black tracking-tight text-white">
            Create your account
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Start managing your finances for free
          </p>
        </div>

        <div className="mb-6">
          <button
            type="button"
            onClick={handleGoogleSignUp}
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
            label="Full Name"
            placeholder="Adewale Johnson"
            error={errors.name?.message}
            {...register("name")}
          />
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register("email")}
          />

          <div className="space-y-1.5">
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
              {...register("password", {
                onChange: (e) => setPassword(e.target.value),
              })}
            />
            {/* Password strength indicators */}
            {password && (
              <div className="flex gap-3 pt-1">
                {passwordRules.map((rule) => (
                  <div
                    key={rule.label}
                    className="flex items-center gap-1 text-[11px]"
                  >
                    <div
                      className={`h-3.5 w-3.5 rounded-full flex items-center justify-center ${rule.test(password)
                        ? "bg-accent-500/20 text-accent-400"
                        : "bg-white/8 text-zinc-600"
                        }`}
                    >
                      {rule.test(password) && <Check className="h-2 w-2" />}
                    </div>
                    <span
                      className={
                        rule.test(password) ? "text-zinc-400" : "text-zinc-600"
                      }
                    >
                      {rule.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />

          {authError && (
            <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {authError}
            </p>
          )}

          <Button
            type="submit"
            className="mt-2 w-full"
            size="lg"
            loading={isSubmitting}
          >
            Create Account
          </Button>
        </form>
      </div>

      <p className="mt-5 text-center text-sm text-zinc-500">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-brand-400 hover:text-brand-300 transition-colors"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
