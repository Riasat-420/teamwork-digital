import preview0_480 from "@/assets/love-paws-480.webp.asset.json";
import preview0_960 from "@/assets/love-paws-960.webp.asset.json";
import preview1_480 from "@/assets/american-webs-480.webp.asset.json";
import preview1_960 from "@/assets/american-webs-960.webp.asset.json";
import preview2_480 from "@/assets/aberas-480.webp.asset.json";
import preview2_960 from "@/assets/aberas-960.webp.asset.json";
import preview3_480 from "@/assets/black-grain-clean-480.webp.asset.json";
import preview3_960 from "@/assets/black-grain-clean-960.webp.asset.json";
import preview4_480 from "@/assets/welloraa-480.webp.asset.json";
import preview4_960 from "@/assets/welloraa-960.webp.asset.json";
import preview5_480 from "@/assets/green-leaf-480.webp.asset.json";
import preview5_960 from "@/assets/green-leaf-960.webp.asset.json";
import preview6_480 from "@/assets/powers-hub-480.webp.asset.json";
import preview6_960 from "@/assets/powers-hub-960.webp.asset.json";
import preview7_480 from "@/assets/shiffaa-480.webp.asset.json";
import preview7_960 from "@/assets/shiffaa-960.webp.asset.json";

export type ProjectPreview = { small: string; large: string };
export const projectPreviews: Record<string, ProjectPreview> = {
  LP: { small: preview0_480.url, large: preview0_960.url },
  AW: { small: preview1_480.url, large: preview1_960.url },
  AC: { small: preview2_480.url, large: preview2_960.url },
  BG: { small: preview3_480.url, large: preview3_960.url },
  WE: { small: preview4_480.url, large: preview4_960.url },
  GL: { small: preview5_480.url, large: preview5_960.url },
  PH: { small: preview6_480.url, large: preview6_960.url },
  SS: { small: preview7_480.url, large: preview7_960.url },
};
