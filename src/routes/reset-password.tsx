import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [
    { title: "Set a new password — Teamwork Digital" },
    { name: "description", content: "Choose a new password for your Teamwork Digital dashboard account." },
    { property: "og:title", content: "Set a new password — Teamwork Digital" },
    { property: "og:description", content: "Reset your dashboard password." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex" },
  ] }),
  component: ResetPassword,
});

function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) { setError("Use at least 8 characters."); return; }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) setError(error.message); else await navigate({ to: "/admin", replace: true });
  };
  return <main className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
    <form onSubmit={submit} className="w-full max-w-sm space-y-5 rounded-2xl border bg-card p-8 shadow-sm">
      <h1 className="text-xl font-semibold text-foreground">Set a new password</h1>
      <div className="space-y-2"><Label htmlFor="pw">New password</Label><Input id="pw" type="password" autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} /></div>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <Button type="submit" className="w-full" disabled={busy}>{busy ? "Saving…" : "Save password"}</Button>
    </form>
  </main>;
}
