---
name: portal-webgl-studio
description: Build a site for a creative studio, agency or tech brand as an immersive "interface" — a full-screen WebGL portal (glowing ring, light arms, ASCII disc, particles streaming in) behind small monospace UI, a slash-scramble preloader, film grain and a teal light leak, a 3D floating glass project gallery with "-> category" filters and "<< project >>" pager, an "ask me anything" terminal, an optional ambient sound toggle and huge thin uppercase mono headlines. Use when the user wants an experimental, futuristic, game-like or "WebGL / three.js" website for a digital studio, creative agency, games or XR company, music or tech launch. Produces a single HTML file (three.js from a CDN) with a CSS fallback when WebGL is missing, and optional multi-language switching.
---

# Portal WebGL studio

A site that behaves like an interface rather than a brochure: the screen is a lens into a living 3D scene, and the
content arrives as quiet monospace text around it. It suits studios and brands that sell *experiences*.
The reference build is `example/index.html` (Atlasio, a fictional immersive digital studio, EN/TR).
Detailed code is in `references/components.md`; `screenshots/` shows every section on desktop, mobile and in Turkish.

If the user names a reference site, take its *style* only. Never copy its 3D assets, project names, copy or sound.

## 1. Before designing

1. Collect the real content: what the studio makes (categories), 5–10 projects with one-line descriptions and the client's
   permission to show them, process, offices, contact. Projects without approval become clearly fictional samples.
2. Agree on the **one** scene metaphor (portal, planet, monolith, swarm). Everything else stays minimal around it.
3. Check the audience's devices. The scene must run on a mid-range phone; plan a lighter mobile budget from the start.

## 2. Visual DNA

| Element | Rule |
|---|---|
| Stage | Near-black blue `#05070b`, never pure black; a teal light leak top-left and a faint violet one bottom-right. Dark only. |
| Glow | One glow colour, teal `#3fd0c9` (ring, arms, links, active states); one accent, violet `#b49cff` (filters, questions, numbers). Magenta `#ff5fae` only inside artwork. |
| Type | One monospace family for everything (**Geist Mono**; JetBrains Mono as fallback). Headlines 300 weight, uppercase, `line-height:.92–1`, up to 128px. UI 11–13px uppercase with `letter-spacing:.14–.32em`. |
| Texture | Animated film grain (generated noise tile, ~7% opacity) over everything; ASCII patterns of `/`, `0`, `1` as decoration. |
| Shapes | Pills for buttons and chips, 18px-radius glass panels (`rgba(255,255,255,.045)`, 1px line, `backdrop-filter:blur`). |
| UI placement | Corners only: brand top-left, nav + sound + language top-right, coordinates/FPS bottom-right, credit/track bottom. |
| Motion | Continuous but slow (rotation, sway, particles). Interaction adds parallax and 3D transitions, never bounces. |

## 3. Section patterns

1. **Preloader** – black screen, a block of scrambling slashes and `/0 → /100` counter; fades out in ~1.2s.
   Skipped with reduced motion.
2. **Hero = the scene** – full-screen fixed WebGL canvas: glowing torus ring, soft halo, an ASCII disc inside the ring with
   `>>>`, 16 light arms around it, particles flowing into the ring, mouse parallax. Bottom-left copy: kicker, 3–4 line
   thin uppercase headline, one sentence, pill "`>>> Enter`". The portal moves right on desktop, up on phones, and recedes
   and dims as the user scrolls.
3. **Work gallery** – left: "What are you looking for?" + `-> Category` filter buttons; centre: 3D coverflow of glass
   panels with generative art and the project title; bottom: `<< 1. Project >>` pager. Arrows, swipe, keys, click on a
   side panel.
4. **Capabilities** – numbered list `/01…/05`, title + one line each, a faint teal sweep on hover.
5. **Process** – four cells in a 1px grid, each ending with a line of ASCII.
6. **Ask me anything** – glass terminal: log (`>` question in violet, `//` answer), pill input, suggestion chips, and an
   honest note if answers are canned. Wire it to a real model only with a server-side key.
7. **Contact** – huge thin headline, the email as an underlined giant link, offices with coordinates.
8. **Footer bar** – credit left, now-playing track right (pairs with the sound toggle).

## 4. Signature effects

* **Portal scene (three.js r128 UMD)**: `TorusGeometry` + additive `MeshBasicMaterial`; a plane with a radial-gradient
  `CanvasTexture` as halo; a `CircleGeometry` with a redrawn ASCII `CanvasTexture` (every ~160ms); 16 `TubeGeometry`
  arms along `QuadraticBezierCurve3` with a tiny `ShaderMaterial` that fades alpha along the tube and pulses with time;
  `Points` (700 on phones, 1600 on desktop) recomputed each frame on a spiral that ends at the ring; `FogExp2`.
* **Fallback**: if WebGL or three.js fails, replace the canvas with a CSS radial-gradient ring. Content never depends on it.
* **Glass coverflow**: panels get `data-o` −2…2 from JS; CSS transforms (`translateX`, `translateZ`, `rotateY`) with a
  long ease; side titles fade so they never overlap the centre one.
* **Generative panel art**: seeded flow-field lines on a canvas per project (teal / violet / magenta palettes), so every
  sample project looks distinct without images.
* **Ambient sound**: Web Audio, four detuned low oscillators with slow LFOs; off by default, starts only on click,
  fades in and out; the chip shows animated bars when on.
* **Cursor**: a teal ring with `mix-blend-mode:screen`, hidden until the pointer moves, grows over interactive elements;
  only on `(pointer:fine)`.

## 5. Build rules

* Standalone HTML with doctype, charset and viewport meta. three.js from cdnjs (`three.js/r128/three.min.js`) before the
  inline script. No other dependencies.
* The canvas is `position:fixed; z-index:0`; all content sits above it in normal flow, readable without the scene.
* Performance: `setPixelRatio(min(dpr,1.75))`, fewer particles on small screens, pause heavy work when the tab is hidden,
  single render loop.
* `prefers-reduced-motion`: no preloader, no grain animation, the scene renders a single still frame, no typing effect.
* Accessibility: every control is a real button with `aria-pressed` where it toggles; gallery region has
  `aria-roledescription="carousel"`, labelled arrows and keyboard support; `aria-live` on the pager and the terminal log.
* Mobile: hide secondary nav items, sound label becomes bars only, filters wrap into a grid, gallery height follows the
  panel size, process becomes one column.

## 6. Writing the copy

* Short, confident, a little poetic: "Step through the screen." "Code that feels alive."
* Uppercase only in headlines and UI labels; body text in sentence case.
* Mark sample projects and canned answers as such. No invented clients, awards or numbers.
* Multi-language: dictionary of source text nodes → translations; text that JS writes (pager, terminal greeting) must be
  set inside the language function too.

## 7. Finish checklist

- [ ] Scene runs at a steady frame rate on a mid-range phone; fallback shows when WebGL is off.
- [ ] Content is readable and complete with the canvas removed.
- [ ] Sound is off until the visitor turns it on.
- [ ] Projects and answers are real and approved, or labelled as samples.
- [ ] Every language switch leaves no source-language text, including JS-written text.
- [ ] Screenshots at 1440×900 and 390×844 (`node scripts/screenshots.mjs example/index.html screenshots`; the script starts
      Chrome with SwiftShader so WebGL renders headless).
