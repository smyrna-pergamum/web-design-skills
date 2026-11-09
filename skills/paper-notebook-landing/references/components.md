# Components

Copy-ready building blocks for the paper-notebook landing page. Every snippet is taken from the working
reference in `../example/index.html`; open that file for the full context (responsive rules, every section filled with content).

## Contents

1. [Tokens and fonts](#1-tokens-and-fonts)
2. [Corner UI: logo, language switch, dibs button](#2-corner-ui)
3. [Hero with name-label notebook](#3-hero-with-name-label-notebook)
4. [Scroll-driven notebook (travel + open)](#4-scroll-driven-notebook)
5. [Sticky notes](#5-sticky-notes)
6. [Illustrated scene + roman-numeral panel + device](#6-illustrated-scene--panel--device)
7. [Doodle grid](#7-doodle-grid)
8. [Lined-paper list](#8-lined-paper-list)
9. [Coloured notebooks (guides / products)](#9-coloured-notebooks)
10. [Comic strip with auto-sizing speech bubbles](#10-comic-strip)
11. [FAQ](#11-faq)
12. [Giant footer](#12-giant-footer)
13. [Language switch (i18n)](#13-language-switch)

---

## 1. Tokens and fonts

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT,WONK@9..144,400..900,100,0..1&family=Geist:wght@400;500&family=Caveat:wght@500;700&display=swap">
```

```css
:root{
  color-scheme:light;                 /* one light "paper" world on purpose */
  --paper:#fdfbf9;  --paper-2:#f6efea;
  --ink:#2b1a07;    --charcoal:#171717; --muted:#8a7b6a; --line:#ded6d2;
  --orange:#ff6f1e; --orange-deep:#e85f12;
  --green:#22c55e;  --blue:#3b82f6; --pink:#ff66cf;
  --sticky:#fadb4b; --sticky-2:#f5cf30; --red:#e5484d; --leather:#a86e40;
  --f-display:"Fraunces","Gelica","Recoleta",Georgia,serif;
  --f-body:"Geist","Inter",system-ui,sans-serif;
  --f-hand:"Caveat","Segoe Print",cursive;
}
body{background:var(--paper);color:var(--ink);font-family:var(--f-display);
  font-variation-settings:"SOFT" 100,"WONK" 0;font-size:18px;line-height:1.5}
.hand{font-family:var(--f-hand);color:var(--orange);font-weight:500;line-height:1}
main{overflow-x:clip}               /* clip, not hidden: keeps position:sticky working */
```

Chunky headline: `font-weight:900; font-variation-settings:"SOFT" 100,"WONK" 1,"opsz" 144; letter-spacing:-.02em; line-height:.95`.

## 2. Corner UI

```html
<a class="corner-logo" href="#">D<span>.</span></a>
<div class="corner-cta">
  <div class="lang" role="group" aria-label="Language">
    <button id="lang-tr" aria-pressed="true">TR</button>
    <button id="lang-en" aria-pressed="false">EN</button>
    <button id="lang-de" aria-pressed="false">DE</button>
  </div>
  <a class="login" href="#">Log in</a>
  <a class="dibs" href="#"><span>Start free</span></a>
</div>
```

```css
.corner-logo{position:fixed;z-index:30;top:18px;left:24px;width:52px;height:52px;border-radius:50%;
  background:var(--paper);display:grid;place-items:center;box-shadow:0 1px 2px rgba(0,0,0,.25);
  font:900 26px/1 var(--f-display);text-decoration:none;color:var(--ink)}
.corner-logo span{color:var(--orange)}
.corner-cta{position:fixed;z-index:30;top:18px;right:24px;display:flex;align-items:center;gap:10px}
/* the "dibs" button: cream ring + charcoal inner border + serif label */
.dibs{display:inline-flex;background:var(--paper);border:0;border-radius:20px;padding:4px;cursor:pointer;
  text-decoration:none;color:var(--ink);box-shadow:0 1px 2px rgba(0,0,0,.25);font:500 20px/1 var(--f-display)}
.dibs span{display:block;border:1.5px solid var(--charcoal);border-radius:16px;padding:13px 20px;background:var(--paper)}
.dibs:hover span{background:#fff4ec}
.lang{display:flex;gap:2px;background:var(--paper);border-radius:20px;padding:4px;box-shadow:0 1px 2px rgba(0,0,0,.25)}
.lang button{border:0;background:none;cursor:pointer;font:500 14px/1 var(--f-body);color:var(--muted);padding:8px 10px;border-radius:16px}
.lang button[aria-pressed="true"]{background:var(--ink);color:var(--paper)}
@media (max-width:600px){.corner-cta .login,.corner-cta .dibs{display:none}}
```

## 3. Hero with name-label notebook

> Variant used in the example: a **passport cover** built from the client's print booklet (`.pp`, `.pp-frame`,
> `.pp-globe`, `.pp-title`, `.pp-cta` in `../example/index.html`). Give the cover element `container-type:inline-size`
> and size everything in `cqw`, so the same markup works on the small hero cover and the large opening cover.

```html
<section class="hero"><div class="wrap hero-grid">
  <div class="hero-copy">
    <p class="hand greet">Dear students and parents,</p>
    <h1>your road<br>to germany</h1>
    <p class="sub">Every step, from choosing a program to settling in,
      <span class="anno">in one place.<span class="hand">really!</span></span></p>
    <a class="dibs" href="#"><span>Start my journey</span></a>
    <p class="note">Free plan: 1 active journey, no card needed</p>
  </div>
  <div class="book-stage" aria-hidden="true">
    <div class="book book-slot">              <!-- placeholder the scroll notebook starts from -->
      <div class="label">
        <div class="row"><span>Name</span><b>Elif</b></div>
        <div class="row"><span>Goal</span><b>TU München</b></div>
        <div class="split"><div><span>Term</span><b>WS 27</b></div><div><span>Stage</span><b>1/4</b></div></div>
      </div>
    </div>
    <span class="hand tag">scroll to open the notebook ↓</span>
  </div>
</div></section>
```

```css
.book{position:absolute;right:40px;top:10px;width:380px;height:500px;border-radius:12px 26px 26px 12px;transform:rotate(-14deg);
  background:linear-gradient(105deg,#7a4c2a 0 4%,#a26a3f 5% 12%,#b47a4b 30%,#9d6538 100%);
  box-shadow:inset -10px 0 24px rgba(0,0,0,.18),0 30px 50px -20px rgba(70,40,10,.45)}
.label{position:absolute;left:96px;top:96px;width:230px;background:#fff;border:2px solid #2a2a2a;border-radius:12px;
  box-shadow:0 0 0 5px #fff,0 3px 10px rgba(0,0,0,.25);font:500 11px var(--f-body)}
.label .row{display:flex;gap:10px;align-items:baseline;padding:8px 12px;border-bottom:1.5px solid #2a2a2a}
.label .row b{font:700 30px/1 var(--f-hand)}
.label .split{display:grid;grid-template-columns:1fr 1fr}
.label .split div{display:flex;gap:6px;align-items:baseline;padding:8px 12px}
.label .split div+div{border-left:1.5px solid #2a2a2a}
.label .split b{font:700 22px/1 var(--f-hand)}
.anno{position:relative;display:inline-block}
.anno .hand{position:absolute;left:100%;top:-.6em;margin-left:6px;font-size:28px;white-space:nowrap;transform:rotate(-6deg)}
.travel .book-slot{visibility:hidden}      /* only when JS animation is active */
```

## 4. Scroll-driven notebook

One notebook element. CSS variables drive both phases: `--dx --dy --rot --s` (travel from the hero) and `--p` (cover opening).

```html
<section class="opener" id="opener">
  <div class="ob-stage">
    <div class="ob-book">
      <div class="ob-page"><div class="ob-screen">
        <!-- eyed stickers (svg.stk.a/b/c/d), greeting, headline, "TAP TO START!" link -->
      </div></div>
      <div class="ob-cover" aria-hidden="true">
        <div class="face front"><div class="label">…same label…</div></div>
        <div class="face back ob-left"><div class="pocket">passport · transcript ·<br>language certificate here</div></div>
      </div>
    </div>
    <p class="hand ob-hint">keep scrolling ↓</p>
  </div>
</section>
```

```css
.opener{height:240vh;position:relative;z-index:5;--p:0;--dx:0;--dy:0;--rot:0;--s:1}
.ob-stage{position:sticky;top:0;height:100vh;display:grid;place-items:center}
.ob-book{position:relative;width:min(1000px,94vw);aspect-ratio:1.45;perspective:2400px;container-type:inline-size;
  transform-origin:75% 50%;   /* centre of the closed cover = right half */
  transform:translate(calc(var(--dx)*1px),calc(var(--dy)*1px)) translateX(calc(-25% * (1 - var(--p))))
            rotate(calc(var(--rot)*1deg)) scale(var(--s))}
.ob-page{position:absolute;inset:1.4cqw 1.4cqw 1.4cqw 50%;background:#e9e5df;border-radius:0 2.6cqw 2.6cqw 0;padding:1.4cqw}
.ob-cover{position:absolute;inset:0 0 0 50%;transform-origin:left center;transform-style:preserve-3d;
  transform:rotateY(calc(-178deg * var(--p)))}
.ob-cover .face{position:absolute;inset:0;backface-visibility:hidden;border-radius:0 3cqw 3cqw 0}
.ob-cover .back{transform:rotateY(180deg)}
.ob-hint{opacity:calc(1 - var(--p) * 2)}
@media (prefers-reduced-motion:reduce){.opener{height:auto;--p:1}.ob-stage{position:relative;height:auto}}
```

```js
const opener=document.getElementById('opener'), stage=opener.querySelector('.ob-stage');
const obBook=opener.querySelector('.ob-book'), slot=document.querySelector('.book-slot');
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
let ticking=false;
function updateBook(){
  ticking=false;
  const r=opener.getBoundingClientRect(), openerTop=r.top+scrollY;
  const k=1-ease(clamp(scrollY/Math.max(1,openerTop),0,1));       // 1 = sitting in the hero, 0 = centred
  const st=stage.getBoundingClientRect(), sl=slot.getBoundingClientRect();
  opener.style.setProperty('--dx',((sl.left+sl.width/2)-(st.left+st.width/2))*k);
  opener.style.setProperty('--dy',((sl.top+sl.height/2)-(st.top+st.height/2))*k);
  opener.style.setProperty('--rot',-14*k);
  opener.style.setProperty('--s',1+(slot.offsetWidth/(obBook.offsetWidth/2)-1)*k);
  const span=opener.offsetHeight-innerHeight;
  opener.style.setProperty('--p',(span>0?clamp(-r.top/(span*.7),0,1):1).toFixed(3));
}
if(matchMedia('(prefers-reduced-motion: reduce)').matches){opener.style.setProperty('--p',1)}
else{
  document.documentElement.classList.add('travel');
  const req=()=>{if(!ticking){ticking=true;requestAnimationFrame(updateBook)}};
  addEventListener('scroll',req,{passive:true}); addEventListener('resize',req); updateBook();
}
```

## 5. Sticky notes

```html
<section class="stickies"><div class="wrap">
  <h2>Everyyyyything in one place.<br>Without missing a single deadline.</h2>
  <div class="notes">
    <div class="sticky"><span>3,000+ programs<small>200+ universities</small></span></div>
    <div class="sticky"><span>your personal roadmap</span></div>
    …
  </div>
</div></section>
```

```css
.notes{display:flex;justify-content:center;flex-wrap:wrap;gap:34px;margin-top:70px}
.sticky{width:200px;aspect-ratio:1;background:linear-gradient(180deg,var(--sticky-2) 0 14%,var(--sticky) 14%);
  display:grid;place-items:center;padding:20px;font:500 30px/1.1 var(--f-hand);color:#2a2116;
  box-shadow:0 18px 22px -14px rgba(60,45,0,.45),0 2px 3px rgba(0,0,0,.08);transition:transform .2s}
.sticky:nth-child(1){transform:rotate(-6deg) translateY(30px)}
.sticky:nth-child(2){transform:rotate(3deg)}
.sticky:nth-child(3){transform:rotate(-1deg) translateY(36px)}
.sticky:nth-child(4){transform:rotate(-3deg)}
.sticky:hover{transform:rotate(0) scale(1.04)}
```

## 6. Illustrated scene + panel + device

Scene backgrounds are CSS gradients plus absolutely positioned inline SVG props (`.decor`, `pointer-events:none`,
`.hide-sm` on small screens). Examples in the reference: wooden desk with mug/passport/pencil, sky with plane route and a
city skyline, campus lawn with a columned university building.

```html
<section class="scene sky right" id="stages">
  <svg class="decor" …>…plane, skyline…</svg>
  <div class="wrap scene-inner">
    <div class="panel">
      <h2>One plan. <em>Four stages,</em> fourteen steps</h2>
      <ul class="feats" data-target="m2">
        <li><button class="feat" aria-current="true" data-sub="Define your destination"
            data-t="Check eligibility|Explore universities|Plan your budget"><span>Plan</span><i>I</i></button></li>
        …
      </ul>
      <p class="more">From the first question to the first lecture.</p>
    </div>
    <div class="device" aria-hidden="true"><div class="screen">…rendered from the active item…</div></div>
  </div>
</section>
```

```css
.scene{position:relative;min-height:660px;display:flex;align-items:center;padding-block:80px;overflow:hidden}
.scene-inner{position:relative;z-index:1;width:100%;display:grid;grid-template-columns:420px 1fr;gap:56px;align-items:center}
.scene.right .scene-inner{grid-template-columns:1fr 420px}
.scene.right .panel{order:2}
.panel{background:var(--paper);border:1.5px solid var(--charcoal);border-radius:12px;overflow:hidden}
.panel h2{font-size:36px;line-height:1.2;padding:28px}
.panel h2 em{font-style:normal}
.sky .panel h2 em,.sky .feat[aria-current="true"]{color:var(--blue)}   /* one sticker colour per scene */
.feat{display:flex;justify-content:space-between;width:100%;padding:13px 28px;border:0;border-top:1px solid var(--line);
  background:none;cursor:pointer;text-align:left;font:400 19px/1.35 var(--f-body);color:var(--ink)}
.feat i{font:400 19px var(--f-display);font-style:normal}
.device{justify-self:center;width:min(100%,430px);aspect-ratio:3/4;background:#e9e7e2;border-radius:22px;padding:18px;
  box-shadow:0 30px 60px -25px rgba(0,0,0,.45),inset 0 0 0 2px #d5d2cb;transform:rotate(-4deg);display:grid}
.screen{background:#fbf8f2;border-radius:8px;padding:26px 24px;display:grid;align-content:start;gap:14px}
```

Clicking a `.feat` sets `aria-current` and renders `data-t` (split on `|` into a step list) and `data-sub` into the device.

## 7. Doodle grid

```html
<section class="doodles"><div class="wrap dgrid">
  <a class="doodle" href="#"><svg viewBox="0 0 64 64" fill="none" stroke="#2b1a07" stroke-width="2.5"
     stroke-linecap="round" stroke-linejoin="round">…line icon…</svg>
     <span class="hand">certified diploma translation</span><span class="offer">great offer ✦</span></a>
  …4 doodles… <div class="dcenter"><span class="hand">from our partners ↓</span><h2>Great offers<br>for your journey!</h2></div> …4 doodles…
</div></section>
```

```css
.dgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:70px 30px;align-items:center;justify-items:center}
.doodle{display:grid;justify-items:center;gap:8px;text-align:center;text-decoration:none;color:var(--ink);transition:transform .2s}
.doodle:hover{transform:rotate(-3deg) scale(1.05)}
.doodle .hand{color:var(--ink);font-size:23px;max-width:13ch}
.doodle:nth-child(odd) .hand{transform:rotate(-5deg)} .doodle:nth-child(even) .hand{transform:rotate(3deg)}
.doodle .offer{font:700 19px var(--f-hand);color:var(--orange)}
```

## 8. Lined-paper list

```css
.lined{width:min(100%,380px);margin:56px auto 0;padding:34px 30px 40px 70px;transform:rotate(-2deg);
  background:#fffefb;box-shadow:0 20px 30px -18px rgba(60,40,20,.35);
  background-image:linear-gradient(90deg,transparent 46px,#f08b8b 46px 48px,transparent 48px),
                   repeating-linear-gradient(180deg,transparent 0 37px,#b9c9ef 37px 38px);
  background-position:0 0,0 22px}
.lined li{font:500 27px/38px var(--f-hand);list-style:none;display:flex;gap:12px}
.lined li::before{content:"✓";color:var(--green);font-weight:700}   /* or "✗" in --red for a "no-list" */
```

## 9. Coloured notebooks

```css
.gbook{position:relative;aspect-ratio:3/4;border-radius:10px 22px 22px 10px;padding:26px 22px;display:grid;
  align-content:space-between;box-shadow:inset -8px 0 18px rgba(0,0,0,.12),0 24px 40px -22px rgba(0,0,0,.45)}
.gbook:nth-child(1){background:radial-gradient(ellipse 70px 34px at 30% 30%,#fff 60%,transparent 62%),
  radial-gradient(ellipse 90px 40px at 75% 62%,#fff 60%,transparent 62%),#9fd3f5;transform:rotate(-3deg)}  /* clouds */
.gbook:nth-child(2){background:#f5b7bd;transform:rotate(2deg)}
.gbook:nth-child(3){background:#3d4fd6;transform:rotate(-1.5deg)}
```

Cover = a `.glabel` (same white name-label style) + a short description on a translucent white card + a full-cover `<a>`.

## 10. Comic strip

Characters are SVG `<symbol>`s (60×120 viewBox: hair, face, sweater, jeans, shoes; charcoal 1.8px outlines) reused with
`<use href="#elif" x y width height>`. Each frame is a 300×210 SVG with a flat background, a few props and one speech bubble.

```html
<li class="frame">
  <svg viewBox="0 0 300 210" role="img" aria-label="Elif at her desk at night, searching programs on a laptop">
    <rect width="300" height="210" fill="#fbefe2"/>
    …props… <use href="#elif" x="84" y="74" width="62" height="124"/>
    <!-- only the text: JS draws the bubble. data-tx = x of the speaker's head; data-sign = flat sign, no tail -->
    <g class="sb" data-cx="205" data-y="14" data-tx="128"><text font-size="19" fill="#2b1a07">TU Munich or RWTH?</text></g>
  </svg>
  <div class="cap"><i>I.</i><div><b>Plan</b><span>Check eligibility, explore universities, plan the budget.</span></div></div>
</li>
```

```js
function layoutBubbles(){
  document.querySelectorAll('g.sb').forEach(g=>{
    const text=g.querySelector('text');
    let shape=g.querySelector('path.sb-shape');
    if(!shape){shape=document.createElementNS('http://www.w3.org/2000/svg','path');shape.setAttribute('class','sb-shape');g.insertBefore(shape,text);}
    const cx=+g.dataset.cx, y=+g.dataset.y, max=+(g.dataset.max||280), padX=10, padY=7;
    let fs=+(text.dataset.fs||(text.dataset.fs=text.getAttribute('font-size')));
    text.setAttribute('text-anchor','middle'); text.setAttribute('font-size',fs);
    text.setAttribute('x',cx); text.setAttribute('y',y+padY+fs*.8);
    let bb=text.getBBox();
    while(bb.width+padX*2>max&&fs>11){fs--;text.setAttribute('font-size',fs);text.setAttribute('y',y+padY+fs*.8);bb=text.getBBox();}
    const w=bb.width+padX*2, h=bb.height+padY*2, r=8, b=y+h;
    const x=Math.min(Math.max(cx-w/2,4),296-w);           // keep inside the 300px frame
    text.setAttribute('x',x+w/2);
    if(g.dataset.sign){ shape.setAttribute('d',`M${x} ${y}H${x+w}V${b}H${x}Z`); }
    else{
      const tx=Math.min(Math.max(+g.dataset.tx,x+16),x+w-16);
      shape.setAttribute('d',`M${x+r} ${y}H${x+w-r}a${r} ${r} 0 0 1 ${r} ${r}V${b-r}a${r} ${r} 0 0 1 -${r} ${r}H${tx+7}L${tx-4} ${b+14}L${tx-5} ${b}H${x+r}a${r} ${r} 0 0 1 -${r} -${r}V${y+r}a${r} ${r} 0 0 1 ${r} -${r}Z`);
    }
    shape.setAttribute('fill','#fff');shape.setAttribute('stroke','#2b1a07');shape.setAttribute('stroke-width','2');
  });
}
document.fonts.ready.then(layoutBubbles);   // measure only after Caveat has loaded
```

For short fixed words inside shapes (a stamp like "APOSTILLE") use `textLength` + `lengthAdjust="spacingAndGlyphs"`.

## 11. FAQ

```css
details{border-bottom:1.5px dashed #d9b9a3}
summary{list-style:none;cursor:pointer;padding:18px 0;font:500 18px var(--f-body);display:flex;justify-content:space-between}
summary::-webkit-details-marker{display:none}
summary::after{content:"+";font:400 26px/1 var(--f-display);color:var(--orange)}
details[open] summary::after{content:"–"}
```

## 12. Giant footer

```css
.foot{background:var(--orange);color:var(--paper);border-radius:56px 56px 0 0;padding-block:64px 32px;overflow:hidden}
.giant{font:900 clamp(110px,27vw,360px)/.8 var(--f-display);font-variation-settings:"SOFT" 100,"WONK" 1,"opsz" 144;
  color:var(--orange-deep);letter-spacing:-.04em;text-align:center;user-select:none}
```

## 13. Language switch

Keep the source language in the markup; translate by text node. Pieces of split headings are translated separately, so
choose word splits that work in every language, and keep each translation's leading space if the piece needs one.

```js
const I18N={ "Giriş yap":["Log in","Anmelden"], /* source text → [en, de] */ };
const LANGS=['tr','en','de']; let lang='tr';
const tr=s=>lang==='tr'?s:(I18N[s]?.[LANGS.indexOf(lang)-1]??s);
const managed='#m1,#m2,script,style';   // elements re-rendered by JS from data-* attributes
const textNodes=[];
const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
for(let n;(n=walker.nextNode());){
  if(n.parentElement.closest(managed))continue;
  const raw=n.nodeValue, key=raw.replace(/\s+/g,' ').trim();
  if(key in I18N) textNodes.push({n,key,lead:raw.match(/^\s*/)[0],trail:raw.match(/\s*$/)[0]});
}
const attrNodes=[];
document.querySelectorAll('[placeholder],[data-t],[data-sub]').forEach(el=>
  ['placeholder','data-t','data-sub'].forEach(a=>{const v=el.getAttribute(a); if(v) attrNodes.push({el,a,key:v});}));
function setLang(l){
  lang=l; document.documentElement.lang=l;
  textNodes.forEach(t=>t.n.nodeValue=t.lead+tr(t.key)+t.trail);
  attrNodes.forEach(t=>t.el.setAttribute(t.a,tr(t.key)));
  /* re-render device screens, then */ layoutBubbles();
  try{localStorage.setItem('site-lang',l)}catch(e){}
}
```

Test: after switching, scan text nodes for letters that only exist in the source language (e.g. `/[ğüşıöçİĞŞÖÇÜ]/`);
anything left is either a proper noun (fine) or a missing dictionary entry.
