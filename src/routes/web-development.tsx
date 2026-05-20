import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { Code2, Gauge, Smartphone, Layers, ArrowUpRight, Rocket } from "lucide-react";

export const Route = createFileRoute("/web-development")({
  head: () => ({ meta: [
    { title: "Web Development — Ethixweb" },
    { name: "description", content: "Marketing sites, SaaS apps, e-commerce. Engineered for performance and conversion." },
    { property: "og:title", content: "Web Development Solutions" },
    { property: "og:description", content: "Premium websites and web apps that convert." },
  ]}),
  component: Page,
});

const f = [
  { i: Code2, t: "Modern stack", d: "React, Next.js, TanStack — engineered for the long run." },
  { i: Gauge, t: "Blazing fast", d: "100-score Lighthouse is the baseline, not the goal." },
  { i: Smartphone, t: "Pixel responsive", d: "Designed for every screen, from watch to wall." },
  { i: Layers, t: "Headless CMS", d: "Empower your team to ship content without devs." },
];

function Page() {
  return (
    <SiteLayout>
      <PageHero eyebrow="Web Development" title="Websites that work as hard as you do.">
        From conversion-focused landing pages to complex SaaS — built right, shipped fast.
      </PageHero>
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {f.map((x, i) => (
            <Reveal key={x.t} delay={i * 0.06}>
              <div className="glass rounded-3xl p-7 h-full">
                <x.i className="h-9 w-9 text-primary mb-5" strokeWidth={1.5} />
                <h3 className="font-display text-lg font-semibold">{x.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{x.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl glass-strong rounded-[2rem] p-12 text-center">
          <Rocket className="h-10 w-10 text-primary mx-auto mb-4" />
          <h2 className="font-display text-4xl font-bold text-gradient">Launch in as little as 21 days.</h2>
          <Link to="/contact" className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-brand px-7 py-3.5 font-medium shadow-glow">
            Start your build <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
