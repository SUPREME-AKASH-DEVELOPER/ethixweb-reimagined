import { useEffect } from "react";
import clickSound from "@/assets/click.mp3";

/**
 * Plays a click sound whenever any button, link, or [role=button] is clicked.
 * Mounted once at the app root.
 */
export function ClickSound() {
  useEffect(() => {
    // Pool of audio elements so rapid clicks can overlap without cutting off.
    const POOL_SIZE = 4;
    const pool: HTMLAudioElement[] = Array.from({ length: POOL_SIZE }, () => {
      const a = new Audio(clickSound);
      a.preload = "auto";
      a.volume = 0.45;
      return a;
    });
    let idx = 0;

    const play = () => {
      const a = pool[idx];
      idx = (idx + 1) % POOL_SIZE;
      try {
        a.currentTime = 0;
        void a.play().catch(() => {});
      } catch {}
    };

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const el = target.closest(
        'button, a, [role="button"], input[type="submit"], input[type="button"], summary'
      ) as HTMLElement | null;
      if (!el) return;
      if (el.hasAttribute("data-no-click-sound")) return;
      if ((el as HTMLButtonElement).disabled) return;
      play();
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
