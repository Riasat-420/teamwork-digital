import { publicServerClient } from "./public-client.server";

export async function fetchSiteContentRows(): Promise<{ key: string; json: string }[]> {
  const client = publicServerClient();
  if (!client) return [];
  const { data, error } = await client.from("site_content").select("key, value");
  if (error) { console.error("site_content read failed", error.message); return []; }
  return (data ?? []).map(r => ({ key: r.key, json: JSON.stringify(r.value) }));
}
