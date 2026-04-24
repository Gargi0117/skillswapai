import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Banknote, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/lib/store";
import { toast } from "sonner";
import PageHeader from "@/components/PageHeader";

const PACKS = [
  { coins: 80, price: 99 },
  { coins: 250, price: 199, popular: true },
  { coins: 500, price: 499 },
];

export const Route = createFileRoute("/_app/payments")({
  component: PaymentsPage,
});

function PaymentsPage() {
  const { buyCoins, convertCoins, coins } = useApp();
  const [withdrawAmount, setWithdrawAmount] = useState(100);
  const [upi, setUpi] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const buy = (pack: typeof PACKS[number]) => {
    buyCoins(pack.coins);
    toast.success(`Purchased ${pack.coins} coins for ₹${pack.price}`);
  };

  const withdraw = (e: React.FormEvent) => {
    e.preventDefault();
    if (!upi) return toast.error("Please add a UPI / bank account");
    if (convertCoins(withdrawAmount)) {
      setStatus(`Withdrawal of ₹${(withdrawAmount * 0.05).toFixed(2)} initiated to ${upi}`);
      toast.success("Withdrawal initiated!");
    } else toast.error("Not enough coins.");
  };

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Payments & Withdrawals"
        subtitle="Top up your balance or cash out your coins."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        
        {/* BUY COINS */}
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            <h2 className="font-display text-xl font-bold">Buy coins</h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {PACKS.map((p) => (
              <motion.div key={p.coins} whileHover={{ y: -4 }}>
                <Card
                  className={`relative cursor-pointer p-4 text-center transition-shadow hover:shadow-elegant ${
                    p.popular ? "border-primary shadow-glow" : ""
                  }`}
                >
                  {p.popular && (
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-gradient-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
                      POPULAR
                    </div>
                  )}

                  <div className="font-display text-2xl font-extrabold">
                    {p.coins}
                  </div>
                  <div className="text-xs text-muted-foreground">coins</div>

                  <div className="mt-2 text-sm font-semibold">
                    ₹{p.price}
                  </div>

                  <Button
                    size="sm"
                    onClick={() => buy(p)}
                    className="mt-3 w-full bg-gradient-primary text-primary-foreground"
                  >
                    Buy
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* WITHDRAW */}
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <Banknote className="h-5 w-5 text-success" />
            <h2 className="font-display text-xl font-bold">
              Withdraw to bank / UPI
            </h2>
          </div>

          <p className="mb-4 text-sm text-muted-foreground">
            Available:{" "}
            <span className="font-bold text-foreground">
              {coins} coins
            </span>{" "}
            (≈ ₹{(coins * 0.05).toFixed(2)})
          </p>

          <form onSubmit={withdraw} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="upi">UPI / Bank account</Label>
              <Input
                id="upi"
                placeholder="example@upi"
                value={upi}
                onChange={(e) => setUpi(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="amt">
                Amount ({withdrawAmount} coins ≈ ₹
                {(withdrawAmount * 0.05).toFixed(2)})
              </Label>

              <input
                id="amt"
                type="range"
                min={50}
                max={Math.max(50, coins)}
                step={10}
                value={withdrawAmount}
                onChange={(e) =>
                  setWithdrawAmount(Number(e.target.value))
                }
                className="w-full accent-[oklch(var(--primary))]"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-success text-success-foreground"
            >
              <Banknote className="mr-1 h-4 w-4" /> Withdraw
            </Button>
          </form>

          {status && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex items-start gap-2 rounded-xl border border-success/30 bg-success/10 p-3 text-sm"
            >
              <Check className="mt-0.5 h-4 w-4 text-success" />
              <span>{status}</span>
            </motion.div>
          )}
        </Card>
      </div>
    </div>
  );
}