import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { contentSections } from "@/lib/admin-sections";
import { SectionEditor } from "@/components/admin/section-editor";

export const Route = createFileRoute("/_authenticated/admin/content/$section")({
  loader: ({ params }) => { const def = contentSections.find(s => s.key === params.section); if (!def) throw notFound(); return { key: def.key }; },
  component: EditSection,
  notFoundComponent: () => <p className="text-muted-foreground">That section doesn't exist. <Link to="/admin/content" className="text-primary">Back to content</Link></p>,
});

function EditSection() {
  const { key } = Route.useLoaderData();
  const def = contentSections.find(s => s.key === key)!;
  return <div><Link to="/admin/content" className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft size={14} />All sections</Link><SectionEditor key={key} def={def} /></div>;
}
