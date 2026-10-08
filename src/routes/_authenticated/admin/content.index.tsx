import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { contentSections } from "@/lib/admin-sections";

export const Route = createFileRoute("/_authenticated/admin/content/")({ component: ContentIndex });

function ContentIndex() {
  return <div className="space-y-6">
    <div><h1 className="text-2xl font-semibold text-foreground">Website content</h1><p className="text-sm text-muted-foreground">Pick a section to edit. Changes go live as soon as you save.</p></div>
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{contentSections.map(s => <Link key={s.key} to="/admin/content/$section" params={{ section: s.key }} className="group flex items-center justify-between rounded-xl border bg-card p-4 hover:border-primary">
      <div><p className="font-medium text-foreground">{s.label}</p><p className="text-sm text-muted-foreground">{s.description}</p></div><ChevronRight size={18} className="text-muted-foreground group-hover:text-primary" />
    </Link>)}</div>
  </div>;
}
