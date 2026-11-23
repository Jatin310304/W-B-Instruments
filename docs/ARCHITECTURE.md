# Architecture

- Routes (`src/App.tsx`): `/`, `/industries[/:id]`, `/products`, `/products/:id`, `/solutions/:id`, `/businesses[/:id]`, `/news[/:id]`, `/resources[/:id]`, `/support`, `/about`, `/careers`, `/contact`, `/legal/:id`, `/search`, 404. Paths are built only in `src/lib/routes.ts`, so translated slugs can be added in one place.
- i18n: `I18nProvider` merges the active locale over English (`DeepPartial<Messages>`), exposes `m` (messages), `fmt`, `formatDate`, `formatNumber`, `locale`, `region`. Add a language: create `locales/<code>.ts`, register it in `config.ts` with `status: 'approved'` and a `load()`.
- The 3D canvas does not receive React context, so the viewer passes localised part names into the scene as props.
- Search: `src/lib/search.ts` builds an index from the active language's messages (products, groups, categories, industries, businesses, resources, glossary, published news, pages).
- Brand rules encoded in `tailwind.config.js` / `index.css`: navy text on Signal buttons, Signal text only on navy, thermal scale as hard-stop strips, graticule dot grid, reticle corners on readings, Lucide icons at 1.5 px.
