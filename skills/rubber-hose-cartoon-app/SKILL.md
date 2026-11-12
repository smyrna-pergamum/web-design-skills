---
name: rubber-hose-cartoon-app
description: Build a playful, experimental landing page in the style of 1930s–40s theatrical cartoons — cream paper with grain, thick black outlines and hard offset shadows, an original rubber-hose mascot (pie-cut eyes, white four-finger gloves, big shoes) bobbing in front of concentric red-orange-yellow-blue rings, a "line boil" SVG filter that makes drawings tremble like hand-drawn frames, starburst number badges, speech bubbles, a tilted ticker band, a screenshot inside a wooden cartoon TV with a channel-switch static effect, a 3D flip card with squash-and-stretch and dust puffs, wooden crates whose lids pop open, FAQ answers as speech bubbles, an iris-in download section and comic onomatopoeia that pop up where the visitor clicks. Use for learning apps, language and flashcard tools, kids' and family products, games, consumer apps and any product that should feel fun, friendly and hand-made, or when the user asks for a cartoon, comic, retro animation, "Looney Tunes-like" or rubber-hose look. Produces one HTML file (inline CSS and JS, Google Fonts) plus an assets folder of real app screenshots; the same build splits into shared CSS/JS for multi-language sites.
---

# Rubber-hose cartoon app

A product page that behaves like an old theatrical cartoon: everything has a thick ink outline, every surface casts a
hard black shadow, the mascot waves and bounces in front of a ring target, and the drawings never quite sit still. Under
the fun it is a normal, honest product page — features, a try-it demo, how it works, a user guide, downloads and FAQ —
so it suits learning apps, consumer tools and games that want to feel friendly instead of corporate.

The reference build is `example/index.html`: the real **Wortschatz Karten** site (a free German flashcard app for
Windows), English edition. The live site is in German, English and Turkish. Copy-ready code is in
`references/components.md`; `screenshots/` shows desktop 1440×900 and mobile 390×844.

> **Style, not characters.** Draw an *original* mascot in the period style. Never copy, trace or name characters,
> logos, title cards or catchphrases from existing cartoons, even if the user names a franchise as the mood.

## 1. Before designing

1. **Read the real product**: README, release notes, store page. Collect the true numbers (word count, levels,
   languages, platforms, licence). Every starburst number must be a real fact.
2. **Find the audience in the owner's words** ("German from A1 to C1 and DSH") and use exactly that phrase in the hero
   tag, the numbers row and the FAQ.
3. **Get real screenshots** (light and dark if the app has both). They go inside the TV and the picture frame; never
   fake an app UI.
4. **Pick the mascot object** from the product: a flash card for a vocabulary app, a dumbbell for fitness, a pencil for
   writing. It gets a face, rubber-hose arms and legs, gloves and shoes — nothing else.
5. **List what the visitor must be able to do** quickly: download, try the core interaction, read a guide, fetch a
   file (here: the Excel word list). Each of these gets its own visible button, not only a nav link.

## 2. Visual DNA

| Element | Rule |
|---|---|
| Ground | Cream paper `#fff4d8`, a deeper `#ffe9b3` for alternate sections, plus a fixed SVG-noise grain layer (multiply, ~22%) and a soft vignette. |
| Ink | Near-black `#16120f` for text, every outline (`4px`), every shadow. Muted brown `#5d5146` for secondary text. |
| Accents | Saturated cel colours, flat, no gradients: red `#ec3b2f`, orange `#ff8a1f`, yellow `#ffd23f`, sky `#43b4ec` (+ pale `#bfe7fb`), green `#3dbb6e`, pink `#ff8fb1`, wood `#d9934a / #b8722f`. Whole sections may be flooded in one accent (sky demo, green FAQ) with a white polka-dot pattern. |
| Display type | **Lilita One** (chunky, rounded, has latin-ext for ğ ş İ ä ö ü). Big headlines can be white with a `-webkit-text-stroke` ink outline, `paint-order: stroke fill` and a hard `5px 5px 0` ink text-shadow. |
| Comic type | **Bangers** for tags, kickers, onomatopoeia and labels — always uppercase, tracked `1–2px`. |
| Body type | **Fredoka** 500 (rounded, latin-ext). Key caps use a system font (`Segoe UI`, Arial) so arrow glyphs render. |
| Shapes | Pill buttons, 18–22px card radius, sticker tags rotated −2°, panels rotated ±1–2° so nothing looks machine-aligned. |
| Shadows | Only hard offsets: `6px 6px 0 ink` (cards, buttons), `4px 4px 0 ink` (small). No blur, ever. |
| Navigation | Sticky yellow bar with a 4px ink bottom border; links become white pills that tilt on hover; a pill language switcher with the current language inverted; a red download pill. |

## 3. Section patterns

1. **Top bar** — logo (mini mascot card + name), section links, language switcher, download button.
2. **Hero** — sticker tag with the audience, a two-line headline (second line red, outlined, words jumping one after
   another), lead, the main download button and small dotted-underline links to the demo, the file download and the
   guide. Right: the **stage** — ring target (repeating radial gradient + slowly rotating conic rays), speed lines, the
   mascot, a "HALLO!" speech bubble and a "100% FREE!" starburst.
3. **Ticker** — a red band rotated −1.2° with words from the product's world (here German words and onomatopoeia).
4. **Numbers** — four starbursts, each a different accent, with a real number in outlined white type and a two-line
   caption.
5. **TV** — copy left; right a wooden TV with antenna, knobs and feet holding the real screenshot. A light/dark segmented
   switch "changes the channel" with a static flash. Click opens the screenshot in a dialog.
6. **Features** — three tilted panels in different pale fills, each with a boiling icon that sticks out of the top edge
   and a big comic index number.
7. **Try it** — a flooded sky section with numbered pill steps and the interactive card: lined index-card front, yellow
   back, 3D flip with an overshoot curve, squash-and-stretch and dust puffs.
8. **How it works** — wooden crates of rising height for the Leitner boxes; the selected crate turns yellow, its lid
   flips open and a card pops out; a small mascot explains the selection in a speech bubble.
9. **User guide** — five numbered step cards (red number coins, arrows between them), a dashed warning box with a
   starburst "!", then cards for keyboard shortcuts (`<kbd>` caps with a thick bottom border), learning modes and
   settings & data.
10. **File download** — a tilted spreadsheet panel with a starburst count, a big green download button that links the
    file directly (`raw` URL + `download`), a "view on GitHub" link and a `<details>` with the column reference.
11. **Progress** — a real statistics screenshot in a tilted pink picture frame plus three aside cards.
12. **FAQ** — flooded green; each `<summary>` is a white pill with a "?" coin that spins into a red "!" when open; the
    answer drops in as a speech bubble.
13. **Download** — black section with an **iris**: a big red ring target whose cream centre holds the final call to
    action; it opens with a `clip-path` circle when it scrolls into view. Below it, repeat the file and guide buttons,
    then a starred line of honest promises.
14. **Footer** — yellow bar with links (guide, file, feedback, licence, top) and the tagline in Bangers.

## 4. Signature interactions

* **Line boil** — one SVG filter (`feTurbulence` + `feDisplacementMap`, scale ≈3) applied to the mascot, starbursts and
  icons; JS cycles the turbulence `seed` 1→4 every 120ms. Never apply it to body text or screenshots.
* **Mascot life** — body bob with squash/stretch (1.6s), waving arm rotating around the shoulder, blinking eyes. All CSS.
* **Boing** — buttons and starbursts squash-and-stretch on hover; buttons press into their shadow on `:active`.
* **Channel switch** — swapping the screenshot restarts a 0.35s `steps(4)` contrast/blur "static" animation.
* **Flip card** — `rotateY(180deg)` with `cubic-bezier(.5,1.8,.4,.8)`, a `scale` squish keyframe and 7 white puffs
  thrown outward; faces swap `aria-hidden` and an `aria-live` line reads the new side.
* **Crates** — `aria-pressed` buttons; selection drives the lid, the flying card and the explanation bubble.
* **Iris-in** — `clip-path: circle(0%)` → `circle(75%)` once the section enters the viewport (a scroll check, not an
  IntersectionObserver on the clipped element, which may never report it).
* **Click onomatopoeia** — on `pointerdown` a random word (ZACK!, PENG!, WUSCH!, BOING!…) pops at the pointer and floats
  away; skipped inside dialogs.
* **Reduced motion** — `prefers-reduced-motion` stops every animation and transition, removes the iris clip, the boil
  timer and the click words. The page must be complete and readable without motion.

## 5. Build rules

* Single file for one language: inline `<style>` and `<script>`, Google Fonts (Bangers, Fredoka, Lilita One), real
  screenshots in `assets/`. For several languages, move CSS/JS to `assets/`, keep one template with `{{key}}`
  placeholders, keep all strings in one dictionary and generate one static page per language (`/de/`, `/en/`, `/tr/`)
  with `hreflang` links, a pill language switcher and a root page that redirects by saved choice or browser language.
* All colours, fonts, the outline and both shadows are tokens on `:root`.
* Mascot, starbursts, gloves and icons are inline SVG with `<symbol>`/`<use>` reuse; decorative drawings are
  `aria-hidden`. Ink strokes are 6–7 units, `round` caps and joins.
* `overflow-x: clip` on `html` and `body` (not `hidden`, which breaks the sticky bar); the ticker overhangs on purpose.
* Breakpoints: 1460px (hide the GitHub text link), 1260px (hide nav links), 1000px (single column, untilted panels,
  stage under the copy), 700px (16px gutters, smaller type, crates without captions, iris widened past the screen),
  430px (logo mark only). Check the longest language — German labels overflow first.
* Focus: a 4px sky outline on every link, button and summary. Visually hidden live regions for the card and crates.

## 6. Writing the copy

* Short, warm, second person, exclamation marks allowed in headlines and tags, not in body text.
* Tags and labels in Bangers uppercase; headlines in sentence case.
* Onomatopoeia can come from the product's language (German ZACK!, PENG!) — it ties the joke to the subject.
* Keep facts boring and exact under the fun: platform, licence, what goes online and what stays local, the warning the
  installer may show. In translations keep the app's own menu names in their original language.

## 7. Finish checklist

- [ ] Mascot and drawings are original; no names, logos or catchphrases of existing cartoons.
- [ ] Every number in a starburst is real; download, demo, guide and file links work (file link downloads directly).
- [ ] Card flip, channel switch, crates, dialog, FAQ and iris work with mouse and keyboard; focus is always visible.
- [ ] Reduced motion: no animation, iris visible, page complete.
- [ ] 390px: no horizontal scroll, top bar fits in every language, iris text not cut.
- [ ] Screenshots regenerated: `node scripts/screenshots.mjs example screenshots`.
