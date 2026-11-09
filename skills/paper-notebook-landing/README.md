# paper-notebook-landing

> Part of the [design-skills](../../README.md) library.

An AI skill (for Claude Code / Claude Agent Skills) that designs landing pages in a warm **paper-notebook style**:
cream paper, chunky soft serif headlines, handwritten marker notes, yellow sticky notes,
name-label notebooks, illustrated scenes with roman-numeral panels, doodles, lined paper, a comic strip and a giant orange footer.

It ships with a complete reference build: the homepage of **Atlasio**, a fictional study-in-Germany platform, in Turkish, English and German.

![Hero](screenshots/01-hero.png)

| Notebook travels down… | …and opens | Four-stage journey |
|---|---|---|
| ![](screenshots/02-notebook-travel.png) | ![](screenshots/04-notebook-open.png) | ![](screenshots/07-scene-sky-four-stages.png) |
| **Sticky notes** | **Comic strip** | **Giant footer** |
| ![](screenshots/05-sticky-notes.png) | ![](screenshots/12-journey-comic.png) | ![](screenshots/13-faq-footer.png) |

More in [`screenshots/`](screenshots) (desktop 1440×900, mobile 390×844, TR/EN/DE).

## What's inside

```
paper-notebook-landing/
├── SKILL.md                    # the skill: style rules, section patterns, interactions, checklist
├── references/components.md    # copy-ready HTML/CSS/JS for every component
├── example/index.html          # full reference page (single file, no build step)
├── screenshots/*.png           # every section, desktop + mobile + languages
└── scripts/screenshots.mjs     # re-create the screenshots with headless Chrome (no npm install)
```

## Features of the example page

- **Scroll-driven notebook** – the notebook in the hero travels down, straightens and grows as you scroll, then its cover opens.
  The cover recreates a printed "Passport to your future" booklet cover, so web and print match.
- **Three languages** – TR / EN / DE switch in the top-right corner; the choice is remembered.
- **Auto-sizing comic speech bubbles** – bubbles are drawn around the measured text, so they fit in every language.
- **Interactive panels** – roman-numeral feature lists update a device mock (e.g. the 4 stages Plan → Prepare → Apply → Arrive).
- Pure inline SVG/CSS illustrations, no image files; Google Fonts only (Fraunces, Geist, Caveat).
- Respects `prefers-reduced-motion`; responsive down to 390px.

## Install the skill

As a Claude Code plugin (recommended):

```bash
/plugin marketplace add smyrna-pergamum/design-skills
/plugin install paper-notebook-landing@design-skills
```

Or copy just this folder into `~/.claude/skills/paper-notebook-landing/` (all projects) or
`.claude/skills/paper-notebook-landing/` (one project).

Then ask, for example:

> Redesign https://example.com in the paper-notebook style. Keep all real content, add TR/EN switching.

> Make a paper-notebook landing page for our language school using this brochure (PDF attached).

## View the example

Live: **https://smyrna-pergamum.github.io/design-skills/skills/paper-notebook-landing/example/**

Or open `example/index.html` locally in any browser.

## Regenerate the screenshots

Requires Node 22+ and Chrome/Chromium. Run from this folder:

```bash
node scripts/screenshots.mjs example/index.html screenshots
```

Set `CHROME=/path/to/browser` if Chrome is not in the default location.

## Credits and disclaimer

- All illustrations are original inline SVG/CSS; no third-party logos, illustrations or photos are included.
- **Atlasio** is a fictional brand. Names, contact details (`atlasio.example`) and reviews in the example are placeholders.
- Fonts: [Fraunces](https://fonts.google.com/specimen/Fraunces), [Geist](https://fonts.google.com/specimen/Geist) and
  [Caveat](https://fonts.google.com/specimen/Caveat) are licensed under the SIL Open Font License and loaded from Google Fonts.

## License

Code and documentation: [MIT](../../LICENSE).

---

### Türkçe özet

Bu klasör, sıcak "kâğıt defter" tarzında açılış sayfaları tasarlayan bir yapay zekâ skill'idir.
`SKILL.md` stil kurallarını, bölüm kalıplarını ve kontrol listesini; `references/components.md` hazır kod parçalarını;
`example/index.html` üç dilli (TR/EN/DE) kurgusal Atlasio örnek sitesini; `screenshots/` ise tüm bölümlerin görüntülerini içerir.
Kurulum: `/plugin marketplace add smyrna-pergamum/design-skills` ve `/plugin install paper-notebook-landing@design-skills`,
ya da bu klasörü `~/.claude/skills/paper-notebook-landing` altına kopyalayın.
