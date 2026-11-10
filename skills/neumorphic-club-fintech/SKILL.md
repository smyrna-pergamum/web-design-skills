---
name: neumorphic-club-fintech
description: Build a premium fintech, card or membership website in dark neumorphism (soft UI) — every surface is the page colour and depth comes only from paired shadows (raised outer / pressed inset), heavy lowercase serif headlines, wide-tracked uppercase eyebrows and one lime "LED" accent — with signature effects - a light source that follows the cursor so every shadow on the page turns with it, engraved text that lights up word by word on scroll, an embossed credit card that tilts with the mouse, a phone rising out of an inset slot, fanning card slabs, pressable reward coins, a rotating lock dial with spotlight text and a slide-to-join control, plus a light-relief theme switch. Use for banks, credit cards, payments, wallets, members-only clubs, premium subscriptions, or when the user asks for neumorphism, neumorphic, soft UI, embossed or "extruded" design, or a dark luxury fintech landing page. Produces a single HTML file with optional multi-language switching.
---

# Neumorphic club fintech

A members-only finance site carved from one soft material. The whole page is a single colour; buttons, cards and wells
are pushed out of it or pressed into it, and a light that follows the cursor makes the relief feel physical. The tone is
quiet and exclusive: big lowercase serif statements, little copy, lots of air.

The reference build is `example/index.html` (Atlasio Reserve, a fictional card club, EN/TR, dark and light relief).
Detailed code is in `references/components.md`; `screenshots/` shows every section on desktop, mobile, both themes and in Turkish.

If the user names a reference site, take its *structure and mood* only. Never copy its renders, product names, copy or logo.

## 1. Before designing

1. Collect the real offer: one-line promise, who qualifies, 3–5 product features, rewards, security statement, ratings
   or member counts **only if the client can back them**, FAQs, app links. Label anything else as a sample.
2. Never invent security certifications, interest rates, fees, approval rules or credit-score effects. Finance copy is
   regulated; leave a placeholder that says what must go there.
3. Pick the one live state that gets the lime LED (due date, payment received, card active). Accent appears nowhere else
   except primary button text and focus rings.

## 2. Visual DNA

| Element | Rule |
|---|---|
| Material | One colour for page **and** every surface. Dark `#1f2126` (hi `#25282e`, lo `#1a1c20`); light `#e3e6eb` (hi `#eef0f4`, lo `#d5d9df`). Never pure black or white: shadows need room on both sides. |
| Relief | Raised = `X Y 24px dark, -X -Y 24px light`; pressed = the same pair `inset`. Dark shadow `rgba(0,0,0,.62)`, light `rgba(255,255,255,.055)`; in light theme `rgba(146,156,172,.7)` and `rgba(255,255,255,.95)`. Small variants at half offset. Convex knobs and chips add `linear-gradient(145deg, hi, lo)`. |
| Light | Offsets come from `--lx/--ly` (a unit vector). Default top-left light (`.7071, .7071`); JS turns it toward the cursor. |
| Text | Dark: `#f4f5f7`, soft `#c5c9d1`, muted `#8e939d`. Text is **never** low-contrast: relief is for surfaces, not for type you must read. |
| Accent | Lime LED `#b9f26b` (light theme `#3e8a1d`) with a small glow. Feature wells may hold one saturated glow each (pink, violet, green, blue) at ~38% opacity. |
| Display type | **Fraunces** 700, `opsz 144`, `letter-spacing:-.035em`, lowercase, line-height .92 (Denton is the paid original look). |
| Body / UI | **Urbanist** 400–700 (Gilroy look). Eyebrows 13px 700 uppercase `letter-spacing:.32em`. Buttons 13px 700 uppercase `.18em`. |
| Shapes | Pills for buttons and toggles; 20–44px radii for panels; circles for icon wells, coins and the dial. No borders, no hairlines. |
| Engraving | Same colour as the surface + `text-shadow: 1px 1px 1px light, -1px -1px 1px dark`. Only for decoration (card numbers, unread words). |

## 3. Section patterns

1. **Header** – raised round monogram + serif wordmark; pressed pill with LED ("new · …"); pressed language track whose
   active segment is raised; round raised theme button. Sticky; gains a soft drop shadow after scrolling.
2. **Hero** – left: eyebrow, 2-line lowercase serif headline, short lead, a primary (lime text) and a plain pill button,
   two pressed stat wells marked "sample". Right: concentric relief rings (raised, pressed, raised) with an embossed card
   on top (convex chip, engraved number, LED), tilted -8° and following the mouse.
3. **Story** – one big raised panel; eyebrow ("membership is earned."); a serif paragraph whose words start engraved and
   light up one by one as the reader scrolls.
4. **App** – a raised phone with a pressed screen rises out of a pressed slot; inside, a raised bill card (LED due date,
   amount, pay button) and two list rows. Centred serif headline and lead below.
5. **Cards** – split: copy left; five raised card slabs fanning open from a common pivot as the section scrolls in; the
   front slab carries the LED state.
6. **Pay rail** – eyebrow + headline, raised round prev/next buttons; horizontal scroll-snap rail of raised tiles: pressed
   icon well + uppercase label, two-line title, small pill button, a pressed "show" well with a coloured glow and a
   relief object (dotted phone, chip grid, contactless rings, split bars).
7. **Rewards** – centred headline; 3×2 grid of convex coins that float slowly; pressing one sinks it and reveals a sample
   reward.
8. **Security** – split: raised dial with 60 ticks that rotate with scroll around a convex knob with a lime lock; eyebrow
   and a large sans paragraph lit by a moving spotlight (follows the pointer, drifts on its own otherwise).
9. **Proof** – headline + two raised rating tiles: serif number, `/5`, a pressed track with a lime fill. Labelled sample
   unless real.
10. **Join** – raised panel: headline ("the door opens for some."), lead, a pressed **slide-to-join** track with a convex
    knob; right a pressed well with a raised QR tile.
11. **FAQ** – wide-tracked centred label; raised `<details>` bars that become pressed when open.
12. **Footer** – one pressed panel with logo, two link columns and a raised promo card; a fine-print line below.
13. **Floating badge** – raised bottom-right "get the app" with a small QR; hides while the join section is visible and
    below 900px.

## 4. Signature interactions

* **Cursor light** – on `pointermove` set the shadow vector to `normalize(centre − cursor)` and ease `--lx/--ly` toward
  it in `requestAnimationFrame`. Every shadow is built from these vars, so the whole page re-lights at once. Only for
  `(pointer:fine)`; fixed top-left light with reduced motion.
* **Engraved → lit words** – split the paragraph into `<span class="w">`; light the first `progress × count` words.
  Re-split after a language switch. Reduced motion: all lit.
* **Card tilt** – `rotateX/rotateY` up to ±11° from the pointer position over the stage; returns to flat on leave.
* **Phone rise / card fan / dial** – each reads one scroll progress value (0→1) and writes a CSS var (`--p`, `--fan`,
  `--rot`). Reduced motion: final state.
* **Press states** – every clickable relief element swaps its outer shadow for the inset pair on `:active` or
  `aria-pressed="true"` and scales to .985.
* **Spotlight text** – a duplicate `aria-hidden` paragraph in full white masked with a radial gradient at `--mx/--my`.
* **Slide to join** – pointer-captured knob; release past 90% completes, otherwise springs back; arrow keys and Enter
  work; the knob has `role="slider"` with `aria-valuenow`. It never submits anything unless the client wires it up.
* **Theme switch** – flips `data-theme` on `<html>`; only tokens change.

## 5. Build rules

* Standalone HTML with doctype/charset/viewport; Google Fonts only; no images required (all relief is CSS, QR is a
  decorative canvas pattern, marked as sample).
* Define the material once as tokens (`--bg --hi --lo --d --l --raise --raise-sm --inset --inset-sm`); components never
  write a shadow by hand.
* Every element that casts a shadow sits on `background: var(--bg)`. Overflowing containers (rails) need ~30px padding
  so shadows are not clipped.
* Accessibility: text contrast ≥ 4.5:1 regardless of the relief; visible lime focus ring; pressed state is also exposed
  with `aria-pressed`; decorative relief is `aria-hidden`.
* `prefers-reduced-motion`: no light follow, no tilt, no float, all scroll pieces in their end state, spotlight off.
* Mobile (< 900px): grids stack, badge hides; (< 640px) the header pill hides, coins go 2 columns.

## 6. Writing the copy

* Lowercase headlines, short and declarative, two lines max: "built for people who pay on time".
* Eyebrows are full sentences in caps with a period: "MEMBERSHIP IS EARNED."
* Body copy plain and concrete. No hype, no invented numbers; mark samples in place.
* Translate every string, including JS-written ones (coins, slider result, theme labels).

## 7. Finish checklist

- [ ] One material colour; no borders; every shadow comes from the tokens.
- [ ] Moving the mouse turns every shadow on the page; touch and reduced motion get a fixed light.
- [ ] All readable text passes contrast in both themes; engraving only on decoration.
- [ ] Rail shadows are not clipped; nothing scrolls horizontally at 390px.
- [ ] Ratings, member counts, rates and security claims are real or labelled; no third-party logos or renders.
- [ ] Language switch leaves no source-language text.
- [ ] Screenshots at 1440×900 and 390×844 (`node scripts/screenshots.mjs example/index.html screenshots`; the script moves a
      virtual mouse so the light direction shows, and captures both themes).
