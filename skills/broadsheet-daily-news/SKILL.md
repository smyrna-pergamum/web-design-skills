---
name: broadsheet-daily-news
description: Build a classic broadsheet newspaper website — a centred serif masthead with the date and edition beside it, a section nav between a hairline and a double rule, a "today's topics" strip, a front page with a lead story (headline, deck, byline, related link) beside a desaturated lead photo, three top stories in ruled columns, an opinion sidebar with italic headlines and initials avatars, a newsletter brief, a "from everyday life" feature row, a numbered reading list, a newsletter band and a quiet footer — that works without a backend: section filters and search (with highlighted matches) re-render a results grid, stories open in an accessible <dialog> reader with a drop cap, reading progress, text size, copy link and save, story links are real hash URLs that survive the back button, and the reading list and newsletter sign-up are kept in localStorage. Use for news sites, magazines, local papers, newsletters, blogs, school or community papers and editorial templates that should feel like print. Produces one HTML file (inline CSS and JS, Google Fonts) plus an assets folder of photos.
---

# Broadsheet daily news

A newspaper front page that reads like print and behaves like an app. Everything a reader expects from a paper — the
masthead, the double rules, the lead story, columns separated by hairlines, an opinion sidebar, a numbered list — and
everything they expect from a news site — sections, search, a reader view, saved stories, a newsletter — in one HTML
file with no build step and no server.

The reference build is `example/index.html` (**Today's Gazette**, an English sample edition with placeholder stories
and four Unsplash photos). Copy-ready code is in `references/components.md`; `screenshots/` shows desktop 1440×900 and
mobile 390×844.

## 1. Before designing

1. **Get the real masthead and sections** — the paper's name, its line ("A little closer to the world"), the edition
   label and the section list. The nav is the paper's table of contents; never pad it.
2. **Get the stories as data**: id, section, title, deck (one-sentence summary), author, minutes, photo key, optional
   paragraphs and tags. All front-page markup points into this list by `data-story="<id>"`.
3. **Photos**: one wide lead photo (≈1400px, 3:2), and 3–4 more at ≈1000px. They are shown at reduced saturation, so
   pick ones with clear shapes. Credit the source in the caption and footer.
4. **Be honest about samples**: if the content is a template, say so in the section meta line, under each story and in
   the footer. A sample edition must never look like real news.

## 2. Visual DNA

| Element | Rule |
|---|---|
| Paper | Warm off-white `#fffefa`; ink `#191919`; secondary text `#444` / `#666`; hairlines `#d5d3ce`; strong rules `#222`. One accent, a deep newspaper green `#285c53`, for kickers, the active section underline, focus and links in briefs. |
| Type | **Newsreader** (variable, optical size) for the masthead (800, `-0.045em`), headlines (700, `text-wrap: balance`), decks and body; italic 600 for opinion headlines and the tagline. **Libre Franklin** small for everything that is apparatus: nav, kickers, bylines, meta, buttons, captions. |
| Labels | The paper's own apparatus is allowed to be uppercase and tracked: kickers (9px, 1.3px tracking, accent), meta lines (9px, uppercase, muted), button labels (10px, 700). Body and headlines are never uppercase. |
| Rules | Hairline under the date row; **1px over and 3px double under the nav**; 1px `#222` over the second row of stories; 3px double over each section; 1px vertical rules between columns. Rules do the work that cards and shadows do elsewhere — no shadows, no rounded corners except avatars. |
| Photos | `filter: saturate(.74)`, back to full colour on hover; fixed heights per slot (340 lead, 205/260 feature, 190 result) with `object-fit: cover`. |
| Motion | Almost none: underline on hover, colour on hover, photo saturation. Smooth scroll only without reduced motion. |

## 3. Section patterns

1. **Top line** — menu and search icon buttons left, edition labels centre (hidden under 1050px), "Saved" (with a
   count badge) and a filled "Get the newsletter" button right.
2. **Masthead** — a 3-column grid `1fr auto 1fr`: the long date and a line left, the name and tagline centred, the
   edition right. The date is written with `toLocaleDateString` at load.
3. **Section nav** — buttons with `aria-pressed`, the active one bold with a 2px accent underline. On phones it scrolls
   sideways; the menu button wraps it into a 3-column grid.
4. **Topics strip** — a kicker and 4 topic buttons separated by middle dots; each runs a search.
5. **Front grid** — `3.15fr | 1fr` with a vertical rule. Left: the **lead** (`1fr | 1.48fr`: kicker, h1 headline, deck,
   byline meta, a related story under a rule; photo with a right-aligned caption), then **three top stories** in ruled
   columns. Right: **Opinion & Perspective** — author, italic headline, meta and an initials avatar — and a tinted
   **brief** box that jumps to the newsletter.
6. **Feature row** — a section heading with an "All stories →" filter link over a double rule, then a large card and
   two small ones separated by vertical rules.
7. **Reading list** — an intro on the left, an `<ol>` of four headlines in two columns with italic, faint, CSS-counted
   numbers (`decimal-leading-zero`).
8. **Newsletter band** — rules above and below, heading and line left, email field and button right, with a demo note.
9. **Footer** — the name small, "Back to top", then a ruled line of credits and the template disclaimer.

## 4. Behaviour

* **One click handler** on `document` routes `[data-story]`, `[data-category]`, `[data-filter]` and `[data-query]`.
* **Sections and search** hide the front page and render the matching stories into a 3-column results grid, with the
  view label (`aria-live`) and a count; search matches title, deck, section, author and tags, and wraps the match in
  `<mark>`. An empty result shows a message and a "Back to the front page" button. `/` opens search.
* **Reader dialog** — native `<dialog>` with `showModal()`: sticky toolbar (name, A−/A+, Copy link, Save, Close), a 2px
  reading-progress bar, kicker, headline, italic deck, byline, photo, paragraphs with a drop cap on the first, and a
  "sample content" note. Focus goes to Close and returns to the link that opened it; Esc and a backdrop click close it.
* **Hash routing** — opening a story pushes `#story/<id>`; `popstate` opens or closes the dialog, so the back button
  closes the reader and a shared link opens the story directly.
* **localStorage** (wrapped in `try`): saved story ids, the reader's text size and the demo newsletter address. The
  page works the same when storage is blocked, with a toast that says so.
* **Print**: chrome, nav and forms hide; an open story prints alone.

## 5. Build rules

* One HTML file, inline `<style>` and `<script>`, Google Fonts (Newsreader with `opsz`, Libre Franklin), photos in
  `assets/` as JPEG q≈80 (1400px lead, 1000px others). Colours and fonts are tokens on `:root`.
* Escape every story string before it goes into `innerHTML`.
* Every control is a `<button>` or link with a visible `:focus-visible`; inputs have real (visually hidden) labels.
* `overflow-x: clip` on `html` and `body`; grid tracks with images use `minmax(0, …)`.
* Breakpoints: 1050px (lead stacks photo above copy, the copy splits into two columns, edition labels hide), 760px
  (masthead stacks, the front grid becomes one column, the opinion sidebar becomes two columns under a double rule,
  the feature row becomes 2 columns with the large card side by side), 400px (single column everywhere).

## 6. Writing the copy

* Headlines: one idea, often a statement and a question ("Cities are changing. What about the way we live
  together?"). Decks: one sentence that adds what the headline leaves out.
* Kickers name the section and the angle ("NEWS / CITIES & PEOPLE", "CULTURE / LONG READ").
* Meta lines: author and reading time ("DENIZ AKSOY · 8 MIN READ").
* Never invent real people, quotes, events or figures; sample editions say they are samples.

## 7. Finish checklist

- [ ] Every front-page link opens the right story; every section and topic button returns stories or the empty state.
- [ ] Back button closes the reader; `#story/<id>` opens it on load; focus returns to the link.
- [ ] Saved count, text size and the reading list survive a reload; blocked storage still works with a toast.
- [ ] 390px: no horizontal scroll, the menu wraps the sections, the reader toolbar fits.
- [ ] Photo credits in captions and footer; sample notice visible; screenshots regenerated:
      `node scripts/screenshots.mjs example screenshots`.
