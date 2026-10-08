import * as data from "./portfolio-data";
import leaderPhoto from "@/assets/team-leader.jpeg.asset.json";
import { projectPreviews } from "./project-previews";
import { normalizeSocials, type SocialLink } from "./social-icons";

/** Every editable section of the public site. Defaults come from portfolio-data.ts; saved dashboard values override them. */
type Item = { id: string; published?: boolean };
export type Service = Item & { title: string; icon: string; description: string; tags: string[] };
export type Reason = Item & { icon: string; title: string; description: string };
export type ProcessStep = Item & { title: string; period: string; description: string; points: string[]; tags: string[] };
export type Project = Item & { title: string; category: string; type: string; url: string; initials: string; image?: string; description?: string; slug?: string };
export type Member = Item & { name: string; role: string; bio: string; leader?: boolean; photo?: string; socials: SocialLink[] };
export type Testimonial = Item & { quote: string; name: string; company: string; service: string; rating?: number; photo?: string };
export type Faq = Item & { q: string; a: string };

export type SiteContent = {
  hero: { hello: string; titleStart: string; titleEmphasis: string; titleEnd: string; quote: string; asideSmall: string; asideStrong: string; asideText: string; floatTop: string; floatBottom: string; portrait: string; primaryLabel: string; secondaryLabel: string };
  services: Service[];
  reasons: Reason[];
  process: ProcessStep[];
  techStack: string[];
  projects: Project[];
  projectCategories: string[];
  team: Member[];
  teamSection: typeof data.teamSection;
  testimonials: Testimonial[];
  faqs: Faq[];
  contact: { heading: string; text: string; email: string; whatsapp: string; whatsappLink: string; phone: string; address: string; linkedin: string; instagram: string; facebook: string; showForm: boolean };
  seo: { title: string; description: string; ogImage: string; keywords: string; gscVerification: string; bingVerification: string; gaId: string; allowIndexing: boolean };
  chatbot: { enabled: boolean; name: string; subtitle: string; welcomeTitle: string; welcomeText: string; suggestions: string[]; extraInstructions: string };
  settings: { siteName: string; logo: string; projectPages: boolean; notifyEmail: string };
};

export const slugify = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
const ids = <T extends object>(list: readonly T[], prefix: string) => list.map((x, i) => ({ id: `${prefix}-${i + 1}`, published: true, ...x }));

export const defaultContent: SiteContent = {
  hero: { hello: "Hello!", titleStart: "We are", titleEmphasis: "Teamwork", titleEnd: "Digital Developers", quote: "We build digital products from first idea to release — with one connected team.", asideSmall: "YOUR VISION", asideStrong: "One complete team", asideText: "for every digital idea", floatTop: "Flutter & React Native", floatBottom: "Websites · AI · Creative", portrait: leaderPhoto.url, primaryLabel: "View Projects", secondaryLabel: "Hire Us" },
  services: ids(data.services.map(s => ({ ...s, tags: [...s.tags] })), "svc"),
  reasons: ids(data.reasons.map(r => ({ ...r })), "why"),
  process: ids(data.process.map(p => ({ ...p, points: [...p.points], tags: [...p.tags] })), "step"),
  techStack: [...data.techStack],
  projects: ids(data.projects.map(p => ({ ...p, image: projectPreviews[p.initials]?.large ?? "", slug: slugify(p.title), description: "" })), "prj"),
  projectCategories: [...data.projectCategories],
  team: ids(data.team.map((m, i) => ({ ...m, photo: m.leader ? leaderPhoto.url : "", socials: normalizeSocials(m.socials).map((x, j) => ({ ...x, id: `s-${i}-${j}` })) })), "team"),
  teamSection: { ...data.teamSection },
  testimonials: ids(data.testimonials.map(t => ({ ...t, rating: 5 })), "tst"),
  faqs: ids(data.faqs.map(f => ({ ...f })), "faq"),
  contact: { heading: "Have a project idea? Let's talk.", text: "Whether it's a mobile app, a website, a new brand or a complete digital product — let's start the conversation.", email: data.contact.email, whatsapp: data.contact.whatsapp, whatsappLink: data.contact.whatsappLink, phone: "", address: "", linkedin: "", instagram: "", facebook: "", showForm: true },
  seo: { title: "Teamwork Digital — Complete Software Development Team", description: "Teamwork Digital builds mobile apps, websites, e-commerce stores, AI solutions, games, design and more. One team from idea to delivery.", ogImage: "", keywords: "", gscVerification: "", bingVerification: "", gaId: "", allowIndexing: true },
  chatbot: { enabled: true, name: "Teamwork Assistant", subtitle: "Instant answers", welcomeTitle: "What are you building?", welcomeText: "Tell me about your idea.", suggestions: ["I need a mobile app", "Help me choose a website platform", "Can AI automate my business?"], extraInstructions: "" },
  settings: { siteName: "Teamwork Digital", logo: "", projectPages: false, notifyEmail: "" },
};

export type ContentKey = keyof SiteContent;
export const contentKeys = Object.keys(defaultContent) as ContentKey[];

/** Merge saved rows over defaults. Lists replace wholesale; objects merge field by field so new fields keep defaults. */
export function mergeContent(rows: { key: string; value: unknown }[] | null | undefined): SiteContent {
  const out = structuredClone(defaultContent) as Record<string, unknown>;
  for (const row of rows ?? []) {
    const base = out[row.key];
    if (base === undefined || row.value == null) continue;
    if (Array.isArray(base)) { if (Array.isArray(row.value)) out[row.key] = row.value; }
    else if (typeof base === "object" && typeof row.value === "object" && !Array.isArray(row.value)) out[row.key] = { ...(base as object), ...(row.value as object) };
  }
  return out as SiteContent;
}

/** Items hidden in the dashboard (draft) never show on the public site. */
export const visible = <T extends { published?: boolean }>(list: T[]) => list.filter(x => x.published !== false);
