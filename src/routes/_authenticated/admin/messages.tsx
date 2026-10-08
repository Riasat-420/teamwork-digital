import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Download, Mail, MailOpen, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { downloadFile, logActivity } from "@/lib/admin-client";

export const Route = createFileRoute("/_authenticated/admin/messages")({ component: Messages });

const csv = (v: string | null) => `"${(v ?? "").replace(/"/g, '""')}"`;

function Messages() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["admin-messages"], queryFn: async () => {
    const { data, error } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false }).limit(500);
    if (error) throw error; return data;
  } });
  const refresh = () => qc.invalidateQueries({ queryKey: ["admin-messages"] });
  const toggle = async (id: string, is_read: boolean) => { await supabase.from("contact_messages").update({ is_read }).eq("id", id); void refresh(); };
  const remove = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (error) { toast.error("Only admins can delete messages."); return; }
    await logActivity("deleted", "message"); void refresh();
  };
  const exportCsv = () => downloadFile(`messages-${new Date().toISOString().slice(0, 10)}.csv`,
    ["Date,Name,Email,Phone,Message", ...(data ?? []).map(m => [m.created_at, m.name, m.email, m.phone, m.message].map(csv).join(","))].join("\n"), "text/csv");
  return <div className="space-y-6">
    <div className="flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-2xl font-semibold text-foreground">Messages</h1><p className="text-sm text-muted-foreground">Sent from the contact form on your website.</p></div>
      <Button variant="outline" onClick={exportCsv} disabled={!data?.length}><Download />Export to spreadsheet</Button></div>
    {isLoading ? <p className="text-muted-foreground">Loading…</p> : !data?.length ? <p className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">No messages yet.</p> :
      <div className="space-y-3">{data.map(m => <article key={m.id} className={`rounded-xl border bg-card p-4 ${m.is_read ? "" : "border-primary/50"}`}>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0"><p className="font-medium text-foreground">{m.name} {!m.is_read && <Badge className="ml-1">New</Badge>}</p>
            <p className="break-all text-sm text-muted-foreground"><a className="hover:text-primary" href={`mailto:${m.email}`}>{m.email}</a>{m.phone && <> · <a className="hover:text-primary" href={`tel:${m.phone}`}>{m.phone}</a></>} · {new Date(m.created_at).toLocaleString()}</p></div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon-sm" aria-label={m.is_read ? "Mark unread" : "Mark read"} onClick={() => toggle(m.id, !m.is_read)}>{m.is_read ? <Mail /> : <MailOpen />}</Button>
            <Button variant="ghost" size="icon-sm" aria-label="Delete" onClick={() => remove(m.id)}><Trash2 /></Button>
          </div>
        </div>
        <p className="mt-3 whitespace-pre-wrap break-words text-sm text-foreground">{m.message}</p>
      </article>)}</div>}
  </div>;
}
