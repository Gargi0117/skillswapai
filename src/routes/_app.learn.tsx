import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Coins, Search } from "lucide-react";
import { TEACHERS, SKILLS } from "@/lib/teachers";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useApp } from "@/lib/store";
import { toast } from "sonner";
import PageHeader from "@/components/PageHeader";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/learn")({
  component: LearnPage,
});

function LearnPage() {
  const [skill, setSkill] = useState("All");
  const [minRating, setMinRating] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100);
  const [q, setQ] = useState("");
  const [bookedTeacher, setBookedTeacher] = useState<string | null>(null);
  const { spendCoins, bumpProgress } = useApp();
  const nav = useNavigate();

  const filtered = TEACHERS.filter(
    (t) =>
      (skill === "All" || t.skill === skill) &&
      t.rating >= minRating &&
      t.price <= maxPrice &&
      (q === "" || t.name.toLowerCase().includes(q.toLowerCase()) || t.skill.toLowerCase().includes(q.toLowerCase())),
  );

  const book = (price: number, name: string, id: string) => {
    if (spendCoins(price, `Booked session with ${name}`)) {
      bumpProgress(8);
      toast.success(`Booked with ${name}! −${price} coins`);
      setBookedTeacher(id);
    } else {
      toast.error("Not enough coins. Top up your wallet.");
    }
  };

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Learn from real humans" subtitle="Pick a teacher, book a session, level up." />

      <Card className="mb-6 grid gap-4 p-4 md:grid-cols-4 md:p-5">
        <div className="relative md:col-span-2">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search teachers or skills" className="pl-9" />
        </div>
        <Select value={skill} onValueChange={setSkill}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {SKILLS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <div>
          <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
            <span>Min rating</span><span className="font-semibold text-foreground">{minRating.toFixed(1)}★</span>
          </div>
          <Slider value={[minRating]} onValueChange={(v) => setMinRating(v[0])} min={0} max={5} step={0.1} />
        </div>
        <div className="md:col-span-4">
          <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
            <span>Max price</span><span className="font-semibold text-foreground">{maxPrice} coins</span>
          </div>
          <Slider value={[maxPrice]} onValueChange={(v) => setMaxPrice(v[0])} min={10} max={100} step={5} />
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <Card className="group flex h-full flex-col p-5 transition-all hover:-translate-y-1 hover:shadow-elegant">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                    <AvatarImage src={t.avatar} alt={t.name} />
                    <AvatarFallback>{t.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{t.name}</div>
                    <Badge variant="secondary" className="mt-0.5">{t.skill}</Badge>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm font-bold text-amber-500">
                  <Star className="h-4 w-4 fill-current" />{t.rating}
                </div>
              </div>
              <p className="mt-3 flex-1 text-sm text-muted-foreground">{t.tagline}</p>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-1 font-bold text-coin-foreground">
                  <Coins className="h-4 w-4 text-coin" /> {t.price}
                  <span className="text-xs font-normal text-muted-foreground">/session</span>
                </div>
                {bookedTeacher === t.id ? (
                  <Button
                    size="sm"
                    className="bg-green-500 hover:bg-green-600 text-white"
                    onClick={() => nav({ to: "/video", search: { room: `session-${t.id}`, role: "receiver" } })}
                  >
                    Join Call 🎥
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => book(t.price, t.name, t.id)}
                    className="bg-gradient-primary text-primary-foreground"
                  >
                    Book
                  </Button>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <Card className="col-span-full p-10 text-center text-muted-foreground">No teachers match your filters.</Card>
        )}
      </div>
    </div>
  );
}