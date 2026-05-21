import { useEffect, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { X, Sparkles, MessageCircle } from "lucide-react";
import { Link } from "@tanstack/react-router";
import ethan from "@/assets/ethan.png";

const TIPS = [
  "Hey, I'm Ethan 👋 Want more booked jobs this month?",
  "Psst — your competitors are bidding on your brand name.",
  "I can audit your Google Ads in 24 hours. Free.",
  "Tracking leaks revenue. Let's fix your GA4 + CallRail.",
  "Local Services Ads = top-of-page. Let's get you verified.",
];

export function EthanMascot() {
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  // Parallax: Ethan looks toward cursor
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 80, damping: 18 });
  const sy = useSpring(my, { stiffness: 80, damping: 18 });
  const tiltX = useTransform(sy, [-1, 1], [8, -8]);
  const tiltY = useTransform(sx, [-1, 1], [-10, 10]);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const cx = window.innerWidth - 70;
      const cy = window.innerHeight - 70;
      mx.set(Math.max(-1, Math.min(1, (e.clientX - cx) / 400)));
      my.set(Math.max(-1, Math.min(1, (e.clientY - cy) / 400)));
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my]);

  useEffect(() => {
    if (!visible || dismissed) return;
    const id = setInterval(() => setTipIndex((i) => (i + 1) % TIPS.length), 6000);
    return () => clearInterval(id);
  }, [visible, dismissed]);

  if (dismissed) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 80, scale: 0.7 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 80, scale: 0.7 }}
          transition={{ type: "spring", stiffness: 180, damping: 20 }}
          className="fixed bottom-5 right-5 z-50 flex items-end gap-3"
        >
          <AnimatePresence mode="wait">
            {open && (
              <motion.div
                key="bubble"
                initial={{ opacity: 0, x: 20, scale: 0.85 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.85 }}
                transition={{ type: "spring", stiffness: 220, damping: 22 }}
                className="relative max-w-[260px] glass-strong rounded-2xl rounded-br-sm p-4 shadow-elegant"
              >
                <button
                  onClick={() => setDismissed(true)}
                  aria-label="Dismiss Ethan"
                  className="absolute -top-2 -left-2 p-1 rounded-full bg-background border border-white/10 hover:bg-white/10 transition"
                >
                  <X className="h-3 w-3" />
                </button>
                <div className="flex items-center gap-1.5 text-xs text-primary mb-1.5">
                  <Sparkles className="h-3 w-3" /> Ethan
                </div>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={tipIndex}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.3 }}
                    className="text-sm text-foreground/90 leading-snug"
                  >
                    {TIPS[tipIndex]}
                  </motion.p>
                </AnimatePresence>
                <Link
                  to="/contact"
                  onClick={() => setOpen(false)}
                  className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  Let's talk →
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            onClick={() => setOpen((v) => !v)}
            aria-label="Chat with Ethan"
            className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-full"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            animate={{ y: [0, -8, 0] }}
            transition={{ y: { duration: 3.5, repeat: Infinity, ease: "easeInOut" } }}
          >
            <span className="absolute inset-0 rounded-full bg-primary/40 blur-2xl animate-pulse-glow" />
            <motion.div
              style={{ rotateX: tiltX, rotateY: tiltY, transformPerspective: 600 }}
              className="relative h-full w-full rounded-full overflow-hidden ring-2 ring-primary/40 shadow-glow bg-gradient-brand"
            >
              <img src={ethan} alt="Ethan mascot" className="h-full w-full object-cover" />
            </motion.div>
            {!open && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground ring-2 ring-background"
              >
                <MessageCircle className="h-3 w-3" />
              </motion.span>
            )}
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
