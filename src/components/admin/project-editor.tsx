import { useState } from "react";
import { ArrowDown, ArrowUp, Copy, Eye, EyeOff, ImagePlus, Pencil, Plus, Save, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ImageField } from "./fields";
import { useSiteContent } from "@/lib/site-content.functions";
import { useSaveSection } from "@/lib/admin-client";
import { newProjectCategory, projectCategoryOptions } from "@/lib/admin-sections";
import { slugify, type Project } from "@/lib/site-content";
import { projectPreviews } from "@/lib/project-previews";
import { cleanSavedImage } from "@/lib/media-utils";
import { ProjectImage } from "@/components/project-image";

export function ProjectEditor() {
  const site = useSiteContent();
  const saveSection = useSaveSection();
  const projects = site.projects;
  const categories = projectCategoryOptions(site.projectCategories, projects);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState<Project | null>(null);
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [deleting, setDeleting] = useState<Project | null>(null);
  const active = filter === "All" || categories.includes(filter) ? filter : "All";
  const shown = projects.filter(p => (active === "All" || p.category === active) && p.title.toLowerCase().includes(search.toLowerCase().trim()));
  const persist = async (next: Project[], message: string) => {
    setBusy(true);
    try { await saveSection("projects", next); toast.success(message); return true; }
    catch (e) { toast.error(e instanceof Error ? e.message : "Couldn't save projects"); return false; }
    finally { setBusy(false); }
  };
  const add = () => {
    setEditing(false);
    setDraft({ id: crypto.randomUUID(), published: true, title: "", category: newProjectCategory(active, categories), type: "Website", url: "", initials: "", image: "", description: "", slug: "" });
  };
  const patch = (next: Partial<Project>) => setDraft(p => p ? { ...p, ...next } : p);
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft || !draft.title.trim() || !categories.includes(draft.category)) return;
    const next = { ...draft, image: cleanSavedImage(draft.image), title: draft.title.trim(), slug: draft.slug || slugify(draft.title), initials: draft.initials || draft.title.split(/\s+/).map(w => w[0]).join("").slice(0, 3).toUpperCase() };
    const rows = editing ? projects.map(p => p.id === next.id ? next : p) : [...projects, next];
    if (await persist(rows, editing ? "Project updated" : "Project added")) {
      if (active !== "All") setFilter(next.category);
      setSearch("");
      setDraft(null);
    }
  };
  const move = async (project: Project, dir: -1 | 1) => {
    const neighbor = shown[shown.findIndex(p => p.id === project.id) + dir];
    if (!neighbor) return;
    const next = projects.map(p => p.id === project.id ? neighbor : p.id === neighbor.id ? project : p);
    await persist(next, "Project order saved");
  };
  return <div className="space-y-6">
    <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-5">
      <div><h1 className="text-xl font-semibold text-foreground">Projects</h1><p className="mt-1 text-sm text-muted-foreground">{projects.length} projects</p></div>
      <Button onClick={add} disabled={busy}><Plus />Add new project</Button>
    </div>
    <div className="flex flex-col gap-4">
      <div className="relative max-w-sm"><Search className="absolute left-3 top-3 text-muted-foreground" size={16} /><Input aria-label="Search projects" placeholder="Search projects…" value={search} onChange={e => setSearch(e.target.value)} className="pl-9" /></div>
      <div className="flex flex-wrap gap-2" aria-label="Project categories">
        {["All", ...categories].map(category => <Button key={category} variant={active === category ? "default" : "outline"} size="sm" aria-pressed={active === category} disabled={busy} onClick={() => setFilter(category)} className="h-auto min-h-8 whitespace-normal text-left">
          {category}<span className="ml-1 text-xs opacity-70">{category === "All" ? projects.length : projects.filter(p => p.category === category).length}</span>
        </Button>)}
      </div>
    </div>
    <div className="space-y-3">
      {shown.map((project, index) => {
        return <div key={project.id} className="flex flex-wrap items-center gap-3 rounded-lg border bg-card p-3 sm:flex-nowrap">
          <div className="flex h-16 w-24 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted"><ProjectImage project={project} compact /></div>
          <div className="min-w-0 flex-1"><h2 className="break-words font-semibold text-foreground">{project.title}</h2><div className="mt-1 flex flex-wrap gap-1.5"><Badge variant="outline">{project.category || "Uncategorized"}</Badge>{project.published === false && <Badge variant="secondary">Hidden</Badge>}</div></div>
          <div className="flex w-full flex-wrap items-center justify-end gap-1 sm:w-auto sm:shrink-0">
            <Button variant="outline" size="sm" disabled={busy} onClick={() => { setEditing(true); setDraft({ ...project }); }}><Pencil />Edit</Button>
            <Button variant="ghost" size="icon-sm" title="Move up" aria-label={`Move ${project.title} up`} disabled={busy || index === 0 || Boolean(search)} onClick={() => void move(project, -1)}><ArrowUp /></Button>
            <Button variant="ghost" size="icon-sm" title="Move down" aria-label={`Move ${project.title} down`} disabled={busy || index === shown.length - 1 || Boolean(search)} onClick={() => void move(project, 1)}><ArrowDown /></Button>
            <Button variant="ghost" size="icon-sm" title={project.published === false ? "Show on website" : "Hide from website"} aria-label={`${project.published === false ? "Show" : "Hide"} ${project.title}`} disabled={busy} onClick={() => void persist(projects.map(p => p.id === project.id ? { ...p, published: p.published === false } : p), "Visibility saved")}>{project.published === false ? <EyeOff /> : <Eye />}</Button>
            <Button variant="ghost" size="icon-sm" title="Duplicate project" aria-label={`Duplicate ${project.title}`} disabled={busy} onClick={() => { setEditing(false); setDraft({ ...project, id: crypto.randomUUID(), title: `${project.title} (copy)`, slug: "" }); }}><Copy /></Button>
            <Button variant="ghost" size="icon-sm" title="Delete project" aria-label={`Delete ${project.title}`} disabled={busy} onClick={() => setDeleting(project)}><Trash2 /></Button>
          </div>
        </div>;
      })}
      {!shown.length && <div className="py-12 text-center"><ImagePlus className="mx-auto mb-3 text-muted-foreground" /><h2 className="font-semibold text-foreground">{search ? "No matching projects" : `No projects${active === "All" ? " yet" : ` in ${active}`}`}</h2><Button variant="outline" className="mt-4" onClick={search ? () => setSearch("") : add} disabled={busy}>{search ? "Clear search" : <><Plus />Add project</>}</Button></div>}
    </div>
    <Dialog open={draft !== null} onOpenChange={open => { if (!open && !busy) setDraft(null); }}>
      <DialogContent className="max-h-[85dvh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader><DialogTitle>{editing ? "Edit project" : "Add new project"}</DialogTitle><DialogDescription>{editing ? draft?.title : "Project details"}</DialogDescription></DialogHeader>
        {draft && <form onSubmit={submit} className="space-y-5">
          <fieldset disabled={busy} className="space-y-5">
            <div className="space-y-2"><Label htmlFor="project-title">Project name *</Label><Input id="project-title" required value={draft.title} onChange={e => patch({ title: e.target.value })} placeholder="Project name" /></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label htmlFor="project-category">Category *</Label><Select value={draft.category} onValueChange={category => patch({ category })} disabled={busy}><SelectTrigger id="project-category" className="w-full"><SelectValue placeholder="Choose a category" /></SelectTrigger><SelectContent>{categories.map(category => <SelectItem key={category} value={category}>{category}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-2"><Label htmlFor="project-type">Type label</Label><Input id="project-type" value={draft.type} onChange={e => patch({ type: e.target.value })} /></div>
            </div>
            <div className="space-y-2"><Label htmlFor="project-url">Live link</Label><Input id="project-url" type="url" value={draft.url} placeholder="https://" onChange={e => patch({ url: e.target.value })} /></div>
            <div className="space-y-2"><Label>Screenshot</Label><ImageField value={draft.image || ""} fallback={projectPreviews[draft.initials]?.large || ""} onChange={image => patch({ image })} help="Recommended: 1600 × 1000px (16:10). Upload a real screenshot when no built-in preview exists." /></div>
            <div className="space-y-2"><Label htmlFor="project-description">Short description</Label><Textarea id="project-description" value={draft.description ?? ""} onChange={e => patch({ description: e.target.value })} rows={3} /></div>
            <details className="border-t pt-3"><summary className="cursor-pointer text-sm text-muted-foreground">More options</summary><div className="mt-4 grid gap-4 sm:grid-cols-2"><div className="space-y-2"><Label htmlFor="project-initials">Initials</Label><Input id="project-initials" value={draft.initials} onChange={e => patch({ initials: e.target.value })} /></div><div className="space-y-2"><Label htmlFor="project-slug">Page address</Label><Input id="project-slug" value={draft.slug ?? ""} onChange={e => patch({ slug: e.target.value })} /></div></div></details>
          </fieldset>
          <DialogFooter><Button type="button" variant="outline" disabled={busy} onClick={() => setDraft(null)}>Cancel</Button><Button type="submit" disabled={busy || !draft.title.trim() || !categories.includes(draft.category)}><Save />{busy ? "Saving…" : editing ? "Save project" : "Add project"}</Button></DialogFooter>
        </form>}
      </DialogContent>
    </Dialog>
    <AlertDialog open={deleting !== null} onOpenChange={open => { if (!open && !busy) setDeleting(null); }}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete {deleting?.title}?</AlertDialogTitle><AlertDialogDescription>This removes the project from the website.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel disabled={busy}>Cancel</AlertDialogCancel><AlertDialogAction disabled={busy} onClick={async e => { e.preventDefault(); if (deleting && await persist(projects.filter(p => p.id !== deleting.id), "Project deleted")) setDeleting(null); }}>{busy ? "Deleting…" : "Delete project"}</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
  </div>;
}