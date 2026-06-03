import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { EthanMascot } from "./EthanMascot";
import { ClickSound } from "./ClickSound";
import { ThemeProvider } from "./ThemeProvider";

const BACKGROUND_IMAGE_URL = "/__l5e/assets-v1/64bc2ea6-b45f-4c1f-a80f-356b0ca006de/ethixweb-business-cards-bg.png";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground relative">
        <img
          aria-hidden
          src={BACKGROUND_IMAGE_URL}
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
