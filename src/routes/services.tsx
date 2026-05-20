import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { Code2, Bot, Megaphone, Search, Palette, Zap, ShoppingCart, Smartphone, ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/services")({
  head: () => ({ meta: [
    { title: "Services — Ethixweb" },
    { name: "description", content: "Web development, AI automation, branding, marketing and SEO — engineered for ambitious brands." },
    { property: "og:title", content: "Ethixweb Services" },
    { property: "og:description", content: "Full-stack agency services for the modern internet." },
  ]}),
  component: Services,
});

const items = [
  { icon: Code2, t: "Web Development", d: "Marketing sites, SaaS apps, e-commerce — built fast & built right.", to: "/web-development" },
  { icon: Bot, t: "AI & Automation", d: "Custom agents, internal tools and end-to-end workflow automation.", to: "/ai-automation" },
  { icon: Megaphone, t: "Performance Marketing", d: "Paid social, paid search and lifecycle that compound monthly.", to: "/marketing" },
  { icon: Search, t: "SEO", d: "Technical foundations, content engines and authority building.", to: "/services" },
  { icon: Palette, t: "Branding & Identity", d: "Logos, design systems and visual languages that feel iconic.", to: "/services" },
  { icon: Zap, t: "Product Design", d: "User flows, prototyping and interfaces users actually love.", to: "/services" },
  { icon: ShoppingCart, t: "E-commerce", d: "Shopify, custom storefronts and conversion-focused stores.", to: "/services" },
  { icon: Smartphone, t: "Mobile Apps", d: "Native-feeling cross-platform apps with React Native.", to: "/services" },
];

function Services() {
  return (
    <SiteLayout>
      <PageHero eyebrow="Services" title="Everything your brand needs to win.">
        From first sketch to launch — and every growth lever after.
      </PageHero>
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((s, i) => (
            <Reveal key={s.t} delay={i * 0.05}>
              <Link to={s.to} className="group block h-full glass rounded-3xl p-7 hover:bg-white/[0.06] transition">
                <s.icon className="h-9 w-9 text-primary mb-5" strokeWidth={1.5} />
                <h3 className="font-display text-lg font-semibold">{s.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
                <ArrowUpRight className="mt-5 h-4 w-4 text-primary group-hover:rotate-45 transition" />
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
