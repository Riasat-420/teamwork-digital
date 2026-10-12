import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Eye, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MediaEditor } from "./media-editor";
import logoSrc from "@/assets/teamwork-digital-logo.jpeg";
const logo = { url: logoSrc };
import leaderPhotoSrc from "@/assets/team-leader.jpeg";
const leaderPhoto = { url: leaderPhotoSrc };
import { projects } from "@/lib/portfolio-data";
import { projectPreviews } from "@/lib/project-previews";

export type MediaFile = { name: string; url: string; size: number; created: string | null; builtIn?: boolean };

/** Images already used on the website (bundled with the site). They can be reused anywhere but not deleted. */
export const builtInMedia: MediaFile[] = [
  { name: "Company logo", url: logo.url, size: 0, created: null, builtIn: true },
  { name: "Team leader photo", url: leaderPhoto.url, size: 0, created: null, builtIn: true },
  ...projects.filter(p => projectPreviews[p.initials]).map(p => ({ name: `${p.title} screenshot`, url: projectPreviews[p.initials]!.large, size: 0, created: null, builtIn: true })),
];

export const mediaQueryKey = ["admin-media"];
export async function listMedia(): Promise<MediaFile[]> {
  const { data, error } = await supabase.storage.from("site-media").list("uploads", { limit: 500, sortBy: { column: "created_at", order: "desc" } });
  if (error) throw error;
  return (data ?? []).filter(f => f.name && !f.name.startsWith(".")).map(f => ({ name: f.name, url: `/media/uploads/${f.name}`, size: (f.metadata as { size?: number } | null)?.size ?? 0, created: f.created_at }));
}

function Grid({ files, onPick, onEdit }: { files: MediaFile[]; onPick: (url: string) => void; onEdit: (file: MediaFile) => void }) {
  return <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{files.map(f => <div key={f.url} className="overflow-hidden rounded-md border bg-card"><button type="button" title={`Select ${f.name}`} onClick={() => onPick(f.url)} className="block w-full text-left hover:bg-muted"><img src={f.url} alt={f.name} loading="lazy" className="aspect-video w-full bg-muted object-contain" /><span className="block truncate px-2 py-1 text-xs text-muted-foreground">{f.name}</span></button><Button type="button" variant="ghost" size="sm" className="m-1 mt-0 h-7 text-xs" onClick={() => onEdit(f)}><Eye />View / edit</Button></div>)}</div>;
}

export function MediaPicker({ open, onOpenChange, onPick }: { open: boolean; onOpenChange: (o: boolean) => void; onPick: (url: string) => void }) {
  const { data, isLoading } = useQuery({ queryKey: mediaQueryKey, queryFn: listMedia, enabled: open });
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<MediaFile | null>(null);
  const uploads = useMemo(() => (data ?? []).filter(file => file.name.toLowerCase().includes(query.toLowerCase())), [data, query]);
  const builtIns = useMemo(() => builtInMedia.filter(file => file.name.toLowerCase().includes(query.toLowerCase())), [query]);
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="max-w-3xl">
    <DialogHeader><DialogTitle>Media library</DialogTitle></DialogHeader>
    <div className="relative"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search images" className="pl-9" /></div>
    <div className="max-h-[65vh] space-y-5 overflow-y-auto">
      <section className="space-y-2"><h3 className="text-sm font-medium text-foreground">Your uploads</h3>
        {isLoading ? <p className="text-sm text-muted-foreground">Loading…</p> : !uploads.length ? <p className="text-sm text-muted-foreground">{query ? "No uploads match your search." : "No uploads yet. Use Upload to add one."}</p> : <Grid files={uploads} onPick={onPick} onEdit={setEditing} />}</section>
      <section className="space-y-2"><h3 className="text-sm font-medium text-foreground">Images on the website</h3>{builtIns.length ? <Grid files={builtIns} onPick={onPick} onEdit={setEditing} /> : <p className="text-sm text-muted-foreground">No built-in images match your search.</p>}</section>
    </div>
    <MediaEditor file={editing} open={Boolean(editing)} onOpenChange={value => !value && setEditing(null)} onSaved={url => { onPick(url); setEditing(null); onOpenChange(false); }} />
  </DialogContent></Dialog>;
}
