import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { siteIcons } from "@/lib/site-icons";
import { uploadImage } from "@/lib/admin-client";
import type { Field } from "@/lib/admin-sections";
import { MediaPicker } from "./media-picker";

export function TagsInput({ value, onChange, placeholder = "Type and press Enter" }: { value: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const [draft, setDraft] = useState("");
  const add = () => { const t = draft.trim(); if (t && !value.includes(t)) onChange([...value, t]); setDraft(""); };
  return <div className="flex flex-wrap gap-1.5 rounded-md border bg-background p-2">
    {value.map(tag => <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 text-xs text-secondary-foreground">{tag}<button type="button" aria-label={`Remove ${tag}`} onClick={() => onChange(value.filter(t => t !== tag))}><X size={12} /></button></span>)}
    <input className="min-w-[8rem] flex-1 bg-transparent px-1 text-sm outline-none" value={draft} placeholder={placeholder} onChange={e => setDraft(e.target.value)} onBlur={add} onKeyDown={e => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(); } }} />
  </div>;
}

export function IconPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return <div className="grid grid-cols-8 gap-1.5 sm:grid-cols-10">
    {Object.entries(siteIcons).map(([key, Icon]) => <button key={key} type="button" title={key} aria-label={key} aria-pressed={value === key} onClick={() => onChange(key)}
      className={`flex aspect-square items-center justify-center rounded-md border transition-colors ${value === key ? "border-primary bg-primary text-primary-foreground" : "bg-background hover:bg-muted"}`}><Icon size={17} /></button>)}
  </div>;
}

export function ImageField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [picker, setPicker] = useState(false);
  const pick = async (file?: File) => {
    if (!file) return;
    setBusy(true);
    try { onChange(await uploadImage(file)); toast.success("Image uploaded"); } catch (e) { toast.error(e instanceof Error ? e.message : "Upload failed"); } finally { setBusy(false); }
  };
  return <div className="flex items-start gap-3">
    <div className="flex h-20 w-28 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted">{value ? <img src={value} alt="" className="h-full w-full object-cover" /> : <ImagePlus className="text-muted-foreground" size={22} />}</div>
    <div className="flex flex-1 flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        <Button type="button" size="sm" variant="outline" disabled={busy} onClick={() => input.current?.click()}>{busy ? <Loader2 className="animate-spin" /> : <ImagePlus />}Upload</Button>
        <Button type="button" size="sm" variant="outline" onClick={() => setPicker(true)}>Choose from library</Button>
        {value && <Button type="button" size="sm" variant="ghost" onClick={() => onChange("")}>Remove</Button>}
      </div>
      <Input value={value} placeholder="or paste an image link" onChange={e => onChange(e.target.value)} />
      <input ref={input} type="file" accept="image/*" hidden onChange={e => { void pick(e.target.files?.[0]); e.target.value = ""; }} />
    </div>
    <MediaPicker open={picker} onOpenChange={setPicker} onPick={url => { onChange(url); setPicker(false); }} />
  </div>;
}

export function FieldInput({ field, value, onChange, options }: { field: Field; value: unknown; onChange: (v: unknown) => void; options?: string[] }) {
  const id = `f-${field.key}`;
  const control = (() => {
    switch (field.type) {
      case "textarea": return <Textarea id={id} rows={3} value={String(value ?? "")} onChange={e => onChange(e.target.value)} />;
      case "tags": return <TagsInput value={Array.isArray(value) ? value.map(String) : []} onChange={onChange} />;
      case "icon": return <IconPicker value={String(value ?? "")} onChange={onChange} />;
      case "image": return <ImageField value={String(value ?? "")} onChange={onChange} />;
      case "switch": return <Switch id={id} checked={Boolean(value)} onCheckedChange={onChange} />;
      case "number": return <Input id={id} type="number" min={1} max={5} value={Number(value ?? 5)} onChange={e => onChange(Number(e.target.value))} className="w-24" />;
      case "select": {
        const opts = (options ?? field.options ?? []).filter(o => o !== "All");
        return <Select value={String(value ?? "")} onValueChange={onChange}><SelectTrigger id={id} className="w-56"><SelectValue placeholder="Choose" /></SelectTrigger><SelectContent>{opts.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent></Select>;
      }
      default: return <Input id={id} type={field.type === "url" ? "url" : "text"} value={String(value ?? "")} onChange={e => onChange(e.target.value)} />;
    }
  })();
  return <div className={field.type === "switch" ? "flex items-center justify-between gap-4" : "space-y-1.5"}>
    <Label htmlFor={id}>{field.label}</Label>
    {control}
    {field.help && <p className="text-xs text-muted-foreground">{field.help}</p>}
  </div>;
}
