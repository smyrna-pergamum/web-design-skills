---
name: ticket-cube-language-school
description: Build an experimental, multilingual landing site for language schools, courses and community learning programmes in a "ticket" visual system — a notched ticket-bar navigation with numbered links, a mouse-reactive 3D cube in the hero whose faces are the learning paths, word tickets ("Hello" / "Hallo · means Hello"), boarding-pass cards that expand like an accordion (EN ✈ DE route, level / when / cost), a timetable grid, a chat-style course finder that is explicitly not a placement test, a conditional application form, split-flap FAQ numbers, hard offset shadows, a GDPR-style cookie popup, an install-as-app dialog (PWA) and up to eight UI languages including right-to-left Arabic and Persian. Use for language schools, integration and newcomer courses, NGOs and adult-education providers, language cafés, tutoring and any multi-path course offer that must work for people who don't read the site's main language yet. Produces one HTML file plus a small assets folder; no frameworks.
---

# Ticket cube language school

A homepage for people who are *starting* with a language. Everything is a ticket: the nav, the words, the course
cards, the questions. The reference build is `example/index.html` (**Atlasio**, a fictional language school, eight UI
languages). Detailed code is in `references/components.md`; `screenshots/` shows every section on desktop and mobile.

The promise to the visitor: *you can understand this page before you understand the language.* So language choice is
always one tap away, every path shows level, time, place and cost in plain words, and the application is short.

## 1. Before designing

1. **List the learning paths (3–5).** For each: target language, format (in person / online), level range, days and
   times, place, cost and how admission works. These become cube faces and pass cards; nothing may be invented.
2. **Pick the UI languages** from the real audience, not from a wish list. The reference uses DE, EN, TR, AR, FA, UK,
   RU, FR. Plan right-to-left (AR, FA, HE, UR) from the start; get every translation checked by a native speaker.
3. **Collect the weekly timetable** for in-person offers (day, start, end, group). Course hours that are not fixed per
   group go into one "daily" band above the grid instead of fake slots.
4. **Write the finder questions** (3–4, each with 2–3 answers) and the rule that maps answers to a path. Say clearly
   that it is not a placement test.
5. **Decide what the form needs per path** (level for courses, group for cafés, goal/device for online). Ask for
   nothing else; a free-text message field is enough for the rest.
6. **Photos:** a few small, round, real-looking moments (class, café talk, laptop). Use the client's own photos with
   consent; stock is fine if it is labelled as illustrative and not presented as the real school.

## 2. Visual DNA

| Element | Rule |
|---|---|
| Paper | Cream page `#F7F4EC`, ink `#0F2438`, night sections `#08182A`, muted text `#4E6273`, hairline `rgba(15,36,56,.14)`. |
| Accents | Teal `#0B7A6F` (primary, buttons, pass 01), saffron `#FFB627` (CTA circles, pass 02, marquee; ink text only), mint `#D3F1EA` (tickets, pass 04, form panels). One accent per object. Saffron is never used for text on cream; use `#A86400` for a warm word in a headline. |
| Hard shadow | Every object that "is a ticket" has a `1.5px` ink border and a solid offset shadow `0 6px 0 ink` (CTA pills use a teal shadow). No blur shadows except on popups. |
| Notches | Ticket edges get punched holes: small cream circles with an ink border on the separators of the nav, on both sides of word tickets and pass cards. |
| Type | **Unbounded** 800 for display (tight `-.04em`, wide, round), **Manrope** 500–800 for body, **JetBrains Mono** 500 for labels, codes, times and hints, **Vazirmatn** for Arabic and Persian (switch both display and body tokens under `[dir=rtl]` and reset letter-spacing). |
| Shapes | Radius 16–40px by size; pills for buttons and chips; round photos with an ink ring. |
| Motion | Short and physical: cube easing (`0.09` per frame), accordion `flex` transition `.6s`, buttons lift `3px`. Everything off with `prefers-reduced-motion`. |

## 3. Section patterns

1. **Ticket-bar nav** – one bar split into segments: wordmark | numbered links (`01`–`04` in mono) | app chip |
   language button. Separators carry top and bottom notches. A separate dark CTA pill with a saffron arrow circle sits
   next to the bar. On mobile only wordmark, app chip, language and a menu button remain.
2. **Hero** – three columns: left a mint word ticket ("In English · Hello" in the visitor's UI language), the H1 (one
   keyword line in mono above a three-part slogan: *Learn. Speak. Write your story.*), lead, a row of 4 overlapping
   round photos and the main CTA; centre the **3D cube** on a tilted mint floor with a hint line; right a teal word
   ticket with the target-language word, a "Hallo · means Hello" line and four round face buttons `01–04`.
   Under the hero a giant two-part display line ("Four doors / Choose your door.") that is decorative (`aria-hidden`).
3. **Greeting marquee** – saffron band with "Hallo · Merhaba · Hello · مرحبا · …" and the wordmark between them.
4. **Learning passes** – a row of 3–5 cards; one is open (`flex:3.6`), the others are closed slivers with a vertical
   label and a huge number. The open card is a boarding pass: mono strip ("ATLASIO · LEARNING PASS · 02 | IN PERSON"),
   route line `EN ✈ DE` (UI language → target language), round photo on the route, title, subline, three fields
   (level · when · cost) and actions. Selecting a cube face opens the same pass and vice versa. Mobile: stacked list.
5. **Week** – night section; a teal "daily" band for fixed daily courses, then a 5-day time grid (hours in mono,
   events as rounded blocks positioned by start/end). Footnote: where the times come from.
6. **Finder chat** – bot bubbles (brand mark avatar, ink shadow) on the left, answers as pill radios on the right,
   a saffron result bubble with path, time, reason, CTA and "not sure? we help on site". Language-specific
   questions (e.g. "your German today") only appear when relevant.
7. **Application** – teal rounded section; left heading, lead and a numbered journey list; right a cream form card.
   The program select reveals one conditional panel (mint) with the 1–2 extra fields for that path. Consent checkbox,
   honeypot, duplicate warning, success card with a reference number.
8. **FAQ** – left a mint "folder" card with a tab and a round photo on top ("Got questions ?" / "Answered."), right a
   night panel with split-flap numbers `0 1` and rounded rows; the open answer sits on a cream slip.
9. **Footer** – night: big CTA line with one saffron phrase and buttons (install app, apply), four columns (brand,
   contact, legal, community + social pills), a giant outlined wordmark bleeding off the bottom.
10. **Popups** – cookie consent and "install as app" share one style: cream card, ink border, offset shadow,
    language chips inside the consent popup so people can read it in their language.

## 4. Signature effects

* **Mouse-reactive cube**: CSS 3D (`perspective` on the stage, `transform-style:preserve-3d`, faces at
  `translateZ(size/2)`). Pointer position tilts it (`rotateX` from Y, extra `rotateY` from X); dragging rotates it
  and snaps to the nearest face on release; click / tap or the face buttons step to a face; arrow keys work when the
  stage has focus (reversed in RTL). It idles with a slow spin after 4.5s of no input. A live region announces the
  current face.
* **Linked state**: cube face ↔ open pass ↔ word tickets ↔ face buttons always show the same path.
* **Accordion passes**: `flex` grows the open card; closed cards fade their label; the open card's content fades in
  after a delay. Keyboard: each closed card is a `<button>` with `aria-expanded`.
* **Chat finder**: re-renders on every change, keeps focus on the chosen radio, writes the suggestion into a polite
  live region and pre-selects the matching group in the form.
* **Language switch**: all strings live in one `T[lang]` object; `applyLang()` sets `lang`, `dir`, every
  `[data-i]` text and re-renders cards, grid, chat, form options and FAQ. Times are wrapped in `dir=ltr` spans so
  `16:00–18:30` never flips in RTL.
* **Consent popup**: "Necessary only" and "Accept all" have equal weight; a settings toggle shows the categories with
  an unticked optional switch; choice + timestamp are stored; the footer link reopens it; nothing optional
  (remembered language, service worker) runs before consent.
* **Install as app**: the button is always visible; it uses `beforeinstallprompt` when the browser offers it,
  otherwise shows platform instructions (iOS Safari: Share → Add to Home Screen; Android / desktop: browser menu).
  If the visitor has not allowed the optional category, the button reads "Allow and install".

## 5. Build rules

* Reference: one HTML file with inline CSS/JS, Google Fonts only, photos in `example/assets/`. Production: move
  CSS/JS/fonts into cached files (see `references/components.md` §11).
* **SEO for production:** one URL per language (`/de/`, `/tr/`, …) with the content rendered into the HTML,
  `hreflang` for every language plus `x-default`, canonical, per-language title and description containing the real
  search terms (e.g. "free German course in <city>"), Open Graph image, `sitemap.xml` with alternates, `robots.txt`
  and JSON-LD (`EducationalOrganization`, `Course` with a free `Offer`, `FAQPage`). Hash-based language switching like
  in the demo is not indexable.
* Accessibility: one `h1`; the giant display line is not a heading; decorative SVG/photos are `aria-hidden`; every
  control has a label; visible `:focus-visible`; popups trap focus and set `inert` on the page; Escape closes the app
  dialog (not the consent popup — it needs a choice).
* `prefers-reduced-motion`: no idle spin, cube jumps instead of easing, no marquee, no accordion transition.
* Mobile: no horizontal scroll at 390px; cube 230px; passes stack; grid scrolls inside its own container.
* Demo forms must not send anything; the reference shows "Demo: no data was sent".

## 6. Writing the copy

* Short, warm, second person: "Your place. Your story." Then the facts: level, days, times, place, cost, admission.
* The finder is honest: "Not a placement test. Just a few questions to help you find a good place to start."
* Never invent places, numbers, testimonials or accreditation. If something is free, say who confirms the place.
* Translate everything, including error messages, the consent text and the confirmation email.

## 7. Finish checklist

- [ ] Every path shows level, time, place, cost and admission in plain words, in every UI language.
- [ ] Cube works with mouse, touch, keyboard and the face buttons; reduced motion is respected.
- [ ] RTL pages mirror layout, keep times LTR, and use the Arabic-script font.
- [ ] Consent: equal buttons, no pre-ticked optional switch, nothing optional before consent, reopen link in footer.
- [ ] Install dialog works without `beforeinstallprompt` (instructions) and hides when already installed.
- [ ] Form: conditional fields, consent, honeypot, clear errors, success with reference number; demo sends nothing.
- [ ] Production: per-language URLs, hreflang, canonical, sitemap, robots, JSON-LD, OG image.
- [ ] No horizontal scroll at 390px; no console errors.
- [ ] Screenshots regenerated: `node scripts/screenshots.mjs example screenshots`.
