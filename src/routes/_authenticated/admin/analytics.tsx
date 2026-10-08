import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { fetchAnalytics } from "@/lib/admin-analytics";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/_authenticated/admin/analytics")({ component: Analytics });

const eventNames: Record<string, string> = { chat_open: "Chatbot opened", contact_form: "Contact form sent", whatsapp_click: "WhatsApp clicks", email_click: "Email clicks", phone_click: "Phone clicks", outbound_click: "Project / outside links" };

function List({ title, rows, label = (s: string) => s }: { title: string; rows: { name: string; count: number }[]; label?: (s: string) => string }) {
  const max = Math.max(1, ...rows.map(r => r.count));
  return <section className="rounded-xl border bg-card p-5"><h2 className="mb-3 font-semibold text-foreground">{title}</h2>
    {!rows.length ? <p className="text-sm text-muted-foreground">No data yet.</p> : <ul className="space-y-2">{rows.map(r => <li key={r.name} className="relative overflow-hidden rounded-md px-3 py-1.5 text-sm">
      <span className="absolute inset-y-0 left-0 bg-primary/10" style={{ width: `${(r.count / max) * 100}%` }} />
      <span className="relative flex justify-between gap-3"><span className="truncate text-foreground">{label(r.name)}</span><b className="text-foreground">{r.count}</b></span></li>)}</ul>}
  </section>;
}

function Analytics() {
  const [days, setDays] = useState(30);
  const { data, isLoading } = useQuery({ queryKey: ["admin-analytics", days], queryFn: () => fetchAnalytics(days) });
  return <div className="space-y-6">
    <div className="flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-2xl font-semibold text-foreground">Analytics</h1><p className="text-sm text-muted-foreground">Privacy-friendly visitor stats — no cookie banner needed.</p></div>
      <Tabs value={String(days)} onValueChange={v => setDays(Number(v))}><TabsList><TabsTrigger value="7">7 days</TabsTrigger><TabsTrigger value="30">30 days</TabsTrigger><TabsTrigger value="90">90 days</TabsTrigger></TabsList></Tabs></div>
    {isLoading || !data ? <p className="text-muted-foreground">Loading…</p> : <>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{[["Page views", data.totalViews], ["Unique visitors", data.visitors], ["Chatbot opens", data.events.find(e => e.name === "chat_open")?.count ?? 0], ["Contact clicks & forms", data.events.filter(e => e.name !== "chat_open" && e.name !== "outbound_click").reduce((a, e) => a + e.count, 0)]].map(([l, v]) =>
        <div key={l} className="rounded-xl border bg-card p-5"><p className="text-sm text-muted-foreground">{l}</p><p className="mt-1 text-3xl font-semibold text-foreground">{v}</p></div>)}</div>
      <section className="rounded-xl border bg-card p-5"><h2 className="mb-4 font-semibold text-foreground">Visits per day</h2>
        <div className="h-64"><ResponsiveContainer><AreaChart data={data.daily}><CartesianGrid strokeDasharray="3 3" stroke="var(--border)" /><XAxis dataKey="date" fontSize={12} stroke="var(--muted-foreground)" /><YAxis allowDecimals={false} fontSize={12} stroke="var(--muted-foreground)" width={32} /><Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
          <Area type="monotone" dataKey="views" name="Page views" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.15} /><Area type="monotone" dataKey="visitors" name="Visitors" stroke="var(--brand-warm, var(--primary))" fill="transparent" /></AreaChart></ResponsiveContainer></div></section>
      <div className="grid gap-6 lg:grid-cols-2">
        <List title="Top pages" rows={data.pages} /><List title="Where visitors came from" rows={data.referrers} />
        <List title="Countries" rows={data.countries} /><List title="Devices" rows={data.devices} />
        <List title="Actions" rows={data.events} label={n => eventNames[n] ?? n} /><List title="Most clicked" rows={data.eventLabels} />
      </div>
    </>}
  </div>;
}
