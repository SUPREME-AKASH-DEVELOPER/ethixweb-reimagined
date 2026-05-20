import { Link } from "@tanstack/react-router";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center gap-2 group ${className}`}>
      <span className="font-display text-xl font-bold tracking-[0.18em] text-foreground">
        <span className="inline-block transition-transform group-hover:scale-110">Ξ</span>
        THIXW
        <span className="inline-block transition-transform group-hover:scale-110">Ǝ</span>
        B
      </span>
    </Link>
  );
}
