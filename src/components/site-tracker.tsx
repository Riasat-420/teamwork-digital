import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";
import { trackEvent, trackView } from "@/lib/track";

/** Counts page views and key clicks (WhatsApp, email, phone, outbound project links). */
export function SiteTracker() {
  const path = useRouterState({ select: s => s.location.pathname });
  useEffect(() => { trackView(); }, [path]);
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.("a");
      const href = a?.getAttribute("href");
      if (!href) return;
      if (href.startsWith("mailto:")) trackEvent("email_click", href.slice(7));
      else if (href.startsWith("tel:")) trackEvent("phone_click", href.slice(4));
      else if (href.includes("wa.me")) trackEvent("whatsapp_click");
      else if (/^https?:\/\//.test(href) && !href.startsWith(window.location.origin)) {
        try { trackEvent("outbound_click", new URL(href).hostname); } catch { /* ignore */ }
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}
