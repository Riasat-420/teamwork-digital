import { createFileRoute, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Mail, ArrowDown, ArrowRight, ArrowUpRight, Check, ChevronUp, Code2, Gamepad2, GraduationCap, LifeBuoy, MessageCircle, Plus, LayoutTemplate, Menu, Monitor, Palette, Play, Search, ShoppingBag, Smartphone, Sparkles, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { contact, faqs, process, projectCategories, projects, reasons, services, team, techStack } from "@/lib/portfolio-data";
import leaderPhoto from "@/assets/team-leader.jpeg.asset.json";
import logo from "@/assets/teamwork-digital-logo.jpeg.asset.json";
import profile from "@/assets/teamwork-digital-profile.pdf.asset.json";
import lovePawsPreview from "@/assets/love-paws.png.asset.json";
import americanWebsPreview from "@/assets/american-webs.png.asset.json";
import aberasPreview from "@/assets/aberas.png.asset.json";
import blackGrainPreview from "@/assets/black-grain-clean.png.asset.json";

const localPreviews: Record<string, string> = { "Love Paws Walk": lovePawsPreview.url, "American Webs Studios": americanWebsPreview.url, "Aberas Construction": aberasPreview.url, "Black & Grain": blackGrainPreview.url };
const previewFor = (title: string, url: string) => localPreviews[title] ?? `https://image.thum.io/get/width/1200/crop/760/noanimate/${url}`;

const reasonIcons = { users: Users, code: Code2, check: Check, chat: MessageCircle, support: LifeBuoy };
const teamIcons = [Users, Smartphone, Monitor, Palette];
const icons = { mobile: Smartphone, web: Monitor, layout: LayoutTemplate, shop: ShoppingBag, design: Palette, video: Play, game: Gamepad2, ai: Sparkles, leads: Search, academic: GraduationCap, code: Code2 };
const nav = [
  { label: "Services", href: "#services" }, { label: "Work", href: "#projects" },
  { label: "Process", href: "#experience" }, { label: "Team", href: "#team" },
  { label: "FAQ", href: "#faq" }, { label: "Contact", href: "#contact" },
];

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Teamwork Digital — Complete Software Development Team" },
    { name: "description", content: "Teamwork Digital builds mobile apps, websites, e-commerce stores, AI solutions, games, design and more. One team from idea to delivery." },
    { property: "og:title", content: "Teamwork Digital — Complete Software Development Team" },
    { property: "og:description", content: "Mobile apps, websites, e-commerce, AI, games and digital services from one complete team." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Portfolio,
});

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`reveal ${className}`}>{children}</div>;
}

function Eyebrow({ children }: { children: React.ReactNode }) { return <span className="portfolio-eyebrow"><span className="portfolio-dot" />{children}</span>; }
function Heading({ children }: { children: React.ReactNode }) { return <h2 className="portfolio-heading">{children}</h2>; }
function Brand() { return <a href="#home" className="portfolio-brand" aria-label="Teamwork Digital, home"><img src={logo.url} alt="" /><span>TEAMWORK<span className="text-primary"> DIGITAL.</span></span></a>; }

export function Portfolio() {
  const isChatPage = useRouterState({ select: state => state.location.pathname.startsWith("/chat/") });
  const pageRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("#home");
  const [loading, setLoading] = useState(!isChatPage);
  const [scrolled, setScrolled] = useState(false);
  const [filter, setFilter] = useState<(typeof projectCategories)[number]>("All");
  const filtered = projects.filter(p => filter === "All" || p.category === filter);
  useEffect(() => {
    const page = pageRef.current;
    if (!page || loading) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const targets = page.querySelectorAll<HTMLElement>([
      ".reveal", ".pm-intro > *", ".pm-value-copy > *", ".contact-copy > *", ".contact-faq-head > *", ".faq-list > *",
    ].join(","));
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0, rootMargin: "0px 0px -24px 0px" });
    targets.forEach(node => {
      if (!node.classList.contains("reveal")) node.classList.add("scroll-reveal");
      const index = Array.from(node.parentElement?.children ?? []).indexOf(node);
      node.style.setProperty("--reveal-delay", `${Math.min(Math.max(index, 0), 3) * 55}ms`);
      if (reducedMotion.matches) node.classList.add("is-visible");
      else if (!node.classList.contains("is-visible")) observer.observe(node);
    });
    page.classList.add("motion-enabled");
    const onPreferenceChange = () => {
      if (reducedMotion.matches) {
        targets.forEach(node => node.classList.add("is-visible"));
        observer.disconnect();
      }
    };
    reducedMotion.addEventListener("change", onPreferenceChange);
    return () => { observer.disconnect(); reducedMotion.removeEventListener("change", onPreferenceChange); };
  }, [loading, filter]);
  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 1700);
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.clearTimeout(timer); window.removeEventListener("scroll", onScroll); };
  }, []);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) setActive(`#${entry.target.id}`); }); }, { rootMargin: "-25% 0px -65% 0px" });
    nav.forEach(item => { const node = document.querySelector(item.href); if (node) observer.observe(node); });
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const move = (event: PointerEvent) => {
      if (!finePointer.matches || reducedMotion.matches) return;
      const rect = hero.getBoundingClientRect();
      hero.style.setProperty("--pointer-x", String(((event.clientX - rect.left) / rect.width - .5) * .5));
      hero.style.setProperty("--pointer-y", String(((event.clientY - rect.top) / rect.height - .5) * .5));
    };
    const reset = () => { hero.style.setProperty("--pointer-x", "0"); hero.style.setProperty("--pointer-y", "0"); };
    hero.style.setProperty("--hero-drift", "0px");
    hero.addEventListener("pointermove", move);
    hero.addEventListener("pointerleave", reset);
    return () => { hero.removeEventListener("pointermove", move); hero.removeEventListener("pointerleave", reset); };
  }, []);

  return <div ref={pageRef} className={`portfolio-page pm-page ${loading ? "is-loading" : "is-ready"}`}>
    {loading && <div className="portfolio-preloader" aria-label="Loading Teamwork Digital"><div className="preloader-layer preloader-violet" /><div className="preloader-layer preloader-ink"><div className="preloader-meta"><span>Complete software development team</span><span>2026</span></div><div className="preloader-word">TEAMWORK<span>.</span></div><div className="preloader-bottom"><span>Your vision. Our expertise.</span><strong>100<small>%</small></strong></div><div className="preloader-progress" /></div></div>}
    <header className={`portfolio-header ${scrolled ? "is-scrolled" : ""}`}>
      <div className="portfolio-container portfolio-header-inner">
        <nav aria-label="Main navigation, left" className="portfolio-nav portfolio-nav-left">{nav.slice(0, 3).map(item => <a key={item.href} href={item.href} className={active === item.href ? "active" : ""}>{item.label}</a>)}</nav>
        <Brand />
        <nav aria-label="Main navigation, right" className="portfolio-nav portfolio-nav-right">{nav.slice(3).map(item => <a key={item.href} href={item.href} className={active === item.href ? "active" : ""}>{item.label}</a>)}</nav>
        <Button variant="ghost" size="icon" className="portfolio-menu-toggle" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</Button>
      </div>
      {menuOpen && <nav aria-label="Mobile navigation" className="portfolio-mobile-nav">{nav.map((item, i) => <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}><span>{String(i + 1).padStart(2, "0")}</span>{item.label}<ArrowUpRight size={17} /></a>)}</nav>}
    </header>

    <main>
      <section id="home" className="portfolio-hero" ref={heroRef}>
        <div className="portfolio-container hero-inner">
          <div className="hero-head"><span className="hero-hello">Complete software development team</span><h1>We are <em>Teamwork</em>,<br />Digital Developers</h1></div>
          <aside className="hero-aside hero-aside-left"><span className="hero-quote">“</span><p>From websites and mobile apps to e-commerce, AI and custom software, Teamwork Digital brings development, design and digital expertise together under one roof.</p></aside>
          <div className="hero-visual">
            <div className="hero-arc" /><div className="portrait-orbit orbit-one" /><div className="portrait-orbit orbit-two" />
            <span className="hero-backtype" aria-hidden="true">TD</span>
            <div className="hero-portrait"><img src={leaderPhoto.url} alt="Teamwork Digital team lead and project manager" /></div>
            <div className="hero-portrait-label"><span className="portfolio-dot" /><span>TEAM LEAD<br /><strong>PROJECT MANAGER</strong></span></div>
            <div className="hero-float hero-float-top"><Smartphone size={14} /> Mobile · Web · Commerce</div>
            <div className="hero-float hero-float-bottom"><Sparkles size={14} /> AI · Design · Software</div>
            <div className="hero-actions"><Button asChild><a href="#contact">Start a Project <ArrowRight size={16} /></a></Button><Button asChild variant="outline"><a href="#projects">View Our Work <ArrowUpRight size={16} /></a></Button></div>
          </div>
          <aside className="hero-aside hero-aside-right"><small>Your vision</small><strong>One complete team</strong><span>for every digital idea</span></aside>
          <a className="hero-scroll" href="#services">Scroll to explore <ArrowDown size={15} /></a>
        </div>
      </section>
      <div className="pm-strip" aria-label="Technologies we work with"><div className="pm-strip-track">{Array.from({ length: 2 }, (_, i) => <div key={i} className="pm-strip-set" aria-hidden={i === 1 ? true : undefined}>{techStack.map(item => <span key={item}>{item}</span>)}</div>)}</div></div>

      <section id="services" className="pm-section"><div className="portfolio-container">
        <div className="pm-intro"><span className="pm-kicker">Services</span><h2>Everything your digital project needs</h2><p>Eleven connected disciplines, delivered by one team from the first idea to launch and beyond.</p></div>
        <div className="pm-service-grid">{services.map((service, i) => { const Icon = icons[service.icon]; return <Reveal key={service.title}><article className="pm-service"><div className="pm-service-top"><span className="pm-service-icon"><Icon size={20} strokeWidth={1.7} /></span><span className="pm-num">{String(i + 1).padStart(2, "0")}</span></div><h3>{service.title}</h3><p>{service.description}</p></article></Reveal>; })}</div>
      </div></section>

      <section id="about" className="pm-section pm-value"><div className="portfolio-container pm-value-layout">
        <div className="pm-value-copy"><span className="pm-kicker">Why Teamwork Digital</span><h2>One Team. Multiple Digital Disciplines.</h2><p>You don't need to find and coordinate separate developers, designers and digital specialists. Teamwork Digital brings them together, so your project has one plan, one point of contact and one team responsible for the result.</p><div className="pm-value-actions"><Button asChild><a href="#contact">Start a Project <ArrowRight size={16} /></a></Button><Button asChild variant="outline" className="pm-on-dark"><a href={profile.url} target="_blank" rel="noopener noreferrer">Company profile <ArrowUpRight size={16} /></a></Button></div></div>
        <ul className="pm-value-list">{reasons.map((r, i) => { const Icon = reasonIcons[r.icon]; return <Reveal key={r.title}><li><span className="pm-value-icon"><Icon size={19} strokeWidth={1.8} /></span><div><h3>{r.title}</h3><p>{r.description}</p></div><span className="pm-num">{String(i + 1).padStart(2, "0")}</span></li></Reveal>; })}</ul>
      </div></section>

      <section id="experience" className="pm-section pm-process"><div className="portfolio-container">
        <div className="pm-intro pm-intro-center"><span className="pm-kicker">How we work</span><h2>A clear path from idea to launch</h2><p>Five steps that keep every project organised, visible and on track.</p></div>
        <ol className="pm-journey">{process.map((step, i) => <Reveal key={step.title}><li><span className="pm-step-dot">{String(i + 1).padStart(2, "0")}</span><small>{step.period}</small><h3>{step.title}</h3><p>{step.description}</p></li></Reveal>)}</ol>
      </div></section>

      <section id="projects" className="pm-section pm-work"><div className="portfolio-container">
        <div className="pm-intro pm-intro-row"><div><span className="pm-kicker">Selected work</span><h2>Live projects from our portfolio</h2></div><div className="project-filters" role="tablist" aria-label="Filter projects">{projectCategories.map(c => <button key={c} role="tab" aria-selected={filter === c} className={filter === c ? "active" : ""} onClick={() => setFilter(c)}>{c}</button>)}</div></div>
        <div className="pm-project-grid" key={filter}>{filtered.map(project => <Reveal key={project.title}><article className="pm-project"><a className="pm-project-media" href={project.url} target="_blank" rel="noopener noreferrer" tabIndex={-1} aria-hidden="true"><span className="pm-browser"><i /><i /><i /><em>{project.url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/.*$/, "")}</em></span><img src={previewFor(project.title, project.url)} alt="" loading="lazy" onError={e => { e.currentTarget.style.display = "none"; }} /><span className="pm-project-fallback">{project.initials}</span></a><div className="pm-project-body"><span className="pm-pill">{project.category === "Other" ? "Website" : project.category}</span><h3>{project.title}</h3><p>Live {project.category === "E-commerce" ? "e-commerce" : project.category === "WordPress" ? "WordPress" : ""} website from the Teamwork Digital portfolio.</p><a className="pm-project-link" href={project.url} target="_blank" rel="noopener noreferrer">View Project <ArrowUpRight size={15} /></a></div></article></Reveal>)}</div>
      </div></section>

      <section id="team" className="pm-section pm-team"><div className="portfolio-container">
        <div className="pm-intro pm-intro-center"><span className="pm-kicker">Our team</span><h2>Meet the Team Behind the Work</h2><p>Specialists across development, design and project management, working as one connected team.</p></div>
        <div className="pm-team-grid">{team.map((m, i) => { const Icon = teamIcons[i] ?? Users; return <Reveal key={m.role}><article className={`pm-team-card${m.leader ? " is-leader" : ""}`}><div className="pm-team-media">{m.leader ? <img src={leaderPhoto.url} alt={m.role} loading="lazy" /> : <span className="pm-team-icon"><Icon size={30} strokeWidth={1.5} /></span>}</div><div className="pm-team-body"><h3>{m.role}</h3><p>{m.focus}</p><div className="pm-team-skills">{m.skills.map(s => <span key={s}>{s}</span>)}</div></div></article></Reveal>; })}</div>
      </div></section>

      <section id="contact" className="portfolio-contact pm-contact"><div className="portfolio-container contact-faq-layout"><Reveal className="contact-panel"><div className="contact-copy"><span className="pm-kicker">Contact</span><h2 className="pm-contact-title">Have a Project in Mind?</h2><p>Tell us what you're building. We'll help you choose the right approach and turn the idea into a practical digital solution.</p><div className="contact-actions"><Button asChild size="lg"><a href={contact.whatsappLink} target="_blank" rel="noopener noreferrer">Start a Conversation <ArrowRight size={16} /></a></Button></div><div className="pm-contact-methods"><a href={contact.whatsappLink} target="_blank" rel="noopener noreferrer"><span><MessageCircle size={18} /></span><div><small>WhatsApp</small><strong>{contact.whatsapp}</strong></div></a><a href={`mailto:${contact.email}`}><span><Mail size={18} /></span><div><small>Email</small><strong>{contact.email}</strong></div></a></div></div></Reveal><Reveal className="contact-faq"><div id="faq" className="contact-faq-head"><span className="pm-kicker">FAQ</span><h3>Questions, answered</h3></div><div className="faq-list">{faqs.map(f => <details key={f.q} className="faq-item"><summary>{f.q}<span><Plus size={17} /></span></summary><p>{f.a}</p></details>)}</div></Reveal></div></section>
    </main>
    <footer className="portfolio-footer"><div className="portfolio-container"><Brand /><span>© {new Date().getFullYear()} Teamwork Digital</span><a href="#home">Back to top <ChevronUp size={15} /></a></div></footer>
  </div>;
}
