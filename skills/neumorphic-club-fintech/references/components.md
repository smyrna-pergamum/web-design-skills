# Components

Copy-ready building blocks for the neumorphic club fintech style. Every snippet comes from the working reference in
`../example/index.html`.

## 1. Tokens, fonts and the material

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Urbanist:wght@400;500;600;700&display=swap">
```

```css
:root{
  color-scheme:dark;
  --bg:#1f2126; --hi:#25282e; --lo:#1a1c20;                 /* one material: page = every surface */
  --text:#f4f5f7; --soft:#c5c9d1; --muted:#8e939d; --ghost:#3a3e46;
  --d:rgba(0,0,0,.62); --l:rgba(255,255,255,.055);          /* shadow pair */
  --eng-d:rgba(0,0,0,.8); --eng-l:rgba(255,255,255,.09);    /* engraving pair */
  --accent:#b9f26b; --accent-ink:#13200a;                   /* the LED */
  --g-pink:#ff3fa4; --g-violet:#8f5bff; --g-green:#35e07a; --g-blue:#3b8cff;
  --lx:.7071; --ly:.7071;                                   /* light direction, unit vector */
  --sx:calc(var(--lx)*10px); --sy:calc(var(--ly)*10px);
  --raise:var(--sx) var(--sy) 24px var(--d), calc(var(--sx)*-1) calc(var(--sy)*-1) 24px var(--l);
  --raise-sm:calc(var(--sx)*.5) calc(var(--sy)*.5) 12px var(--d), calc(var(--sx)*-.5) calc(var(--sy)*-.5) 12px var(--l);
  --inset:inset var(--sx) var(--sy) 18px var(--d), inset calc(var(--sx)*-1) calc(var(--sy)*-1) 18px var(--l);
  --inset-sm:inset calc(var(--sx)*.45) calc(var(--sy)*.45) 9px var(--d), inset calc(var(--sx)*-.45) calc(var(--sy)*-.45) 9px var(--l);
  --f-display:"Fraunces","Denton",Georgia,serif;
  --f-body:"Urbanist","Gilroy","Helvetica Neue",Arial,sans-serif;
}
:root[data-theme="light"]{
  color-scheme:light;
  --bg:#e3e6eb; --hi:#eef0f4; --lo:#d5d9df;
  --text:#191c22; --soft:#3c414c; --muted:#646a76; --ghost:#c6cbd3;
  --d:rgba(146,156,172,.7); --l:rgba(255,255,255,.95);
  --eng-d:rgba(140,150,166,.85); --eng-l:#ffffff;
  --accent:#3e8a1d; --accent-ink:#ffffff;
}
.raised{background:var(--bg);box-shadow:var(--raise)}
.convex{background:linear-gradient(145deg,var(--hi),var(--lo));box-shadow:var(--raise)}
.pressed{background:var(--bg);box-shadow:var(--inset)}
.engraved{color:var(--bg);text-shadow:1px 1px 1px var(--eng-l),-1px -1px 1px var(--eng-d)}
.led{display:inline-block;width:9px;height:9px;border-radius:50%;background:var(--accent);box-shadow:0 0 10px var(--accent),0 0 2px var(--accent)}
```

## 2. Type

```css
.eyebrow{font:700 13px/1.4 var(--f-body);letter-spacing:.32em;text-transform:uppercase;color:var(--soft)}
.display{font:700 clamp(46px,6.6vw,96px)/.92 var(--f-display);font-variation-settings:"opsz" 144;letter-spacing:-.035em;text-transform:lowercase;text-wrap:balance}
.h2{font:700 clamp(38px,5.6vw,76px)/.95 var(--f-display);font-variation-settings:"opsz" 144;letter-spacing:-.03em;text-wrap:balance}
```

## 3. Pill button with press state

```html
<a class="btn primary" href="#join"><span>check eligibility</span><span class="arr" aria-hidden="true">→</span></a>
```

```css
.btn{display:inline-flex;align-items:center;gap:12px;padding:16px 26px;border-radius:999px;background:var(--bg);box-shadow:var(--raise-sm);
  font:700 13px/1 var(--f-body);letter-spacing:.18em;text-transform:uppercase;text-decoration:none;color:var(--text);transition:box-shadow .18s,color .18s,transform .18s}
.btn:hover{color:var(--accent)}
.btn:active,.btn[aria-pressed="true"]{box-shadow:var(--inset-sm);transform:scale(.985)}
.btn.primary{color:var(--accent)}
```

## 4. Cursor light (the signature)

```js
const root=document.documentElement;
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine=matchMedia('(pointer: fine)').matches;
let tx=.7071,ty=.7071,cx=tx,cy=ty,raf=0;
function loop(){
  cx+=(tx-cx)*.08; cy+=(ty-cy)*.08; const m=Math.hypot(cx,cy)||1;
  root.style.setProperty('--lx',(cx/m).toFixed(3)); root.style.setProperty('--ly',(cy/m).toFixed(3));
  raf=(Math.abs(tx-cx)+Math.abs(ty-cy)>.004)?requestAnimationFrame(loop):0;
}
if(fine&&!reduce) addEventListener('pointermove',e=>{
  // light sits at the cursor, so shadows fall from the cursor through the centre
  const dx=innerWidth/2-e.clientX, dy=innerHeight/2-e.clientY, m=Math.hypot(dx,dy);
  if(m<40) return; tx=dx/m; ty=dy/m; if(!raf) raf=requestAnimationFrame(loop);
},{passive:true});
```

## 5. Relief rings + embossed tilting card

```html
<div class="stage" id="stage" aria-hidden="true">
  <div class="ring r1"></div><div class="ring r2"></div><div class="ring r3"></div>
  <div class="card3d raised" id="card">
    <div class="brand"><span>atlasio</span><span class="led"></span></div>
    <div class="chip convex"></div>
    <div class="num engraved">4821 •••• •••• 0907</div>
    <div class="who"><span>sample member</span><span>09/31</span></div>
  </div>
</div>
```

```css
.stage{position:relative;aspect-ratio:1;display:grid;place-items:center}
.ring{position:absolute;border-radius:50%}
.ring.r1{inset:0;box-shadow:var(--raise)} .ring.r2{inset:8%;box-shadow:var(--inset)} .ring.r3{inset:18%;box-shadow:var(--raise-sm)}
.card3d{position:relative;width:min(400px,78%);aspect-ratio:1.586;border-radius:24px;padding:7% 8%;display:grid;grid-template-rows:auto 1fr auto auto;
  transform:perspective(900px) rotateX(var(--tx,0deg)) rotateY(var(--ty,0deg)) rotateZ(-8deg);transition:transform .25s ease-out}
.chip{width:52px;height:40px;border-radius:9px;margin-top:14%;position:relative;overflow:hidden}
.chip::before,.chip::after{content:"";position:absolute;background:var(--ghost)}
.chip::before{left:0;right:0;top:50%;height:1px} .chip::after{top:0;bottom:0;left:50%;width:1px}
```

```js
stage.addEventListener('pointermove',e=>{const r=stage.getBoundingClientRect();
  const x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
  card.style.setProperty('--ty',(x*22).toFixed(1)+'deg'); card.style.setProperty('--tx',(-y*22).toFixed(1)+'deg')});
stage.addEventListener('pointerleave',()=>{card.style.setProperty('--ty','0deg');card.style.setProperty('--tx','0deg')});
```

## 6. Engraved words that light up on scroll

```css
.reveal .w{color:var(--bg);text-shadow:1px 1px 1px var(--eng-l),-1px -1px 1px var(--eng-d);transition:color .4s,text-shadow .4s}
.reveal .w.on{color:var(--text);text-shadow:none}
```

```js
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
function prog(el,start=1,end=.3){const r=el.getBoundingClientRect(),h=innerHeight;return clamp((h*start-r.top)/(h*start-h*end))}
function splitWords(el){el.innerHTML=el.textContent.trim().split(/\s+/).map(w=>'<span class="w">'+w+'</span>').join(' ');return [...el.querySelectorAll('.w')]}
let words=splitWords(reveal);
function onScroll(){const n=Math.round(prog(reveal,.85,.25)*words.length);words.forEach((w,i)=>w.classList.toggle('on',i<n))}
```

The same `prog()` drives the other scroll pieces:

```js
phone.style.setProperty('--p', prog(zone,1,.45));          /* .phone{transform:translate(-50%,calc((1 - var(--p)) * 62%))} */
fan.style.setProperty('--fan', prog(fan,1,.35)*12);         /* .slab{transform:translateX(-50%) rotate(calc(var(--i) * var(--fan) * 1deg))} */
ticks.style.setProperty('--rot', (prog(ticks,1.1,-.1)*180-90)+'deg');
```

## 7. Phone rising from a slot

```html
<div class="phone-zone" aria-hidden="true">
  <div class="phone raised"><div class="screen pressed">
    <div class="bill raised"><span class="due"><span class="led"></span>due in 3 days</span><span class="amt">$1,248.00</span><span class="btn primary">pay now</span></div>
  </div></div>
  <div class="slot"></div>
</div>
```

```css
.phone-zone{position:relative;height:clamp(420px,52vw,600px);overflow:hidden}
.slot{position:absolute;left:50%;bottom:0;transform:translateX(-50%);width:min(620px,92%);height:28px;border-radius:999px;box-shadow:var(--inset);z-index:2}
.phone{position:absolute;left:50%;bottom:14px;width:min(290px,72vw);aspect-ratio:290/580;border-radius:46px;padding:14px;transform:translate(-50%,calc((1 - var(--p,1)) * 62%))}
.screen{height:100%;border-radius:34px;padding:22px 16px;display:grid;align-content:start;gap:16px}
```

## 8. Rail tile with a glowing pressed well

```html
<article class="tile raised">
  <span class="lab"><span class="well"><svg viewBox="0 0 24 24" aria-hidden="true">…</svg></span>tap to pay</span>
  <h3>hold your phone.<br>that's the whole step.</h3>
  <a class="btn" href="#">learn more <span aria-hidden="true">→</span></a>
  <div class="show" style="--glow:var(--g-green)" aria-hidden="true"><div class="waves raised"><div><div></div></div></div></div>
</article>
```

```css
.rail{display:grid;grid-auto-flow:column;grid-auto-columns:minmax(270px,340px);gap:32px;overflow-x:auto;scroll-snap-type:x mandatory;
  padding:40px 30px 44px;margin:0 -30px;scrollbar-width:none}      /* padding keeps the shadows visible */
.tile{scroll-snap-align:start;border-radius:32px;padding:26px;display:grid;gap:18px;align-content:start}
.tile .well{width:44px;height:44px;border-radius:50%;display:grid;place-items:center;box-shadow:var(--inset-sm)}
.show{position:relative;height:220px;border-radius:24px;box-shadow:var(--inset);overflow:hidden;display:grid;place-items:center}
.show::before{content:"";position:absolute;inset:-20%;background:radial-gradient(circle at 50% 62%,var(--glow) 0%,transparent 55%);opacity:.38}
.show > *{position:relative}
```

## 9. Pressable reward coin

```html
<button class="coin convex" style="--i:0" aria-pressed="false"><span class="face">tap</span><span class="prize">2% back on groceries</span></button>
```

```css
.coin{aspect-ratio:1;border-radius:50%;display:grid;place-items:center;text-align:center;padding:16%;transition:box-shadow .25s;
  animation:float 6s ease-in-out infinite;animation-delay:calc(var(--i) * -1s)}
.coin .prize{display:none}
.coin[aria-pressed="true"]{box-shadow:var(--inset);background:var(--bg)}
.coin[aria-pressed="true"] .face{display:none}
.coin[aria-pressed="true"] .prize{display:block}
@keyframes float{50%{transform:translateY(-10px)}}
```

## 10. Spotlight paragraph

```html
<div class="spot" id="spot">
  <p class="base">everything you share is encrypted…</p>
  <p class="lit" aria-hidden="true">everything you share is encrypted…</p>
</div>
```

```css
.spot{position:relative}
.spot .base{color:var(--muted)}
.spot .lit{position:absolute;inset:0;color:var(--text);
  -webkit-mask-image:radial-gradient(circle 190px at var(--mx,30%) var(--my,40%),#000 25%,transparent 75%);
          mask-image:radial-gradient(circle 190px at var(--mx,30%) var(--my,40%),#000 25%,transparent 75%)}
```

```js
spot.addEventListener('pointermove',e=>{hover=true;const r=spot.getBoundingClientRect();
  spot.style.setProperty('--mx',(e.clientX-r.left)+'px');spot.style.setProperty('--my',(e.clientY-r.top)+'px')});
spot.addEventListener('pointerleave',()=>hover=false);
// while visible and not hovered: drift on a Lissajous path
function auto(){if(!hover){t+=.006;spot.style.setProperty('--mx',(50+42*Math.sin(t*1.3))+'%');spot.style.setProperty('--my',(50+38*Math.sin(t*2.1))+'%')}requestAnimationFrame(auto)}
```

## 11. Slide to join

```html
<div class="slide" id="slide">
  <div class="fill"></div>
  <div class="txt" id="slideTxt">slide to check</div>
  <button class="knob2 convex" id="knob" role="slider" aria-label="Slide to check eligibility" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>
  </button>
</div>
```

```css
.slide{position:relative;height:76px;border-radius:999px;box-shadow:var(--inset);max-width:460px;touch-action:none;user-select:none}
.slide .fill{position:absolute;inset:8px auto 8px 8px;width:calc(var(--k,0) * (100% - 76px) + 60px);border-radius:999px;background:var(--accent);opacity:calc(var(--k,0) * .9)}
.slide .txt{position:absolute;inset:0;display:grid;place-items:center;padding-left:70px;pointer-events:none}
.knob2{position:absolute;top:8px;left:calc(8px + var(--k,0) * (100% - 76px));width:60px;height:60px;border-radius:50%;display:grid;place-items:center;cursor:grab}
.slide.done .txt{color:var(--accent-ink);z-index:1}
```

```js
let k=0,drag=false,x0=0,k0=0;
const setK=v=>{k=Math.min(1,Math.max(0,v));slide.style.setProperty('--k',k);knob.setAttribute('aria-valuenow',Math.round(k*100))};
knob.addEventListener('pointerdown',e=>{drag=true;x0=e.clientX;k0=k;knob.setPointerCapture(e.pointerId)});
knob.addEventListener('pointermove',e=>{if(drag)setK(k0+(e.clientX-x0)/(slide.clientWidth-76))});
knob.addEventListener('pointerup',()=>{drag=false;k>.9?finish():setK(0)});
knob.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){setK(k+.2);if(k>=1)finish()}else if(e.key==='ArrowLeft')setK(k-.2);else if(e.key==='Enter'||e.key===' ')finish()});
```

## 12. FAQ that presses in when open

```css
.faq details{border-radius:26px;box-shadow:var(--raise-sm);transition:box-shadow .25s}
.faq details[open]{box-shadow:var(--inset-sm)}
.faq summary{list-style:none;cursor:pointer;display:flex;justify-content:space-between;padding:22px 26px;font:600 19px/1.3 var(--f-body)}
.faq summary::after{content:"+";color:var(--accent)}
.faq details[open] summary::after{content:"–"}
```
