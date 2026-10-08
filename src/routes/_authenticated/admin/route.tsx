import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { BarChart3, Bot, ExternalLink, FileText, Image, Inbox, LayoutDashboard, LogOut, Menu, Search, Settings, UserRound } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useStaff } from "@/lib/admin-client";
import logo from "@/assets/teamwork-digital-logo.jpeg.asset.json";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [
    { title: "Dashboard — Teamwork Digital" },
    { name: "description", content: "Manage the Teamwork Digital website content, messages, analytics and SEO." },
    { property: "og:title", content: "Dashboard — Teamwork Digital" },
    { property: "og:description", content: "Private website dashboard." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex" },
  ] }),
  component: AdminLayout,
});

const nav = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/admin/content", label: "Content", icon: FileText },
  { to: "/admin/media", label: "Media", icon: Image },
  { to: "/admin/messages", label: "Messages", icon: Inbox },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/admin/seo", label: "SEO", icon: Search },
  { to: "/admin/chatbot", label: "Chatbot", icon: Bot },
  { to: "/admin/settings", label: "Settings", icon: Settings, adminOnly: true },
  { to: "/admin/profile", label: "My profile", icon: UserRound },
] as const;

function AdminLayout() {
  const { data, isLoading } = useStaff();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [menu, setMenu] = useState(false);
  const signOut = async () => {
    await qc.cancelQueries(); qc.clear();
    await supabase.auth.signOut();
    await navigate({ to: "/login", replace: true });
  };
  if (isLoading) return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Loading dashboard…</div>;
  if (!data?.role) return <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
    <h1 className="text-xl font-semibold text-foreground">No dashboard access yet</h1>
    <p className="max-w-sm text-sm text-muted-foreground">You're signed in as {data?.user?.email}, but an admin hasn't given this account a role.</p>
    <Button variant="outline" onClick={signOut}><LogOut />Sign out</Button>
  </div>;

  return <div className="min-h-screen bg-muted/30 md:flex">
    <aside className={`${menu ? "flex" : "hidden"} fixed inset-y-0 left-0 z-30 w-60 shrink-0 flex-col border-r bg-card md:sticky md:top-0 md:flex md:h-screen`}>
      <div className="flex items-center gap-2.5 border-b px-5 py-4"><img src={data.user?.avatar || logo.url} alt="" className="h-9 w-9 rounded-full object-cover" /><div className="min-w-0"><p className="truncate text-sm font-semibold text-foreground">{data.user?.name || "Teamwork Digital"}</p><p className="text-xs capitalize text-muted-foreground">{data.role}</p></div></div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
        {nav.filter(n => !("adminOnly" in n) || data.role === "admin").map(n => <Link key={n.to} to={n.to} onClick={() => setMenu(false)} activeOptions={{ exact: "exact" in n }}
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground data-[status=active]:bg-primary/10 data-[status=active]:font-medium data-[status=active]:text-primary"><n.icon size={17} />{n.label}</Link>)}
      </nav>
      <div className="space-y-1 border-t p-3">
        <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"><ExternalLink size={17} />View website</a>
        <button type="button" onClick={signOut} className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"><LogOut size={17} />Sign out</button>
        <p className="truncate px-3 pt-1 text-xs text-muted-foreground">{data.user?.email}</p>
      </div>
    </aside>
    {menu && <button type="button" aria-label="Close menu" className="fixed inset-0 z-20 bg-foreground/30 md:hidden" onClick={() => setMenu(false)} />}
    <div className="flex-1 min-w-0">
      <header className="flex items-center gap-3 border-b bg-card px-4 py-3 md:hidden"><Button variant="ghost" size="icon-sm" aria-label="Open menu" onClick={() => setMenu(true)}><Menu /></Button><span className="font-semibold text-foreground">Dashboard</span></header>
      <main className="min-w-0 px-4 py-6 md:px-8"><Outlet /></main>
    </div>
  </div>;
}
