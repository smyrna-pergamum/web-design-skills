---
name: knockout-quest-app
description: Build an experimental, gamified mobile-app landing page — a paper-white intro where a giant knockout wordmark shows a looping video only through its letters and scrolling zooms the camera into one letter until the video fills the screen, then a dark app-store-grade hero with a 3D-tilting phone mockup and floating reward chips; a sticky scroll tour where the phone stays put while real app screenshots, accent colours and a giant outlined tab name change per tab; a playable "daily quests" section (tap steps, fill water glasses, press-and-hold to train, finish a breathing exercise) feeding a live XP bar, level-ups, toasts and confetti in the header; video tiles with a live fitness HUD and a self-drawing route; a photo accordion with colour-tinted multiply photos; a breathing orb; a sound studio (meditation music player, nature-sound tiles and a radio tuner playing real app clips); a bento of animated numbers; scroll-scrubbed privacy lines and a download card that shows the visitor's score. Use for fitness, health, habit, wellbeing, language-learning, finance-habit or any consumer app (especially open-source or Android APK apps) when the user wants a modern, unusual, marketing-strong app website that mirrors the app's own gamification. Produces one HTML file plus an assets folder (compressed videos, photos, app screenshots), no frameworks.
---

# Knockout quest app landing

An app website that **plays like the app**. The visitor first sees a white page with a huge wordmark; the app's
world (a video) lives only inside the letters. Scrolling dives into one letter and the world opens up. From then on
the page behaves like the product: it gives XP for exploring, lets the visitor finish the app's real daily quests,
levels them up with confetti, lets them play the app's own music, nature sounds and radio tuner and, at the download
button, shows their score — "that was the warm-up".

The reference build is `example/index.html` (FitVita, the repository owner's real open-source Android fitness app,
English). Copy-ready code is in `references/components.md`; `screenshots/` shows desktop 1440×900 and mobile 390×844.

## 1. Before designing

1. **Get the app's own material.** 3–5 real screenshots (one per main tab), the app icon, the release link, version,
   minimum OS, licence and privacy facts. Never invent features — every number on the page must be true in the app.
2. **Read the app's gamification rules** (XP per action, quest goals, streak rule, badge count). The web quests copy
   them exactly, so the page doubles as an honest demo.
3. **Collect media:** one wide, calm video for the knockout (people moving through space, lots of sky/green so the
   letters read), two portrait-friendly videos for the HUD tiles, three photos for the accordion (one per "rhythm").
   Prefer inclusive casting (different bodies, ages, abilities). If the app has audio (music, ambience, radio), take
   one short clip per sound from the app itself, with its licence.
4. **Compress** (see §5). The example's 3 videos + 3 photos + 4 screenshots are ~4.7 MB.

## 2. Visual DNA

| Element | Rule |
|---|---|
| Base | Ink `#0b0e13`, cards `#141922`, hairlines `#ffffff1c`, text `#eef0f3`, muted `#98a2ae`. One light section (paper `#f2f1ec`) for the outdoor/video chapter, and the paper-white knockout intro. |
| Accents | Take them **from the app**: one gradient per tab (example: coral→pink activity, red→coral workout, violet→cyan inner peace, blue→cyan rewards). XP and primary buttons use a single lime `#c8f05a`; XP bar `sun→lime`. |
| Type | **Unbounded** 700–900 for display (letter-spacing `-.045` to `-.08em`, line-height `.78–1`), **Manrope** 400–800 for copy, **JetBrains Mono** 11px uppercase for HUD, labels and eyebrows. |
| Shapes | Rounded app geometry: pills (99px), cards 28–34px, phone 46px. The opposite of the editorial skills — everything feels tappable. |
| Phone | CSS frame (9:19.6, 10px bezel gradient, notch pill, glare overlay), screenshot `object-fit:cover; object-position:top`. Tilts with the mouse via `--mx/--my`. |
| Chips | White rounded "notification" chips with a gradient icon tile, floating (`bob` animation) and parallaxing with the cursor at different depths. |
| Motion | `cubic-bezier(.16,1,.3,1)` everywhere; reveal-on-scroll; magnetic primary buttons. |

## 3. Section patterns

1. **Floating header pill** – dark glass bar centred at the top: icon + name, 4–5 anchors, the **XP widget**
   (level badge, progress bar, `x/100 XP`), lime CTA. 3px rainbow reading-progress bar above it. Readable on both the
   white intro and dark sections, which is why it is a dark pill and not a full-width bar.
2. **Knockout intro → hero** (300vh, sticky stage) – a viewport-sized `<canvas>` over the video, painted paper with the
   wordmark cut out; four mono corner labels. Scroll: the cut-out scales (cubic ease, up to ~90×) around the centre of a
   **straight stem letter** ("I"), fades out, a shade fades in and the hero appears: eyebrow, 3-line headline with a
   gradient last word, lead, two buttons, meta dots; phone with three chips on the right. **The knockout plays once**:
   when the hero is fully in, the intro collapses to a normal 100vh hero (scroll position shifted by the removed height,
   so nothing moves). Scrolling back up shows the finished hero, never the zoom in reverse.
3. **Ticker** – tilted (−2°) full-width band in the app's gradient with the app's verbs and star glyphs.
4. **App tour** (460vh, sticky) – three columns: giant gradient step number + tab list (left), phone (centre), tag,
   headline, copy and feature pills (right). A giant outlined tab name drifts behind; the radial background takes the
   tab's colours. Screens cross-fade (`.out` class), copy re-enters with blur. Tab buttons jump to their scroll slot.
5. **Daily quests** – four cards with progress ring, icon, XP pill, goal line and a different micro-interaction each:
   tap (+2,000 steps, walker moves along a dashed track), tap glasses (8-cell grid fills), **press-and-hold** (fill bar,
   resets if released early), and one that is finished elsewhere on the page (the breathing lab). Bonus strip below.
6. **Outside** (light section) – headline, then two video tiles with a HUD: REC pill with blinking dot, running timer,
   giant distance/steps counter with live pace, and a route SVG that draws itself; two note cards below (inclusive
   promise + routes feature pills).
7. **Rhythms accordion** – three photo panels; inactive ones are grayscale, multiplied with a gradient and show a
   vertical label; the active one grows (flex 2.6), regains colour and reveals its copy. Hover on desktop, tap on touch.
8. **Breathing lab** – concentric rings and a gradient orb that grows on "in", holds, and shrinks on "out" with a
   countdown. A segmented control picks the app's patterns (Calm 4·6, Box 4·4·4·4, 4-7-8), next to the start button and
   a "0 / 2 breaths" counter. Anything that looks like a control must be one — passive dots next to a button get clicked.
   Two breaths complete a quest and give XP.
9. **Sound studio** – three decks side by side, each tinted with its own dark gradient: a **music player** (spinning
   record with a gradient label, lime play button, seek bar, scrollable track list with real durations, sleep-timer
   chips), a **nature mixer** (10 icon tiles, one plays at a time with equaliser bars, volume slider; it may mix with the
   music) and a **live radio** (scale with a glowing needle that slides to the chosen genre, a short static burst from
   Web Audio, station card, prev / play-stop / next, genre chips). Music and nature play **real clips from the app**
   (short, faded, looped); anything that only exists in the app (other tracks) says so with a toast. The radio uses the
   **same public API as the app** (here Radio Browser: `GET https://<mirror>/json/stations/search?tag=…&order=clickcount
   &reverse=true&hidebroken=true&is_https=true&limit=40`, CORS-open, no key), tries the mirrors in turn, keeps HTTPS,
   non-HLS streams, skips to the next station when one fails, and stops music and nature while it plays.
10. **Bento of numbers** – 6-column grid: one big gradient cell with the headline number, coloured and dark cells for the
   rest (counters animate on view), theme dots, language chips, a "radio" and a "routes" cell.
11. **Privacy lines** – two giant lines (solid / outlined / lime words) that slide in opposite directions with scroll,
    then the honest copy and 0 / 0 / 100% stats.
12. **Download card** – gradient-lit card: headline, APK + source buttons, and the **score panel** (level, XP, quests,
    sections explored). FAQ in three `<details>` cards. Footer with a giant two-tone wordmark and media credits.

## 4. Signature effects

* **Knockout zoom on a canvas**: video → viewport-sized canvas. Each scroll step: fill the paper colour, switch to
  `globalCompositeOperation='destination-out'`, `translate(ox,oy)·scale(s)·translate(-ox,-oy)` and `fillText` the
  letters — the holes show the video. Lay the letters out yourself (measureText + letter spacing) and fit the word to
  `min(86vw, 64vh)`; `(ox,oy)` is the centre of the stem letter. `s = 1 + z^3.2 · 90` for scroll progress `z`. Zooming
  into a counter (the hole of an O) would land on paper — always pick a stem. **Do not scale a DOM text layer** to 90×
  (e.g. `mix-blend-mode:screen` + `transform:scale`): the browser cannot rasterise a 100,000px layer and shows torn
  tiles, especially when scrolling back. Wait for `document.fonts.load()` before the first draw.
  **Make it one-way.** Played backwards the zoom looks broken (a ghosted hero, giant white letter slabs), so at
  progress ≥ .8 add `.intro-done` (intro `height:auto`, stage `position:relative;height:100svh`, knockout `display:none`,
  hero visible), clear the inline styles the scroll loop set, and `scrollTo({top:max(0,y-removed),behavior:'instant'})`
  (`instant`, because the page uses smooth scrolling; `overflow-anchor:none` so the browser does not adjust it too).
  Re-lay out the canvas on resize but ignore height-only changes under ~140px (mobile URL bar), skip it once the intro
  is done, and run the scroll handler directly (not behind a rAF flag).
* **XP engine**: `addXP(n, why)` → toast, level thresholds (`0,100,250,450,700`), level-up toast + canvas confetti,
  header bar and score panel re-render. Sections with `data-xp` give +5 the first time 25% is visible.
* **Quests mirror the app**: same goals and XP (+25 each, +50 for all four, streak day at two).
* **Sticky phone tour**: progress `p` over the section → `step = floor(p·4)`; set `--a1/--a2` on the stage,
  swap the screenshot, rewrite copy, move the outlined word by `-p·60%`.
* **Video HUD**: an interval updates timer, km, pace and steps only while a tile is visible; `.live` starts the route
  draw (`stroke-dashoffset` animation).
* **Videos play only in view** (IntersectionObserver) and never with reduced motion.

## 5. Build rules

* Videos: `ffmpeg -i in.mp4 -an -t 11 -vf scale=1280:-2 -c:v libx264 -crf 29-31 -preset slow -pix_fmt yuv420p -movflags +faststart out.mp4`,
  poster `ffmpeg -ss 1 -i out.mp4 -frames:v 1 -q:v 5-7 out.jpg`. Keep the knockout video under ~2 MB.
* Sound previews (only clips the app may redistribute; keep their licence and author):
  `ffmpeg -ss 4 -t 16 -i nat_rain.ogg -ac 1 -af "afade=t=in:d=1.2,afade=t=out:st=14.6:d=1.4" -c:a aac -b:a 40k rain.m4a`
  (~85 KB; music 40 s at 64k ~330 KB). AAC in `.m4a` plays in every browser, Ogg/Opus does not on older Safari.
  Audio never autoplays; it starts only from a click. Keep media paths literal strings in the JS (a lookup object, not
  string concatenation) so a single-file build can inline them.
* Photos: `-vf scale=900-1000:-2 -q:v 5-6`. App screenshots: 540px wide WebP (`-q:v 80`), ~25–45 KB each.
* Standalone HTML, Google Fonts, inline SVG `<symbol>` icons, no libraries. For sharing as one file, inline every
  `assets/…` path as a base64 data URI (the example becomes ~6.7 MB).
* Every real screenshot and photo has a real `alt`; decorative videos are `aria-hidden`; the tour copy is `aria-live`.
* Accessible quests: the hold button also works with Space/Enter held down; glasses are buttons with labels.
* `prefers-reduced-motion`: intro becomes a normal 100vh hero (no knockout), ticker and bobbing stop, videos stay on
  their posters, counters jump to the end, no confetti.
* Mobile: hide nav links and CTA (XP widget stays), hero stacks with a smaller phone, tour stacks phone above copy
  (`height:46svh`), quests 1 column, accordion becomes vertical (96px collapsed rows), bento 2 columns. No
  horizontal scroll at 390px (`overflow-x:clip` on html/body for the rotated ticker).

## 6. Writing the copy

* Short, warm, second person, in threes: "Move more. Feel more you." "Your rhythm, gamified."
* Quests talk like the app ("Take 2,000 steps", "Press & hold to train"); toasts are tiny ("+25 XP · Quest done").
* Inclusive, no body shaming: "No perfect body required." "Every body moves its own way."
* Privacy and install facts must be exact and link to the real privacy note, licence and release.

## 7. Finish checklist

- [ ] Every feature number and XP rule matches the shipping app; download link points to the current release.
- [ ] Knockout zoom lands inside a letter stem (video, not white) at all viewport sizes; word refits on resize, and
      after the zoom has played, scrolling back up shows the finished hero (no reverse zoom).
- [ ] The radio finds and plays a live station for every genre chip and skips dead streams.
- [ ] Every sound starts only on click, the page never plays two music sources by surprise, and each clip is credited.
- [ ] Tour: four screens swap without flashing; tab buttons scroll to the right slot.
- [ ] All four quests can be completed; bonus, streak toast, level-up and confetti fire once.
- [ ] Videos play only in view; reduced motion shows a static, complete page.
- [ ] 390px: no horizontal scroll, labels do not overlap, chips stay on screen; no console errors.
- [ ] Media credited in the footer; screenshots regenerated: `node scripts/screenshots.mjs example screenshots`.
