import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { BarChart3, PhoneCall, Palette, MousePointerClick, Sparkles } from "lucide-react";
import ethan from "@/assets/ethan.png";

/**
 * Cinematic free-floating Ethan hero scene.
 * No card, no rectangular framing — character floats in space with
 * dual rim lighting (red + blue), ambient glow, ground shadow,
 * cursor-driven parallax, breathing + idle float, particle backdrop,
 * and spring-physics floating glass pills.
 */
export function EthanScene() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 80, damping: 20, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 80, damping: 20, mass: 0.6 });

  const rotateY = useTransform(sx, [-1, 1], [-14, 14]);
  const rotateX = useTransform(sy, [-1, 1], [10, -10]);
  const translateX = useTransform(sx, [-1, 1], [-22, 22]);
  const translateY = useTransform(sy, [-1, 1], [-14, 14]);

  // Glow / rim lights track cursor subtly
  const redX = useTransform(sx, [-1, 1], [-30, 30]);
  const redY = useTransform(sy, [-1, 1], [-20, 20]);
  const blueX = useTransform(sx, [-1, 1], [30, -30]);
  const blueY = useTransform(sy, [-1, 1], [20, -20]);

  // Floating cards parallax
  const c1X = useTransform(sx, [-1, 1], [10, -10]);
  const c1Y = useTransform(sy, [-1, 1], [6, -6]);
  const c2X = useTransform(sx, [-1, 1], [-14, 14]);
  const c2Y = useTransform(sy, [-1, 1], [-8, 8]);
  const c3X = useTransform(sx, [-1, 1], [8, -8]);
  const c3Y = useTransform(sy, [-1, 1], [-10, 10]);
  const c4X = useTransform(sx, [-1, 1], [-10, 10]);
  const c4Y = useTransform(sy, [-1, 1], [12, -12]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      mx.set(Math.max(-1, Math.min(1, (e.clientX - cx) / (r.width / 1.4))));
      my.set(Math.max(-1, Math.min(1, (e.clientY - cy) / (r.height / 1.4))));
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my]);

  // Particle backdrop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const { clientWidth: w, clientHeight: h } = canvas;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };
    resize();

    type P = { x: number; y: number; vx: number; vy: number; r: number; a: number; hue: number };
    const W = () => canvas.clientWidth;
    const H = () => canvas.clientHeight;
    const particles: P[] = Array.from({ length: 50 }, () => ({
      x: Math.random() * W(),
      y: Math.random() * H(),
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.6 + 0.4,
      a: Math.random() * 0.5 + 0.2,
      hue: Math.random() > 0.55 ? 0 : 215,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, W(), H());
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > W()) p.vx *= -1;
        if (p.y < 0 || p.y > H()) p.vy *= -1;
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 9);
        grad.addColorStop(0, `hsla(${p.hue}, 90%, 62%, ${p.a})`);
        grad.addColorStop(1, "hsla(0,0%,0%,0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 9, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <motion.div
      ref={wrapRef}
      initial={{ opacity: 0, scale: 0.92, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex justify-center items-end min-h-[680px] w-full"
      style={{ perspective: 1600 }}
    >
      {/* Particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-70" />

      {/* Ambient brand glow that blends into page bg (no rim halo around character) */}
      <motion.div
        className="absolute pointer-events-none rounded-full blur-[140px]"
        style={{
          x: redX,
          y: redY,
          right: "4%",
          top: "10%",
          width: 520,
          height: 520,
          background: "radial-gradient(circle, hsl(var(--primary) / 0.35), transparent 70%)",
        }}
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute pointer-events-none rounded-full blur-[160px]"
        style={{
          x: blueX,
          y: blueY,
          left: "0%",
          top: "40%",
          width: 460,
          height: 460,
          background: "radial-gradient(circle, hsla(0, 70%, 25%, 0.45), transparent 70%)",
        }}
        animate={{ opacity: [0.35, 0.6, 0.35] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
      />

      {/* Free-floating character — multi-layer 3D depth */}
      <motion.div
        className="relative z-10"
        style={{
          rotateX,
          rotateY,
          x: translateX,
          y: translateY,
          transformStyle: "preserve-3d",
        }}
      >
        <motion.div
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.div
            animate={{ y: [0, -18, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative will-change-transform"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Soft contact-shadow blob behind character (depth) */}
            <div
              className="absolute -inset-10 rounded-full blur-3xl pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 60%, hsl(var(--primary) / 0.18), transparent 65%)",
                transform: "translateZ(-60px)",
              }}
            />

            {/* Main character — no harsh shadow, blends with bg */}
            <img
              src={ethan}
              alt="Ethan — Senior creative founder at Ethixweb"
              className="relative max-h-[680px] w-auto select-none pointer-events-none"
              draggable={false}
              style={{
                filter:
                  "drop-shadow(0 30px 40px rgba(0,0,0,0.55)) drop-shadow(0 0 60px hsl(var(--primary) / 0.18))",
                transform: "translateZ(40px)",
              }}
            />
          </motion.div>
        </motion.div>

        {/* Ground shadow — soft elliptical, animated with float */}
        <motion.div
          className="absolute left-1/2 -bottom-2 -translate-x-1/2 rounded-[50%] bg-black/80 blur-2xl pointer-events-none"
          style={{ width: 300, height: 38 }}
          animate={{
            scaleX: [1, 0.82, 1],
            opacity: [0.6, 0.38, 0.6],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Floating glass pills */}
      <FloatCard text="More booked jobs" icon={PhoneCall} style={{ top: "8%", left: "0%", x: c1X, y: c1Y }} delay={0} />
      <FloatCard text="Revenue tracked" icon={BarChart3} style={{ bottom: "12%", right: "0%", x: c2X, y: c2Y }} delay={0.4} />
      <FloatCard text="UI/UX Systems" icon={Palette} style={{ top: "46%", left: "-4%", x: c3X, y: c3Y }} delay={0.8} />
      <FloatCard text="More conversions" icon={MousePointerClick} style={{ top: "14%", right: "-2%", x: c4X, y: c4Y }} delay={1.2} />
      <FloatCard text="Design that converts" icon={Sparkles} style={{ bottom: "6%", left: "22%", x: c1X, y: c1Y }} delay={1.6} accent />
    </motion.div>
  );
}


function FloatCard({
  text,
  icon: Icon,
  style,
  delay,
  accent,
}: {
  text: string;
  icon: any;
  style: any;
  delay: number;
  accent?: boolean;
}) {
  return (
    <motion.div
      className={`absolute z-20 backdrop-blur-xl bg-white/[0.06] border border-white/10 rounded-2xl px-4 py-2.5 flex items-center gap-2 text-sm shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)] ${
        accent ? "ring-1 ring-primary/40" : ""
      }`}
      style={style}
      initial={{ opacity: 0, scale: 0.7, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
      transition={{
        opacity: { duration: 0.8, delay },
        scale: { type: "spring", stiffness: 160, damping: 14, delay },
        y: { duration: 4 + delay, repeat: Infinity, ease: "easeInOut", delay },
      }}
      whileHover={{ scale: 1.08, rotate: -2 }}
    >
      <Icon className="h-4 w-4 text-primary" />
      <span className="font-medium whitespace-nowrap">{text}</span>
    </motion.div>
  );
}
