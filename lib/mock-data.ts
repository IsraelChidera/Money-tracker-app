import type {
  SavingsEntry,
  Investment,
  Goal,
  ActivityItem,
  NetWorthDataPoint,
  ContributionDataPoint,
  AllocationDataPoint,
  MonthlyReport,
  User,
  PricingPlan,
} from "@/types";

// ─── User ─────────────────────────────────────────────────────────────────────
export const MOCK_USER: User = {
  id: "user_1",
  name: "Adewale Johnson",
  email: "adewale@example.com",
  plan: "free",
  currency: "NGN",
  createdAt: "2024-01-01",
};

// ─── Savings ──────────────────────────────────────────────────────────────────
export const MOCK_SAVINGS: SavingsEntry[] = [
  { id: "s1", platform: "First Bank", amount: 5200, category: "Emergency Fund", date: "2025-02-01", createdAt: "2025-02-01", updatedAt: "2025-02-01" },
  { id: "s2", platform: "Piggyvest", amount: 3800, category: "Travel", date: "2025-01-15", createdAt: "2025-01-15", updatedAt: "2025-01-15" },
  { id: "s3", platform: "Opay", amount: 4420, category: "House", date: "2025-01-28", createdAt: "2025-01-28", updatedAt: "2025-01-28" },
  { id: "s4", platform: "Zenith Bank", amount: 5000, category: "General", date: "2025-02-10", createdAt: "2025-02-10", updatedAt: "2025-02-10" },
  { id: "s5", platform: "Cowrywise", amount: 2800, category: "Education", date: "2025-01-05", createdAt: "2025-01-05", updatedAt: "2025-01-05" },
];

// ─── Investments ──────────────────────────────────────────────────────────────
export const MOCK_INVESTMENTS: Investment[] = [
  { id: "i1", platform: "Risevest", assetName: "USD Fixed Income", assetClass: "Fixed Income", quantity: 1, purchasePrice: 4800, currentValue: 5200, date: "2024-11-10", createdAt: "2024-11-10", updatedAt: "2024-11-10" },
  { id: "i2", platform: "Bamboo", assetName: "AAPL", assetClass: "Stocks", quantity: 5, purchasePrice: 4000, currentValue: 4380, date: "2024-12-01", createdAt: "2024-12-01", updatedAt: "2024-12-01" },
  { id: "i3", platform: "Cowrywise", assetName: "Eurobond Fund", assetClass: "Bonds", quantity: 1, purchasePrice: 5500, currentValue: 6100, date: "2025-01-05", createdAt: "2025-01-05", updatedAt: "2025-01-05" },
  { id: "i4", platform: "Chaka", assetName: "MSFT", assetClass: "Stocks", quantity: 3, purchasePrice: 3900, currentValue: 4320, date: "2025-01-20", createdAt: "2025-01-20", updatedAt: "2025-01-20" },
];

// ─── Goals ────────────────────────────────────────────────────────────────────
export const MOCK_GOALS: Goal[] = [
  { id: "g1", name: "Emergency Fund", targetAmount: 10000, currentAmount: 5200, deadline: "2025-12-31", color: "#10b981", status: "active", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "g2", name: "Dream Vacation", targetAmount: 5000, currentAmount: 3800, deadline: "2025-08-01", color: "#6366f1", status: "active", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "g3", name: "New Car", targetAmount: 25000, currentAmount: 8000, deadline: "2026-06-30", color: "#f59e0b", status: "active", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "g4", name: "Investment Portfolio", targetAmount: 50000, currentAmount: 20000, deadline: "2027-01-01", color: "#ec4899", status: "active", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
];

// ─── Activity ─────────────────────────────────────────────────────────────────
export const MOCK_ACTIVITY: ActivityItem[] = [
  { id: "a1", type: "savings", direction: "in", amount: 500, platform: "Piggyvest", description: "Monthly savings deposit", date: "2025-02-15" },
  { id: "a2", type: "investment", direction: "in", amount: 1200, platform: "Bamboo", description: "AAPL stock purchase", date: "2025-02-12" },
  { id: "a3", type: "savings", direction: "out", amount: 300, platform: "Opay", description: "Withdrawal", date: "2025-02-08" },
  { id: "a4", type: "investment", direction: "in", amount: 800, platform: "Risevest", description: "Fixed income top-up", date: "2025-02-05" },
  { id: "a5", type: "savings", direction: "in", amount: 1000, platform: "First Bank", description: "Salary transfer", date: "2025-02-01" },
];

// ─── Chart data ───────────────────────────────────────────────────────────────
export const NET_WORTH_DATA: NetWorthDataPoint[] = [
  { month: "Aug", value: 24000 },
  { month: "Sep", value: 26500 },
  { month: "Oct", value: 25800 },
  { month: "Nov", value: 28900 },
  { month: "Dec", value: 31200 },
  { month: "Jan", value: 34700 },
  { month: "Feb", value: 38420 },
];

export const CONTRIBUTION_DATA: ContributionDataPoint[] = [
  { month: "Aug", savings: 1200, investments: 800 },
  { month: "Sep", savings: 1500, investments: 1100 },
  { month: "Oct", savings: 900, investments: 1300 },
  { month: "Nov", savings: 1800, investments: 1500 },
  { month: "Dec", savings: 2100, investments: 1700 },
  { month: "Jan", savings: 1600, investments: 2200 },
  { month: "Feb", savings: 2400, investments: 1900 },
];

export const ALLOCATION_DATA: AllocationDataPoint[] = [
  { name: "Savings", value: 21220, color: "#10b981" },
  { name: "Investments", value: 20000, color: "#6366f1" },
];

// ─── Monthly Reports ──────────────────────────────────────────────────────────
export const MONTHLY_REPORTS: MonthlyReport[] = [
  { month: "Jan", income: 180000, expenses: 120000, savings: 60000, investments: 20000, netWorth: 280000 },
  { month: "Feb", income: 195000, expenses: 130000, savings: 65000, investments: 22000, netWorth: 295000 },
  { month: "Mar", income: 175000, expenses: 115000, savings: 60000, investments: 21000, netWorth: 310000 },
  { month: "Apr", income: 210000, expenses: 140000, savings: 70000, investments: 25000, netWorth: 325000 },
  { month: "May", income: 220000, expenses: 145000, savings: 75000, investments: 26000, netWorth: 345000 },
  { month: "Jun", income: 200000, expenses: 135000, savings: 65000, investments: 24000, netWorth: 360000 },
  { month: "Jul", income: 240000, expenses: 150000, savings: 90000, investments: 30000, netWorth: 385000 },
  { month: "Aug", income: 235000, expenses: 148000, savings: 87000, investments: 29000, netWorth: 405000 },
  { month: "Sep", income: 250000, expenses: 160000, savings: 90000, investments: 32000, netWorth: 428000 },
  { month: "Oct", income: 260000, expenses: 165000, savings: 95000, investments: 34000, netWorth: 452000 },
  { month: "Nov", income: 245000, expenses: 155000, savings: 90000, investments: 31000, netWorth: 468000 },
  { month: "Dec", income: 280000, expenses: 170000, savings: 110000, investments: 38000, netWorth: 490000 },
];

// ─── Pricing ──────────────────────────────────────────────────────────────────
export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    currency: "NGN",
    period: "month",
    description: "Everything you need to get started tracking your finances.",
    features: [
      "Unlimited savings entries",
      "Unlimited investments",
      "Full dashboard access",
      "Basic reports & charts",
      "Goals & milestone tracking",
    ],
    highlighted: false,
    badge: "Active for Everyone",
    cta: "Get Started Free",
  },
  {
    id: "pro",
    name: "Pro",
    price: 2500,
    currency: "NGN",
    period: "month",
    description: "Advanced tools for serious savers and investors.",
    features: [
      "Everything in Free",
      "Advanced analytics & forecasting",
      "CSV & PDF export",
      "Investment performance tracking",
      "Priority customer support",
    ],
    highlighted: true,
    badge: "Currently Free",
    cta: "Start Pro Free",
  },
  {
    id: "premium",
    name: "Premium",
    price: 5000,
    currency: "NGN",
    period: "month",
    description: "AI-powered insights for financial mastery.",
    features: [
      "Everything in Pro",
      "AI financial insights",
      "Portfolio risk analysis",
      "Investment comparison tools",
      "Early access to new features",
    ],
    highlighted: false,
    badge: "Currently Free",
    cta: "Start Premium Free",
  },
];
