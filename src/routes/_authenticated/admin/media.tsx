import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { Copy, ImagePlus, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { logActivity, uploadImage, useStaff } from "@/lib/admin-client";
import { listMedia, mediaQueryKey } from "@/components/admin/media-picker";

export const Route = createFileRoute("/_authenticated/admin/media")({ component: MediaPage });

function MediaPage() {
  const qc = useQueryClient();
  const { data: me } = useStaff();
  const { data, isLoading } = useQuery({ queryKey: mediaQueryKey, queryFn: listMedia });
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const upload = async (files: FileList | null) => {
    if (!files?.length) return; setBusy(true);
    try { for (const f of Array.from(files)) await uploadImage(f); toast.success("Uploaded — images were resized automatically"); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Upload failed"); }
    finally { setBusy(false); void qc.invalidateQueries({ queryKey: mediaQueryKey }); }
  };
  const remove = async (name: string) => {
    if (!confirm("Delete this image? Anything using it will show a blank image.")) return;
    const { error } = await supabase.storage.from("site-media").remove([`uploads/${name}`]);
    if (error) { toast.error(error.message); return; }
    await logActivity("deleted", "media", { name }); void qc.invalidateQueries({ queryKey: mediaQueryKey });
  };
  return <div className="space-y-6">
    <div className="flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-2xl font-semibold text-foreground">Media library</h1><p className="text-sm text-muted-foreground">Images are resized to fast-loading versions when uploaded (max 10 MB each).</p></div>
      <Button onClick={() => input.current?.click()} disabled={busy}>{busy ? <Loader2 className="animate-spin" /> : <ImagePlus />}Upload images</Button>
      <input ref={input} type="file" accept="image/*" multiple hidden onChange={e => { void upload(e.target.files); e.target.value = ""; }} /></div>
    {isLoading ? <p className="text-muted-foreground">Loading…</p> : !data?.length ? <p className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">No images yet.</p> :
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">{data.map(f => <figure key={f.name} className="overflow-hidden rounded-xl border bg-card">
        <img src={f.url} alt={f.name} loading="lazy" className="aspect-video w-full object-cover" />
        <figcaption className="flex items-center gap-1 p-2"><span className="flex-1 truncate text-xs text-muted-foreground" title={f.name}>{f.name} · {Math.round(f.size / 1024)} KB</span>
          <Button variant="ghost" size="icon-sm" aria-label="Copy link" onClick={() => { void navigator.clipboard.writeText(window.location.origin + f.url); toast.success("Link copied"); }}><Copy /></Button>
          {me?.role === "admin" && <Button variant="ghost" size="icon-sm" aria-label="Delete" onClick={() => remove(f.name)}><Trash2 /></Button>}
        </figcaption></figure>)}</div>}
  </div>;
}
