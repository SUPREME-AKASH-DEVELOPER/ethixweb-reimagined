import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { EthanMascot } from "./EthanMascot";
import { ClickSound } from "./ClickSound";
import { ThemeProvider } from "./ThemeProvider";
import backgroundAsset from "@/assets/ethixweb-business-cards-bg.png.asset.json";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground relative">
        <img
          aria-hidden
          src={backgroundAsset.url}
          alt=""
          className="fixed inset-0 z-0 h-screen w-screen object-cover object-center pointer-events-none select-none"
        />
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
