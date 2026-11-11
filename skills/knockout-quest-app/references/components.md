# Components

Copy-ready building blocks for the knockout quest app landing. Every snippet comes from the working reference in
`../example/index.html`; open it for the complete content, icons and every breakpoint.

## Contents

1. [Tokens and fonts](#1-tokens-and-fonts)
2. [Knockout intro with zoom](#2-knockout-intro-with-zoom)
3. [Phone mockup and floating chips](#3-phone-mockup-and-floating-chips)
4. [Sticky app tour](#4-sticky-app-tour)
5. [XP engine, toasts and confetti](#5-xp-engine-toasts-and-confetti)
6. [Quest cards](#6-quest-cards)
7. [Video tile with live HUD](#7-video-tile-with-live-hud)
8. [Photo accordion](#8-photo-accordion)
9. [Breathing orb](#9-breathing-orb)
10. [Privacy lines, bento counters, reduced motion](#10-privacy-lines-bento-counters-reduced-motion)
11. [Sound studio: music, nature tiles, radio tuner](#11-sound-studio)

---

## 1. Tokens and fonts

```html
<link href="https://fonts.googleapis.com/css2?family=Unbounded:wght@500;700;900&family=Manrope:wght@400;500;700;800&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
```

```css
:root{
  --ink:#0b0e13;--ink2:#141922;--paper:#f2f1ec;--text:#eef0f3;--muted:#98a2ae;--line:#ffffff1c;
  --coral:#ff6a3d;--pink:#ff3d7f;--violet:#8b5cf6;--lilac:#c06cf0;--blue:#2f7cff;--cyan:#19c3e6;
  --lime:#c8f05a;--teal:#12b89f;--sun:#ffc23d;
  --ease:cubic-bezier(.16,1,.3,1);--display:'Unbounded',system-ui,sans-serif;--mono:'JetBrains Mono',monospace;
  --a1:var(--coral);--a2:var(--pink);
}
html,body{overflow-x:clip}           /* rotated ticker and privacy lines must not create a scrollbar */
body{margin:0;background:var(--ink);color:var(--text);font-family:Manrope,system-ui,sans-serif}
h1,h2,h3{font-family:var(--display);font-weight:700;letter-spacing:-.045em;line-height:1}
.mono{font-family:var(--mono);font-size:11px;letter-spacing:.14em;text-transform:uppercase}
.grad{background:linear-gradient(100deg,var(--a1),var(--a2));-webkit-background-clip:text;background-clip:text;color:transparent}
.btn{display:inline-flex;align-items:center;gap:12px;height:56px;padding:0 26px;border-radius:99px;font-weight:800}
.btn-lime{background:var(--lime);color:var(--ink);box-shadow:0 10px 40px -10px #c8f05a80}
```

## 2. Knockout intro with zoom

```html
<section class="intro" id="top">
  <div class="intro-stage">
    <video class="intro-video" src="assets/park-run.mp4" poster="assets/park-run.jpg" muted loop playsinline autoplay aria-hidden="true"></video>
    <div class="shade" id="shade"></div>
    <div class="knock" id="knock" aria-hidden="true">
      <div class="knock-word" id="knockWord"><span>F<span id="kI" style="display:inline">I</span>T</span><span>VITA</span></div>
    </div>
    <div class="knock-labels" id="knockLabels" aria-hidden="true">…four mono corner labels…</div>
    <div class="hero" id="hero">…headline, buttons, phone…</div>
  </div>
</section>
```

```css
.intro{height:300vh;position:relative}
.intro-stage{position:sticky;top:0;height:100svh;overflow:hidden;isolation:isolate}  /* blend only with the video */
.intro-video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.knock{position:absolute;inset:0;background:var(--paper);color:#000;mix-blend-mode:screen;
  display:grid;place-items:center;will-change:transform,opacity}
.knock-word{font-family:var(--display);font-weight:900;line-height:.78;letter-spacing:-.07em;text-align:center;white-space:nowrap}
.knock-word span{display:block}
.shade{position:absolute;inset:0;opacity:0;background:linear-gradient(180deg,#0b0e1399,#0b0e1300 30%,#0b0e13 100%)}
.hero{position:absolute;inset:0;opacity:0;pointer-events:none}
.hero.on{pointer-events:auto}
```

```js
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
let fitW=0,fitH=0;
function fitWord(force){                  // fit the word, then aim the zoom at the centre of the stem letter
  if(!force&&innerWidth===fitW&&Math.abs(innerHeight-fitH)<140)return;   // ignore mobile URL-bar resizes
  fitW=innerWidth;fitH=innerHeight;
  knock.style.transform='none';           // FIRST: measure unscaled, or a resize mid-zoom shrinks the word to ~1px
  word.style.fontSize='100px';
  const b=word.getBoundingClientRect();
  word.style.fontSize=Math.min(100*innerWidth*.86/b.width,100*innerHeight*.64/b.height)+'px';
  const k=knock.getBoundingClientRect(),i=kI.getBoundingClientRect();
  knock.style.transformOrigin=(i.left+i.width*.5-k.left)+'px '+(i.top+i.height*.55-k.top)+'px';
}
function onScroll(){                      // called from a rAF-throttled scroll listener
  const r=intro.getBoundingClientRect(),p=clamp(-r.top/(intro.offsetHeight-innerHeight));
  const z=clamp(p/.55);
  knock.style.transform=`scale(${1+Math.pow(z,3.2)*90})`;
  knock.style.opacity=1-clamp((p-.42)/.14);
  knock.style.visibility=p>.58?'hidden':'visible';
  labels.style.opacity=1-clamp(p/.12);
  shade.style.opacity=clamp((p-.45)/.25);
  const h=clamp((p-.56)/.2);hero.style.opacity=h;hero.style.transform=`translateY(${(1-h)*40}px)`;
  hero.classList.toggle('on',h>.5);
}
addEventListener('scroll',onScroll,{passive:true});   // direct: scroll already fires once per frame
document.fonts.ready.then(()=>{fitWord(true);onScroll()});
addEventListener('resize',()=>{fitWord();onScroll()});
```

Pick a letter whose centre is solid ink (I, l, 1, the stem of T). With `screen`, ink = video; a counter = white.

## 3. Phone mockup and floating chips

```html
<div class="hero-phone">
  <div class="phone">
    <div class="phone-screen"><img src="assets/screen-1.webp" alt="Activity screen with steps, level and daily quests"></div>
    <div class="phone-glare"></div>
  </div>
  <div class="chip c-a float"><span class="ic" style="background:linear-gradient(135deg,var(--sun),var(--coral))"><svg><use href="#i-walk"/></svg></span><span>+25 XP<small>Walk quest done</small></span></div>
</div>
```

```css
.hero-phone{position:relative;perspective:1200px}
.phone{position:relative;width:min(300px,62vw);aspect-ratio:9/19.6;border-radius:46px;padding:10px;
  background:linear-gradient(145deg,#2a313d,#0d1016 40%,#232a35);
  box-shadow:0 0 0 1px #ffffff26 inset,0 50px 100px -30px #000,0 30px 60px -40px var(--a2);
  transform:rotateY(calc(var(--mx,0)*-14deg)) rotateX(calc(var(--my,0)*10deg));transition:transform .7s var(--ease)}
.phone-screen{position:relative;width:100%;height:100%;border-radius:37px;overflow:hidden;background:#fff}
.phone-screen img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:top;
  transition:opacity .55s var(--ease),transform .8s var(--ease)}
.phone-screen img.out{opacity:0;transform:scale(1.04)}
.phone:after{content:'';position:absolute;left:50%;top:18px;width:74px;height:20px;border-radius:20px;background:#0b0e13;transform:translateX(-50%)}
.phone-glare{position:absolute;inset:10px;border-radius:37px;background:linear-gradient(115deg,#ffffff38,#fff0 38%);mix-blend-mode:screen;pointer-events:none}
.chip{position:absolute;z-index:3;display:flex;align-items:center;gap:10px;padding:10px 14px 10px 10px;border-radius:18px;
  background:#ffffffeb;color:var(--ink);font-weight:800;font-size:14px;box-shadow:0 20px 40px -18px #000c;white-space:nowrap;
  transform:translate3d(calc(var(--mx,0)*var(--d,20px)),calc(var(--my,0)*var(--d,20px)),0);transition:transform .8s var(--ease)}
.chip .ic{width:34px;height:34px;border-radius:11px;display:grid;place-items:center;color:#fff}
.float{animation:bob 5s ease-in-out infinite}
@keyframes bob{50%{translate:0 -10px}}   /* `translate` so it stacks with the parallax `transform` */
```

```js
if(matchMedia('(pointer:fine)').matches) addEventListener('pointermove',e=>{
  document.documentElement.style.setProperty('--mx',(e.clientX/innerWidth*2-1).toFixed(3));
  document.documentElement.style.setProperty('--my',(e.clientY/innerHeight*2-1).toFixed(3));
},{passive:true});
```

## 4. Sticky app tour

```html
<section class="story" id="app" data-xp="Opened the app tour">
  <div class="story-stage" id="storyStage">
    <div class="story-bg"></div>
    <div class="story-word" id="storyWord">ACTIVITY</div>
    <div class="story-left"><div class="story-num grad" id="storyNum">01</div>
      <ul class="story-steps"><li><button data-step="0" aria-current="true"><i></i>Activity</button></li>…</ul></div>
    <div class="hero-phone"><div class="phone"><div class="phone-screen" id="storyScreen"><img src="assets/screen-1.webp" alt=""></div></div></div>
    <div class="story-copy" id="storyCopy" aria-live="polite"></div>
  </div>
</section>
```

```css
.story{height:460vh;position:relative}
.story-stage{position:sticky;top:0;height:100svh;overflow:hidden;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:56px}
.story-bg{position:absolute;inset:0;z-index:-1;transition:background .9s var(--ease);
  background:radial-gradient(40% 55% at 50% 55%,color-mix(in srgb,var(--a1) 45%,transparent),transparent 70%),
             radial-gradient(30% 40% at 62% 40%,color-mix(in srgb,var(--a2) 40%,transparent),transparent 70%)}
.story-word{position:absolute;left:0;top:50%;z-index:-1;font:900 24vw/1 var(--display);letter-spacing:-.08em;
  white-space:nowrap;color:transparent;-webkit-text-stroke:1px #ffffff1f}
.swap-in{animation:swapIn .7s var(--ease) both}
@keyframes swapIn{from{opacity:0;transform:translateY(18px);filter:blur(6px)}}
```

```js
const STEPS=[{img:'assets/screen-1.webp',word:'ACTIVITY',a1:'#ff8a3d',a2:'#ff3d7f',tag:'Activity',
  title:'Every step has a place.',copy:'…',chips:['Step counter','Water tracking'],alt:'…'}, /* … one per tab */];
let cur=-1;
function setStep(n){
  if(n===cur)return;cur=n;const s=STEPS[n];
  stage.style.setProperty('--a1',s.a1);stage.style.setProperty('--a2',s.a2);
  storyWord.textContent=s.word;storyNum.textContent='0'+(n+1);
  copy.innerHTML=`<div class="swap-in"><span class="tag">${s.tag}</span><h3>${s.title}</h3><p>${s.copy}</p></div>`;
  const old=screen.querySelector('img'),img=new Image();img.src=s.img;img.alt=s.alt;img.className='out';
  screen.appendChild(img);
  requestAnimationFrame(()=>requestAnimationFrame(()=>{img.classList.remove('out');old&&old.classList.add('out')}));
  setTimeout(()=>[...screen.querySelectorAll('img')].slice(0,-1).forEach(x=>x.remove()),700);
}
// in onScroll():
const sr=story.getBoundingClientRect(),sp=clamp(-sr.top/(story.offsetHeight-innerHeight));
setStep(Math.min(STEPS.length-1,Math.floor(sp*STEPS.length)));
storyWord.style.transform=`translate3d(${-sp*60}%,-50%,0)`;
// tab buttons jump to the middle of their slot:
btn.onclick=()=>scrollTo({top:story.offsetTop+(story.offsetHeight-innerHeight)*(n+.5)/STEPS.length,behavior:'smooth'});
```

## 5. XP engine, toasts and confetti

```html
<div class="xp" aria-label="Your progress on this page">
  <span class="lvl" id="lvl">1</span><span class="xpbar"><i id="xpfill"></i></span><span class="xpnum" id="xpnum">0/100 XP</span>
</div>
<div class="toasts" id="toasts" aria-live="polite"></div>
<canvas id="confetti"></canvas>
```

```css
.xpbar{width:90px;height:6px;border-radius:9px;background:#ffffff1f;overflow:hidden}
.xpbar i{display:block;height:100%;width:0;background:linear-gradient(90deg,var(--sun),var(--lime));transition:width .8s var(--ease)}
.toasts{position:fixed;right:18px;bottom:18px;z-index:120;display:grid;gap:10px;justify-items:end;pointer-events:none}
.toast{display:flex;align-items:center;gap:12px;padding:12px 16px 12px 12px;border-radius:18px;background:#fff;color:var(--ink);
  font-weight:800;box-shadow:0 20px 50px -15px #000c;animation:toastIn .6s var(--ease) both}
.toast.bye{animation:toastOut .5s var(--ease) both}
#confetti{position:fixed;inset:0;pointer-events:none;z-index:110}
```

```js
const LEVELS=[0,100,250,450,700],NAMES=['Beginner','Mover','Regular','Athlete','Legend'];
let xp=0,level=1;const seen=new Set();
function addXP(n,why){
  xp+=n;toast('+'+n+' XP',why);
  while(level<LEVELS.length&&xp>=LEVELS[level]){level++;toast('Level '+level+'!',NAMES[level-1]+' unlocked','lvlup');confetti();}
  renderXP();
}
function renderXP(){
  const lo=LEVELS[level-1],hi=LEVELS[level]??LEVELS.at(-1)+300;
  lvl.textContent=level;xpfill.style.width=clamp((xp-lo)/(hi-lo))*100+'%';xpnum.textContent=xp+'/'+hi+' XP';
}
// +5 XP the first time each [data-xp] section is 25% visible (start observing after ~1 s so the intro is not counted at load)
const io=new IntersectionObserver(es=>es.forEach(e=>{
  if(e.isIntersecting&&!seen.has(e.target)){seen.add(e.target);addXP(5,'Explorer · '+e.target.dataset.xp)}}),{threshold:.25});
setTimeout(()=>document.querySelectorAll('[data-xp]').forEach(s=>io.observe(s)),1200);
```

Confetti: 140 rectangles from the upper centre with random velocity, gravity `.35`, slow spin and a life counter,
drawn on the fixed canvas with `requestAnimationFrame` until all are gone (see the example). Skip it with reduced motion.

## 6. Quest cards

```html
<article class="quest" data-q="walk" style="--c1:var(--coral);--c2:var(--sun)">
  <div class="q-top">
    <svg class="ring" viewBox="0 0 66 66"><circle class="bg" cx="33" cy="33" r="26"/><circle class="fg" cx="33" cy="33" r="26"/></svg>
    <span class="q-icon"><svg><use href="#i-walk"/></svg></span><span class="q-xp">+25 XP</span>
  </div>
  <h3>Walk</h3><p class="q-goal"><b data-v>0</b> / 8,000 steps</p>
  <div class="q-play"><button class="q-btn" data-act="walk"><span class="fill"></span><span>Take 2,000 steps</span></button></div>
</article>
```

```css
.quest{position:relative;padding:24px;border-radius:30px;background:var(--ink2);border:1px solid var(--line);overflow:hidden;
  min-height:330px;display:flex;flex-direction:column}
.quest:before{content:'';position:absolute;inset:auto -30% -60%;height:80%;opacity:.35;transition:opacity .6s;
  background:radial-gradient(closest-side,color-mix(in srgb,var(--c1) 50%,transparent),transparent)}
.quest.done:before{opacity:.9}
.ring{width:66px;height:66px;transform:rotate(-90deg)}
.ring circle{fill:none;stroke-width:7}.ring .bg{stroke:#ffffff17}
.ring .fg{stroke:var(--c1);stroke-linecap:round;stroke-dasharray:163.4;stroke-dashoffset:163.4;transition:stroke-dashoffset .8s var(--ease)}
.q-play{margin-top:auto}
.q-btn{width:100%;height:50px;border-radius:16px;background:#ffffff12;border:1px solid #ffffff24;font-weight:800;position:relative;overflow:hidden}
.q-btn .fill{position:absolute;inset:0;transform:scaleX(0);transform-origin:0 50%;background:linear-gradient(90deg,var(--c1),var(--c2));opacity:.55}
.quest.done .q-btn{background:linear-gradient(90deg,var(--c1),var(--c2));color:#fff;pointer-events:none}
.glass{aspect-ratio:3/4.4;border-radius:4px 4px 8px 8px;border:2px solid #ffffff40;position:relative;overflow:hidden}
.glass:after{content:'';position:absolute;inset:auto 0 0;height:0;background:linear-gradient(180deg,var(--cyan),var(--blue));transition:height .45s var(--ease)}
.glass.full:after{height:78%}
```

```js
const quests=new Set();
function progress(q,v,max){
  const card=document.querySelector(`.quest[data-q="${q}"]`);
  card.querySelector('[data-v]').textContent=v.toLocaleString('en');
  card.querySelector('.fg').style.strokeDashoffset=163.4*(1-clamp(v/max));   // 2πr, r=26
  if(v>=max&&!quests.has(q)){
    quests.add(q);card.classList.add('done');addXP(25,'Quest done · '+card.querySelector('h3').textContent);
    if(quests.size===2)toast('Streak day!','Two quests are enough','lvlup');
    if(quests.size===4)addXP(50,'All four quests');
  }
}
// press-and-hold: fills over 2.2 s, resets when released early; Space/Enter held does the same
let t0=0,raf=0;
function loop(){const p=clamp((performance.now()-t0)/2200);fill.style.transform=`scaleX(${p})`;progress('move',Math.round(p*20),20);if(p<1)raf=requestAnimationFrame(loop)}
hold.onpointerdown=e=>{if(quests.has('move'))return;hold.setPointerCapture(e.pointerId);t0=performance.now();loop()};
hold.onpointerup=hold.onpointercancel=()=>{cancelAnimationFrame(raf);if(!quests.has('move')){fill.style.transform='scaleX(0)';progress('move',0,20)}};
```

## 7. Video tile with live HUD

```html
<div class="vtile" data-hud="pace">
  <video src="assets/river-jog.mp4" poster="assets/river-jog.jpg" muted loop playsinline preload="metadata" aria-hidden="true"></video>
  <div class="hud"><span class="pill"><i></i>REC · JOG</span><span class="pill" data-t>00:00:00</span></div>
  <div class="vcap"><div class="big"><span data-km>2.40</span><small>km</small></div><p>Pace <span data-pace>5'42"</span>/km</p></div>
  <svg class="route" viewBox="0 0 108 108"><path class="r1" d="M14 86c10-30 2-58 24-66s34 18 54 8M92 28c6 26-8 34-24 44s-34 18-54 14"/><path class="r2" d="…same…"/></svg>
</div>
```

```css
.vtile{position:relative;border-radius:34px;overflow:hidden;min-height:520px;color:#fff}
.vtile video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.vtile:after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,#0000 40%,#000a)}
.hud .pill{display:flex;align-items:center;gap:8px;padding:9px 13px;border-radius:99px;background:#0b0e13a6;backdrop-filter:blur(10px);font:700 12px var(--mono)}
.hud .pill i{width:8px;height:8px;border-radius:50%;background:#ff3d5a;animation:blink 1.2s infinite}
.route .r2{stroke:var(--lime);stroke-width:6;fill:none;stroke-linecap:round;stroke-dasharray:420;stroke-dashoffset:420}
.vtile.live .route .r2{animation:draw 9s linear infinite}
@keyframes draw{to{stroke-dashoffset:0}}
```

```js
const vio=new IntersectionObserver(es=>es.forEach(e=>{const v=e.target,t=v.closest('.vtile');
  if(e.isIntersecting&&!reduced){v.play().catch(()=>{});t?.classList.add('live')}else{v.pause();t?.classList.remove('live')}}),{threshold:.2});
document.querySelectorAll('video').forEach(v=>vio.observe(v));
setInterval(()=>{ if(!document.querySelector('.vtile.live'))return; /* tick timer, km += .0028, steps += 2–4, pace wobble */ },1000);
```

## 8. Photo accordion

```html
<div class="rhythms">
  <button class="rh active" style="--c1:var(--coral);--c2:var(--sun)" aria-expanded="true">
    <img src="assets/jog-pair.jpg" alt="Two people jogging together on a park path">
    <span class="rh-num">01</span><span class="rh-side">Move</span>
    <span class="rh-body"><span class="mono">Steps · Routes · Workouts</span><h3>Make room to move.</h3><p>…</p></span>
  </button>
  …
</div>
```

```css
.rhythms{display:flex;gap:12px;height:620px}
.rh{position:relative;flex:1;border-radius:32px;overflow:hidden;isolation:isolate;transition:flex .9s var(--ease);text-align:left}
.rh.active{flex:2.6}
.rh img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:-2;filter:grayscale(1) contrast(1.1);transform:scale(1.08);transition:filter .9s var(--ease),transform 1.4s var(--ease)}
.rh:before{content:'';position:absolute;inset:0;z-index:-1;background:linear-gradient(160deg,var(--c1),var(--c2));mix-blend-mode:multiply;opacity:.95;transition:opacity .9s}
.rh.active img{filter:none;transform:scale(1)}
.rh.active:before{opacity:.15}
.rh-side{position:absolute;left:24px;bottom:24px;writing-mode:vertical-rl;transform:rotate(180deg);font:900 40px var(--display)}
.rh-body{position:absolute;left:28px;right:28px;bottom:28px;opacity:0;transform:translateY(20px);transition:opacity .5s .15s,transform .7s .15s var(--ease)}
.rh.active .rh-body{opacity:1;transform:none}
@media(max-width:820px){.rhythms{flex-direction:column;height:auto}.rh{flex:none;height:96px;transition:height .8s var(--ease)}.rh.active{height:480px}
  .rh-side{writing-mode:horizontal-tb;transform:none;left:90px;top:28px;bottom:auto;font-size:30px}}
```

Activate on click and focus everywhere, and on `pointerenter` only with a fine pointer.

## 9. Breathing orb

```css
.orb{width:180px;height:180px;border-radius:50%;transform:scale(.8);transition:transform 4s cubic-bezier(.45,0,.55,1);
  background:radial-gradient(circle at 35% 30%,#fff9,#fff0 40%),linear-gradient(140deg,var(--violet),var(--lilac) 50%,var(--cyan));
  box-shadow:0 0 120px -10px #8b5cf6aa}
.orb.in{transform:scale(2.1)}
```

```js
function cycle(){
  orb.style.transitionDuration='4s';orb.classList.add('in');countdown(4,'Breathe in');
  timers.push(setTimeout(()=>{orb.style.transitionDuration='6s';orb.classList.remove('in');countdown(6,'Breathe out');
    timers.push(setTimeout(()=>{breaths++;progress('yoga',Math.min(breaths,2),2);if(breaths===2)addXP(10,'Breathing session');if(running)cycle()},6000))},4000));
}
```

## 10. Privacy lines, bento counters, reduced motion

```css
.priv-line{display:flex;width:max-content;font:900 clamp(56px,9vw,150px)/1.02 var(--display);letter-spacing:-.07em;white-space:nowrap}
.priv-line .o{color:transparent;-webkit-text-stroke:1.5px #ffffff59}
.priv-line .l{color:var(--lime)}
.bento{display:grid;grid-template-columns:repeat(6,1fr);grid-auto-rows:180px;gap:14px}
.cell.big{grid-column:span 3;grid-row:span 2;background:linear-gradient(150deg,var(--coral),var(--pink))}
.cell.w3{grid-column:span 3}
/* reduced motion: a normal hero, nothing moves */
.rm .intro{height:auto}.rm .intro-stage{position:relative;height:100vh}
.rm .knock,.rm .knock-labels{display:none}.rm .shade,.rm .hero{opacity:1}.rm .hero{pointer-events:auto}
.rm .ticker-track,.rm .float{animation:none}
```

```js
// privacy lines slide in opposite directions (data-dir="-1" / "1") — inside onScroll():
lines.forEach(l=>{const b=l.getBoundingClientRect();if(b.bottom>0&&b.top<innerHeight)l.style.transform=`translateX(${(b.top-innerHeight/2)*.35*l.dataset.dir}px)`});
// counters: ease-out cubic over 1.4 s when 50% visible
const t0=performance.now();(function f(t){const p=clamp((t-t0)/1400);el.textContent=Math.round(end*(1-(1-p)**3));if(p<1)requestAnimationFrame(f)})(t0);
// reduced motion
if(matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('rm');
```

## 11. Sound studio

```html
<div class="studio">                      <!-- grid: 1.1fr 1fr 1fr → 2 cols at 1100px → 1 col at 820px -->
  <article class="deck music" id="music">
    <div class="disc-row"><div class="disc" aria-hidden="true"></div><div class="now"><b>Meditation Impromptu 01</b><span>Kevin MacLeod</span></div></div>
    <div class="bar-row"><button class="play" id="musicPlay" aria-label="Play meditation music"><svg viewBox="0 0 24 24"><path id="musicIcon" d="M8 5v14l11-7z" fill="currentColor"/></svg></button>
      <span class="seek"><i id="musicSeek"></i></span><span class="time" id="musicTime">0:00</span></div>
    <ul class="tracks"><li><button data-track="0" aria-current="true"><span>Meditation Impromptu 01</span><span>preview</span></button></li>…</ul>
  </article>
  <article class="deck nature">
    <div class="tiles"><button class="tile" data-sound="rain" aria-pressed="false"><span class="ti"><svg>…</svg></span>Rain<span class="eq"><i></i><i></i><i></i><i></i></span></button>…</div>
    <label class="vol">Volume <input type="range" id="natVol" min="0" max="1" step="0.05" value="0.7"></label>
  </article>
  <article class="deck radio">
    <div class="tuner"><div class="scale"></div><div class="needle" id="needle"></div><div class="freq"><span>88</span>…<span>108</span></div></div>
    <div class="station"><span class="logo-sq">FM</span><div><b id="stName">All stations</b><small id="stInfo">Tap a genre</small></div><span class="eq" id="stEq"></span></div>
    <div class="genres"><button aria-pressed="true" data-g="all">All</button><button aria-pressed="false" data-g="jazz">jazz</button>…</div>
  </article>
</div>
```

```css
.deck{border-radius:32px;background:var(--ink2);border:1px solid var(--line);padding:24px;display:flex;flex-direction:column;gap:18px}
.music{background:linear-gradient(160deg,#2a1640,#141922 55%)}   /* each deck gets its own dark tint */
.disc{width:132px;height:132px;border-radius:50%;position:relative;animation:spin 6s linear infinite;animation-play-state:paused;
  background:repeating-radial-gradient(circle,#0b0e13 0 2px,#161b25 2px 4px)}
.disc:before{content:'';position:absolute;inset:32%;border-radius:50%;background:conic-gradient(from 90deg,var(--violet),var(--lilac),var(--cyan),var(--violet))}
.disc:after{content:'';position:absolute;inset:47%;border-radius:50%;background:var(--ink)}
.music.playing .disc{animation-play-state:running}
@keyframes spin{to{transform:rotate(1turn)}}
.eq{display:flex;align-items:flex-end;gap:3px;height:18px}
.eq i{width:3px;height:30%;border-radius:2px;background:var(--lime);opacity:.35}
.playing .eq i,.eq.on i{opacity:1;animation:eq .9s ease-in-out infinite}
@keyframes eq{0%,100%{height:25%}50%{height:100%}}
.tile[aria-pressed="true"]{background:linear-gradient(120deg,#12b89f55,#c8f05a22);border-color:#12b89f}
.scale{position:absolute;left:0;right:0;top:18px;height:40px;background-repeat:repeat-x;background-size:auto 18px,auto 30px;
  background-image:repeating-linear-gradient(90deg,#ffffff40 0 1px,transparent 1px 12px),repeating-linear-gradient(90deg,#ffffff80 0 2px,transparent 2px 60px)}
.needle{position:absolute;top:8px;bottom:30px;width:3px;background:#ff3d5a;box-shadow:0 0 14px #ff3d5a;left:8%;transition:left .9s var(--ease)}
```

```js
const music=new Audio('assets/sound/meditation-impromptu-01.m4a');music.loop=true;music.preload='none';
function setMusic(on){ on?music.play().catch(()=>{}):music.pause();
  musicDeck.classList.toggle('playing',on);musicIcon.setAttribute('d',on?'M7 5h4v14H7zM13 5h4v14h-4z':'M8 5v14l11-7z'); }
playBtn.onclick=()=>setMusic(music.paused);
music.ontimeupdate=()=>{seek.style.width=music.currentTime/music.duration*100+'%'};
// tracks that only exist in the app: say so honestly
otherTrack.onclick=()=>toast('Full library in the app','“Healing” plays in FitVita');

// nature: one sound at a time; literal paths so a single-file build can inline them
const SOUNDS={rain:'assets/sound/rain.m4a',fire:'assets/sound/fire.m4a' /* … */};
const nat=new Audio();nat.loop=true;
tiles.forEach(t=>t.onclick=()=>{const on=t.getAttribute('aria-pressed')!=='true';
  tiles.forEach(x=>x.setAttribute('aria-pressed','false'));
  if(on){t.setAttribute('aria-pressed','true');nat.src=SOUNDS[t.dataset.sound];nat.play().catch(()=>{})}else nat.pause();});

// radio tuner: needle moves to the genre, 0.8 s of band-passed noise, then the station card lights up
function staticBurst(){
  actx=actx||new AudioContext();
  const len=actx.sampleRate*.8,buf=actx.createBuffer(1,len,actx.sampleRate),d=buf.getChannelData(0);
  for(let i=0;i<len;i++)d[i]=Math.random()*2-1;
  const src=actx.createBufferSource(),bp=actx.createBiquadFilter(),g=actx.createGain();
  bp.type='bandpass';bp.frequency.value=1800;bp.Q.value=.7;
  g.gain.setValueAtTime(0,actx.currentTime);g.gain.linearRampToValueAtTime(.12,actx.currentTime+.05);
  g.gain.exponentialRampToValueAtTime(.001,actx.currentTime+.8);
  src.buffer=buf;src.connect(bp).connect(g).connect(actx.destination);src.start();
}
genres.forEach((b,i)=>b.onclick=()=>{needle.style.left=(8+i*84/(genres.length-1))+'%';staticBurst();
  stName.textContent='Tuning…';setTimeout(()=>{stName.textContent=b.textContent;stEq.classList.add('on')},900)});
```
