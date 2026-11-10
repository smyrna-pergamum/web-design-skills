---
name: network-journey-webgl
description: Build an immersive, scroll-driven 3D product website in the igloo.inc tradition — one continuous Three.js world behind real HTML chapters, a camera that flies through it on a single scroll value, HUD corners with mono labels, leader-line tags pinned to 3D objects, a particle cloud that morphs into line drawings, and forest-green + lime on a near-black night — with production engineering - SvelteKit static build, quality tiers (Full / Lite / Mobile / Static with pre-rendered stills), lazy-loaded scene and scroll libraries, self-hosted fonts, a strict CSP, no third-party requests, SEO files, Playwright + axe tests and a GitHub Pages workflow. Use for network, security, infrastructure, data or developer tools, or when the user asks for an experimental / immersive / "igloo-like" 3D site, a scroll camera journey, a network-sphere hero or a WebGL site that still scores well on Lighthouse. Produces a SvelteKit project and its static build.
---

# Network journey WebGL

An experimental product site that feels like entering a digital installation, but loads like a fast document.
The visitor scrolls into the product's world (here: a home network), stops at one object per chapter, and leaves
with real, checkable facts. Structure and HUD follow igloo.inc's single-scene journey; colours, objects and copy
belong to the product.

The reference build is the real website for **[LANORA](https://github.com/smyrna-pergamum/Lanora)**, a free,
open-source network scanner for Windows: `example/` is the static build (open `example/index.html` through a web
server), `source/` the SvelteKit project. Detailed code is in `references/components.md`; `screenshots/` shows every
chapter on desktop and mobile.

If the user names a reference site, take its *structure and rhythm* only. Never copy its renders, models, copy or logo.

## 1. Before designing

1. Read the product's own sources: README, release notes, rule or data files, the app's colour tokens and icon. Every
   claim must map to one of them. Watch for absolute phrases ("100% local", "finds all…") that the code does not
   support, and write the exact version instead.
2. Turn the product's workflow into a camera route: one chapter per step the user takes (discover → inspect →
   understand → report), plus an opening object and a closing "boundary" or "call to action" object.
3. Build sample data from what the product really shows (a screenshot, a demo dataset) and label it "Sample data".

## 2. Visual DNA

| Element | Rule |
|---|---|
| Ground | Near-black with a hue: `#080b09` page and WebGL clear colour, `#0b140f` exponential fog. |
| Brand colours | The app's own: forest `#173c33`, green `#245b48`, primary `#2d7659`, lime `#c6eea3` for accents, buttons, HUD text and focus. |
| Signal | One acid colour (`#a3ff12`) only for live states: selected node, open port, pulse. Under 3% of the screen. |
| Severity | Warning `#dc8b40`, critical `#ff4d4d`, always with a word and an icon. A neutral fact (open port) is never red. |
| Display | Space Grotesk 700, uppercase, `letter-spacing: -0.04em`, line-height 0.9, five words at most. |
| Body / labels | Inter for text, IBM Plex Mono 11–13 px uppercase for every technical label, address and HUD line. |
| 3D materials | Flat-shaded glass (opacity ~0.4) with lime edge lines; additive light lines; soft round point sprites. No bloom, no constant flicker. |
| HUD | Four corners: logo + context line, navigation, chapter counter + progress, and a bottom-centre hint / Sound / Reduce motion row. |
| Tags | 1 px leader line from the object to a mono block; buttons when they open details; hidden over the text column, the header and the HUD. |
| Selector | igloo-style bracket buttons `[ PDF ]  XLSX  JSON` for one-of-many choices; the 3D object reacts to the choice. |

## 3. Chapter patterns (LANORA)

1. **Hero** – a fibonacci sphere of nodes with nearest-neighbour edges around a glass core; manifesto top right;
   three tagged nodes; the shell opens as the hero scrolls.
2. **Discovery** – the camera is inside; the gateway pulses; devices appear in discovery order with lines to it; a
   live counter (addresses probed, devices found); every device is also a plain HTML button list.
3. **Devices** – glass crystals on a rail (igloo's portfolio crystals) with full HUD labels.
4. **Ports** – the device at the centre, ports as tilted orbiting rings: open = signal line, open|filtered = dashed,
   closed = grey; legend and "an open port is not automatically a problem".
5. **Security** – finding cards in the product's own four parts (observed / means / do / verify), a score ring, the
   SMB marker turns warning orange.
6. **Reports** – the particle cloud becomes a PDF page, a spreadsheet grid or a terminal, chosen with the selector; a
   mono block shows the real CLI command.
7. **Local-first** – the camera pulls far back; one wireframe dome labelled `127.0.0.1` contains everything.
8. **Explore** – particles form the product's logo on a ring platform; the selector switches GitHub / Docs /
   Releases / Issues (shape and primary button change); footer.

## 4. Signature interactions

* **One scroll value drives the camera.** Each chapter has [start position, start target, end position, end
  target]. The first 22% of a chapter flies from the previous end to this start (with a scanline overlay); the rest
  eases start → end. GSAP ScrollTrigger reports chapter + progress; Lenis smooths the scroll. Reversible by design.
* **HTML tags pinned to 3D points**, projected every frame, culled when off screen or over text.
* **Particle morph**: shapes are drawn on a 256² canvas, sampled into N points, and the cloud eases toward the active
  shape; shapes are sampled lazily on first use.
* **Scramble** on mono eyebrows when their chapter becomes current. **Sound** off by default.

## 5. Engineering rules (the part that makes it fast)

* SvelteKit + adapter-static, prerendered. All headings, text, links and controls are HTML; the canvas is
  `aria-hidden`.
* First paint needs no WebGL: three.js, the scene, GSAP and Lenis are dynamic imports after `requestIdleCallback`.
  Target < 60 KB gzip of JavaScript before first paint (LANORA: 43 KB).
* Build the scene one object per task (`await setTimeout(0)` between builders) and `renderer.compileAsync()` before the
  first frame, so no long task blocks input on phones.
* Quality tiers chosen once: Full (≥ 1200 px, ≥ 8 GB), Lite, Mobile (< 768 px, fewer nodes/particles, DPR 1.5) and
  Static (no WebGL2, reduced motion, Save-Data, or the HUD switch) with stills rendered from the real scene
  (`scripts/capture.mjs fallback`). Drop DPR to 1 when frames stay over 25 ms.
* Fonts via Fontsource (same origin). CSP as a meta tag with SvelteKit's hash mode; allow only the route announcer's
  inline style by hash (`'unsafe-hashes'`). No third-party requests, cookies or analytics.
* `appDir: 'app'` (no underscore) so Jekyll-based GitHub Pages publishes it; `BASE_PATH` and `VITE_SITE_URL` for the
  sub-path, canonical, sitemap and OG image.
* Tests: Playwright with the installed Chrome (SwiftShader for WebGL) + axe on the Static tier (the WebGL loop starves
  axe under software rendering); no horizontal scroll at 360 px; safe external links; no third-party hosts; keyboard
  device panel; reduced motion. Restart the preview server after every build: a stale `vite preview` serves old
  hashes and silently breaks hydration.

## 6. Writing the copy

* Headlines: short uppercase statements ("SEE WHAT IS EXPOSED."). Body: one or two plain sentences from the README.
* Quote the product's own rule texts for findings; name formats and commands exactly.
* Keep the honest notes next to the actions: unsigned builds, "only scan networks you own or are authorized to test".

## 7. Finish checklist

- [ ] Every claim maps to the product's README / release notes / data; sample data is labelled.
- [ ] Scroll forward and back stays in sync; fast scrolling never stalls.
- [ ] Static tier shows stills and full content; the HUD switch toggles it.
- [ ] Lighthouse mobile ≥ 90 performance, ≥ 95 accessibility and SEO, measured on the production build.
- [ ] Playwright + axe pass on desktop and mobile; no CSP violations in the console.
- [ ] No horizontal scroll at 360 px; tags never cover the text column.
- [ ] Screenshots at 1440×900 and 390×844 (`node scripts/capture.mjs review <url> screenshots`).
