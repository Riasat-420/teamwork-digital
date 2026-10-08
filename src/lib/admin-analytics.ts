import { supabase } from "@/integrations/supabase/client";

export type ViewRow = { created_at: string; path: string; referrer: string | null; country: string | null; device: string | null; visitor_id: string | null };
export type EventRow = { created_at: string; name: string; label: string | null };

export async function fetchAnalytics(days: number) {
  const since = new Date(Date.now() - days * 864e5).toISOString();
  const [views, events] = await Promise.all([
    supabase.from("page_views").select("created_at, path, referrer, country, device, visitor_id").gte("created_at", since).order("created_at", { ascending: false }).limit(20000),
    supabase.from("site_events").select("created_at, name, label").gte("created_at", since).order("created_at", { ascending: false }).limit(20000),
  ]);
  if (views.error) throw views.error;
  return summarize((views.data ?? []) as ViewRow[], (events.data ?? []) as EventRow[], days);
}

const top = (list: (string | null)[], n = 8) => {
  const m = new Map<string, number>();
  for (const k of list) { const key = k || "Direct / unknown"; m.set(key, (m.get(key) ?? 0) + 1); }
  return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, n).map(([name, count]) => ({ name, count }));
};

/** Pure aggregation, exported for tests. */
export function summarize(views: ViewRow[], events: EventRow[], days: number, now = Date.now()) {
  const byDay = new Map<string, { views: number; visitors: Set<string> }>();
  for (let i = days - 1; i >= 0; i--) byDay.set(new Date(now - i * 864e5).toISOString().slice(0, 10), { views: 0, visitors: new Set() });
  for (const v of views) {
    const d = byDay.get(v.created_at.slice(0, 10));
    if (d) { d.views++; if (v.visitor_id) d.visitors.add(v.visitor_id); }
  }
  return {
    totalViews: views.length,
    visitors: new Set(views.map(v => v.visitor_id).filter(Boolean)).size,
    daily: [...byDay.entries()].map(([date, d]) => ({ date: date.slice(5), views: d.views, visitors: d.visitors.size })),
    pages: top(views.map(v => v.path)),
    referrers: top(views.map(v => v.referrer)),
    countries: top(views.map(v => v.country)),
    devices: top(views.map(v => v.device), 4),
    events: top(events.map(e => e.name), 10),
    eventLabels: top(events.map(e => (e.label ? `${e.name}: ${e.label}` : e.name)), 10),
  };
}
