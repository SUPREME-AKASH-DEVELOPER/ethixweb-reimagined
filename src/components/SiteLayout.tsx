import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { EthanMascot } from "./EthanMascot";
import { ClickSound } from "./ClickSound";
import { ThemeProvider } from "./ThemeProvider";
import { FilmGrain } from "./FilmGrain";
import bgAsset from "@/assets/ethixweb-bg.png.asset.json";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground noise relative">
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${bgAsset.url})` }}
        />
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-0"
          style={{
            background:
              "radial-gradient(ellipse at 30% 20%, rgba(12,13,16,0.35), rgba(12,13,16,0.7) 60%, rgba(12,13,16,0.85))",
          }}
        />
        <FilmGrain />
        <ClickSound />
        <div className="relative z-10">
          <Navbar />
          <main className="pt-24">{children}</main>
          <Footer />
          <EthanMascot />
        </div>
      </div>
    </ThemeProvider>
  );
}
