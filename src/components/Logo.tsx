import { Link } from "@tanstack/react-router";
import logo from "@/assets/ethixweb-logo.jpg";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center gap-2.5 group ${className}`}>
      <span className="relative inline-flex h-9 w-9 overflow-hidden rounded-lg ring-1 ring-white/10 shadow-glow">
        <img src={logo} alt="Ethixweb logo" className="h-full w-full object-cover transition-transform group-hover:scale-110" />
      </span>
      <span className="font-display text-lg font-bold tracking-[0.18em] text-foreground">
        ETHIXWEB
      </span>
    </Link>
  );
}
