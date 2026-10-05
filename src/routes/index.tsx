import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowDown, ArrowRight, ArrowUpRight, Check, ChevronUp, Code2, Copy,
  Gamepad2, GraduationCap, LayoutTemplate, Menu, Monitor, Palette,
  Play, Search, ShoppingBag, Smartphone, Sparkles, Users, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { process, projects, services } from "@/lib/portfolio-data";
import leaderPhoto from "@/assets/team-leader.jpeg.asset.json";
import logo from "@/assets/teamwork-digital-logo.jpeg.asset.json";
import profile from "@/assets/teamwork-digital-profile.pdf.asset.json";

const icons = {
  mobile: Smartphone, web: Monitor, layout: LayoutTemplate, shop: ShoppingBag,
  design: Palette, video: Play, game: Gamepad2, ai: Sparkles,
  leads: Search, academic: GraduationCap, code: Code2,
};

const nav = [
  { label: "Home", href: "#home" }, { label: "Services", href: "#services" },
  { label: "About", href: "#about" }, { label: "Expertise", href: "#expertise" },
  { label: "Projects", href: "#projects" }, { label: "Contact", href: "#contact" },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Teamwork Digital — Complete Software Development Team" },
      { name: "description", content: "Teamwork Digital builds mobile apps, websites, e-commerce stores, AI solutions, games, design, video, and more. One team from idea to delivery." },
      { property: "og:title", content: "Teamwork Digital — Complete Software Development Team" },
      { property: "og:description", content: "Mobile apps, websites, e-commerce, AI, games and digital services from one complete team." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Portfolio,
});

function Brand({ compact = false }: { compact?: boolean }) {
  return <a href="#home" className="inline-flex items-center gap-2.5 text-foreground" aria-label="Teamwork Digital, home">
    <img src={logo.url} alt="" className={`${compact ? "size-9" : "size-10"} rounded-full object-cover`} />
    <span className="font-display text-[.82rem] font-extrabold leading-[1.05] tracking-normal">TEAMWORK<br/><span className="text-primary">DIGITAL.</span></span>
  </a>;
}

function Portfolio() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyProfile = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return <div className="overflow-x-hidden bg-background text-foreground">
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur-xl">
      <div className="portfolio-container flex h-[76px] items-center justify-between gap-6">
        <Brand />
        <nav aria-label="Main navigation" className="hidden items-center gap-7 lg:flex">
          {nav.map(item => <a key={item.href} href={item.href} className="text-[.78rem] font-bold text-muted-foreground transition-colors hover:text-primary">{item.label}</a>)}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <a href={profile.url} target="_blank" rel="noopener noreferrer" className="text-[.78rem] font-bold text-foreground hover:text-primary">Company profile <ArrowUpRight className="ml-1 inline size-3.5" /></a>
          <Button asChild className="h-10 rounded-full px-5 text-xs font-bold"><a href="#contact">Let's talk <ArrowUpRight /></a></Button>
        </div>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label={menuOpen ? "Close menu" : "Open menu"} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</Button>
      </div>
      {menuOpen && <nav aria-label="Mobile navigation" className="border-t border-border bg-background px-5 py-3 lg:hidden">
        {nav.map(item => <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className="block border-b border-border py-3 text-sm font-bold">{item.label}</a>)}
        <a href={profile.url} target="_blank" rel="noopener noreferrer" className="block py-3 text-sm font-bold text-primary">Company profile ↗</a>
      </nav>}
    </header>

    <main>
      <section id="home" className="relative isolate overflow-hidden pt-[76px]">
        <div aria-hidden="true" className="hero-grid absolute inset-0 -z-10 opacity-25" />
        <div className="portfolio-container relative flex min-h-[min(800px,calc(100svh-76px))] flex-col justify-center pb-14 pt-16 sm:pt-24">
          <div className="mx-auto max-w-[1060px] text-center">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-[.7rem] font-extrabold uppercase tracking-[.14em] text-primary shadow-sm"><span className="size-2 rounded-full bg-brand-blue" /> A complete digital team, under one roof</span>
            <h1 className="font-display text-[clamp(3rem,8vw,7.5rem)] font-extrabold leading-[1.04] tracking-normal">We are <span className="text-primary">Teamwork</span><br/>Digital<span className="text-primary">.</span></h1>
            <p className="mx-auto mt-7 max-w-[665px] text-base leading-8 text-muted-foreground md:text-lg">From mobile apps and websites to AI, design and beyond — we bring the right people together to turn your idea into something real.</p>
          </div>
          <div className="relative mx-auto mt-10 flex w-full max-w-[1000px] flex-col items-center justify-between gap-9 md:mt-5 md:min-h-[340px] md:flex-row">
            <div className="order-2 max-w-[220px] text-center md:order-1 md:text-left">
              <span className="font-editorial text-5xl leading-none text-primary">“</span>
              <p className="mt-1 text-sm leading-7 text-muted-foreground">Your vision. Our expertise. One team from idea to delivery.</p>
            </div>
            <div className="portrait-glow relative order-1 flex h-[300px] w-[270px] flex-none items-end justify-center md:absolute md:left-1/2 md:top-1/2 md:order-2 md:h-[370px] md:w-[340px] md:-translate-x-1/2 md:-translate-y-1/2">
              <div className="absolute inset-5 rounded-full border border-primary/20" />
              <div className="absolute inset-0 rounded-full border border-primary/10" />
              <div className="relative h-[260px] w-[230px] overflow-hidden rounded-t-[130px] rounded-b-[16px] border-[8px] border-card bg-card shadow-xl md:h-[320px] md:w-[285px]">
                <img src={leaderPhoto.url} alt="Team leader and project manager" className="h-full w-full object-cover object-top" />
              </div>
              <span className="absolute -bottom-2 rounded-full border border-border bg-card px-4 py-2 text-[.65rem] font-extrabold uppercase tracking-[.12em] shadow-md">Team leader / Project manager</span>
            </div>
            <div className="order-3 max-w-[220px] text-center md:text-right">
              <span className="eyebrow text-primary">What we build</span>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">Mobile apps. Websites. E-commerce. AI. Games. Creative work.</p>
            </div>
          </div>
          <div className="mx-auto mt-12 flex flex-wrap justify-center gap-3 md:mt-6">
            <Button asChild className="h-12 rounded-full px-6 text-sm font-bold"><a href="#services">Explore services <ArrowDown /></a></Button>
            <Button asChild variant="outline" className="h-12 rounded-full px-6 text-sm font-bold"><a href="#projects">View our work <ArrowUpRight /></a></Button>
          </div>
        </div>
      </section>

      <div className="overflow-hidden border-y border-border bg-card py-5" aria-label="Our capabilities"><div className="ticker-track flex w-max items-center gap-10 whitespace-nowrap text-[.72rem] font-extrabold uppercase tracking-[.18em] text-muted-foreground">{Array.from({ length: 2 }, (_, i) => <div key={i} className="flex items-center gap-10">{["Flutter", "React Native", "WordPress", "Wix Studio", "Shopify", "AI Solutions", "Game Development", "Graphic Design", "Video Editing", "Lead Generation"].map(x => <span key={x} className="flex items-center gap-10">{x}<span className="size-1.5 rounded-full bg-primary" /></span>)}</div>)}</div></div>

      <section id="services" className="bg-surface-ink py-24 text-on-dark md:py-32">
        <div className="portfolio-container">
          <div className="mb-12 flex flex-col justify-between gap-6 md:mb-16 md:flex-row md:items-end">
            <div><span className="eyebrow text-brand-cyan">What we do</span><h2 className="section-heading mt-4">What we <span className="font-editorial italic text-brand-cyan">build</span> for you.</h2></div>
            <p className="max-w-[390px] text-sm leading-7 text-on-dark-muted">From the first idea to the finished product, one team across development, design and digital services.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => { const Icon = icons[service.icon]; return <article key={service.title} className="service-card flex min-h-[285px] flex-col rounded-md border border-on-dark/15 bg-on-dark/5 p-7">
              <div className="flex items-start justify-between"><span className="flex size-12 items-center justify-center rounded-md bg-primary/20 text-brand-cyan"><Icon size={24} strokeWidth={1.7} /></span><span className="text-xs font-bold text-on-dark-muted">{String(i + 1).padStart(2, "0")}</span></div>
              <h3 className="mt-7 font-display text-lg font-bold">{service.title}</h3>
              <p className="mt-3 flex-1 text-[.83rem] leading-6 text-on-dark-muted">{service.description}</p>
              <div className="mt-6 flex flex-wrap gap-2">{service.tags.map(tag => <span key={tag} className="rounded-full border border-on-dark/15 px-2.5 py-1 text-[.65rem] font-semibold text-on-dark-muted">{tag}</span>)}</div>
            </article>; })}
          </div>
        </div>
      </section>

      <section id="about" className="py-24 md:py-32"><div className="portfolio-container grid gap-14 lg:grid-cols-[.92fr_1.08fr] lg:items-center lg:gap-24">
        <div className="relative overflow-hidden rounded-md bg-surface-violet px-8 py-10 text-on-dark md:px-12 md:py-14">
          <span className="eyebrow text-on-dark/75">Our promise</span>
          <p className="font-display mt-14 text-[clamp(2rem,3.6vw,3.5rem)] font-semibold leading-[1.2]">Big ideas deserve a team that can make them happen<span className="font-editorial italic text-brand-cyan">.</span></p>
          <div className="mt-14 space-y-4 border-t border-on-dark/30 pt-8">{["One team, many disciplines", "Quality at every step", "Clear communication", "Long-term support"].map(item => <div key={item} className="flex items-center gap-3 text-sm font-semibold"><Check className="size-4 text-brand-cyan" />{item}</div>)}</div>
        </div>
        <div><span className="eyebrow text-primary">About us</span><h2 className="section-heading mt-5">A team built to <span className="font-editorial italic text-primary">do more.</span></h2><p className="mt-7 text-base leading-8 text-muted-foreground">Teamwork Digital is a complete software development team focused on practical, modern and reliable digital solutions. We combine development, design, AI and digital services so you can work with one team from idea to delivery.</p><p className="mt-5 text-base leading-8 text-muted-foreground">We handle websites, mobile applications, e-commerce platforms, games, design and custom software projects with a focus on communication, quality and client satisfaction.</p><Button asChild variant="outline" className="mt-9 h-11 rounded-full px-6 font-bold"><a href={profile.url} target="_blank" rel="noopener noreferrer">Read our profile <ArrowUpRight /></a></Button></div>
      </div></section>

      <section id="expertise" className="bg-surface-cream py-24 md:py-32"><div className="portfolio-container">
        <div className="mb-14 flex flex-col justify-between gap-7 md:flex-row md:items-end"><div><span className="eyebrow text-primary">Expertise</span><h2 className="section-heading mt-5">One team. <span className="font-editorial italic text-primary">Many skills.</span></h2></div><p className="max-w-sm text-sm leading-7 text-muted-foreground">Our capabilities span development, creative work and growth support — all working together.</p></div>
        <div className="grid gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-2 lg:grid-cols-4">
          {[{ name: "Mobile first", detail: "Cross-platform apps for Android and iOS", items: ["Flutter", "React Native", "Firebase", "APIs"], icon: Smartphone }, { name: "Web & commerce", detail: "Websites and stores built to work beautifully", items: ["WordPress", "Wix Studio", "Shopify", "Custom web"], icon: Monitor }, { name: "Intelligent tools", detail: "Practical AI and interactive experiences", items: ["Chatbots", "AI assistants", "Automation", "Web games"], icon: Sparkles }, { name: "Creative & growth", detail: "The visuals and support behind the launch", items: ["UI/UX", "Graphic design", "Video editing", "Lead generation"], icon: Palette }].map(group => <div key={group.name} className="bg-background p-8"><group.icon className="size-8 text-primary" strokeWidth={1.5} /><h3 className="font-display mt-8 text-lg font-bold">{group.name}</h3><p className="mt-2 min-h-12 text-xs leading-6 text-muted-foreground">{group.detail}</p><ul className="mt-7 space-y-3 border-t border-border pt-6">{group.items.map(item => <li key={item} className="flex items-center gap-2 text-sm font-semibold"><span className="size-1 rounded-full bg-primary" />{item}</li>)}</ul></div>)}
        </div>
      </div></section>

      <section id="projects" className="py-24 md:py-32"><div className="portfolio-container">
        <div className="mb-14 flex flex-col justify-between gap-7 md:flex-row md:items-end"><div><span className="eyebrow text-primary">Portfolio</span><h2 className="section-heading mt-5">Selected <span className="font-editorial italic text-primary">work.</span></h2></div><p className="max-w-sm text-sm leading-7 text-muted-foreground">Explore the live examples listed in our company portfolio.</p></div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{projects.map((project, i) => <a key={project.title} href={project.url} target="_blank" rel="noopener noreferrer" className="group flex min-h-[235px] flex-col justify-between rounded-md border border-border bg-card p-7 transition-colors hover:border-primary hover:bg-accent/35"><div className="flex items-start justify-between"><span className="flex size-14 items-center justify-center rounded-md bg-secondary font-display text-lg font-extrabold text-primary">{project.initials}</span><ArrowUpRight className="size-5 text-muted-foreground transition-colors group-hover:text-primary" /></div><div><span className="eyebrow text-muted-foreground">{String(i + 1).padStart(2, "0")} / {project.type}</span><h3 className="font-display mt-3 text-lg font-bold">{project.title}</h3><span className="mt-2 block truncate text-xs text-muted-foreground">{project.url.replace(/^https?:\/\//, "")}</span></div></a>)}</div>
      </div></section>

      <section id="process" className="bg-surface-ink py-24 text-on-dark md:py-32"><div className="portfolio-container"><span className="eyebrow text-brand-cyan">How we work</span><h2 className="section-heading mt-5">From idea <span className="font-editorial italic text-brand-cyan">to impact.</span></h2><div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-5">{process.map((step, i) => <div key={step.title} className="border-t border-on-dark/25 pt-6"><span className="font-display text-3xl font-bold text-brand-cyan">{String(i + 1).padStart(2, "0")}</span><h3 className="font-display mt-9 text-base font-bold">{step.title}</h3><p className="mt-3 text-xs leading-6 text-on-dark-muted">{step.description}</p></div>)}</div></div></section>

      <section id="contact" className="bg-surface-violet py-24 text-on-dark md:py-32"><div className="portfolio-container flex flex-col items-start justify-between gap-12 md:flex-row md:items-end"><div className="max-w-[820px]"><span className="eyebrow text-on-dark/75">Let's connect</span><h2 className="section-heading mt-5 text-[clamp(2.7rem,6vw,6rem)]">Let's build something <span className="font-editorial italic text-brand-cyan">great together.</span></h2><p className="mt-8 max-w-xl text-base leading-8 text-on-dark/80">Need a website improvement, a mobile app, an AI solution or a complete software project? We'd love to hear what you're working on.</p></div><div className="flex flex-wrap gap-3"><Button asChild className="h-12 rounded-full bg-on-dark px-6 font-bold text-surface-ink hover:bg-on-dark/90"><a href={profile.url} target="_blank" rel="noopener noreferrer">Company profile <ArrowUpRight /></a></Button><Button variant="outline" className="h-12 rounded-full border-on-dark/50 bg-transparent px-6 font-bold text-on-dark hover:bg-on-dark/15 hover:text-on-dark" onClick={copyProfile}>{copied ? <Check /> : <Copy />}{copied ? "Link copied" : "Share this page"}</Button></div></div></section>
    </main>

    <footer className="bg-surface-ink py-12 text-on-dark"><div className="portfolio-container"><div className="grid gap-12 border-b border-on-dark/15 pb-14 md:grid-cols-[1.5fr_1fr_1fr]"><div><div className="inline-flex items-center gap-3"><img src={logo.url} alt="" className="size-12 rounded-full object-cover"/><span className="font-display text-lg font-extrabold leading-tight">TEAMWORK<br/>DIGITAL.</span></div><p className="mt-6 max-w-xs text-sm leading-7 text-on-dark-muted">A complete software development team. Your vision, our expertise.</p></div><div><span className="eyebrow text-on-dark-muted">Navigate</span><div className="mt-5 grid grid-cols-2 gap-3">{nav.map(item => <a key={item.href} href={item.href} className="text-xs font-semibold hover:text-brand-cyan">{item.label}</a>)}</div></div><div><span className="eyebrow text-on-dark-muted">Explore</span><div className="mt-5 space-y-3"><a href="#services" className="block text-xs font-semibold hover:text-brand-cyan">Our services</a><a href="#projects" className="block text-xs font-semibold hover:text-brand-cyan">Selected work</a><a href={profile.url} target="_blank" rel="noopener noreferrer" className="block text-xs font-semibold hover:text-brand-cyan">Company profile ↗</a></div></div></div><div className="flex flex-wrap items-center justify-between gap-5 pt-7 text-xs text-on-dark-muted"><span>© {new Date().getFullYear()} Teamwork Digital. All rights reserved.</span><a href="#home" className="inline-flex items-center gap-2 font-bold text-on-dark hover:text-brand-cyan">Back to top <ChevronUp className="size-4" /></a></div></div></footer>
  </div>;
}