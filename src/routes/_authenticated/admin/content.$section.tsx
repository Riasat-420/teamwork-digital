import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { contentSections } from "@/lib/admin-sections";
import { SectionEditor } from "@/components/admin/section-editor";
import { ProjectEditor } from "@/components/admin/project-editor";

export const Route = createFileRoute("/_authenticated/admin/content/$section")({
  loader: ({ params }) => { const def = contentSections.find(s => s.key === params.section); if (!def) throw notFound(); return { key: def.key }; },
  head: ({ loaderData }) => {
    const label = contentSections.find(s => s.key === loaderData?.key)?.label ?? "Content";
    const title = `${label} editor — Teamwork Digital`;
    const description = `Manage ${label.toLowerCase()} on Teamwork Digital.`;
    return { meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] };
  },
  component: EditSection,
  notFoundComponent: () => <p className="text-muted-foreground">That section doesn't exist. <Link to="/admin/content" className="text-primary">Back to content</Link></p>,
});

function EditSection() {
  const { key } = Route.useLoaderData();
  const def = contentSections.find(s => s.key === key);
  if (!def) return null;
  return <div><Link to="/admin/content" className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft size={14} />All sections</Link>{key === "projects" ? <ProjectEditor /> : <SectionEditor key={key} def={def} />}</div>;
}
