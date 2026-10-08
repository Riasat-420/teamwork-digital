import { createFileRoute } from "@tanstack/react-router";

// Serves dashboard-uploaded images from private storage. Only the site-media bucket's "uploads/" folder is exposed.
export const Route = createFileRoute("/media/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const path = params._splat ?? "";
        if (!path.startsWith("uploads/") || path.includes("..")) return new Response("Not found", { status: 404 });
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data, error } = await supabaseAdmin.storage.from("site-media").download(path);
        if (error || !data) return new Response("Not found", { status: 404 });
        return new Response(data, { headers: { "content-type": data.type || "application/octet-stream", "cache-control": "public, max-age=31536000, immutable" } });
      },
    },
  },
});
