import { createFileRoute, useBlocker } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { RotateCcw, Save, Palette, Type } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveSection, useStaff } from "@/lib/admin-client";
import { useSiteContent } from "@/lib/site-content.functions";
import { accentText, appearanceCss, appearanceSections, colorFields, contrastRatio, defaultAppearance, fontOptions, normalizeAppearance, validColor, type Appearance, type Colors } from "@/lib/appearance";

export const Route = createFileRoute("/_authenticated/admin/appearance")({
  head: () => ({ meta: [
    { title: "Appearance — Teamwork Digital" }, { name: "description", content: "Manage website colors, typography and section styles." },
    { property: "og:title", content: "Appearance — Teamwork Digital" }, { property: "og:description", content: "Website appearance settings." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex" },
  ] }), component: AppearancePage,
});

function ColorControl({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [text, setText] = useState(value);
  useEffect(() => setText(value), [value]);
  return <label className="grid gap-2 text-sm font-medium text-foreground">{label}<div className="flex items-center gap-2">
    <input type="color" aria-label={`${label} color`} value={value} onChange={e => onChange(e.target.value)} className="h-10 w-12 shrink-0 cursor-pointer rounded border border-input bg-background p-1" />
    <Input aria-label={`${label} hex`} value={text} maxLength={7} onChange={e => { setText(e.target.value); if (validColor(e.target.value)) onChange(e.target.value); }} onBlur={() => setText(value)} />
  </div></label>;
}

function AppearancePage() {
  const site = useSiteContent();
  const { data: staff } = useStaff();
  const saveSection = useSaveSection();
  const saved = normalizeAppearance(site.settings.appearance);
  const savedJson = JSON.stringify(saved);
  const [draft, setDraft] = useState<Appearance>(saved);
  const [section, setSection] = useState("global");
  const [saving, setSaving] = useState(false);
  useEffect(() => { setDraft(JSON.parse(savedJson) as Appearance); }, [savedJson]);
  const dirty = JSON.stringify(draft) !== savedJson;
  useBlocker({ shouldBlockFn: () => dirty && !window.confirm("Discard your unsaved appearance changes?"), enableBeforeUnload: dirty });
  if (staff?.role !== "admin") return <p className="text-muted-foreground">Only admins can change website appearance.</p>;
  const overrides = section === "global" ? {} : draft.sections[section] ?? {};
  const colors: Colors = { ...draft.colors, ...overrides };
  const changeColor = (key: keyof Colors, value: string) => setDraft(d => section === "global" ? { ...d, colors: { ...d.colors, [key]: value } } : { ...d, sections: { ...d.sections, [section]: { ...d.sections[section], [key]: value } } });
  const changeTypography = (key: keyof Appearance["typography"], value: string | number) => setDraft(d => ({ ...d, typography: { ...d.typography, [key]: value } }));
  const save = async () => {
    setSaving(true);
    try { await saveSection("settings", { ...site.settings, appearance: normalizeAppearance(draft) }); toast.success("Appearance saved — live on the website"); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Couldn't save appearance"); }
    finally { setSaving(false); }
  };
  const previewCss = appearanceCss({ ...draft, colors, sections: {} }).replaceAll(".portfolio-page", ".appearance-preview").replaceAll(".work-page", ".appearance-work-unused").replaceAll(".td-chat", ".appearance-chat-unused");
  const lowContrast = contrastRatio(colors.text, colors.background) < 4.5 || contrastRatio(colors.muted, colors.surface) < 4.5;
  return <div className="space-y-8">
    <div className="sticky top-0 z-10 -mx-4 flex flex-wrap items-center justify-between gap-3 border-b bg-background/95 px-4 py-3 backdrop-blur md:-mx-8 md:px-8">
      <div><h1 className="text-xl font-semibold text-foreground">Appearance</h1><p className="text-sm text-muted-foreground">Website colors and typography. The dashboard stays unchanged.</p></div>
      <div className="flex flex-wrap gap-2"><Button variant="outline" size="sm" onClick={() => { if (window.confirm("Restore the original website colors and typography? Save to apply.")) setDraft(structuredClone(defaultAppearance)); }}><RotateCcw />Restore original</Button>{dirty && <Button variant="ghost" size="sm" onClick={() => setDraft(saved)}>Discard</Button>}<Button size="sm" disabled={!dirty || saving} onClick={save}><Save />{saving ? "Saving…" : dirty ? "Save changes" : "Saved"}</Button></div>
    </div>
    <div className="grid items-start gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(280px,0.8fr)]">
      <div className="min-w-0 space-y-8">
        <section className="space-y-5"><h2 className="flex items-center gap-2 font-semibold text-foreground"><Palette size={18} />Colors</h2>
          <Select value={section} onValueChange={setSection}><SelectTrigger aria-label="Color scope" className="w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="global">Global — entire website</SelectItem>{appearanceSections.map(s => <SelectItem key={s.id} value={s.id}>{s.label}{draft.sections[s.id] ? " · customized" : ""}</SelectItem>)}</SelectContent></Select>
          {section !== "global" && <div className="flex flex-wrap items-center justify-between gap-2"><p className="text-sm text-muted-foreground">Unchanged colors follow the global settings.</p><Button variant="outline" size="sm" disabled={!Object.keys(overrides).length} onClick={() => setDraft(d => { const next = { ...d.sections }; delete next[section]; return { ...d, sections: next }; })}><RotateCcw />Use global colors</Button></div>}
          <div className="grid gap-4 sm:grid-cols-2">{colorFields.map(f => <div key={f.key} className="space-y-1"><ColorControl label={f.label} value={colors[f.key]} onChange={v => changeColor(f.key, v)} />{section !== "global" && overrides[f.key] && <Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={() => setDraft(d => { const next = { ...d.sections[section] }; delete next[f.key]; return { ...d, sections: { ...d.sections, [section]: next } }; })}>Reset to global</Button>}</div>)}</div>
          {lowContrast && <p role="status" className="rounded-md border border-destructive/40 p-3 text-sm text-destructive">Some text may be hard to read. Increase the contrast between text and backgrounds.</p>}
        </section>
        <section className="space-y-5 border-t pt-6"><h2 className="flex items-center gap-2 font-semibold text-foreground"><Type size={18} />Global typography</h2><div className="grid gap-4 sm:grid-cols-2">
          {(["headings", "body"] as const).map(key => <label key={key} className="space-y-2 text-sm font-medium text-foreground"><span className="block">{key === "headings" ? "Heading font" : "Body font"}</span><Select value={draft.typography[key]} onValueChange={v => changeTypography(key, v)}><SelectTrigger aria-label={key === "headings" ? "Heading font" : "Body font"}><SelectValue /></SelectTrigger><SelectContent>{fontOptions.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent></Select></label>)}
          <label className="space-y-2 text-sm font-medium text-foreground"><span className="block">Heading weight</span><Select value={String(draft.typography.headingWeight)} onValueChange={v => changeTypography("headingWeight", Number(v))}><SelectTrigger aria-label="Heading weight"><SelectValue /></SelectTrigger><SelectContent>{[400,500,600,700,800].map(w => <SelectItem key={w} value={String(w)}>{w}</SelectItem>)}</SelectContent></Select></label>
          <label className="space-y-2 text-sm font-medium text-foreground"><span className="block">Body line spacing · {draft.typography.lineHeight.toFixed(1)}</span><input aria-label="Body line spacing" type="range" min="1.4" max="2" step="0.1" value={draft.typography.lineHeight} onChange={e => changeTypography("lineHeight", Number(e.target.value))} className="mt-3 w-full accent-primary" /></label>
        </div></section>
      </div>
      <aside className="min-w-0 space-y-3 xl:sticky xl:top-24"><h2 className="text-sm font-medium text-muted-foreground">Preview · {section === "global" ? "Global" : appearanceSections.find(s => s.id === section)?.label}</h2><style>{previewCss}</style><div className="appearance-preview rounded-lg border border-border bg-background p-6 text-foreground"><span className="text-sm font-medium text-primary">Teamwork Digital</span><h2 className="mt-4 text-3xl">Your vision.<br />Our expertise.</h2><p className="mt-4 text-sm text-muted-foreground">One connected team for development, design and digital solutions.</p><div className="mt-6 border-t border-border pt-5"><h3 className="text-lg">Selected projects</h3><p className="mt-2 text-sm text-muted-foreground">From the first idea to the final launch.</p></div><Button className="mt-6" type="button">Start a project</Button></div></aside>
    </div>
  </div>;
}