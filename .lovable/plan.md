# Portfolio recreation plan

## Goal
Recreate the supplied Firoj Khan portfolio’s visual design and behavior as your portfolio, replacing its personal content with the details you send. Do not publish the original person’s biography, contact information, or projects as if they were yours.

## What will be built
1. Reproduce the reference’s single scrolling composition: opening screen and navigation, services, about, skills, work history, selected projects, education, contact, and footer. Preserve its visual hierarchy, responsive layouts, colors, typography, cards, illustrated phone mockup, and restrained motion as closely as practical.
2. Use the uploaded design tokens and HTML capture alongside the live reference for precise spacing, surfaces, typography, and interaction cues. Adapt them to this project’s design system rather than embedding the captured page or browser-extension markup.
3. Replace every person-specific item with your supplied name, introduction, services, skills, jobs, projects, education, contact links, location, and CV. Omit any section or link for which you have no corresponding content rather than invent facts.
4. Make navigation, project links, email copy/contact action, mobile menu, and back-to-top usable. Keep the reference’s contact form behavior unless you request a message-delivery service.
5. Check the result against the reference on desktop and mobile, including text fit, working links, and page metadata.

## What I need from you before building
Send your preferred name and title, short introduction/about text, services, skills, work experience, project names and descriptions (plus links/images if available), education or certifications, email/social links, location, and CV file/link if you want it included. Rough notes are fine; unsupported sections can be omitted.

## Technical approach
Build in the existing TanStack Start app, with one scrolling portfolio page at `/`. Map uploaded design values into semantic CSS tokens and keep the personal content in a clearly organized data module for easy future updates. Use local or approved assets for any supplied imagery; no backend is needed for the reference’s email-app contact flow.
