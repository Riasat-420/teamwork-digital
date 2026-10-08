import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const mediaQueryKey = ["admin-media"];
export async function listMedia() {
  const { data, error } = await supabase.storage.from("site-media").list("uploads", { limit: 500, sortBy: { column: "created_at", order: "desc" } });
  if (error) throw error;
  return (data ?? []).filter(f => f.name && !f.name.startsWith(".")).map(f => ({ name: f.name, url: `/media/uploads/${f.name}`, size: (f.metadata as { size?: number } | null)?.size ?? 0, created: f.created_at }));
}

export function MediaPicker({ open, onOpenChange, onPick }: { open: boolean; onOpenChange: (o: boolean) => void; onPick: (url: string) => void }) {
  const { data, isLoading } = useQuery({ queryKey: mediaQueryKey, queryFn: listMedia, enabled: open });
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="max-w-3xl">
    <DialogHeader><DialogTitle>Media library</DialogTitle></DialogHeader>
    {isLoading ? <p className="text-sm text-muted-foreground">Loading…</p> : !data?.length ? <p className="text-sm text-muted-foreground">No images yet. Use Upload to add one.</p> :
      <div className="grid max-h-[60vh] grid-cols-3 gap-3 overflow-y-auto sm:grid-cols-4">{data.map(f => <button key={f.name} type="button" onClick={() => onPick(f.url)} className="overflow-hidden rounded-md border hover:ring-2 hover:ring-primary"><img src={f.url} alt={f.name} loading="lazy" className="aspect-video w-full object-cover" /></button>)}</div>}
  </DialogContent></Dialog>;
}
