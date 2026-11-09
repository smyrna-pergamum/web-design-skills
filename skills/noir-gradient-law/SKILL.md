---
name: noir-gradient-law
description: Build or restyle a law-firm or professional-services website in a bold "noir gradient" style — pure black stage, monochrome bronze statue photography (Lady Justice, busts), one fire gradient (yellow → orange → red) for lines, borders, buttons and a giant outlined monogram, huge uppercase Unbounded headlines, letter-spaced Montserrat labels, gradient-border cards, a duotone-halftone photo treatment with scratch lines, a marquee of client types, a 3D review carousel and a full-screen menu. Use when the user wants a dark, confident, premium look for lawyers, consultants, financial or other advisory firms, or asks for a black/orange/gold, statue-and-gradient legal theme. Produces a single HTML file plus an assets folder, with optional multi-language switching.
---

# Noir gradient law firm

A dark, confident, editorial look for firms that sell judgement: lawyers, tax and finance advisors, consultants.
Everything sits on black; the only colour is one fire gradient and the warm cast of bronze photography.
The reference build is `example/index.html` (Atlasio Law, a fictional business law firm, EN/TR).
Detailed code is in `references/components.md`; `screenshots/` shows every section on desktop, mobile and in Turkish.

If the user names a reference site, take its *style* only. Never copy its logo, statue photos, headlines or body copy.

## 1. Before designing

1. Collect the firm's real content: practice areas, who they serve, offices, contact details, team, reviews (with
   permission), articles. Law is regulated: never invent results, win rates, years of experience, rankings or awards.
2. Ask for imagery or use the user's own. The style needs 2–5 **monochrome-friendly photos**: statues, busts, architecture,
   people in silhouette. Check the user may publish them (stock licence or own photos) before anything goes public.
3. Note what must appear for the jurisdiction: imprint / bar membership, privacy policy, "this site is not legal advice".
4. Reviews: real ones only with the client's consent. Otherwise label every card "Sample review".

## 2. Visual DNA

| Element | Rule |
|---|---|
| Stage | `#050505` everywhere; sections separated by space, a 1px `#262626` rule or a slightly lighter band `#0a0a0a`. Dark only, on purpose. |
| Text | White headlines; body `#e9e6e1`; muted `#a8a29a`. |
| Fire gradient | `linear-gradient(90deg,#febd01,#f7a701 22%,#f26b0f 58%,#b12418)`. Used for: top 4px bar, buttons, brand monogram, card borders, rails, chevrons, one highlighted word. Never as a large background except the mission banner. |
| Eyebrow | Montserrat 600, 15px, uppercase, `letter-spacing:.32em`, yellow `#febd01`. |
| Section marker | 56px gradient square with the black monogram + red-orange `#e8501a` letter-spaced label. |
| Display type | **Unbounded** 700, uppercase, `line-height:.98`, 52–108px in the hero, 38–76px for section titles. |
| Body / UI | **Montserrat** 400 (body 17px/1.65), 600–900 for labels and buttons. |
| Buttons | Square corners, gradient fill, 900 weight 13px uppercase label + a long thin arrow. Secondary = yellow text link with arrow. |
| Cards | 14–22px radius, 1.5px gradient border via `padding-box` / `border-box` backgrounds. |
| Photos | Grayscale, high contrast, darkened; either masked into the black (hero) or given the duotone-halftone treatment. |
| Brand mark | A thick-stroked outlined letter (the firm's initial) in the gradient, reused huge and hollow behind the hero and contact. |

## 3. Section patterns

1. **Header** – fixed; 4px fire bar at the very top; wordmark + gradient monogram + two-line small "BUSINESS / LAW";
   right: phone, language switch, hamburger. Turns into a blurred black bar after 40px of scroll.
2. **Hero** – giant hollow monogram drawn in gradient strokes (draws in once on load), monochrome statue photo masked
   into the black on the left, right column: eyebrow (practice · city), 3–4 line uppercase headline with **one** gradient
   word, gradient CTA. Small scroll cue bottom-right.
3. **About** – section marker, vertical gradient rail on the left, eyebrow + two-line promise headline, one paragraph,
   gradient button + text link, a diagonal gradient slash as decoration.
4. **Who we help** – darkened full-bleed photo, headline, paragraph, gradient chevrons `>>` + an infinite marquee of
   gradient-bordered boxes with client types; centred CTA.
5. **Practice areas** – section marker, headline + paragraph, a neon line icon (scales) with gradient stroke and glow;
   **mission banner** (red → orange gradient, rounded, split by a white rule); 6 photo cards with gradient borders,
   title letter-spaced, description revealed on hover/focus (always visible on phones).
6. **Halftone band** – principles list (numbers in gradient text) beside a poster image in the duotone-halftone style with
   generated scratch lines and a small black caption tag.
7. **Reviews** – headline + glowing gradient ring with the icon; 3D carousel (centre card flat, neighbours rotated ±32°,
   blurred, dimmed), arrows, swipe and arrow keys.
8. **Insights** – "LAB" marker (white rule + gradient square), 3 posts: rounded duotone image, read time in amber, title,
   excerpt, date/author, yellow solid "Read more".
9. **Contact** – hollow monogram behind, letter-spaced uppercase address block, gradient-bordered form (name, email,
   company, topic, message, consent) with inline validation and a success note.
10. **Footer** – gradient line on top, logo + one sentence, three link columns, legal row with the disclaimer.

## 4. Signature effects

* **Duotone + halftone** (`.duo`): `filter:grayscale(1) contrast(1.25)` on the image, a warm gradient overlay with
  `mix-blend-mode:color`, and a 5px radial-dot pattern with `mix-blend-mode:multiply`. Works on any photo, so a mixed set
  of user images looks like one series.
* **Scratch lines** (`svg.scratch`): deterministic pseudo-random thin yellow lines over a poster (seeded, so screenshots
  and reloads match).
* **Hollow monogram**: SVG path with `stroke:url(#fire)`, `fill:none`, and a one-time `stroke-dashoffset` draw-in.
* **Gradient text**: `background:var(--fire); background-clip:text; color:transparent` on one word only.
* **3D carousel**: cards get `data-pos` −2…2 from JS; all motion is CSS transforms with `perspective` on the stage.
* **Marquee**: duplicated track translated −50% in a CSS loop; pauses on hover; edges faded with a mask.

## 5. Build rules

* Standalone HTML with `<!doctype html>`, charset and viewport meta; images in `example/assets/` (compress to ~1000px,
  JPEG q80). Fonts: Unbounded + Montserrat from Google Fonts (both cover Turkish and German).
* One hidden `<svg><defs>` holds the `#fire` gradient, the monogram, the arrow and the icon; everything else `<use>`s them.
* `body{overflow-x:clip}`; giant decorative SVGs never cause sideways scroll.
* Accessibility: real buttons, visible yellow focus ring, `aria-expanded` on the menu, Esc closes it, carousel has
  labelled arrows and keyboard support, decorative images `alt=""`, content images described.
* `prefers-reduced-motion`: no draw-in, no marquee, no carousel transitions.
* Breakpoints: ≤1000px single column, statue fades behind the hero text, mission banner stacks; ≤640px cards one per row
  with descriptions visible, carousel shows only the centre card, form one column.

## 6. Writing the copy

* Short, assertive, plain: "Clear counsel. Firm ground." Uppercase only for headlines, eyebrows and buttons.
* No legal promises ("we always win"), no superlatives you cannot prove. Prefer process promises you control
  ("a first answer within one business day") and only if the client confirms them.
* Multi-language: keep the source language in the HTML and translate text nodes from a dictionary (see
  `references/components.md` §11). Split headlines so each line still makes sense alone in every language.

## 7. Finish checklist

- [ ] Every claim, review, address and phone number is real and approved, or clearly marked as an example.
- [ ] Image licences checked before publishing.
- [ ] Imprint / privacy / "not legal advice" present.
- [ ] Headline has exactly one gradient word; gradient is not overused.
- [ ] No horizontal scroll at 390px; menu, carousel and form work with keyboard only.
- [ ] Every language switch leaves no source-language text.
- [ ] Screenshots at 1440×900 and 390×844 (`node scripts/screenshots.mjs example/index.html screenshots`).
