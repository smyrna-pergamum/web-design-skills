# Components

Copy-ready building blocks for the noir gradient law-firm site. Every snippet comes from the working reference in
`../example/index.html`; open it for responsive rules and the complete content.

## Contents

1. [Tokens and fonts](#1-tokens-and-fonts)
2. [Shared SVG defs: gradient, monogram, arrow, icon](#2-shared-svg-defs)
3. [Buttons, eyebrow, section marker, rail](#3-buttons-eyebrow-section-marker-rail)
4. [Header and full-screen menu](#4-header-and-full-screen-menu)
5. [Hero with hollow monogram and masked statue](#5-hero)
6. [Gradient-border cards and the marquee](#6-gradient-border-cards-and-marquee)
7. [Mission banner](#7-mission-banner)
8. [Duotone + halftone photo treatment and scratch lines](#8-duotone--halftone)
9. [3D review carousel](#9-3d-review-carousel)
10. [Contact form](#10-contact-form)
11. [Language switch](#11-language-switch)

---

## 1. Tokens and fonts

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Unbounded:wght@500;700;800&family=Montserrat:wght@300;400;600;700;900&display=swap">
```

```css
:root{
  color-scheme:dark;
  --black:#050505; --card:#111111; --line:#262626;
  --white:#fff; --text:#e9e6e1; --muted:#a8a29a;
  --yellow:#febd01; --amber:#f7a701; --orange:#f26b0f; --red:#b12418; --signal:#e8501a;
  --fire:linear-gradient(90deg,#febd01 0%,#f7a701 22%,#f26b0f 58%,#b12418 100%);
  --fire-diag:linear-gradient(135deg,#febd01 0%,#f26b0f 55%,#b12418 100%);
  --f-display:"Unbounded","Archivo Black",Impact,sans-serif;
  --f-body:"Montserrat","Helvetica Neue",Arial,sans-serif;
}
body{background:var(--black);color:var(--text);font:400 17px/1.65 var(--f-body);overflow-x:clip}
h1,h2{font-family:var(--f-display);font-weight:700;text-transform:uppercase;color:#fff;line-height:.98;letter-spacing:-.01em}
```

## 2. Shared SVG defs

```html
<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
  <linearGradient id="fire" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#febd01"/><stop offset=".25" stop-color="#f7a701"/>
    <stop offset=".6" stop-color="#f26b0f"/><stop offset="1" stop-color="#b12418"/>
  </linearGradient>
  <!-- the firm's initial as a thick outlined letter; swap the path for another letter -->
  <symbol id="mark" viewBox="0 0 60 52"><path d="M5 49 30 5 55 49M17 34h26" fill="none" stroke="url(#fire)" stroke-width="7"/></symbol>
  <symbol id="mark-dark" viewBox="0 0 60 52"><path d="M5 49 30 5 55 49M17 34h26" fill="none" stroke="#000" stroke-width="7"/></symbol>
  <symbol id="arrow" viewBox="0 0 30 10"><path d="M0 5h28M23 1l5 4-5 4" fill="none" stroke="currentColor" stroke-width="1.4"/></symbol>
  <symbol id="scales" viewBox="0 0 120 120">
    <path d="M60 14v86M38 104h44M24 30h72M60 14l-5 8h10z"/><path d="M24 30 10 64h28zM96 30 82 64h28z"/>
    <path d="M8 64c2 9 9 14 16 14s14-5 16-14zM80 64c2 9 9 14 16 14s14-5 16-14z"/>
  </symbol>
</defs></svg>
```

Neon icon: `<svg class="neon" viewBox="0 0 120 120"><use href="#scales"/></svg>` with
`.neon *{fill:none;stroke:url(#fire);stroke-width:5}` and
`filter:drop-shadow(0 0 14px rgba(242,107,15,.75)) drop-shadow(0 0 40px rgba(177,36,24,.5))`.

## 3. Buttons, eyebrow, section marker, rail

```css
.btn{display:inline-flex;align-items:center;gap:22px;padding:17px 26px;font:900 13px/1 var(--f-body);letter-spacing:.06em;
  text-transform:uppercase;text-decoration:none;color:#fff;background:var(--fire);border:0;cursor:pointer}
.btn svg{width:30px;height:10px}
.btn.ghost{background:none;color:var(--yellow);padding-inline:0}
.btn.solid{background:var(--yellow);color:#000}
.eyebrow{font:600 15px/1.3 var(--f-body);letter-spacing:.32em;text-transform:uppercase;color:var(--yellow)}
.marker{display:flex;align-items:center;gap:18px;margin-bottom:56px}
.marker .sq{width:56px;height:56px;background:var(--fire-diag);display:grid;place-items:center}
.marker span{font:500 14px var(--f-body);letter-spacing:.32em;text-transform:uppercase;color:var(--signal)}
.rail{position:relative;padding-left:clamp(28px,8vw,120px)}
.rail::before{content:"";position:absolute;left:clamp(8px,1.6vw,22px);top:0;bottom:0;width:1.5px;
  background:linear-gradient(180deg,var(--signal),rgba(177,36,24,.15) 70%,transparent)}
```

```html
<a class="btn" href="#contact">Book a free consultation <svg aria-hidden="true"><use href="#arrow"/></svg></a>
<div class="marker"><span class="sq"><svg aria-hidden="true"><use href="#mark-dark"/></svg></span><span>Where balance meets business</span></div>
```

## 4. Header and full-screen menu

```css
.topbar{position:fixed;inset:0 0 auto;height:4px;background:var(--fire);z-index:60}
header.site{position:fixed;top:4px;left:0;right:0;z-index:50;transition:background .3s}
header.site.solid{background:rgba(5,5,5,.88);backdrop-filter:blur(8px)}
.menu{position:fixed;inset:0;z-index:70;background:rgba(5,5,5,.97);display:grid;align-content:center}
.menu[hidden]{display:none}
.menu a{font:700 clamp(30px,5vw,58px)/1.15 var(--f-display);text-transform:uppercase;color:#fff;text-decoration:none}
.menu a:hover{background:var(--fire);-webkit-background-clip:text;background-clip:text;color:transparent}
```

```js
const menu=document.getElementById('menu'),openBtn=document.getElementById('menu-open'),closeBtn=document.getElementById('menu-close');
function setMenu(open){menu.hidden=!open;openBtn.setAttribute('aria-expanded',String(open));
  document.body.style.overflow=open?'hidden':'';(open?closeBtn:openBtn).focus();}
openBtn.onclick=()=>setMenu(true); closeBtn.onclick=()=>setMenu(false);
menu.addEventListener('click',e=>{if(e.target.closest('a'))setMenu(false)});
addEventListener('keydown',e=>{if(e.key==='Escape'&&!menu.hidden)setMenu(false)});
addEventListener('scroll',()=>document.querySelector('header.site').classList.toggle('solid',scrollY>40),{passive:true});
```

## 5. Hero

```html
<section class="hero">
  <svg class="bigA" viewBox="0 0 1000 900" aria-hidden="true">
    <path d="M90 880 430 40h140l340 840H760L500 230 240 880Z"/><path d="M330 640h340l-52-130H382Z"/>
  </svg>
  <div class="statue" aria-hidden="true"><img src="assets/justice-library.jpg" alt=""></div>
  <div class="wrap"><div class="copy">
    <p class="eyebrow">Business lawyers · Istanbul &amp; Berlin</p>
    <h1>Law that<br>holds<br>the <span class="x">line</span></h1>
    <div><a class="btn" href="#contact">Book a free consultation <svg><use href="#arrow"/></svg></a></div>
  </div></div>
</section>
```

```css
.hero{position:relative;min-height:min(100vh,940px);display:grid;align-items:center;padding-block:140px 80px;overflow:hidden}
.bigA{position:absolute;left:-6%;top:-4%;width:min(980px,90vw)}
.bigA path{fill:none;stroke:url(#fire);stroke-width:7;stroke-dasharray:2600;animation:draw 2.2s cubic-bezier(.6,0,.2,1) both}
@keyframes draw{from{stroke-dashoffset:2600}to{stroke-dashoffset:0}}
.statue{position:absolute;left:0;bottom:0;width:min(46vw,640px);height:94%;z-index:1;
  -webkit-mask-image:linear-gradient(90deg,#000 55%,transparent 98%);mask-image:linear-gradient(90deg,#000 55%,transparent 98%)}
.statue img{width:100%;height:100%;object-fit:cover;filter:grayscale(1) contrast(1.3) brightness(.85)}
.copy{position:relative;z-index:2;margin-left:auto;width:min(100%,720px);display:grid;gap:30px}
.hero h1{font-size:clamp(52px,7.6vw,108px)}
.hero h1 .x{background:var(--fire);-webkit-background-clip:text;background-clip:text;color:transparent}
```

## 6. Gradient-border cards and marquee

```css
/* any element: gradient border without extra markup */
.gborder{border:1.5px solid transparent;background:linear-gradient(var(--card),var(--card)) padding-box,var(--fire-diag) border-box}
.pill{width:230px;height:110px;border-radius:14px;display:grid;place-items:center;font:600 14px var(--f-body);letter-spacing:.24em;
  text-transform:uppercase;color:var(--yellow);border:1.5px solid transparent;
  background:linear-gradient(#070707,#070707) padding-box,var(--fire-diag) border-box}
.marquee{overflow:hidden;mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent)}
.track{display:flex;gap:16px;width:max-content;animation:slide 38s linear infinite}
.marquee:hover .track{animation-play-state:paused}
@keyframes slide{to{transform:translateX(-50%)}}
```

Put the list of pills twice in `.track` (second copy `aria-hidden="true"`) so the loop is seamless.

Photo card: `.pcard` (gradient 1.5px frame via padding + background) › `.in` (radius, overflow hidden, 340px high) ›
`.duo` image + `.txt` with an `h3` and a `p` that expands on `:hover` / `:focus-visible` (always open on phones).

## 7. Mission banner

```css
.mission{border-radius:22px;background:linear-gradient(90deg,#c12a14,#e2531a 45%,#f08a0c);color:#fff;
  padding:clamp(28px,5vw,58px) clamp(24px,6vw,72px);display:grid;grid-template-columns:.9fr auto 1.2fr;gap:48px;align-items:center}
.mission h3{font:700 clamp(26px,2.8vw,38px)/1.05 var(--f-display);text-transform:uppercase}
.mission .bar{width:1.5px;align-self:stretch;background:rgba(255,255,255,.6)}
```

## 8. Duotone + halftone

```css
.duo{position:relative;overflow:hidden;background:#000;isolation:isolate}
.duo img{width:100%;height:100%;object-fit:cover;filter:grayscale(1) contrast(1.25) brightness(.78)}
.duo::before{content:"";position:absolute;inset:0;z-index:1;mix-blend-mode:color;
  background:linear-gradient(160deg,rgba(254,189,1,.65),rgba(242,107,15,.45) 45%,rgba(163,25,91,.6))}
.duo::after{content:"";position:absolute;inset:0;z-index:2;opacity:.55;mix-blend-mode:multiply;
  background-image:radial-gradient(rgba(0,0,0,.75) 1px,transparent 1.7px);background-size:5px 5px}
.scratch{position:absolute;inset:0;z-index:3;pointer-events:none}
```

```js
// <svg class="scratch" data-seed="7" data-count="14"></svg> inside a positioned figure
document.querySelectorAll('svg.scratch').forEach(svg=>{
  let s=+svg.dataset.seed||1; const rnd=()=>(s=(s*16807)%2147483647)/2147483647;
  svg.setAttribute('viewBox','0 0 100 100'); svg.setAttribute('preserveAspectRatio','none');
  let d='';
  for(let i=0;i<(+svg.dataset.count||10);i++){
    const x=rnd()*100,y=rnd()*100,len=20+rnd()*60,ang=-.9+rnd()*.5;
    d+=`M${x.toFixed(1)} ${y.toFixed(1)}l${(Math.cos(ang)*len).toFixed(1)} ${(-Math.sin(ang)*len).toFixed(1)}`;
  }
  svg.innerHTML=`<path d="${d}" fill="none" stroke="#f5e663" vector-effect="non-scaling-stroke" style="stroke-width:1.2px" opacity=".85"/>`;
});
```

## 9. 3D review carousel

```css
.carousel{position:relative;height:470px;perspective:1400px}
.rcard{position:absolute;left:50%;top:0;width:min(340px,82vw);height:440px;margin-left:calc(min(340px,82vw) / -2);
  border-radius:26px;border:1.5px solid #e9e6e1;background:#000;padding:40px 34px 30px;text-align:center;
  display:grid;grid-template-rows:auto 1fr auto auto;gap:18px;transition:transform .6s cubic-bezier(.3,.7,.2,1),opacity .6s,filter .6s}
.rcard[data-pos="0"]{transform:none;z-index:3}
.rcard[data-pos="-1"]{transform:translateX(-82%) translateZ(-180px) rotateY(32deg);opacity:.55;filter:blur(1px);z-index:2}
.rcard[data-pos="1"]{transform:translateX(82%) translateZ(-180px) rotateY(-32deg);opacity:.55;filter:blur(1px);z-index:2}
.rcard[data-pos="-2"]{transform:translateX(-140%) translateZ(-360px) rotateY(40deg);opacity:0}
.rcard[data-pos="2"]{transform:translateX(140%) translateZ(-360px) rotateY(-40deg);opacity:0}
.rcard[data-pos="hidden"]{opacity:0;transform:translateZ(-500px);pointer-events:none}
```

```js
const cards=[...document.querySelectorAll('.rcard')]; let current=0;
function layout(){const n=cards.length;cards.forEach((c,i)=>{let d=(i-current+n)%n;if(d>n/2)d-=n;
  c.dataset.pos=Math.abs(d)<=2?String(d):'hidden';c.setAttribute('aria-hidden',String(d!==0));});}
const go=k=>{current=(current+k+cards.length)%cards.length;layout();};
prev.onclick=()=>go(-1); next.onclick=()=>go(1);
carousel.addEventListener('keydown',e=>{if(e.key==='ArrowLeft')go(-1);if(e.key==='ArrowRight')go(1);});
let sx=null; carousel.onpointerdown=e=>sx=e.clientX;
carousel.onpointerup=e=>{if(sx!==null&&Math.abs(e.clientX-sx)>40)go(e.clientX<sx?1:-1);sx=null};
layout();
```

Do not give the review's name element a class that is also used for a section (e.g. `.who`): the section padding
would leak into the card.

## 10. Contact form

Gradient-bordered form (`form.gborder`), two-column grid of labelled fields, a consent checkbox, inline error text and a
success note. In a template, `preventDefault()` and say that nothing was sent; in production, post to the firm's own
endpoint and keep the consent wording approved by the firm.

## 11. Language switch

Same pattern as the other skills in this library: English source text in the HTML, a dictionary
`{ "English text": "Türkçe metin" }`, a TreeWalker that stores each text node with its leading/trailing whitespace, and a
second map for `aria-label` / `alt`. Mapping a piece to `""` removes it (used when the other language needs fewer words in a
split headline). Remember the choice in `localStorage` inside `try/catch`.
