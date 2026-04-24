import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Suspense, lazy } from "react";
import { GraduationCap, Sparkles, MessageCircle, Bot, TrendingUp, Coins, ArrowUpRight } from "lucide-react";
import { useApp } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

const Coin3D = lazy(() => import("@/components/three/Coin"));

export const Route = createFileRoute("/_app/dashboard")({
  component: Dashboard,
});

const ACTIONS = [
  { to: "/learn", title: "Start Learning", desc: "Find a teacher you vibe with.", icon: GraduationCap, gradient: "from-violet-500/20 to-fuchsia-500/10" },
  { to: "/teach", title: "Start Teaching", desc: "Earn coins for your skills.", icon: Sparkles, gradient: "from-emerald-500/20 to-teal-500/10" },
  { to: "/match", title: "Practice English", desc: "Random chat or video partner.", icon: MessageCircle, gradient: "from-sky-500/20 to-cyan-500/10" },
  { to: "/ai", title: "AI Chatbot", desc: "Grammar fixes & smart suggestions.", icon: Bot, gradient: "from-amber-500/20 to-orange-500/10" },
] as const;

function Dashboard() {
  const { user, coins, learningProgress, transactions } = useApp();
  const earnings = transactions.filter((t) => t.type === "earn").reduce((a, b) => a + b.amount, 0);

  return (
    <div className="mx-auto max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-wrap items-end justify-between gap-4"
      >
        <div>
          <p className="text-sm text-muted-foreground">Welcome back,</p>
          <h1 className="font-display text-3xl font-extrabold md:text-4xl">{user.name.split(" ")[0]} 👋</h1>
        </div>
      </motion.div>

      {/* Coin highlight */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative mb-8 overflow-hidden rounded-3xl border bg-gradient-primary p-6 text-primary-foreground shadow-glow md:p-8"
      >
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-sm font-medium opacity-90">Coin balance</div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-display text-5xl font-extrabold tracking-tight md:text-6xl">{coins.toLocaleString()}</span>
              <span className="text-lg font-semibold opacity-80">coins</span>
            </div>
            <div className="mt-2 text-sm opacity-90">≈ ${(coins * 0.05).toFixed(2)} USD</div>
          </div>
          <div className="flex items-center gap-3">
            <Suspense fallback={<div className="h-24 w-24 animate-pulse rounded-full bg-white/10" />}>
              <Coin3D />
            </Suspense>
            <Button asChild variant="secondary" className="shadow-md">
              <Link to="/wallet">Open wallet <ArrowUpRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      </motion.div>

      {/* Action cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ACTIONS.map((a, i) => (
          <motion.div
            key={a.to}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.05 }}
          >
            <Link to={a.to}>
              <Card className={`group relative overflow-hidden border bg-gradient-to-br ${a.gradient} p-5 transition-all hover:-translate-y-1 hover:shadow-elegant`}>
                <a.icon className="mb-3 h-6 w-6 text-primary" />
                <div className="font-display text-base font-bold">{a.title}</div>
                <div className="mt-1 text-xs text-muted-foreground">{a.desc}</div>
                <ArrowUpRight className="absolute right-4 top-4 h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Progress + Earnings */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Learning progress</div>
              <div className="font-display text-2xl font-bold">{learningProgress}% to next milestone</div>
            </div>
            <TrendingUp className="h-5 w-5 text-success" />
          </div>
          <Progress value={learningProgress} className="h-3" />
          <div className="mt-3 grid grid-cols-3 gap-3 text-center text-xs">
            {["Spanish", "Guitar", "Public Speaking"].map((s) => (
              <div key={s} className="rounded-xl border bg-card/50 p-3">
                <div className="font-semibold">{s}</div>
                <div className="mt-1 text-muted-foreground">{Math.floor(Math.random() * 60 + 20)}%</div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-1 flex items-center gap-2 text-sm text-muted-foreground">
            <Coins className="h-4 w-4 text-coin" /> Earnings summary
          </div>
          <div className="font-display text-3xl font-extrabold">{earnings} <span className="text-lg font-semibold text-muted-foreground">coins</span></div>
          <div className="mt-1 text-sm text-muted-foreground">≈ ${(earnings * 0.05).toFixed(2)} this month</div>
          <Button asChild variant="outline" className="mt-4 w-full">
            <Link to="/teach">Teach more →</Link>
          </Button>
        </Card>
      </div>
    </div>
  );
}
