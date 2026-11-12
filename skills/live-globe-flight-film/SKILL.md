---
name: live-globe-flight-film
description: Experimental, scroll-driven "film" websites set on a live 3D globe (CesiumJS) — an entrance gate with a loading figure and an "enter with sound" choice, then the visitor scrolls and a real aircraft flies a route over the real map while a glowing golden trail leads ahead, the sun sets, city lights come on and one wide, light, italic capital line per chapter fades in. Use when the user asks for an immersive, cinematic or experimental site for a flight, travel, drone, mapping, geography, outdoor, sailing, road-trip or game product, wants "a website like an interactive film", "scroll to fly", "a journey over the real world", or wants a site restyled in this way. Produces one HTML page with inline CSS and an ES-module script, a few module assets (route, models, sounds) and a CTA that hands the visitor into the real product.
---

# Live globe flight film

The page is one journey. The visitor arrives at a dark gate that counts the planet in, enters with sound, and then
scrolls: every pixel of scroll moves a real aircraft along a real route over the real map, while the light changes from
golden hour to night. The words are few and large, one chapter at a time, and the last chapter hands the visitor the
controls of the real product. It suits products whose subject *is* a place or a movement through places.

The reference build is `example/index.html` (the real **SkyRoam** website: an evening flight from Istanbul to Pergamon);
detailed code is in `references/components.md`; `screenshots/` shows every chapter at 1440×900 and 390×844.

## 1. Before designing

* Find the **route**: 8–15 waypoints `[lat, lon, altitude m]` that pass the places the story names. The route must be
  real geography (a strait, a coast, a valley), never decorative zig-zags.
* Find the **vehicle**: the product's own 3D model if it has one (the reference uses the game's generated aircraft); a
  glTF model otherwise. Never a third-party branded model without a licence.
* Pick **5 chapters**: a place for each (shown small above the head) and one claim the product can prove. The last
  chapter is always the action (search, download, play, book).
* Collect the **sounds** the product really has (engine, wind, ambience). No sound is fine; fake sound is not.
* Never invent figures, testimonials or awards. The gate's percentage must measure something real (tile loading).

## 2. Visual DNA

| Element | Rule |
|---|---|
| Ground | The live globe, full-bleed, fixed behind everything. Page colour `oklch(13% 0.035 262)` dusk navy shows only while tiles load. |
| Light | Golden hour → dusk → night, graded by hand along the route: imagery `brightness` 1 → 0.16, `saturation` 1.1 → 0.55, a soft-light amber wash near the horizon, then NASA Black Marble city lights fading in (max alpha ~0.55). |
| Trail | `PolylineGlowMaterialProperty`, glow 0.22, colour `#ffbe5c`, width 9 px, drawn 6 m under the vehicle along the whole route — the reference's "path of light". |
| Ink | Ivory `oklch(95% 0.02 85)`, secondary `oklch(84% 0.025 80)`. Text over the world always carries a soft dark text-shadow. |
| Accent | One amber `oklch(82% 0.14 72)`: the trail, the loading bar, chapter numbers, "Play now", the final action button. Nothing else. |
| Display type | Archivo, `font-stretch: 125%`, weight 200, italic, uppercase, **no letter-spacing** (the width does the tracking). Heads ≤ 6 words. |
| Body / UI type | Archivo roman 400, sentence case, untracked; labels a step smaller. |
| Shapes | Pills (`999px`) for the two kinds of button; hairlines (1 px) for bars and chapter dots; no cards. |
| Surfaces | Only two glassy surfaces: the pill buttons and the search field (`blur(8px)` over 35–55 % navy). |
| Navigation | Wordmark top-left; language and an italic amber "Play now" top-right; an instrument strip along the bottom. |

## 3. Section patterns

1. **Gate** — dark radial glow over the loading globe: wordmark, one italic capital line, a big thin percentage with a
   hairline bar, a status line, then *Enter the sky* (with sound) and *Enter without sound*, and the note "Enter with
   sound. You can turn it off anytime." Skipped when the URL has a hash.
2. **Chapters 1–4** — each a `<section>` 220 vh tall whose text block is `position: sticky` near the top: place (small),
   head (wide italic caps), one or two sentences. The words fade in and out with the section; the world never stops.
3. **Morph chapter** — inside one chapter the vehicle changes as you scroll (the reference runs through 11 aircraft from
   1903 to 2005) with the current name and year live under the text (`aria-live="polite"`).
4. **Point-of-view chapter** — the camera slides from the chase position into the nose and back; the model hides once
   the camera is inside it.
5. **Action chapter** — the last place after dark: the question as head, the search field and amber button, the honest
   small print (what is free, what needs a key, where data goes), then two plain links (product, source).
6. **Strip** — fixed bottom: *Sound on/off*, *Reduce motion*, *Clear view* on the left; chapter number and name with
   five hairline dots in the centre; "Scroll to fly forward" on the right. On phones the chapter sits above the tools.

## 4. Signature interactions

* **Scroll is the throttle** — progress `p = scrollY / (scrollHeight − innerHeight)` maps through each chapter's share of
  the route (`CH_ROUTE`), along an arc-length table so speed is even. The camera follows an eased copy
  (`shown += (p − shown)·(1 − e^(−3.2·dt))`); with *Reduce motion* it follows `p` directly with no bob, sway or bank.
* **Banking and sway** — roll from the heading change just ahead (clamped ±0.38 rad), slow sine bob and side sway.
* **Time of day from progress** — `clock.currentTime = T0 + span·smoothstep(u)` keeps the sky atmosphere and sun honest;
  ground lighting is graded by hand (real low-sun lighting leaves the ground black).
* **Sound from speed** — the product's recordings loop through WebAudio; gain and playback rate follow scroll speed.
  Muted until the visitor chooses; suspended when the tab is hidden.
* **Clear view** — hides the words so the visitor can just watch; the final chapter stays.
* **Hand-off** — the search geocodes the town (Open-Meteo) and opens the product with a launch link
  (`play.html?fly=1&lat=…&lon=…&name=…&ac=…`), carrying the vehicle the visitor last saw.

## 5. Build rules

* One `index.html` with inline CSS and a `<script type="module">`; CesiumJS 1.123 from jsDelivr with `defer`; module
  assets in `assets/` (vehicle generator, sounds, a fallback screenshot). Google Fonts only.
* Viewer: `baseLayer: false`, every widget off, `creditContainer` set to your own element (credits must stay visible),
  `screenSpaceCameraController.enableInputs = false` so the page, not the globe, takes the scroll.
* Free imagery only, credited: Esri World Imagery for day, NASA GIBS Black Marble for night. Never ship a Cesium ion
  token; if the product uses one, the visitor brings their own.
* Without WebGL or without the library, the fallback screenshot covers the page and every word is still readable; with
  scripting off, the gate never appears (`.js .gate`).
* Off-screen chapter text stays at full opacity (only the chapter in view fades), so nothing is "hidden" for tools.
* `prefers-reduced-motion` turns *Reduce motion* on at load. Every control ≥ 44 px, visible `:focus-visible`.
* No horizontal scroll at 390 px; heads drop to `clamp(1.25rem, 6.4vw, 2rem)` and never break inside a word.

## 6. Writing the copy

* One line per chapter, sentence-like, ≤ 6 words in the head, ≤ 25 words in the lead. The place line names where the
  vehicle is *right now*.
* The gate line is a promise about the whole world, not about the product.
* Sentence case everywhere except the display heads. Two languages through a small dictionary (`data-i18n`); English in
  the HTML so it reads without script.

## 7. Finish checklist

- [ ] Route follows real geography; places in the chapter lines match what is on screen.
- [ ] Gate percentage reaches 100 only when the globe's tiles are loaded (with a 14 s safety timeout).
- [ ] Trail, sky and lights read at every chapter; no white glare (HDR and bloom off).
- [ ] Vehicle never clips the camera; it sits under the words in the last chapter.
- [ ] Sound starts only after a click, can be turned off, and stops in background tabs.
- [ ] Map credits visible; no ion token in the code.
- [ ] Reduce motion, Clear view, keyboard focus and the search work; no horizontal scroll at 390 px.
- [ ] Screenshots of each chapter at 1440×900 and 390×844 (`node scripts/screenshots.mjs example screenshots`).
