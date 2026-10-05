import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const briefSchema = z.object({ brief: z.string().trim().min(25, "Please add a little more detail about your project.").max(3000, "Please shorten your project brief to 3,000 characters.") });

export const getProjectGuide = createServerFn({ method: "POST" })
  .inputValidator((input: { brief: string }) => briefSchema.parse(input))
  .handler(async ({ data }) => {
    const key = process.env['LOVABLE_API_KEY'];
    if (!key) throw new Error("AI recommendations are not configured yet. Please try again later.");
    const { analyzeProject } = await import("./project-guide.server");
    return analyzeProject(data.brief, key);
  });