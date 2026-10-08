# Admin dashboard for Teamwork Digital

A private dashboard inside the same site at `/admin` (sign-in at `/login`). Everything the public page shows comes from the database, so changes made in the dashboard go live straight away. Nobody has to edit code.

## Who can sign in

- Email and password sign-in. Public sign-up is turned off.
- Roles: **Admin** can do everything, including managing users and settings. **Editor** can change content only.
- The first admin is set up once using your email. After that, admins invite more people from the dashboard.
- Password reset by email.

## Dashboard sections

```text
/admin
 ├ Overview        visitors today/7d/30d, top pages, new messages, quick links
 ├ Content
 │  ├ Opening      headline, subtext, buttons, opening visual
 │  ├ Services     add/edit/delete/reorder, icon picker, tags
 │  ├ Why us       4 cards (icon, title, text)
 │  ├ Process      steps, points, tags
 │  ├ Tech strip   chips, order
 │  ├ Projects     add/edit/delete/reorder, category, link, screenshot upload, show/hide
 │  ├ Team         members, photo, role, bio, social links, leader flag
 │  ├ Testimonials add/edit/delete, rating, service, show/hide
 │  ├ FAQ          questions and answers, order
 │  └ Contact      email, WhatsApp, address, social links
 ├ Media library   upload images, automatic smaller versions, alt text
 ├ Messages        contact form submissions (new form on the site), mark read, export
 ├ Analytics       page views, unique visitors, referrers, countries, devices, clicks on
 │                 project links / WhatsApp / email / chatbot opens, date range filter
 ├ SEO             site title, description, share image, per-page meta, Google Search
 │                 Console verification code, Google Analytics / Tag Manager ID (optional),
 │                 sitemap.xml and robots.txt generated automatically, preview of the
 │                 Google result and social share card
 ├ Chatbot         welcome message, suggested questions, extra facts the assistant may use,
 │                 on/off switch
 └ Settings        logo, favicon, users and roles, activity log
```

## Extras I recommend

1. **Contact form plus inbox.** Visitors can send a message from the Contact section. You see it in Messages and get an email alert.
2. **Show/hide and draft toggles** on every item, so you can prepare content before it goes public.
3. **Drag to reorder** services, projects, team and FAQ.
4. **Activity log** showing who changed what, and when.
5. **Your own analytics, with no cookie banner needed.** Visits are counted on our server without personal data. Google Analytics can be added on top by pasting an ID.
6. **Automatic sitemap and search-friendly page info**, updated whenever you add a project.
7. **Optional per-project detail pages** (`/work/project-name`) that can rank on Google. They are off by default.
8. **Backup and export**: download all content as a file.

## How it rolls out

1. Database tables, image storage, sign-in, roles, and the `/login` and `/admin` pages.
2. Move the current demo content into the database. The site looks exactly the same afterwards.
3. Content editors for every section, plus the media library.
4. Contact form, Messages inbox and email alerts.
5. Visit tracking and the Analytics page.
6. SEO settings, sitemap, robots and the Search Console code.
7. Chatbot settings, activity log, export.
8. Full check: sign in, edit a project, confirm it changes on the public page, and test on mobile.

## Technical details

- Lovable Cloud: tables for `site_settings`, `sections` (JSON content per section), `services`, `projects`, `team_members`, `testimonials`, `faqs`, `process_steps`, `media`, `messages`, `page_views`, `events`, `seo_pages`, `activity_log`, and `user_roles` (enum admin/editor) with a `has_role` security-definer helper. RLS: anyone can read published rows; only admins and editors can write; only admins can manage users and settings.
- The public page reads through a public server function so search engines still get server-rendered content. `portfolio-data.ts` stays as the initial values and as a fallback.
- Admin pages live under `_authenticated/admin/*` (client-only gate). All writes go through `requireSupabaseAuth` server functions with a role check.
- Storage bucket `site-media` (public read). Uploaded images are resized into the same 480/960 WebP sizes used now.
- Tracking: a small beacon to `/api/public/track` stores the path, referrer, device and country. IPs are not stored, and the endpoint is rate-limited.
- `/sitemap.xml` and `/robots.txt` become server routes. The GSC verification meta tag and GA ID are added in the root head from settings.
- Charts use recharts. Forms use react-hook-form and zod.
- New dashboard rules go in AGENTS.md. Rule tests cover role permissions and published-only visibility.

## Questions before building

- Will you use your own email as the first admin?
- Should contact form alerts go to that same email? Email alerts need a sending domain, so we can start with inbox-only.
- Should project detail pages be included now, or later?

&nbsp;

Whole plan is approved with the recommendations + could you add chatbot section where we can manage the chatbot memory, responses ,add or edit , delete the data etc like that