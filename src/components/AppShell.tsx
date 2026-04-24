import { Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { useApp } from "@/lib/store";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  LayoutDashboard,
  GraduationCap,
  Sparkles,
  Users,
  MessageSquare,
  Bot,
  Wallet,
  CreditCard,
  User,
  LogOut,
  Sun,
  Moon,
  Coins,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/learn", label: "Learn", icon: GraduationCap },
  { to: "/teach", label: "Teach & Earn", icon: Sparkles },
  { to: "/match", label: "Random Match", icon: Users },
  { to: "/chat", label: "Chat", icon: MessageSquare },
  { to: "/ai", label: "AI Chatbot", icon: Bot },
  { to: "/wallet", label: "Wallet", icon: Wallet },
  { to: "/payments", label: "Payments", icon: CreditCard },
  { to: "/video", label: "Video Call", icon: Users },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export default function AppShell() {
  const { coins, theme, toggleTheme, setTheme } = useApp();
  const nav = useNavigate();
  const loc = useLocation();
  const [authUser, setAuthUser] = useState<{ email: string; name: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    setTheme(theme);
  }, []); // eslint-disable-line

  // Check real Supabase session
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const session = data.session
      if (!session) {
        nav({ to: "/auth" })
      } else {
        setAuthUser({
          email: session.user.email ?? "",
          name: session.user.user_metadata?.full_name ?? session.user.email ?? "User",
        })
      }
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        nav({ to: "/auth" })
      } else {
        setAuthUser({
          email: session.user.email ?? "",
          name: session.user.user_metadata?.full_name ?? session.user.email ?? "User",
        })
      }
    })

    return () => subscription.unsubscribe()
  }, [nav])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    nav({ to: "/auth" })
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground text-sm">Loading...</div>
      </div>
    )
  }

  if (!authUser) return null

  return (
    <div className="flex min-h-screen w-full">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r bg-sidebar p-4 md:flex">
        <Link to="/dashboard" className="mb-6 flex items-center gap-2 px-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="font-display text-lg font-extrabold tracking-tight">SkillSwap<span className="text-gradient-primary">AI</span></div>
        </Link>

        <nav className="flex flex-1 flex-col gap-1">
          {NAV.map((n) => {
            const active = loc.pathname.startsWith(n.to);
            const Icon = n.icon;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  active
                    ? "bg-gradient-primary text-primary-foreground shadow-glow"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                }`}
              >
                <Icon className="h-4 w-4" />
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-4 rounded-2xl border bg-card p-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarFallback>{authUser.name[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold">{authUser.name}</div>
              <div className="truncate text-xs text-muted-foreground">{authUser.email}</div>
            </div>
            <Button size="icon" variant="ghost" onClick={handleLogout} aria-label="Log out">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      <div className="flex min-h-screen w-full flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b bg-background/70 px-4 backdrop-blur md:px-8">
          <Link to="/dashboard" className="md:hidden flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-primary text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-display font-extrabold">SkillSwap<span className="text-gradient-primary">AI</span></span>
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-2 rounded-full bg-gradient-coin px-3 py-1.5 text-sm font-bold text-coin-foreground shadow-coin"
            >
              <Coins className="h-4 w-4" />
              {coins.toLocaleString()}
            </motion.div>
            <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 md:px-8 md:py-10">
          <Outlet />
        </main>

        <nav className="sticky bottom-0 z-30 grid grid-cols-5 border-t bg-background/90 backdrop-blur md:hidden">
          {NAV.slice(0, 5).map((n) => {
            const active = loc.pathname.startsWith(n.to);
            const Icon = n.icon;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex flex-col items-center gap-1 py-2 text-[10px] font-medium ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {n.label.split(" ")[0]}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}