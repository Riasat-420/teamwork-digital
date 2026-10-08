import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, ChevronDown, Copy, Eye, EyeOff, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useSiteContent } from "@/lib/site-content.functions";
import { defaultContent } from "@/lib/site-content";
import { useSaveSection } from "@/lib/admin-client";
import { getPath, setPath, type SectionDef } from "@/lib/admin-sections";
import { FieldInput, TagsInput } from "./fields";

type Row = Record<string, unknown>;

export function SectionEditor({ def }: { def: SectionDef }) {
  const site = useSiteContent();
  const saveSection = useSaveSection();
  const saved = site[def.key] as unknown;
  const [value, setValue] = useState<unknown>(saved);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState<number | null>(null);
  useEffect(() => { setValue(saved); }, [saved]);
  const dirty = JSON.stringify(value) !== JSON.stringify(saved);

  const save = async () => {
    setSaving(true);
    try { await saveSection(def.key, value); toast.success(`${def.label} saved — live on the website`); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Couldn't save"); }
    finally { setSaving(false); }
  };

  const header = <div className="sticky top-0 z-10 -mx-4 mb-6 flex flex-wrap items-center justify-between gap-3 border-b bg-background/95 px-4 py-3 backdrop-blur md:-mx-8 md:px-8">
    <div className="min-w-0"><h1 className="text-xl font-semibold text-foreground">{def.label}</h1><p className="text-sm text-muted-foreground">{def.description}</p></div>
    <div className="flex flex-wrap gap-2">
      <AlertDialog><AlertDialogTrigger asChild><Button variant="ghost" size="sm">Restore original</Button></AlertDialogTrigger><AlertDialogContent>
        <AlertDialogHeader><AlertDialogTitle>Restore the original content?</AlertDialogTitle><AlertDialogDescription>This loads the original {def.label.toLowerCase()} into the editor. Nothing changes on the website until you save.</AlertDialogDescription></AlertDialogHeader>
        <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => setValue(structuredClone(defaultContent[def.key]))}>Restore</AlertDialogAction></AlertDialogFooter>
      </AlertDialogContent></AlertDialog>
      {dirty && <Button variant="outline" size="sm" onClick={() => setValue(saved)}>Discard</Button>}
      <Button size="sm" onClick={save} disabled={!dirty || saving}><Save />{saving ? "Saving…" : dirty ? "Save changes" : "Saved"}</Button>
    </div>
  </div>;

  if (def.kind === "strings") {
    return <div>{header}<div className="max-w-2xl space-y-2"><p className="text-sm text-muted-foreground">{def.itemLabel}s appear in this order. Press Enter after each one.</p><TagsInput value={(value as string[]) ?? []} onChange={setValue} /></div></div>;
  }

  if (def.kind === "object") {
    const obj = (value ?? {}) as Row;
    return <div>{header}<div className="max-w-2xl space-y-5 rounded-xl border bg-card p-5">{def.fields.map(f => <FieldInput key={f.key} field={f} value={getPath(obj, f.key)} onChange={v => setValue(setPath(obj, f.key, v))} />)}</div></div>;
  }

  const list = ((value ?? []) as Row[]);
  const update = (i: number, next: Row) => setValue(list.map((r, j) => (j === i ? next : r)));
  const move = (i: number, dir: -1 | 1) => { const j = i + dir; if (j < 0 || j >= list.length) return; const next = [...list]; [next[i], next[j]] = [next[j]!, next[i]!]; setValue(next); setOpen(o => (o === i ? j : o)); };
  return <div>{header}
    <div className="max-w-3xl space-y-3">
      {list.map((row, i) => {
        const hidden = row["published"] === false;
        return <div key={String(row["id"] ?? i)} className={`rounded-xl border bg-card ${hidden ? "opacity-70" : ""}`}>
          <div className="flex flex-wrap items-center gap-1 p-3 sm:flex-nowrap sm:gap-2">
            <button type="button" className="flex min-w-0 basis-full items-center gap-2 text-left sm:basis-auto sm:flex-1" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}>
              <ChevronDown size={16} className={`transition-transform ${open === i ? "rotate-180" : ""}`} />
              <span className="truncate font-medium text-foreground">{String(getPath(row, def.itemTitle) || "Untitled")}</span>
              {hidden && <Badge variant="secondary">Hidden</Badge>}
            </button>
            <Button variant="ghost" size="icon-sm" aria-label="Move up" disabled={i === 0} onClick={() => move(i, -1)}><ArrowUp /></Button>
            <Button variant="ghost" size="icon-sm" aria-label="Move down" disabled={i === list.length - 1} onClick={() => move(i, 1)}><ArrowDown /></Button>
            <Button variant="ghost" size="icon-sm" aria-label={hidden ? "Show on website" : "Hide from website"} title={hidden ? "Show on website" : "Hide (draft)"} onClick={() => update(i, { ...row, published: hidden })}>{hidden ? <EyeOff /> : <Eye />}</Button>
            <Button variant="ghost" size="icon-sm" aria-label="Duplicate" onClick={() => { const next = [...list]; next.splice(i + 1, 0, { ...structuredClone(row), id: crypto.randomUUID() }); setValue(next); }}><Copy /></Button>
            <AlertDialog><AlertDialogTrigger asChild><Button variant="ghost" size="icon-sm" aria-label="Delete"><Trash2 /></Button></AlertDialogTrigger><AlertDialogContent>
              <AlertDialogHeader><AlertDialogTitle>Delete this item?</AlertDialogTitle><AlertDialogDescription>It disappears from the website after you save.</AlertDialogDescription></AlertDialogHeader>
              <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => { setValue(list.filter((_, j) => j !== i)); setOpen(null); }}>Delete</AlertDialogAction></AlertDialogFooter>
            </AlertDialogContent></AlertDialog>
          </div>
          {open === i && <div className="space-y-4 border-t p-4">{def.fields.map(f => <FieldInput key={f.key} field={f} value={getPath(row, f.key)} {...(f.optionsFrom ? { options: site[f.optionsFrom] as string[] } : {})} onChange={v => update(i, setPath(row, f.key, v))} />)}</div>}
        </div>;
      })}
      <Button variant="outline" onClick={() => { setValue([...list, def.newItem()]); setOpen(list.length); }}><Plus />Add {def.label.toLowerCase().replace(/s$/, "")}</Button>
    </div>
  </div>;
}
