# Components — glyph bench sheets

Copy-ready pieces from `example/`. Tokens (`--color-*`, `--space-*`, `--text-*`, `--radius-*`, `--dur-*`,
`--ease-out`) live in `example/tokens.css`; the reset and container in `example/base.css`.

## 1. Tokens that make the look

```css
:root {
  --color-paper: oklch(99% 0.002 260); --color-paper-2: oklch(96.5% 0.004 260); --color-paper-3: oklch(93% 0.006 260);
  --color-ink: oklch(16% 0.004 260); --color-ink-2: oklch(22% 0.006 260); --color-ink-3: oklch(28% 0.008 260);
  --color-muted: oklch(45% 0.012 260); --color-rule: oklch(89% 0.006 260);
  --color-on-ink: oklch(97% 0.003 260); --color-on-ink-muted: oklch(76% 0.008 260); --color-rule-dark: oklch(34% 0.008 260);
  --color-accent: oklch(44% 0.14 260); --color-accent-ink: oklch(99% 0.002 260); --color-focus: oklch(62% 0.16 260);
  /* the app's tool colours, lifted so ink icons read on them */
  --color-cobalt: oklch(71% 0.11 263); --color-coral: oklch(74% 0.123 28); --color-plum: oklch(76% 0.105 307);
  --color-saffron: oklch(78% 0.127 82); --color-emerald: oklch(77% 0.106 155); --color-turq: oklch(75% 0.097 185);
  --color-glyph: oklch(40% 0.006 260); --color-highlight: oklch(86% 0.13 90); --color-redact: oklch(16% 0.004 260);
  --font-display: "Onest", ui-sans-serif, system-ui, sans-serif; --font-body: "Onest", ui-sans-serif, system-ui, sans-serif;
  --radius-card: 16px; --radius-sheet: 32px; --radius-pill: 999px; --tracking-display: -0.035em;
}
```

## 2. Specimen fonts (the product's own)

```css
:root { --font-spec-tinos: "Spec Tinos", serif; --font-spec-dancing: "Spec Dancing Script", cursive; /* …one per font */ }
@font-face { font-family: "Spec Tinos"; src: url("assets/fonts/tinos.woff2") format("woff2"); font-display: swap; }
@font-face { font-family: "Spec Dancing Script"; src: url("assets/fonts/dancingscript.woff2") format("woff2"); font-display: swap; }
.f-tinos { font-family: var(--font-spec-tinos); } .f-dancing { font-family: var(--font-spec-dancing); }
```

The "Spec" prefix keeps them apart from any locally installed copy, so the page always shows the files the app ships.

## 3. Sheets over a dark bench

```css
body { background: var(--color-ink); color: var(--color-on-ink); }
.sheet { position: relative; background: var(--color-paper); color: var(--color-ink);
  border-radius: var(--radius-sheet) var(--radius-sheet) 0 0; margin-top: calc(-1 * var(--radius-sheet)); }
.dark  { position: relative; border-radius: var(--radius-sheet) var(--radius-sheet) 0 0; margin-top: calc(-1 * var(--radius-sheet)); }
.on-ink { background: var(--color-ink); color: var(--color-on-ink); }
```

Order the sections dark → sheet → sheet (flat join) → dark → sheet; each rounded top overlaps the one before.

## 4. Pills

```css
.btn { display: inline-flex; align-items: center; justify-content: center; min-height: 48px; padding: 0 var(--space-lg);
  border: 2px solid var(--color-ink); border-radius: var(--radius-pill); background: transparent; color: var(--color-ink);
  font: 700 var(--text-md)/1 var(--font-body); white-space: nowrap; text-decoration: none; cursor: pointer;
  transition: background-color var(--dur-short) var(--ease-out), transform var(--dur-micro) var(--ease-out); }
.btn:hover { background: var(--color-paper-3); }
.btn:active { transform: translateY(1px); }
.btn:focus-visible { outline: 2px solid var(--color-focus); outline-offset: 3px; }
.btn--primary { background: var(--color-accent); border-color: var(--color-accent); color: var(--color-accent-ink); }
.on-ink .btn { border-color: var(--color-on-ink); color: var(--color-on-ink); }
.on-ink .btn--primary { background: var(--color-on-ink); color: var(--color-ink); }   /* white pill on black */
.round { display: inline-grid; place-items: center; width: 48px; height: 48px; border-radius: 50%;
  border: 2px solid currentColor; background: transparent; color: inherit; cursor: pointer; }
```

## 5. Hero: glyph mosaic + scan slider

```html
<div class="bench" data-loop id="glyphs">
  <div class="mosaic" aria-hidden="true">
    <span class="f-tinos">P</span><span class="f-dancing lit h-saffron">D</span><span class="f-cousine">F</span><span class="f-dejavuserif">&amp;</span>
    <!-- …16 tiles: the product name plus telling glyphs (§ ¶ ß ğ ب), 3–4 of them .lit in tool hues -->
  </div>
  <div class="ba" id="ba">
    <img src="assets/page-scan.webp" width="1180" height="1670" alt="A crooked, grey scan of a one-page proposal">
    <div class="ba__after">
      <img src="assets/page-after.webp" width="1180" height="1670" alt="The same page after OCR, with a word found by search">
      <span class="hit" aria-hidden="true"></span>
    </div>
    <span class="ba__tag ba__tag--l">Scan</span><span class="ba__tag ba__tag--r">After OCR</span>
    <div class="ba__line"><span class="ba__knob"><svg class="i" aria-hidden="true"><use href="#i-arrows"/></svg></span></div>
    <input type="range" min="0" max="100" value="46" aria-label="Compare the scan with the page after OCR">
  </div>
</div>
```

```css
.bench { position: relative; height: min(660px, calc(100dvh - var(--nav-h) - 170px)); min-height: 440px; }
.mosaic { position: absolute; inset: 0; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr));
  grid-template-rows: repeat(4, minmax(0, 1fr)); gap: var(--space-xs); }
.mosaic span { display: grid; place-items: center; overflow: hidden; border-radius: var(--radius-card);
  background: var(--color-ink-2); color: var(--color-glyph); font-size: clamp(4rem, 8vw, 8.5rem); line-height: 1;
  user-select: none; transition: opacity var(--dur-long) var(--ease-out); }
.mosaic span:nth-child(3n) { background: var(--color-ink); box-shadow: inset 0 0 0 1px var(--color-rule-dark); }
.mosaic span.lit { color: var(--color-ink); background: var(--h); }
.mosaic span.swap { opacity: 0; }
.ba { position: absolute; left: 50%; top: 50%; height: 88%; aspect-ratio: 1180 / 1670; translate: -50% -50%; rotate: -3deg;
  border-radius: 4px; background: var(--color-paper); box-shadow: var(--shadow-float); --cut: 46%; touch-action: pan-y; z-index: 2; }
.ba img { position: absolute; inset: 0; width: 100%; height: 100%; }
.ba__after { position: absolute; inset: 0; clip-path: inset(0 0 0 var(--cut)); }
.ba__line { position: absolute; top: -12px; bottom: -12px; left: var(--cut); width: 3px; margin-left: -1.5px;
  background: var(--color-cobalt); pointer-events: none; }
.ba__knob { position: absolute; top: 50%; left: 50%; width: 48px; height: 48px; translate: -50% -50%; border-radius: 50%;
  background: var(--color-on-ink); color: var(--color-ink); box-shadow: var(--shadow-knob); display: grid; place-items: center; }
.ba input[type="range"] { position: absolute; inset: 0; width: 100%; height: 100%; margin: 0; opacity: 0; cursor: ew-resize; z-index: 3; }
.ba:has(input:focus-visible) .ba__knob { outline: 3px solid var(--color-cobalt); outline-offset: 3px; }
```

```js
const ba = document.querySelector('#ba'), cut = ba.querySelector('input');
const setCut = () => ba.style.setProperty('--cut', cut.value + '%');
cut.addEventListener('input', setCut); setCut();
```

Making the "before" scan from the clean page (Pillow):

```python
from PIL import Image, ImageFilter, ImageOps
import random
im = Image.open('page-after.png').convert('L')
im = ImageOps.autocontrast(im, cutoff=1).point(lambda v: 70 + v * 0.62)           # grey, low contrast
im = im.rotate(-1.2, resample=Image.BICUBIC, fillcolor=205).filter(ImageFilter.GaussianBlur(1.1))
noise = Image.effect_noise(im.size, 18).convert('L')
im = Image.blend(im, noise, 0.08)
ImageOps.colorize(im, black='#2b2925', white='#e2ddd2').save('page-scan.webp', quality=78)
```

## 6. Glyph swap + loop controller

```js
const tiles = [...document.querySelectorAll('.mosaic span')];
const CLS = ['f-tinos', 'f-inter', 'f-arimo', 'f-cousine', 'f-noto', 'f-dejavu', 'f-dejavuserif', 'f-dejavumono', 'f-dancing'];
const CHARS = 'PDFWerkstatß§¶&ğüçşöä@'.split('');
let glyphTimer = null;
function swapOne() {
  const t = tiles[Math.floor(Math.random() * tiles.length)];
  t.classList.add('swap');
  setTimeout(() => { t.classList.remove(...CLS, 'f-arabic'); t.classList.add(CLS[Math.floor(Math.random() * CLS.length)]);
    t.textContent = CHARS[Math.floor(Math.random() * CHARS.length)]; t.classList.remove('swap'); }, 420);
}
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
document.querySelectorAll('[data-loop]').forEach((el) => {
  const btn = el.querySelector('[data-loop-toggle]') || document.querySelector(`[data-loop-toggle][data-for="${el.id}"]`);
  const s = { seen: false, hover: false, focus: false, held: reduce };
  const sync = () => {
    const run = s.seen && !s.hover && !s.focus && !s.held;
    el.querySelectorAll('video').forEach((v) => (run ? v.play().catch(() => {}) : v.pause()));
    if (el.id === 'glyphs') { clearInterval(glyphTimer); glyphTimer = run ? setInterval(swapOne, 2400) : null; }
    if (btn) { btn.setAttribute('aria-label', (s.held ? 'Play ' : 'Pause ') + (el.id === 'glyphs' ? 'the glyphs' : 'the video'));
      btn.querySelector('use').setAttribute('href', s.held ? '#i-play' : '#i-pause'); }
  };
  if (btn) btn.addEventListener('click', () => { s.held = !s.held; sync(); });
  if (el.id !== 'glyphs') [['pointerenter', 'hover', true], ['pointerleave', 'hover', false], ['focusin', 'focus', true], ['focusout', 'focus', false]]
    .forEach(([t, k, v]) => el.addEventListener(t, () => { s[k] = v; sync(); }));
  new IntersectionObserver(([e]) => { s.seen = e.isIntersecting; sync(); }).observe(el);
});
```

## 7. Tool strip and rail

```html
<div class="container strip">
  <button class="round" type="button" data-loop-toggle data-for="glyphs" aria-label="Pause the glyphs"><svg class="i"><use href="#i-pause"/></svg></button>
  <ul aria-label="Jump to a tool">
    <li><a href="#try" data-tab="t-ocr"><span class="hue h-turq"><svg class="i"><use href="#i-scan"/></svg></span>OCR in 14 languages</a></li>
  </ul>
</div>

<ul class="rail" tabindex="0" aria-label="Tools, scroll sideways">
  <li><div class="rail-head"><span class="hue h-cobalt"><svg class="i"><use href="#i-text"/></svg></span>Edit PDF</div>
    <figure class="media"><img data-shot src="assets/pane-edit.webp" alt="The Edit PDF panel" loading="lazy"><figcaption>Replace words in place</figcaption></figure></li>
</ul>
```

```css
.strip a { display: inline-flex; align-items: center; gap: var(--space-sm); min-height: 56px; padding: var(--space-xs) var(--space-md) var(--space-xs) var(--space-xs);
  border-radius: var(--radius-card); background: var(--color-ink-2); color: var(--color-on-ink); font-weight: 700; text-decoration: none; white-space: nowrap; }
.hue { display: inline-grid; place-items: center; width: 32px; height: 32px; border-radius: 8px; background: var(--h); color: var(--color-ink); }
.h-turq { --h: var(--color-turq); } /* …one per tool hue */
.rail { display: grid; grid-auto-flow: column; grid-auto-columns: minmax(15rem, 19%); gap: var(--space-md); list-style: none; margin: 0;
  padding: 0 max(var(--gutter), calc((100% - var(--container)) / 2 + var(--gutter))) var(--space-sm);
  overflow-x: auto; scroll-snap-type: x mandatory; scroll-padding-inline: var(--gutter); overscroll-behavior-x: contain; }
.rail > li { scroll-snap-align: start; display: flex; flex-direction: column; border-radius: var(--radius-card); background: var(--color-paper-2); overflow: hidden; }
.rail .media { position: relative; height: 420px; margin: 0; }
.rail .media img, .rail .media video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.rail .media img[data-shot] { object-position: top center; }
.rail .media figcaption { position: absolute; left: var(--space-sm); right: var(--space-sm); bottom: var(--space-sm);
  padding: var(--space-xs) var(--space-sm); border-radius: 10px; background: var(--color-paper); color: var(--color-ink); font-size: var(--text-sm); }
```

The rail's side padding lines its first card up with the container while letting it scroll to the window edge.

## 8. Try card: chips + tabs

```js
const tabs = [...document.querySelectorAll('[role=tab]')];
const show = (t, focus) => {
  tabs.forEach((x) => { const on = x === t; x.setAttribute('aria-selected', on); x.tabIndex = on ? 0 : -1;
    document.getElementById(x.getAttribute('aria-controls')).hidden = !on; });
  if (focus) t.focus();
};
tabs.forEach((t, i) => {
  t.addEventListener('click', () => show(t));
  t.addEventListener('keydown', (e) => { const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (d) { e.preventDefault(); show(tabs[(i + d + tabs.length) % tabs.length], true); } });
});
show(tabs[0]);
document.querySelectorAll('[data-tab]').forEach((a) => a.addEventListener('click', () => show(document.getElementById(a.dataset.tab))));
```

```css
.chips button { display: inline-flex; align-items: center; gap: var(--space-xs); min-height: 44px; padding: 0 var(--space-md) 0 var(--space-xs);
  border: 2px solid var(--color-rule); border-radius: var(--radius-pill); background: var(--color-paper); color: var(--color-ink); font-weight: 700; cursor: pointer; }
.chips button .hue { width: 28px; height: 28px; border-radius: 50%; }
.chips button[aria-selected="true"] { background: var(--color-ink); border-color: var(--color-ink); color: var(--color-on-ink); }
.stagecard { border-radius: var(--radius-sheet); background: var(--color-paper-2); padding: var(--space-2xl); }
.panel { display: grid; grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); gap: var(--space-2xl); }
.panel + .panel { margin-top: var(--space-2xl); padding-top: var(--space-2xl); border-top: 1px solid var(--color-rule); } /* no-JS: all panels stacked */
.js .panel + .panel { margin-top: 0; padding-top: 0; border-top: 0; }
```

Redaction demo — the words are buttons; pressed ones become a bar whose strength follows a slider:

```html
<p class="redactable" id="redactable">Invoice for <button type="button" class="rd" aria-pressed="false">Example Studio</button> …</p>
<label class="range">Redaction fill opacity <input type="range" id="fill" min="20" max="100" value="100"> <span id="fillOut">100%</span></label>
```

```css
.rd { padding: 0 2px; border: 0; border-radius: 2px; background: color-mix(in oklab, var(--color-coral) 30%, var(--color-paper)); color: inherit; font: inherit; cursor: pointer; }
.rd[aria-pressed="true"] { color: transparent; background: color-mix(in oklab, var(--color-redact) calc(var(--fill, 1) * 100%), var(--color-paper)); }
```

```js
document.querySelectorAll('.rd').forEach((b) => b.addEventListener('click', () => b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') !== 'true')));
fill.addEventListener('input', (e) => { redactable.style.setProperty('--fill', e.target.value / 100); fillOut.textContent = e.target.value + '%'; });
```

Field with the label inside (copies the editor's own controls):

```css
.field { position: relative; display: flex; flex-direction: column; justify-content: end; min-width: 11rem; height: 52px;
  padding: 0 var(--space-md) var(--space-xs); border: 2px solid var(--color-muted); border-radius: 12px; background: var(--color-paper); }
.field label { position: absolute; left: var(--space-md); top: var(--space-2xs); font-size: .75rem; font-weight: 500; color: var(--color-muted); }
.field select, .field input { border: 0; padding: 0; background: transparent; color: var(--color-ink); outline: 0; min-width: 0; }
.field:focus-within { outline: 2px solid var(--color-focus); outline-offset: 2px; }
```

## 9. Type card

```html
<div class="typecard on-ink" id="type">
  <div class="typecard-top">
    <h2>Ten fonts ship inside the app.</h2>
    <div class="field"><label for="specText">Type your own line</label><input id="specText" type="text" value="Page three, fixed." maxlength="48"></div>
  </div>
  <p class="typeline f-tinos" id="typeline" aria-live="polite">Page three, fixed.</p>
  <div class="typefoot">
    <p class="typename" id="typename">Tinos<small>Metric match for Times</small></p>
    <div class="typenav">
      <button class="round" type="button" id="prevFont" aria-label="Previous font">…</button>
      <div class="dots" id="dots" role="group" aria-label="Fonts"></div>
      <button class="round" type="button" id="nextFont" aria-label="Next font">…</button>
    </div>
  </div>
</div>
```

```css
.typecard { border-radius: var(--radius-sheet); padding: var(--space-2xl); display: grid; grid-template-columns: minmax(0, 1fr);
  gap: var(--space-xl); overflow: hidden; }                      /* minmax(0,1fr): a long line never widens the page */
.typeline { margin: 0; font-size: clamp(3rem, 9.4vw, 9.5rem); line-height: 1.12; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.dots { display: flex; flex-wrap: wrap; gap: var(--space-2xs); min-width: 0; }
.dots button { width: 28px; height: 44px; border: 0; padding: 0; background: transparent; display: grid; place-items: center; cursor: pointer; }
.dots button::before { content: ""; width: 10px; height: 10px; border-radius: 50%; background: var(--color-ink-3); }
.dots button[aria-current="true"]::before { background: var(--color-on-ink); }
```

```js
const FONTS = [['f-tinos', 'Tinos', 'Metric match for Times'], ['f-inter', 'Inter', 'Screen sans'], /* … */ ['f-dancing', 'Dancing Script', 'Handwritten']];
let fi = 0;
FONTS.forEach((f, i) => { const b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', f[1]);
  b.addEventListener('click', () => setFont(i)); dots.append(b); });
function setFont(i) {
  fi = (i + FONTS.length) % FONTS.length; const [cls, name, note] = FONTS[fi];
  typeline.className = 'typeline ' + cls;
  typename.innerHTML = name + '<small>' + note + '</small>';
  [...dots.children].forEach((b, j) => b.setAttribute('aria-current', j === fi));
}
prevFont.onclick = () => setFont(fi - 1); nextFont.onclick = () => setFont(fi + 1);
specText.addEventListener('input', (e) => { typeline.textContent = e.target.value || ' '; });
setFont(0);
```

## 10. Dark bench grid

```css
.reel video { width: 100%; aspect-ratio: 21 / 9; object-fit: cover; border-radius: var(--radius-sheet); }
.cards { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 4fr) minmax(0, 4fr); grid-template-rows: repeat(2, minmax(260px, auto)); gap: var(--space-md); }
.card { display: flex; flex-direction: column; gap: var(--space-sm); padding: var(--space-xl); border-radius: var(--radius-card); background: var(--color-ink-2); }
.card h3 { margin-top: auto; }                                   /* icon top, title and fact at the bottom */
.grid-video { position: relative; grid-column: 3; grid-row: 1 / 3; margin: 0; border-radius: var(--radius-card); overflow: hidden; }
.grid-video video { width: 100%; height: 100%; object-fit: cover; }
@media (max-width: 60rem) { .cards { grid-template-columns: minmax(0, 1fr); grid-template-rows: none; }
  .grid-video { grid-column: auto; grid-row: auto; aspect-ratio: 4 / 5; } }
```
