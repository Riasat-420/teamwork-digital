import { createServerFn } from "@tanstack/react-start";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { mergeContent } from "./site-content";

export const getSiteContentRows = createServerFn({ method: "GET" }).handler(async () => {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) return [];
  const client = createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: { fetch: (input, init) => {
      const h = new Headers(init?.headers);
      if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
      h.set("apikey", key);
      return fetch(input, { ...init, headers: h });
    } },
  });
  const { data, error } = await client.from("site_content").select("key, value");
  if (error) { console.error("site_content read failed", error.message); return []; }
  return (data ?? []).map(r => ({ key: r.key, json: JSON.stringify(r.value) }));
});

export const siteContentQuery = queryOptions({
  queryKey: ["site-content"],
  queryFn: async () => mergeContent((await getSiteContentRows()).map(r => ({ key: r.key, value: JSON.parse(r.json) as unknown }))),
  staleTime: 30_000,
});

export const useSiteContent = () => useSuspenseQuery(siteContentQuery).data;
