import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Sparkles,
  GraduationCap,
  Coins,
  Bot,
  ArrowRight,
  Globe2,
  TrendingUp,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";

export const Route = createFileRoute("/")({
  component: Landing,
});

// ── Animated particle background ──────────────────────────────────────────
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let raf: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.8 + 0.4,
      dx: (Math.random() - 0.5) * 0.4,
      dy: -Math.random() * 0.6 - 0.2,
      alpha: Math.random() * 0.6 + 0.1,
      color: ["#7c3aed", "#db2777", "#00d4ff", "#a78bfa"][Math.floor(Math.random() * 4)],
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.floor(p.alpha * 255).toString(16).padStart(2, "0");
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ opacity: 0.8 }}
    />
  );
}

// ── Hero floating cards ────────────────────────────────────────────────────
function HeroVisual() {
  return (
    <div className="relative h-[480px] md:h-[540px] flex items-center justify-center">
      {/* Glow ring */}
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.25, 0.4, 0.25] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-72 h-72 rounded-full"
        style={{ background: "radial-gradient(rgba(124,58,237,.4),transparent 70%)" }}
      />

      {/* Main profile card */}
      <motion.div
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute z-10 w-64 rounded-2xl border backdrop-blur-xl p-5 shadow-2xl"
        style={{
          background: "linear-gradient(135deg,rgba(124,58,237,.35),rgba(219,39,119,.2))",
          borderColor: "rgba(124,58,237,.4)",
        }}
      >
<div className="flex items-center gap-3 mb-3">
  <div
    className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden"
    style={{ background: "linear-gradient(135deg,#7c3aed,#db2777)" }}
  >
    <img
      src="https://media.licdn.com/dms/image/v2/D5603AQG7Iheipy2BMQ/profile-displayphoto-crop_800_800/B56ZgtH_yBHkAI-/0/1753103729975?e=1778716800&v=beta&t=rPPDwMRyVZRDWoALaq0p_AI68wrIwnbHrLkbvOXqPhk"
      alt="avatar"
      className="w-full h-full object-cover"
    />
  </div>
          <div>
            <div className="text-sm font-semibold text-white">Anupam Yadav</div>
            <div className="text-xs text-purple-300 flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> 4.9 · Top Teacher
            </div>
          </div>
        </div>
        <div className="text-xs text-white/50 mb-2">teaches</div>
        <div className="flex flex-wrap gap-2">
          {["React", "Node.js", "UI/UX"].map((t) => (
            <span
              key={t}
              className="text-xs px-2 py-1 rounded-md"
              style={{
                background: "rgba(124,58,237,.25)",
                border: "1px solid rgba(124,58,237,.4)",
                color: "#c4b5fd",
              }}
            >
              {t}
            </span>
          ))}
        </div>
        <div className="mt-3 flex justify-between text-xs">
          <span className="text-white/40">Next slot</span>
          <span className="text-emerald-400">Today 7 PM</span>
        </div>
      </motion.div>

      {/* Earnings card — top right */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, delay: 1.2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-6 right-2 w-48 rounded-2xl border backdrop-blur-xl p-4 shadow-xl"
        style={{ background: "rgba(255,255,255,.06)", borderColor: "rgba(255,255,255,.1)" }}
      >
        <div className="text-xs text-white/50 mb-1">This Month</div>
        <div
          className="text-2xl font-extrabold"
          style={{
            background: "linear-gradient(135deg,#a78bfa,#f472b6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          ₹12,450
        </div>
        <div className="text-xs text-emerald-400 mb-2">↑ 18% from last month</div>
        <div className="flex items-end gap-1 h-8">
          {[40, 60, 80, 55, 90].map((h, i) => (
            <motion.div
              key={i}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 0.8 + i * 0.1, duration: 0.4 }}
              style={{
                height: `${h}%`,
                width: 14,
                borderRadius: "3px 3px 0 0",
                background:
                  i === 4
                    ? "linear-gradient(to top,#7c3aed,#f472b6)"
                    : "rgba(124,58,237,.4)",
                transformOrigin: "bottom",
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* AI card — bottom left */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, delay: 0.7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 left-0 w-56 rounded-2xl border backdrop-blur-xl p-4 shadow-xl"
        style={{ background: "rgba(255,255,255,.06)", borderColor: "rgba(255,255,255,.1)" }}
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="flex gap-1">
            {[0, 0.15, 0.3].map((d, i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 0.8, delay: d, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-purple-400"
              />
            ))}
          </div>
          <span className="text-xs text-white/50">AI Tutor is typing</span>
        </div>
        <div
          className="text-xs leading-5 rounded-lg p-2 mb-2"
          style={{ background: "rgba(124,58,237,.2)", color: "rgba(255,255,255,.8)" }}
        >
          <strong className="text-purple-300">useState</strong> is a hook that adds state to
          functional components.
        </div>
        <div className="text-right text-xs text-white/50">What's useState?</div>
      </motion.div>

      {/* Badge card — left mid */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, delay: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 -left-2 w-44 rounded-2xl border backdrop-blur-xl p-3 shadow-xl"
        style={{ background: "rgba(255,255,255,.06)", borderColor: "rgba(255,255,255,.1)" }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
            style={{ background: "linear-gradient(135deg,#f59e0b,#f97316)" }}
          >
            🏆
          </div>
          <div>
            <div className="text-xs font-semibold text-white">Top Earner</div>
            <div className="text-xs text-white/40">This week</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────
function Landing() {
  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{
        background: "#08091a",
        color: "#f0f2ff",
      }}
    >
      {/* Animated mesh blobs */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ y: [0, -30, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-[600px] h-[600px] rounded-full -top-48 -left-36"
          style={{
            background: "radial-gradient(#6c3fff,transparent 70%)",
            opacity: 0.35,
            filter: "blur(80px)",
          }}
        />
        <motion.div
          animate={{ y: [0, -25, 0], scale: [1, 1.04, 1] }}
          transition={{ duration: 8, delay: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-[500px] h-[500px] rounded-full top-12 -right-24"
          style={{
            background: "radial-gradient(#ff3fa4,transparent 70%)",
            opacity: 0.3,
            filter: "blur(80px)",
          }}
        />
        <motion.div
          animate={{ y: [0, -20, 0], scale: [1, 1.06, 1] }}
          transition={{ duration: 8, delay: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-[400px] h-[400px] rounded-full -bottom-20 left-[40%]"
          style={{
            background: "radial-gradient(#00d4ff,transparent 70%)",
            opacity: 0.25,
            filter: "blur(80px)",
          }}
        />
        {/* Animated grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <ParticleCanvas />

      {/* ── NAV ── */}
      <header
        className="relative z-10 flex items-center justify-between px-6 md:px-10 py-5 border-b backdrop-blur-xl"
        style={{ borderColor: "rgba(255,255,255,.07)", background: "rgba(8,9,26,.6)" }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg,#7c3aed,#db2777)",
              boxShadow: "0 0 20px rgba(124,58,237,.5)",
            }}
          >
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-lg text-white">
            SkillSwap
            <span
              style={{
                background: "linear-gradient(135deg,#a78bfa,#f472b6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              AI
            </span>
          </span>
        </div>
        <nav className="flex items-center gap-4">
          <Link to="/auth" className="text-sm text-white/60 hover:text-white transition-colors">
            Log in
          </Link>
          <Button
            asChild
            className="text-white font-semibold"
            style={{
              background: "linear-gradient(135deg,#7c3aed,#db2777)",
              boxShadow: "0 0 20px rgba(124,58,237,.4)",
            }}
          >
            <Link to="/auth">Get started</Link>
          </Button>
        </nav>
      </header>

      {/* ── HERO ── */}
      <section className="relative z-1 mx-auto max-w-7xl px-6 md:px-10 pt-12 pb-20 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium"
            style={{
              background: "rgba(124,58,237,.15)",
              border: "1px solid rgba(124,58,237,.3)",
              color: "#a78bfa",
            }}
          >
            <motion.div
              animate={{ opacity: [1, 0.3, 1], scale: [1, 1.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-purple-500"
            />
            A global peer-to-peer learning network
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="font-extrabold leading-[1.05] tracking-tight text-white"
            style={{ fontSize: "clamp(40px,5vw,64px)", letterSpacing: "-1.5px" }}
          >
            Learn, Teach,{" "}
            <span
              style={{
                background: "linear-gradient(135deg,#a78bfa 0%,#f472b6 50%,#fb923c 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Earn
            </span>
            ,<br />
            and Grow.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mt-5 text-lg max-w-md"
            style={{ color: "rgba(255,255,255,.55)", lineHeight: 1.7 }}
          >
            Trade skills with people across the world, earn coins for what you teach, and convert
            them into real money. Practice with AI anytime.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Button
              asChild
              size="lg"
              className="text-white font-semibold"
              style={{
                background: "linear-gradient(135deg,#7c3aed,#db2777)",
                boxShadow: "0 0 30px rgba(124,58,237,.5)",
              }}
            >
              <Link to="/auth">
                Start free <ArrowRight className="ml-1 w-4 h-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-white"
              style={{ borderColor: "rgba(255,255,255,.2)", background: "transparent" }}
            >
              <Link to="/auth">Browse teachers</Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="mt-10 grid grid-cols-3 gap-3 max-w-sm"
          >
            {[
              { icon: GraduationCap, val: "12k+", lbl: "Skills listed" },
              { icon: Coins, val: "$240k", lbl: "Earned by users" },
              { icon: Bot, val: "24/7", lbl: "AI tutor access" },
            ].map((s) => (
              <motion.div
                key={s.val}
                whileHover={{ y: -3, scale: 1.04 }}
                className="rounded-2xl p-3 text-center backdrop-blur"
                style={{
                  background: "rgba(255,255,255,.05)",
                  border: "1px solid rgba(255,255,255,.08)",
                }}
              >
                <s.icon className="mx-auto mb-1 w-4 h-4" style={{ color: "#a78bfa" }} />
                <div className="text-sm font-bold text-white">{s.val}</div>
                <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,.4)" }}>
                  {s.lbl}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <HeroVisual />
        </motion.div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="relative z-1 mx-auto max-w-7xl px-6 md:px-10 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2
            className="font-extrabold text-white"
            style={{ fontSize: "clamp(28px,4vw,42px)", letterSpacing: "-.5px" }}
          >
            How SkillSwapAI Works
          </h2>
          <p className="mt-3 mx-auto max-w-lg text-base" style={{ color: "rgba(255,255,255,.5)" }}>
            Learn new skills, teach what you know, and earn rewards — all in one platform.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {[
            {
              icon: GraduationCap,
              title: "Learn Skills",
              desc: "Connect with people worldwide and learn any skill through live 1-on-1 sessions or AI-guided practice.",
              num: "01",
            },
            {
              icon: Coins,
              title: "Teach & Earn",
              desc: "Share your expertise, earn coins for every session, and grow a loyal student following.",
              num: "02",
            },
            {
              icon: TrendingUp,
              title: "Convert to Cash",
              desc: "Turn your earned coins into real money anytime. Build a sustainable income stream doing what you love.",
              num: "03",
            },
          ].map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ y: -6 }}
              className="relative rounded-3xl p-7 overflow-hidden transition-all"
              style={{
                background: "rgba(255,255,255,.04)",
                border: "1px solid rgba(255,255,255,.07)",
              }}
            >
              <motion.div
                whileHover={{ opacity: 1 }}
                initial={{ opacity: 0 }}
                className="absolute inset-0 rounded-3xl"
                style={{
                  background: "linear-gradient(135deg,rgba(124,58,237,.1),transparent)",
                }}
              />
              <div
                className="absolute top-5 right-6 font-extrabold"
                style={{ fontSize: 40, color: "rgba(255,255,255,.04)" }}
              >
                {s.num}
              </div>
              <div
                className="mb-5 w-12 h-12 rounded-xl flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg,#7c3aed,#db2777)",
                  boxShadow: "0 0 20px rgba(124,58,237,.4)",
                }}
              >
                <s.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{s.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,.5)" }}>
                {s.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── EARN SECTION ── */}
      <section className="relative z-1 mx-auto max-w-7xl px-6 md:px-10 py-20">
        <div className="grid md:grid-cols-2 gap-14 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2
              className="font-extrabold text-white mb-4"
              style={{ fontSize: "clamp(28px,3.5vw,38px)", lineHeight: 1.15 }}
            >
              Turn Your Skills Into{" "}
              <span
                style={{
                  background: "linear-gradient(135deg,#a78bfa,#f472b6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Real Income
              </span>
            </h2>
            <p className="max-w-md text-base leading-relaxed" style={{ color: "rgba(255,255,255,.55)" }}>
              Teach what you already know. No degree required — just skills and passion.
            </p>
            <div className="mt-6 space-y-3">
              {[
                "Earn coins for every teaching session",
                "Get discovered by global learners",
                "Convert coins into real cash anytime",
              ].map((f) => (
                <div key={f} className="flex items-center gap-3 text-sm" style={{ color: "rgba(255,255,255,.7)" }}>
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{
                      background: "linear-gradient(135deg,#7c3aed,#f472b6)",
                      boxShadow: "0 0 8px rgba(124,58,237,.6)",
                    }}
                  />
                  {f}
                </div>
              ))}
            </div>
            <div className="mt-8 flex gap-4">
              {[
                { val: "₹500+", lbl: "Per Day" },
                { val: "₹15K+", lbl: "Per Month" },
              ].map((n) => (
                <div
                  key={n.lbl}
                  className="rounded-2xl p-4 text-center"
                  style={{
                    background: "rgba(255,255,255,.05)",
                    border: "1px solid rgba(255,255,255,.08)",
                  }}
                >
                  <div
                    className="text-xl font-extrabold"
                    style={{
                      background: "linear-gradient(135deg,#a78bfa,#f472b6)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {n.val}
                  </div>
                  <div className="text-xs mt-1" style={{ color: "rgba(255,255,255,.4)" }}>
                    {n.lbl}
                  </div>
                </div>
              ))}
            </div>
            <Button
              className="mt-8 text-white font-semibold"
              style={{
                background: "linear-gradient(135deg,#7c3aed,#db2777)",
                boxShadow: "0 0 24px rgba(124,58,237,.4)",
              }}
            >
              Start Earning
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div
              className="absolute inset-0 -z-10 rounded-[2rem] blur-3xl opacity-20"
              style={{ background: "linear-gradient(135deg,#7c3aed,#db2777)" }}
            />
            <div
              className="rounded-3xl p-7 backdrop-blur"
              style={{
                background: "rgba(255,255,255,.05)",
                border: "1px solid rgba(255,255,255,.1)",
                boxShadow: "0 20px 80px rgba(0,0,0,.4)",
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm" style={{ color: "rgba(255,255,255,.5)" }}>
                  Earnings Dashboard
                </span>
                <Coins className="w-5 h-5" style={{ color: "#a78bfa" }} />
              </div>
              <div
                className="text-3xl font-extrabold mb-1"
                style={{
                  background: "linear-gradient(135deg,#a78bfa,#f472b6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                ₹12,450
              </div>
              <div className="text-xs mb-6" style={{ color: "rgba(255,255,255,.35)" }}>
                Total Earnings This Month
              </div>
              {[
                { label: "React Session", amount: "+₹500" },
                { label: "English Speaking", amount: "+₹300" },
                { label: "UI Design Basics", amount: "+₹700" },
              ].map((row) => (
                <motion.div
                  key={row.label}
                  whileHover={{ x: 4 }}
                  className="flex justify-between rounded-xl px-4 py-3 text-sm mb-2 transition-colors"
                  style={{
                    background: "rgba(255,255,255,.04)",
                    border: "1px solid rgba(255,255,255,.06)",
                  }}
                >
                  <span className="text-white/70">{row.label}</span>
                  <span className="font-semibold" style={{ color: "#a78bfa" }}>
                    {row.amount}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── AI TUTOR SECTION ── */}
      <section className="relative z-1 mx-auto max-w-7xl px-6 md:px-10 py-20">
        <div className="grid md:grid-cols-2 gap-14 items-center">
          {/* Chat UI */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div
              className="absolute inset-0 -z-10 rounded-[2rem] blur-3xl opacity-20"
              style={{ background: "linear-gradient(135deg,#7c3aed,#db2777)" }}
            />
            <div
              className="rounded-3xl p-6 backdrop-blur max-w-md"
              style={{
                background: "rgba(255,255,255,.05)",
                border: "1px solid rgba(255,255,255,.1)",
                boxShadow: "0 20px 80px rgba(0,0,0,.4)",
              }}
            >
              <div
                className="flex items-center gap-3 mb-5 pb-4"
                style={{ borderBottom: "1px solid rgba(255,255,255,.07)" }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
                  style={{
                    background: "linear-gradient(135deg,#7c3aed,#db2777)",
                    boxShadow: "0 0 16px rgba(124,58,237,.4)",
                  }}
                >
                  🤖
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">AI Tutor</div>
                  <div className="text-xs text-emerald-400">● Online always</div>
                </div>
              </div>
              <div className="space-y-3 mb-4">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="ml-auto max-w-[80%] rounded-xl rounded-br-sm px-3 py-2 text-sm text-white"
                  style={{ background: "linear-gradient(135deg,#7c3aed,#9333ea)" }}
                >
                  Explain React hooks in simple terms
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="max-w-[88%] rounded-xl rounded-bl-sm px-3 py-2 text-sm leading-relaxed"
                  style={{
                    background: "rgba(255,255,255,.07)",
                    border: "1px solid rgba(255,255,255,.08)",
                    color: "rgba(255,255,255,.8)",
                  }}
                >
                  React hooks let you use state and lifecycle in functional components.
                  <br />
                  <br />
                  👉 <strong className="text-purple-300">useState</strong> → manage data
                  <br />
                  👉 <strong className="text-purple-300">useEffect</strong> → handle side effects
                </motion.div>
              </div>
              <div
                className="flex items-center justify-between rounded-xl px-3 py-2.5 text-xs"
                style={{
                  background: "rgba(255,255,255,.06)",
                  border: "1px solid rgba(255,255,255,.1)",
                  color: "rgba(255,255,255,.4)",
                }}
              >
                Ask anything...
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-sm"
                  style={{ background: "linear-gradient(135deg,#7c3aed,#db2777)" }}
                >
                  ↑
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2
              className="font-extrabold text-white mb-4"
              style={{ fontSize: "clamp(28px,3.5vw,38px)" }}
            >
              Your 24/7{" "}
              <span
                style={{
                  background: "linear-gradient(135deg,#a78bfa,#f472b6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                AI Tutor
              </span>
            </h2>
            <p className="max-w-md text-base leading-relaxed" style={{ color: "rgba(255,255,255,.55)" }}>
              Stuck while learning? Get instant, structured help anytime — just like a personal
              mentor that never sleeps.
            </p>
            <div className="mt-6 space-y-3">
              {[
                "Instant answers to any topic",
                "Step-by-step explanations",
                "Practice anytime, anywhere",
                "Personalized learning paths",
              ].map((f) => (
                <div key={f} className="flex items-center gap-3 text-sm" style={{ color: "rgba(255,255,255,.7)" }}>
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{
                      background: "linear-gradient(135deg,#7c3aed,#f472b6)",
                      boxShadow: "0 0 8px rgba(124,58,237,.6)",
                    }}
                  />
                  {f}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── SKILLS GRID ── */}
      <section className="relative z-1 mx-auto max-w-7xl px-6 md:px-10 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2
            className="font-extrabold text-white"
            style={{ fontSize: "clamp(28px,4vw,42px)" }}
          >
            Explore Popular Skills
          </h2>
          <p className="mt-3 mx-auto max-w-lg text-base" style={{ color: "rgba(255,255,255,.5)" }}>
            Learn or teach from in-demand skills across different domains.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[
            { name: "Web Development", icon: Globe2, emoji: "🌐" },
            { name: "UI/UX Design", icon: Sparkles, emoji: "✨" },
            { name: "English Speaking", icon: GraduationCap, emoji: "🗣️" },
            { name: "DSA & Coding", icon: Bot, emoji: "💻" },
            { name: "Stock Trading", icon: Coins, emoji: "📈" },
            { name: "Fitness Training", icon: Sparkles, emoji: "💪" },
            { name: "Video Editing", icon: Globe2, emoji: "🎬" },
            { name: "Interview Prep", icon: GraduationCap, emoji: "🎯" },
          ].map((skill, i) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -6 }}
            >
              <Link
                to="/skill/$name"
                params={{ name: skill.name }}
                className="block rounded-2xl p-5 transition-all group"
                style={{
                  background: "rgba(255,255,255,.04)",
                  border: "1px solid rgba(255,255,255,.07)",
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <div
                  className="mb-4 w-11 h-11 rounded-xl flex items-center justify-center text-xl transition-all group-hover:scale-110"
                  style={{
                    background: "linear-gradient(135deg,#7c3aed,#db2777)",
                    boxShadow: "0 0 16px rgba(124,58,237,.35)",
                  }}
                >
                  {skill.emoji}
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">{skill.name}</h3>
                <p className="text-xs" style={{ color: "rgba(255,255,255,.4)" }}>
                  Learn & teach
                </p>
                <div
                  className="mt-3 text-xs font-medium opacity-0 transition-opacity group-hover:opacity-100"
                  style={{ color: "#a78bfa" }}
                >
                  Explore →
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="relative z-1 mx-auto max-w-7xl px-6 md:px-10 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2
            className="font-extrabold text-white mb-3"
            style={{ fontSize: "clamp(28px,4vw,42px)" }}
          >
            👨‍💻 Meet the Developers
          </h2>
          <p className="mx-auto max-w-lg text-base" style={{ color: "rgba(255,255,255,.5)" }}>
            The team that built SkillSwapAI from the ground up.
          </p>
        </motion.div>

        <div className="mt-14 grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[
            {
              name: "Anupam Yadav",
              role: "Full Stack Developer & DevOps Engineer",
              img: "https://media.licdn.com/dms/image/v2/D5603AQG7Iheipy2BMQ/profile-displayphoto-crop_800_800/B56ZgtH_yBHkAI-/0/1753103729975?e=1778716800&v=beta&t=rPPDwMRyVZRDWoALaq0p_AI68wrIwnbHrLkbvOXqPhk",
              initials: "AY",
            },
            {
              name: "Gargi Soni",
              role: "WebRTC Expert & Backend Developer",
              img: "https://avatars.githubusercontent.com/u/209323421?v=4",
              initials: "GS",
            },
            {
              name: "Ayushi",
              role: "UI/UX Designer & Frontend Developer",
              img: "https://avatars.githubusercontent.com/u/195586771?v=4",
              initials: "AY",
            },
            {
              name: "Prakhar Agrawal",
              role: "AI Integration Specialist",
              img: "https://avatars.githubusercontent.com/u/207049815?v=4",
              initials: "PA",
            },
          ].map((dev, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="text-center rounded-2xl p-6 transition-all"
              style={{
                background: "rgba(255,255,255,.04)",
                border: "1px solid rgba(255,255,255,.07)",
              }}
            >
              <img
                src={dev.img}
                alt={dev.name}
                className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                style={{ border: "2px solid rgba(124,58,237,.4)" }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <h3 className="font-bold text-white mb-1">{dev.name}</h3>
              <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,.45)" }}>
                {dev.role}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <footer
        className="relative z-1 border-t py-8 text-center text-xs"
        style={{
          borderColor: "rgba(255,255,255,.07)",
          color: "rgba(255,255,255,.35)",
        }}
      >
        © {new Date().getFullYear()} SkillSwapAI · Built for learners and teachers everywhere.
      </footer>
    </div>
  );
}