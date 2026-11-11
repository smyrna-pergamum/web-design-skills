# Components

Copy-ready building blocks for the flight-path roadmap site. Every snippet comes from the working reference in
`../example/index.html`; open it for the complete content, responsive rules and all sections.

## Contents

1. [Tokens and fonts](#1-tokens-and-fonts)
2. [Plane cursor with contrail](#2-plane-cursor-with-contrail)
3. [Video hero with shade](#3-video-hero-with-shade)
4. [Boarding pass form](#4-boarding-pass-form)
5. [Flight world: route, camera, gates](#5-flight-world)
6. [HUD, gate card, toast, landing](#6-hud-gate-card-toast-landing)
7. [Ticket pricing tiers](#7-ticket-pricing-tiers)
8. [Split-flap departure board](#8-split-flap-departure-board)
9. [Impact section with video](#9-impact-section-with-video)
10. [Single-file export](#10-single-file-export)

---

## 1. Tokens and fonts

```html
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
```

```css
:root{
  --navy:#0B1530; --night:#060C1F; --line:rgba(255,255,255,.12);
  --orange:#FF6B2C; --orange-2:#FF9A5C; --cream:#FFF5EA; --paper:#FFFBF6;
  --text:#EAF0FF; --muted:#9AA8C8; --dark-text:#14203F; --dark-muted:#5B6787; --ok:#3DDC97;
  --display:"Bricolage Grotesque", system-ui, sans-serif; --mono:"JetBrains Mono", ui-monospace, monospace; --r:22px;
}
.btn{display:inline-flex;align-items:center;gap:10px;padding:14px 22px;border-radius:999px;font-weight:600;border:0;
  background:var(--orange);color:#fff;transition:transform .2s, box-shadow .2s}
.btn:hover{transform:translateY(-2px);box-shadow:0 12px 30px -10px var(--orange)}
:focus-visible{outline:3px solid var(--orange);outline-offset:3px}
```

The plane silhouette (nose to the right, reused everywhere via `<use href="#cplane">`):

```html
<path d="M38 0 C38 -3 34 -4 28 -4 L6 -4 L-8 -30 L-16 -30 L-8 -4 L-24 -4 L-32 -15 L-38 -15 L-34 0 L-38 15 L-32 15
  L-24 4 L-8 4 L-16 30 L-8 30 L6 4 L28 4 C34 4 38 3 38 0Z"/>
```

## 2. Plane cursor with contrail

```html
<canvas id="trail" aria-hidden="true"></canvas>
<div id="cursor" aria-hidden="true"><div class="ring"></div>
  <svg class="p" viewBox="-44 -44 88 88"><g id="cplane"><path d="…plane…" fill="#FF6B2C" stroke="#fff" stroke-width="2.5"/></g></svg></div>
```

```css
@media (pointer:fine){ body.plane-cursor, body.plane-cursor a, body.plane-cursor button{cursor:none} }
#trail{position:fixed;inset:0;pointer-events:none;z-index:90}
#cursor{position:fixed;left:0;top:0;width:44px;height:44px;margin:-22px 0 0 -22px;pointer-events:none;z-index:91;display:none}
#cursor .ring{position:absolute;inset:-10px;border:2px solid var(--orange);border-radius:50%;opacity:0;transform:scale(.6);transition:.25s}
#cursor.hover .ring{opacity:1;transform:scale(1)} #cursor.hide{opacity:0}
body.plane-cursor #cursor{display:block}
```

```js
if (matchMedia('(pointer: fine)').matches && !reduce){
  document.body.classList.add('plane-cursor');
  let mx=innerWidth/2, my=innerHeight/2, px=mx, py=my, ang=0, trail=[];
  addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; });
  document.addEventListener('mouseover', e => {
    cur.classList.toggle('hover', !!e.target.closest('a,button'));
    cur.classList.toggle('hide', !!e.target.closest('input,select'));   // keep the caret visible
  });
  (function loop(){
    const dx=mx-px, dy=my-py; px+=dx*.22; py+=dy*.22;
    if (Math.hypot(dx,dy) > 1.5){ let d=Math.atan2(dy,dx)-ang; d=Math.atan2(Math.sin(d),Math.cos(d)); ang+=d*.18; }
    cur.style.transform=`translate(${px}px,${py}px) rotate(${ang}rad)`;
    const now=performance.now();
    trail.push({x:px-Math.cos(ang)*18, y:py-Math.sin(ang)*18, a:ang, t:now});
    trail=trail.filter(p => now-p.t < 650);
    // draw two wing-tip lines offset ±11px perpendicular to the heading, gradient from transparent to white
    requestAnimationFrame(loop);
  })();
}
```

## 3. Video hero with shade

```html
<header class="hero">
  <video class="bg-video" src="assets/hero-wing.mp4" poster="assets/hero-wing.jpg" autoplay muted loop playsinline aria-hidden="true"></video>
  <div class="hero-shade" aria-hidden="true"></div>
  <div class="wrap">…headline + boarding pass…</div>
</header>
```

```css
.bg-video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0}
.hero-shade{position:absolute;inset:0;background:
  linear-gradient(90deg, rgba(6,12,31,.94) 0%, rgba(6,12,31,.72) 45%, rgba(6,12,31,.28) 100%),
  linear-gradient(180deg, rgba(6,12,31,.55) 0%, transparent 25%, transparent 70%, var(--night) 100%)}
```

```js
document.querySelectorAll('video.bg-video').forEach(v => {
  if (reduce){ v.removeAttribute('autoplay'); v.pause(); return; }
  new IntersectionObserver(([e]) => e.isIntersecting ? v.play().catch(()=>{}) : v.pause(), {threshold:.05}).observe(v);
});
```

## 4. Boarding pass form

Grid of main area + 120px stub. The punched notches are a CSS mask (so they show the video, not a fixed colour);
the drop shadow sits on a wrapper because a mask would clip a `box-shadow`.

```css
.pass-wrap{filter:drop-shadow(0 40px 50px rgba(0,0,0,.55))}
.pass{background:var(--paper);color:var(--dark-text);border-radius:var(--r);display:grid;grid-template-columns:1fr 120px;
  transform:rotate(2deg);transition:transform .5s cubic-bezier(.2,1.4,.4,1)}
.pass:hover,.pass:focus-within{transform:rotate(0) translateY(-4px)}
.pass{--m:radial-gradient(circle 12px at calc(100% - 121px) 0, transparent 97%, #000 100%) top/100% 51% no-repeat,
         radial-gradient(circle 12px at calc(100% - 121px) 100%, transparent 97%, #000 100%) bottom/100% 51% no-repeat;
  -webkit-mask:var(--m);mask:var(--m)}
.pass .stub{border-left:2px dashed #D9CFC2}
.stamp{position:absolute;right:140px;top:46%;transform:rotate(-14deg) scale(2.4);opacity:0;border:3px solid var(--ok);
  color:var(--ok);font-family:var(--mono);transition:all .45s cubic-bezier(.2,1.6,.4,1)}
.pass.checked .stamp{opacity:1;transform:rotate(-14deg) scale(1)}
.barcode{height:120px;background:repeating-linear-gradient(90deg,#14203F 0 2px,transparent 2px 4px,#14203F 4px 5px,transparent 5px 9px,#14203F 9px 12px,transparent 12px 14px)}
```

```js
$('#boarding').addEventListener('submit', e => {
  e.preventDefault();
  store.set('atl_name', state.name);                 // try/catch wrapper around localStorage
  $('#boarding').classList.add('checked');
  setTimeout(() => $('#flight').scrollIntoView({behavior: reduce ? 'auto' : 'smooth'}), 900);
});
// every [data-name] element, the HUD route and the landing city repaint on input
```

## 5. Flight world

```html
<section id="flight" aria-label="Your route to Germany in 8 steps">   <!-- height:1000vh -->
  <div class="sticky">                                                 <!-- position:sticky; top:0; height:100svh -->
    <div class="sunrise"></div><div class="farclouds"></div><svg id="world"></svg>
    …hud, card, toast, landing…
  </div>
</section>
```

```js
const W=4500, H=1000;   // world units; route stays between y 160 and 560 so the bottom card never covers it
const WP=[[180,560],[640,330],[1100,210],[1560,370],[2020,190],[2480,340],[2940,170],[3400,310],[3860,220],[4320,560]];
function catmull(p){ let d=`M${p[0][0]} ${p[0][1]}`;
  for (let i=0;i<p.length-1;i++){ const p0=p[i-1]||p[i], p1=p[i], p2=p[i+1], p3=p[i+2]||p2;
    d+=` C${p1[0]+(p2[0]-p0[0])/6} ${p1[1]+(p2[1]-p0[1])/6} ${p2[0]-(p3[0]-p1[0])/6} ${p2[1]-(p3[1]-p1[1])/6} ${p2[0]} ${p2[1]}`; }
  return d; }
// background route: dashed white; flown route: same d, orange, strokeDasharray = L
const L = done.getTotalLength(); done.style.strokeDasharray = L;

// gate fractions along the path
const N=1600, samples=[...Array(N+1)].map((_,i)=>{const p=done.getPointAtLength(L*i/N);return [p.x,p.y]});
const FR = WP.slice(1,-1).map(([x,y]) => { let b=0,bd=1e9; samples.forEach((s,i)=>{const d=(s[0]-x)**2+(s[1]-y)**2; if(d<bd){bd=d;b=i}}); return b/N; });

// scale world to viewport height
scale = vh/H; svg.setAttribute('width', W*scale); svg.setAttribute('height', vh);

function frame(){
  cur += (target-cur)*(reduce ? 1 : .1);           // target = scroll progress through #flight, 0..1
  const len=L*cur, pt=done.getPointAtLength(len),
        a=done.getPointAtLength(Math.max(0,len-2)), b=done.getPointAtLength(Math.min(L,len+2));
  plane.setAttribute('transform', `translate(${pt.x} ${pt.y}) rotate(${Math.atan2(b.y-a.y,b.x-a.x)*180/Math.PI})`);
  done.style.strokeDashoffset = L-len;
  const camX = Math.max(0, Math.min(pt.x*scale - vw*.4, W*scale - vw));
  svg.style.transform = `translateX(${-camX}px)`;  far.style.transform = `translateX(${-camX*.25}px)`;
  sunrise.style.opacity = Math.max(0,(cur-.55)/.45)*.9;
  requestAnimationFrame(frame);
}
```

## 6. HUD, gate card, toast, landing

```js
let idx=-1; FR.forEach((f,i)=>{ if (cur >= f-.004) idx=i; });
dots.forEach((d,i)=>d.classList.toggle('on', i<=idx));
bars.forEach((b,i)=>b.style.transform=`scaleX(${clamp01((cur-FR[i])/(FR[i+1]-FR[i]))})`);
miles.textContent = String(Math.round(cur*8000)).padStart(4,'0');
if (idx !== active){ if (idx > active) toast(idx); active = idx; setCard(idx); }   // card: add .swap, change text, remove .swap
const landed = cur > .975; landing.classList.toggle('show', landed); if (landed && !wasLanded) confetti();
```

```css
.card.swap{transform:translateY(14px) rotate(-1deg);opacity:0}
.missions span::before{content:"";width:14px;height:14px;border-radius:50%;border:1.5px solid #C9BBA8}
.missions span.done::before{background:var(--ok);border-color:var(--ok);box-shadow:inset 0 0 0 3px #E2F8EE}
.toast{transform:translateX(130%);transition:transform .5s cubic-bezier(.2,1.4,.4,1)} .toast.show{transform:none}
```

Mission chips get `.done` one after another (`250 + k*220` ms) after the card swaps in.

## 7. Ticket pricing tiers

```css
.classes{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
.ticket .perf{border-top:2px dashed #E3D7C7;margin:4px -32px;position:relative}
.ticket .perf::before,.ticket .perf::after{content:"";position:absolute;top:-13px;width:24px;height:24px;border-radius:50%;background:var(--cream)}
.ticket .perf::before{left:-12px}.ticket .perf::after{right:-12px}
.ticket.first{background:linear-gradient(160deg,#1B1530 0%,#0B1530 60%,#2A1E12 100%);border:1.5px solid rgba(233,196,106,.45)}
.ticket.first .price{color:#E9C46A}          /* "Price on request" */
.ticket .badge{position:absolute;top:-13px;right:24px;background:#E9C46A;color:#1B1530;border-radius:999px}
@media (max-width:1080px){.classes{grid-template-columns:1fr}}
```

## 8. Split-flap departure board

```js
const flap = s => `<span class="flap">${[...s].map(ch=>`<span data-c="${ch}">${ch===' '?'&nbsp;':ch}</span>`).join('')}</span>`;
const CH='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+';
function runFlaps(){ document.querySelectorAll('.flap span').forEach((s,i)=>{ const fin=s.dataset.c; if (fin===' ') return;
  let n = 8 + (i%5)*3; const iv=setInterval(()=>{ s.textContent=CH[Math.random()*CH.length|0];
  if (--n<=0){ clearInterval(iv); s.textContent=fin; } }, 55); }); }
// run once when the board enters the viewport (IntersectionObserver)
```

```css
.flap span{display:inline-grid;place-items:center;width:28px;height:40px;background:#111833;border-radius:4px;
  font-family:var(--mono);font-size:20px;color:#F7F3E8;position:relative}
.flap span::after{content:"";position:absolute;left:0;right:0;top:50%;height:1px;background:#05091A}
```

## 9. Impact section with video

```css
.impact{position:relative;overflow:hidden;background:var(--night)}
.impact .shade{position:absolute;inset:0;background:
  linear-gradient(90deg, rgba(6,12,31,.94) 0%, rgba(6,12,31,.7) 42%, rgba(6,12,31,.1) 100%),
  linear-gradient(180deg, var(--night) 0%, transparent 15%, transparent 85%, var(--night) 100%)}
.istep{background:rgba(255,255,255,.07);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,.14);border-radius:18px}
```

The video uses `preload="none"` (it is far down the page); the form only changes its button text.

## 10. Single-file export

To send the page as one file (e-mail, chat), inline the media. Keep the folder version in the repository.

```python
import base64, pathlib
src = pathlib.Path('example/index.html').read_text(encoding='utf-8')
for name, mime in [('hero-wing.mp4','video/mp4'),('impact-window.mp4','video/mp4'),
                   ('hero-wing.jpg','image/jpeg'),('impact-window.jpg','image/jpeg')]:
    b = base64.b64encode(pathlib.Path('example/assets/'+name).read_bytes()).decode()
    src = src.replace('assets/'+name, f'data:{mime};base64,{b}')
pathlib.Path('page-single-file.html').write_text(src, encoding='utf-8')
```
