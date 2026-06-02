import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Wrench, TrendingUp, Zap, Radio } from "lucide-react";
import { Reveal } from "./Reveal";

type City = {
  name: string;
  short?: string;
  lat: number;
  lon: number;
  tier: "primary" | "secondary" | "hub";
  tz?: string;
};

const CITIES: City[] = [
  { name: "Seattle", lat: 47.6, lon: -122.3, tier: "primary", tz: "America/Los_Angeles" },
  { name: "Utah", lat: 40.76, lon: -111.89, tier: "primary", tz: "America/Denver" },
  { name: "New York", lat: 40.71, lon: -74.0, tier: "primary", tz: "America/New_York" },
  { name: "Toronto", lat: 43.65, lon: -79.38, tier: "secondary" },
  { name: "London", lat: 51.5, lon: -0.12, tier: "secondary" },
  { name: "India", short: "Bengaluru", lat: 12.97, lon: 77.59, tier: "hub", tz: "Asia/Kolkata" },
];

// India hub → all US primaries + secondary; US East ↔ US West; primaries → London/Toronto
const ROUTES: [string, string][] = [
  ["India", "Seattle"],
  ["India", "New York"],
  ["India", "Utah"],
  ["India", "London"],
  ["Seattle", "New York"],
  ["Seattle", "Utah"],
  ["Utah", "New York"],
  ["New York", "London"],
  ["New York", "Toronto"],
  ["Seattle", "Toronto"],
];

const ACTIVITY_LABELS = [
  "Deployment · NY",
  "Support · Seattle",
  "AI agent reply · Utah",
  "Client message · London",
  "Push to prod · Toronto",
  "Sync · India ↔ US",
];

// project lat/lon to 3D on unit sphere with rotation around Y (rotY) and tilt (rotX)
function project(lat: number, lon: number, rotY: number, rotX: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + rotY) * (Math.PI / 180);
  let x = Math.sin(phi) * Math.cos(theta);
  let y = Math.cos(phi);
  let z = Math.sin(phi) * Math.sin(theta);
  // tilt around X
  const cx = Math.cos((rotX * Math.PI) / 180);
  const sx = Math.sin((rotX * Math.PI) / 180);
  const y2 = y * cx - z * sx;
  const z2 = y * sx + z * cx;
  return { x, y: y2, z: z2 };
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

function GlobeStage() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [size, setSize] = useState(720);

  // rotation state stored in refs so RAF can mutate without re-render
  const rotYRef = useRef(20);
  const rotXRef = useRef(-12);
  const velYRef = useRef(0);
  const velXRef = useRef(0);
  const draggingRef = useRef(false);
  const lastInteractRef = useRef(0);
  const lastPosRef = useRef({ x: 0, y: 0 });

  // for overlay re-render at lower cadence
  const [overlayTick, setOverlayTick] = useState(0);
  // packets: index of route + progress 0..1
  const packetsRef = useRef<{ route: number; p: number; speed: number; activity: number }[]>([]);

  useEffect(() => {
    const update = () => {
      if (!wrapRef.current) return;
      const w = wrapRef.current.clientWidth;
      const h = wrapRef.current.clientHeight || w;
      setSize(Math.min(w, h));
    };
    update();
    const ro = new ResizeObserver(update);
    if (wrapRef.current) ro.observe(wrapRef.current);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("resize", update);
      ro.disconnect();
    };
  }, []);

  // seed packets
  useEffect(() => {
    packetsRef.current = ROUTES.map((_, i) => ({
      route: i,
      p: Math.random(),
      speed: 0.0015 + Math.random() * 0.0025,
      activity: Math.floor(Math.random() * ACTIVITY_LABELS.length),
    }));
  }, []);

  // particle globe + animation loop
  useEffect(() => {
    const cvs = canvasRef.current!;
    const ctx = cvs.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    cvs.width = size * dpr;
    cvs.height = size * dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    // Fibonacci sphere points (denser)
    const N = 3600;
    const pts: { lat: number; lon: number }[] = [];
    const golden = Math.PI * (Math.sqrt(5) - 1);
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const th = golden * i;
      const x = Math.cos(th) * r;
      const z = Math.sin(th) * r;
      pts.push({
        lat: Math.asin(y) * (180 / Math.PI),
        lon: Math.atan2(z, x) * (180 / Math.PI),
      });
    }

    let raf = 0;
    let last = performance.now();
    let overlayAcc = 0;

    const loop = (now: number) => {
      const dt = Math.min(64, now - last);
      last = now;

      // idle auto-rotate
      const idle = now - lastInteractRef.current > 1200 && !draggingRef.current;
      if (idle) {
        velYRef.current += (0.04 - velYRef.current) * 0.02; // ease toward small spin
      }
      if (!draggingRef.current) {
        rotYRef.current += velYRef.current * dt;
        rotXRef.current += velXRef.current * dt;
        velYRef.current *= 0.96;
        velXRef.current *= 0.92;
      }
      // clamp tilt
      if (rotXRef.current > 55) {
        rotXRef.current = 55;
        velXRef.current = 0;
      }
      if (rotXRef.current < -55) {
        rotXRef.current = -55;
        velXRef.current = 0;
      }

      const cx = size / 2;
      const cy = size / 2;
      const R = size * 0.46;

      ctx.clearRect(0, 0, size, size);

      // atmosphere outer glow
      const atmo = ctx.createRadialGradient(cx, cy, R * 0.92, cx, cy, R * 1.22);
      atmo.addColorStop(0, "rgba(57, 21, 22, 0.4)");
      atmo.addColorStop(0.5, "rgba(39, 18, 29, 0.12)");
      atmo.addColorStop(1, "rgba(16, 15, 24, 0)");
      ctx.fillStyle = atmo;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.22, 0, Math.PI * 2);
      ctx.fill();

      // sphere base shading (dark gradient — left-lit)
      const sphere = ctx.createRadialGradient(
        cx - R * 0.35,
        cy - R * 0.35,
        R * 0.1,
        cx,
        cy,
        R
      );
      sphere.addColorStop(0, "rgba(39, 18, 29, 0.6)");
      sphere.addColorStop(0.6, "rgba(16, 15, 24, 0.5)");
      sphere.addColorStop(1, "rgba(12, 13, 16, 0.0)");
      ctx.fillStyle = sphere;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fill();

      // particles
      const rotY = rotYRef.current;
      const rotX = rotXRef.current;
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        const v = project(p.lat, p.lon, rotY, rotX);
        if (v.z < -0.02) continue;
        const px = cx + v.x * R;
        const py = cy - v.y * R;
        const depth = (v.z + 1) / 2;
        // lighting toward upper-left
        const light = Math.max(0, v.x * -0.4 + v.y * 0.4 + v.z * 0.6);
        const alpha = 0.08 + depth * 0.6 + light * 0.15;
        const sz = 0.35 + depth * 0.95;
        const warm = Math.abs(p.lat) < 28;
        if (warm) {
          // wine-red equator band
          ctx.fillStyle = `rgba(${140 + Math.floor(depth * 60)}, ${55 + Math.floor(depth * 25)}, ${60 + Math.floor(depth * 25)}, ${alpha})`;
        } else {
          // deep-navy/plum poles
          ctx.fillStyle = `rgba(${90 + Math.floor(depth * 50)}, ${75 + Math.floor(depth * 40)}, ${110 + Math.floor(depth * 50)}, ${alpha * 0.85})`;
        }
        ctx.beginPath();
        ctx.arc(px, py, sz, 0, Math.PI * 2);
        ctx.fill();
      }

      // specular highlight
      const spec = ctx.createRadialGradient(
        cx - R * 0.45,
        cy - R * 0.5,
        0,
        cx - R * 0.45,
        cy - R * 0.5,
        R * 0.5
      );
      spec.addColorStop(0, "rgba(220, 180, 190, 0.14)");
      spec.addColorStop(1, "rgba(220, 180, 190, 0)");
      ctx.fillStyle = spec;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fill();

      // advance packets
      for (const pk of packetsRef.current) {
        pk.p += pk.speed * dt;
        if (pk.p >= 1) {
          pk.p = 0;
          pk.activity = Math.floor(Math.random() * ACTIVITY_LABELS.length);
        }
      }

      overlayAcc += dt;
      if (overlayAcc > 33) {
        overlayAcc = 0;
        setOverlayTick((t) => (t + 1) % 100000);
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [size]);

  // interaction handlers
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const onDown = (e: PointerEvent) => {
      draggingRef.current = true;
      lastInteractRef.current = performance.now();
      lastPosRef.current = { x: e.clientX, y: e.clientY };
      velYRef.current = 0;
      velXRef.current = 0;
      el.setPointerCapture?.(e.pointerId);
      el.style.cursor = "grabbing";
    };
    const onMove = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      const dx = e.clientX - lastPosRef.current.x;
      const dy = e.clientY - lastPosRef.current.y;
      lastPosRef.current = { x: e.clientX, y: e.clientY };
      const sens = 0.4;
      rotYRef.current += dx * sens;
      rotXRef.current += dy * sens;
      velYRef.current = dx * sens * 0.18;
      velXRef.current = dy * sens * 0.18;
      lastInteractRef.current = performance.now();
    };
    const onUp = (e: PointerEvent) => {
      draggingRef.current = false;
      lastInteractRef.current = performance.now();
      el.releasePointerCapture?.(e.pointerId);
      el.style.cursor = "grab";
    };

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    el.addEventListener("pointerleave", onUp);
    el.style.cursor = "grab";
    el.style.touchAction = "none";
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      el.removeEventListener("pointerleave", onUp);
    };
  }, []);

  // ---- overlay (SVG) ----
  const cx = size / 2;
  const cy = size / 2;
  const R = size * 0.46;
  const rotY = rotYRef.current;
  const rotX = rotXRef.current;

  const projected = useMemo(() => {
    return CITIES.map((c) => {
      const v = project(c.lat, c.lon, rotY, rotX);
      return {
        c,
        x: cx + v.x * R,
        y: cy - v.y * R,
        z: v.z,
        visible: v.z > -0.05,
        depth: (v.z + 1) / 2,
      };
    });
    // overlayTick drives re-eval
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [overlayTick, size]);

  // greatcircle-ish arc as quadratic curve with lift based on chord length
  function arc(a: { x: number; y: number }, b: { x: number; y: number }) {
    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2;
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const dist = Math.hypot(dx, dy);
    const lift = Math.min(dist * 0.45, R * 0.55);
    // perpendicular direction pulled toward sphere center → arc above
    const ux = (cx - mx) / Math.hypot(cx - mx, cy - my || 1);
    const uy = (cy - my) / Math.hypot(cx - mx, cy - my || 1);
    const ncx = mx + ux * lift - dy * 0.1;
    const ncy = my + uy * lift + dx * 0.1;
    return { ncx, ncy, dist };
  }

  function pointOnQuad(
    a: { x: number; y: number },
    cP: { x: number; y: number },
    b: { x: number; y: number },
    t: number
  ) {
    const it = 1 - t;
    return {
      x: it * it * a.x + 2 * it * t * cP.x + t * t * b.x,
      y: it * it * a.y + 2 * it * t * cP.y + t * t * b.y,
    };
  }

  // resolve routes by name lookup against projected
  const byName: Record<string, typeof projected[number]> = {};
  for (const p of projected) byName[p.c.name] = p;

  return (
    <div
      ref={wrapRef}
      className="relative mx-auto w-full aspect-square select-none"
      style={{ maxWidth: 880 }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: size, height: size }}
        className="absolute inset-0 m-auto"
      />
      <svg
        width={size}
        height={size}
        className="absolute inset-0 m-auto pointer-events-none"
      >
        <defs>
          <linearGradient id="arc-grad" x1="0" x2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--primary)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="packet-grad">
            <stop offset="0%" stopColor="#fff" stopOpacity="1" />
            <stop offset="40%" stopColor="var(--primary)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </radialGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* arcs */}
        {ROUTES.map(([fromName, toName], i) => {
          const a = byName[fromName];
          const b = byName[toName];
          if (!a || !b) return null;
          const avgZ = (a.z + b.z) / 2;
          if (avgZ < -0.15) return null;
          const { ncx, ncy } = arc(a, b);
          const opacity = Math.max(0.25, Math.min(1, (avgZ + 0.4) * 1.1));
          const isIndia = fromName === "India" || toName === "India";
          return (
            <g key={i} style={{ opacity }}>
              <path
                d={`M ${a.x} ${a.y} Q ${ncx} ${ncy} ${b.x} ${b.y}`}
                fill="none"
                stroke="url(#arc-grad)"
                strokeWidth={isIndia ? 1.6 : 1.1}
                filter="url(#glow)"
              />
            </g>
          );
        })}

        {/* packets */}
        {packetsRef.current.map((pk, i) => {
          const [fromName, toName] = ROUTES[pk.route];
          const a = byName[fromName];
          const b = byName[toName];
          if (!a || !b) return null;
          const avgZ = (a.z + b.z) / 2;
          if (avgZ < -0.1) return null;
          const { ncx, ncy } = arc(a, b);
          const pt = pointOnQuad(a, { x: ncx, y: ncy }, b, pk.p);
          return (
            <g key={`pk-${i}`}>
              <circle cx={pt.x} cy={pt.y} r={6} fill="url(#packet-grad)" />
              <circle cx={pt.x} cy={pt.y} r={1.6} fill="#fff" />
            </g>
          );
        })}

        {/* city markers */}
        {projected.map((p, i) => {
          if (!p.visible) return null;
          const isHub = p.c.tier === "hub";
          const isPrimary = p.c.tier === "primary";
          const base = isHub ? 11 : isPrimary ? 8 : 5;
          const labelOpacity = Math.max(0, Math.min(1, (p.z + 0.1) * 2));
          return (
            <g key={i}>
              <circle
                cx={p.x}
                cy={p.y}
                r={base}
                fill="var(--primary)"
                fillOpacity="0.18"
              >
                <animate
                  attributeName="r"
                  values={`${base * 0.55};${base * 1.7};${base * 0.55}`}
                  dur={isHub ? "1.8s" : "2.6s"}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.8;0;0.8"
                  dur={isHub ? "1.8s" : "2.6s"}
                  repeatCount="indefinite"
                />
              </circle>
              <circle
                cx={p.x}
                cy={p.y}
                r={isHub ? 4 : isPrimary ? 3.2 : 2.2}
                fill={isHub ? "#fff" : "var(--primary)"}
                stroke="var(--primary)"
                strokeWidth={isHub ? 1.5 : 0}
              />
              {(isHub || isPrimary) && (
                <g opacity={labelOpacity}>
                  <line
                    x1={p.x}
                    y1={p.y}
                    x2={p.x + 14}
                    y2={p.y - 14}
                    stroke="var(--primary)"
                    strokeOpacity="0.5"
                    strokeWidth="0.8"
                  />
                  <rect
                    x={p.x + 14}
                    y={p.y - 26}
                    width={(p.c.name.length + (isHub ? 4 : 0)) * 6.6}
                    height="16"
                    rx="3"
                    fill="rgba(10,10,15,0.7)"
                    stroke="var(--primary)"
                    strokeOpacity="0.35"
                    strokeWidth="0.6"
                  />
                  <text
                    x={p.x + 19}
                    y={p.y - 14}
                    fill="#fff"
                    fontSize="10.5"
                    fontWeight="600"
                    style={{ letterSpacing: 0.3 }}
                  >
                    {isHub ? `★ ${p.c.name}` : p.c.name}
                  </text>
                </g>
              )}
            </g>
          );
        })}
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

function ActivityTicker() {
  const items = [
    { t: "Deployment shipped", l: "New York" },
    { t: "AI agent reply", l: "Utah" },
    { t: "Client onboarding", l: "Seattle" },
    { t: "Support resolved", l: "London" },
    { t: "Code review", l: "India" },
    { t: "Push to prod", l: "Toronto" },
  ];
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((x) => (x + 1) % items.length), 2200);
    return () => clearInterval(id);
  }, [items.length]);
  return (
    <div className="glass-strong rounded-2xl p-4 border border-white/10 overflow-hidden">
      <div className="flex items-center gap-2 mb-2">
        <Radio className="h-3.5 w-3.5 text-primary animate-pulse" />
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Live Network Activity</span>
      </div>
      <motion.div
        key={i}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex items-center justify-between"
      >
        <span className="text-sm text-foreground/90">{items[i].t}</span>
        <span className="text-xs text-primary font-medium">{items[i].l}</span>
      </motion.div>
    </div>
  );
}

export function GlobalNetwork() {
  return (
    <section className="relative py-28 px-6 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-[44rem] w-[44rem] rounded-full bg-primary/10 blur-[160px] pointer-events-none" />

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

        <div className="mt-12 grid lg:grid-cols-[1.9fr_1fr] gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative"
          >
            <GlobeStage />
            <p className="mt-2 text-center text-[10px] uppercase tracking-widest text-muted-foreground/70">
              Drag to rotate · auto-spins when idle
            </p>
          </motion.div>

          <div className="flex flex-col gap-4">
            {STATUS_CARDS.map((s, i) => (
              <StatusCard key={s.city} data={s} idx={i} />
            ))}
            <ActivityTicker />
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
