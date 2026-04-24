import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Video, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { TEACHERS } from "@/lib/teachers";
import PageHeader from "@/components/PageHeader";

export const Route = createFileRoute("/_app/match")({
  component: MatchPage,
});

function MatchPage() {
  const [searching, setSearching] = useState(true);
  const [match, setMatch] = useState<typeof TEACHERS[number] | null>(null);
  const nav = useNavigate();

  const start = () => {
    setSearching(true);
    setMatch(null);
    setTimeout(() => {
      setMatch(TEACHERS[Math.floor(Math.random() * TEACHERS.length)]);
      setSearching(false);
    }, 2400);
  };

  useEffect(() => { start(); }, []);

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Random Match" subtitle="Practice with a real partner. New face, every time." />

      <Card className="relative overflow-hidden p-8 md:p-12">
        <AnimatePresence mode="wait">
          {searching ? (
            <motion.div
              key="searching"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center text-center"
            >
              <div className="relative grid h-32 w-32 place-items-center">
                <div className="absolute inset-0 animate-pulse-glow rounded-full bg-gradient-primary opacity-80" />
                <div className="absolute inset-3 animate-pulse-glow rounded-full bg-gradient-primary opacity-60" style={{ animationDelay: "0.4s" }} />
                <div className="absolute inset-6 animate-pulse-glow rounded-full bg-gradient-primary opacity-40" style={{ animationDelay: "0.8s" }} />
                <div className="relative grid h-16 w-16 place-items-center rounded-full bg-gradient-primary text-primary-foreground shadow-glow">
                  <Users className="h-7 w-7" />
                </div>
              </div>
              <h2 className="mt-8 font-display text-2xl font-extrabold">Searching for partner…</h2>
              <p className="mt-1 text-sm text-muted-foreground">We're finding someone fun to chat with.</p>
            </motion.div>
          ) : match ? (
            <motion.div
              key="match"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center text-center"
            >
              <Avatar className="h-24 w-24 ring-4 ring-primary/30">
                <AvatarImage src={match.avatar} alt={match.name} />
                <AvatarFallback>{match.name[0]}</AvatarFallback>
              </Avatar>
              <h2 className="mt-4 font-display text-3xl font-extrabold">{match.name}</h2>
              <Badge variant="secondary" className="mt-2">{match.skill} · ★ {match.rating}</Badge>
              <p className="mt-3 max-w-sm text-muted-foreground">{match.tagline}</p>

              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button onClick={() => nav({ to: "/chat" })} className="bg-gradient-primary text-primary-foreground shadow-glow">
                  <MessageSquare className="mr-1 h-4 w-4" /> Chat
                </Button>
                <Button onClick={() => nav({ to: "/video" })} variant="secondary">
                  <Video className="mr-1 h-4 w-4" /> Video Call
                </Button>
                <Button onClick={start} variant="ghost">Skip</Button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </Card>
    </div>
  );
}
