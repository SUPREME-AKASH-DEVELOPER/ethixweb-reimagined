import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground noise">
      <Navbar />
      <main className="pt-24">{children}</main>
      <Footer />
    </div>
  );
}
