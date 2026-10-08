import { createFileRoute } from "@tanstack/react-router";
import { getSiteContentRows } from "@/lib/site-content.functions";
import { mergeContent, slugify, visible } from "@/lib/site-content";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = new URL(request.url).origin;
        const content = mergeContent((await getSiteContentRows()).map(r => ({ key: r.key, value: JSON.parse(r.json) as unknown })));
        const urls = [`${origin}/`];
        if (content.settings.projectPages) for (const p of visible(content.projects)) urls.push(`${origin}/work/${p.slug || slugify(p.title)}`);
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url><loc>${u}</loc></url>`).join("\n")}\n</urlset>`;
        return new Response(xml, { headers: { "content-type": "application/xml; charset=utf-8", "cache-control": "public, max-age=600" } });
      },
    },
  },
});
