---
name: scroll-lock-cyber-brutalism
description: Build a privacy, security or encryption product website in postmodern cyber brutalism — night-graphite ground, an asymmetric 12-column grid drawn with thin technical rules and amber crosshair corners, big tight grotesk headlines, IBM Plex Mono labels and readouts, one brass/amber light — whose signature is a three.js 3D padlock that the visitor closes by scrolling (approach, shackle drops, recoil, amber pulse ring, "YOUR PRIVACY. YOUR CONTROL."), fully reversible. Also ships honest-claims sections - value cards with their source file, a protects / does-not-protect threat-model split, a crypto spec table, status badges, an encrypt-and-deliver flow, a real-screenshot app preview, and a download panel with SHA-256 and signing-certificate verification. Use for messengers, password managers, VPNs, wallets, encrypted storage, open-source security tools, or when the user asks for a scroll-to-lock animation, a 3D lock hero, or a cyber-brutalist, amber-on-graphite landing page. Produces a single HTML file (three.js from a CDN) with optional multi-language switching.
---

# Scroll-lock cyber brutalism

A security product site that behaves like a technical document with one theatrical moment. The page is a precise,
asymmetric grid of hairlines, mono coordinates and plain claims; the hero is a heavy metal padlock that the reader locks
with their own scroll. It suits products whose promise is control and verifiability. It does not suit hype.

The reference build is `example/index.html`: the real site for **Kilit Messenger** (a post-quantum, serverless messenger
over Tor), EN/TR, with the app's real screenshots in `example/assets/`. Detailed code is in `references/components.md`;
`screenshots/` shows every section on desktop, mobile, reduced motion and in Turkish.

If the user names a reference site, take its *style* only. Never copy its renders, product names, copy or logo.

## 1. Before designing

1. Read the product's own sources first: README, threat model, privacy policy, security policy, release notes, and the
   app's colour tokens. Every claim on the page must point to one of them. Put the source under each value card.
2. **Security copy rules.** Never write "military-grade", "unbreakable", "zero tracking", "audited" or "independently
   verified" unless a document proves it. Do not list features the product lacks (self-hosting, multi-device, perfect
   forward secrecy, automatic key rotation…). If it is alpha or unaudited, say so in red, near the top of the security
   section and in the FAQ.
3. Collect the real release: version, file names, sizes, SHA-256 values, signing-certificate fingerprint, minimum OS.
   These change every release; keep them in one place in the HTML.
4. Use real app screenshots (resized to ~540px wide WebP). If they are rendered or contain sample people, say so.

## 2. Visual DNA

| Element | Rule |
|---|---|
| Ground | Night graphite `#0d1117`; surfaces `#161c26`, raised `#1e2633`. Use the product's own tokens when it has them. Dark only. |
| Lines | `#2d3644` hairlines for every border, divider and grid; a faint 80px grid behind the hero, masked to the centre. Panels get two amber crosshairs (top-left, bottom-right). |
| Accent | Brass/amber `#e0a84a` for the primary button, active states, section numbers, the lock light. Never for small body text on its own. |
| Status | Safe `#3fb68b` and danger `#e5534b` only for real states (Tor ready, locked, not audited, not code-signed). |
| Display | **Space Grotesk** 600–700, `letter-spacing:-.035/-.045em`, tight leading (.92–1). Italic amber for the one phrase that matters ("Your control."). Sentence case. |
| Body | **Inter** 400–600. |
| Labels | **IBM Plex Mono** 11–13px: section index (`06 / security`), versions, readouts, file sizes, sources, badges. Uppercase only here. |
| Buttons | Pill. Primary amber with dark ink; secondary 1px outline that turns amber on hover. 48px tall (44px minimum). |
| Icons | Single-stroke 1.6px line icons in amber (Lucide-like), inline SVG symbols. |
| 3D | One object: the padlock. Graphite gunmetal body, brass band, steel shackle, glowing amber keyhole, amber floor rings, a soft light shaft and sparse dust. No neon, no purple, no matrix rain. |

## 3. Section patterns

1. **Header** – brass padlock mark + two-tone wordmark; centred nav (Features, Security, Download, Docs, Community) with
   an amber underline for the section in view; language switch; outline "View on GitHub". Below 980px a drawer.
2. **Hero** (sticky stage, first viewport) – left 6 columns: status chip, three-line headline, one-sentence lead, primary
   download + GitHub buttons, mono meta row (version / OS / licence). Centre: the 3D lock, open, floating. Right 3 columns:
   a tilted phone with a real screenshot. Top-right mono readout (`KLT-LOCK / 000%`, algorithms, `state: open`). Bottom:
   "scroll to lock" mouse hint.
3. **Scroll to lock** (same sticky stage, ~140vh of scroll on desktop, ~80vh on mobile) – see §4.
4. **Values** – one bordered strip of four cells: line icon, short title, one sentence, mono source file.
5. **Features** – sticky intro on the left; on the right a numbered index list (`01…09`) of real features with inline
   `code` for IDs, formats and links.
6. **How it works** – four nodes on a dashed amber line (share code → encrypt on device → carry over the network → fetch
   and open); nodes light up as the section scrolls in. Under it a mono "what the server/relay sees" panel.
7. **Security** – red alpha/audit warning strip; two panels "Protects against" (green square) and "Does not protect
   against" (red square) taken from the threat model; a crypto spec table; status badges with coloured dots.
8. **App preview** – left a tablist of real screens (number, name, one line); right a phone with the selected screenshot
   inside two thin rings; a mono note about how the screenshots were made.
9. **Download** – three panels (Android, Windows/desktop, release notes) with file names and sizes, then a full-width
   terminal panel with the checksum and certificate commands and a copy button.
10. **Docs** – link list to the real spec documents (mono name + one-line description) beside an FAQ accordion.
11. **Open source CTA** – one big panel: "Read the code. *Then trust it.*", repository / issues / private vulnerability
    report buttons, licence line.
12. **Footer** – mark, one-line description, four link columns, a mono line "This site uses no cookies and no analytics."

## 4. Signature interaction: scroll to lock

One sticky stage (`#seq` = 100vh + 140vh, `.stick` = sticky 100vh) holds the canvas, the hero copy and the final line.
A single progress value `p` (0→1 over the extra scroll) drives everything, so scrolling back up rewinds it exactly.

| Phase | p | Behaviour |
|---|---|---|
| Start | 0 | Lock at the right of centre, small (0.62), turned −0.55 rad, shackle lifted 0.55 and swung −1 rad around its long leg, slow float. Low glow. |
| Approach | 0 → .55 | Eased: moves to the centre, scales to 0.8, straightens; hero copy and phone fade and rise away; floor rings and light shaft brighten. |
| Close | .55 → .68 | Shackle drops and swings home. |
| Confirm | at .68 | Short damped recoil (≈ 50 ms period), keyhole and brass band glow, an amber pulse ring expands from the floor and fades; readout turns `state: locked` in green. |
| Line | .66 → .78 | "SEALED ON YOUR DEVICE" + "YOUR PRIVACY. YOUR CONTROL." rise in under the lock. |

* Only `transform`/`opacity` and canvas drawing; no layout changes while scrolling.
* Basic (glow) materials use `toneMapped:false` so the amber stays amber under ACES tone mapping.
* Render only while the stage is on screen; cap DPR at 1.75 (1.5 on mobile) and use fewer segments on mobile.
* **Reduced motion:** the sequence collapses to one 100vh hero; the lock is drawn once, closed, at its start place; no
  float, no pulse, no seal line overlay.
* **No WebGL:** an inline SVG padlock replaces the canvas.

## 5. Build rules

* Standalone HTML with doctype/charset/viewport; three.js r128 from cdnjs before the inline script; Google Fonts for
  Space Grotesk, Inter, IBM Plex Mono; images as WebP next to the page; icons as an inline SVG sprite.
* All links must be real (repository, releases, issues, private advisories, spec files).
* Accessibility: WCAG AA contrast (amber never for small text alone); visible amber focus ring; tabs with arrow-key
  support; drawer button with `aria-expanded`; FAQ as `<details>`; the canvas is `aria-hidden`, the line under it is
  real text in an `aria-live` region.
* Responsive: ≥1200px full asymmetric hero (copy + lock + phone); 768–1199px phone smaller, values 2×2; <768px one
  column, phone and readout hidden in the hero, shorter sequence. No horizontal scroll at 360px. Touch targets ≥ 44px.
* No analytics, no cookies. Language choice may use `localStorage` (wrapped in try/catch).

## 6. Writing the copy

* Short, literal, checkable: "Messages are encrypted on your device and leave it only through Tor."
* Name the algorithms and formats; avoid adjectives.
* Write limits as plainly as features ("Does not protect against…", "not code-signed yet").
* Translate every string, including the ones written by JS (tab captions, readout state, copy button).

## 7. Finish checklist

- [ ] Every claim maps to a file in the product's repo; no forbidden phrases; alpha/audit status visible.
- [ ] Scroll to lock is in sync both ways, never stutters on fast scroll, and has reduced-motion and no-WebGL versions.
- [ ] Release data (version, sizes, SHA-256, certificate) matches the current release notes.
- [ ] Download, GitHub and docs links go to real targets.
- [ ] Keyboard: nav, drawer, tabs, FAQ and copy button work; focus is visible.
- [ ] No horizontal scroll at 360/390px; the hero lock does not cover the CTAs.
- [ ] Screenshots at 1440×900 and 390×844 (`node scripts/screenshots.mjs example/index.html screenshots`; it renders WebGL
      with SwiftShader, scrolls to 38/62/86% of the sequence and also captures reduced motion).
