---
name: aperture-topology-story
description: Build a developer-tool, data, network or OSINT product website as a dark engineering grid with one bright idea inside it — a glowing SVG node topology hero (circular icon nodes, mono labels, dashed curved links, packets travelling out and back), a huge glowing condensed display headline, then a pinned scroll story where a circular aperture opens from the central node onto a light paper-grid workspace in which white cards, chips and connectors move between nodes in four phases, and the aperture closes back to dark on a glowing closing line. Ends with calm technical sections - a mono integration strip, a tab-switched architecture diagram with real screenshots, puzzle-tab module blocks, a searchable and filterable catalog table, an honest does / never-does scope split, a tabbed terminal with copy, and link-card footer. Use when the user asks for a site in the style of a distributed-systems or infra landing page, a "scroll story that opens into a light workspace", a glowing network/topology hero, or wants a tool's real workflow (input → sources → results → report) told step by step. Produces one self-contained HTML file (no frameworks, Google Fonts only) with EN/TR switching, reduced-motion static frames and a narrow-screen board layout.
---

# Aperture topology story

A product page that behaves like a quiet engineering document with one cinematic move: the reader scrolls *into* a node
of the network and the dark page opens like a camera aperture onto a bright paper workspace where the product's real
workflow is acted out with cards. It suits tools whose value is a pipeline you can show (inputs → sources/peers →
results → output): inference meshes, OSINT and research tools, data pipelines, CI, sync engines, package registries.
It does not suit lifestyle or fashion brands.

The reference build is `example/index.html`: the real website for **OSINT-Book** (a passive, source-first OSINT
notebook for Android and Windows), EN/TR, in the app's own colours. Detailed code is in `references/components.md`;
`screenshots/` shows every section, every story phase, Turkish, reduced motion and mobile.

If the user names a reference site, take its *style* only. Never copy its renders, product names, copy, logo or data.

## 1. Before designing

1. **Read the product's sources first**: README, user guide, privacy/threat model, API or source registry, release
   notes, CHANGELOG. Every claim on the page maps to one of them. Copy numbers exactly (versions, file names, sizes,
   SHA-256, ports). If two sources disagree (e.g. "22 modules" vs a 20-row table), show what the table proves.
2. **Take the colours from the product itself**: launcher icon, Android `colors.xml` / Compose `lightColorScheme` and
   `darkColorScheme`, web CSS custom properties. Map the app's *dark* scheme to the dark ground and its *light* scheme
   to the aperture workspace — the page then literally switches from one theme of the app to the other.
3. **Find the story**: write the product's workflow as four verbs (OSINT-Book: target → findings → analysis → report;
   an inference mesh: model → slice → place → serve). One phase per verb. Each phase needs a heading of ≤ 6 words.
4. Sample data in the story must be obviously sample: `example.org`, documentation IPs (`192.0.2.x`, `203.0.113.x`),
   a "sample data" chip on every card. Never invent statistics, user counts, benchmarks or testimonials.
5. Use real app screenshots (WebP, ~800px wide) for the architecture section.

## 2. Visual DNA

| Element | Rule |
|---|---|
| Dark ground | Near-black, slightly tinted with the brand: `--bg-2` (page) / `--bg` / `--surface` / `--surface-2` / `--surface-3`. A 36px grid of 1px lines at ~7% of the light ink over the whole body. Radial glow pools (brand colour at ~13%, second signal at ~6%) behind the hero and stage. |
| Light workspace | The app's light background (`--paper`) with a 34px grid at ~5.5% ink and a soft radial wash of the brand container colour in the middle. Only inside the aperture. |
| Ink | Dark: `--fg` / `--fg-2` / `--muted` (muted ≥ 4.5:1 on the ground). Light: `--ink` / `--ink-2` / `--ink-muted`. |
| Brand | The product colour for the target node, aperture origin, "sample data" chips, Attention states, active rail item, hover borders. On dark use the lighter tone (`--brand-2`), on paper the deeper tone (`--brand-ink`). |
| Signals | Two more hues, one meaning each: teal = free / ok / finding returned; gold = needs a key / optional / missing. Outbound packets use brand, returning packets teal. Severity is always colour + icon + word. |
| Display | **Rajdhani 700**, line-height .84–.98, letter-spacing 0, sentence case. Hero 2.6–5.2rem with a four-layer glow: `0 0 2px #fff·86%, 0 0 18px brand-2·36%, 0 0 48px teal·14%, 0 18px 52px #000·60%`. On paper the same face with `0 1px #fff, 0 14px 34px ink·12%`. |
| Body / UI | **Geist** 400–700, 14–17px. |
| Labels | **Geist Mono** 10–13px: node labels, sub-labels, chips, table quotas, terminal, rail, eyebrows (`01 / editions`, uppercase + .14em only here). |
| Cards | Dark panels: 16px radius, 1px `--line-2`, vertical gradient surface. Paper cards: white, 14px radius, 1px warm line, `0 14px 34px -14px` shadow. Chips are pills (20px tall). Finding rows have a 6×18px gradient handle on the left. |
| Buttons | Primary = near-white fill with dark ink (8px radius, 40px). Ghost = 1px line that turns brand-2 on hover. Pill buttons in the nav carry a mono suffix (`· web-v0.2.2`). |
| Icons | 24-grid single-stroke 1.7px line icons in an inline `<symbol>` sprite; the same sprite is `<use>`d inside the SVG graph. |

## 3. Section patterns

1. **Sticky nav** (64px, translucent dark + 16px blur, bottom hairline) – icon + two-tone wordmark, small links, GitHub
   pill with version, EN/TR toggle, primary button.
2. **Hero** – full-width SVG topology (viewBox 1200×520; target node in the middle with halo + ring; 5–7 source nodes
   on curved dashed edges, each with a mono label and a mono sub-label that states access: `key-free`, `your key`).
   The display headline sits over the lower-left of the graph. Under it: a one-sentence lead and a three-column row –
   "run it" (a command chip with copy + primary/ghost download buttons + "follow …" link), "what it is" (bold first
   sentence + facts row with coloured dots), and a small brand badge.
3. **Aperture story** (pinned, ~640vh) – see §4.
4. **Integration strip** – mono uppercase label left, a wrapped list of dotted names right, hairlines above and below.
5. **Architecture switcher** – section head (big display title left, paragraph right), then one dark panel: a tablist
   (filled pill = selected), a text column (title, one paragraph, ✓ list) and a diagram of HTML nodes over an SVG of
   animated dashed connectors (brand = what leaves, teal = what returns, gold = optional), then a horizontal strip of
   real screenshots with mono captions, then a legend footer.
6. **Module blocks** – blocks with two little "puzzle tabs" on the top edge: inputs row → a side / centre / side row
   (centre block bigger, brand-tinted, display font) → a row of 6 outputs; one mono note under it.
7. **Catalog table** – search field + mono-labelled selects, a table with name + mono id, type pills, an access
   column with coloured dots, a mono quota column, notes; footer with "Showing x–y of n · source file" and a pager.
   A `<details>` "left out, on purpose" list under it.
8. **Scope split** – two dark panels, "What it does" (teal square) / "What it never does" (red square), each item a
   bold lead-in plus one sentence, left hairline.
9. **Install** – two download cards (icon tile, name, mono file name · size), then a terminal window (traffic lights,
   mono tabs, `COPY` that copies only the commands, coloured prompt / command / flags / comments / output) with a
   status footer (glowing live dot), then an honest gold "Early releases" note.
10. **Footer** – about text + language pills, two link-card lists (rows with arrows; ↗ external, → documents), bottom row
    with wordmark, version chip and attribution line.

## 4. Signature interaction: the aperture story

One `section.story` (height ≈ 640vh) holds a `position:sticky; top:0; height:100svh` stage with two layers:

* **Dark layer** – the same topology graph again, a mono hint (`scroll · follow one target`), and the closing line.
* **Light layer** – `clip-path: circle(R at X Y)` where X/Y is the *screen position of the target node* (measured with
  `getBoundingClientRect`). Inside: four stacked headings (only one `.on`), a logical **board** (1120×560 wide,
  360×640 narrow) scaled to fit, and a mono phase rail.

A single progress value `p = -rect.top / (story.offsetHeight - innerHeight)` drives everything; every element has
keyframes `[p, {x, y, s, o}]` interpolated with ease-in-out-cubic and applied as `translate() scale()` + `opacity`.
Scrolling back rewinds exactly.

| p | Phase | What moves |
|---|---|---|
| .015 → .10 | Aperture opens | R grows from 0 to the farthest corner; hint fades. Then `clip-path:none`. |
| .00 → .33 | 1 · input | The input card rises in; its checklist rows tick one by one (`p > .13 + i·.026`); key-gated rows stay unticked. |
| .31 → .56 | 2 · results | Input card fades; the "notebook" card takes its place; six source cards appear around it; one chip per source flies from its card into a slot in the notebook (`st = .37 + i·.024`, lands `st + .04`). The gap chip is dashed. |
| .56 → .79 | 3 · interpretation | Source cards shrink into dots; the notebook slides left (chips follow its transform); three observation cards slide in from the right; dashed connectors draw from the cited chip to each card; a "no verdict" pill appears. |
| .79 → .92 | 4 · output | Everything folds into one report card; a commit card rises under it and its six route dots light up. |
| .915 → .975 | Aperture closes | R shrinks to 0 back into the node; the glowing closing line fades in on the dark layer. |

* Only `transform`, `opacity`, `clip-path` and SVG attributes change while scrolling (one rAF-throttled handler).
* Graph packets run in a rAF loop only while a graph is on screen, never with reduced motion or a hidden tab.
* **Narrow screens (< 760px):** a second board layout (sources as a 3×2 pill grid on top, notebook scaled to .6 in
  phase 3, observations stacked, connectors hidden). Same timeline.
* **Reduced motion** (or `?motion=reduce` for review): no pin, no aperture; the story renders as four static paper
  frames (the board at p = .30, .55, .78, 1) with their headings.
* The board is `aria-hidden`; an `sr-only` ordered list tells the same four steps.

## 5. Build rules

* One standalone `index.html`: doctype, charset, viewport, `color-scheme: dark`, theme-color; inline CSS and JS; Google
  Fonts (Rajdhani, Geist, Geist Mono) only; images next to the page as WebP; icons as an inline SVG sprite.
* Tokens on `:root`; every colour of the page comes from them (§2). Name them after roles, keep the product's hex values.
* i18n: English lives in the HTML (`data-i18n` keys are read once as the English source); other languages in a JS
  dictionary; strings built by JS use `T({en, tr})`. Persist the choice in `localStorage` inside try/catch. Translate
  eyebrows too (uppercase + Turkish locale turns "install" into "İNSTALL").
* Accessibility: AA contrast on both grounds, visible focus ring (brand-2), skip link, tabs with `role=tab`,
  `aria-selected`, roving tabindex and arrow keys, real `<table>` and `<details>`, copy buttons with labels.
* Responsive: ≥1060px full layout; <1060px hero side badge hidden, AI grid stacks, editions stack; <760px one column,
  graph viewBox cropped (`150 40 900 480`) with bigger labels and no sub-labels, narrow story board, diagram nodes
  without sub-lines. No horizontal scroll at 360px; check `grid` children have `min-width:0`.
* Escape `<` and `>` in any data string you render with `innerHTML` (`http://&lt;server-ip&gt;`).

## 6. Writing the copy

* Headings are two short lines that state a property, not a promise: "Every finding keeps its source." "Two editions.
  One file format." "AI that reads findings. Never rewrites them."
* Paragraphs: one or two plain sentences with the concrete nouns (ports, formats, algorithms, file names).
* Limits get the same weight as features ("What it never does", "Early releases", "left out, on purpose").
* Mono labels are lowercase and terse (`key-free`, `your key`, `target · sample`, `sha-256 3f9a…`).

## 7. Finish checklist

- [ ] Every claim, number, file name and hash matches the product's own files and current release.
- [ ] Colour tokens come from the product (icon + light/dark schemes); severity never by colour alone.
- [ ] Story is in sync both ways, aperture opens from and closes into the node, nothing overlaps at p = .27/.5/.75/.9.
- [ ] Narrow layout and reduced-motion frames both read correctly; packets stop off-screen.
- [ ] Tabs, pager, search, filters and copy buttons work with keyboard; focus visible.
- [ ] EN/TR switch re-renders board, diagram, table, terminal and eyebrows.
- [ ] No horizontal scroll at 360/390px; no console errors.
- [ ] Screenshots at 1440×900 and 390×844: `node scripts/screenshots.mjs example/index.html screenshots`.
