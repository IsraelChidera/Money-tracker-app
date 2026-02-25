// ─── User ─────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  plan: "free" | "pro" | "premium";
  currency: "NGN" | "USD" | "GBP" | "EUR";
  createdAt: string;
}

// ─── Savings ──────────────────────────────────────────────────────────────────

export type SavingsCategory =
  | "Emergency Fund"
  | "Travel"
  | "House"
  | "Car"
  | "Education"
  | "Business"
  | "Retirement"
  | "General";

export interface SavingsEntry {
  id: string;
  platform: string;
  amount: number;
  category: SavingsCategory;
  date: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSavingsInput {
  platform: string;
  amount: number;
  category: SavingsCategory;
  date: string;
  notes?: string;
}

export interface UpdateSavingsInput extends Partial<CreateSavingsInput> {
  id: string;
}

// ─── Investments ──────────────────────────────────────────────────────────────

export type AssetClass =
  | "Stocks"
  | "ETF"
  | "Bonds"
  | "Real Estate"
  | "Crypto"
  | "Fixed Income"
  | "Mutual Fund"
  | "Other";

export interface Investment {
  id: string;
  platform: string;
  assetName: string;
  assetClass: AssetClass;
  quantity: number;
  purchasePrice: number;
  currentValue: number;
  date: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInvestmentInput {
  platform: string;
  assetName: string;
  assetClass: AssetClass;
  quantity: number;
  purchasePrice: number;
  currentValue: number;
  date: string;
  notes?: string;
}

export interface UpdateInvestmentInput extends Partial<CreateInvestmentInput> {
  id: string;
}

// ─── Goals ────────────────────────────────────────────────────────────────────

export type GoalStatus = "active" | "completed" | "paused";

export interface Goal {
  id: string;
  name: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  color: string;
  status: GoalStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGoalInput {
  name: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  color: string;
}

export interface UpdateGoalInput extends Partial<CreateGoalInput> {
  id: string;
  status?: GoalStatus;
}

// ─── Reports ──────────────────────────────────────────────────────────────────

export interface MonthlyReport {
  month: string;
  income: number;
  expenses: number;
  savings: number;
  investments: number;
  netWorth: number;
}

export interface YearlyComparison {
  year: string;
  totalSavings: number;
  totalInvestments: number;
  netWorth: number;
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export interface DashboardStats {
  netWorth: number;
  totalSavings: number;
  totalInvestments: number;
  monthlyGrowthPct: number;
  savingsGrowthPct: number;
  investmentsGrowthPct: number;
}

export interface NetWorthDataPoint {
  month: string;
  value: number;
}

export interface ContributionDataPoint {
  month: string;
  savings: number;
  investments: number;
}

export interface AllocationDataPoint {
  name: string;
  value: number;
  color: string;
}

export interface ActivityItem {
  id: string;
  type: "savings" | "investment";
  direction: "in" | "out";
  amount: number;
  platform: string;
  description: string;
  date: string;
}

// ─── API ──────────────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  code: string;
  statusCode: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// ─── UI ───────────────────────────────────────────────────────────────────────

export type Theme = "dark" | "light";

export interface SelectOption {
  label: string;
  value: string;
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: string;
}

// ─── Pricing ──────────────────────────────────────────────────────────────────

export type PlanId = "free" | "pro" | "premium";

export interface PricingPlan {
  id: PlanId;
  name: string;
  price: number;
  currency: string;
  period: "month" | "year";
  description: string;
  features: string[];
  highlighted: boolean;
  badge: string;
  cta: string;
}
