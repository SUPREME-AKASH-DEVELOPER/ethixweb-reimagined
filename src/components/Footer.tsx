import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { Github, Linkedin, Twitter, Instagram, ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative mt-32 border-t border-white/5">
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-6 max-w-sm text-sm text-muted-foreground leading-relaxed">
              Ethixweb is a digital marketing &amp; web development agency helping US home service businesses — plumbing, HVAC and electrical — grow with real, revenue-focused marketing.
            </p>
            <p className="mt-4 text-xs text-muted-foreground">
              hello@ethixweb.com · +91 96250 06088
            </p>
            <div className="mt-6 flex gap-2">
              {[Twitter, Linkedin, Github, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="p-2 rounded-lg glass hover:bg-white/10 transition">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          <FooterCol title="Company" links={[["About","/about"],["Careers","/careers"],["Blog","/blog"],["Contact","/contact"]]} />
          <FooterCol title="Services" links={[["Web Development","/web-development"],["AI & Automation","/ai-automation"],["Marketing","/marketing"],["All services","/services"]]} />
          <FooterCol title="Work" links={[["Portfolio","/portfolio"],["Case studies","/portfolio"]]} />
        </div>
        <div className="mt-16 flex flex-col gap-4 sm:flex-row items-center justify-between border-t border-white/5 pt-8">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Ethixweb. All rights reserved.</p>
          <Link to="/contact" className="group inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            Let's build something <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
          </Link>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">{title}</h4>
      <ul className="space-y-2.5">
        {links.map(([label, to]) => (
          <li key={to}>
            <Link to={to} className="text-sm text-foreground/80 hover:text-primary transition-colors">{label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
