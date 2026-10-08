import { visible, type SiteContent } from "./site-content";

/** API-free assistant: answers visitor questions from the site's own content and the dashboard's chatbot answers. */
export type Knowledge = { kind: string; title: string; trigger: string; content: string };
export type GuideReply = { text: string; chips: string[] };

export const MENU = ["Our services", "Our projects", "How we work", "FAQs", "Contact the team"];

const STOP = new Set("a an the and or of to for in on is are do does you your we our i me my can how what which with it this that be have has need want about any".split(" "));
const words = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9+#.]+/g, " ").split(" ").filter(w => w.length > 1 && !STOP.has(w));

function score(query: string[], text: string) {
  const hay = new Set(words(text));
  let n = 0;
  for (const w of query) { if (hay.has(w)) n += 2; else if ([...hay].some(h => h.length > 3 && (h.startsWith(w) || w.startsWith(h)))) n += 1; }
  return n;
}

function contactText(c: SiteContent["contact"]) {
  const lines = [
    c.whatsapp && `- **WhatsApp:** [${c.whatsapp}](${c.whatsappLink || "#contact"})`,
    c.email && `- **Email:** [${c.email}](mailto:${c.email})`,
    c.phone && `- **Phone:** ${c.phone}`,
    c.address && `- **Address:** ${c.address}`,
  ].filter(Boolean);
  return `${c.heading}\n\n${lines.join("\n")}\n\nYou can also use the [contact form](/#contact) and our team will get back to you.`;
}

export function guideReply(input: string, site: SiteContent, knowledge: Knowledge[]): GuideReply {
  const q = input.trim().toLowerCase();
  const services = visible(site.services), projects = visible(site.projects), steps = visible(site.process), faqs = visible(site.faqs);
  const back = ["Contact the team", "Our services", "FAQs"];

  if (/^(hi|hello|hey|salam|assalam|aoa)\b/.test(q)) return { text: `${site.chatbot.welcomeText || "Hello!"} Choose a topic below or type your question.`, chips: MENU };
  if (q === "our services" || /^(services?|what (do|can) you (do|offer))/.test(q))
    return { text: `Here's what we offer:\n\n${services.map(s => `- **${s.title}** — ${s.description}`).join("\n")}\n\nTap a service to learn more.`, chips: services.slice(0, 6).map(s => s.title) };
  if (q === "our projects" || /^(projects?|portfolio|work|show.*work)/.test(q))
    return { text: `Some of our recent work:\n\n${projects.map(p => `- **${p.title}** (${p.type})${p.url && p.url !== "#" ? ` — [visit site](${p.url})` : ""}`).join("\n")}`, chips: back };
  if (q === "how we work" || /process|steps|how (do )?you work/.test(q))
    return { text: `Our process:\n\n${steps.map((s, i) => `${i + 1}. **${s.title}** — ${s.description}`).join("\n")}`, chips: back };
  if (q === "faqs" || q === "faq") return { text: "Common questions — tap one:", chips: faqs.map(f => f.q).slice(0, 8) };
  if (q === "contact the team" || /contact|whatsapp|email|call|talk|hire|quote|price|cost|budget|start/.test(q))
    return { text: contactText(site.contact), chips: ["Our services", "How we work"] };

  const query = words(input);
  type Hit = { s: number; text: string; chips?: string[] };
  const hits: Hit[] = [
    ...knowledge.map(k => ({ s: score(query, `${k.title} ${k.trigger} ${k.trigger}`) * 1.5, text: k.content })),
    ...faqs.map(f => ({ s: score(query, `${f.q} ${f.q}`), text: `**${f.q}**\n\n${f.a}` })),
    ...services.map(s => ({ s: score(query, `${s.title} ${s.title} ${s.tags.join(" ")} ${s.description}`), text: `**${s.title}**\n\n${s.description}${s.tags.length ? `\n\nWe work with: ${s.tags.join(", ")}.` : ""}`, chips: ["Our projects", "Contact the team"] })),
    ...projects.map(p => ({ s: score(query, `${p.title} ${p.title} ${p.category} ${p.type}`), text: `**${p.title}** — ${p.type}${p.url && p.url !== "#" ? `\n\n[Visit the site](${p.url})` : ""}`, chips: ["Our projects", "Contact the team"] })),
    ...steps.map(s => ({ s: score(query, `${s.title} ${s.description}`) * 0.8, text: `**${s.title}** — ${s.description}`, chips: ["How we work"] })),
  ];
  const best = hits.sort((a, b) => b.s - a.s)[0];
  if (best && best.s >= 2) return { text: best.text, chips: best.chips ?? back };
  return { text: "I'm not sure about that one, but our team can help directly. Pick a topic below or reach out:\n\n" + contactText(site.contact), chips: MENU };
}
