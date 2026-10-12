import { describe, expect, it } from "vitest";
import { summarize } from "@/lib/admin-analytics";
import { setPath, newProjectCategory, projectCategoryOptions } from "@/lib/admin-sections";
import { mergeContent, visible } from "@/lib/site-content";
import { normalizeSocials, publicSocials } from "@/lib/social-icons";

describe("dashboard rules", () => {
  it("new projects use the selected category, not WordPress", () => {
    expect(newProjectCategory("E-commerce", ["WordPress", "E-commerce"])).toBe("E-commerce");
  });
  it("the All view requires an explicit project category", () => {
    expect(newProjectCategory("All", ["WordPress", "E-commerce"])).toBe("");
  });
  it("category options retain saved categories and never treat the first as All", () => {
    expect(projectCategoryOptions(["WordPress", "All", "WordPress"], [{ category: "Wix" }])).toEqual(["WordPress", "Wix"]);
  });
  it("hidden (draft) items never show on the public site", () => {
    expect(visible([{ id: "a" }, { id: "b", published: false }, { id: "c", published: true }]).map(x => x.id)).toEqual(["a", "c"]);
  });
  it("saved sections override defaults, keeping new default fields", () => {
    const c = mergeContent([{ key: "contact", value: { email: "real@x.com" } }]);
    expect(c.contact.email).toBe("real@x.com");
    expect(c.contact.showForm).toBe(true);
  });
  it("editing a social link keeps the other socials", () => {
    expect(setPath({ socials: { github: "g" } }, "socials.linkedin", "l")).toEqual({ socials: { github: "g", linkedin: "l" } });
  });
  it("counts unique visitors once", () => {
    const now = Date.parse("2026-10-08T12:00:00Z");
    const v = (id: string) => ({ created_at: "2026-10-08T10:00:00Z", path: "/", referrer: null, country: null, device: "mobile", visitor_id: id });
    const s = summarize([v("a"), v("a"), v("b")], [], 7, now);
    expect(s.totalViews).toBe(3);
    expect(s.visitors).toBe(2);
  });
  it("older saved social links still show after switching to the list format", () => {
    expect(normalizeSocials({ linkedin: "https://l", email: "a@b.c" })).toEqual([{ icon: "linkedin", url: "https://l" }, { icon: "email", url: "a@b.c" }]);
  });
  it("empty or placeholder social links are hidden on the site", () => {
    expect(publicSocials([{ icon: "x", url: "#" }, { icon: "github", url: "" }, { icon: "youtube", url: "https://y" }]).map(s => s.icon)).toEqual(["youtube"]);
  });
});
