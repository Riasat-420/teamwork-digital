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
- Keep portfolio motion in a shared page-level visibility observer and semantic CSS states, with bounded content staggering and reduced-motion fallbacks, so scroll reveals stay consistent without a separate animation runtime.
- Keep the capabilities strip as a restrained single track with reduced-motion fallback; avoid scroll displacement so the premium layout stays calm.
- Keep the floating chatbot on real thread page routes with browser-owned UIMessage history and a server-only streaming AI endpoint, so visitors can resume separate chats without accounts or server transcript storage.
- Keep the portfolio styling in the existing route and semantic global theme, with asset-pointer portrait and project images; this preserves navigation and content ownership without a second layout system.
