import { createFileRoute, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Github, Instagram, Linkedin, Mail, Star, ArrowDown, ArrowRight, ArrowUpRight, Check, ChevronUp, Code2, Copy, Gamepad2, GraduationCap, LifeBuoy, Plus, Quote, LayoutTemplate, Menu, Monitor, Palette, Play, Search, ShoppingBag, Smartphone, Sparkles, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { contact, faqs, process, projectCategories, projects, reasons, services, team, techStack, testimonials } from "@/lib/portfolio-data";
import leaderPhoto from "@/assets/team-leader.jpeg.asset.json";
import logo from "@/assets/teamwork-digital-logo.jpeg.asset.json";
import profile from "@/assets/teamwork-digital-profile.pdf.asset.json";
import lovePawsPreview from "@/assets/love-paws.png.asset.json";
import americanWebsPreview from "@/assets/american-webs.png.asset.json";
import aberasPreview from "@/assets/aberas.png.asset.json";
import blackGrainPreview from "@/assets/black-grain-clean.png.asset.json";

const featuredPreviews = [lovePawsPreview, americanWebsPreview, aberasPreview, blackGrainPreview];

const reasonIcons = { users: Users, code: Code2, check: Check, support: LifeBuoy };
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
  const timelineRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const servicesRef = useRef<HTMLElement>(null);
  const tickerRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
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
  useEffect(() => {
    const hero = heroRef.current;
    const servicesStage = servicesRef.current;
    if (!hero || !servicesStage) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    let frame = 0;
    const update = () => {
      frame = 0;
      if (reducedMotion.matches) {
        hero.style.setProperty("--hero-drift", "0px");
        servicesStage.style.setProperty("--services-entry", "1");
        tickerRef.current?.style.setProperty("--ticker-scroll", "0px");
        return;
      }
      const ticker = tickerRef.current;
      if (ticker) {
        const offset = Math.max(-180, Math.min(180, (window.innerHeight * .5 - ticker.getBoundingClientRect().top) * .22));
        ticker.style.setProperty("--ticker-scroll", `${offset}px`);
      }
      hero.style.setProperty("--hero-drift", `${Math.min(window.scrollY * 0.17, 105)}px`);
      const rect = servicesStage.getBoundingClientRect();
      servicesStage.style.setProperty("--services-entry", String(Math.max(0, Math.min(1, (window.innerHeight * .94 - rect.top) / (window.innerHeight * .58)))));
    };
    const schedule = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    const move = (event: PointerEvent) => {
      if (!finePointer.matches || reducedMotion.matches) return;
      const rect = hero.getBoundingClientRect();
      hero.style.setProperty("--pointer-x", String((event.clientX - rect.left) / rect.width - .5));
      hero.style.setProperty("--pointer-y", String((event.clientY - rect.top) / rect.height - .5));
    };
    const reset = () => { hero.style.setProperty("--pointer-x", "0"); hero.style.setProperty("--pointer-y", "0"); };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    reducedMotion.addEventListener("change", schedule);
    hero.addEventListener("pointermove", move);
    hero.addEventListener("pointerleave", reset);
    return () => { window.cancelAnimationFrame(frame); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); reducedMotion.removeEventListener("change", schedule); hero.removeEventListener("pointermove", move); hero.removeEventListener("pointerleave", reset); };
  }, []);
  const copyPage = async () => { try { await navigator.clipboard.writeText(window.location.href); setCopied(true); window.setTimeout(() => setCopied(false), 2200); } catch { setCopied(false); } };

  return <div ref={pageRef} className={`portfolio-page ${loading ? "is-loading" : "is-ready"}`}>
    {loading && <div className="portfolio-preloader" aria-label="Loading Teamwork Digital"><div className="preloader-layer preloader-violet" /><div className="preloader-layer preloader-ink"><div className="preloader-meta"><span>Creative digital team</span><span>2026</span></div><div className="preloader-word">TEAMWORK<span>.</span></div><div className="preloader-bottom"><span>Your vision. Our expertise.</span><strong>100<small>%</small></strong></div><div className="preloader-progress" /></div></div>}
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
          <div className="hero-head"><span className="hero-hello">Hello! <Smartphone size={14} /></span><h1>We are <em>Teamwork</em>,<br />Digital Developers</h1></div>
          <aside className="hero-aside hero-aside-left"><span className="hero-quote">“</span><p>We build digital products from first idea to release — with one connected team.</p></aside>
          <div className="hero-visual">
            <div className="hero-arc" /><div className="portrait-orbit orbit-one" /><div className="portrait-orbit orbit-two" />
            <span className="hero-backtype" aria-hidden="true">TD</span>
            <div className="hero-portrait"><img src={leaderPhoto.url} alt="Team leader and project manager" /></div>
            <div className="hero-portrait-label"><span className="portfolio-dot" /><span>TEAM LEADER<br /><strong>PROJECT MANAGER</strong></span></div>
            <div className="hero-float hero-float-top"><Smartphone size={14} /> Flutter & React Native</div>
            <div className="hero-float hero-float-bottom"><Check size={14} /> Websites · AI · Creative</div>
            <div className="hero-actions"><Button asChild><a href="#projects">View Projects <ArrowUpRight size={16} /></a></Button><Button asChild><a href="#contact">Hire Us <ArrowRight size={16} /></a></Button></div>
          </div>
          <aside className="hero-aside hero-aside-right"><small>YOUR VISION</small><strong>One complete team</strong><span>for every digital idea</span></aside>
          <a className="hero-scroll" href="#services">Scroll to explore <ArrowDown size={15} /></a>
        </div>
      </section>
      <div ref={tickerRef} className="portfolio-ticker" aria-label="Our capabilities">{["back", "front"].map(layer => <div key={layer} className={`ticker-ribbon ticker-ribbon-${layer}`} aria-hidden={layer === "back" ? true : undefined}><div className="ticker-scroll-track"><div className="ticker-track">{Array.from({ length: 2 }, (_, i) => <div key={i} className="ticker-set" aria-hidden={i === 1 ? true : undefined}>{techStack.map(item => <span key={item}>{item}<span className="portfolio-dot" /></span>)}</div>)}</div></div></div>)}</div>

      <section id="services" className="portfolio-services" ref={servicesRef}><div className="portfolio-container">
        <Reveal className="section-intro"><div><Eyebrow>What we do</Eyebrow><Heading>What we <em>build</em> for you</Heading></div><p>From the first idea to the finished product, one team across development, design and digital services.</p></Reveal>
        <div className="services-grid">{services.map((service, i) => { const Icon = icons[service.icon]; return <Reveal key={service.title} className="service-reveal"><article className="service-card"><div className="service-top"><span className="service-icon"><Icon size={22} strokeWidth={1.8} /></span><span>{String(i + 1).padStart(2, "0")}</span></div><h3>{service.title}</h3><p>{service.description}</p><div className="tag-list">{service.tags.map(tag => <span key={tag}>{tag}</span>)}</div></article></Reveal>; })}</div>
        <Reveal className="tech-strip"><small>Tech we work with</small><div>{techStack.map(t => <span key={t}>{t}</span>)}</div></Reveal>
      </div></section>

      <section id="about" className="portfolio-section about-section"><div className="portfolio-container">
        <div className="about-layout"><Reveal className="about-feature"><div className="award-label">✧ &nbsp; YOUR VISION · OUR EXPERTISE</div><Eyebrow>Core strengths</Eyebrow><h3>From first idea <em>to</em> final launch.</h3><div className="strength-list">{["One team, many disciplines", "Quality at every step", "Clear communication", "Long-term support"].map(item => <div key={item}><span><Check size={14} /></span>{item}</div>)}</div></Reveal><Reveal className="about-copy"><Eyebrow>About us</Eyebrow><Heading>Why <em>work</em> with us?</Heading><p>Teamwork Digital is a complete software development team focused on practical, modern and reliable digital solutions. We combine development, design, AI and digital services so you can work with one team from idea to delivery.</p><Button asChild><a href={profile.url} target="_blank" rel="noopener noreferrer">Company profile <ArrowUpRight size={17} /></a></Button></Reveal></div>
        <Reveal className="about-stats"><div><strong>01<span> / </span></strong><span>Connected team<br />from idea to delivery</span></div><div><strong>10<span>+</span></strong><span>Projects in our<br />company portfolio</span></div><div><strong>11<span>+</span></strong><span>Services across<br />digital disciplines</span></div></Reveal>
      </div></section>

      <section id="why" className="portfolio-section why-section"><div className="portfolio-container"><Reveal className="section-intro"><div><Eyebrow>Why Teamwork Digital</Eyebrow><Heading>One team, <em>fewer</em> handoffs</Heading></div><p>What clients get when development, design and growth sit under the same roof.</p></Reveal><div className="why-grid">{reasons.map((r, i) => { const Icon = reasonIcons[r.icon]; return <Reveal key={r.title} className="why-reveal"><article className="why-card"><span className="why-number">{String(i + 1).padStart(2, "0")}</span><span className="why-icon"><Icon size={22} strokeWidth={1.8} /></span><h3>{r.title}</h3><p>{r.description}</p></article></Reveal>; })}</div></div></section>

      <section id="experience" className="portfolio-section experience-section"><div className="portfolio-container"><Reveal className="center-heading"><Eyebrow>Our approach</Eyebrow><Heading>How we <em>work</em></Heading><p>A clear path from the first conversation to the finished product.</p></Reveal><div className="timeline" ref={timelineRef}>{process.map((step, i) => <Reveal key={step.title} className="timeline-row"><div className="timeline-label"><span>{step.period}</span><h3>{step.title}</h3><small>STEP {String(i + 1).padStart(2, "0")}</small></div><div className="timeline-marker"><span><Check size={16} /></span></div><article className="timeline-panel"><span className="timeline-role">TEAMWORK DIGITAL · {step.period}</span><h3>{step.title}</h3><p>{step.description}</p><ul className="timeline-points">{step.points.map(point => <li key={point}><Check size={14} />{point}</li>)}</ul><div className="timeline-tags">{step.tags.map(tag => <span key={tag}>{tag}</span>)}</div></article></Reveal>)}</div></div></section>

      <section id="projects" className="portfolio-section projects-section"><div className="portfolio-container"><Reveal className="section-intro"><div><Eyebrow>Portfolio</Eyebrow><Heading>Selected <em>projects</em></Heading></div><p>Explore live examples listed in our company portfolio.</p></Reveal><div className="featured-projects">{projects.slice(0, 4).map((project, i) => <Reveal key={project.title} className="project-reveal"><article className="featured-project"><div className="project-details"><div className="project-topline"><span><b>{String(i + 1).padStart(2, "0")}</b> / {String(projects.length).padStart(2, "0")}</span><span className="project-status">● Live project</span></div><div><h3>{project.title}</h3><p>{project.type} website</p><div className="project-highlight"><span>{project.initials}</span> A live project from the Teamwork Digital portfolio</div><ul><li><Check size={15} /> Website development and implementation</li><li><Check size={15} /> Built to support a distinct business presence online</li></ul></div><div className="project-bottom"><span className="project-pill">{project.type}</span><Button asChild variant="outline" size="sm"><a href={project.url} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${project.title}`}>Visit site <ArrowUpRight size={14} /></a></Button></div></div><a className={`project-preview preview-${i}`} href={project.url} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${project.title}`}><img className="project-site-image" src={featuredPreviews[i]?.url} alt={`${project.title} website preview`} loading="lazy" /><span className="preview-badge">Explore project <ArrowUpRight size={13} /></span></a></article></Reveal>)}</div><Reveal className="more-projects"><div className="more-head"><h3>Browse all projects</h3><div className="project-filters" role="tablist" aria-label="Filter projects">{projectCategories.map(c => <button key={c} role="tab" aria-selected={filter === c} className={filter === c ? "active" : ""} onClick={() => setFilter(c)}>{c}</button>)}</div></div><div className="more-grid" key={filter}>{filtered.map(project => <a key={project.title} href={project.url} target="_blank" rel="noopener noreferrer" className="more-project"><span className="project-pill">{project.category}</span><ArrowUpRight size={19} /><h4>{project.title}</h4><p>Visit site</p></a>)}</div></Reveal></div></section>


      <section id="team" className="portfolio-section team-section"><div className="portfolio-container"><Reveal className="center-heading"><Eyebrow>Team</Eyebrow><Heading>Meet the <em>team</em></Heading><p>The people behind every build — one connected team from idea to launch.</p></Reveal><div className="team-grid">{team.map(m => <Reveal key={m.name}><article className={`team-card${m.leader ? " is-leader" : ""}`}><div className="team-media">{m.leader ? <img src={leaderPhoto.url} alt={m.name} loading="lazy" /> : <span className="team-initials">{m.role.split(/[^A-Za-z]+/).filter(Boolean).map(w => w[0]).join("").slice(0, 2).toUpperCase()}</span>}<div className="team-socials">{m.socials.linkedin && <a href={m.socials.linkedin} aria-label={`${m.name} on LinkedIn`}><Linkedin size={16} /></a>}{m.socials.github && <a href={m.socials.github} aria-label={`${m.name} on GitHub`}><Github size={16} /></a>}{m.socials.instagram && <a href={m.socials.instagram} aria-label={`${m.name} on Instagram`}><Instagram size={16} /></a>}{m.socials.email && <a href={`mailto:${m.socials.email}`} aria-label={`Email ${m.name}`}><Mail size={16} /></a>}</div></div><div className="team-body"><span className="team-role">{m.role}</span><h3>{m.name}</h3><p>{m.bio}</p></div></article></Reveal>)}</div></div></section>
      <section id="testimonials" className="portfolio-section testimonial-section"><div className="portfolio-container"><Reveal className="center-heading"><Eyebrow>Clients</Eyebrow><Heading>What clients <em>say</em></Heading></Reveal><div className="testimonial-grid">{testimonials.map((t, i) => <Reveal key={i}><figure className="testimonial-card"><Quote className="testimonial-mark" size={44} /><div className="testimonial-stars" aria-label="5 out of 5">{Array.from({ length: 5 }, (_, s) => <Star key={s} size={15} />)}</div><blockquote>“{t.quote}”</blockquote><figcaption><span className="testimonial-avatar">{t.company[0]}</span><div><strong>{t.name}</strong><small>{t.company}</small></div><span className="testimonial-service">{t.service}</span></figcaption></figure></Reveal>)}</div></div></section>
      <section id="contact" className="portfolio-contact"><div className="portfolio-container contact-faq-layout"><Reveal className="contact-panel"><div className="contact-copy"><Eyebrow>Contact</Eyebrow><Heading>Have a project<br />idea? <em>Let's talk.</em></Heading><p>Whether it's a mobile app, a website, a new brand or a complete digital product — let's start the conversation.</p><div className="contact-actions"><Button asChild><a href={contact.whatsappLink} target="_blank" rel="noopener noreferrer">WhatsApp us <ArrowUpRight size={16} /></a></Button><Button asChild variant="outline"><a href={`mailto:${contact.email}`}>{contact.email}</a></Button><Button variant="outline" onClick={copyPage}>{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? "Link copied" : "Copy page link"}</Button></div></div><div className="contact-aside contact-aside-row"><img src={logo.url} alt="Teamwork Digital logo" /><strong>TEAMWORK<br />DIGITAL.</strong><span>Your vision.<br />Our expertise.</span><a href="#home">Back to top <ChevronUp size={16} /></a></div></Reveal><Reveal className="contact-faq" ><div id="faq" className="contact-faq-head"><Eyebrow>FAQ</Eyebrow><h3>Questions, <em>answered</em></h3></div><div className="faq-list">{faqs.map(f => <details key={f.q} className="faq-item"><summary>{f.q}<span><Plus size={17} /></span></summary><p>{f.a}</p></details>)}</div></Reveal></div></section>
    </main>
    <footer className="portfolio-footer"><div className="portfolio-container"><Brand /><span>© {new Date().getFullYear()} Teamwork Digital</span><a href="#home">Back to top <ChevronUp size={15} /></a></div></footer>
  </div>;
}
