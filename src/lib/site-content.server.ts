import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export async function fetchSiteContentRows(): Promise<{ key: string; json: string }[]> {
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
}
