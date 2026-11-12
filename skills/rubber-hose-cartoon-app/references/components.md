# Components — rubber-hose-cartoon-app

Copy-ready pieces from `example/index.html`. Class names match the example.

## 1. Tokens, fonts, paper

```html
<link href="https://fonts.googleapis.com/css2?family=Bangers&family=Fredoka:wght@400;500;600;700&family=Lilita+One&display=swap" rel="stylesheet">
```

```css
:root{
  --paper:#fff4d8;--paper2:#ffe9b3;--ink:#16120f;--muted:#5d5146;
  --red:#ec3b2f;--orange:#ff8a1f;--yellow:#ffd23f;--sky:#43b4ec;--sky2:#bfe7fb;--green:#3dbb6e;--pink:#ff8fb1;--wood:#d9934a;--wood2:#b8722f;
  --display:'Lilita One','Arial Black',Impact,sans-serif;
  --comic:'Bangers','Arial Black',Impact,sans-serif;
  --body:'Fredoka','Trebuchet MS',Arial,sans-serif;
  --line:4px solid var(--ink);
  --pop:6px 6px 0 var(--ink);
  --pop-sm:4px 4px 0 var(--ink);
}
html,body{overflow-x:clip}
body{margin:0;background:var(--paper);color:var(--ink);font:500 17px/1.6 var(--body)}
/* film grain + vignette, above everything, never clickable */
body:before{content:"";position:fixed;inset:0;pointer-events:none;z-index:90;opacity:.22;mix-blend-mode:multiply;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .35 0 0 0 0 .25 0 0 0 0 .12 0 0 0 .55 0'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E")}
body:after{content:"";position:fixed;inset:0;pointer-events:none;z-index:89;background:radial-gradient(ellipse at center,transparent 62%,#3b20080f 100%)}
a:focus-visible,button:focus-visible,summary:focus-visible{outline:4px solid var(--sky);outline-offset:4px;border-radius:8px}
```

## 2. Shared SVG: line boil, starburst, glove

Put once at the top of `<body>`.

```html
<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
  <filter id="boil" x="-10%" y="-10%" width="120%" height="120%">
    <feTurbulence id="boil-noise" type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="1" result="n"/>
    <feDisplacementMap in="SourceGraphic" in2="n" scale="3.2" xChannelSelector="R" yChannelSelector="G"/>
  </filter>
  <symbol id="starburst" viewBox="-100 -100 200 200">
    <polygon points="0,-96 18,-52 60,-76 48,-30 94,-30 58,0 94,30 48,30 60,76 18,52 0,96 -18,52 -60,76 -48,30 -94,30 -58,0 -94,-30 -48,-30 -60,-76 -18,-52" stroke="#16120f" stroke-width="7" stroke-linejoin="round"/>
  </symbol>
  <symbol id="glove" viewBox="-40 -40 80 80">
    <g stroke="#16120f" stroke-width="5" fill="#fff" stroke-linejoin="round">
      <rect x="-16" y="16" width="32" height="16" rx="6"/>
      <ellipse cx="-14" cy="-14" rx="9" ry="18" transform="rotate(-18 -14 -14)"/>
      <ellipse cx="2" cy="-20" rx="9" ry="19"/>
      <ellipse cx="17" cy="-14" rx="9" ry="17" transform="rotate(16 17 -14)"/>
      <circle cx="0" cy="2" r="22"/>
      <ellipse cx="-22" cy="4" rx="9" ry="14" transform="rotate(-40 -22 4)"/>
      <path d="M-6 -4 v12 M6 -4 v12" fill="none" stroke-width="3" stroke-linecap="round"/>
    </g>
  </symbol>
</defs></svg>
```

```js
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduce) { const n = document.querySelector('#boil-noise'); let seed = 1;
  setInterval(() => { seed = seed % 4 + 1; n.setAttribute('seed', seed); }, 120); }
```

Apply with `filter:url(#boil)` on the mascot, starbursts and icons only.

## 3. Buttons, tags, outlined headline

```css
.btn{--bg:var(--red);--fg:#fff;display:inline-flex;align-items:center;justify-content:center;gap:12px;background:var(--bg);color:var(--fg);
  border:var(--line);border-radius:999px;padding:14px 26px;font:400 20px/1 var(--display);text-decoration:none;
  box-shadow:var(--pop);transition:transform .12s,box-shadow .12s;min-height:56px;text-shadow:2px 2px 0 var(--ink)}
.btn:hover{transform:translate(-2px,-2px) rotate(-1.5deg);box-shadow:8px 8px 0 var(--ink);animation:boing .5s}
.btn:active{transform:translate(4px,4px);box-shadow:2px 2px 0 var(--ink)}
.btn.alt{--bg:#fff;--fg:var(--ink);text-shadow:none}
@keyframes boing{0%{scale:1 1}30%{scale:1.12 .86}50%{scale:.92 1.1}70%{scale:1.04 .96}100%{scale:1 1}}
.tag{display:inline-block;font:400 18px/1 var(--comic);letter-spacing:1.5px;background:var(--yellow);border:3px solid var(--ink);
  padding:7px 12px 5px;border-radius:6px;transform:rotate(-2deg);box-shadow:var(--pop-sm)}
.panel{background:#fff;border:var(--line);border-radius:22px;box-shadow:var(--pop)}
/* second headline line: outlined, words jump in turn */
.hero h1 .l2{display:block;color:var(--red);-webkit-text-stroke:4px var(--ink);paint-order:stroke fill;text-shadow:6px 6px 0 var(--ink);transform:rotate(1.5deg)}
.hero h1 .l2 span{display:inline-block;margin-right:.18em;animation:jump 2.4s ease-in-out infinite}
.hero h1 .l2 span:nth-child(2){animation-delay:.12s}.hero h1 .l2 span:nth-child(3){animation-delay:.24s}
@keyframes jump{0%,70%,100%{transform:none}80%{transform:translateY(-14px) rotate(-4deg)}90%{transform:translateY(2px) scale(1.06,.94)}}
```

## 4. Stage: ring target, mascot, bubble, starburst

```html
<div class="stage" aria-hidden="true">
  <div class="rings"></div>
  <div class="speedlines"><i></i><i></i><i></i></div>
  <svg class="mascot" viewBox="0 0 400 470">…legs, shoes, back card, body card with face, arms…</svg>
  <div class="bubble">HALLO!</div>
  <div class="burst"><svg><use href="#starburst" fill="#ffd23f"/></svg><span>100%<br>FREE!</span></div>
</div>
```

```css
.stage{position:relative;aspect-ratio:1/1;max-width:560px;width:100%}
.rings{position:absolute;inset:0;border-radius:50%;border:var(--line);box-shadow:var(--pop);overflow:hidden;
  background:repeating-radial-gradient(circle at 50% 50%,var(--red) 0 34px,var(--orange) 34px 68px,var(--yellow) 68px 102px,var(--sky) 102px 136px)}
.rings:after{content:"";position:absolute;inset:-50%;background:repeating-conic-gradient(from 0deg,#fff3 0 6deg,transparent 6deg 18deg);animation:spin 40s linear infinite}
@keyframes spin{to{transform:rotate(1turn)}}
.mascot{position:absolute;left:8%;top:6%;width:84%;filter:url(#boil);animation:bob 1.6s ease-in-out infinite;transform-origin:50% 95%}
@keyframes bob{0%,100%{transform:translateY(0) scale(1,1)}45%{transform:translateY(-16px) scale(.97,1.04)}90%{transform:translateY(0) scale(1.05,.95)}}
.mascot .wave{transform-origin:100px 205px;animation:wave .9s ease-in-out infinite alternate}   /* origin = shoulder */
@keyframes wave{from{transform:rotate(-14deg)}to{transform:rotate(16deg)}}
.mascot .blink{animation:blink 4s infinite;transform-origin:center;transform-box:fill-box}
@keyframes blink{0%,92%,100%{transform:scaleY(1)}95%{transform:scaleY(.08)}}
.bubble{position:absolute;background:#fff;border:var(--line);border-radius:28px;padding:10px 20px;font:400 30px/1 var(--comic);box-shadow:var(--pop-sm)}
.bubble:after{content:"";position:absolute;left:24px;bottom:-15px;width:26px;height:26px;background:#fff;
  border-right:var(--line);border-bottom:var(--line);transform:skewX(30deg) rotate(45deg)}
.burst{position:absolute;width:150px;height:150px;display:grid;place-items:center;text-align:center;font:400 22px/1 var(--comic);transform:rotate(-12deg)}
.burst svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible;filter:url(#boil)}
.burst span{position:relative}
```

**Drawing the mascot** (see the full SVG in the example):

* Limbs are single `path`s, `stroke-width:13`, `stroke-linecap:round`, no fill — that is the rubber hose.
* Gloves are `<use href="#glove">`, rotated to the pose; shoes are fat red blobs with a white shine ellipse.
* Eyes: tall white ellipses with a black pupil that has a wedge cut out (`fill-rule:evenodd`) — the pie-cut eye.
* Mouth: dark red shape, a white teeth band and a pink tongue; pink cheek ellipses.
* Group the face inside a `rotate(-4deg)` so the body feels hand-placed; put the waving arm in `<g class="wave">`.

## 5. Ticker band

```css
.ticker{background:var(--red);color:#fff;border-block:var(--line);overflow:hidden;transform:rotate(-1.2deg);margin:-14px -20px 0;position:relative;z-index:4}
.ticker-track{display:flex;width:max-content;animation:ticker 32s linear infinite}
.ticker span{font:400 30px/1 var(--comic);letter-spacing:2px;padding:14px 22px;white-space:nowrap;text-shadow:2px 2px 0 var(--ink)}
.ticker span:nth-child(3n){color:var(--yellow)}
@keyframes ticker{to{transform:translateX(-50%)}}
```

```js
const words = ['DER DIALEKT','DIE MUNDART','DAS WORT','WUSCH!' /* … */];
document.querySelector('#ticker').innerHTML = [...words, ...words].map(w => '<span>' + w + ' ★</span>').join('');
```

## 6. Starburst numbers

```html
<div class="number"><div class="burst" style="--r:-8deg"><svg><use href="#starburst" fill="#ec3b2f"/></svg><span><strong>1,436</strong></span></div><p>ready-made German<br>words in 10 units</p></div>
```

```css
.numbers{display:grid;grid-template-columns:repeat(4,1fr);gap:22px}
.number{text-align:center;display:grid;justify-items:center}
.number .burst{position:relative;width:190px;height:190px;transform:rotate(var(--r,-6deg))}
.number .burst strong{font:400 54px/1 var(--display);-webkit-text-stroke:3px var(--ink);paint-order:stroke fill;color:#fff;text-shadow:4px 4px 0 var(--ink)}
.number:hover .burst{animation:boing .5s}
```

## 7. Cartoon TV with channel switch

```html
<div class="tv">
  <svg class="tv-antenna" viewBox="0 0 120 72" aria-hidden="true">…two rods with coloured balls…</svg>
  <button class="screen" id="main-zoom" type="button" aria-label="Enlarge app screenshot">
    <img id="main-screenshot" src="assets/app-light.png" alt="…" width="1180" height="800">
    <span class="zoom-hint">ZOOM!</span>
  </button>
  <div class="tv-controls">
    <div class="knobs" aria-hidden="true"><i></i><i></i></div>
    <div class="segmented" role="group" aria-label="Screenshot theme"><button id="light-btn" aria-pressed="true">Light</button><button id="dark-btn" aria-pressed="false">Dark</button></div>
  </div>
</div>
```

```css
.tv{position:relative;background:var(--wood);border:var(--line);border-radius:34px;padding:26px 26px 64px;box-shadow:var(--pop);
  background-image:repeating-linear-gradient(90deg,transparent 0 22px,#0000000f 22px 25px)}
.tv:before,.tv:after{content:"";position:absolute;bottom:-34px;width:18px;height:40px;background:var(--ink);border-radius:6px;z-index:-1}
.tv:before{left:16%;transform:rotate(14deg)}.tv:after{right:16%;transform:rotate(-14deg)}
.screen{position:relative;border:var(--line);border-radius:24px/30px;overflow:hidden;padding:0;display:block;width:100%}
.screen:after{content:"";position:absolute;inset:0;pointer-events:none;
  background:repeating-linear-gradient(0deg,#0000 0 3px,#00000009 3px 4px),radial-gradient(ellipse at 30% 20%,#fff6 0,transparent 45%)}
.screen.switching img{animation:static .35s steps(4)}
@keyframes static{0%{filter:contrast(2) brightness(1.6) blur(2px)}50%{filter:grayscale(1) contrast(3)}100%{filter:none}}
```

```js
function setTheme(theme){ const scr = document.querySelector('#main-zoom');
  scr.classList.remove('switching'); void scr.offsetWidth; scr.classList.add('switching');   // restart animation
  document.querySelector('#main-screenshot').src = screens[theme]; /* + alt, aria-pressed, caption */ }
```

## 8. Flip card with squash and dust

```html
<div class="card-wrap">
  <div class="flipper" id="flipper">
    <div class="face front panel" id="card-front">…</div>
    <div class="face back panel" id="card-back" aria-hidden="true">…</div>
  </div>
  <p class="sr" id="card-live" aria-live="polite"></p>
  <button class="btn alt" id="flip-card" type="button" aria-pressed="false">Flip card ↻</button>
</div>
```

```css
.card-wrap{perspective:1400px;position:relative}
.flipper{position:relative;min-height:360px;transform-style:preserve-3d;transition:transform .7s cubic-bezier(.5,1.8,.4,.8)}
.flipper.flipped{transform:rotateY(180deg)}
.flipper.squish{animation:squish .7s}
@keyframes squish{0%{scale:1}25%{scale:.9 1.08}55%{scale:1.08 .92}80%{scale:.98 1.02}100%{scale:1}}
.face{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:40px 30px}
.face.front{background-image:repeating-linear-gradient(#fff 0 38px,#cbe7f7 38px 40px)}   /* index-card lines */
.face.back{background:var(--yellow);transform:rotateY(180deg)}
.puff{position:absolute;pointer-events:none;width:70px;height:70px;border-radius:50%;background:#fff;border:3px solid var(--ink);animation:puff .6s ease-out forwards;z-index:5}
@keyframes puff{from{transform:translate(-50%,-50%) scale(.2);opacity:1}to{transform:translate(calc(-50% + var(--dx)),calc(-50% + var(--dy))) scale(1);opacity:0}}
```

```js
function puffs(el){ if (reduce) return; const r = el.getBoundingClientRect(), host = el.parentElement, hr = host.getBoundingClientRect();
  for (let i = 0; i < 7; i++){ const p = document.createElement('span'); p.className = 'puff'; const a = Math.PI * 2 * i / 7;
    p.style.left = (r.left - hr.left + r.width/2 + Math.cos(a) * r.width * .42) + 'px';
    p.style.top  = (r.top - hr.top + r.height/2 + Math.sin(a) * r.height * .42) + 'px';
    p.style.setProperty('--dx', Math.cos(a) * 50 + 'px'); p.style.setProperty('--dy', Math.sin(a) * 40 + 'px');
    host.appendChild(p); setTimeout(() => p.remove(), 650); } }
```

On click: toggle `.flipped`, restart `.squish`, call `puffs`, swap `aria-hidden` on the faces, update the button label,
`aria-pressed` and the live line.

## 9. Wooden crates (Leitner boxes)

```html
<div class="leitner" role="group" aria-label="Leitner review intervals">
  <button type="button" class="crate" data-box="1" aria-pressed="true">
    <span class="flycard" aria-hidden="true">A</span>
    <span class="box"><span class="box-label">BOX 1</span><span class="box-time">1<small>day later</small></span><span class="box-level">First step</span></span>
  </button> …
</div>
```

```css
.leitner{display:grid;grid-template-columns:repeat(5,1fr);gap:18px;align-items:end;padding-top:70px}
.crate{position:relative;border:0;background:none;padding:0;text-align:center}
.crate .box{display:block;position:relative;background:var(--wood);border:var(--line);border-radius:10px;padding:18px 8px 16px;box-shadow:var(--pop-sm);
  background-image:repeating-linear-gradient(0deg,transparent 0 30px,var(--wood2) 30px 34px);transition:transform .25s cubic-bezier(.5,2,.5,.8)}
.crate .box:before{content:"";position:absolute;left:-4px;right:-4px;top:-16px;height:18px;background:var(--wood2);border:var(--line);
  border-radius:6px 6px 0 0;transform-origin:left bottom;transition:transform .3s cubic-bezier(.5,2,.5,.8)}   /* the lid */
.crate:nth-child(1) .box{min-height:120px} /* … rising to 200px for box 5 */
.flycard{position:absolute;left:50%;top:-58px;width:46px;height:58px;margin-left:-23px;background:#fff;border:3px solid var(--ink);border-radius:6px;
  opacity:0;transform:translateY(40px);transition:opacity .2s,transform .4s cubic-bezier(.5,2,.5,.8);font:400 20px/52px var(--comic)}
.crate[aria-pressed="true"] .box{background-color:var(--yellow);transform:translateY(-14px) rotate(-3deg)}
.crate[aria-pressed="true"] .box:before{transform:rotate(-28deg) translateY(-6px)}
.crate[aria-pressed="true"] .flycard{opacity:1;transform:translateY(-28px) rotate(-10deg)}
```

Use `min-height`, not `height`, so long captions in other languages never spill out of a crate.

## 10. Guide pieces: step coins, key caps, warning box

```css
.steps{list-style:none;padding:0;display:grid;grid-template-columns:repeat(5,1fr);gap:20px}
.step{position:relative;padding:44px 18px 20px}
.step:not(:last-child):after{content:"➜";position:absolute;right:-22px;top:46%;font:400 28px/1 var(--display);color:var(--red);-webkit-text-stroke:1.5px var(--ink)}
.step-no{position:absolute;left:16px;top:-26px;width:54px;height:54px;border-radius:50%;background:var(--red);color:#fff;border:var(--line);
  display:grid;place-items:center;font:400 32px/1 var(--display);text-shadow:2px 2px 0 var(--ink);box-shadow:var(--pop-sm)}
kbd{display:inline-block;font:700 14px/1 'Segoe UI',Arial,sans-serif;background:#fff;border:3px solid var(--ink);border-bottom-width:6px;border-radius:8px;padding:5px 9px 3px;min-width:34px;text-align:center}
.smartscreen{display:flex;align-items:center;gap:18px;background:#fff;border:var(--line);border-style:dashed;border-radius:18px;padding:16px 22px}
```

A file the visitor should be able to grab in one click links the raw file with `download`:

```html
<a class="btn" style="--bg:var(--green)" href="https://github.com/OWNER/REPO/raw/main/FILE.xlsx" download>Download Excel list</a>
```

## 11. FAQ as speech bubbles

```css
summary{list-style:none;cursor:pointer;background:#fff;border:var(--line);border-radius:18px;padding:14px 56px 14px 20px;font:400 22px/1.2 var(--display);box-shadow:var(--pop-sm);position:relative}
summary::-webkit-details-marker{display:none}
summary:after{content:"?";position:absolute;right:14px;top:50%;width:32px;height:32px;margin-top:-16px;border-radius:50%;background:var(--yellow);
  border:3px solid var(--ink);display:grid;place-items:center;font:400 22px/1 var(--comic);transition:transform .3s cubic-bezier(.5,2,.5,.8)}
details[open] summary:after{content:"!";transform:rotate(360deg);background:var(--red);color:#fff}
details p{position:relative;margin:18px 0 6px 34px;background:var(--paper);border:3px solid var(--ink);border-radius:18px;padding:16px 20px;animation:drop .4s cubic-bezier(.5,1.8,.5,.8)}
details p:before{content:"";position:absolute;left:28px;top:-12px;width:20px;height:20px;background:var(--paper);border-left:3px solid var(--ink);border-top:3px solid var(--ink);transform:rotate(45deg)}
@keyframes drop{from{transform:translateY(-12px) scale(.96);opacity:0}}
```

## 12. Iris-in download

```css
.download-sec{background:var(--ink);color:#fff;padding:90px 0;overflow:hidden}
.iris{position:relative;margin:auto;width:min(860px,100%);aspect-ratio:1/1;border-radius:50%;display:grid;place-items:center;text-align:center;
  background:repeating-radial-gradient(circle,var(--red) 0 46px,#b5241b 46px 92px);border:6px solid #000;box-shadow:0 0 0 14px #2a2420,0 0 0 18px #000}
.iris-inner{width:72%;aspect-ratio:1/1;border-radius:50%;background:var(--paper);color:var(--ink);border:var(--line);
  display:flex;flex-direction:column;align-items:center;justify-content:center;padding:6% 4%}
.iris-reveal{transition:clip-path 1.2s cubic-bezier(.6,0,.2,1)}
.js .iris-reveal{clip-path:circle(0% at 50% 50%)}
.js .iris-reveal.in{clip-path:circle(75% at 50% 50%)}
@media(max-width:700px){.iris{width:min(560px,128vw);margin-left:50%;transform:translateX(-50%)}.iris-inner{width:78%}}
```

```js
document.documentElement.classList.add('js');
const iris = document.querySelector('#iris');
function checkIris(){ const r = iris.getBoundingClientRect();
  if (r.top < innerHeight * .8 && r.bottom > 0){ iris.classList.add('in'); removeEventListener('scroll', checkIris); } }
if (reduce) iris.classList.add('in'); else { addEventListener('scroll', checkIris, { passive: true }); checkIris(); }
```

Keep extra links (file download, guide) *outside* the circle — on phones the circle edge cuts long lines.

## 13. Click onomatopoeia

```css
.zap{position:fixed;z-index:120;pointer-events:none;font:400 30px/1 var(--comic);color:var(--yellow);-webkit-text-stroke:2px var(--ink);paint-order:stroke fill;
  text-shadow:3px 3px 0 var(--ink);animation:zap .7s ease-out forwards;white-space:nowrap}
@keyframes zap{0%{transform:translate(-50%,-50%) scale(.2) rotate(var(--r));opacity:1}40%{transform:translate(-50%,-90%) scale(1.15) rotate(var(--r))}100%{transform:translate(-50%,-140%) scale(1) rotate(var(--r));opacity:0}}
```

```js
const zaps = ['ZACK!','PENG!','WUSCH!','BOING!','KLICK!','ZOING!','HUI!'];
if (!reduce) addEventListener('pointerdown', e => { if (e.target.closest('dialog')) return;
  const z = document.createElement('span'); z.className = 'zap'; z.textContent = zaps[Math.random() * zaps.length | 0];
  z.style.left = e.clientX + 'px'; z.style.top = e.clientY + 'px'; z.style.setProperty('--r', (Math.random() * 30 - 15) + 'deg');
  document.body.appendChild(z); setTimeout(() => z.remove(), 720); });
```

## 14. Reduced motion

```css
@media(prefers-reduced-motion:reduce){
  html{scroll-behavior:auto}
  *,*:before,*:after{animation:none!important;transition:none!important}
  .js .iris-reveal{clip-path:none}
}
```

## 15. Multi-language build (optional)

For several languages keep `assets/style.css` and `assets/app.js` shared and generate static pages from one template:

* Template placeholders `{{key}}`; a dictionary `{key: {de, en, tr}}`; strings may contain inline HTML.
* Strings the script needs (captions, alt texts, box texts) go into `<script>window.T={…}</script>` per page.
* Each page: `<html lang>`, `hreflang` alternates, a pill switcher with `aria-current="page"` on the current language.
* Root `index.html`: redirect by saved choice (`localStorage`) or `navigator.languages`, with plain links as fallback.
* Test the longest language first; German labels decide the nav breakpoints.
