import type { ContentKey } from "./site-content";

export type FieldType = "text" | "textarea" | "url" | "image" | "tags" | "icon" | "select" | "switch" | "number" | "socials";
export type Field = { key: string; label: string; type: FieldType; options?: string[]; help?: string; optionsFrom?: ContentKey };
export type SectionDef =
  | { key: ContentKey; label: string; description: string; kind: "object"; fields: Field[] }
  | { key: ContentKey; label: string; description: string; kind: "list"; fields: Field[]; itemTitle: string; newItem: () => Record<string, unknown> }
  | { key: ContentKey; label: string; description: string; kind: "strings"; itemLabel: string };

const newId = () => (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now()));

/** Editable public-site sections, in page order. Each field key may be a dotted path (e.g. socials.linkedin). */
export const contentSections: SectionDef[] = [
  { key: "hero", label: "Opening", description: "The first screen visitors see.", kind: "object", fields: [
    { key: "hello", label: "Small greeting", type: "text" }, { key: "titleStart", label: "Headline start", type: "text" },
    { key: "titleEmphasis", label: "Highlighted word", type: "text" }, { key: "titleEnd", label: "Headline second line", type: "text" },
    { key: "quote", label: "Quote on the left", type: "textarea" }, { key: "asideSmall", label: "Right label", type: "text" },
    { key: "asideStrong", label: "Right title", type: "text" }, { key: "asideText", label: "Right text", type: "text" },
    { key: "floatTop", label: "Floating badge 1", type: "text" }, { key: "floatBottom", label: "Floating badge 2", type: "text" },
    { key: "primaryLabel", label: "Main button", type: "text" }, { key: "secondaryLabel", label: "Second button", type: "text" },
    { key: "portrait", label: "Opening photo", type: "image", help: "Leave empty to keep the current team leader photo." },
  ] },
  { key: "services", label: "Services", description: "What you offer, with an icon and tags.", kind: "list", itemTitle: "title", fields: [
    { key: "title", label: "Title", type: "text" }, { key: "icon", label: "Icon", type: "icon" },
    { key: "description", label: "Description", type: "textarea" }, { key: "tags", label: "Tags", type: "tags" },
  ], newItem: () => ({ id: newId(), published: true, title: "New service", icon: "code", description: "", tags: [] }) },
  { key: "techStack", label: "Tech strip", description: "Tools shown in the moving strip and under services.", kind: "strings", itemLabel: "Technology" },
  { key: "reasons", label: "Why us", description: "Reasons clients choose Teamwork Digital.", kind: "list", itemTitle: "title", fields: [
    { key: "title", label: "Title", type: "text" }, { key: "icon", label: "Icon", type: "icon" }, { key: "description", label: "Description", type: "textarea" },
  ], newItem: () => ({ id: newId(), published: true, title: "New reason", icon: "check", description: "" }) },
  { key: "process", label: "Process", description: "The How we work timeline.", kind: "list", itemTitle: "title", fields: [
    { key: "title", label: "Step name", type: "text" }, { key: "period", label: "Stage label", type: "text" },
    { key: "description", label: "Description", type: "textarea" }, { key: "points", label: "Key points", type: "tags" }, { key: "tags", label: "Tags", type: "tags" },
  ], newItem: () => ({ id: newId(), published: true, title: "New step", period: "", description: "", points: [], tags: [] }) },
  { key: "projectCategories", label: "Project filters", description: "Filter buttons above the projects. Keep \"All\" first.", kind: "strings", itemLabel: "Category" },
  { key: "projects", label: "Projects", description: "Portfolio work with screenshots and links.", kind: "list", itemTitle: "title", fields: [
    { key: "title", label: "Project name", type: "text" }, { key: "category", label: "Filter category", type: "select", optionsFrom: "projectCategories" },
    { key: "type", label: "Type label", type: "text" }, { key: "url", label: "Live link", type: "url" },
    { key: "initials", label: "Initials (shown if no image)", type: "text" }, { key: "image", label: "Screenshot", type: "image", help: "Leave empty to keep the built-in screenshot." },
    { key: "description", label: "Short description", type: "textarea" }, { key: "slug", label: "Page address (for project pages)", type: "text" },
  ], newItem: () => ({ id: newId(), published: true, title: "New project", category: "Other", type: "Website", url: "https://", initials: "NP", image: "", description: "", slug: "" }) },
  { key: "teamSection", label: "Team intro", description: "Headings around the team section.", kind: "object", fields: [
    { key: "heading", label: "Heading", type: "text" }, { key: "intro", label: "Intro", type: "textarea" },
    { key: "leaderLabel", label: "Leader label 1", type: "text" }, { key: "managerLabel", label: "Leader label 2", type: "text" },
    { key: "photoLabel", label: "Photo caption", type: "text" }, { key: "leaderStatement", label: "Leader quote", type: "textarea" },
    { key: "contactLabel", label: "Button text", type: "text" },
  ] },
  { key: "team", label: "Team members", description: "Member cards show a photo, name, designation and social links. One member can be marked as the featured leader.", kind: "list", itemTitle: "name", fields: [
    { key: "name", label: "Name", type: "text" }, { key: "role", label: "Designation", type: "text" }, { key: "bio", label: "One-line bio (optional)", type: "textarea" },
    { key: "photo", label: "Photo (required)", type: "image", help: "Upload a member portrait, choose from the media library or paste an image link. Every card should have a photo; an empty one shows initials as a fallback." }, { key: "leader", label: "Featured leader", type: "switch" },
    { key: "socials", label: "Social links", type: "socials", help: "Add as many links as needed and pick the network icon for each one." },
  ], newItem: () => ({ id: newId(), published: true, name: "New member", role: "", bio: "", photo: "", leader: false, socials: [] }) },
  { key: "testimonials", label: "Testimonials", description: "Client quotes with star ratings.", kind: "list", itemTitle: "name", fields: [
    { key: "quote", label: "Quote", type: "textarea" }, { key: "name", label: "Client name", type: "text" },
    { key: "company", label: "Company", type: "text" }, { key: "service", label: "Service provided", type: "text" },
    { key: "rating", label: "Stars (1-5)", type: "number" },
  ], newItem: () => ({ id: newId(), published: true, quote: "", name: "", company: "", service: "", rating: 5 }) },
  { key: "faqs", label: "FAQ", description: "Questions shown next to the contact details.", kind: "list", itemTitle: "q", fields: [
    { key: "q", label: "Question", type: "text" }, { key: "a", label: "Answer", type: "textarea" },
  ], newItem: () => ({ id: newId(), published: true, q: "New question", a: "" }) },
  { key: "contact", label: "Contact", description: "Contact details and the message form.", kind: "object", fields: [
    { key: "heading", label: "Heading", type: "text" }, { key: "text", label: "Text", type: "textarea" },
    { key: "email", label: "Email", type: "text" }, { key: "whatsapp", label: "WhatsApp number", type: "text" },
    { key: "whatsappLink", label: "WhatsApp link", type: "url", help: "Format: https://wa.me/923001234567" },
    { key: "phone", label: "Phone (optional)", type: "text" }, { key: "address", label: "Address (optional)", type: "text" },
    { key: "linkedin", label: "LinkedIn page", type: "url" }, { key: "instagram", label: "Instagram page", type: "url" }, { key: "facebook", label: "Facebook page", type: "url" },
    { key: "showForm", label: "Show message form", type: "switch" },
  ] },
];

export const getPath = (obj: Record<string, unknown>, path: string): unknown => path.split(".").reduce<unknown>((o, k) => (o && typeof o === "object" ? (o as Record<string, unknown>)[k] : undefined), obj);
export function setPath<T extends Record<string, unknown>>(obj: T, path: string, value: unknown): T {
  const [head = "", ...rest] = path.split(".");
  if (!rest.length) return { ...obj, [head]: value };
  const child = (obj[head] && typeof obj[head] === "object" ? obj[head] : {}) as Record<string, unknown>;
  return { ...obj, [head]: setPath(child, rest.join("."), value) };
}
