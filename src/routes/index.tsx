import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, Check, ChevronUp, Code2, Copy, Gamepad2, GraduationCap, LayoutTemplate, Menu, Monitor, Palette, Play, Search, ShoppingBag, Smartphone, Sparkles, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { process, projects, services, skillGroups } from "@/lib/portfolio-data";
import leaderPhoto from "@/assets/team-leader.jpeg.asset.json";
import logo from "@/assets/teamwork-digital-logo.jpeg.asset.json";
import profile from "@/assets/teamwork-digital-profile.pdf.asset.json";
import lovePawsPreview from "@/assets/love-paws.png.asset.json";
import americanWebsPreview from "@/assets/american-webs.png.asset.json";
import aberasPreview from "@/assets/aberas.png.asset.json";
import blackGrainPreview from "@/assets/black-grain-clean.png.asset.json";

const featuredPreviews = [lovePawsPreview, americanWebsPreview, aberasPreview, blackGrainPreview];

const icons = { mobile: Smartphone, web: Monitor, layout: LayoutTemplate, shop: ShoppingBag, design: Palette, video: Play, game: Gamepad2, ai: Sparkles, leads: Search, academic: GraduationCap, code: Code2 };
const nav = [
  { label: "Home", href: "#home" }, { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" }, { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" }, { label: "Contact", href: "#contact" },
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
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry?.isIntersecting) { node.classList.add("is-visible"); observer.unobserve(node); } }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>;
}

function Eyebrow({ children }: { children: React.ReactNode }) { return <span className="portfolio-eyebrow"><span className="portfolio-dot" />{children}</span>; }
function Heading({ children }: { children: React.ReactNode }) { return <h2 className="portfolio-heading">{children}</h2>; }
function Brand() { return <a href="#home" className="portfolio-brand" aria-label="Teamwork Digital, home"><img src={logo.url} alt="" /><span>TEAMWORK<span className="text-primary"> DIGITAL.</span></span></a>; }

function Portfolio() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [active, setActive] = useState("#home");
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
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
      const end = window.innerHeight * 0.42;
      const progress = Math.max(0, Math.min(1, (start - rect.top) / (rect.height + start - end)));
      timeline.style.setProperty("--timeline-progress", String(reducedMotion.matches ? 1 : progress));
      timeline.querySelectorAll<HTMLElement>(".timeline-row").forEach((row) => {
        const marker = row.querySelector(".timeline-marker");
        const position = marker?.getBoundingClientRect().top ?? row.getBoundingClientRect().top;
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

  return <div className={`portfolio-page ${loading ? "is-loading" : "is-ready"}`}>
    {loading && <div className="portfolio-preloader" aria-label="Loading Teamwork Digital"><div className="preloader-layer preloader-violet" /><div className="preloader-layer preloader-ink"><div className="preloader-meta"><span>Creative digital team</span><span>2026</span></div><div className="preloader-word">TEAMWORK<span>.</span></div><div className="preloader-bottom"><span>Your vision. Our expertise.</span><strong>100<small>%</small></strong></div><div className="preloader-progress" /></div></div>}
    <header className={`portfolio-header ${scrolled ? "is-scrolled" : ""}`}>
      <div className="portfolio-container portfolio-header-inner">
        <Brand />
        <nav aria-label="Main navigation" className="portfolio-nav">{nav.map((item, i) => <a key={item.href} href={item.href} className={active === item.href ? "active" : ""}><span>{String(i + 1).padStart(2, "0")}</span>{item.label}</a>)}</nav>
        <Button asChild className="portfolio-header-cta"><a href="#contact">Let's talk <ArrowUpRight size={15} /></a></Button>
        <Button variant="ghost" size="icon" className="portfolio-menu-toggle" aria-label={menuOpen ? "Close menu" : "Open menu"} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</Button>
      </div>
      {menuOpen && <nav aria-label="Mobile navigation" className="portfolio-mobile-nav">{nav.map((item, i) => <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}><span>{String(i + 1).padStart(2, "0")}</span>{item.label}<ArrowUpRight size={17} /></a>)}</nav>}
    </header>

    <main>
      <section id="home" className="portfolio-hero">
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
      <div className="portfolio-ticker" aria-label="Our capabilities"><div className="ticker-ribbon ticker-ribbon-back" /><div className="ticker-ribbon ticker-ribbon-front"><div className="ticker-track">{Array.from({ length: 2 }, (_, i) => <div key={i} className="ticker-set">{["Flutter", "React Native", "WordPress", "Wix Studio", "Shopify", "AI Solutions", "Game Development", "Graphic Design", "Video Editing", "Lead Generation"].map(item => <span key={item}>{item}<span className="portfolio-dot" /></span>)}</div>)}</div></div></div>

      <section id="services" className="portfolio-services"><div className="portfolio-container">
        <Reveal className="section-intro"><div><Eyebrow>What we do</Eyebrow><Heading>What we <em>build</em> for you</Heading></div><p>From the first idea to the finished product, one team across development, design and digital services.</p></Reveal>
        <div className="services-grid">{services.map((service, i) => { const Icon = icons[service.icon]; return <Reveal key={service.title} className="service-reveal"><article className="service-card"><div className="service-top"><span className="service-icon"><Icon size={22} strokeWidth={1.8} /></span><span>{String(i + 1).padStart(2, "0")}</span></div><h3>{service.title}</h3><p>{service.description}</p><div className="tag-list">{service.tags.map(tag => <span key={tag}>{tag}</span>)}</div></article></Reveal>; })}</div>
      </div></section>

      <section id="about" className="portfolio-section about-section"><div className="portfolio-container">
        <div className="about-layout"><Reveal className="about-feature"><div className="award-label">✧ &nbsp; YOUR VISION · OUR EXPERTISE</div><Eyebrow>Core strengths</Eyebrow><h3>From first idea <em>to</em> final launch.</h3><div className="strength-list">{["One team, many disciplines", "Quality at every step", "Clear communication", "Long-term support"].map(item => <div key={item}><span><Check size={14} /></span>{item}</div>)}</div></Reveal><Reveal className="about-copy"><Eyebrow>About us</Eyebrow><Heading>Why <em>work</em> with us?</Heading><p>Teamwork Digital is a complete software development team focused on practical, modern and reliable digital solutions. We combine development, design, AI and digital services so you can work with one team from idea to delivery.</p><p>We handle websites, mobile applications, e-commerce platforms, games, design and custom software projects with a focus on communication, quality and client satisfaction.</p><div className="about-facts"><div><span><Users size={18} /></span><small>OUR APPROACH</small><strong>One team, many skills</strong></div><div><span><Smartphone size={18} /></span><small>WHAT WE BUILD</small><strong>Digital products</strong></div><div><span><Check size={18} /></span><small>OUR FOCUS</small><strong>Quality & support</strong></div><div><span><Sparkles size={18} /></span><small>OUR MINDSET</small><strong>Practical innovation</strong></div></div><Button asChild><a href={profile.url} target="_blank" rel="noopener noreferrer">Company profile <ArrowUpRight size={17} /></a></Button></Reveal></div>
        <Reveal className="about-stats"><div><strong>01<span> / </span></strong><span>Connected team<br />from idea to delivery</span></div><div><strong>10<span>+</span></strong><span>Projects in our<br />company portfolio</span></div><div><strong>11<span>+</span></strong><span>Services across<br />digital disciplines</span></div></Reveal>
      </div></section>

      <section id="skills" className="portfolio-section skills-section"><div className="portfolio-container"><Reveal className="section-intro"><div><Eyebrow>Skills</Eyebrow><Heading>Our <em>tech</em> stack</Heading></div><p>Tools and disciplines across mobile, web, commerce, AI and creative work — grouped so you can see where each one fits.</p></Reveal><div className="skills-grid">{skillGroups.map(group => { const Icon = icons[group.icon]; return <Reveal key={group.name} className={`skill-reveal ${group.span === "wide" ? "skill-wide" : ""}`}><article className="skill-card"><div className="skill-number">{String(group.items.length).padStart(2, "0")}</div><div className="skill-title"><span className="skill-icon"><Icon size={19} /></span><div><h3>{group.name}</h3><p>{group.description}</p></div></div><div className="tag-list">{group.items.map(item => <span key={item}>{item}</span>)}</div></article></Reveal>; })}</div></div></section>

      <section id="experience" className="portfolio-section experience-section"><div className="portfolio-container"><Reveal className="center-heading"><Eyebrow>Our approach</Eyebrow><Heading>How we <em>work</em></Heading><p>A clear path from the first conversation to the finished product.</p></Reveal><div className="timeline" ref={timelineRef}>{process.map((step, i) => <Reveal key={step.title} className="timeline-row"><div className="timeline-label"><span>STEP {String(i + 1).padStart(2, "0")}</span><h3>{step.title}</h3></div><div className="timeline-marker"><span>{String(i + 1).padStart(2, "0")}</span></div><div className="timeline-panel"><h3>{step.title}</h3><p>{step.description}</p><div className="timeline-line"><Check size={15} /> From idea to delivery, with one team.</div></div></Reveal>)}</div></div></section>

      <section id="projects" className="portfolio-section projects-section"><div className="portfolio-container"><Reveal className="section-intro"><div><Eyebrow>Portfolio</Eyebrow><Heading>Selected <em>projects</em></Heading></div><p>Explore live examples listed in our company portfolio.</p></Reveal><div className="featured-projects">{projects.slice(0, 4).map((project, i) => <Reveal key={project.title} className="project-reveal"><article className="featured-project"><div className="project-details"><div className="project-topline"><span><b>{String(i + 1).padStart(2, "0")}</b> / {String(projects.length).padStart(2, "0")}</span><span className="project-status">● Live project</span></div><div><h3>{project.title}</h3><p>{project.type} website</p><div className="project-highlight"><span>{project.initials}</span> A live project from the Teamwork Digital portfolio</div><ul><li><Check size={15} /> Website development and implementation</li><li><Check size={15} /> Built to support a distinct business presence online</li></ul></div><div className="project-bottom"><span className="project-pill">{project.type}</span><Button asChild variant="outline" size="sm"><a href={project.url} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${project.title}`}>Visit site <ArrowUpRight size={14} /></a></Button></div></div><a className={`project-preview preview-${i}`} href={project.url} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${project.title}`}><img className="project-site-image" src={featuredPreviews[i]?.url} alt={`${project.title} website preview`} loading="lazy" /><span className="preview-badge">Explore project <ArrowUpRight size={13} /></span></a></article></Reveal>)}</div><Reveal className="more-projects"><h3>More things we've built</h3><div className="more-grid">{projects.slice(4).map(project => <a key={project.title} href={project.url} target="_blank" rel="noopener noreferrer" className="more-project"><span className="project-pill">{project.type}</span><ArrowUpRight size={19} /><h4>{project.title}</h4><p>Visit live website</p></a>)}</div></Reveal></div></section>

      <section id="credentials" className="portfolio-section credentials-section"><div className="portfolio-container"><Reveal><Eyebrow>Our process</Eyebrow><Heading>From idea <em>to</em> impact</Heading><p className="credentials-lead">A complete digital team to take care of the work from planning through support.</p></Reveal><div className="credentials-layout"><Reveal className="credentials-primary"><span className="credentials-index">01</span><div><small>TEAMWORK DIGITAL</small><h3>Your vision, our expertise.</h3><p>From mobile apps and websites to creative and AI solutions.</p></div><Users size={26} /></Reveal><Reveal className="credentials-secondary"><span className="credentials-index">02</span><div><small>COMPANY PROFILE</small><h3>See the full overview</h3><p>Explore our services and portfolio in the company profile.</p><Button asChild variant="outline" size="sm"><a href={profile.url} target="_blank" rel="noopener noreferrer">View profile <ArrowUpRight size={14} /></a></Button></div></Reveal></div></div></section>

      <section id="contact" className="portfolio-contact"><div className="portfolio-container"><Reveal className="contact-panel"><div className="contact-copy"><Eyebrow>Contact</Eyebrow><Heading>Have a project<br />idea? <em>Let's talk.</em></Heading><p>Whether it's a mobile app, a website, a new brand or a complete digital product — let's start the conversation.</p><div className="contact-actions"><Button asChild><a href={profile.url} target="_blank" rel="noopener noreferrer">Company profile <ArrowUpRight size={16} /></a></Button><Button variant="outline" onClick={copyPage}>{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? "Link copied" : "Copy page link"}</Button></div></div><div className="contact-aside"><img src={logo.url} alt="Teamwork Digital logo" /><strong>TEAMWORK<br />DIGITAL.</strong><span>Your vision.<br />Our expertise.</span><a href="#home">Back to top <ChevronUp size={16} /></a></div></Reveal></div></section>
    </main>
    <footer className="portfolio-footer"><div className="portfolio-container"><Brand /><span>© {new Date().getFullYear()} Teamwork Digital</span><a href="#home">Back to top <ChevronUp size={15} /></a></div></footer>
  </div>;
}
