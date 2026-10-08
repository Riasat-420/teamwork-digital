import { createFileRoute } from "@tanstack/react-router";
import { SectionEditor } from "@/components/admin/section-editor";
import { useSiteContent } from "@/lib/site-content.functions";
import type { SectionDef } from "@/lib/admin-sections";

export const Route = createFileRoute("/_authenticated/admin/seo")({ component: Seo });

const def: SectionDef = { key: "seo", label: "SEO & Google", description: "How the site appears in Google and when shared.", kind: "object", fields: [
  { key: "title", label: "Site title", type: "text", help: "Shown in Google results and browser tabs. Aim for under 60 characters." },
  { key: "description", label: "Site description", type: "textarea", help: "Aim for 120–160 characters." },
  { key: "keywords", label: "Keywords (optional)", type: "text" },
  { key: "ogImage", label: "Share image", type: "image", help: "Shown when the link is shared on WhatsApp, Facebook, LinkedIn. 1200×630 works best." },
  { key: "gscVerification", label: "Google Search Console verification code", type: "text", help: "In Search Console choose \"HTML tag\" and paste only the content value." },
  { key: "bingVerification", label: "Bing verification code", type: "text" },
  { key: "gaId", label: "Google Analytics ID (optional)", type: "text", help: "Looks like G-XXXXXXX. Leave empty to use only the built-in analytics." },
  { key: "allowIndexing", label: "Allow search engines to list the site", type: "switch" },
] };

function Seo() {
  const { seo } = useSiteContent();
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return <div className="grid gap-8 xl:grid-cols-[1fr_380px]">
    <SectionEditor def={def} />
    <aside className="space-y-4 xl:pt-24">
      <div className="rounded-xl border bg-card p-4"><p className="mb-2 text-xs font-medium uppercase text-muted-foreground">Google preview</p>
        <p className="truncate text-xs text-muted-foreground">{origin}</p><p className="truncate text-lg text-primary">{seo.title}</p><p className="line-clamp-2 text-sm text-muted-foreground">{seo.description}</p></div>
      <div className="overflow-hidden rounded-xl border bg-card"><p className="p-4 pb-2 text-xs font-medium uppercase text-muted-foreground">Share preview</p>
        {seo.ogImage ? <img src={seo.ogImage} alt="" className="aspect-[1200/630] w-full object-cover" /> : <div className="flex aspect-[1200/630] items-center justify-center bg-muted text-xs text-muted-foreground">No share image</div>}
        <div className="p-4"><p className="font-medium text-foreground">{seo.title}</p><p className="line-clamp-2 text-sm text-muted-foreground">{seo.description}</p></div></div>
      <div className="rounded-xl border bg-card p-4 text-sm"><p className="mb-2 font-medium text-foreground">Automatic files</p>
        <p className="text-muted-foreground">Submit the sitemap in Search Console:</p>
        <a className="break-all text-primary" href="/sitemap.xml" target="_blank" rel="noreferrer">{origin}/sitemap.xml</a>
        <p className="mt-2"><a className="text-primary" href="/robots.txt" target="_blank" rel="noreferrer">View robots.txt</a></p></div>
    </aside>
  </div>;
}
