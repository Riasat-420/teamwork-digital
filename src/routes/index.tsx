import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { MessageSquare, ArrowRight, ArrowUpRight, Check, ChevronUp, Code2, Copy, Gamepad2, GraduationCap, LifeBuoy, Plus, Quote, LayoutTemplate, Menu, Monitor, Palette, Play, Search, ShoppingBag, Smartphone, Sparkles, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { contact, portfolioCopy, faqs, process, projectCategories, projects, projectDescriptions, reasons, services, team, techStack, testimonials } from "@/lib/portfolio-data";
import leaderPhoto from "@/assets/team-leader.jpeg.asset.json";
import logo from "@/assets/teamwork-digital-logo.jpeg.asset.json";
import profile from "@/assets/teamwork-digital-profile.pdf.asset.json";
import lovePawsPreview from "@/assets/love-paws.png.asset.json";
import americanWebsPreview from "@/assets/american-webs.png.asset.json";
import aberasPreview from "@/assets/aberas.png.asset.json";
import blackGrainPreview from "@/assets/black-grain-clean.png.asset.json";
import welloraaPreview from "@/assets/welloraa-preview.jpg.asset.json";
import greenLeafPreview from "@/assets/green-leaf-organics-clean.jpg.asset.json";
import powersPreview from "@/assets/the-powers-hub-preview.jpg.asset.json";
import shiffaaPreview from "@/assets/the-shiffaa-store-preview.jpg.asset.json";

const projectPreviews: Record<string, {url:string}> = { "Love Paws Walk": lovePawsPreview, "American Webs Studios": americanWebsPreview, "Aberas Construction": aberasPreview, "Black & Grain": blackGrainPreview, "Welloraa": welloraaPreview, "Green Leaf Organics": greenLeafPreview, "The Powers Hub": powersPreview, "The Shiffaa Store": shiffaaPreview };

const reasonIcons = { users: Users, code: Code2, check: Check, support: LifeBuoy, communication: MessageSquare };
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
  const pageRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const servicesRef = useRef<HTMLElement>(null);
  const tickerRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [active, setActive] = useState("#home");
  const [loading] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [filter, setFilter] = useState<(typeof projectCategories)[number]>("All");
  const filtered = projects.filter(p => filter === "All" || p.category === filter);
  useEffect(() => {
    const page = pageRef.current;
    if (!page || loading) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const targets = page.querySelectorAll<HTMLElement>([
      ".reveal", ".guide-heading-row", ".guide-form", ".guide-results", ".portfolio-footer .portfolio-container",
      ".section-intro > *", ".center-heading > *", ".guide-heading-row > *",
      ".service-card > *", ".why-card > :not(.why-number)", ".timeline-panel > *", ".timeline-label > *",
      ".project-details > *", ".more-grid > *", ".team-body > *",
      ".testimonial-card > :not(.testimonial-mark)", ".about-copy > *", ".about-feature > *",
      ".about-stats > *", ".contact-copy > *", ".contact-faq-head > *", ".faq-list > *",
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
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); };
  }, []);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) setActive(`#${entry.target.id}`); }); }, { rootMargin: "-25% 0px -65% 0px" });
    nav.forEach(item => { const node = document.querySelector(item.href); if (node) observer.observe(node); });
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const timeline = timelineRef.current;
    if (!timeline) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = timeline.getBoundingClientRect();
      const start = window.innerHeight * 0.68;
      const progress = Math.max(0, Math.min(1, (start - rect.top - 22) / Math.max(1, rect.height - 102)));
      timeline.style.setProperty("--timeline-progress", String(reducedMotion.matches ? 1 : progress));
      timeline.querySelectorAll<HTMLElement>(".timeline-row").forEach((row) => {
        const marker = row.querySelector(".timeline-marker");
        const position = (marker?.getBoundingClientRect().top ?? row.getBoundingClientRect().top) + 18;
        const reached = reducedMotion.matches || position < start;
        row.classList.toggle("is-reached", reached);
      });
    };
    const schedule = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    reducedMotion.addEventListener("change", schedule);
    return () => { window.cancelAnimationFrame(frame); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); reducedMotion.removeEventListener("change", schedule); };
  }, []);
  const copyPage = async () => { try { await navigator.clipboard.writeText(window.location.href); setCopied(true); window.setTimeout(() => setCopied(false), 2200); } catch { setCopied(false); } };

  return <div ref={pageRef} className={`portfolio-page premium-page ${loading ? "is-loading" : "is-ready"}`}>
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
          <div className="hero-head"><Eyebrow>Teamwork Digital</Eyebrow><h1>{portfolioCopy.heroTitle.split(",")[0]}<br /><em>{portfolioCopy.heroTitle.split(",")[1]?.trim()}</em></h1></div>
          <aside className="hero-aside hero-aside-left"><Quote size={28} strokeWidth={1.3} /><p>{portfolioCopy.heroDescription}</p></aside>
          <div className="hero-visual"><div className="hero-arc" /><div className="portrait-orbit" /><span className="hero-backtype" aria-hidden="true">TD</span><div className="hero-portrait"><img src={leaderPhoto.url} alt="Teamwork Digital team leader and project manager" width={600} height={800} fetchPriority="high" /></div><div className="hero-portrait-label"><span className="portfolio-dot" /><span>Team Lead<br /><strong>Project Manager</strong></span></div><div className="hero-float hero-float-top"><Smartphone size={15} /> Flutter & React Native</div><div className="hero-float hero-float-bottom"><Check size={15} /> Websites · AI · Creative</div><div className="hero-actions"><Button asChild><a href="#contact">{portfolioCopy.heroPrimary} <ArrowUpRight size={17} /></a></Button><Button asChild variant="outline"><a href="#projects">{portfolioCopy.heroSecondary} <ArrowRight size={17} /></a></Button></div></div>
          <aside className="hero-aside hero-aside-right"><small>Your vision</small><strong>One complete<br />digital team.</strong><span>From first idea to launch.</span></aside>
        </div>
      </section>
      <div ref={tickerRef} className="portfolio-ticker" aria-label="Our capabilities"><div className="ticker-track">{Array.from({length:2}, (_, i) => <div className="ticker-set" key={i} aria-hidden={i === 1 ? true : undefined}>{techStack.map(item => <span key={item}>{item}<span className="portfolio-dot" /></span>)}</div>)}</div></div>

      <section id="services" className="portfolio-services" ref={servicesRef}><div className="portfolio-container">
        <Reveal className="section-intro"><div><Eyebrow>What we do</Eyebrow><Heading>What we <em>build</em> for you</Heading></div><p>From the first idea to the finished product, one team across development, design and digital services.</p></Reveal>
        <div className="services-grid">{services.map((service, i) => { const Icon = icons[service.icon]; return <Reveal key={service.title} className="service-reveal"><article className="service-card"><div className="service-top"><span className="service-icon"><Icon size={22} strokeWidth={1.8} /></span><span>{String(i + 1).padStart(2, "0")}</span></div><h3>{service.title}</h3><p>{service.description}</p><div className="tag-list">{service.tags.map(tag => <span key={tag}>{tag}</span>)}</div></article></Reveal>; })}</div>
        <Reveal className="tech-strip"><small>Tech we work with</small><div>{techStack.map(t => <span key={t}>{t}</span>)}</div></Reveal>
      </div></section>

      <section id="about" className="portfolio-section about-section"><div className="portfolio-container">
        <div className="about-layout"><Reveal className="about-feature"><div className="award-label">✧ &nbsp; YOUR VISION · OUR EXPERTISE</div><Eyebrow>Core strengths</Eyebrow><h3>From first idea <em>to</em> final launch.</h3><div className="strength-list">{["One team, many disciplines", "Quality at every step", "Clear communication", "Long-term support"].map(item => <div key={item}><span><Check size={14} /></span>{item}</div>)}</div></Reveal><Reveal className="about-copy"><Eyebrow>About us</Eyebrow><Heading>{portfolioCopy.aboutTitle}</Heading><p>{portfolioCopy.aboutDescription}</p><Button asChild><a href={profile.url} target="_blank" rel="noopener noreferrer">Company profile <ArrowUpRight size={17} /></a></Button></Reveal></div>
        <Reveal className="about-stats"><div><strong>01<span> / </span></strong><span>Connected team<br />from idea to delivery</span></div><div><strong>10</strong><span>Projects in our<br />company portfolio</span></div><div><strong>11</strong><span>Services across<br />digital disciplines</span></div></Reveal>
      </div></section>

      <section id="why" className="portfolio-section why-section"><div className="portfolio-container"><Reveal className="section-intro"><div><Eyebrow>Why Teamwork Digital</Eyebrow><Heading>One team, <em>fewer</em> handoffs</Heading></div><p>What clients get when development, design and growth sit under the same roof.</p></Reveal><div className="why-grid">{reasons.map((r, i) => { const Icon = reasonIcons[r.icon]; return <Reveal key={r.title} className="why-reveal"><article className="why-card"><span className="why-number">{String(i + 1).padStart(2, "0")}</span><span className="why-icon"><Icon size={22} strokeWidth={1.8} /></span><h3>{r.title}</h3><p>{r.description}</p></article></Reveal>; })}</div></div></section>

      <section id="experience" className="portfolio-section experience-section"><div className="portfolio-container"><Reveal className="section-intro"><div><Eyebrow>Our approach</Eyebrow><Heading>From idea to delivery.</Heading></div><p>A clear path from the first conversation to the finished product.</p></Reveal><div className="timeline" ref={timelineRef}>{process.map((step, i) => <Reveal key={step.title} className="timeline-row"><span className="timeline-marker">{String(i+1).padStart(2,"0")}</span><article className="timeline-panel"><h3>{step.title}</h3><p>{step.description}</p><details className="process-detail"><summary>Step details <Plus size={13} /></summary><ul>{step.points.map(point => <li key={point}>{point}</li>)}</ul><div className="timeline-tags">{step.tags.map(tag => <span key={tag}>{tag}</span>)}</div></details></article></Reveal>)}</div></div></section>

      <section id="projects" className="portfolio-section projects-section"><div className="portfolio-container"><Reveal className="section-intro"><div><Eyebrow>Portfolio</Eyebrow><Heading>Our work, in the real world.</Heading></div><p>Explore the actual projects listed in our company portfolio.</p></Reveal><div className="project-filters" role="tablist" aria-label="Filter projects">{projectCategories.map(c => <Button key={c} role="tab" aria-selected={filter === c} variant={filter === c ? "default" : "ghost"} onClick={() => setFilter(c)}>{c}</Button>)}</div><div className="portfolio-project-grid">{filtered.map(project => { const preview = projectPreviews[project.title]; return <Reveal key={project.title}><article className="portfolio-project-card"><a className="project-preview" href={project.url} target="_blank" rel="noopener noreferrer" aria-label={`Preview ${project.title}`}>{preview ? <img src={preview.url} alt={`${project.title} website preview`} loading="lazy" width={1280} height={900} /> : <div className="project-preview-unavailable"><Monitor size={40} strokeWidth={1} /><span>{project.title}</span><small>Visit the live website</small></div>}</a><div className="project-details"><span className="project-pill">{project.type}</span><h3>{project.title}</h3><p>{projectDescriptions[project.title] ?? `Listed in our company portfolio${project.type === "WordPress" ? " as a WordPress website" : ""}.`}</p><Button asChild variant="outline" size="sm"><a href={project.url} target="_blank" rel="noopener noreferrer">View Project <ArrowUpRight size={15} /></a></Button></div></article></Reveal>; })}</div></div></section>
      <section id="team" className="portfolio-section team-section"><div className="portfolio-container"><Reveal className="section-intro"><div><Eyebrow>Our people</Eyebrow><Heading>Meet the Team Behind the Work</Heading></div><p>Development, design and project delivery—working together, not in silos.</p></Reveal><div className="team-grid">{team.map((m,i) => { const Icon = [Users, Smartphone, Monitor, Palette][i] ?? Users; return <Reveal key={m.role}><article className="team-card"><div className="team-role-icon"><Icon size={30} strokeWidth={1.5} /><span>{String(i+1).padStart(2,"0")}</span></div><div className="team-body"><h3>{m.role}</h3><p>{m.bio}</p></div></article></Reveal>; })}</div></div></section>
      {testimonials.length > 0 && <section id="testimonials" className="portfolio-section"><div className="portfolio-container"><Heading>What clients say</Heading>{testimonials.map(t => <blockquote key={t.name}>{t.quote}<cite>{t.name}</cite></blockquote>)}</div></section>}

      <section id="contact" className="portfolio-contact"><div className="portfolio-container contact-faq-layout"><Reveal className="contact-panel"><div className="contact-copy"><Eyebrow>Contact</Eyebrow><Heading>{portfolioCopy.contactTitle}</Heading><p>{portfolioCopy.contactDescription}</p>{contact.demo && <small className="contact-demo-note">Contact details shown are placeholders pending client confirmation.</small>}<div className="contact-actions"><Button asChild><a href={contact.whatsappLink} target="_blank" rel="noopener noreferrer">{portfolioCopy.contactAction} <ArrowUpRight size={16} /></a></Button><Button asChild variant="outline"><a href={`mailto:${contact.email}`}>{contact.email}</a></Button><Button variant="outline" onClick={copyPage}>{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? "Link copied" : "Copy page link"}</Button></div></div><div className="contact-aside contact-aside-row"><img src={logo.url} alt="Teamwork Digital logo" /><strong>TEAMWORK<br />DIGITAL.</strong><span>Your vision.<br />Our expertise.</span><a href="#home">Back to top <ChevronUp size={16} /></a></div></Reveal><Reveal className="contact-faq" ><div id="faq" className="contact-faq-head"><Eyebrow>FAQ</Eyebrow><h3>Questions, <em>answered</em></h3></div><div className="faq-list">{faqs.map(f => <details key={f.q} className="faq-item"><summary>{f.q}<span><Plus size={17} /></span></summary><p>{f.a}</p></details>)}</div></Reveal></div></section>
    </main>
    <footer className="portfolio-footer"><div className="portfolio-container"><Brand /><span>© {new Date().getFullYear()} Teamwork Digital</span><a href="#home">Back to top <ChevronUp size={15} /></a></div></footer>
  </div>;
}
