import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { SectionEditor } from "@/components/admin/section-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { logActivity } from "@/lib/admin-client";
import type { SectionDef } from "@/lib/admin-sections";

export const Route = createFileRoute("/_authenticated/admin/chatbot")({ component: ChatbotPage });

const def: SectionDef = { key: "chatbot", label: "Chatbot", description: "The floating assistant on your website.", kind: "object", fields: [
  { key: "enabled", label: "Show the chatbot on the website", type: "switch" },
  { key: "name", label: "Assistant name", type: "text" }, { key: "subtitle", label: "Subtitle", type: "text" },
  { key: "welcomeTitle", label: "Welcome title", type: "text" }, { key: "welcomeText", label: "Welcome text", type: "textarea" },
  { key: "suggestions", label: "Suggested questions", type: "tags" },
  { key: "extraInstructions", label: "Extra instructions", type: "textarea", help: "e.g. \"Always suggest booking a call for projects over 3 months.\"" },
] };

function Knowledge() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["admin-knowledge"], queryFn: async () => (await supabase.from("chatbot_knowledge").select("*").order("sort")).data ?? [] });
  const [title, setTitle] = useState(""); const [content, setContent] = useState("");
  const refresh = () => qc.invalidateQueries({ queryKey: ["admin-knowledge"] });
  const add = async () => {
    if (!title.trim() || !content.trim()) { toast.error("Add a title and the fact."); return; }
    const { error } = await supabase.from("chatbot_knowledge").insert({ kind: "fact", title: title.trim(), content: content.trim(), sort: (data?.length ?? 0) + 1 });
    if (error) { toast.error(error.message); return; }
    await logActivity("added", "chatbot fact", { title }); setTitle(""); setContent(""); void refresh();
  };
  return <section className="max-w-2xl space-y-4 rounded-xl border bg-card p-5">
    <div><h2 className="font-semibold text-foreground">Extra facts the assistant knows</h2><p className="text-sm text-muted-foreground">Prices, timelines, policies — anything not already on the website. The assistant only states what's written here or on the site.</p></div>
    {data?.map(k => <div key={k.id} className="flex items-start gap-3 rounded-md border p-3">
      <div className="flex-1"><p className="font-medium text-foreground">{k.title}</p><p className="whitespace-pre-wrap text-sm text-muted-foreground">{k.content}</p></div>
      <Switch aria-label="Use this fact" checked={k.enabled} onCheckedChange={async v => { await supabase.from("chatbot_knowledge").update({ enabled: v }).eq("id", k.id); void refresh(); }} />
      <Button variant="ghost" size="icon-sm" aria-label="Delete" onClick={async () => { await supabase.from("chatbot_knowledge").delete().eq("id", k.id); await logActivity("deleted", "chatbot fact"); void refresh(); }}><Trash2 /></Button>
    </div>)}
    <div className="space-y-2 border-t pt-4"><Input placeholder="Title, e.g. Typical website timeline" value={title} onChange={e => setTitle(e.target.value)} /><Textarea placeholder="The fact, e.g. Most business websites take 2–4 weeks." value={content} onChange={e => setContent(e.target.value)} />
      <Button variant="outline" onClick={add}><Plus />Add fact</Button></div>
  </section>;
}

function ChatbotPage() { return <div className="space-y-8"><SectionEditor def={def} /><Knowledge /></div>; }
