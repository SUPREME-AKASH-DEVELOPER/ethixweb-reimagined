import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { Target, Heart, Zap, ArrowUpRight } from "lucide-react";
import ethan from "@/assets/ethan.png";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [
    { title: "About — Ethixweb" },
    { name: "description", content: "Meet Ethixweb — a futuristic digital agency obsessed with craft, speed and growth." },
    { property: "og:title", content: "About Ethixweb" },
    { property: "og:description", content: "Our story, values and the team behind the brand." },
  ]}),
  component: About,
});

function About() {
  return (
    <SiteLayout>
      <PageHero eyebrow="About us" title="Built by craftsmen. Powered by AI.">
        We're a small, senior team designing & engineering the next era of digital brands.
      </PageHero>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl grid lg:grid-cols-2 gap-16 items-center">
          <Reveal>
            <img src={ethan} alt="Ethan" className="mx-auto max-h-[500px] drop-shadow-[0_30px_60px_rgba(220,38,38,0.35)]" />
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-sm uppercase tracking-widest text-primary">Our story</p>
            <h2 className="mt-4 font-display text-4xl font-bold text-gradient">Born from the gap between design & growth.</h2>
            <p className="mt-6 text-muted-foreground leading-relaxed">
              Most agencies stop at "pretty." We don't. Ethixweb was founded to merge bold design with measurable
              business outcomes — combining engineering, AI and marketing under one roof.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Today we partner with founders, operators and visionaries who want to look — and perform — like the future.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl grid md:grid-cols-3 gap-5">
          {[
            { icon: Target, t: "Outcome-obsessed", d: "We measure success in conversions, retention and revenue — not awards." },
            { icon: Heart, t: "Craft first", d: "Every pixel, animation and line of code is intentional. No shortcuts." },
            { icon: Zap, t: "Move fast", d: "Senior team, lean process. We ship in weeks, not months." },
          ].map((v, i) => (
            <Reveal key={v.t} delay={i * 0.08}>
              <div className="glass rounded-3xl p-8 h-full">
                <v.icon className="h-10 w-10 text-primary mb-6" strokeWidth={1.5} />
                <h3 className="font-display text-xl font-semibold">{v.t}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{v.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl glass-strong rounded-[2rem] p-12 text-center">
          <h2 className="font-display text-4xl font-bold text-gradient">Want to work with us?</h2>
          <Link to="/contact" className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-brand px-7 py-3.5 font-medium shadow-glow">
            Get in touch <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
