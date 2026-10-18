import { appearanceCss } from "@/lib/appearance";
import { useSiteContent } from "@/lib/site-content.functions";

export function PublicAppearance() {
  const site = useSiteContent();
  const css = appearanceCss(site.settings.appearance);
  return css ? <style data-site-appearance>{css}</style> : null;
}