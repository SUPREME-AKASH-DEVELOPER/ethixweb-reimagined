import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Wrench, TrendingUp, Zap } from "lucide-react";
import { Reveal } from "./Reveal";

type City = {
  name: string;
  lat: number;
  lon: number;
  tier: "primary" | "secondary";
  tz?: string;
};

const CITIES: City[] = [
  { name: "Seattle", lat: 47.6, lon: -122.3, tier: "primary", tz: "America/Los_Angeles" },
  { name: "Utah", lat: 40.76, lon: -111.89, tier: "primary", tz: "America/Denver" },
  { name: "New York", lat: 40.71, lon: -74.0, tier: "primary", tz: "America/New_York" },
  { name: "Toronto", lat: 43.65, lon: -79.38, tier: "secondary" },
  { name: "London", lat: 51.5, lon: -0.12, tier: "secondary" },
  { name: "India", lat: 20.59, lon: 78.96, tier: "secondary", tz: "Asia/Kolkata" },
];

// project lat/lon to 3D on unit sphere
function project(lat: number, lon: number, rot: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + rot) * (Math.PI / 180);
  return {
    x: Math.sin(phi) * Math.cos(theta),
    y: Math.cos(phi),
    z: Math.sin(phi) * Math.sin(theta),
  };
}

function useClock(tz: string) {
  const [t, setT] = useState("");
  useEffect(() => {
    const tick = () =>
      setT(
        new Intl.DateTimeFormat("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
          timeZone: tz,
        }).format(new Date())
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [tz]);
  return t;
}

function GlobeCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(560);
  const [rot, setRot] = useState(0);

  useEffect(() => {
    const update = () => {
      if (!wrapRef.current) return;
      const w = wrapRef.current.clientWidth;
      setSize(Math.min(w, 640));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    let raf = 0;
    let start = performance.now();
    const cvs = ref.current!;
    const ctx = cvs.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    cvs.width = size * dpr;
    cvs.height = size * dpr;
    ctx.scale(dpr, dpr);

    // Fibonacci sphere points
    const N = 2200;
    const pts: { lat: number; lon: number }[] = [];
    const phi = Math.PI * (Math.sqrt(5) - 1);
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const th = phi * i;
      const x = Math.cos(th) * r;
      const z = Math.sin(th) * r;
      const lat = Math.asin(y) * (180 / Math.PI);
      const lon = Math.atan2(z, x) * (180 / Math.PI);
      pts.push({ lat, lon });
    }

    const draw = (now: number) => {
      const t = (now - start) / 1000;
      const rotation = t * 6; // deg/s
      setRot(rotation);
      const cx = size / 2;
      const cy = size / 2;
      const R = size * 0.42;

      ctx.clearRect(0, 0, size, size);

      // outer glow
      const grad = ctx.createRadialGradient(cx, cy, R * 0.6, cx, cy, R * 1.3);
      grad.addColorStop(0, "rgba(220, 38, 38, 0.08)");
      grad.addColorStop(1, "rgba(220, 38, 38, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, size, size);

      // particles
      for (const p of pts) {
        const v = project(p.lat, p.lon, rotation);
        if (v.z < -0.05) continue; // back-face cull
        const px = cx + v.x * R;
        const py = cy - v.y * R;
        const depth = (v.z + 1) / 2; // 0..1
        const alpha = 0.15 + depth * 0.75;
        const sz = 0.5 + depth * 1.4;
        // hue mix: primary red to warm orange near equator
        const isHot = Math.abs(p.lat) < 30;
        ctx.fillStyle = isHot
          ? `rgba(255, ${120 + Math.floor(depth * 80)}, ${80 + Math.floor(depth * 60)}, ${alpha})`
          : `rgba(${200 + Math.floor(depth * 55)}, ${60 + Math.floor(depth * 50)}, ${70 + Math.floor(depth * 40)}, ${alpha * 0.85})`;
        ctx.beginPath();
        ctx.arc(px, py, sz, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [size]);

  // city overlays + arcs
  const cx = size / 2;
  const cy = size / 2;
  const R = size * 0.42;
  const projected = CITIES.map((c) => {
    const v = project(c.lat, c.lon, rot);
    return {
      c,
      x: cx + v.x * R,
      y: cy - v.y * R,
      visible: v.z > -0.1,
      depth: (v.z + 1) / 2,
    };
  });

  const primaries = projected.filter((p) => p.c.tier === "primary");
  const arcs: { a: typeof projected[number]; b: typeof projected[number] }[] = [];
  for (let i = 0; i < primaries.length; i++) {
    for (let j = i + 1; j < primaries.length; j++) {
      arcs.push({ a: primaries[i], b: primaries[j] });
    }
  }
  // also connect each primary to each secondary
  const secondaries = projected.filter((p) => p.c.tier === "secondary");
  for (const p of primaries) for (const s of secondaries) arcs.push({ a: p, b: s });

  return (
    <div ref={wrapRef} className="relative mx-auto w-full max-w-[640px] aspect-square">
      <canvas ref={ref} style={{ width: size, height: size }} className="absolute inset-0 m-auto" />
      <svg width={size} height={size} className="absolute inset-0 m-auto pointer-events-none">
        <defs>
          <linearGradient id="arc-grad" x1="0" x2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--primary)" stopOpacity="0.7" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {arcs.map((a, i) => {
          if (!a.a.visible || !a.b.visible) return null;
          const mx = (a.a.x + a.b.x) / 2;
          const my = (a.a.y + a.b.y) / 2;
          const dx = a.b.x - a.a.x;
          const dy = a.b.y - a.a.y;
          const dist = Math.hypot(dx, dy);
          const lift = dist * 0.35;
          // arc upward from midpoint towards center
          const ncx = mx + (cx - mx) * 0;
          const ncy = my - lift;
          return (
            <path
              key={i}
              d={`M ${a.a.x} ${a.a.y} Q ${ncx} ${ncy} ${a.b.x} ${a.b.y}`}
              fill="none"
              stroke="url(#arc-grad)"
              strokeWidth={a.a.c.tier === "primary" && a.b.c.tier === "primary" ? 1.2 : 0.6}
              opacity={0.6}
            />
          );
        })}
        {projected.map((p, i) =>
          p.visible ? (
            <g key={i} opacity={0.4 + p.depth * 0.6}>
              <circle cx={p.x} cy={p.y} r={p.c.tier === "primary" ? 9 : 5} fill="hsl(var(--primary) / 0.15)">
                <animate attributeName="r" values={`${p.c.tier === "primary" ? 6 : 3};${p.c.tier === "primary" ? 14 : 9};${p.c.tier === "primary" ? 6 : 3}`} dur="2.4s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.7;0;0.7" dur="2.4s" repeatCount="indefinite" />
              </circle>
              <circle cx={p.x} cy={p.y} r={p.c.tier === "primary" ? 3.5 : 2} fill="hsl(var(--primary))" />
              {p.c.tier === "primary" && (
                <text
                  x={p.x + 10}
                  y={p.y - 8}
                  fill="currentColor"
                  className="fill-foreground"
                  fontSize="11"
                  fontWeight="600"
                >
                  {p.c.name}
                </text>
              )}
            </g>
          ) : null
        )}
      </svg>
    </div>
  );
}

const STATUS_CARDS = [
  { city: "Seattle", icon: Activity, label: "Active Projects", status: "Online Now", tz: "America/Los_Angeles", tone: "emerald" },
  { city: "Utah", icon: Wrench, label: "Maintenance & Support", status: "Available", tz: "America/Denver", tone: "amber" },
  { city: "New York", icon: TrendingUp, label: "Strategy & Growth", status: "Responding Fast", tz: "America/New_York", tone: "emerald" },
];

function StatusCard({ data, idx }: { data: typeof STATUS_CARDS[number]; idx: number }) {
  const time = useClock(data.tz);
  const dot =
    data.tone === "emerald" ? "bg-emerald-400" : data.tone === "amber" ? "bg-amber-400" : "bg-primary";
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: idx * 0.1 }}
      whileHover={{ y: -4 }}
      className="glass-strong rounded-2xl p-5 shadow-elegant border border-white/10 hover:border-primary/30 transition-colors"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${dot}`} />
            <span className={`relative inline-flex h-2 w-2 rounded-full ${dot}`} />
          </span>
          <span className="font-display text-base font-semibold">{data.city}</span>
        </div>
        <data.icon className="h-4 w-4 text-primary" />
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{data.label}</p>
      <div className="mt-4 flex items-end justify-between">
        <span className="text-[11px] uppercase tracking-widest text-primary">{data.status}</span>
        <span className="font-mono text-sm tabular-nums text-foreground/90">{time}</span>
      </div>
    </motion.div>
  );
}

const CLOCKS = [
  { label: "India Team", tz: "Asia/Kolkata" },
  { label: "Seattle", tz: "America/Los_Angeles" },
  { label: "Utah", tz: "America/Denver" },
  { label: "New York", tz: "America/New_York" },
];

function ClockChip({ c }: { c: { label: string; tz: string } }) {
  const t = useClock(c.tz);
  return (
    <div className="flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs">
      <Zap className="h-3 w-3 text-primary" />
      <span className="text-muted-foreground">{c.label}</span>
      <span className="font-mono tabular-nums">{t}</span>
    </div>
  );
}

const METRICS = [
  { v: "50+", l: "Projects Delivered" },
  { v: "<1h", l: "Avg. Response Time" },
  { v: "US-First", l: "Operations Focus" },
  { v: "24/7", l: "Global Availability" },
];

export function GlobalNetwork() {
  return (
    <section className="relative py-28 px-6 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-[40rem] w-[40rem] rounded-full bg-primary/10 blur-[140px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-sm uppercase tracking-widest text-primary mb-4">Global Operations Network</p>
            <h2 className="font-display text-4xl lg:text-6xl font-bold text-gradient leading-[1.05]">
              Built for Fast-Moving Teams Across Time Zones
            </h2>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              From Seattle to New York, Ethixweb helps businesses launch, maintain, and scale digital
              products with rapid response times and reliable execution.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {CLOCKS.map((c) => (
            <ClockChip key={c.label} c={c} />
          ))}
        </div>

        <div className="mt-12 grid lg:grid-cols-[1fr_360px] gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <GlobeCanvas />
          </motion.div>

          <div className="flex flex-col gap-4">
            {STATUS_CARDS.map((s, i) => (
              <StatusCard key={s.city} data={s} idx={i} />
            ))}
          </div>
        </div>

        <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {METRICS.map((m, i) => (
            <Reveal key={m.l} delay={i * 0.08}>
              <div className="glass rounded-2xl p-6 text-center hover:bg-white/[0.06] transition">
                <div className="font-display text-4xl font-bold text-gradient-brand">{m.v}</div>
                <div className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">{m.l}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
