import { createFileRoute, redirect } from "@tanstack/react-router";

// The home page lives at "/"; sending "/index" there keeps old/shared links working.
export const Route = createFileRoute("/index/")({
  beforeLoad: () => {
    throw redirect({ to: "/", replace: true });
  },
});
