export const colorFields = [
  { key: "background", label: "Background", value: "#111111" },
  { key: "surface", label: "Cards", value: "#1b1b1b" },
  { key: "secondary", label: "Secondary surfaces", value: "#252525" },
  { key: "text", label: "Text", value: "#ffffff" },
  { key: "muted", label: "Supporting text", value: "#cecece" },
  { key: "accent", label: "Accent & buttons", value: "#c9f950" },
  { key: "border", label: "Borders", value: "#333333" },
] as const;
export type ColorKey = typeof colorFields[number]["key"];
export type Colors = Record<ColorKey, string>;
export const appearanceSections = [
  { id: "home", label: "Opening" }, { id: "services", label: "Services & technologies" },
  { id: "about", label: "About & core strengths" }, { id: "why", label: "Why us" },
  { id: "experience", label: "Process" }, { id: "projects", label: "Portfolio" },
  { id: "team", label: "Team" }, { id: "testimonials", label: "Testimonials" },
  { id: "contact", label: "Contact & FAQ" },
] as const;
export const fontOptions = ["Sora", "Plus Jakarta Sans", "Manrope", "Outfit", "DM Sans", "System"] as const;
export type Appearance = {
  colors: Colors;
  typography: { headings: string; body: string; headingWeight: number; lineHeight: number };
  sections: Record<string, Partial<Colors>>;
};
export const defaultAppearance: Appearance = {
  colors: Object.fromEntries(colorFields.map(f => [f.key, f.value])) as Colors,
  typography: { headings: "Sora", body: "Plus Jakarta Sans", headingWeight: 700, lineHeight: 1.7 },
  sections: {},
};
export function validColor(value: unknown): value is string { return typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value); }
export function normalizeAppearance(value: unknown): Appearance {
  const raw = value && typeof value === "object" ? value as Partial<Appearance> : {};
  const colors = { ...defaultAppearance.colors };
  for (const f of colorFields) { const v = raw.colors?.[f.key]; if (validColor(v)) colors[f.key] = v; }
  const sections: Appearance["sections"] = {};
  for (const section of appearanceSections) {
    const overrides: Partial<Colors> = {};
    for (const f of colorFields) { const v = raw.sections?.[section.id]?.[f.key]; if (validColor(v)) overrides[f.key] = v; }
    if (Object.keys(overrides).length) sections[section.id] = overrides;
  }
  const t = raw.typography;
  const font = (v: unknown, fallback: string) => fontOptions.some(f => f === v) ? String(v) : fallback;
  return { colors, sections, typography: {
    headings: font(t?.headings, defaultAppearance.typography.headings), body: font(t?.body, defaultAppearance.typography.body),
    headingWeight: [400, 500, 600, 700, 800].includes(t?.headingWeight ?? 0) ? Number(t?.headingWeight) : 700,
    lineHeight: typeof t?.lineHeight === "number" && t.lineHeight >= 1.4 && t.lineHeight <= 2 ? t.lineHeight : 1.7,
  } };
}
export function contrastRatio(a: string, b: string): number {
  const luminance = (hex: string) => {
    const rgb = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4);
    return (rgb[0] ?? 0) * .2126 + (rgb[1] ?? 0) * .7152 + (rgb[2] ?? 0) * .0722;
  };
  const x = luminance(a), y = luminance(b);
  return (Math.max(x, y) + .05) / (Math.min(x, y) + .05);
}
export function accentText(accent: string) { return contrastRatio(accent, "#111111") >= contrastRatio(accent, "#ffffff") ? "#111111" : "#ffffff"; }
function tokens(c: Colors) {
  return `--background:${c.background};--foreground:${c.text};--card:${c.surface};--card-foreground:${c.text};--popover:${c.surface};--popover-foreground:${c.text};--primary:${c.accent};--primary-foreground:${accentText(c.accent)};--secondary:${c.secondary};--secondary-foreground:${c.text};--muted:${c.secondary};--muted-foreground:${c.muted};--accent:${c.secondary};--accent-foreground:${c.text};--border:${c.border};--input:${c.border};--ring:${c.accent};--surface-ink:${c.background};--surface-ink-soft:${c.secondary};--surface-violet:${c.accent};--surface-cream:${c.surface};--text-on-dark:${c.text};--text-on-dark-muted:${c.muted};--brand-blue:${c.accent};--brand-cyan:${c.accent};--brand-warm:${c.accent};--brand-warm-soft:${c.secondary};`;
}
export function appearanceCss(value: unknown): string {
  if (!value) return "";
  const a = normalizeAppearance(value);
  const family = (font: string) => font === "System" ? "system-ui,sans-serif" : `"${font}",system-ui,sans-serif`;
  const scope = ".portfolio-page.portfolio-page, .work-page.work-page, .td-chat.td-chat";
  let css = `${scope}{${tokens(a.colors)}--font-display:${family(a.typography.headings)};--font-sans:${family(a.typography.body)};font-family:var(--font-sans);}`;
  css += `body:has(.portfolio-page),body:has(.work-page){background:${a.colors.background};}`;
  css += `.portfolio-page :is(h1,h2,h3),.work-page h1{font-family:var(--font-display);font-weight:${a.typography.headingWeight};}.portfolio-page p,.work-page p{font-family:var(--font-sans);line-height:${a.typography.lineHeight};}`;
  for (const s of appearanceSections) {
    const overrides = a.sections[s.id];
    if (overrides) css += `.portfolio-page #${s.id}{${tokens({ ...a.colors, ...overrides })}background-color:var(--background);color:var(--foreground);}`;
  }
  return css;
}