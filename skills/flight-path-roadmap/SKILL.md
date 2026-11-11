---
name: flight-path-roadmap
description: Build a gamified, travel-themed landing page where the visitor's mouse becomes a paper-plane cursor with a contrail and scrolling flies a plane along a curved route through numbered "gates" — a pinned, camera-following SVG world with a night-to-sunrise sky, a HUD with progress dots and a miles counter, unlock toasts, mission chips that tick themselves, a landing scene with confetti — plus an interactive boarding-pass form in the hero that personalises the page, video-loop backgrounds, ticket-style pricing tiers (Economy / Business / First "price on request"), a split-flap departure board, a marketplace marquee of extras, an "altitude" trip-length chart, passport-stamp visa cards and an impact / travel-fund section. Use for travel agencies, trip planners, airlines, tour operators and tourism boards, and also for relocation, study-abroad or onboarding journeys, any multi-step process that should feel like a trip, or when the user asks for a scroll-driven roadmap, a plane cursor or a gamified homepage. Produces one HTML file plus an assets folder (compressed video loops and posters), no frameworks.
---

# Flight path roadmap

A homepage that turns a long, boring process into a trip the visitor flies themselves. The reference build is
`example/index.html` (Atlasio, a fictional travel and trip-planning brand, English). Detailed code is in
`references/components.md`; `screenshots/` shows every section on desktop and mobile.

The metaphor carries everything: the visitor checks in (hero form), takes off (scroll), passes gates (process steps),
earns miles (progress), lands (conversion), and chooses a cabin class (pricing). Keep every section inside the
metaphor, but never let it hide the real information: each gate still says plainly what happens in that step.

## 1. Before designing

1. **Map the process to 6–10 gates.** Each gate needs a short title, 2–3 mono tags, one sentence and 2–3 "missions"
   (concrete tasks). The example uses eight: pick a destination → flights → stay → documents & visa → insurance & money →
   pack & check in → arrival & transfer → explore.
2. **Pick origin and destination.** Short codes (IST → LIS) feel like real tickets; let the visitor choose them in the
   boarding pass and reuse them in the HUD and landing scene.
3. **Gather two video loops** (royalty-free or the client's own): a wide "wing over clouds" for the hero and a
   "window seat" or human moment for the impact section. Compress them (see §5).
4. **Decide the pricing tiers** and which one is "price on request". Decide the real figures the board will show; if
   the brand is fictional, label them as examples.

## 2. Visual DNA

| Element | Rule |
|---|---|
| Night | Deep navy `#060C1F` / `#0B1530`, text `#EAF0FF`, muted `#9AA8C8`, hairline `rgba(255,255,255,.12)`. Hero, flight, board, impact and finale are night. |
| Day | Cream `#FFF5EA` sections with ink `#14203F` for pricing, marketplace and visas, so the page breathes between night scenes. |
| Accent | One runway orange `#FF6B2C` (+ `#FF9A5C`) for the plane, the flown path, CTAs and unlocked gates. Success green `#3DDC97` only for ticks and "on time". Gold `#E9C46A` only for the premium tier. |
| Paper | Boarding passes, gate cards and tickets are warm paper `#FFFBF6` with dashed perforations and punched notches. |
| Type | **Bricolage Grotesque** 800 for headlines (tight `-.035em`, line-height `.95–1`), 400/600 for body; **JetBrains Mono** 10–13px uppercase for labels, flight numbers, gates and tags. |
| Buttons | Orange pills with a lift and glow on hover; ghost pills on night. |
| Plane | One simple top-down silhouette (single SVG path) reused for the cursor, the flight and small icons. Nose points right (angle 0). |

## 3. Section patterns

1. **Nav** – wordmark, 4–5 anchor links, one orange "Check in free" pill; turns frosted after 30px of scroll.
2. **Hero** – full-height video loop behind a left-to-right navy shade. Left: live eyebrow ("Gate open · …"),
   giant headline with one orange underlined word, lead, two CTAs, three tick micro-claims. Right: **boarding pass
   form** (origin/destination selects with big codes, name, trip style, travellers, barcode stub). Submitting stamps
   "CHECKED IN" and scrolls to the flight. Scroll hint at the bottom.
3. **Ticker strip** – one mono marquee of facts between hero and flight.
4. **Flight** – `1000vh` section with a sticky full-screen stage: sky gradient + sunrise overlay, slow far clouds, the
   SVG world (origin skyline, dashed route, flown route, gate nodes with labels, destination skyline and runway), HUD
   on top, gate card bottom-left, unlock toast top-right, intro title that fades on first scroll, landing overlay at
   the end.
5. **Cabin classes** – three ticket cards: Economy (free), Business (advisor, "from €…"), First / Premium with a gold
   badge and **"Price on request"** + "Ask for a price".
6. **Departure board** – split-flap table (flight, time, destination, status) that flips when it enters the view,
   then an honest "ten browser tabs vs us" two-column comparison.
7. **On-board service** – marketplace marquee of service cards with category, title and price per unit; pauses on hover.
8. **Altitude** – trip lengths (or levels of any kind) as altimeter columns; hovering one shows a mini plane and a sentence.
9. **Passport stamps** – three slightly rotated cards with double-ring seals for visa types (visa-free, e-visa, embassy visa).
10. **Impact / travel fund** – second video loop with a heavy left shade, headline with one orange phrase, three frosted
    step cards, an email pill form, and a note that criteria and amounts are published later. Works the same for a scholarship or charity programme.
11. **Final call** – huge personalised question ("Ready for take-off, Mina?"), CTA whose plane icon takes off on hover,
    dashed runway line; small footer.

## 4. Signature effects

* **Plane cursor with contrail** (fine pointers only, off with reduced motion): fixed SVG plane that eases toward the
  mouse (`0.22`) and turns toward its velocity with shortest-angle easing (`0.18`); a full-screen canvas draws two
  wing-tip trails from the last ~650 ms of positions, fading to transparent. Over links it grows and shows an orange
  ring; over inputs and selects it hides so the text caret stays visible.
* **Camera-following flight**: route built from waypoints with Catmull-Rom → cubic Bézier; plane placed with
  `getPointAtLength(L·p)` and rotated by the tangent; flown part drawn with `stroke-dashoffset`; SVG world scaled to the
  viewport height and translated so the plane sits at 40% of the width, clamped at both ends. Scroll progress is eased
  (`cur += (target − cur)·0.1`) so the flight glides.
* **Gate detection**: sample the path once (1,600 points), find the nearest sample to each waypoint and store its
  fraction; a gate is reached when `p ≥ fraction − 0.004`.
* **Gamification loop**: HUD dots fill and the bars between them scale with progress, a miles counter counts up,
  reaching a gate swaps the gate card (with a small drop-and-tilt transition), ticks the mission chips one by one and
  slides in an "Gate unlocked" toast. Landing (`p > 0.975`) shows a welcome overlay with all badges and fires confetti
  in the destination flag's colours once.
* **Day comes up**: a sunrise gradient overlay fades in over the second half of the flight.
* **Personalisation**: the boarding pass writes name and route into every `[data-name]` element, the HUD and the
  landing scene; stored in `localStorage` inside `try/catch` so a blocked storage never breaks the page.
* **Split-flap board**: every character is a tile that cycles random characters for a staggered time, then settles.
* **Video loops**: `muted loop playsinline` with a poster; an `IntersectionObserver` plays them only on screen.

## 5. Build rules

* Media pipeline (ffmpeg): `ffmpeg -i in.mp4 -an -vf "scale=1600:-2" -c:v libx264 -crf 28 -preset slow -movflags +faststart out.mp4`
  then a poster `ffmpeg -ss 1 -i out.mp4 -frames:v 1 -q:v 4 out.jpg`. The example's two loops are ~2.7 MB together.
* Standalone HTML with doctype, charset and viewport; fonts from Google Fonts; no other dependencies.
* To hand someone a single file, inline the media as base64 `data:` URIs (script in `references/components.md` §10);
  keep the assets-folder version in the repository.
* Accessibility: the flight section has an `aria-label` that names the steps; the gate card is `aria-live="polite"`;
  decorative SVG, canvas and video are `aria-hidden`; visible `:focus-visible` outline; every form control has a label.
* `prefers-reduced-motion`: no plane cursor, no marquees, no confetti, no reveal animation, videos paused on their
  poster; the flight still follows scroll (the visitor drives it) but without easing.
* Mobile: the stub of the boarding pass is hidden, HUD drops the flight number, gate card shrinks, the plane cursor is
  off on touch; no horizontal scroll at 390px.
* Demo forms must not send anything; say so in a note when the brand is fictional.

## 6. Writing the copy

* Speak in travel verbs, then say the real thing: "Gate 04 · Documents & visa — we check entry rules for your passport
  and route, and remind you before anything expires."
* Headlines are short and concrete ("Plan the trip. Enjoy the journey."). One orange phrase per headline at most.
* Numbers must be real or labelled as examples. Never invent testimonials, fares or fund amounts. Visa rules must point to the official source.

## 7. Finish checklist

- [ ] Every gate has a plain-language explanation and concrete missions; the route is understandable without animation.
- [ ] Plane cursor hides over inputs, never appears on touch and is off with reduced motion.
- [ ] Flight is smooth at 1440×900 and 390×844; labels never sit under the gate card at the plane's position.
- [ ] Landing overlay and confetti fire once, and scrolling back hides the overlay again.
- [ ] Pricing tiers are clear; "price on request" leads to a contact action.
- [ ] Videos are licensed, compressed, have posters and play only on screen.
- [ ] No horizontal scroll at 390px; no console errors.
- [ ] Screenshots regenerated: `node scripts/screenshots.mjs example screenshots`.
