# MGHN — Portfolio v2

Editorial portfolio with a 3D scroll journey, built with **Next.js 16**, **Sanity** (Studio embedded at `/studio`), **GSAP + Lenis**, in **English and Persian (RTL)**. Deploys to Vercel as a single project.

```bash
pnpm install
pnpm dev          # http://localhost:3001  (Persian at /fa, Studio at /studio)
pnpm build        # production build
pnpm lint && pnpm typecheck
```

## How content works

| Sanity configured? | Source |
| --- | --- |
| No (`NEXT_PUBLIC_SANITY_PROJECT_ID` empty) | Typed seed in `content/seed/*.ts` |
| Yes | Sanity dataset, live-updated via `<SanityLive/>` |

Both go through the same interface in `lib/content/` (`seed-source.ts` / `sanity-source.ts`), so the site always builds — with or without a CMS.

UI strings (labels, buttons) live in `messages/en.json` and `messages/fa.json`. All editable content lives in Sanity.

## Connecting Sanity (one-time)

1. Create a project: `pnpm sanity login`, then `pnpm sanity projects create` — or use [sanity.io/manage](https://www.sanity.io/manage). Make the `production` dataset **public**.
2. Copy `.env.example` to `.env.local` and fill in `NEXT_PUBLIC_SANITY_PROJECT_ID` (and the dataset).
3. Allow the Studio origins (credentials on):
   ```bash
   pnpm sanity cors add http://localhost:3001 --credentials
   pnpm sanity cors add https://YOUR-DOMAIN --credentials
   ```
4. Create an **Editor** token (Manage → API → Tokens), put it in `.env.local` as `SANITY_API_WRITE_TOKEN`, then:
   ```bash
   pnpm seed       # uploads images + upserts every document (safe to re-run)
   ```
5. Optional safety net for revalidation: Manage → API → Webhooks → `POST https://YOUR-DOMAIN/api/revalidate`, with a secret equal to `SANITY_REVALIDATE_SECRET`.

Persian copy was drafted automatically — documents carry a **Needs review** checkbox in Studio.

## Deploying to Vercel

Import the repo in Vercel (framework: Next.js, package manager: pnpm) and set:

| Variable | Notes |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | e.g. `https://mghn.info` — canonical URLs, sitemap, OG |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | leave empty to ship on the seed |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | `2026-11-01` |
| `SANITY_REVALIDATE_SECRET` | same as the webhook secret |
| `SANITY_API_READ_TOKEN` | optional (drafts only) |

Never add `SANITY_API_WRITE_TOKEN` to Vercel — it is only for `pnpm seed` locally.

## Map

```
app/[locale]/            root layout (lang/dir, header, menu, Lenis, reveals), home, work index, case study
app/[locale]/@modal/     intercepted /work/[slug] → case study overlay
app/studio/              embedded Sanity Studio (own root layout)
components/journey/      3D scroll journey (CSS 3D world + canvas thread/stars, GSAP-scrubbed camera)
components/home/         home sections
components/work/         work list, case study, overlay, next-project wipe
components/chrome/       header, menu, progress rail, live clock
content/seed/            typed seed content (mghn.info + GitHub)
sanity/                  schemas, structure, client, live
lib/content/             content interface + both sources
```

## Notes

- `pnpm-workspace.yaml` pins `@sentry/*` to 11.12.0: `sanity@6.23` pulls `@sentry/react@11.13.0`, whose `@sentry/core@11.13.0` was never published. Remove the override once npm is fixed.
- Turbopack runs Tailwind only on non-module CSS (`next.config.ts`), so `*.module.css` keeps its scoping.
- The 3D journey falls back to a plain list for `prefers-reduced-motion` and before hydration.
