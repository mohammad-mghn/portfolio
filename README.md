# MGHN — Portfolio v2

Editorial portfolio with a 3D scroll journey, in **English and Persian (RTL)**. Built with **Next.js 16**, **Sanity** (the admin panel is part of the site at `/studio`), **GSAP + Lenis**. It deploys to Vercel as one project, or runs as one Docker container.

```bash
pnpm install
pnpm dev          # http://localhost:3001  (Persian at /fa, panel at /studio)
pnpm build        # production build
pnpm lint && pnpm typecheck
pnpm seed:check   # the seed content fits the CMS schema
pnpm cms:check    # the CMS path shows the same content as the seed, in both languages
```

## How content works

| Sanity connected? | The site reads from |
| --- | --- |
| No (`NEXT_PUBLIC_SANITY_PROJECT_ID` empty) | The typed seed in `content/seed/*.ts` |
| Yes | The Sanity dataset, updated live while a page is open |

Both go through the same interface in `lib/content/`, so the site always builds, with or without a CMS.

What lives where:

| Content | In the panel | In the seed |
| --- | --- | --- |
| Name, roles, links, booking link, SEO | Site settings | `site.ts` |
| Bio, "What I do", beliefs, quotes, numbers, education | About | `site.ts` |
| Each page's statement and closing contact text | Page texts | `pages.ts` |
| Jobs and roles (word for word from LinkedIn) | Experience | `journey.ts` |
| Projects and case studies | Projects | `projects.ts` |
| Co-founded products and their story | Ventures | `founding.ts` |
| The home-page journey | Journey | `journey.ts` |
| Recommendations, with portraits | Recommendations | `site.ts` |

Small interface strings (buttons, menu labels, table headers) live in `messages/en.json` and `messages/fa.json`.

### The career model

- **Full-time jobs** (Nobar, RCOINX, Pishgaman Farda) are *Experience*, never projects.
- A **project** is one of: a product I co-founded, a client project, or open source / personal work. A client project points at the role it was built in (**Built at**), which is what shows as "Built at Pishgaman Farda" or "Freelance".
- The **journey** is a list of stops that only point at roles, ventures and projects. A job or venture is a big stop; the project cards built there come right after it. Names, dates and covers are read from what a stop points at, so nothing is typed twice.

### Editing in two languages

Every text field in the panel has English and فارسی side by side. English is required; where the Persian is empty the Persian site shows the English. Recommendations stay in their original English, with optional Persian translation fields.

## Connecting Sanity (one time)

1. Create a free project at [sanity.io/manage](https://www.sanity.io/manage) (or `pnpm sanity login`, then `pnpm sanity projects create`). Keep the `production` dataset **public**.
2. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SANITY_PROJECT_ID`.
3. Allow the panel's origins (with credentials):
   ```bash
   pnpm sanity cors add http://localhost:3001 --credentials
   pnpm sanity cors add https://YOUR-DOMAIN --credentials
   ```
4. Create an **Editor** token (Manage → API → Tokens), put it in `.env.local` as `SANITY_API_WRITE_TOKEN`, then:
   ```bash
   pnpm seed           # uploads images and adds every document that is missing
   ```
   `pnpm seed` never overwrites what you changed in the panel. `pnpm seed --force` replaces everything with the seed.
5. Open `http://localhost:3001/studio` and sign in.
6. For the live site: Manage → API → Webhooks → `POST https://YOUR-DOMAIN/api/revalidate` on create, update and delete, with a secret equal to `SANITY_REVALIDATE_SECRET`. Open pages update by themselves; the webhook refreshes everything else, including the resume PDF.

Persian copy was drafted for you: documents carry a **Needs review** checkbox in the panel.

## Deploying to Vercel

Import the repo in Vercel (framework: Next.js, package manager: pnpm) and set:

| Variable | Notes |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | e.g. `https://mghn.info`: canonical URLs, sitemap, share images |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | leave empty to ship on the seed |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | `2026-11-01` |
| `SANITY_REVALIDATE_SECRET` | same as the webhook secret |

The panel ships with the site at `https://YOUR-DOMAIN/studio`. Never add `SANITY_API_WRITE_TOKEN` to Vercel: it is only for `pnpm seed` on your machine.

## Running in Docker

```bash
docker compose up --build      # http://localhost:3001
```

`docker-compose.yml` reads the same variables from your shell or a `.env` file next to it. The `NEXT_PUBLIC_*` values are compiled into the site, so changing them means building again. The build needs network access (dependencies, Google Fonts, and Sanity when a project is set). The container is self-contained: one Node process on port 3000, no database. Content still lives in Sanity's cloud, or in the seed when no project is set.

## Map

```
app/[locale]/            root layout (lang/dir, header, menu, Lenis), home and every page
app/[locale]/@modal/     intercepted /work/[slug] → case study overlay
app/studio/              the Sanity panel (own root layout)
app/api/revalidate/      webhook that refreshes the site after a publish
components/journey/      3D scroll journey (CSS 3D world + canvas thread, GSAP-scrubbed camera)
components/home/         home sections
components/work/         work list, case study, overlay
components/chrome/       header, menu, progress rail
content/seed/            typed seed content (from LinkedIn and the products' own sites)
sanity/                  schema, panel structure, client
lib/content/             content interface, both sources, the journey builder
scripts/                 seed, and the two offline checks
```

## Notes

- `pnpm-workspace.yaml` pins `@sentry/*` to 11.12.0: `sanity@6.23` pulls `@sentry/react@11.13.0`, whose `@sentry/core@11.13.0` was never published. Remove the override once npm is fixed.
- Turbopack runs Tailwind only on non-module CSS (`next.config.ts`), so `*.module.css` keeps its scoping.
- The journey falls back to a plain grouped list for `prefers-reduced-motion` and before the page is interactive.
- Section spacing comes from two tokens in `app/globals.css`: `--space-section` (every light section pads with it, top and bottom) and `--space-band` (dark bands).
