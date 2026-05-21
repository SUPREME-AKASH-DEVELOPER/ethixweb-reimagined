import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { EthanMascot } from "./EthanMascot";
import { ClickSound } from "./ClickSound";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground noise">
      <ClickSound />
      <Navbar />
      <main className="pt-24">{children}</main>
      <Footer />
      <EthanMascot />
    </div>
  );
}

