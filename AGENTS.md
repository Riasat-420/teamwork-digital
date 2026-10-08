<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep portfolio copy, services, projects and process items in `src/lib/portfolio-data.ts`; the single scrolling page renders those entries so client details can be updated without changing layout.
- Render projects once in a filterable image-led gallery and team members as a featured leader plus image-led member cards using the shared team photo, name, role and socials fields; use initials for missing photos so public cards and admin editing stay aligned without inventing identities.
- Map project previews by stable project initials in `src/lib/project-previews.ts`; bundle WebP width variants as real files in src/assets (so any host, e.g. Vercel, serves them) with explicit image dimensions and low-priority eager loading so filters keep correct images and small previews arrive before section reveals.
- Keep portfolio motion in a shared page-level visibility observer and semantic CSS states, with bounded content staggering and reduced-motion fallbacks, so scroll reveals stay consistent without a separate animation runtime.
- Keep ribbon looping on an inner track and scroll displacement on its wrapper in the existing page motion loop, so both motions compose without competing transforms.
- Keep the floating chatbot on real thread page routes with browser-owned history, answering in the browser from site content and enabled chatbot answers (`src/lib/chat-guide.ts`), so it needs no AI key or paid API on any host.
- Public server routes (tracking, media, content reads) use only the publishable key via `src/lib/public-client.server.ts` under database policies, so the site runs on external hosts like Vercel without the private service key; only team invites/role changes need that key.
- Dashboard lives at /admin under the managed `_authenticated` gate; editable public sections are declared once in `src/lib/admin-sections.ts` and saved as whole `site_content` rows, so new sections need only a definition, not a new editor.
- Account and role management runs in admin-checked server functions (`src/lib/admin.functions.ts`); everything else in the dashboard uses the browser client under database policies, so permissions are enforced by the database, not the UI.

- Team member social links are stored as a list of { icon, url } using keys from `src/lib/social-icons.ts`, with older object-shaped saves normalized on read, so admins can add any network without breaking existing content.
- Built-in site images are exposed as defaults in `site-content.ts` and listed in the media library, so the dashboard shows what the site currently displays.
- Admin profile edits (name, photo, email, password) use the signed-in user's own auth account metadata, so no extra profile table is needed.
