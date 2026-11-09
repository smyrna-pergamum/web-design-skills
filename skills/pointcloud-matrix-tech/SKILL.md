---
name: pointcloud-matrix-tech
description: Build a technology, data or AI product website as a dark engineering document — graphite page framed by hairline rules, sections numbered "01 WHO WE ARE", big geometric grotesk headlines, Space Mono labels, one lime accent — with three signature layers - a full-page matrix rain of falling characters in the background, a magnetic cursor that snaps to and pulls buttons, and a hero visual made of a three.js point cloud (procedural city, towers, bridge) whose points are attracted to the mouse, plus voxel and wireframe "digital twin" illustrations drawn in canvas. Use for SaaS, AI, data, digital twin, geospatial, 3D, deep-tech or developer-platform sites, or when the user asks for a "matrix" background, a magnetic mouse effect or a point-cloud hero. Produces a single HTML file (three.js from a CDN) with optional multi-language switching.
---

# Point cloud matrix tech

A technical product site that looks like an engineering drawing and feels alive: the frame is still and precise,
the data moves. The reference build is `example/index.html` (Atlasio, a fictional spatial-data platform, EN/TR).
Detailed code is in `references/components.md`; `screenshots/` shows every section on desktop, mobile and in Turkish.

If the user names a reference site, take its *style* only. Never copy its renders, product names, copy or logo.

## 1. Before designing

1. Collect the real product story: one-line promise, 3–5 technologies, products, industries with one use case each,
   reasons to choose the company, contact. Metrics only if the client can back them; otherwise label them as samples.
2. Pick the **hero structure** the point cloud should form. It should be the client's world: a skyline for city data,
   a factory, a ship, a molecule, a server rack, a terrain. The generator in the example is built from simple shapes
   (planes, boxes, arcs, lines), so any of these is a few lines.
3. Decide what the rain characters say: digits and katakana for the classic look, or the client's own vocabulary
   (`LAT LON XYZ`, SQL keywords, gene letters).

## 2. Visual DNA

| Element | Rule |
|---|---|
| Sheet | Graphite `#11161a`; content sits in a framed column (`1px rgba(255,255,255,.08)` left/right), every section split into cells by the same hairlines. Dark only. |
| Text | White headings, `#c9d6dd` soft, `#8fa9b8` muted, `#5d7180` for feature lists. |
| Accent | Lime `#c6f432` only: section numbers, primary-dark button text, active states, live readouts, voxel highlights, rain. Cyan `#5fe1e7` sparingly for data lines. |
| Display type | **Space Grotesk** 700 (hero, `letter-spacing:-.035em`) and 400 (section titles, `-.025em`); Struve is the paid original look. |
| Labels | **Space Mono** 10.5–12px uppercase for nav, eyebrows, feature lists, buttons, readouts. |
| Buttons | Square. Light (`#fff` → lime on hover) for the main action, dark (`#1b2329`, lime text, 1px line) for secondary. Mono label + `→`. |
| Section header | `01  WHO WE ARE` mono row, then a big title row closed by a hairline. |
| Imagery | Generated: point cloud (WebGL), isometric voxel field, perspective grid + wireframe volumes, UI mocks built in HTML. |

## 3. Section patterns

1. **Sticky header** – framed bar: lime monogram + lowercase wordmark, mono nav, language switch, white "Request a demo".
2. **Hero** – headline (≤ 3 lines) + muted sub top-left; full-bleed point-cloud canvas; 2–3 mono callout tags with a lime
   square and a leader line; bottom: dark CTA and a live readout (points, cursor coordinates, stream status). A left
   gradient scrim keeps the copy readable over the cloud.
3. **01 Who we are** – statement in large regular weight, a plus-shaped lime mark, two short paragraphs; right half an
   isometric voxel canvas; below, a quote row with a phone mock (scene + pins + AI guide chat) on a lime-tinted gradient.
4. **02 Technologies** – four cells: title, two-line text, three mono feature lines pinned to the bottom; a full-width
   voxel banner below.
5. **03 Products** – 2×2 cells plus a tall cell with an interactive "Render settings" panel whose sliders actually change
   the hero (point size, density), the rain opacity and the magnet strength.
6. **04 Industries** – mono tab list on the left (selected row tinted, lime dot); right a canvas twin (perspective grid +
   wireframe volumes, regenerated per industry) and the use case text.
7. **05 Why** – four numbered cells, then a metrics row with lime numbers that count up once in view.
8. **06 Contact** – headline + email on the left; a hairline form grid (labels in mono, underline inputs) on the right.
9. **Footer bar** – framed mono line with copyright and the three effect names.

## 4. Signature effects

* **Matrix rain** (`canvas#rain`, fixed, behind everything): columns of glyphs falling at random speeds; each frame paints
  a translucent graphite rect for the trail; characters within 180px of the cursor turn brighter and whiter; ~30 fps cap.
  Content sections get `rgba(17,22,26,.78)` so the rain is vivid in the hero and margins and quiet behind text.
* **Magnetic cursor**: a lime dot follows the pointer exactly; a ring follows with easing and, near a `[data-magnet]`
  element or nav link, snaps to its box (morphs to a rounded rectangle). `[data-magnet]` elements translate a fraction of
  the cursor offset toward it (strength slider). Only on `(pointer:fine)`; off with reduced motion.
* **Point-cloud hero** (three.js r128 `Points`): ~20k points from a seeded generator (ground, tower faces, antennas, arch,
  deck, cables, scan noise), colours fading with height, lime tops. Each frame: raycast the cursor onto a plane through
  the city, pull points within a radius toward it with a squared falloff (strength from the slider), add a tiny breathing
  wobble, ease every point to its target. Rotates gently and follows the pointer. Paused when off screen.
* **Voxel field**: isometric cubes on canvas with three face shades; ~12–16% lit lime with a glow; occasional cyan
  circuit lines.
* **Twin view**: perspective grid floor + wireframe boxes; the first box is lime with an ID label; seed changes per tab.

## 5. Build rules

* Standalone HTML, doctype/charset/viewport; three.js from cdnjs before the inline script; fonts from Google Fonts.
* Everything readable without JS or WebGL: canvases are decoration (`aria-hidden`), the hero copy and all sections are HTML.
* Performance: cap device pixel ratio (1.5–1.75), rain at ~30 fps, point updates only while the hero is visible,
  canvases redrawn on resize with a debounce.
* `prefers-reduced-motion`: rain painted once as a still texture, no cursor magnet, point cloud renders one frame,
  counters jump to their value.
* Accessibility: tabs are `role="tab"` with arrow-key support; sliders have labels and `<output>`; visible lime focus ring.
* Mobile: nav links hide, readout and callout tags hide, cells stack, hero cloud centres under the copy.

## 6. Writing the copy

* Plain and precise, like product documentation: "Turn places into living data." Short paragraphs, no hype words.
* Sentence case for headings; uppercase only in mono labels.
* Mark sample metrics and fictional products. Translate JS-written text (industry panels) inside the language function.

## 7. Finish checklist

- [ ] The point cloud forms the client's world, not a generic blob; cursor attraction visible but subtle.
- [ ] Rain never makes body text hard to read (check every section on desktop and mobile).
- [ ] Magnet and cursor disabled on touch and with reduced motion.
- [ ] Sliders in the settings panel change something real.
- [ ] Metrics are real or labelled; no third-party logos or renders.
- [ ] Every language switch leaves no source-language text.
- [ ] Screenshots at 1440×900 and 390×844 (`node scripts/screenshots.mjs example/index.html screenshots`; the script moves a
      virtual mouse so the magnet shows, and renders WebGL with SwiftShader).
