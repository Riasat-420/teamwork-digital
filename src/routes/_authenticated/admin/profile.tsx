import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { KeyRound, Mail, Save } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageField } from "@/components/admin/fields";
import { logActivity, useStaff } from "@/lib/admin-client";

export const Route = createFileRoute("/_authenticated/admin/profile")({ component: ProfilePage });

const card = "min-w-0 max-w-2xl space-y-4 rounded-xl border bg-card p-4 sm:p-5";

function ProfilePage() {
  const qc = useQueryClient();
  const { data: me } = useStaff();
  const refresh = () => qc.invalidateQueries({ queryKey: ["staff-me"] });
  const [name, setName] = useState(""); const [avatar, setAvatar] = useState("");
  const [email, setEmail] = useState("");
  const [current, setCurrent] = useState(""); const [pw, setPw] = useState(""); const [pw2, setPw2] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  useEffect(() => { if (me?.user) { setName(me.user.name); setAvatar(me.user.avatar); setEmail(me.user.email); } }, [me?.user]);
  if (!me?.user) return null;

  const run = async (key: string, fn: () => Promise<void>) => {
    setBusy(key);
    try { await fn(); } catch (e) { toast.error(e instanceof Error ? e.message : "Something went wrong"); } finally { setBusy(null); }
  };
  const saveProfile = () => run("profile", async () => {
    const { error } = await supabase.auth.updateUser({ data: { full_name: name.trim().slice(0, 80), avatar_url: avatar } });
    if (error) throw error; await logActivity("updated", "profile"); await refresh(); toast.success("Profile saved");
  });
  const saveEmail = () => run("email", async () => {
    const next = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(next)) throw new Error("Please enter a valid email.");
    if (next === me.user!.email) throw new Error("That's already your email.");
    const { error } = await supabase.auth.updateUser({ email: next }, { emailRedirectTo: `${window.location.origin}/admin/profile` });
    if (error) throw error; await refresh(); toast.success("Check both inboxes — confirm the change from the links we sent.");
  });
  const savePassword = () => run("password", async () => {
    if (pw.length < 8) throw new Error("Use at least 8 characters.");
    if (pw !== pw2) throw new Error("The two new passwords don't match.");
    const check = await supabase.auth.signInWithPassword({ email: me.user!.email, password: current });
    if (check.error) throw new Error("Your current password is incorrect.");
    const { error } = await supabase.auth.updateUser({ password: pw });
    if (error) throw error; await logActivity("changed", "password"); setCurrent(""); setPw(""); setPw2(""); toast.success("Password changed");
  });

  return <div className="space-y-6">
    <div><h1 className="text-2xl font-semibold text-foreground">My profile</h1><p className="text-sm text-muted-foreground">Your name, photo, sign-in email and password.</p></div>
    <section className={card}><h2 className="font-semibold text-foreground">Profile</h2>
      <div className="space-y-1.5"><Label>Profile picture</Label><ImageField value={avatar} onChange={setAvatar} /></div>
      <div className="space-y-1.5"><Label htmlFor="p-name">Display name</Label><Input id="p-name" value={name} maxLength={80} onChange={e => setName(e.target.value)} /></div>
      <Button onClick={saveProfile} disabled={busy === "profile"}><Save />{busy === "profile" ? "Saving…" : "Save profile"}</Button>
    </section>
    <section className={card}><h2 className="font-semibold text-foreground">Email</h2>
      <p className="text-sm text-muted-foreground">You'll need to confirm the change from your email before it takes effect.</p>
      {me.user.newEmail && <p className="text-sm text-primary">Waiting for confirmation of {me.user.newEmail}</p>}
      <div className="space-y-1.5"><Label htmlFor="p-email">Sign-in email</Label><Input id="p-email" type="email" value={email} onChange={e => setEmail(e.target.value)} /></div>
      <Button variant="outline" onClick={saveEmail} disabled={busy === "email"}><Mail />Change email</Button>
    </section>
    <section className={card}><h2 className="font-semibold text-foreground">Password</h2>
      <div className="space-y-1.5"><Label htmlFor="p-cur">Current password</Label><Input id="p-cur" type="password" autoComplete="current-password" value={current} onChange={e => setCurrent(e.target.value)} /></div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5"><Label htmlFor="p-new">New password</Label><Input id="p-new" type="password" autoComplete="new-password" value={pw} onChange={e => setPw(e.target.value)} /></div>
        <div className="space-y-1.5"><Label htmlFor="p-new2">Repeat new password</Label><Input id="p-new2" type="password" autoComplete="new-password" value={pw2} onChange={e => setPw2(e.target.value)} /></div>
      </div>
      <Button variant="outline" onClick={savePassword} disabled={busy === "password" || !current || !pw}><KeyRound />Change password</Button>
    </section>
  </div>;
}
