import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/portfolio")({
  head: () => ({ meta: [
    { title: "Work — Ethixweb" },
    { name: "description", content: "Selected work and case studies from Ethixweb." },
    { property: "og:title", content: "Selected Work — Ethixweb" },
    { property: "og:description", content: "Premium digital projects that move metrics." },
  ]}),
  component: Portfolio,
});

const projects = [
  { t: "NovaPay", c: "FinTech", d: "Redesigned brand & marketing site. +218% signups.", tag: "Web · Brand" },
  { t: "ShipForge", c: "Logistics SaaS", d: "AI support agent + dashboard rebuild.", tag: "AI · Product" },
  { t: "Lumen Studio", c: "Architecture", d: "Editorial portfolio & CMS in 3 weeks.", tag: "Web" },
  { t: "Reef & Rod", c: "Fishing", d: "E-commerce + content engine.", tag: "Shopify · SEO" },
  { t: "Northwind HVAC", c: "Home Services", d: "Local SEO + lead gen system.", tag: "SEO · Web" },
  { t: "Mira Health", c: "Healthcare", d: "Patient portal + automation.", tag: "Product · AI" },
];

function Portfolio() {
  return (
    <SiteLayout>
      <PageHero eyebrow="Selected work" title="Brands we've helped move forward.">
        A glimpse of recent collaborations across SaaS, commerce and services.
      </PageHero>
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl grid md:grid-cols-2 gap-5">
          {projects.map((p, i) => (
            <Reveal key={p.t} delay={i * 0.06}>
              <div className="group relative overflow-hidden rounded-3xl glass aspect-[4/3] p-8 flex flex-col justify-between hover:bg-white/[0.06] transition">
                <div className="absolute inset-0 bg-gradient-brand opacity-10 group-hover:opacity-30 transition" />
                <div className="absolute -bottom-32 -right-20 h-64 w-64 rounded-full bg-primary/40 blur-3xl opacity-40 group-hover:opacity-80 transition" />
                <div className="relative">
                  <span className="text-xs uppercase tracking-widest text-primary">{p.tag}</span>
                </div>
                <div className="relative">
                  <p className="text-sm text-muted-foreground">{p.c}</p>
                  <h3 className="mt-1 font-display text-3xl font-bold">{p.t}</h3>
                  <p className="mt-3 text-foreground/80">{p.d}</p>
                  <div className="mt-5 inline-flex items-center gap-1 text-sm text-primary">
                    View case study <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
