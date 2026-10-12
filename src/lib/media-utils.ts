export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

export type CropPixels = { x: number; y: number; width: number; height: number };
export type ImageTransform = { crop: CropPixels; rotation: number; flipX: boolean; flipY: boolean; outputWidth?: number; outputHeight?: number };

export function validateImageFile(file: Pick<File, "type" | "size">): string | null {
  if (!file.type.startsWith("image/")) return "Please choose an image file.";
  if (file.size > MAX_IMAGE_BYTES) return "Images must be 10 MB or smaller.";
  return null;
}

export function isUnsafeSavedImage(value: string | null | undefined): boolean {
  if (!value) return false;
  return value.startsWith("/src/") || value.includes("/@fs/") || value.startsWith("blob:");
}

export function cleanSavedImage(value: string | null | undefined): string {
  return isUnsafeSavedImage(value) ? "" : value ?? "";
}

export async function renderImageTransform(source: string, transform: ImageTransform): Promise<Blob> {
  const image = new Image();
  image.crossOrigin = "anonymous";
  image.src = source;
  await image.decode();
  const radians = transform.rotation * Math.PI / 180;
  const rotated = Math.abs(transform.rotation % 180) === 90;
  const work = document.createElement("canvas");
  work.width = rotated ? image.naturalHeight : image.naturalWidth;
  work.height = rotated ? image.naturalWidth : image.naturalHeight;
  const context = work.getContext("2d");
  if (!context) throw new Error("Image editing is not supported in this browser.");
  context.translate(work.width / 2, work.height / 2);
  context.rotate(radians);
  context.scale(transform.flipX ? -1 : 1, transform.flipY ? -1 : 1);
  context.drawImage(image, -image.naturalWidth / 2, -image.naturalHeight / 2);

  const output = document.createElement("canvas");
  output.width = transform.outputWidth ?? Math.round(transform.crop.width);
  output.height = transform.outputHeight ?? Math.round(transform.crop.height);
  const outputContext = output.getContext("2d");
  if (!outputContext) throw new Error("Image editing is not supported in this browser.");
  outputContext.drawImage(work, transform.crop.x, transform.crop.y, transform.crop.width, transform.crop.height, 0, 0, output.width, output.height);
  return new Promise<Blob>((resolve, reject) => output.toBlob(blob => blob ? resolve(blob) : reject(new Error("The edited image could not be created.")), "image/webp", 0.86));
}

export function editedImageFile(blob: Blob, originalName: string): File {
  const base = originalName.replace(/\.[^.]+$/, "").replace(/-edited$/, "");
  return new File([blob], `${base}-edited.webp`, { type: "image/webp" });
}