import { useEffect, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { FlipHorizontal2, FlipVertical2, Loader2, RotateCw, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { editedImageFile, renderImageTransform, type CropPixels } from "@/lib/media-utils";
import { uploadImage } from "@/lib/admin-client";
import type { MediaFile } from "./media-picker";

const presets = {
  free: { label: "Free crop", aspect: undefined },
  project: { label: "Project 16:10", aspect: 16 / 10 },
  share: { label: "Share 1200×630", aspect: 1200 / 630, width: 1200, height: 630 },
  square: { label: "Square", aspect: 1 },
  portrait: { label: "Portrait 10:11", aspect: 10 / 11 },
} as const;
type Preset = keyof typeof presets;

export function MediaEditor({ file, open, onOpenChange, onSaved, usage = [] }: { file: MediaFile | null; open: boolean; onOpenChange: (open: boolean) => void; onSaved?: (url: string) => void; usage?: string[] }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [pixels, setPixels] = useState<CropPixels | null>(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [flipX, setFlipX] = useState(false);
  const [flipY, setFlipY] = useState(false);
  const [preset, setPreset] = useState<Preset>("free");
  const [busy, setBusy] = useState(false);
  const [dimensions, setDimensions] = useState("");
  useEffect(() => {
    if (!file || !open) return;
    setCrop({ x: 0, y: 0 }); setZoom(1); setRotation(0); setFlipX(false); setFlipY(false); setPreset("free"); setPixels(null);
    const image = new Image(); image.src = file.url; image.onload = () => setDimensions(`${image.naturalWidth} × ${image.naturalHeight}px`);
  }, [file, open]);
  if (!file) return null;
  const selected = presets[preset];
  const save = async () => {
    if (!pixels) return;
    setBusy(true);
    try {
      const outputSize = "width" in selected ? { outputWidth: selected.width, outputHeight: selected.height } : {};
      const blob = await renderImageTransform(file.url, { crop: pixels, rotation, flipX, flipY, ...outputSize });
      const url = await uploadImage(editedImageFile(blob, file.name));
      toast.success("Edited copy saved to the media library");
      onSaved?.(url); onOpenChange(false);
    } catch (error) { toast.error(error instanceof Error ? error.message : "Image could not be edited"); }
    finally { setBusy(false); }
  };
  return <Dialog open={open} onOpenChange={value => { if (!busy) onOpenChange(value); }}><DialogContent className="max-h-[94dvh] max-w-5xl overflow-y-auto p-4 sm:p-6">
    <DialogHeader><DialogTitle>View and edit image</DialogTitle><DialogDescription>{file.name}{dimensions ? ` · ${dimensions}` : ""}{file.size ? ` · ${Math.round(file.size / 1024)} KB` : ""}</DialogDescription></DialogHeader>
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_230px]">
      <div className="relative h-[min(56vh,520px)] min-h-72 overflow-hidden rounded-md bg-muted">
        <Cropper image={file.url} crop={crop} zoom={zoom} rotation={rotation} aspect={selected.aspect} onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={(_, area: Area) => setPixels(area)} objectFit="contain" transform={`translate(${crop.x}px, ${crop.y}px) rotate(${rotation}deg) scale(${zoom}) scaleX(${flipX ? -1 : 1}) scaleY(${flipY ? -1 : 1})`} />
      </div>
      <div className="space-y-5">
        <div className="space-y-2"><label className="text-sm font-medium text-foreground">Crop shape</label><Select value={preset} onValueChange={value => setPreset(value as Preset)}><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent>{Object.entries(presets).map(([key, value]) => <SelectItem key={key} value={key}>{value.label}</SelectItem>)}</SelectContent></Select></div>
        <div className="space-y-2"><div className="flex justify-between text-sm"><span className="font-medium">Zoom</span><span className="text-muted-foreground">{zoom.toFixed(1)}×</span></div><Slider min={1} max={3} step={0.1} value={[zoom]} onValueChange={value => setZoom(value[0] ?? 1)} /></div>
        <div className="space-y-2"><span className="text-sm font-medium">Transform</span><div className="grid grid-cols-3 gap-2"><Button type="button" variant="outline" size="icon" title="Rotate" onClick={() => setRotation(value => (value + 90) % 360)}><RotateCw /></Button><Button type="button" variant={flipX ? "default" : "outline"} size="icon" title="Flip horizontally" onClick={() => setFlipX(value => !value)}><FlipHorizontal2 /></Button><Button type="button" variant={flipY ? "default" : "outline"} size="icon" title="Flip vertically" onClick={() => setFlipY(value => !value)}><FlipVertical2 /></Button></div></div>
        <div className="rounded-md border p-3 text-xs text-muted-foreground"><p className="font-medium text-foreground">Used in</p>{usage.length ? <ul className="mt-1 list-inside list-disc">{usage.map(item => <li key={item}>{item}</li>)}</ul> : <p className="mt-1">Not currently used in saved website content.</p>}</div>
        {file.builtIn && <p className="text-xs text-muted-foreground">This is a built-in website image. Editing creates a reusable copy and keeps the original safe.</p>}
      </div>
    </div>
    <DialogFooter className="gap-2"><Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={busy}>Cancel</Button><Button type="button" onClick={save} disabled={busy || !pixels}>{busy ? <Loader2 className="animate-spin" /> : <Save />}Save edited copy</Button></DialogFooter>
  </DialogContent></Dialog>;
}