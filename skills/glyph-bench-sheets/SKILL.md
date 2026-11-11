---
name: glyph-bench-sheets
description: Build an experimental product website for a document, PDF, writing, font or office tool in a big-platform software style — a black "bench" where the hero is a mosaic of real glyphs set in the fonts the product itself ships, with a real page floating on it that the visitor drags from a grey scan to the clean, searchable result; white sheets with 32px rounded tops that slide over the dark sections; a horizontal rail of tall tool cards (real app panels, photos, a looping video); tab chips over a large rounded card where the tools can be tried on the page (edit a line in another font, pick OCR languages, redact words, read the encryption and export settings next to the real panel screenshot); a dark type card where the visitor types their own line and flips through the product's bundled fonts; a dark bench with a 21:9 video and a card grid with a tall video; and a centred close with the real start screen. Use for PDF editors, document converters, OCR, e-signature, note, writing, font and other desktop or in-browser productivity tools (especially open-source or privacy-first ones) when the user wants a confident, experimental but clean marketing site with unusual type. Produces index.html plus tokens.css, base.css, page.css and an assets folder (fonts, videos, photos, app captures), no frameworks.
---

# Glyph bench sheets

A product site that looks like a big software platform's home page — black hero, bold head, pill buttons, white
sheets sliding over dark — but where **every graphic is the product's own type**. The hero is not an illustration: it
is a grid of glyphs set in the fonts the app really bundles, with the app's real output lying on top. The visitor
drags a divider and watches a crooked grey scan become the clean, searchable page. Further down they try the tools on
the page and type their own line in each bundled font.

The reference build is `example/` (**PDF Werkstatt**, the repository owner's real open-source in-browser PDF editor,
English). Copy-ready code is in `references/components.md`; `screenshots/` shows desktop 1440×900 and mobile 390×844.

## 1. Before designing

1. **Run the app and capture it.** One wide editor shot (2× DPR, WebP), one tall shot per tool panel (≈600×1600),
   the start screen, plus a sample document *before* (a scan) and *after* (the result) at the same size. A small CDP
   or Puppeteer script that loads the app, drops a sample file on its drop zone (`new DragEvent('drop',
   {dataTransfer})` works when a file input does not) and clicks panels open is enough.
2. **Copy the font files the app ships** (WOFF2 subsets are fine) — they become the page's graphics. Note what each
   is for (metric match for Times, handwritten, Arabic …).
3. **Read the README for exact facts:** number of tools, OCR languages, encryption standard, export formats, offline
   file size, UI languages, licence, latest release. Every number on the page must be true.
4. **Media:** 3–4 photos of real paperwork (desks, forms, books, a laptop on a lap), 2–3 short videos (typewriter
   keys, typing hands, a calm abstract screen). Compress (see §5). The example is ≈4.3 MB with fonts.

## 2. Visual DNA

| Element | Rule |
|---|---|
| Base | Near-black ink `oklch(16% .004 260)` with two lifted inks (22%, 28%) for tiles and hovers. Paper white `oklch(99% .002 260)` with two greys (96.5%, 93%). One rule colour per surface. |
| Accent | **The app's own primary** (example: cobalt `oklch(44% .14 260)`), used for the primary pill on paper, focus, the slider line and caret. On dark the primary pill is white. |
| Tool hues | The app's tool colours, lightened to ≈71–78% L so ink icons read on them: cobalt, coral, plum, saffron, emerald, turquoise. Only as 32px icon tiles, lit mosaic tiles and the "After" tag — never as text. |
| Type | One grotesk for everything (**Onest** 400/500/700): heads 700, `-0.035em`, line-height .95–1, sentence case. Plus the **specimen faces** (the app's fonts, `@font-face` named "Spec …") used only in the mosaic, the demos and the type card. No mono labels, no tracked caps, no eyebrows. |
| Shapes | Pills (999px) for buttons and chips, 16px cards, **32px sheet tops**, 48px round icon buttons, 12px field boxes with the label inside. |
| Surfaces | Dark sections are the "bench"; light sections are sheets with `border-radius: 32px 32px 0 0; margin-top: -32px` so each one slides over the previous. Cards on paper are the 96.5% grey, cards on dark are the 22% ink. |
| Motion | Calm: the mosaic swaps one glyph every 2.4 s (opacity only), videos loop. Everything that loops pauses off screen, on hover/focus and with a pause button. Nothing animates with reduced motion. |

## 3. Section patterns

1. **Dark slab nav** — sticky 64px bar, blurred ink, wordmark with the app icon, four links, one outlined pill
   ("Source on GitHub"). Links hide under 75rem.
2. **Hero, the glyph bench** — left: a 3-line head ("Edit any PDF. Upload nothing."), one sentence, a white pill and an
   outlined pill. Right: a 4×4 **glyph mosaic** of 16 tiles, each a letter of the product name or a telling glyph
   (`&`, `§`, `¶`, `ß`, `ğ`, an Arabic letter) in a different bundled font; four tiles are lit in tool hues. Over it, a
   rotated (−3°) **before/after page**: the scan image underneath, the result clipped by `--cut` on top, a round knob
   on a cobalt line, "Scan" and "After OCR" pill tags, a highlight on one searched word, and an invisible full-size
   `input[type=range]` that does the dragging (keyboard and touch for free). Under the hero: a **tool strip** — a
   round pause button for the mosaic and 6 tool links with hue tiles that jump to and open the matching try tab.
3. **Rail sheet** — centred head ("Sixteen tools in one tab."), then a full-bleed horizontal scroll-snap rail of tall
   cards (`grid-auto-columns: minmax(15rem, 19%)`), each with an icon+label head and a 420px media: alternate real
   panel screenshots (`object-position: top`), photos and one looping video with its own pause button. A white
   caption pill sits at the bottom of each.
4. **Try sheet** — head on the left, **tab chips** on the right (pill with a round hue icon; selected = ink fill).
   Below, one big 32px-rounded grey card; each tab panel is `7fr / 5fr`: a working demo on a white "paper" on the
   left, the matching real panel screenshot on the right. Demos: font/size selects, B/I/U toggles and a
   `contenteditable` line; 14 language toggles with an `aria-live` status; redactable words that turn into solid
   bars plus an opacity slider; the encryption and export settings as plain ruled tables.
5. **Type card** — a dark 32px card inside the sheet: head, a "Type your own line" field, the line itself at
   `clamp(3rem, 9.4vw, 9.5rem)` in the current font, then the font name with its purpose, round prev/next buttons and
   one dot per font. The visitor's line stays when they flip fonts.
6. **Dark bench** — head + one sentence, a 21:9 rounded video reel with a pause button and caption, then a
   `5fr/4fr/4fr` card grid where a tall abstract video spans two rows in the third column and dark cards carry the
   facts (in the browser, offline file size, OCR languages, UI languages).
7. **Close sheet** — centred head ("Drop a PDF on the page."), one line, the two pills, and the real start screen in a
   large rounded frame.
8. **Colophon** — wordmark, one sentence (licence, media credits, fonts), three links.

## 4. Signature effects

* **Glyph mosaic** (`.mosaic`): a 4×4 grid of `<span>`s with `f-*` font classes; `.lit` tiles take `--h`. A timer swaps
  one random tile's font and glyph every 2.4 s by fading it out (`.swap` → opacity 0), changing class and text after
  420 ms, and fading back. The timer only runs while the bench is in view and not held by the pause button.
* **Scan → searchable slider** (`.ba`): two same-size images stacked; `.ba__after { clip-path: inset(0 0 0
  var(--cut)) }`; the line and knob sit at `left: var(--cut)`; a transparent range input over everything sets `--cut`
  on `input`. Focus ring goes on the knob via `.ba:has(input:focus-visible)`. Make the scan yourself from the clean
  page if needed: greyscale, warm paper tint, slight rotation, blur, noise.
* **Loop controller**: every `[data-loop]` element (mosaic, videos) runs only when intersecting, pauses on
  pointer hover and focus inside, and toggles with its `[data-loop-toggle]` button (icon switches pause ↔ play, label
  switches "Pause/Play the video"). With reduced motion every loop starts held.
* **Tool strip → tabs**: links carry `data-tab="t-ocr"`; clicking scrolls to `#try` and selects that tab.
* **Type card**: one `FONTS` array (class, name, purpose) drives the dots, prev/next and the name; the line is
  `white-space: nowrap; text-overflow: ellipsis` inside a `grid-template-columns: minmax(0,1fr)` card so long input
  never widens the page.

## 5. Build rules

* Tokens only: every colour and font in `tokens.css` at `:root` (OKLCH), no literal colours in `page.css`.
  `overflow-x: clip` on `html` and `body`; image grid tracks `minmax(0, 1fr)`.
* Fonts: `@font-face` with `font-display: swap` for each bundled WOFF2; reference them only through
  `--font-spec-*` tokens and `.f-*` classes.
* Videos: `ffmpeg -i in.mp4 -an -t 9 -vf scale=1600:-2 -c:v libx264 -crf 30 -preset slow -pix_fmt yuv420p -movflags
  +faststart out.mp4` (1280 for grid videos, 720 for the vertical rail video), poster `-ss 1 -frames:v 1 -q:v 6`.
  `muted loop playsinline`, `preload="none"` below the fold, never `autoplay` — the loop controller plays them.
* App captures: WebP q≈80; panel shots ≈600px wide, the editor/home at 2× DPR. Photos 1500–1600px, JPEG q≈80.
* Real `alt` on every capture and photo; videos get an `aria-label`; the mosaic is `aria-hidden`.
* Tabs follow the ARIA tab pattern (roving `tabindex`, arrow keys, `aria-controls`). Without JS all panels show,
  stacked with rules (`.js .panel + .panel` resets that).
* Every control has hover, active, `:focus-visible` and disabled states; controls are ≥44px.
* Responsive: nav links hide under 75rem; under 60rem the hero stacks with the bench under the copy, rail cards
  become 70% wide, try panels stack with the screenshot under the demo and the card grid becomes one column; under
  40rem the wordmark keeps only its icon and the mosaic drops to 3×4. No horizontal scroll at 375px.

## 6. Writing the copy

* Short, flat, confident, two-beat heads: "Edit any PDF. Upload nothing." "Sixteen tools in one tab." "Built for your
  desk, not a server." "Drop a PDF on the page."
* Captions say what the tool does in four words ("Removed, not covered", "Many files, one PDF").
* Facts with units and names: "AES-256, standard security handler, revision 6", "about 64 MiB, OCR included".
  No invented numbers, testimonials or logo walls. Credit stock media in the colophon.

## 7. Finish checklist

- [ ] Every number (tools, languages, formats, file size, version) matches the app's README and current release.
- [ ] The mosaic only uses fonts the app ships, and each font file's licence allows redistribution.
- [ ] The scan slider works with mouse, touch and arrow keys; the result side is the app's real output.
- [ ] Every tab opens from its chip and from the hero strip; arrow keys move between tabs.
- [ ] Each loop pauses off screen, on hover/focus and from its button; reduced motion shows a still, complete page.
- [ ] 375/390px: no horizontal scroll, the type card never widens, chips wrap; no console errors.
- [ ] Media credited; screenshots regenerated: `node scripts/screenshots.mjs example screenshots`.
