import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logo from "@/assets/teamwork-digital-logo.jpeg.asset.json";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [
    { title: "Sign in — Teamwork Digital Dashboard" },
    { name: "description", content: "Sign in to manage the Teamwork Digital website." },
    { property: "og:title", content: "Sign in — Teamwork Digital Dashboard" },
    { property: "og:description", content: "Private dashboard for the Teamwork Digital team." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex" },
  ] }),
  component: LoginPage,
});

type Mode = "signin" | "setup" | "forgot";

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("signin");
  const [canSetup, setCanSetup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    void supabase.auth.getUser().then(({ data }) => { if (data.user) void navigate({ to: "/admin", replace: true }); });
    void supabase.rpc("admin_exists").then(({ data }) => setCanSetup(data === false));
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setError(""); setNotice("");
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        await navigate({ to: "/admin", replace: true });
      } else if (mode === "setup") {
        if (password.length < 8) throw new Error("Use at least 8 characters for your password.");
        const { data, error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/login` } });
        if (error) throw error;
        if (data.session) await navigate({ to: "/admin", replace: true });
        else { setNotice("Check your inbox to confirm your email, then sign in here."); setMode("signin"); setCanSetup(false); }
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
        if (error) throw error;
        setNotice("If that email has an account, a reset link is on its way.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally { setBusy(false); }
  };

  const title = mode === "setup" ? "Create the admin account" : mode === "forgot" ? "Reset your password" : "Sign in to the dashboard";
  return <main className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
    <form onSubmit={submit} className="w-full max-w-sm space-y-5 rounded-2xl border bg-card p-8 shadow-sm">
      <div className="flex flex-col items-center gap-3 text-center">
        <img src={logo.url} alt="Teamwork Digital" className="h-14 w-14 rounded-full" />
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
        {mode === "setup" && <p className="text-sm text-muted-foreground">This first account becomes the site admin. You can invite your team afterwards.</p>}
      </div>
      <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} /></div>
      {mode !== "forgot" && <div className="space-y-2"><Label htmlFor="password">Password</Label><Input id="password" type="password" autoComplete={mode === "setup" ? "new-password" : "current-password"} required value={password} onChange={e => setPassword(e.target.value)} /></div>}
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      {notice && <p className="text-sm text-primary">{notice}</p>}
      <Button type="submit" className="w-full" disabled={busy}>{busy ? "Please wait…" : mode === "setup" ? "Create admin account" : mode === "forgot" ? "Send reset link" : "Sign in"}</Button>
      <div className="flex flex-col items-center gap-2 text-sm">
        {mode !== "signin" && <button type="button" className="text-muted-foreground hover:text-foreground" onClick={() => setMode("signin")}>Back to sign in</button>}
        {mode === "signin" && <button type="button" className="text-muted-foreground hover:text-foreground" onClick={() => setMode("forgot")}>Forgot password?</button>}
        {mode === "signin" && canSetup && <button type="button" className="font-medium text-primary" onClick={() => setMode("setup")}>First time? Set up the admin account</button>}
        <a href="/" className="text-muted-foreground hover:text-foreground">← Back to website</a>
      </div>
    </form>
  </main>;
}
