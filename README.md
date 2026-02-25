# MyMoney 💰

A beautiful, full-featured personal finance tracker built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, and **Zustand**.

Track your savings, monitor investments, visualize your net worth growth, and crush your financial goals — all in one place.

---

## ✨ Features

- **📊 Dashboard** — Net worth overview, allocation chart, contribution history, recent activity
- **🐷 Savings** — Full CRUD for savings accounts across any platform (Piggyvest, Opay, First Bank, etc.)
- **📈 Investments** — Track stocks, ETFs, bonds, crypto, and more with performance metrics
- **🎯 Goals** — Set financial targets with visual progress tracking and deadline countdowns
- **📑 Reports** — Monthly income/expense/savings breakdown with charts
- **⚙️ Settings** — Profile, theme, notifications, and password management
- **🔐 Auth** — Login & register with Zod validation and react-hook-form
- **🌓 Dark/Light Mode** — Persisted via Zustand + localStorage
- **📱 Responsive** — Mobile-first with collapsible sidebar

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm / yarn / pnpm

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

---

## 🗂 Project Structure

```
mymoney/
├── app/
│   ├── (auth)/               # Login & Register pages
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/          # Protected app pages
│   │   ├── dashboard/page.tsx
│   │   ├── savings/page.tsx
│   │   ├── investments/page.tsx
│   │   ├── reports/page.tsx
│   │   ├── goals/page.tsx
│   │   └── settings/page.tsx
│   ├── (marketing)/          # Public landing & pricing
│   │   ├── page.tsx          # Home
│   │   └── pricing/page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── not-found.tsx
│
├── components/
│   ├── charts/               # Recharts wrappers
│   ├── dashboard/            # Welcome banner, activity feed
│   ├── goals/                # Goal card component
│   ├── layout/               # Sidebar, Topbar, DashboardLayout
│   ├── marketing/            # Navbar
│   └── ui/                   # Button, Input, Select, Badge, Modal, Card, etc.
│
├── lib/
│   ├── constants.ts          # App-wide constants
│   ├── mock-data.ts          # Seed data
│   ├── utils.ts              # Formatting, cn(), etc.
│   └── validations.ts        # Zod schemas
│
├── store/
│   └── app-store.ts          # Zustand store (savings, investments, goals, UI, user)
│
└── types/
    └── index.ts              # All TypeScript interfaces & types
```

---

## 🧰 Tech Stack

| Tool | Purpose |
|------|---------|
| [Next.js 14](https://nextjs.org) | App Router, SSR, routing |
| [TypeScript](https://www.typescriptlang.org) | Type safety |
| [Tailwind CSS](https://tailwindcss.com) | Styling |
| [Zustand](https://zustand-demo.pmnd.rs) | Global state with persistence |
| [Recharts](https://recharts.org) | Charts & data visualization |
| [React Hook Form](https://react-hook-form.com) | Form management |
| [Zod](https://zod.dev) | Schema validation |
| [date-fns](https://date-fns.org) | Date utilities |
| [Lucide React](https://lucide.dev) | Icons |
| [clsx + tailwind-merge](https://github.com/dcastil/tailwind-merge) | Dynamic classnames |

---

## 🎨 Design System

### Colors
- **Primary:** `#6366f1` (Indigo) — brand actions, active states
- **Accent:** `#10b981` (Emerald) — positive metrics, success
- **Warning:** `#f59e0b` (Amber)
- **Danger:** `#ef4444` (Red)

### Typography
- **Font:** [Syne](https://fonts.google.com/specimen/Syne) — display/headings
- **Weights:** 400 (body) → 800/900 (display)

### Dark Theme
- Background: `#09090b` (zinc-950)
- Surface: `#18181b` (zinc-900)
- Border: `rgba(255,255,255,0.08)`

---

## 📦 Key Architecture Decisions

1. **App Router with Route Groups** — `(marketing)`, `(auth)`, and `(dashboard)` share separate layouts without affecting URL structure.
2. **Zustand with persistence** — All user data (savings, investments, goals, preferences) is persisted to `localStorage` automatically.
3. **Mock data** — The app ships with realistic Nigerian financial data and works fully offline.
4. **CVA for variants** — `class-variance-authority` powers consistent, type-safe component variants.
5. **Zod + RHF** — Every form is validated at the schema level before submission.

---

## 📝 License

MIT — free to use, modify, and distribute.
