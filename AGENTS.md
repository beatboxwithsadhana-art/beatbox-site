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

- Keep all portfolio content, photo paths, fallback references, and link values in `src/data/portfolioData.ts` so real assets and copy can be replaced independently of presentation.
- Use one index route with anchor navigation because the portfolio is explicitly one long notebook page.
- Use reusable portfolio primitives and Framer Motion with reduced-motion handling so ink reveals and photo interactions remain consistent and accessible.
- Store downloaded fallback media as asset pointers and attempt local photo paths first so future photos replace stand-ins without presentation changes.
