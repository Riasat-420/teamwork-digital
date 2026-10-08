const isTrackedPath = (path: string) => !/^\/(admin|login|reset-password)/.test(path);

function visitorId() {
  try {
    let id = localStorage.getItem("td-visitor");
    if (!id) { id = crypto.randomUUID(); localStorage.setItem("td-visitor", id); }
    return id;
  } catch { return undefined; }
}

function send(body: Record<string, unknown>) {
  if (typeof window === "undefined" || !isTrackedPath(window.location.pathname)) return;
  const payload = JSON.stringify({ ...body, path: window.location.pathname, visitorId: visitorId() });
  try {
    if (navigator.sendBeacon) navigator.sendBeacon("/api/public/track", new Blob([payload], { type: "application/json" }));
    else void fetch("/api/public/track", { method: "POST", body: payload, headers: { "content-type": "application/json" }, keepalive: true });
  } catch { /* analytics must never break the page */ }
}

export const trackView = () => send({ type: "view", referrer: document.referrer || null });
export const trackEvent = (name: string, label?: string) => send({ type: "event", name, label });
