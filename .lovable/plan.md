# Rethink the portfolio sections for Teamwork Digital

The current page is still shaped like one person's CV: an About section, a career timeline, and Education. Teamwork Digital is a team that sells services, so the page should be built to win clients. This plan uses only what is in the company profile and the client's notes. New content we don't have yet is marked "needs client input". Those parts stay hidden until the client sends real details.

## Current order
Opening screen → ticker → Services → About → Skills → How We Work → Projects → Credentials → AI Project Planner → Contact → Footer

## Remove or merge
1. **Credentials / Education**: remove it. It's a leftover from a personal CV, and its two cards repeat the About and Services sections. Its strongest lines move into "Why Teamwork Digital" (see below).
2. **Skills grid**: merge it into Services. Both list the same platforms (Flutter, WordPress, Shopify and so on). Replace it with a compact "Tech we work with" logo/chip strip, ordered as the client asked: Flutter and React Native first, then WordPress, Wix, Shopify, and the rest.
3. **About**: shorten it to a short team introduction with the team leader's photo, and remove anything that reads like a personal CV.

## Add
1. **Why Teamwork Digital** (from the profile): one team for mobile, web, commerce, AI, design and growth; the right tool for each project; testing before handoff; support after delivery. Shown as 4 animated cards.
2. **Service filter on Projects**: tabs for All / WordPress / E-commerce / Other, using the existing 10 projects. Each card gets a "Visit site" link.
3. **Industries we've served**: drawn from the existing projects (pet care, construction, beauty, wellness, organic food, retail, sports). Shown as a moving ribbon, matching the ticker style.
4. **FAQ** (accordion): general questions that need no invented facts, such as which platforms you use, whether you offer support after launch, whether you handle both design and development, and how a project starts.
5. **Meet the team**: needs client input (names, roles, photos). Hidden until provided.
6. **Client testimonials**: needs client input. Hidden until provided. No made-up quotes.
7. **Stronger contact section**: WhatsApp, email and a call-booking button. Needs client input (phone/email). Until then, keep the profile download and the AI Project Planner.

## Proposed new order
Opening screen → ticker → Services (with the tech strip) → Why Teamwork Digital → How We Work → Projects (filterable) → Industries ribbon → AI Project Planner → FAQ → [Team, Testimonials when available] → Contact → Footer

Navigation becomes: Services · Work · Process · Planner · FAQ · Contact.

## Kept as is
- The design system, logo colours, dark services panel, the scroll-led timeline and all hover, scroll and click animations
- The AI Project Planner

## Technical notes
- All new content lives in the existing portfolio data module. Sections with empty data don't appear on the page.
- Motion reuses the current lightweight observers and CSS states, with reduced-motion fallbacks.
- Check at 1280px and 390px, then update the page title and description.

## Questions for the client (optional, unlocks more sections)
Team member names/roles/photos, 2–4 client testimonials, contact email/WhatsApp, and starting prices or packages, if they want to show them.
