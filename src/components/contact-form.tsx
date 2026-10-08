import { useState } from "react";
import { z } from "zod";
import { Send, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/track";

const schema = z.object({
  name: z.string().trim().min(1, "Please add your name").max(120),
  email: z.string().trim().email("Please add a valid email").max(255),
  phone: z.string().trim().max(40).optional(),
  message: z.string().trim().min(5, "Tell us a little about your project").max(4000),
});

export function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const parsed = schema.safeParse({ name: form.get("name"), email: form.get("email"), phone: form.get("phone") || undefined, message: form.get("message") });
    if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? "Please check the form"); return; }
    setError(""); setState("sending");
    const { error: dbError } = await supabase.from("contact_messages").insert({ ...parsed.data, phone: parsed.data.phone ?? null });
    if (dbError) { setState("idle"); setError("Your message couldn't be sent. Please try WhatsApp or email."); return; }
    trackEvent("contact_form", "submitted");
    setState("sent");
  };
  if (state === "sent") return <div className="contact-form contact-form-sent"><Check size={20} /><p>Thanks — your message has reached the team. We'll reply soon.</p></div>;
  return <form className="contact-form" onSubmit={submit} noValidate>
    <div className="contact-form-row"><input name="name" placeholder="Your name" autoComplete="name" maxLength={120} required /><input name="email" type="email" placeholder="Email" autoComplete="email" maxLength={255} required /></div>
    <input name="phone" placeholder="Phone / WhatsApp (optional)" autoComplete="tel" maxLength={40} />
    <textarea name="message" placeholder="Tell us about your project" rows={4} maxLength={4000} required />
    {error && <p className="contact-form-error" role="alert">{error}</p>}
    <Button type="submit" disabled={state === "sending"}>{state === "sending" ? "Sending…" : "Send message"} <Send size={15} /></Button>
  </form>;
}
