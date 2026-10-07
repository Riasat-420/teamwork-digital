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
  { title: "Love Paws Walk", category: "WordPress", type: "WordPress", url: "https://www.lovepawswalk.com/", initials: "LP" },
  { title: "American Webs Studios", category: "WordPress", type: "WordPress", url: "https://americanwebsstudios.com/", initials: "AW" },
  { title: "Aberas Construction", category: "WordPress", type: "WordPress", url: "https://aberasconstruction.ca/", initials: "AC" },
  { title: "Black & Grain", category: "WordPress", type: "WordPress", url: "https://blackandgrain.com/", initials: "BG" },
  { title: "Welloraa", category: "WordPress", type: "WordPress", url: "https://welloraa.com/", initials: "WE" },
  { title: "Beaut by Muh", category: "WordPress", type: "WordPress", url: "https://beautbymuh.com/", initials: "BM" },
  { title: "World Foot", category: "Other", type: "Additional portfolio", url: "https://worldfoot.fr/en", initials: "WF" },
  { title: "Green Leaf Organics", category: "E-commerce", type: "Additional portfolio", url: "https://greenleaforganics.com/", initials: "GL" },
  { title: "The Powers Hub", category: "Other", type: "Additional portfolio", url: "https://thepowershub.com/", initials: "PH" },
  { title: "The Shiffaa Store", category: "E-commerce", type: "Additional portfolio", url: "https://theshiffaa.store/", initials: "SS" },
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
  { icon: "users", title: "One complete team", description: "Developers, designers and digital specialists working together on your project." },
  { icon: "code", title: "Right tool for the project", description: "Flutter, WordPress, Shopify, Wix or custom code, chosen around your goals." },
  { icon: "check", title: "Quality and testing", description: "Key journeys and screen sizes are reviewed before anything is handed over." },
  { icon: "chat", title: "Clear communication", description: "One point of contact and regular progress updates from start to launch." },
  { icon: "support", title: "Long-term support", description: "Handover, maintenance and improvements available after your project goes live." },
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

export type TeamRole = { role: string; focus: string; skills: string[]; leader?: boolean };
// Role-based until the client supplies real names and photos. Do not add invented identities.
export const team: TeamRole[] = [
  { role: "Team Lead / Project Manager", focus: "Plans the project, coordinates the team and keeps communication clear.", skills: ["Planning", "Delivery", "Client updates"], leader: true },
  { role: "Mobile App Developer", focus: "Builds Android and iOS apps with Flutter and React Native.", skills: ["Flutter", "React Native", "Firebase"] },
  { role: "Web & E-commerce Developer", focus: "Builds WordPress, Shopify, Wix and custom websites.", skills: ["WordPress", "Shopify", "Wix"] },
  { role: "UI/UX & Graphic Designer", focus: "Designs interfaces, brand visuals and video content.", skills: ["UI/UX", "Branding", "Video"] },
];
