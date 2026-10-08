import { createFileRoute } from "@tanstack/react-router";
import { fetchSiteContentRows } from "@/lib/site-content.server";
import { mergeContent } from "@/lib/site-content";

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = new URL(request.url).origin;
        const { seo } = mergeContent((await fetchSiteContentRows()).map(r => ({ key: r.key, value: JSON.parse(r.json) as unknown })));
        const body = seo.allowIndexing
          ? `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /login\nDisallow: /chat/\n\nSitemap: ${origin}/sitemap.xml\n`
          : `User-agent: *\nDisallow: /\n`;
        return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=600" } });
      },
    },
  },
});
