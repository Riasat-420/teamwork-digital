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
- Render projects once in a filterable image-led gallery and team members as a featured leader plus role cards, using existing asset pointers and data entries so section layouts do not duplicate portfolio content or invent identities.
- Map project previews by stable project initials in `src/lib/project-previews.ts`; serve CDN-hosted WebP width variants with explicit image dimensions and low-priority eager loading so filters keep correct images and small previews arrive before section reveals.
- Keep portfolio motion in a shared page-level visibility observer and semantic CSS states, with bounded content staggering and reduced-motion fallbacks, so scroll reveals stay consistent without a separate animation runtime.
- Keep ribbon looping on an inner track and scroll displacement on its wrapper in the existing page motion loop, so both motions compose without competing transforms.
- Keep the floating chatbot on real thread page routes with browser-owned UIMessage history and a server-only streaming AI endpoint, so visitors can resume separate chats without accounts or server transcript storage.
