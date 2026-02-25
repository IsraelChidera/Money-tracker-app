export const APP_NAME = "MyMoney";
export const APP_DESCRIPTION =
  "See your entire financial life in one place. Track savings, monitor investments, visualize growth, and hit your financial goals.";

export const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", href: "/dashboard", icon: "Home" },
  { id: "savings", label: "Savings", href: "/savings", icon: "PiggyBank" },
  { id: "investments", label: "Investments", href: "/investments", icon: "TrendingUp" },
  { id: "reports", label: "Reports", href: "/reports", icon: "FileText" },
  { id: "goals", label: "Goals", href: "/goals", icon: "Target" },
  { id: "settings", label: "Settings", href: "/settings", icon: "Settings" },
] as const;

export const SAVINGS_CATEGORIES = [
  "Emergency Fund",
  "Travel",
  "House",
  "Car",
  "Education",
  "Business",
  "Retirement",
  "General",
] as const;

export const ASSET_CLASSES = [
  "Stocks",
  "ETF",
  "Bonds",
  "Real Estate",
  "Crypto",
  "Fixed Income",
  "Mutual Fund",
  "Other",
] as const;

export const CURRENCIES = [
  { label: "Nigerian Naira (₦)", value: "NGN" },
  { label: "US Dollar ($)", value: "USD" },
  { label: "British Pound (£)", value: "GBP" },
  { label: "Euro (€)", value: "EUR" },
] as const;

export const GOAL_PRESET_COLORS = [
  "#6366f1",
  "#10b981",
  "#f59e0b",
  "#ec4899",
  "#06b6d4",
  "#8b5cf6",
  "#f97316",
  "#14b8a6",
];

export const CHART_COLORS = {
  primary: "#6366f1",
  accent: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  pink: "#ec4899",
  cyan: "#06b6d4",
};
