import { createFileRoute } from "@tanstack/react-router";
import { Portfolio } from "./index";

export const Route = createFileRoute("/chat/$threadId")({
  head: () => ({ meta: [
    { title: "Project Chat — Teamwork Digital Assistant" },
    { name: "description", content: "Discuss your project with the Teamwork Digital AI assistant and explore suitable services and next steps." },
    { property: "og:title", content: "Project Chat — Teamwork Digital Assistant" },
    { property: "og:description", content: "AI-powered project guidance from Teamwork Digital." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex" },
  ] }),
  component: Portfolio,
});