import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowUpRight, Code2, Megaphone, Search, PhoneCall, BarChart3,
  Star, MapPin, ShieldCheck, Rocket, Wrench, Flame, Zap as Bolt,
  Palette, MousePointerClick, Anchor,
} from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Reveal } from "@/components/Reveal";
import { Pricing } from "@/components/Pricing";
import ethan from "@/assets/ethan.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ethixweb — The Tech Department for Your Business" },
      { name: "description", content: "We manage your entire digital operation — from AI booking agents and CRM integrations to websites, SEO and ads. The IT partner that keeps your trucks moving and your boats booking." },
      { property: "og:title", content: "Ethixweb — The Tech Department for Your Business" },
      { property: "og:description", content: "Websites, SEO, PPC, LSAs, AI booking and CRM management for home service businesses." },
    ],
  }),
  component: Home,
});

const services = [
  { icon: Code2, title: "Custom Website Design", desc: "Fully customized websites tailored to your brand, goals and customers.", to: "/web-development" },
  { icon: Search, title: "Search Engine Optimization", desc: "Boost online visibility and attract more customers with result-driven SEO.", to: "/services" },
  { icon: Megaphone, title: "Social Media Marketing", desc: "Engage your audience and grow your brand with impactful social campaigns.", to: "/marketing" },
  { icon: Palette, title: "Graphic Design & Branding", desc: "Transform your brand identity with creative and impactful design.", to: "/services" },
  { icon: PhoneCall, title: "Local Services Ads (LSA)", desc: "Get connected with local customers searching for trusted pros nearby.", to: "/marketing" },
  { icon: MousePointerClick, title: "Pay-Per-Click (PPC)", desc: "Drive targeted traffic and boost sales with cost-effective PPC.", to: "/marketing" },
];

const stats = [
  { value: "2x", label: "Avg. lead lift in 90 days" },
  { value: "$0", label: "Account-manager overhead" },
  { value: "100%", label: "Tracked to revenue" },
  { value: "2023", label: "Founded" },
];

const industries = [
  { icon: Wrench, name: "Plumbing", to: "/industries" },
  { icon: Flame, name: "HVAC", to: "/industries" },
  { icon: Bolt, name: "Electrical", to: "/industries" },
  { icon: Anchor, name: "Fishing & Charters", to: "/industries" },
  { icon: ShieldCheck, name: "Home Services", to: "/industries" },
  { icon: MapPin, name: "Local Businesses", to: "/industries" },
];

const channels = ["WordPress", "Astro", "Headless", "Google Ads", "LSAs", "SEO", "GA4", "GTM", "CallRail", "Meta Ads", "HubSpot", "Zapier"];

function Home() {
  return (
    <SiteLayout>
      <Hero />
      <Marquee />
      <Stats />
      <Services />
      <HowWeWork />
      <Pricing />
      <TechStack />
      <Industries />
      <Testimonials />
      <CTA />
    </SiteLayout>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden -mt-24 pt-32 pb-24 bg-gradient-hero">
      <div className="absolute inset-0 grid-bg opacity-50" />
      <div className="absolute top-1/4 -left-32 h-96 w-96 rounded-full bg-primary/30 blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-0 right-0 h-[28rem] w-[28rem] rounded-full bg-accent/30 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-6 pt-16 grid lg:grid-cols-[1.2fr_1fr] gap-12 items-center">
        <div>
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
              </span>
              The Tech Department for Your Business
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="mt-6 font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.02] text-gradient">
              We run the tech.<br />You run the <span className="text-gradient-brand">business.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground leading-relaxed">
              We manage your entire digital operation — from AI booking agents and CRM integrations to websites,
              SEO and ads. The IT partner that keeps your trucks moving and your boats booking.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/contact" className="group inline-flex items-center gap-2 rounded-full bg-gradient-brand px-7 py-3.5 font-medium shadow-glow hover:scale-[1.03] transition-transform">
                Get Started Now <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
              </Link>
              <a href="tel:+18889021768" className="inline-flex items-center gap-2 rounded-full glass px-7 py-3.5 font-medium hover:bg-white/10 transition">
                <PhoneCall className="h-4 w-4" /> (888) 902-1768
              </a>
            </div>
          </Reveal>
          <Reveal delay={0.4}>
            <div className="mt-12 flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex gap-0.5 text-primary">
                {[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="text-xs max-w-xs">Trusted by HVAC, plumbing, electrical & fishing-charter operators across the US.</p>
            </div>
          </Reveal>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex justify-center"
        >
          <div className="absolute inset-0 bg-gradient-glow blur-3xl" />
          {/* Orbit ring */}
          <motion.div
            className="absolute inset-0 m-auto h-[420px] w-[420px] rounded-full border border-primary/20"
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          >
            <span className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-primary shadow-glow" />
            <span className="absolute top-1/2 -right-1.5 h-2 w-2 -translate-y-1/2 rounded-full bg-accent" />
          </motion.div>
          <motion.div
            className="absolute inset-0 m-auto h-[520px] w-[520px] rounded-full border border-white/5"
            animate={{ rotate: -360 }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          >
            <span className="absolute top-1/2 -left-1 h-2 w-2 -translate-y-1/2 rounded-full bg-primary/70" />
          </motion.div>

          <motion.img
            src={ethan}
            alt="Ethan — Ethixweb mascot"
            className="relative z-10 max-h-[520px] w-auto drop-shadow-[0_30px_60px_rgba(220,38,38,0.45)]"
            animate={{ y: [0, -18, 0], rotate: [-1.5, 1.5, -1.5] }}
            transition={{
              y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 8, repeat: Infinity, ease: "easeInOut" },
            }}
            whileHover={{ scale: 1.04, rotate: 0 }}
          />

          <FloatingBadge className="top-6 -left-2 sm:left-0" icon={PhoneCall} text="More booked jobs" />
          <FloatingBadge className="bottom-10 -right-2 sm:right-0" icon={BarChart3} text="Tracked to revenue" />
          <FloatingBadge className="top-1/2 -right-4" icon={ShieldCheck} text="Senior team" />
        </motion.div>
      </div>
    </section>
  );
}

function FloatingBadge({ className, icon: Icon, text }: { className?: string; icon: any; text: string }) {
  return (
    <motion.div
      className={`absolute z-20 glass-strong rounded-2xl px-4 py-2.5 flex items-center gap-2 text-sm shadow-elegant ${className}`}
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: Math.random() }}
    >
      <Icon className="h-4 w-4 text-primary" />
      <span className="font-medium">{text}</span>
    </motion.div>
  );
}

function Marquee() {
  const items = ["PLUMBING", "HVAC", "ELECTRICAL", "ROOFING", "LOCAL SEO", "GOOGLE ADS", "LSAs"];
  return (
    <div className="border-y border-white/5 py-6 overflow-hidden">
      <div className="flex gap-12 animate-marquee whitespace-nowrap">
        {[...items, ...items, ...items].map((w, i) => (
          <span key={i} className="font-display text-2xl tracking-[0.3em] text-muted-foreground/40 flex items-center gap-12">
            {w} <span className="text-primary">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function Stats() {
  return (
    <section className="py-24 px-6">
      <div className="mx-auto max-w-7xl grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08}>
            <div className="glass rounded-2xl p-8 hover:bg-white/[0.06] transition group">
              <div className="font-display text-5xl font-bold text-gradient-brand">{s.value}</div>
              <div className="mt-2 text-sm text-muted-foreground">{s.label}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Services() {
  return (
    <section className="py-24 px-6">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-widest text-primary mb-4">What we do</p>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-gradient">
              A full-stack growth partner for home service businesses.
            </h2>
          </div>
        </Reveal>
        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.06}>
              <Link to={s.to} className="group relative block h-full overflow-hidden rounded-3xl glass p-8 hover:bg-white/[0.06] transition">
                <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-primary/30 blur-3xl opacity-0 group-hover:opacity-100 transition" />
                <s.icon className="h-10 w-10 text-primary mb-6" strokeWidth={1.5} />
                <h3 className="font-display text-xl font-semibold">{s.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                <div className="mt-6 inline-flex items-center gap-1 text-sm text-primary">
                  Learn more <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowWeWork() {
  const steps = [
    { n: "01", t: "Audit & strategy", d: "We dig into your market, competitors, current funnel and tracking. You get a clear plan — not a pitch deck." },
    { n: "02", t: "Build & launch", d: "Website, ads, LSAs and tracking go live fast. Senior people do the work. No handoffs to junior account managers." },
    { n: "03", t: "Optimize for revenue", d: "Weekly iteration on creative, landing pages and bids. We report on booked jobs and revenue — not impressions." },
  ];
  return (
    <section className="py-24 px-6">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-widest text-primary mb-4">How we work</p>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-gradient">
              Tired of being one of 200 accounts at a big agency?
            </h2>
            <p className="mt-6 text-muted-foreground leading-relaxed max-w-xl">
              We operate as a small, senior team. You talk directly to the people doing the work. We move fast, ship clean,
              and report on what matters: leads, bookings and revenue.
            </p>
          </div>
        </Reveal>
        <div className="mt-16 grid md:grid-cols-3 gap-5">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.08}>
              <div className="glass rounded-3xl p-8 h-full">
                <div className="font-display text-5xl font-bold text-gradient-brand">{s.n}</div>
                <h3 className="mt-6 font-display text-xl font-semibold">{s.t}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function TechStack() {
  return (
    <section className="py-24 px-6">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-sm uppercase tracking-widest text-primary mb-4">Platforms & channels</p>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-gradient">Built on what actually works.</h2>
          </div>
        </Reveal>
        <div className="mt-12 flex flex-wrap justify-center gap-3">
          {channels.map((t, i) => (
            <Reveal key={t} delay={i * 0.03}>
              <div className="glass rounded-full px-5 py-2.5 text-sm hover:bg-primary/20 hover:border-primary/40 transition">{t}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Industries() {
  return (
    <section className="py-24 px-6">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="max-w-xl mb-12">
            <p className="text-sm uppercase tracking-widest text-primary mb-4">Industries</p>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-gradient">Built for home services first.</h2>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {industries.map((ind, i) => (
            <Reveal key={ind.name} delay={i * 0.04}>
              <Link to={ind.to} className="group glass rounded-2xl p-6 flex items-center justify-between hover:bg-white/[0.06] transition">
                <div className="flex items-center gap-3">
                  <ind.icon className="h-5 w-5 text-primary" />
                  <span className="font-display text-lg">{ind.name}</span>
                </div>
                <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:rotate-45 transition" />
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const items = [
    { q: "Ethixweb understood our requirements immediately and turned them into a professional, user-friendly website. The attention to detail was impressive.", a: "Emily Turner", r: "Client" },
    { q: "Sharp, modern looking and has all the bells and whistles we need. Easy to work with, great communication, done efficiently. I'd highly recommend them!", a: "Kayla Kjl", r: "Client" },
    { q: "Ethixweb delivered a clean, modern website that represents our brand perfectly. Professional, responsive, and completed on schedule.", a: "James Walker", r: "Client" },
  ];
  return (
    <section className="py-24 px-6">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-widest text-primary mb-4">What clients say</p>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-gradient">Quiet work. Loud results.</h2>
          </div>
        </Reveal>
        <div className="mt-12 grid md:grid-cols-3 gap-5">
          {items.map((t, i) => (
            <Reveal key={t.a} delay={i * 0.08}>
              <div className="glass rounded-3xl p-8 h-full flex flex-col">
                <div className="flex gap-0.5 text-primary mb-4">
                  {[1,2,3,4,5].map(s => <Star key={s} className="h-4 w-4 fill-current" />)}
                </div>
                <p className="text-foreground/90 leading-relaxed flex-1">"{t.q}"</p>
                <div className="mt-6 pt-6 border-t border-white/5">
                  <p className="font-medium">{t.a}</p>
                  <p className="text-sm text-muted-foreground">{t.r}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="py-24 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-brand shadow-glow p-12 lg:p-20 text-center">
          <div className="absolute inset-0 grid-bg opacity-30" />
          <Reveal>
            <h2 className="relative font-display text-4xl lg:text-6xl font-bold leading-tight">
              Let's get you more<br />booked jobs.
            </h2>
            <p className="relative mt-6 text-lg text-primary-foreground/80 max-w-xl mx-auto">
              Tell us about your business. We'll come back with a clear, no-jargon plan you can actually run.
            </p>
            <div className="relative mt-10 flex flex-wrap justify-center gap-4">
              <Link to="/contact" className="group inline-flex items-center gap-2 rounded-full bg-background px-7 py-3.5 font-medium text-foreground hover:scale-[1.03] transition-transform">
                Start a project <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
              </Link>
              <Link to="/services" className="inline-flex items-center gap-2 rounded-full glass px-7 py-3.5 font-medium hover:bg-white/20">
                Explore services
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
