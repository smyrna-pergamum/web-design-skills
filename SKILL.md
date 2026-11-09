---
name: paper-notebook-landing
description: Redesign or build a landing page in a warm "paper notebook" style — cream paper, chunky soft serif headlines, handwritten marker notes, yellow sticky notes, name-label notebooks, illustrated scenes with roman-numeral feature panels, doodle grids, lined-paper lists, comic-strip storytelling and a giant orange footer. Use when the user asks for a paper-notebook / scrapbook / sticky-note / playful-education look, or wants a friendly, trustworthy landing page for education, student services or family-facing products. Produces a single self-contained HTML file with scroll-driven notebook animation, auto-sizing comic speech bubbles and optional multi-language switching.
---

# Paper-notebook landing page

This skill turns any product's real content into a single-file landing page in a warm, handmade
"school notebook" visual language that still reads as calm and trustworthy.
The reference build is `example/index.html` (Dreemli, a study-in-Germany platform, in TR/EN/DE). Open it before you start;
`references/components.md` holds every pattern as copy-ready code. `screenshots/` shows what each section should look like.

If the user points at a reference site, take the *style*, never its logo, illustrations, product photos, wording or wordmark.
Use the client's own brand name, content and facts.

## 1. Before designing: read the real site

1. Open the client's current site (and any brochure / PDF they share) and extract the **real** content: value proposition,
   process steps, services, numbers with their sources and dates, testimonials, FAQ answers, contact details.
2. Find the client's **process** (e.g. "Plan → Prepare → Apply → Arrive"). It becomes the spine of the page: the notebook label,
   the stage panel, the comic strip and the copy all count the same stages. If the client has a brochure, its structure wins
   over the website's.
3. Write down what you must **not** invent: prices, claims ("best", "cheapest"), statistics, legal/visa requirements.
   If the user asks to hide prices, replace them with offer language ("great offer ✦", "get an offer →", "package benefit ✦")
   rather than fake numbers. Official amounts (e.g. a visa's required balance) are facts, not prices; keep them with source + date.

## 2. Visual DNA (keep all of these)

| Element | Rule |
|---|---|
| Ground | Cream paper `#fdfbf9`, never pure white; secondary band `#f6efea`. One light theme only, on purpose. |
| Ink | Cocoa `#2b1a07` for text, charcoal `#171717` for outlines, muted `#8a7b6a` for small print. |
| Accent | Marker orange `#ff6f1e` for handwriting, underlines and the footer. Use the client's own accent if it is warm; otherwise keep orange as the "marker". |
| Sticker colours | green `#22c55e`, blue `#3b82f6`, pink `#ff66cf`, sticky yellow `#fadb4b`. Each illustrated scene owns one of them for its highlighted words. |
| Display type | Chunky, soft, slightly wonky serif, e.g. Gelica or Recoleta (paid). Free choice: **Fraunces** with `SOFT 100`, `WONK 1`, weight 800–900. |
| Body / UI type | Geist (or Inter) for lists, buttons' small print, captions. Serif (Fraunces 400) for subtitles and quotes. |
| Handwriting | **Caveat** (has Turkish/German glyphs). Only for annotations, sticky notes, labels on notebooks, comic speech. Never for paragraphs. |
| Buttons | The "dibs" button: cream pill with a 4px cream outer ring, a 1.5px charcoal inner border, serif label, tiny shadow. |
| Shapes | Cards 12px radius, buttons 20px, footer 56px top corners. Outlines are 1.5–2px charcoal, like pen. |
| Shadows | Soft and low: `0 2px 20px rgba(0,0,0,.06)`. Objects (notebooks, sticky notes) get a longer drop shadow underneath. |
| Navigation | No nav bar. Fixed round logo top-left; top-right a language switch, a small "log in" pill and the dibs CTA. |
| Hero headline | Lowercase, huge (clamp 60–112px), two short lines, preceded by an orange handwritten greeting ("Dear parents,"). |

## 3. Section patterns (pick, order and fill with real content)

Use these in roughly this order. Each has a ready snippet in `references/components.md`.

1. **Hero + name-label notebook** – greeting, lowercase headline, one-line subtitle with a handwritten aside
   ("in one place. *really!*"), dibs CTA, small muted note. Right: a leather notebook with a white name label
   (Name / Goal / Term / Stage 1/4). The label personalises the product with a sample user.
2. **Scroll-driven notebook** – the hero notebook *travels* down as the user scrolls (straightens, grows, centres), then its
   cover opens to reveal a welcome page with eyed stickers and "TAP TO START!". One notebook, one continuous motion.
3. **Sticky notes** – centred serif line with a stretched word ("Everyyyyything in one place.") and 4 rotated yellow notes
   with the strongest proof points.
4. **Illustrated scenes + roman-numeral panel** (2–3 of them) – full-bleed CSS/SVG illustration of the user's world
   (desk, sky with plane and skyline, campus…), a cream panel with a serif heading whose key words are coloured, a list of
   features numbered I, II, III… on the right edge, and a device mock that changes when an item is clicked.
   One scene should carry the client's **stage process** (panel = stages, device = that stage's steps + progress bar).
5. **Doodle grid** – 3×3 grid of hand-drawn line icons with handwritten captions; centre cell holds the section heading.
   Good for services / marketplace. Price or offer text in orange handwriting.
6. **Lined-paper list** – a tilted sheet with red margin and blue rules, handwritten checklist (✓ or ✗), small sticker
   labels around it. Good for requirements, "what's included", "what we never do".
7. **Coloured notebooks** – 3 notebooks (cloud-pattern blue, pink, cobalt) with name labels as covers for guides/products.
8. **Comic strip** – one frame per process stage, flat SVG characters with charcoal outlines, auto-sized speech bubbles,
   caption under each frame with the roman numeral and stage name. Then short testimonials with dashed top rules.
9. **FAQ** – `<details>` rows separated by dashed peach lines, orange +/– marker.
10. **Giant footer** – orange block, 56px top radius, serif cream headline, newsletter field with dibs button, link columns,
    and the brand name as a huge darker-orange wordmark.

## 4. Signature interactions

* **Notebook travel + open** – one element. Phase 1 (from page top until the opener section sticks): interpolate translate,
  rotation (-14° → 0) and scale from the hero placeholder's rect to the stage centre. Phase 2 (while the stage is sticky):
  `--p` 0→1 rotates the cover `rotateY(-178deg * p)` around its left edge. Hide the hero placeholder only when JS runs and
  `prefers-reduced-motion` is off; reduced motion shows the book already open and static.
* **Panel → device** – each roman-numeral item is a `<button aria-current>`; its `data-t` (and optional `data-sub`, pipe-separated
  step lists) render into the device screen.
* **Auto-sizing speech bubbles** – never hand-draw bubble paths around text. Put only `<text>` in a `<g class="sb" data-cx data-y data-tx>`;
  JS measures `getBBox()` after `document.fonts.ready`, shrinks the font if wider than the frame, draws the rounded rect and a tail
  pointing at the speaker (`data-tx`), and clamps the bubble inside the 300px frame. Re-run after every language change.
* **Language switch** – keep the source language in the HTML. A dictionary maps each trimmed source text node to
  `[en, de, …]`; walk text nodes once, store original + leading/trailing whitespace, swap on click; also translate
  `placeholder`, `data-t`, `data-sub`. Set `<html lang>`, remember the choice in `localStorage` (wrapped in try/catch).

## 5. Build rules

* One self-contained HTML file: inline CSS/JS, Google Fonts only, inline SVG for every illustration. No external images needed.
* Standalone file needs `<!doctype html>`, `<meta charset="utf-8">` and
  `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`, otherwise phones render the desktop layout.
* Use `main{overflow-x:clip}` (not `hidden`) so the travelling notebook cannot cause sideways scroll **and** `position:sticky` still works.
* All colours as `:root` tokens; the page is intentionally light-only, so set `color-scheme: light` and an explicit body background.
* Buttons are real `<button>`/`<a>` with visible `:focus-visible`; decorative SVG gets `aria-hidden="true"`; comic frames get
  `role="img"` + `aria-label` describing the scene.
* Respect `prefers-reduced-motion`: no travel, book open, no hover wobble.
* Breakpoints: ≤980px stacks scenes and hides decorative props (`.hide-sm`); ≤600px keeps only logo + language switch in the corners
  and shows the comic one frame per row.

## 6. Writing the copy

* Talk to the person on the other side of the screen, short sentences, warm but factual.
* Headline lowercase; everything else sentence case.
* Handwritten asides are jokes or emphasis, 1–3 words, at most one per section.
* Split headings that wrap coloured words into pieces that still read naturally in every language (word order changes!).
  Prefer structures like "One plan. *Four stages,* fourteen steps" where each piece can be translated on its own.
* Mark sample people as examples ("Elif's story is an example journey").

## 7. Finish checklist

- [ ] All content is the client's real content; nothing invented; sources and "last checked" dates kept.
- [ ] Hero notebook travels and opens smoothly; reduced-motion shows a static open book.
- [ ] Every speech bubble contains its text in every language (check with `getBBox` or by eye).
- [ ] Every language switch leaves no source-language text (scan text nodes for source-specific letters such as ğ ş ı).
- [ ] No horizontal scroll at 390px; corners show only logo + language switch on phones.
- [ ] Screenshots of each section at 1440×900 and 390×844 (see `scripts/screenshots.mjs`).
