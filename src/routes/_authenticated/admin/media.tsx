import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useRef, useState } from "react";
import { Copy, Eye, ImagePlus, Loader2, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { logActivity, uploadImage, useStaff } from "@/lib/admin-client";
import { builtInMedia, listMedia, mediaQueryKey, type MediaFile } from "@/components/admin/media-picker";
import { MediaEditor } from "@/components/admin/media-editor";
import { useSiteContent } from "@/lib/site-content.functions";

export const Route = createFileRoute("/_authenticated/admin/media")({ component: MediaPage });

function MediaPage() {
  const qc = useQueryClient();
  const { data: me } = useStaff();
  const { data, isLoading } = useQuery({ queryKey: mediaQueryKey, queryFn: listMedia });
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("newest");
  const [editing, setEditing] = useState<MediaFile | null>(null);
  const [deleting, setDeleting] = useState<MediaFile | null>(null);
  const site = useSiteContent();
  const usageFor = (url: string) => {
    const matches: string[] = [];
    for (const [section, value] of Object.entries(site)) if (JSON.stringify(value).includes(url)) matches.push(section === "seo" ? "SEO and social sharing" : section.replace(/([A-Z])/g, " $1").replace(/^./, c => c.toUpperCase()));
    return matches;
  };
  const uploads = useMemo(() => (data ?? []).filter(file => file.name.toLowerCase().includes(query.toLowerCase())).sort((a, b) => sort === "name" ? a.name.localeCompare(b.name) : sort === "largest" ? b.size - a.size : (b.created ?? "").localeCompare(a.created ?? "")), [data, query, sort]);
  const upload = async (files: FileList | null) => {
    if (!files?.length) return; setBusy(true);
    const outcomes = await Promise.allSettled(Array.from(files).map(uploadImage));
    const uploaded = outcomes.filter(result => result.status === "fulfilled").length;
    const failed = outcomes.length - uploaded;
    if (uploaded) toast.success(`${uploaded} image${uploaded === 1 ? "" : "s"} uploaded and optimized`);
    if (failed) toast.error(`${failed} image${failed === 1 ? "" : "s"} could not be uploaded. Check file type and the 10 MB limit.`);
    try { await Promise.resolve(); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Upload failed"); }
    finally { setBusy(false); void qc.invalidateQueries({ queryKey: mediaQueryKey }); }
  };
  const remove = async (name: string) => {
    const { error } = await supabase.storage.from("site-media").remove([`uploads/${name}`]);
    if (error) { toast.error(error.message); return; }
    await logActivity("deleted", "media", { name }); setDeleting(null); void qc.invalidateQueries({ queryKey: mediaQueryKey });
  };
  return <div className="space-y-6">
    <div className="flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-2xl font-semibold text-foreground">Media library</h1><p className="text-sm text-muted-foreground">Images are resized to fast-loading versions when uploaded (max 10 MB each).</p></div>
      <Button onClick={() => input.current?.click()} disabled={busy}>{busy ? <Loader2 className="animate-spin" /> : <ImagePlus />}Upload images</Button>
      <input ref={input} type="file" accept="image/*" multiple hidden onChange={e => { void upload(e.target.files); e.target.value = ""; }} /></div>
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><h2 className="font-semibold text-foreground">Your uploads</h2><div className="flex flex-col gap-2 sm:flex-row"><div className="relative"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search images" className="pl-9 sm:w-56" /></div><Select value={sort} onValueChange={setSort}><SelectTrigger className="w-full sm:w-36"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="newest">Newest</SelectItem><SelectItem value="name">Name</SelectItem><SelectItem value="largest">Largest</SelectItem></SelectContent></Select></div></div>
    {isLoading ? <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="animate-spin" />Loading images…</div> : !uploads.length ? <p className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">{query ? "No images match your search." : "No images yet. Upload one to get started."}</p> :
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">{uploads.map(f => <figure key={f.name} className="overflow-hidden rounded-xl border bg-card">
        <button type="button" className="block w-full" onClick={() => setEditing(f)}><img src={f.url} alt={f.name} loading="lazy" className="aspect-video w-full bg-muted object-contain" /></button>
        <figcaption className="flex items-center gap-1 p-2"><span className="min-w-0 flex-1 truncate text-xs text-muted-foreground" title={f.name}>{f.name} · {Math.round(f.size / 1024)} KB</span>
          <Button variant="ghost" size="icon-sm" aria-label="View or edit" onClick={() => setEditing(f)}><Eye /></Button>
          <Button variant="ghost" size="icon-sm" aria-label="Copy link" onClick={() => { void navigator.clipboard.writeText(window.location.origin + f.url); toast.success("Link copied"); }}><Copy /></Button>
          {me?.role === "admin" && <Button variant="ghost" size="icon-sm" aria-label="Delete" onClick={() => setDeleting(f)}><Trash2 /></Button>}
        </figcaption></figure>)}</div>}
    <div><h2 className="font-semibold text-foreground">Images on the website</h2><p className="text-sm text-muted-foreground">Images the site uses right now. Copy a link or pick them from any image field.</p></div>
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">{builtInMedia.map(f => <figure key={f.url} className="overflow-hidden rounded-xl border bg-card">
      <button type="button" className="block w-full" onClick={() => setEditing(f)}><img src={f.url} alt={f.name} loading="lazy" className="aspect-video w-full bg-muted object-contain" /></button>
      <figcaption className="flex items-center gap-1 p-2"><span className="min-w-0 flex-1 truncate text-xs text-muted-foreground" title={f.name}>{f.name}</span>
        <Button variant="ghost" size="icon-sm" aria-label="View or edit" onClick={() => setEditing(f)}><Eye /></Button>
        <Button variant="ghost" size="icon-sm" aria-label="Copy link" onClick={() => { void navigator.clipboard.writeText(f.url); toast.success("Link copied"); }}><Copy /></Button></figcaption></figure>)}</div>
    <MediaEditor file={editing} open={Boolean(editing)} onOpenChange={open => !open && setEditing(null)} usage={editing ? usageFor(editing.url) : []} onSaved={() => void qc.invalidateQueries({ queryKey: mediaQueryKey })} />
    <AlertDialog open={Boolean(deleting)} onOpenChange={open => !open && setDeleting(null)}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete {deleting?.name}?</AlertDialogTitle><AlertDialogDescription>{deleting && usageFor(deleting.url).length ? `This image is used in ${usageFor(deleting.url).join(", ")}. Replace it there before deleting to avoid a missing image.` : "This image is not referenced by saved website content. This action cannot be undone."}</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction disabled={!deleting || usageFor(deleting.url).length > 0} onClick={event => { event.preventDefault(); if (deleting) void remove(deleting.name); }}>Delete image</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
  </div>;
}
