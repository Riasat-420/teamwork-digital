import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, FileText, Inbox, Search, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useStaff } from "@/lib/admin-client";

export const Route = createFileRoute("/_authenticated/admin/")({ component: Overview });

async function countViews(days: number) {
  const since = new Date(Date.now() - days * 864e5); if (days === 1) since.setHours(0, 0, 0, 0);
  const { count } = await supabase.from("page_views").select("id", { count: "exact", head: true }).gte("created_at", since.toISOString());
  return count ?? 0;
}

function Overview() {
  const { data: me } = useStaff();
  const { data } = useQuery({ queryKey: ["admin-overview"], queryFn: async () => {
    const [today, week, month, unread, log] = await Promise.all([
      countViews(1), countViews(7), countViews(30),
      supabase.from("contact_messages").select("id", { count: "exact", head: true }).eq("is_read", false),
      supabase.from("activity_log").select("id, created_at, user_email, action, entity").order("created_at", { ascending: false }).limit(8),
    ]);
    return { today, week, month, unread: unread.count ?? 0, log: log.data ?? [] };
  } });
  const stats = [{ label: "Visits today", v: data?.today }, { label: "Last 7 days", v: data?.week }, { label: "Last 30 days", v: data?.month }, { label: "Unread messages", v: data?.unread }];
  const links = [
    { to: "/admin/content", label: "Edit website content", icon: FileText }, { to: "/admin/messages", label: "Read messages", icon: Inbox },
    { to: "/admin/analytics", label: "See full analytics", icon: BarChart3 }, { to: "/admin/seo", label: "Search & Google settings", icon: Search },
    ...(me?.role === "admin" ? [{ to: "/admin/settings", label: "Invite your team", icon: Users }] : []),
  ] as const;
  return <div className="space-y-8">
    <div><h1 className="text-2xl font-semibold text-foreground">Welcome back</h1><p className="text-sm text-muted-foreground">Here's how the website is doing.</p></div>
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{stats.map(s => <div key={s.label} className="rounded-xl border bg-card p-5"><p className="text-sm text-muted-foreground">{s.label}</p><p className="mt-1 text-3xl font-semibold text-foreground">{s.v ?? "—"}</p></div>)}</div>
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-xl border bg-card p-5"><h2 className="mb-3 font-semibold text-foreground">Quick links</h2><div className="grid gap-2">{links.map(l => <Link key={l.to} to={l.to} className="flex items-center gap-3 rounded-md border px-3 py-2.5 text-sm text-foreground hover:bg-muted"><l.icon size={17} className="text-primary" />{l.label}</Link>)}</div></section>
      <section className="rounded-xl border bg-card p-5"><h2 className="mb-3 font-semibold text-foreground">Recent changes</h2>
        {!data?.log.length ? <p className="text-sm text-muted-foreground">No changes yet.</p> : <ul className="space-y-2 text-sm">{data.log.map(l => <li key={l.id} className="flex justify-between gap-3"><span className="text-foreground"><span className="text-muted-foreground">{l.user_email ?? "Someone"}</span> {l.action} <b>{l.entity}</b></span><time className="shrink-0 text-xs text-muted-foreground">{new Date(l.created_at).toLocaleString()}</time></li>)}</ul>}
      </section>
    </div>
  </div>;
}
