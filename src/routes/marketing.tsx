import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { Megaphone, TrendingUp, Target, Mail, ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/marketing")({
  head: () => ({ meta: [
    { title: "Marketing — Ethixweb" },
    { name: "description", content: "Performance marketing, SEO and lifecycle systems that compound." },
    { property: "og:title", content: "Marketing Solutions" },
    { property: "og:description", content: "Growth systems engineered for compounding returns." },
  ]}),
  component: Page,
});

const f = [
  { i: Target, t: "Paid Acquisition", d: "Meta, Google, TikTok — full funnel, profitable scale." },
  { i: TrendingUp, t: "SEO & Content", d: "Technical, on-page and authority. Rankings that hold." },
  { i: Mail, t: "Lifecycle & CRM", d: "Email, SMS and onboarding flows that drive LTV." },
  { i: Megaphone, t: "Brand Campaigns", d: "Stories that travel. Creative that converts." },
];

function Page() {
  return (
    <SiteLayout>
      <PageHero eyebrow="Marketing" title="Growth systems that compound.">
        Acquisition, retention and revenue — engineered as one machine.
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
          <h2 className="font-display text-4xl font-bold text-gradient">Ready to grow?</h2>
          <Link to="/contact" className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-brand px-7 py-3.5 font-medium shadow-glow">
            Get a growth audit <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
