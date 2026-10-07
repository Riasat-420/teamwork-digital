import lovePaws from "@/assets/love-paws.png.asset.json";
import americanWebs from "@/assets/american-webs.png.asset.json";
import aberas from "@/assets/aberas.png.asset.json";
import blackGrain from "@/assets/black-grain-clean.png.asset.json";
import welloraa from "@/assets/welloraa.jpg.asset.json";
import powersHub from "@/assets/powers-hub.jpg.asset.json";
import greenLeaf from "@/assets/green-leaf.jpg.asset.json";
import shiffaa from "@/assets/shiffaa-store.jpg.asset.json";

export const portfolioCopy = {
  heroTitle: "Your Vision. One Complete Digital Team.",
  heroSupport: "From websites and mobile apps to e-commerce, AI and custom software, Teamwork Digital brings development, design and digital expertise together under one roof.",
  primaryAction: "Start a Project", secondaryAction: "View Our Work",
  valueTitle: "One Team. Multiple Digital Disciplines.",
  valueSupport: "You don't need to coordinate separate developers, designers and digital specialists. Teamwork Digital brings the right people and tools together, from the first conversation to delivery and long-term support.",
  teamTitle: "Meet the Team Behind the Work",
  contactTitle: "Have a Project in Mind?",
  contactSupport: "Tell us what you're building. We'll help you choose the right approach and turn the idea into a practical digital solution.",
  contactAction: "Start a Conversation",
};

export const services = [
  { title: "Mobile App Development", icon: "mobile", description: "Android and iOS apps built with Flutter and React Native, backed by APIs, Firebase, and ongoing app maintenance.", tags: ["Flutter", "React Native", "Android & iOS", "Firebase"] },
  { title: "Website Development", icon: "web", description: "Responsive websites and full-stack web experiences, from WordPress and Elementor to custom development.", tags: ["WordPress", "Elementor", "Custom web", "Full-stack"] },
  { title: "Shopify & E-commerce", icon: "shop", description: "Online stores, theme customization, Liquid templates, product pages, and essential integrations.", tags: ["Shopify", "Liquid", "Store setup", "Integrations"] },
  { title: "Wix / Wix Studio", icon: "layout", description: "Responsive Wix sites with booking, payments, and business integrations that make everyday work easier.", tags: ["Wix", "Wix Studio", "Booking", "Payments"] },
  { title: "AI Solutions", icon: "ai", description: "Chatbots, appointment assistants, inbound and outbound call assistants, and practical automation.", tags: ["Chatbots", "AI assistants", "Automation"] },
  { title: "Game Development", icon: "game", description: "Interactive web games, game interfaces, and custom gameplay experiences.", tags: ["Web games", "Game UI", "Gameplay"] },
  { title: "Graphic & UI/UX Design", icon: "design", description: "Modern interfaces, visual identities, brand graphics, and thoughtful design improvements.", tags: ["UI/UX", "Branding", "Graphics"] },
  { title: "Video Editing", icon: "video", description: "Professional short-form and promotional edits shaped to make your message stand out.", tags: ["Short-form", "Promotional", "Editing"] },
  { title: "Lead Generation", icon: "leads", description: "Targeted research, organized lead lists, and outreach support for growing businesses.", tags: ["Research", "Lead lists", "Outreach"] },
  { title: "Academic & Assignment Support", icon: "academic", description: "Support for technical projects, documentation, and development-based assignments.", tags: ["Technical projects", "Documentation", "Development"] },
  { title: "Custom Software Projects", icon: "code", description: "End-to-end development for unique business workflows and software ideas.", tags: ["Custom builds", "Business tools", "End-to-end"] },
] as const;

export const projects = [
  { title: "Love Paws Walk", category: "WordPress", type: "WordPress", url: "https://www.lovepawswalk.com/", initials: "LP", preview: lovePaws.url, description: "Pet care website from our company portfolio." },
  { title: "American Webs Studios", category: "WordPress", type: "WordPress", url: "https://americanwebsstudios.com/", initials: "AW", preview: americanWebs.url, description: "Web studio website from our company portfolio." },
  { title: "Aberas Construction", category: "WordPress", type: "WordPress", url: "https://aberasconstruction.ca/", initials: "AC", preview: aberas.url, description: "Construction company website from our company portfolio." },
  { title: "Black & Grain", category: "WordPress", type: "WordPress", url: "https://blackandgrain.com/", initials: "BG", preview: blackGrain.url, description: "A WordPress project from our company portfolio." },
  { title: "Welloraa", category: "WordPress", type: "WordPress", url: "https://welloraa.com/", initials: "WE", preview: welloraa.url, description: "Health and wellness products with an online shop." },
  { title: "Beaut by Muh", category: "WordPress", type: "WordPress", url: "https://beautbymuh.com/", initials: "BM", preview: undefined, description: "A WordPress project from our company portfolio." },
  { title: "World Foot", category: "Other", type: "Additional portfolio", url: "https://worldfoot.fr/en", initials: "WF", preview: undefined, description: "An additional project listed in our company portfolio." },
  { title: "Green Leaf Organics", category: "E-commerce", type: "Additional portfolio", url: "https://greenleaforganics.com/", initials: "GL", preview: greenLeaf.url, description: "Organic body care, including body butters and botanical soaps." },
  { title: "The Powers Hub", category: "Other", type: "Additional portfolio", url: "https://thepowershub.com/", initials: "PH", preview: powersHub.url, description: "An online storefront featuring herbal wellness products." },
  { title: "The Shiffaa Store", category: "E-commerce", type: "Additional portfolio", url: "https://theshiffaa.store/", initials: "SS", preview: shiffaa.url, description: "An online store featuring herbal teas and wellness products." },
] as const;

export const process = [
  { title: "Understand", period: "Discovery", description: "Review your requirements, goals, audience, and existing setup.", points: ["Clarify the product goal", "Identify the right service mix"], tags: ["Brief", "Research"] },
  { title: "Plan", period: "Direction", description: "Define the approach, tasks, milestones, and practical deliverables.", points: ["Shape the delivery roadmap", "Agree priorities and scope"], tags: ["Strategy", "Planning"] },
  { title: "Build", period: "Production", description: "Develop and design the product with attention to quality and responsiveness.", points: ["Create the core experience", "Share progress clearly"], tags: ["Design", "Development"] },
  { title: "Test", period: "Quality", description: "Review the full experience and resolve issues before the final handoff.", points: ["Check key user journeys", "Refine across screen sizes"], tags: ["QA", "Refinement"] },
  { title: "Deliver & Support", period: "Launch", description: "Provide the finished work, handover, and support when needed.", points: ["Prepare the final release", "Stay available after delivery"], tags: ["Launch", "Support"] },
] as const;

export const techStack = ["Flutter", "React Native", "Firebase", "APIs", "WordPress", "Elementor", "Wix", "Wix Studio", "Shopify", "Liquid", "Full-stack web", "AI assistants", "UI/UX", "Video editing"] as const;

export const reasons = [
  { icon: "users", title: "One complete team", description: "Mobile, web, commerce, AI, design and growth handled by one connected team." },
  { icon: "code", title: "The right tool for the job", description: "From Flutter to WordPress to Shopify, the platform is chosen around your project." },
  { icon: "check", title: "Tested before handoff", description: "Key journeys and screen sizes are reviewed before anything is delivered." },
  { icon: "support", title: "Support after delivery", description: "Handover, maintenance and help remain available once your project is live." },
] as const;

export const projectCategories = ["All", "WordPress", "E-commerce", "Other"] as const;

export const industries = ["Pet care", "Construction", "Beauty", "Wellness", "Organic food", "Retail", "Sports", "Web agencies", "Lifestyle brands"] as const;

export const faqs = [
  { q: "Which platforms do you build with?", a: "Flutter and React Native for mobile apps, plus WordPress, Elementor, Wix, Wix Studio, Shopify and custom full-stack development for the web." },
  { q: "Do you handle both design and development?", a: "Yes. UI/UX, graphics and video are handled by the same team that builds the product, so the design and the finished build match." },
  { q: "Do you offer support after launch?", a: "Yes. Delivery includes a handover, and we stay available for maintenance, fixes and improvements when you need them." },
  { q: "How does a project start?", a: "We review your requirements, goals and existing setup, then agree a plan with milestones before building. You can chat with our AI assistant to shape your brief first." },
  { q: "Can you add AI features to my business?", a: "We build chatbots, appointment assistants, inbound and outbound call assistants and practical automations around your real workflow." },
] as const;

// DEMO DATA — replace every entry below with the client's real details before launch.
export const contact = { email: "hello@teamworkdigital.com", whatsapp: "+92 300 0000000", whatsappLink: "https://wa.me/923000000000" };

export type TeamMember = { name: string; role: string; bio: string; leader?: boolean; socials: { linkedin?: string; github?: string; instagram?: string; email?: string } };
export const team: TeamMember[] = [
  { name: "", role: "Team Lead / Project Manager", bio: "Leads planning, delivery and client communication.", leader: true, socials: { linkedin: "#", email: "hello@teamworkdigital.com" } },
  { name: "", role: "Mobile App Developer", bio: "Flutter and React Native apps for Android & iOS.", socials: { linkedin: "#", github: "#" } },
  { name: "", role: "Web & E-commerce Developer", bio: "WordPress, Shopify, Wix and custom websites.", socials: { linkedin: "#", github: "#" } },
  { name: "", role: "UI/UX & Graphic Designer", bio: "Interfaces, brand visuals and video editing.", socials: { linkedin: "#", instagram: "#" } },
];

export const testimonials: { quote: string; name: string; company: string; service: string }[] = [];
