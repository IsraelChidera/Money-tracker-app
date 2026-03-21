import { z } from "zod";

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  rememberMe: z.boolean().optional(),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().min(1, "Email is required").email("Enter a valid email"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain an uppercase letter")
      .regex(/[0-9]/, "Must contain a number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// ─── Savings ──────────────────────────────────────────────────────────────────
export const savingsSchema = z.object({
  platform: z.string().min(1, "Platform name is required"),
  amount: z
    .number({ invalid_type_error: "Enter a valid amount" })
    .min(1, "Amount must be greater than 0"),
  category: z.enum([
    "Emergency Fund",
    "Travel",
    "House",
    "Car",
    "Education",
    "Business",
    "Retirement",
    "General",
  ]),
  date: z.string().min(1, "Date is required"),
  notes: z.string().optional(),
});

// ─── Investment ───────────────────────────────────────────────────────────────
export const investmentSchema = z.object({
  platform: z.string().min(1, "Platform name is required"),
  assetName: z.string().min(1, "Asset name is required"),
  assetClass: z.enum([
    "Stocks",
    "ETF",
    "Bonds",
    "Real Estate",
    "Crypto",
    "Fixed Income",
    "Mutual Fund",
    "Other",
  ]),
  quantity: z
    .number({ invalid_type_error: "Enter a valid quantity" })
    .min(0.000001, "Quantity must be greater than 0"),
  purchasePrice: z
    .number({ invalid_type_error: "Enter a valid price" })
    .min(0, "Price must be 0 or greater"),
  currentValue: z
    .number({ invalid_type_error: "Enter a valid value" })
    .min(0, "Value must be 0 or greater"),
  date: z.string().min(1, "Date is required"),
  notes: z.string().optional(),
});

// ─── Goal ─────────────────────────────────────────────────────────────────────
export const goalSchema = z.object({
  name: z.string().min(1, "Goal name is required"),
  description: z.string().optional(),
  targetAmount: z
    .number({ invalid_type_error: "Enter a valid target amount" })
    .min(1, "Target amount must be greater than 0"),
  currentAmount: z
    .number({ invalid_type_error: "Enter a valid amount" })
    .min(0, "Current amount cannot be negative"),
  deadline: z.string().min(1, "Deadline is required"),
  color: z.string().min(1, "Please pick a color"),
  createdAt: z.string().optional(),
});

// ─── Profile ──────────────────────────────────────────────────────────────────
export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  currency: z.enum(["NGN", "USD", "GBP", "EUR"]),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain an uppercase letter")
      .regex(/[0-9]/, "Must contain a number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// ─── Inferred types ───────────────────────────────────────────────────────────
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type SavingsFormData = z.infer<typeof savingsSchema>;
export type InvestmentFormData = z.infer<typeof investmentSchema>;
export type GoalFormData = z.infer<typeof goalSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
