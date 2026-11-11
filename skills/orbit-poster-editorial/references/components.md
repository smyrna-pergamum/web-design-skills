# Components

Copy-ready building blocks for the orbit poster editorial site. Every snippet comes from the working reference in
`../example/index.html` (minified there); open it for the complete content and every breakpoint.

## Contents

1. [Tokens and fonts](#1-tokens-and-fonts)
2. [Three-line headline with mouse drift](#2-three-line-headline)
3. [Orbit universe and floating cards](#3-orbit-universe-and-floating-cards)
4. [Mouse field, cursor ring, magnetic buttons](#4-mouse-field-cursor-ring-magnetic-buttons)
5. [Particle network canvas](#5-particle-network-canvas)
6. [Blended photo poster with switcher](#6-blended-photo-poster)
7. [Route console tabs](#7-route-console-tabs)
8. [Support card with blended photo and cursor light](#8-support-card)
9. [Ticker and final call](#9-ticker-and-final-call)
10. [Motion toggle](#10-motion-toggle)

---

## 1. Tokens and fonts

```html
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900;1000&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
```

```css
:root{--ink:#101b22;--paper:#edece4;--orange:#ff6c3a;--muted:#9ca6a8;
  --sans:'DM Sans',Arial,sans-serif;--mono:'IBM Plex Mono',monospace;--px:0;--py:0}
body{margin:0;background:var(--ink);color:var(--paper);font-family:var(--sans);overflow-x:hidden}
.light{background:var(--paper);color:var(--ink)}
.eyebrow{font:9px var(--mono);letter-spacing:.06em;line-height:1.7}
h2{font-size:clamp(42px,5.2vw,78px);line-height:1.02;letter-spacing:-.065em;font-weight:800}
.wordmark{font:800 30px/1 var(--sans);letter-spacing:-.065em}.wordmark b{color:var(--orange)}
```

## 2. Three-line headline

```html
<h1><span class="title-line">SET YOUR</span><span class="title-line outline-title">WORLD</span>
  <span class="title-line orange-title">IN MOTION<span class="title-period">.</span></span></h1>
```

```css
.hero h1{font-size:clamp(66px,7.9vw,128px);line-height:.89;letter-spacing:-.075em;font-weight:900}
.title-line{display:block;transform:translate3d(calc(var(--px)*-5px),calc(var(--py)*-4px),0);transition:transform .6s cubic-bezier(.16,1,.3,1)}
.outline-title{color:transparent;-webkit-text-stroke:1px #a3aeaa;transform:translate3d(calc(var(--px)*7px),calc(var(--py)*5px),0)}
.orange-title{color:var(--orange);transform:translate3d(calc(var(--px)*-9px),calc(var(--py)*-6px),0)}
.title-period{color:#c6d9ab}
```

## 3. Orbit universe and floating cards

```html
<div class="universe">
  <div class="orbital-system">
    <div class="orbit orbit-one"></div><div class="orbit orbit-two"></div><div class="orbit orbit-three"></div>
    <div class="planet"><div class="planet-lat lat-one"></div>…<span class="planet-type">GO</span><div class="planet-glint"></div></div>
    <span class="satellite sat-one"></span><span class="orbital-label label-top">ONE GOAL. A THOUSAND ROUTES.</span>
  </div>
  <button class="floating-card destination">…<strong id="destination-city">VIENNA</strong>…</button>
  <a class="floating-card passport">…<span class="passport-stamp">YOUR<br>NEXT<br>CHAPTER</span>…</a>
  <a class="floating-card campus-card"><img src="assets/boarding-pass.jpg" alt="…"><span>BOARDING 06:40.</span></a>
</div>
```

```css
.universe{height:620px;position:relative;perspective:900px}
.orbital-system{position:absolute;width:490px;height:490px;left:50%;top:50%;margin:-240px 0 0 -245px;
  transform:rotateX(calc(var(--py)*-9deg)) rotateY(calc(var(--px)*13deg));transform-style:preserve-3d;
  transition:transform .6s cubic-bezier(.16,1,.3,1)}
.planet{width:330px;height:330px;border-radius:50%;position:absolute;left:80px;top:80px;overflow:hidden;
  background:radial-gradient(circle at 32% 26%,#ff9a59 0%,#fa7742 33%,#d04a28 65%,#5a251d 94%);
  box-shadow:inset -22px -16px 50px #28150e66,0 0 90px #ff6c3a13;transform:translateZ(45px);animation:planetFloat 9s ease-in-out infinite}
.orbit{position:absolute;inset:0;border:1px solid #a4b1aa4d;border-radius:50%}
.orbit-one{transform:rotate(-28deg) scaleY(.53);width:590px;left:-50px}
.orbit-three{border-style:dashed;transform:rotate(17deg) scale(.96)}
.floating-card{position:absolute;transition:transform .65s cubic-bezier(.16,1,.3,1);box-shadow:0 15px 40px #0004}
.destination{top:67px;right:4%;width:245px;background:var(--paper);color:var(--ink);
  transform:translate3d(calc(var(--px)*-23px),calc(var(--py)*-17px),60px) rotate(8deg)}
.passport{bottom:77px;left:1%;width:168px;height:216px;background:#c9d7ac;
  transform:translate3d(calc(var(--px)*22px),calc(var(--py)*18px),80px) rotate(-11deg)}
@keyframes planetFloat{0%,100%{translate:0 -7px}50%{translate:0 7px}}
```

Each card gets its own multiplier and rotation, so the cards separate in depth when the mouse moves.

## 4. Mouse field, cursor ring, magnetic buttons

```js
hero.addEventListener('pointermove', e => {
  if (!motion || !fine.matches) return;
  const r = hero.getBoundingClientRect();
  px = ((e.clientX - r.left) / r.width - .5) * 2; py = ((e.clientY - r.top) / r.height - .5) * 2;
  root.style.setProperty('--px', px.toFixed(3)); root.style.setProperty('--py', py.toFixed(3));
  coordX.textContent = String(Math.round((px + 1) * 50)).padStart(3, '0');
});
hero.addEventListener('pointerleave', () => { root.style.setProperty('--px', '0'); root.style.setProperty('--py', '0'); });

// cursor ring follows with easing (0.17) inside the shared animation frame
cx += (mx - cx) * .17; cy += (my - cy) * .17; cursor.style.left = cx + 'px'; cursor.style.top = cy + 'px';

// magnetic buttons
el.addEventListener('pointermove', e => { const r = el.getBoundingClientRect();
  el.style.transform = `translate(${(e.clientX - r.left - r.width/2) * .13}px,${(e.clientY - r.top - r.height/2) * .16}px)`; });
```

```css
.cursor-orbit{position:fixed;width:30px;height:30px;border:1px solid #f8895c99;border-radius:50%;z-index:100;
  pointer-events:none;transform:translate(-50%,-50%);mix-blend-mode:difference;transition:width .25s,height .25s}
.cursor-orbit.over{width:55px;height:55px;border-color:#fff8}
```

## 5. Particle network canvas

```js
const n = innerWidth < 650 ? 25 : 65;
points = Array.from({length:n}, () => ({x:Math.random()*w, y:Math.random()*h, vx:(Math.random()-.5)*.15, vy:(Math.random()-.5)*.15}));
function draw(){
  ctx.clearRect(0,0,w,h);
  for (let i = 0; i < points.length; i++){
    const p = points[i]; p.x += p.vx; p.y += p.vy; if (p.x<0||p.x>w) p.vx*=-1; if (p.y<0||p.y>h) p.vy*=-1;
    const dx = p.x-mouseX, dy = p.y-mouseY, d = Math.hypot(dx,dy);
    if (inHero && d < 120 && d > 0){ p.x += dx/d*.85; p.y += dy/d*.85; }          // pushed away
    ctx.fillStyle = i%6===0 ? 'rgba(255,108,58,.48)' : 'rgba(183,203,189,.24)'; ctx.fillRect(p.x,p.y,i%6?1:2,i%6?1:2);
    for (let j = i+1; j < points.length; j++){ const q = points[j], dist = Math.hypot(p.x-q.x,p.y-q.y);
      if (dist < 95){ ctx.strokeStyle = `rgba(151,178,158,${(1-dist/95)*.11})`; ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(q.x,q.y); ctx.stroke(); } }
    if (inHero && d < 180){ ctx.strokeStyle = `rgba(255,108,58,${(1-d/180)*.3})`; ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(mouseX,mouseY); ctx.stroke(); }
  }
}
// animate only while the hero is visible (IntersectionObserver) and motion is on
```

## 6. Blended photo poster

```html
<div class="discovery-board" data-theme="rail">
  <article class="city-poster tilt-card">
    <img class="poster-photo" id="poster-photo" src="assets/rail-station.jpg" alt="" aria-hidden="true">
    <span class="poster-coordinate">MODE 01 / RAIL · CITY CENTRE TO CITY CENTRE</span>
    <div class="poster-graphic" aria-hidden="true"><div class="city-sun"></div></div>
    <h3 id="poster-city">RAIL.</h3>
    <span class="poster-bottom">YOUR NEXT CHAPTER CAN START HERE.</span>
  </article>
  …details column…
</div>
```

```css
.city-poster{position:relative;background:#cbd4b2;min-height:530px;overflow:hidden;padding:28px 32px;isolation:isolate}
.poster-photo{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:-2;
  filter:grayscale(1) contrast(1.15) brightness(1.05);mix-blend-mode:multiply;opacity:.6;
  transition:opacity .5s,transform .8s cubic-bezier(.16,1,.3,1),filter .6s}
.city-poster:hover .poster-photo{opacity:.85;filter:grayscale(.15) contrast(1.05);transform:scale(1.04)}
.poster-photo.swap{opacity:0;transform:scale(1.08)}
.city-sun{border-radius:50%;width:280px;height:280px;background:var(--orange);position:absolute;right:-35px;top:140px;mix-blend-mode:multiply;z-index:-1}
.city-poster h3{position:relative;font-size:clamp(110px,12vw,174px);font-weight:1000;letter-spacing:-.09em;line-height:.79;
  margin-top:38px;word-break:normal;transform:translateZ(25px)}
.discovery-board[data-theme=air] .city-poster{background:#d8c4b5}
.discovery-board[data-theme=air] .city-sun{background:#8d9f87}
@media(max-width:650px){.city-poster h3{font-size:22vw}}
```

```js
function citySelect(i){
  const c = cities[i];                     // {id, name, poster, photo, tag, coordinate, headline, description, university}
  posterCity.innerHTML = c.poster; board.dataset.theme = c.id; destinationCity.textContent = c.name;
  const ph = document.querySelector('#poster-photo');
  if (ph.getAttribute('src') !== c.photo){ ph.classList.add('swap');
    setTimeout(() => { ph.src = c.photo; ph.onload = () => ph.classList.remove('swap'); }, motion ? 250 : 0); }
  // …update headline, copy, number, pressed state of the pills
}
```

The hero destination card, the "another possibility" button and the pills all call the same `citySelect`, so the
hero and the poster always show the same state.

## 7. Route console tabs

```js
function stepSelect(i){
  tabs.forEach((b,k) => { b.classList.toggle('active', k===i); b.setAttribute('aria-selected', String(k===i)); b.tabIndex = k===i ? 0 : -1; });
  panel.setAttribute('aria-labelledby', 'route-' + i); bigNumber.textContent = '0' + (i+1); /* …copy… */
}
tabs.forEach((b,i) => { b.addEventListener('click', () => stepSelect(i));
  b.addEventListener('keydown', e => { let n = i;
    if (e.key==='ArrowRight'||e.key==='ArrowDown') n=(i+1)%4; else if (e.key==='ArrowLeft'||e.key==='ArrowUp') n=(i+3)%4;
    else if (e.key==='Home') n=0; else if (e.key==='End') n=3; else return;
    e.preventDefault(); stepSelect(n); tabs[n].focus(); }); });
```

```css
.route-tabs{display:grid;grid-template-columns:repeat(4,1fr)}
.route-tabs .active{background:var(--orange);color:var(--ink);border-color:var(--orange)}
.route-big-number{font-size:195px;font-weight:800;letter-spacing:-.08em;color:#c2d3a3}
.route-orbit{width:300px;height:190px;border:1px solid #a1b98d77;border-radius:50%;position:absolute;transform:rotate(-30deg);animation:routeOrbit 25s linear infinite}
```

## 8. Support card

```html
<article class="support-card tilt-card">
  <div class="support-label"><span class="eyebrow">ATLASIO PLANNER</span><span class="support-badge">YOUR FIRST TRIP IS FREE</span></div>
  <span class="support-photo"><img src="assets/map-reader.jpg" alt="…" loading="lazy"></span>
  <h3>You’re in control.</h3><p>…</p><a class="text-link" href="#start">Start for free</a>
</article>
```

```css
.support-card{padding:28px 32px;background:#dbe1cd;position:relative;overflow:hidden;border:1px solid #bcc5b1}
.support-card:after{content:'';position:absolute;inset:0;pointer-events:none;opacity:0;transition:opacity .3s;
  background:radial-gradient(400px circle at var(--cx,50%) var(--cy,50%),#ffffff4d,transparent 65%)}
.support-card:hover:after{opacity:1}
.support-photo{display:block;height:190px;margin-top:22px;overflow:hidden;isolation:isolate}
.support-photo img{width:100%;height:100%;object-fit:cover;filter:grayscale(1) contrast(1.1);mix-blend-mode:multiply;transition:filter .6s,transform .8s}
.support-card:hover .support-photo img{filter:none;transform:scale(1.04)}
```

```js
// tilt + light position
el.addEventListener('pointermove', e => { const r = el.getBoundingClientRect(), x = (e.clientX-r.left)/r.width, y = (e.clientY-r.top)/r.height;
  el.style.setProperty('--tx', ((.5-y)*7)+'deg'); el.style.setProperty('--ty', ((x-.5)*9)+'deg');
  el.style.setProperty('--cx', (x*100)+'%'); el.style.setProperty('--cy', (y*100)+'%'); });
```

## 9. Ticker and final call

```css
.ticker{background:var(--orange);color:var(--ink);padding:13px 0;overflow:hidden;transform:rotate(-1.6deg) scale(1.02)}
.ticker>div{display:flex;gap:38px;width:max-content;animation:ticker 38s linear infinite}
.ticker span{font-size:25px;letter-spacing:-.04em;font-weight:800;white-space:nowrap}
@keyframes ticker{to{transform:translateX(-50%)}}
.final-section{background:var(--orange);color:var(--ink);position:relative;overflow:hidden}
.final-link{display:block;font-size:clamp(90px,13vw,190px);line-height:.86;letter-spacing:-.085em;font-weight:900;transition:letter-spacing .45s}
.final-link:hover{letter-spacing:-.065em}
.final-link em{font-style:normal;color:#943c22}
```

Repeat the ticker content twice so the −50% loop is seamless.

## 10. Motion toggle

```js
function setMotion(on){
  motion = on; document.body.classList.toggle('motion-off', !on);
  toggle.setAttribute('aria-pressed', String(on)); toggle.querySelector('span').textContent = on ? 'MOTION ON' : 'MOTION OFF';
  if (!on){ root.style.setProperty('--px','0'); root.style.setProperty('--py','0'); cursor.style.opacity = '0'; }
}
matchMedia('(prefers-reduced-motion:reduce)').addEventListener('change', e => setMotion(!e.matches));
```

```css
.motion-off *, .motion-off *:before, .motion-off *:after{animation-play-state:paused!important}
.motion-off .tilt-card{transform:none!important}
@media(pointer:coarse){.cursor-orbit{display:none!important}.tilt-card{transform:none!important}}
```
