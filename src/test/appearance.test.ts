import { describe, expect, it } from "vitest";
import { appearanceCss, defaultAppearance, normalizeAppearance } from "@/lib/appearance";

describe("website appearance", () => {
  it("global colors apply without requiring a section override", () => {
    const css = appearanceCss({ ...defaultAppearance, colors: { ...defaultAppearance.colors, accent: "#ff0000" } });
    expect(css).toContain("--primary:#ff0000;");
  });
  it("section colors override global colors only for that section", () => {
    const css = appearanceCss({ ...defaultAppearance, sections: { projects: { background: "#123456" } } });
    expect(css).toContain(".portfolio-page #projects{--background:#123456;");
    expect(css).not.toContain(".portfolio-page #team{");
  });
  it("invalid colors and arbitrary CSS cannot be saved as theme values", () => {
    expect(normalizeAppearance({ colors: { accent: "red;}body{display:none}" } }).colors.accent).toBe(defaultAppearance.colors.accent);
  });
  it("global heading and body font choices are independently applied", () => {
    const css = appearanceCss({ ...defaultAppearance, typography: { ...defaultAppearance.typography, headings: "Outfit", body: "Manrope" } });
    expect(css).toContain('--font-display:"Outfit",system-ui,sans-serif;');
    expect(css).toContain('--font-sans:"Manrope",system-ui,sans-serif;');
  });
  it("unknown section overrides are ignored", () => {
    expect(normalizeAppearance({ sections: { admin: { background: "#123456" } } }).sections).toEqual({});
  });
});