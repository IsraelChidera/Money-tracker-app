import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: {
    default: "MyMoney — Your Financial Life in One Place",
    template: "%s | MyMoney",
  },
  description:
    "Track savings, monitor investments, visualize growth, and hit your financial goals, all in one beautiful dashboard.",
  keywords: ["personal finance", "savings tracker", "investment tracker", "budgeting", "financial goals"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
