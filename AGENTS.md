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
- Keep visitor project analysis as a one-shot server function with server-only AI credentials and no saved brief, so public visitors can get guidance without creating an account.
