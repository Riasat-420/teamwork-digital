import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectImage } from "@/components/project-image";
import { siteContentQuery } from "@/lib/site-content.functions";
import { slugify, visible } from "@/lib/site-content";

export const Route = createFileRoute("/work/$slug")({
  loader: async ({ context, params }) => {
    const site = await context.queryClient.ensureQueryData(siteContentQuery);
    if (!site.settings.projectPages) throw notFound();
    const project = visible(site.projects).find(item => (item.slug || slugify(item.title)) === params.slug);
    if (!project) throw notFound();
    return project;
  },
  head: ({ loaderData }) => {
    const title = `${loaderData?.title ?? "Project"} — Teamwork Digital`;
    const description = loaderData?.description || `${loaderData?.title ?? "Selected work"}, a ${loaderData?.type ?? "digital"} project by Teamwork Digital.`;
    return { meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] };
  },
  component: ProjectPage,
});

function ProjectPage() {
  const project = Route.useLoaderData();
  return <main className="work-page min-h-screen bg-background px-4 py-8 text-foreground sm:px-8 sm:py-12"><div className="mx-auto max-w-5xl">
    <Button asChild variant="ghost" className="mb-6"><Link to="/" hash="projects"><ArrowLeft />Back to projects</Link></Button>
    <div className="overflow-hidden rounded-2xl border bg-card shadow-sm"><div className="aspect-[16/10] overflow-hidden bg-muted [&>img]:h-full [&>img]:w-full [&>img]:object-cover"><ProjectImage project={project} /></div><div className="grid gap-6 p-6 sm:p-10 md:grid-cols-[1fr_auto] md:items-end"><div><p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">{project.category} · {project.type}</p><h1 className="text-4xl font-bold tracking-tight sm:text-6xl">{project.title}</h1><p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">{project.description || "A selected Teamwork Digital project. Explore the live experience to see the finished work."}</p></div>{project.url && <Button asChild size="lg"><a href={project.url} target="_blank" rel="noopener noreferrer">View live project <ArrowUpRight /></a></Button>}</div></div>
  </div></main>;
}