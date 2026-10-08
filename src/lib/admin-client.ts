import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { slugify, type ContentKey } from "./site-content";

export type StaffRole = "admin" | "editor" | null;

export function useStaff() {
  return useQuery({
    queryKey: ["staff-me"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { user: null, role: null as StaffRole };
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
      const roles = (data ?? []).map(r => r.role);
      const role: StaffRole = roles.includes("admin") ? "admin" : roles.includes("editor") ? "editor" : null;
      return { user: { id: user.id, email: user.email ?? "" }, role };
    },
    staleTime: 60_000,
  });
}

export async function logActivity(action: string, entity: string, details?: Record<string, unknown>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("activity_log").insert({ user_id: user.id, user_email: user.email ?? null, action, entity, details: (details ?? null) as Json });
}

export function useSaveSection() {
  const qc = useQueryClient();
  return async (key: ContentKey, value: unknown) => {
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from("site_content").upsert({ key, value: value as Json, updated_at: new Date().toISOString(), updated_by: user?.id ?? null });
    if (error) throw new Error(error.message.includes("row-level") ? "You don't have permission to change this section." : error.message);
    await logActivity("updated", key);
    await qc.invalidateQueries({ queryKey: ["site-content"] });
  };
}

/** Resize in the browser to WebP (max 1600px wide) so uploaded images stay fast, then store under uploads/. */
export async function uploadImage(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Please choose an image file.");
  let blob: Blob = file;
  let ext = file.name.split(".").pop()?.toLowerCase() || "png";
  if (file.type !== "image/svg+xml" && file.type !== "image/gif") {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, 1600 / bitmap.width);
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale); canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    blob = await new Promise<Blob>((res, rej) => canvas.toBlob(b => b ? res(b) : rej(new Error("Image could not be processed")), "image/webp", 0.82));
    ext = "webp";
  }
  const name = `uploads/${Date.now()}-${slugify(file.name.replace(/\.[^.]+$/, "")) || "image"}.${ext}`;
  const { error } = await supabase.storage.from("site-media").upload(name, blob, { contentType: blob.type || file.type, cacheControl: "31536000" });
  if (error) throw new Error(error.message);
  await logActivity("uploaded", "media", { name });
  return `/media/${name}`;
}

export function downloadFile(name: string, content: string, type = "application/json") {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement("a"); a.href = url; a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
