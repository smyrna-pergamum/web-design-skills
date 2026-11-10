# LANORA website

The website for [LANORA](https://github.com/smyrna-pergamum/Lanora), the free, open-source network scanner for
Windows. It is an experimental, scroll-driven 3D page: the visitor travels into a network, past its devices, ports,
findings and reports, and back out to a single `127.0.0.1` dome.

![The hero: a network sphere of nodes and edges around a glass core](static/og.png)

## What is in it

- **Eight chapters**, all real HTML: Hero, Network discovery, Device intelligence, Port discovery, Security
  intelligence, Reports, Local-first, Explore.
- **One WebGL scene** (Three.js) behind them: the network sphere, the discovered topology, device crystals, port
  rings, a particle cloud that becomes a report and the LANORA shield, and the local-first dome. The camera follows
  one scroll value, so scrolling back rewinds everything.
- **Content that matches the product.** Every claim comes from the LANORA README and the 1.3.1 release notes; the two
  findings are quoted from `ruleset.json`. The network shown is sample data and is labelled as such.
- **Four quality tiers** (`src/lib/scene/quality.ts`): Full, Lite, Mobile and Static. Static (no WebGL, reduced
  motion, Save-Data, or the "Reduce motion" switch) shows pre-rendered stills from `static/fallback/`.
- **No third-party requests, no cookies, no analytics.** Fonts are self-hosted; a strict Content Security Policy is
  written into the page.

## Measured

| Check | Result |
| --- | --- |
| Lighthouse mobile (Performance / Accessibility / Best practices / SEO) | 94–95 / 100 / 100 / 100 |
| Lighthouse desktop | 100 / 100 / 100 / 100 |
| Mobile LCP / CLS | 2.2 s / 0.004 |
| JavaScript before first paint | 43 KB gzip (the scene and scroll libraries load after it) |
| Playwright + axe (desktop and mobile) | 16 / 16 passing |

Measured on the production build served locally, with Lighthouse 12.8.2 and headless Chrome. Re-measure after
deploying.

## Develop

Needs Node 22 or later.

```bash
npm install
npm run dev
```

## Build, test, preview

```bash
npm run check        # svelte-check and TypeScript
npm run build        # static site in build/
npm run preview      # http://localhost:4173
npx playwright test  # uses your installed Chrome; starts its own preview server on port 4174
```

`npm run capture -- review` saves screenshots of every chapter to `.captures/`.
`npm run capture -- fallback` re-renders the Static tier stills and the OG image from a running preview
(`static/fallback/0N.png` and `static/fallback/og-raw.png`; convert to WebP / PNG before committing).

## Deploy

`.github/workflows/deploy.yml` checks, builds and tests the site, then publishes `build/` to GitHub Pages on every
push to `main`. Turn on **Settings → Pages → Source: GitHub Actions** in the repository.

- Project site (`https://<owner>.github.io/<repo>/`): the workflow sets `BASE_PATH` and `VITE_SITE_URL` for you.
- Custom domain: set `BASE_PATH` to empty, `VITE_SITE_URL` to the domain, and add `static/CNAME`.

## Structure

```
src/
├── app.css                  design tokens and global styles
├── app.html
├── lib/
│   ├── config.ts            links, release facts, SEO text
│   ├── content/             sample network, port rings, findings
│   ├── components/          Hud, DevicePanel, FindingCard, Brackets
│   ├── motion/              scroll (Lenis + GSAP ScrollTrigger), scramble, audio
│   └── scene/               Stage, camera path, quality tiers, objects/*
└── routes/                  +page.svelte, robots.txt, sitemap.xml
static/                      favicon, og.png, fallback stills
tests/site.spec.ts           Playwright + axe
docs/DESIGN-SYSTEM.md        tokens, type, materials, HUD, motion rules
```

## Updating for a new LANORA release

Change `RELEASE` in `src/lib/config.ts`. Check every claim against the new README before changing copy
(see "Content rules" in `docs/DESIGN-SYSTEM.md`).

## License

GPL-3.0, like LANORA. See [LICENSE](LICENSE). Fonts: Space Grotesk, Inter and IBM Plex Mono (SIL Open Font
License), via Fontsource. Three.js (MIT), GSAP (standard no-charge license), Lenis (MIT).
