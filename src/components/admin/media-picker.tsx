import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import logo from "@/assets/teamwork-digital-logo.jpeg.asset.json";
import leaderPhoto from "@/assets/team-leader.jpeg.asset.json";
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

function Grid({ files, onPick }: { files: MediaFile[]; onPick: (url: string) => void }) {
  return <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{files.map(f => <button key={f.url} type="button" title={f.name} onClick={() => onPick(f.url)} className="overflow-hidden rounded-md border text-left hover:ring-2 hover:ring-primary"><img src={f.url} alt={f.name} loading="lazy" className="aspect-video w-full object-cover" /><span className="block truncate px-2 py-1 text-xs text-muted-foreground">{f.name}</span></button>)}</div>;
}

export function MediaPicker({ open, onOpenChange, onPick }: { open: boolean; onOpenChange: (o: boolean) => void; onPick: (url: string) => void }) {
  const { data, isLoading } = useQuery({ queryKey: mediaQueryKey, queryFn: listMedia, enabled: open });
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="max-w-3xl">
    <DialogHeader><DialogTitle>Media library</DialogTitle></DialogHeader>
    <div className="max-h-[65vh] space-y-5 overflow-y-auto">
      <section className="space-y-2"><h3 className="text-sm font-medium text-foreground">Your uploads</h3>
        {isLoading ? <p className="text-sm text-muted-foreground">Loading…</p> : !data?.length ? <p className="text-sm text-muted-foreground">No uploads yet. Use Upload to add one.</p> : <Grid files={data} onPick={onPick} />}</section>
      <section className="space-y-2"><h3 className="text-sm font-medium text-foreground">Images on the website</h3><Grid files={builtInMedia} onPick={onPick} /></section>
    </div>
  </DialogContent></Dialog>;
}
