import { Dribbble, Facebook, Github, Globe, Instagram, Linkedin, Mail, MessageCircle, Phone, Twitter, Youtube, type LucideIcon } from "lucide-react";

export type SocialLink = { id?: string; icon: string; url: string };

/** Social networks a team member link can use. Keys are stored in content; never rename existing keys. */
export const socialIcons: Record<string, { label: string; Icon: LucideIcon }> = {
  linkedin: { label: "LinkedIn", Icon: Linkedin }, github: { label: "GitHub", Icon: Github },
  instagram: { label: "Instagram", Icon: Instagram }, facebook: { label: "Facebook", Icon: Facebook },
  x: { label: "X / Twitter", Icon: Twitter }, youtube: { label: "YouTube", Icon: Youtube },
  dribbble: { label: "Dribbble", Icon: Dribbble }, whatsapp: { label: "WhatsApp", Icon: MessageCircle },
  email: { label: "Email", Icon: Mail }, phone: { label: "Phone", Icon: Phone }, website: { label: "Website", Icon: Globe },
};

/** Accepts the new list format or the older { linkedin, github, ... } object and returns usable links. */
export function normalizeSocials(value: unknown): SocialLink[] {
  const list: SocialLink[] = Array.isArray(value)
    ? value.filter((s): s is SocialLink => !!s && typeof s === "object").map(s => ({ id: s.id, icon: String(s.icon ?? "website"), url: String(s.url ?? "") }))
    : value && typeof value === "object" ? Object.entries(value as Record<string, unknown>).map(([icon, url]) => ({ icon, url: String(url ?? "") })) : [];
  return list;
}

export function socialHref({ icon, url }: SocialLink) {
  const u = url.trim();
  if (icon === "email" && !u.startsWith("mailto:")) return `mailto:${u}`;
  if (icon === "phone" && !u.startsWith("tel:")) return `tel:${u.replace(/\s/g, "")}`;
  return u;
}

/** Only links with a real address appear on the public site. */
export const publicSocials = (value: unknown) => normalizeSocials(value).filter(s => s.url.trim() && s.url.trim() !== "#");
