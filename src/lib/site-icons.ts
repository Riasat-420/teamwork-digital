import { Bot, Briefcase, Camera, Check, Cloud, Code2, Database, Gamepad2, Globe, GraduationCap, Heart, LayoutTemplate, LifeBuoy, Lightbulb, Megaphone, Monitor, Palette, PenTool, Play, Rocket, Search, Shield, ShoppingBag, Smartphone, Sparkles, Star, Target, TrendingUp, Users, Zap, type LucideIcon } from "lucide-react";

/** Icons the dashboard can pick from. Keys are stored in content; never rename existing keys. */
export const siteIcons: Record<string, LucideIcon> = {
  mobile: Smartphone, web: Monitor, layout: LayoutTemplate, shop: ShoppingBag, design: Palette, video: Play,
  game: Gamepad2, ai: Sparkles, leads: Search, academic: GraduationCap, code: Code2, users: Users, check: Check,
  support: LifeBuoy, bot: Bot, briefcase: Briefcase, camera: Camera, cloud: Cloud, database: Database, globe: Globe,
  heart: Heart, idea: Lightbulb, marketing: Megaphone, pen: PenTool, rocket: Rocket, shield: Shield, star: Star,
  target: Target, growth: TrendingUp, fast: Zap,
};

export const getIcon = (key: string | undefined, fallback: LucideIcon = Sparkles) => (key && siteIcons[key]) || fallback;
