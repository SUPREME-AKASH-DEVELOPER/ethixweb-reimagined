/**
 * Premium cinematic film-grain overlay.
 * Fine, matte, atmospheric — inspired by Linear / Vercel / Stripe and high-end film posters.
 * Pure CSS/SVG, fixed to viewport, pointer-events disabled.
 */
export function FilmGrain() {
  return (
    <>
      {/* Ultra-fine animated grain — only really visible in dark areas via soft-light blend */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[60] mix-blend-soft-light opacity-[0.55] animate-grain"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='320' height='320'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='2.6' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.38 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
          backgroundSize: "320px 320px",
        }}
      />
      {/* Secondary static micro-grain to break up gradients without shimmer */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[59] mix-blend-overlay opacity-[0.035]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='420' height='420'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='1' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.6 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
          backgroundSize: "420px 420px",
        }}
      />
      {/* Soft atmospheric dust specks */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[58] opacity-[0.045] mix-blend-screen"
        style={{
          backgroundImage:
            "radial-gradient(0.5px 0.5px at 13% 21%, rgba(255,255,255,0.7), transparent 60%)," +
            "radial-gradient(0.5px 0.5px at 67% 38%, rgba(255,255,255,0.55), transparent 60%)," +
            "radial-gradient(1px 1px at 41% 74%, rgba(255,255,255,0.5), transparent 60%)," +
            "radial-gradient(0.5px 0.5px at 84% 17%, rgba(255,255,255,0.5), transparent 60%)," +
            "radial-gradient(1px 1px at 9% 58%, rgba(255,255,255,0.45), transparent 60%)," +
            "radial-gradient(0.5px 0.5px at 52% 11%, rgba(255,255,255,0.5), transparent 60%)," +
            "radial-gradient(0.5px 0.5px at 28% 89%, rgba(255,255,255,0.45), transparent 60%)," +
            "radial-gradient(1px 1px at 93% 67%, rgba(255,255,255,0.4), transparent 60%)",
          backgroundSize: "720px 720px",
        }}
      />
      {/* Cinematic vignette — soft matte edges */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[57]"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.28) 88%, rgba(0,0,0,0.55) 100%)",
        }}
      />
      {/* Matte finish — flattens specular highlights */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[56] mix-blend-multiply opacity-[0.08]"
        style={{
          background:
            "linear-gradient(180deg, rgba(20,18,24,0.6) 0%, rgba(12,13,16,0.2) 50%, rgba(20,15,18,0.6) 100%)",
        }}
      />
    </>
  );
}
