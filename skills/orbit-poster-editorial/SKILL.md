---
name: orbit-poster-editorial
description: Build an editorial "orbit" homepage on deep ink and warm paper — giant tight sans headlines with one outlined line and one orange line that drift against the mouse, a CSS planet in tilted 3D orbits surrounded by floating paper cards (a destination ticket that cycles, a passport stamp card, a small photo print) that parallax with the cursor, a particle network canvas that reacts to the pointer, a tilted orange ticker, poster cards where real photography is blended in grayscale with multiply under huge letters and a coloured sun disc (colour returns on hover), a tabbed "route console" with a giant number in an orbit ring, support cards with blended photos and cursor light, and a full-bleed orange final call. Use for travel brands, trip planners, study-abroad or relocation agencies, tourism boards, culture and event sites, or when the user wants an editorial, poster-like, mouse-reactive homepage that mixes graphic design with their own photographs. Produces one HTML file plus an assets folder of compressed photos, no frameworks.
---

# Orbit poster editorial

A homepage that looks like a printed travel poster series came alive. Ink-dark and paper-light sections alternate;
type is huge and tight; one orange accent carries every action. The hero is a small universe — a planet, orbits and
paper cards — that leans toward the mouse. Further down, real photographs are not placed in boxes but **printed into
the posters**: grayscale, multiplied onto the paper colour, under giant letters, until the visitor hovers and colour
comes back.

The reference build is `example/index.html` (Atlasio, a fictional travel brand, English). Detailed code is in
`references/components.md`; `screenshots/` shows every section on desktop and mobile.

## 1. Before designing

1. **Collect 6–8 photographs** with people in motion (stations, boards, roads, windows). Assign each one a single
   job: one small print in the hero, one per poster state, one per support card. Never use the same photo twice.
2. **Check every photo for third-party logos and screens** (airport advertising, brand signs) and crop them out.
3. **Pick four "possibilities"** for the poster switcher (ways to travel, cities, programmes, seasons) and four
   steps for the route console. Each needs a one-word poster title, a two-line headline, one sentence, and one
   concrete example ("Paris → Vienna by night train").
4. Compress photos (see §5). The example's seven photos are ~750 KB together.

## 2. Visual DNA

| Element | Rule |
|---|---|
| Ink | `#101b22` page; text paper `#edece4`; muted `#9ca6a8`; hairlines `#ffffff20`. |
| Paper | `#edece4` light sections with poster tints: sage `#cbd4b2`, clay `#d8c4b5`, mist `#c0cfce`, lilac `#c9c2d3`; support cards `#dbe1cd` and `#e5d5c6`. |
| Accent | One orange `#ff6c3a` (planet, sun discs, ticker, active tab, final section). A pale lime `#c6d9ab`/`#c2d3a3` only for the full stop in the headline and the route number. |
| Type | **DM Sans** 800–1000 for display (letter-spacing `-.065` to `-.09em`, line-height `.8–1`); 400–700 for copy. **IBM Plex Mono** 6–9px uppercase for every label, coordinate and eyebrow. |
| Headline | Three stacked lines: solid, **outlined** (`-webkit-text-stroke:1px`), orange; each line moves a different amount with the mouse. |
| Photos | Inside posters and support cards: `grayscale(1) contrast(1.1)` + `mix-blend-mode:multiply` on a tinted, isolated card; hover restores colour and scales 1.04. Small prints (hero) stay in colour with a paper border. |
| Shapes | Square corners everywhere except planet, sun discs, orbits, pills in the switcher. |
| Cursor | A 30px ring with a dot, `mix-blend-mode:difference`; grows over links. Magnetic buttons drift toward the pointer. |

## 3. Section patterns

1. **Header** – wordmark, a mono "edition" link, three anchors, a motion toggle (`MOTION ON/OFF`), a bordered CTA,
   burger under 650px. A 2px orange reading-progress bar sits on top of the page.
2. **Hero** – mono meta line, the three-line headline, an asterisk star, two lines of copy, an underlined link, small
   print. Right: the **orbit universe** (planet with latitude/longitude rings and a two-letter word, three orbits,
   satellites, rotated mono labels) and three floating cards: destination ticket (click cycles the four
   possibilities), passport stamp card, photo print. Bottom bar: scroll link, "move the mouse" hint, volume number.
3. **Ticker** – full-width orange band rotated −1.6°, huge words separated by star glyphs.
4. **Possibilities** – headline with a grey middle phrase, pill switcher, then a two-column board: the **poster**
   (coordinate line, blended photo, sun disc, giant word, bottom label) and the details (big number, eyebrow,
   headline, copy, "a route to start with", ink button, mono disclaimer). Poster tilts in 3D with the mouse.
5. **Route console** – dark section, headline with an orange phrase, four tabs as a bordered row (active tab orange),
   panel with a giant lime number inside a slowly rotating orbit ellipse and the step copy; an "unlock" line below.
6. **Support** – big rotating star + two-tone headline; two cards (self-service and paid advisor) each with a
   blended photo, a cursor-following light and an underlined link; a "learn a language" line with one orange word.
7. **Final call** – full orange section with a grid, a two-line giant link ("So, where next?") with an arrow that
   moves on hover, a short promise, an ink button and a mono route line.
8. **Footer** – wordmark, a two-line sentence, links; a mono bottom row with an honest note when the brand is fictional.

## 4. Signature effects

* **Mouse field**: on `pointermove` inside the hero set `--px`/`--py` (−1…1) on `:root`; headline lines, floating
  cards and the 3D orbit system read them in `translate3d`/`rotateX/Y` with different multipliers, eased by a
  `.6s cubic-bezier(.16,1,.3,1)` transition. A live `X 050 / Y 050` coordinate readout updates with it.
* **Particle network**: a canvas of 65 drifting points (25 on phones) linked when closer than 95px; points are
  pushed away within 120px of the pointer and orange lines connect to the pointer within 180px. Runs only while the
  hero is visible and motion is on.
* **Blended photo posters**: the photo is an absolutely positioned `<img>` at `z-index:-2` inside an `isolation:isolate`
  poster; grayscale + multiply prints it into the poster colour, the sun disc multiplies on top, the giant word sits
  above. Switching possibility fades the old photo out (`.swap`), swaps `src`, fades in on `load`, and changes the
  poster tint and sun colour through a `data-theme` attribute.
* **Tilt cards + cursor light**: posters and support cards rotate up to ~7–9° toward the pointer and expose
  `--cx`/`--cy` for a radial highlight.
* **Accessible tabs**: route tabs use `role="tablist"`, roving `tabindex`, arrow/Home/End keys.
* **Motion toggle**: one button pauses every animation and zeroes the mouse field; `prefers-reduced-motion` and
  coarse pointers switch the same things off automatically.

## 5. Build rules

* Photos: `ffmpeg -i in.jpg -vf scale=1400:-2 -q:v 5 out.jpg` (hero print ~900px wide). Crop logos and screens:
  `-vf "crop=w:h:x:y,scale=1100:-2"`. Keep each under ~170 KB.
* Standalone HTML with doctype, charset and viewport; fonts from Google Fonts; inline SVG symbols for arrows and
  stars; no other dependencies.
* Every photo has a real `alt` describing the scene, except poster photos, which are decorative (`alt=""`,
  `aria-hidden`) because the poster word and details carry the meaning.
* Mobile: hero stacks, the universe scales to ~66%, cards shrink with their own transforms, poster words drop to
  `22vw` with `word-break:normal`, tabs become a 2×2 grid, cursor ring and tilt are off.
* No horizontal scroll at 390px; skip link; visible `:focus-visible` outline.

## 6. Writing the copy

* Short declaratives in threes: "Come with a dream. Leave with a plan." "Find the place. Draw your own route."
* Mono labels speak like a printed edition: `01 / POSSIBILITIES`, `MODE 02 / AIR · FAR AWAY BY TOMORROW`.
* Examples must look real but be labelled as examples; legal or entry rules always point to the official source.

## 7. Finish checklist

- [ ] Each photo is used once, credited, cropped free of third-party logos and compressed.
- [ ] Hero leans with the mouse; destination card and "another possibility" cycle the four states in sync with the poster.
- [ ] Poster photo swaps without a flash of the old image; colour returns on hover.
- [ ] Route tabs work with the keyboard.
- [ ] Motion toggle, reduced motion and touch all stop the mouse field, canvas, ticker and tilt.
- [ ] 390px: no word split inside poster titles, no horizontal scroll, no console errors.
- [ ] Screenshots regenerated: `node scripts/screenshots.mjs example screenshots`.
