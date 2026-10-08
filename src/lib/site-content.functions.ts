import { createServerFn } from "@tanstack/react-start";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { fetchSiteContentRows } from "./site-content.server";
import { mergeContent } from "./site-content";

export const getSiteContentRows = createServerFn({ method: "GET" }).handler(() => fetchSiteContentRows());

export const siteContentQuery = queryOptions({
  queryKey: ["site-content"],
  queryFn: async () => mergeContent((await getSiteContentRows()).map(r => ({ key: r.key, value: JSON.parse(r.json) as unknown }))),
  staleTime: 30_000,
});

export const useSiteContent = () => useSuspenseQuery(siteContentQuery).data;
