import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowDownLeft, ArrowUpRight, ArrowRightLeft, CreditCard, Coins, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store";
import { useNavigate } from "@tanstack/react-router";
import PageHeader from "@/components/PageHeader";

export const Route = createFileRoute("/_app/wallet")({
  component: WalletPage,
});

const ICONS = {
  earn: { Icon: ArrowDownLeft, color: "text-success" },
  spend: { Icon: ArrowUpRight, color: "text-destructive" },
  convert: { Icon: ArrowRightLeft, color: "text-primary" },
  buy: { Icon: CreditCard, color: "text-warning" },
} as const;

function WalletPage() {
  const { coins, transactions } = useApp();
  const nav = useNavigate();

  const totals = transactions.reduce(
    (acc, t) => {
      acc[t.type] = (acc[t.type] || 0) + t.amount;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Wallet" subtitle="Track every coin in and out." />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 overflow-hidden rounded-3xl border bg-gradient-primary p-6 text-primary-foreground shadow-glow md:p-8"
      >
        <div className="text-sm opacity-90">Available balance</div>
        <div className="mt-1 font-display text-5xl font-extrabold md:text-6xl">{coins.toLocaleString()} coins</div>
        <div className="mt-1 opacity-90">≈ ${(coins * 0.05).toFixed(2)} USD</div>
        <div className="mt-5 flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => nav({ to: "/payments" })}>
            <CreditCard className="mr-1 h-4 w-4" /> Buy coins
          </Button>
          <Button variant="secondary" onClick={() => nav({ to: "/teach" })}>
            <Sparkles className="mr-1 h-4 w-4" /> Earn more
          </Button>
        </div>
      </motion.div>

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        {[
          { label: "Earned", value: totals.earn || 0, color: "from-emerald-500/15 to-teal-500/5", icon: ArrowDownLeft },
          { label: "Spent", value: totals.spend || 0, color: "from-rose-500/15 to-orange-500/5", icon: ArrowUpRight },
          { label: "Converted", value: totals.convert || 0, color: "from-violet-500/15 to-fuchsia-500/5", icon: ArrowRightLeft },
        ].map((s) => (
          <Card key={s.label} className={`bg-gradient-to-br ${s.color} p-5`}>
            <s.icon className="mb-2 h-4 w-4 text-muted-foreground" />
            <div className="text-xs text-muted-foreground">{s.label}</div>
            <div className="mt-0.5 font-display text-2xl font-bold">{s.value} <span className="text-xs font-normal text-muted-foreground">coins</span></div>
          </Card>
        ))}
      </div>

      <Card className="p-0">
        <div className="border-b px-5 py-3 font-semibold">Transaction history</div>
        <div className="divide-y">
          {transactions.length === 0 && (
            <div className="px-5 py-8 text-center text-sm text-muted-foreground">No transactions yet.</div>
          )}
          {transactions.map((t) => {
            const { Icon, color } = ICONS[t.type];
            return (
              <div key={t.id} className="flex items-center gap-3 px-5 py-3">
                <div className={`grid h-9 w-9 place-items-center rounded-full bg-muted ${color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="truncate text-sm font-medium">{t.description}</div>
                  <div className="text-xs text-muted-foreground">{t.date}</div>
                </div>
                <div className={`flex items-center gap-1 text-sm font-bold ${t.type === "spend" || t.type === "convert" ? "text-destructive" : "text-success"}`}>
                  {t.type === "spend" || t.type === "convert" ? "−" : "+"}
                  <Coins className="h-3.5 w-3.5" /> {t.amount}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
