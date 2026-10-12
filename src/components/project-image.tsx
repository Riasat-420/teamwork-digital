import { useState } from "react";
import { ImagePlus, Monitor } from "lucide-react";
import type { Project } from "@/lib/site-content";
import { cleanSavedImage } from "@/lib/media-utils";
import { projectPreviews } from "@/lib/project-previews";

export function ProjectImage({ project, compact = false }: { project: Project; compact?: boolean }) {
  const preview = projectPreviews[project.initials];
  const custom = cleanSavedImage(project.image);
  const sources = [...new Set([custom, preview?.small].filter(Boolean))] as string[];
  const [failed, setFailed] = useState<string[]>([]);
  const src = sources.find(source => !failed.includes(source));
  if (!src) return compact ? <ImagePlus className="text-muted-foreground" /> : <div className="project-gallery-placeholder" aria-label={`${project.title} screenshot needed`}><Monitor size={32} strokeWidth={1.4} /><span>{project.initials}</span></div>;
  const builtIn = src === preview?.small;
  return <img src={src} {...(builtIn && preview ? { srcSet: `${preview.small} 480w, ${preview.large} 960w`, sizes: compact ? "96px" : "(max-width: 600px) calc(100vw - 32px), (max-width: 900px) calc((100vw - 68px) / 2), (max-width: 1280px) calc((100vw - 88px) / 3), 390px" } : {})} width={compact ? 96 : 960} height={compact ? 64 : 600} alt={compact ? "" : `${project.title} website preview`} loading={compact ? "lazy" : "eager"} decoding="async" className={compact ? "h-full w-full object-cover" : undefined} onError={() => setFailed(values => [...values, src])} />;
}