import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Download, Send } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { SectionEditor } from "@/components/admin/section-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { downloadFile, useStaff } from "@/lib/admin-client";
import { inviteTeamUser, listTeamUsers, setTeamUserRole } from "@/lib/admin.functions";
import type { SectionDef } from "@/lib/admin-sections";

export const Route = createFileRoute("/_authenticated/admin/settings")({ component: SettingsPage });

const def: SectionDef = { key: "settings", label: "Site settings", description: "General options for the website.", kind: "object", fields: [
  { key: "siteName", label: "Site name", type: "text" }, { key: "logo", label: "Logo (optional replacement)", type: "image" },
  { key: "projectPages", label: "Give each project its own page", type: "switch", help: "Adds pages like /work/project-name and lists them in the sitemap." },
  { key: "notifyEmail", label: "Email for new-message alerts", type: "text", help: "Saved for future use. Email alerts are not connected yet, so no messages are currently sent to this address." },
] };

function Users() {
  const qc = useQueryClient();
  const list = useServerFn(listTeamUsers), invite = useServerFn(inviteTeamUser), setRole = useServerFn(setTeamUserRole);
  const { data: me } = useStaff();
  const { data } = useQuery({ queryKey: ["admin-users"], queryFn: () => list() });
  const [email, setEmail] = useState(""); const [role, setR] = useState<"admin" | "editor">("editor"); const [busy, setBusy] = useState(false);
  const send = async () => {
    setBusy(true);
    try { await invite({ data: { email, role, redirectTo: `${window.location.origin}/reset-password` } }); toast.success(`Invite sent to ${email}`); setEmail(""); void qc.invalidateQueries({ queryKey: ["admin-users"] }); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Invite failed"); } finally { setBusy(false); }
  };
  return <section className="max-w-3xl space-y-4 rounded-xl border bg-card p-5">
    <div><h2 className="font-semibold text-foreground">Team accounts</h2><p className="text-sm text-muted-foreground">Admins can do everything. Editors can change content, media, messages and the chatbot, but not settings or accounts.</p></div>
    <div className="divide-y">{data?.map(u => <div key={u.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
      <div className="min-w-0"><p className="break-all text-sm font-medium text-foreground">{u.email}</p><p className="text-xs text-muted-foreground">{u.confirmed ? `Last sign-in ${u.lastSignIn ? new Date(u.lastSignIn).toLocaleDateString() : "never"}` : "Invite pending"}</p></div>
      <Select value={u.role} disabled={u.id === me?.user?.id} onValueChange={async v => { try { await setRole({ data: { userId: u.id, role: v as "admin" } }); toast.success("Role updated"); void qc.invalidateQueries({ queryKey: ["admin-users"] }); } catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); } }}>
        <SelectTrigger className="w-36"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="admin">Admin</SelectItem><SelectItem value="editor">Editor</SelectItem><SelectItem value="none">No access</SelectItem></SelectContent></Select>
    </div>)}</div>
    <div className="flex flex-wrap gap-2 border-t pt-4"><Input className="min-w-0 flex-1 basis-full sm:basis-auto" type="email" placeholder="teammate@email.com" value={email} onChange={e => setEmail(e.target.value)} />
      <Select value={role} onValueChange={v => setR(v as "editor")}><SelectTrigger className="w-32"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="editor">Editor</SelectItem><SelectItem value="admin">Admin</SelectItem></SelectContent></Select>
      <Button onClick={send} disabled={busy || !email}><Send />Send invite</Button></div>
  </section>;
}

function ActivityAndBackup() {
  const { data } = useQuery({ queryKey: ["admin-activity"], queryFn: async () => (await supabase.from("activity_log").select("*").order("created_at", { ascending: false }).limit(100)).data ?? [] });
  const backup = async () => {
    const [content, knowledge] = await Promise.all([supabase.from("site_content").select("*"), supabase.from("chatbot_knowledge").select("*")]);
    downloadFile(`teamwork-digital-backup-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify({ exportedAt: new Date().toISOString(), site_content: content.data, chatbot_knowledge: knowledge.data }, null, 2));
  };
  return <section className="max-w-3xl space-y-4 rounded-xl border bg-card p-5">
    <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="font-semibold text-foreground">Activity log</h2><Button variant="outline" size="sm" onClick={backup}><Download />Download backup</Button></div>
    {!data?.length ? <p className="text-sm text-muted-foreground">No activity yet.</p> : <ul className="max-h-96 space-y-2 overflow-y-auto text-sm">{data.map(l => <li key={l.id} className="flex flex-col gap-0.5 sm:flex-row sm:justify-between sm:gap-3"><span className="min-w-0 break-words text-foreground"><span className="text-muted-foreground">{l.user_email}</span> {l.action} <b>{l.entity}</b></span><time className="shrink-0 text-xs text-muted-foreground">{new Date(l.created_at).toLocaleString()}</time></li>)}</ul>}
  </section>;
}

function SettingsPage() {
  const { data: me } = useStaff();
  if (me?.role !== "admin") return <p className="text-muted-foreground">Only admins can open settings.</p>;
  return <div className="space-y-8"><SectionEditor def={def} /><Users /><ActivityAndBackup /></div>;
}
