import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const str = (max: number) => z.string().max(max).optional().nullable();
const schema = z.object({
  type: z.enum(["view", "event"]),
  path: z.string().min(1).max(300),
  referrer: str(500),
  name: str(60),
  label: str(200),
  visitorId: str(64),
});

const device = (ua: string) => /ipad|tablet/i.test(ua) ? "tablet" : /mobi|android|iphone/i.test(ua) ? "mobile" : "desktop";
const isBot = (ua: string) => /bot|crawl|spider|slurp|preview|headless/i.test(ua);

// Public by design: records anonymous visits only. No IPs or personal data are stored.
export const Route = createFileRoute("/api/public/track")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const ua = request.headers.get("user-agent") ?? "";
        if (isBot(ua)) return new Response(null, { status: 204 });
        const text = await request.text();
        if (text.length > 2000) return new Response(null, { status: 413 });
        let body: z.infer<typeof schema>;
        try { body = schema.parse(JSON.parse(text)); } catch { return new Response(null, { status: 400 }); }
        if (/^\/(admin|login|reset-password|api)/.test(body.path)) return new Response(null, { status: 204 });
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        let referrer: string | null = null;
        try { if (body.referrer) { const u = new URL(body.referrer); if (u.host !== new URL(request.url).host) referrer = u.hostname; } } catch { referrer = null; }
        if (body.type === "view") {
          await supabaseAdmin.from("page_views").insert({ path: body.path, referrer, device: device(ua), country: request.headers.get("cf-ipcountry"), visitor_id: body.visitorId ?? null });
        } else if (body.name) {
          await supabaseAdmin.from("site_events").insert({ name: body.name, label: body.label ?? null, path: body.path, visitor_id: body.visitorId ?? null });
        }
        return new Response(null, { status: 204 });
      },
    },
  },
});
