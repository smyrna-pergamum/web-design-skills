---
name: gravity-lens-space
description: Build a cinematic space, science or film-launch website in a calm light editorial layout that holds rounded dark "windows" full of mouse-reactive media — a real-time WebGL black-hole shader that bends a starfield (gravitational lensing, accretion disk, photon ring, click pulse), a chapter list whose hover preview video follows and leans with the cursor, an astronaut scene with 3D tilt, visor glare and orbs that flee the pointer, a working time-dilation calculator, a tesseract corridor, a finale where a drawn astronaut floats over giant scroll-sliding words and follows the mouse, headlines whose letters thicken and step away from the cursor, rolling-letter buttons and a small glass-ring cursor. Use for space and astronomy brands, science museums, film or game launches, deep-tech or "cosmic" campaigns, or when the user wants a mouse-reactive, award-site feel with their own video loops. Produces a single HTML file plus an assets folder (compressed video loops, posters, images), no frameworks, optional multi-language switching.
---

# Gravity lens space

A cinematic site that stays easy to read: the page is pale paper with large quiet type, and the universe lives inside
rounded dark windows that respond to the mouse. The reference build is `example/index.html` (Atlasio, a fictional
deep-space expedition, EN/TR). Detailed code is in `references/components.md`; `screenshots/` shows every section.

Inspiration from a film or a studio site is fine; copying is not. Never use a film's title, character or ship names,
quotes, posters or score, and never a reference studio's 3D assets or copy. Write original chapter names and lines.

## 1. Before designing

1. Gather media: 3–6 short loops (wormhole, black hole, nebula, planet) and 1–2 hero stills. Royalty-free sources
   (Pixabay, Pexels) or the client's own. Keep the source and licence in the README.
2. Compress before building (see §5): loops of 8–12 s, 720p, no audio, H.264 `+faststart`, one poster JPEG each.
   The whole example's media is ~4 MB.
3. Decide the real-world anchor that makes the site more than decoration. In the example: a time-dilation calculator
   with the actual Schwarzschild formula. For a museum it might be a scale-of-the-universe slider; for a film, a
   chapter timeline.

## 2. Visual DNA

| Element | Rule |
|---|---|
| Page | Pale lavender paper `#eff0f6`, ink `#0d0e12`, secondary `#4a4d5a`, muted `#7c8091`, hairline `rgba(13,14,18,.12)`. |
| Windows | Rounded (`28px`) near-black `#050608` cards that hold every piece of media; the page itself never goes dark except the full-screen menu. |
| Accent | One warm accretion-disk amber `#f29a3a` (+ light `#ffcf8a`) for the cursor badge, results and highlights; ice blue `#9cc7ff` only inside media. |
| Type | **Inter Tight** 400 at large sizes with tight tracking (`-.04` to `-.06em`, line-height `.9–1`); **IBM Plex Mono** 500, 11–12px uppercase for labels, tags and buttons. |
| Buttons | Pills (44px high): dark ink, white, or a 120px round "Play reel". Labels use rolling letters. |
| Markers | `+  SCROLL TO EXPLORE  +` rows under windows; numbered chapter rows separated by hairlines. |
| Cursor | Small dot; over a `[data-cursor]` window it becomes a small 36px frosted-glass ring, with a white verb beside it only where it helps ("Watch", "Look"; interactive canvases get the ring alone) so the media stays visible; only "Play" turns amber. Never cover the picture with a big solid disc. |

## 3. Section patterns

1. **Header** – white pill wordmark, language switch, dark "Let's talk", white "Menu ••" opening a full-screen dark menu.
2. **Hero** – small mono kicker left, a 3-line statement right; below, a tall window with the **black-hole shader**,
   a hint label top-left and a HUD bottom (horizon distance and time factor that change with the mouse). The matching
   video loop is the fallback when WebGL is missing.
3. **Mission** – a huge two-line headline with the second line indented, a paragraph, "Our mission" pill and the round
   "Play reel" button that opens a `<dialog>` video.
4. **Chapters** – a list of numbered rows with giant titles and mono tags; hovering a row dims the others and shows a
   floating video preview that follows the cursor with lag and tilts with horizontal velocity; click opens the reel.
5. **Explorer** – a full-width window with the hero still: CSS 3D tilt and parallax from the mouse, an amber glare that
   follows the pointer, canvas orbs that flee it and drift back; headline over a bottom gradient.
6. **Time** – headline + explanation with the formula; a white card with a log-scale distance slider, two live clocks
   (ship and Earth) and a sentence result.
7. **Tesseract** – a window of concentric glowing frames pushed back in z that the mouse rotates; centred headline.
8. **Drift finale** – a tall sticky dark window: star dust that streaks with scroll speed, three giant statement lines
   (middle one amber) sliding sideways in opposite directions, and in front a drawn SVG astronaut that follows the mouse
   on a spring, rolls with its speed, moves its arms and legs, slides its visor highlight toward the cursor, is pushed
   away on click and grows as you scroll. A mono hint and a live "Drift / Depth" readout sit in the corners.
9. **Contact + footer** – dark window with an amber glow, huge question, email, pill; four-column footer with a
   newsletter pill form and a credits line for the media.

## 4. Signature effects

* **Black-hole lens shader** (raw WebGL, one full-screen triangle, no library): procedural starfield + nebula sampled at
  coordinates pushed outward by `rs²·k / r` (Einstein-style bending), a black shadow, a flattened accretion band with
  angle-periodic noise (use `cos/sin` of the angle, never the raw angle, or a seam appears at ±π), brighter approaching
  side, the far side hidden behind the hole, a lensed arc above, a thin photon ring, a click pulse that sends a ring
  outward, vignette and filmic tone map. Mouse eases the hole's position and the disk tilt. Paused off screen.
* **Floating preview**: one shared `<video>` element in a fixed card; on row enter set `src` and play; each frame lerp
  position (0.14) and rotate by clamped horizontal velocity. Hidden on touch.
* **Explorer depth**: `perspective` on the window, `rotateX/rotateY/translate3d` on an oversized image stage, a
  radial-gradient glare positioned with CSS variables, and a canvas of soft orbs with spring-back physics.
* **Mouse-reactive headlines** (`[data-type]`): every large heading is split into words and letters after translation;
  letters within ~170px of the cursor ease toward weight 700 (variable Inter Tight `wght 300..700`) and step a few
  pixels away from it. Only for headings in view, only on fine pointers, off with reduced motion; the plain text is
  kept as `aria-label`.
* **Floating astronaut**: SVG with grouped limbs rotated via `transform` attributes; spring `v += (target − x)·0.012`,
  damping 0.93; target = 42% of the cursor offset from the window centre (idle orbit when the cursor is away); click adds
  an impulse away from the cursor; scale `0.72 + 0.55·scrollProgress` inside a sticky section.
* **Rolling letters**: split labels into `<span class="ch" data-c>` with a `::after` copy; hover translates every
  letter up by 100%. Split *after* translation so the effect works in every language.
* **Lazy video**: `data-src` + `IntersectionObserver` sets `src` only near the viewport and pauses off screen.

## 5. Build rules

* Media pipeline (ffmpeg):
  `ffmpeg -ss 18 -i in.mp4 -t 12 -an -c:v libx264 -preset slow -crf 27 -pix_fmt yuv420p -movflags +faststart -vf "scale=1280:-2,fps=25" out.mp4`
  (vertical loops: `scale=720:-2`, `-crf 30`), then a poster: `ffmpeg -ss 1 -i out.mp4 -frames:v 1 -q:v 4 out.jpg`.
* Standalone HTML with doctype/charset/viewport; fonts from Google Fonts; no other dependencies.
* Every `<video>`: `muted loop playsinline preload="none"` plus a poster; nothing autoplays with sound.
* Accessibility: the canvas has `role="img"` and a description; menu and dialog close with Esc; preview video is
  `aria-hidden` (the rows are real buttons); slider has a visible output.
* `prefers-reduced-motion`: no shader animation loop (one frame), no tilt, no preview chase, outro lines static.
* Mobile: windows stay but shorter; the hover preview and cursor are off; header keeps wordmark, language and menu.

## 6. Writing the copy

* Short, wondering, human: "Every hour near the giant is borrowed from home." Avoid film quotes and names.
* Numbers that look scientific must be real (the calculator) or clearly illustrative (label it).
* Multi-language: translate text nodes from a dictionary; re-split rolling labels and recompute JS-written results
  inside the language function.

## 7. Finish checklist

- [ ] All media is licensed for the use, compressed (< ~1 MB per loop) and credited.
- [ ] The shader runs smoothly and the video fallback appears when WebGL is off.
- [ ] Every window reacts to the mouse in one clear way; nothing reacts on touch in a way that blocks scrolling.
- [ ] No film titles, character names, quotes or reference-site assets.
- [ ] Every language switch leaves no source-language text, including button letters and calculator output.
- [ ] Screenshots at 1440×900 and 390×844 (`node scripts/screenshots.mjs example/index.html screenshots`; the script
      moves a virtual mouse and renders WebGL with SwiftShader).
