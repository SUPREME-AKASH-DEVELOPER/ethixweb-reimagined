import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { Bot, Workflow, Brain, MessageSquare, ArrowUpRight, Sparkles } from "lucide-react";
import ethan from "@/assets/ethan.png";

export const Route = createFileRoute("/ai-automation")({
  head: () => ({ meta: [
    { title: "AI & Automation — Ethixweb" },
    { name: "description", content: "Custom AI agents, internal copilots and end-to-end workflow automation." },
    { property: "og:title", content: "AI & Automation Solutions" },
    { property: "og:description", content: "Production-ready AI systems for modern businesses." },
  ]}),
  component: Page,
});

const f = [
  { i: Bot, t: "Custom AI Agents", d: "Domain-trained agents for support, sales and ops." },
  { i: Workflow, t: "Workflow Automation", d: "Zapier-on-steroids: connect any tool, automate any flow." },
  { i: Brain, t: "Internal Copilots", d: "RAG over your docs. Faster decisions everywhere." },
  { i: MessageSquare, t: "Conversational UX", d: "Chat, voice and multi-modal interfaces users love." },
];

function Page() {
  return (
    <SiteLayout>
      <PageHero eyebrow="AI & Automation" title="Software that thinks. Workflows that scale.">
        We build production-grade AI that quietly transforms how your business runs.
      </PageHero>
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl grid lg:grid-cols-[1fr_1.2fr] gap-12 items-center">
          <Reveal>
            <img src={ethan} alt="Ethan AI" className="max-h-[480px] mx-auto" />
          </Reveal>
          <div className="grid sm:grid-cols-2 gap-5">
            {f.map((x, i) => (
              <Reveal key={x.t} delay={i * 0.07}>
                <div className="glass rounded-3xl p-7 h-full">
                  <x.i className="h-9 w-9 text-primary mb-5" strokeWidth={1.5} />
                  <h3 className="font-display text-lg font-semibold">{x.t}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{x.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <CTA />
    </SiteLayout>
  );
}

function CTA() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-7xl glass-strong rounded-[2rem] p-12 text-center">
        <Sparkles className="h-10 w-10 text-primary mx-auto mb-4" />
        <h2 className="font-display text-4xl font-bold text-gradient">Let's automate your hardest process.</h2>
        <Link to="/contact" className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-brand px-7 py-3.5 font-medium shadow-glow">
          Book a discovery call <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
