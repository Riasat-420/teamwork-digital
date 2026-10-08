import preview0_480Src from "@/assets/love-paws-480.webp";
const preview0_480 = { url: preview0_480Src };
import preview0_960Src from "@/assets/love-paws-960.webp";
const preview0_960 = { url: preview0_960Src };
import preview1_480Src from "@/assets/american-webs-480.webp";
const preview1_480 = { url: preview1_480Src };
import preview1_960Src from "@/assets/american-webs-960.webp";
const preview1_960 = { url: preview1_960Src };
import preview2_480Src from "@/assets/aberas-480.webp";
const preview2_480 = { url: preview2_480Src };
import preview2_960Src from "@/assets/aberas-960.webp";
const preview2_960 = { url: preview2_960Src };
import preview3_480Src from "@/assets/black-grain-clean-480.webp";
const preview3_480 = { url: preview3_480Src };
import preview3_960Src from "@/assets/black-grain-clean-960.webp";
const preview3_960 = { url: preview3_960Src };
import preview4_480Src from "@/assets/welloraa-480.webp";
const preview4_480 = { url: preview4_480Src };
import preview4_960Src from "@/assets/welloraa-960.webp";
const preview4_960 = { url: preview4_960Src };
import preview5_480Src from "@/assets/green-leaf-480.webp";
const preview5_480 = { url: preview5_480Src };
import preview5_960Src from "@/assets/green-leaf-960.webp";
const preview5_960 = { url: preview5_960Src };
import preview6_480Src from "@/assets/powers-hub-480.webp";
const preview6_480 = { url: preview6_480Src };
import preview6_960Src from "@/assets/powers-hub-960.webp";
const preview6_960 = { url: preview6_960Src };
import preview7_480Src from "@/assets/shiffaa-480.webp";
const preview7_480 = { url: preview7_480Src };
import preview7_960Src from "@/assets/shiffaa-960.webp";
const preview7_960 = { url: preview7_960Src };

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
