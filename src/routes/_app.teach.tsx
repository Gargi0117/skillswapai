import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Coins, Sparkles, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useApp } from "@/lib/store";
import { toast } from "sonner";
import PageHeader from "@/components/PageHeader";

export const Route = createFileRoute("/_app/teach")({
  component: TeachPage,
});

function TeachPage() {
  const { sessions, transactions, addSession, addCoins, convertCoins } = useApp();
  const [skill, setSkill] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(40);
  const [convertAmount, setConvertAmount] = useState(50);

  const earned = transactions.filter((t) => t.type === "earn").reduce((a, b) => a + b.amount, 0);

  const create = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skill || !description) return toast.error("Please fill all fields");
    addSession({ skill, description, price });
    addCoins(price, `Taught: ${skill}`);
    setSkill(""); setDescription("");
    toast.success(`Session created — earned ${price} coins!`);
  };

  const convert = () => {
    if (convertCoins(convertAmount)) {
      toast.success(`Converted ${convertAmount} coins to $${(convertAmount * 0.05).toFixed(2)}`);
    } else toast.error("Not enough coins.");
  };

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Teach & Earn" subtitle="Share what you know. Get paid in coins. Cash out anytime." />

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="p-6 lg:col-span-3">
          <h2 className="font-display text-xl font-bold">Create a session</h2>
          <p className="mt-1 text-sm text-muted-foreground">Set a skill, describe it, pick your price.</p>
          <form onSubmit={create} className="mt-5 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="skill">Skill</Label>
              <Input id="skill" value={skill} onChange={(e) => setSkill(e.target.value)} placeholder="e.g., Conversational Spanish" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="desc">Description</Label>
              <Textarea id="desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What will learners walk away with?" rows={4} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="price">Price ({price} coins ≈ ${(price * 0.05).toFixed(2)})</Label>
              <input
                id="price"
                type="range"
                min={10}
                max={100}
                step={5}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full accent-[oklch(var(--primary))]"
              />
            </div>
            <Button type="submit" className="w-full bg-gradient-primary text-primary-foreground shadow-glow">
              <Sparkles className="mr-1 h-4 w-4" /> Publish session
            </Button>
          </form>
        </Card>

        <div className="space-y-4 lg:col-span-2">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="overflow-hidden border-0 bg-gradient-coin p-6 text-coin-foreground shadow-coin">
              <div className="text-sm font-semibold opacity-80">Total coins earned</div>
              <div className="mt-1 font-display text-5xl font-extrabold">{earned}</div>
              <div className="mt-1 text-sm opacity-80">≈ ${(earned * 0.05).toFixed(2)} USD</div>
            </Card>
          </motion.div>

          <Card className="p-5">
            <div className="mb-3 text-sm font-semibold">Convert to money</div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={10}
                value={convertAmount}
                onChange={(e) => setConvertAmount(Math.max(10, Number(e.target.value) || 0))}
                className="h-10 w-24 rounded-md border bg-background px-3 text-sm"
              />
              <span className="text-sm text-muted-foreground">coins</span>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <span className="font-bold">${(convertAmount * 0.05).toFixed(2)}</span>
            </div>
            <Button onClick={convert} className="mt-3 w-full" variant="outline">
              <Coins className="mr-1 h-4 w-4" /> Convert coins
            </Button>
          </Card>
        </div>
      </div>

      {sessions.length > 0 && (
        <div className="mt-8">
          <h3 className="mb-3 font-display text-lg font-bold">Your sessions</h3>
          <div className="grid gap-3 md:grid-cols-2">
            {sessions.map((s) => (
              <Card key={s.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">{s.skill}</div>
                  <div className="flex items-center gap-1 text-sm font-bold text-coin-foreground">
                    <Coins className="h-3.5 w-3.5 text-coin" /> {s.price}
                  </div>
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{s.description}</p>
                <div className="mt-2 text-xs text-muted-foreground">{s.date}</div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
