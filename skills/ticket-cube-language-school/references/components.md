# Components

Copy-ready building blocks for the ticket-cube language-school site. Every snippet is taken from the working reference
in `../example/index.html` (open it for the full content, all eight languages and responsive rules) or from the
production setup the style was first built for.

## Contents

1. [Tokens and fonts](#1-tokens-and-fonts)
2. [Ticket-bar navigation](#2-ticket-bar-navigation)
3. [Word tickets](#3-word-tickets)
4. [Mouse-reactive 3D cube](#4-mouse-reactive-3d-cube)
5. [Boarding-pass accordion](#5-boarding-pass-accordion)
6. [Timetable grid](#6-timetable-grid)
7. [Chat finder](#7-chat-finder)
8. [Split-flap FAQ](#8-split-flap-faq)
9. [Form endpoint (PHP + SMTP)](#9-form-endpoint-php--smtp)
10. [Languages and RTL](#10-languages-and-rtl)
11. [Cookie consent popup](#11-cookie-consent-popup)
12. [Install as app (PWA)](#12-install-as-app-pwa)
13. [Production: SEO, one URL per language](#13-production-seo-one-url-per-language)

---

## 1. Tokens and fonts

```html
<link href="https://fonts.googleapis.com/css2?family=Unbounded:wght@400;600;800&family=Manrope:wght@400;500;600;700;800&family=Vazirmatn:wght@400;600;800&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
```

```css
:root{
  /* Layout idea: a speech-bubble "portal" — live blob canvas hero, stacked door-cards, a chat finder, every language one tap away */
  --ink:#0F2438;
  --night:#08182A;
  --violet:#0B7A6F;
  --coral:#FFB627;
  --lilac:#D3F1EA;
  --cream:#F7F4EC;
  --muted:#4E6273;
  --line:rgba(15,36,56,.14);
  --display:"Unbounded","Vazirmatn",ui-sans-serif,system-ui,sans-serif;
  --body:"Manrope","Vazirmatn",ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;
  --ease:cubic-bezier(.2,.75,.2,1);
  color-scheme:light;
}

html[dir="rtl"]{--display:"Vazirmatn","Unbounded",sans-serif;--body:"Vazirmatn","Manrope",sans-serif}
:root{--paper:#E8F7F3;--hard:0 6px 0 var(--ink);--mono:"JetBrains Mono",ui-monospace,monospace}
```

In production (and for GDPR, because Google Fonts transfers the visitor's IP) self-host the same fonts from
[Fontsource](https://fontsource.org) (`npm pack @fontsource/unbounded` etc.) with `font-display:swap` and load only the
subsets you need (latin, latin-ext, cyrillic, arabic).

## 2. Ticket-bar navigation

```html
<div class="tbar">
      <a class="brand" href="#main" aria-label="atlasio – language school (demo)">
        <svg width="40" height="33" aria-hidden="true"><use href="#logo"/></svg>
        <span><span class="brand-word">atlasio</span><span class="brand-sub">Language school · demo</span></span>
      </a>
      <a class="navi" href="#wege"><span data-i="nav1">Lernwege</span><small>01</small></a>
      <a class="navi" href="#woche"><span data-i="nav2">Woche</span><small>02</small></a>
      <a class="navi" href="#finder"><span data-i="nav3">Weg finden</span><small>03</small></a>
      <a class="navi" href="#faq"><span>FAQ</span><small>04</small></a>
      <div class="app-wrap" style="display:flex;align-items:center"><button type="button" class="app-chip" data-app aria-haspopup="dialog"><svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M12 3v12m0 0-4.5-4.5M12 15l4.5-4.5M5 19h14"/></svg><span data-i="appBtn">App</span></button></div>
      <div class="langbox">
        <button class="lang-btn" type="button" id="langBtn" aria-haspopup="true" aria-expanded="false" aria-controls="langPop">
          <svg width="18" height="18" aria-hidden="true"><use href="#globe"/></svg><span id="langName">Deutsch</span>
        </button>
        <div class="lang-pop" id="langPop" hidden role="group" aria-label="Language"></div>
      </div>
    </div>
    <a class="cta-pill" href="#anmelden"><span data-i="nav4">Anmelden</span><i aria-hidden="true">→</i></a>
```

```css
.tbar{flex:1;display:flex;align-items:stretch;background:var(--paper);border:1.5px solid var(--ink);border-radius:16px;box-shadow:0 5px 0 var(--ink);min-height:58px}
.tbar>*{position:relative;display:flex;align-items:center;padding:0 18px}
.tbar>*+*{border-inline-start:1.5px solid var(--ink)}
.tbar>*+*::before,.tbar>*+*::after{content:"";position:absolute;inset-inline-start:-8px;width:14px;height:14px;border-radius:50%;background:var(--cream);border:1.5px solid var(--ink)}
.tbar>*+*::before{top:-8px}.tbar>*+*::after{bottom:-8px}
.tbar .brand{padding-inline-end:22px}
.tbar .brand-word{font-size:20px}
.tbar .brand-sub{white-space:nowrap}
.tbar .navi{flex:1;text-decoration:none;font-weight:800;font-size:14px;gap:8px;transition:background .2s}
.tbar .navi:hover{background:#fff}
.tbar .navi small{font:500 10px/1 var(--mono);opacity:.55}
.tbar .langbox{padding:0 10px}
.cta-pill{display:inline-flex;align-items:center;gap:12px;background:var(--ink);color:#fff;text-decoration:none;border-radius:999px;padding:6px 6px 6px 22px;font-weight:800;font-size:14px;box-shadow:0 5px 0 var(--violet);white-space:nowrap;align-self:center}
.cta-pill i{width:42px;height:42px;border-radius:50%;background:var(--coral);color:var(--ink);display:grid;place-items:center;font-style:normal;font-size:18px;transition:transform .3s var(--ease)}
.cta-pill:hover i{transform:rotate(-45deg)}
  .tbar .navi{display:none}.tbar .langbox{margin-inline-start:auto}.cta-pill{display:none}
.tbar>.app-wrap{padding:0 4px}
```

## 3. Word tickets

```html
<div class="ticket t-left"><small id="tlTop">In English</small><b id="tlWord">Hello</b></div>
<div class="ticket t-right"><small>Your first word</small><b id="trWord" lang="de">Hallo</b></div>
```

```css
.ticket{position:relative;border:1.5px solid var(--ink);border-radius:16px;box-shadow:var(--hard);padding:16px 24px 22px;display:grid;gap:6px;max-width:300px}
.ticket::before,.ticket::after{content:"";position:absolute;top:50%;width:18px;height:18px;margin-top:-9px;border-radius:50%;background:var(--cream);border:1.5px solid var(--ink)}
.ticket::before{inset-inline-start:-10px}.ticket::after{inset-inline-end:-10px}
.ticket small{font:500 11px/1 var(--mono);letter-spacing:.06em;opacity:.75}
.ticket b{font:800 clamp(30px,3.6vw,48px)/1.1 var(--display);letter-spacing:-.03em;text-align:center;padding:10px 0 2px}
.ticket .perf{position:absolute;inset-block:12px;inset-inline-end:46px;border-inline-start:1.5px dashed currentColor;opacity:.35}
.t-left{background:var(--lilac);color:var(--ink);transform:rotate(-2deg)}
.t-right{background:var(--violet);color:#fff;justify-self:end;transform:rotate(2deg)}
  .t-right{justify-self:start}
```

## 4. Mouse-reactive 3D cube

```html
<div class="stage" id="stage" aria-roledescription="3D carousel" aria-label="Lernwege">
          <div class="floor" aria-hidden="true"></div>
          <div class="cube" id="cube"></div>
          <p class="hint" data-i="tap">Ziehen, tippen oder mit der Maus bewegen</p>
          <p class="sr" aria-live="polite" id="cubeLive"></p>
        </div>
```

```css
.stage{position:relative;height:520px;display:grid;place-items:center;perspective:1200px;touch-action:pan-y;cursor:grab;user-select:none}
.stage:active{cursor:grabbing}
.floor{position:absolute;width:380px;height:380px;bottom:0;left:50%;margin-left:-190px;background:var(--lilac);border:1.5px solid var(--ink);box-shadow:8px 8px 0 var(--ink);transform:rotateX(70deg) rotateZ(45deg);border-radius:12px;opacity:.95}
.cube{--s:300px;position:relative;width:var(--s);height:var(--s);transform-style:preserve-3d;will-change:transform;margin-bottom:60px}
.face{position:absolute;inset:0;background:var(--cream);border:1.5px solid var(--ink);border-radius:10px;padding:16px 16px 0;display:flex;flex-direction:column;backface-visibility:hidden;-webkit-backface-visibility:hidden}
.face .inner{flex:1;border-radius:6px;display:flex;flex-direction:column;justify-content:space-between;padding:18px;overflow:hidden;position:relative}
.face .inner .n{font:800 92px/.85 "Unbounded",sans-serif;letter-spacing:-.08em;opacity:.95}
.face .inner h3{font-size:24px;letter-spacing:-.03em;line-height:1.1}
.face .inner .chip{align-self:flex-start;font:700 10px/1 var(--mono);letter-spacing:.06em;padding:6px 8px;border-radius:6px;background:rgba(255,255,255,.22);border:1px solid currentColor;text-transform:uppercase}
.face .cap{height:40px;display:flex;align-items:center;justify-content:center;font:500 11px/1 var(--mono);letter-spacing:.08em}
.f0{transform:translateZ(calc(var(--s)/2))}
.f1{transform:rotateY(90deg) translateZ(calc(var(--s)/2))}
.f2{transform:rotateY(180deg) translateZ(calc(var(--s)/2))}
.f3{transform:rotateY(-90deg) translateZ(calc(var(--s)/2))}
.ftop{transform:rotateX(90deg) translateZ(calc(var(--s)/2));background:var(--ink);display:grid;place-items:center;padding:0}
.fbot{transform:rotateX(-90deg) translateZ(calc(var(--s)/2));background:var(--ink)}
.hint{position:absolute;bottom:0;left:50%;transform:translateX(-50%);font:500 11px/1 var(--mono);color:var(--muted);white-space:nowrap}
  .stage{height:420px;order:-1}
  .cube{--s:230px}
  .floor{width:300px;height:300px;margin-left:-150px}
.face .inner .ph{position:absolute;top:14px;inset-inline-end:14px;width:68px;height:68px;border:2px solid currentColor}
```

```js
/* ---------- cube ---------- */
function renderCube(){
 const t=T[L];
 $("#cube").innerHTML=PATHS.map((p,i)=>`<div class="face f${i}" aria-hidden="true"><div class="inner ${p.i}"><span class="ph ph${i+1}"></span><span class="chip">${p.lang==="de"?t.tDe:t.tEn} · ${p.on?t.onsite:t.online}</span><div><span class="n">0${i+1}</span><h3>${esc(t[p.id+"t"])}</h3></div></div><div class="cap">${p.on?"Musterstraße 12":"Atlasio Online"}</div></div>`).join("")
  +`<div class="face ftop" aria-hidden="true"><svg width="120" height="98" viewBox="0 0 88 72"><use href="#logo"/></svg></div><div class="face fbot" aria-hidden="true"></div>`;
 $("#dots").innerHTML=PATHS.map((p,i)=>`<button type="button" data-face="${i}" aria-pressed="${i===face}" aria-label="${esc(t[p.id+"t"])}">0${i+1}</button>`).join("");
 updateCubeText();
}
function updateCubeText(){
 const t=T[L],p=PATHS[face],me=LANGS.find(l=>l.c===L),target=p.lang==="de"?"Hallo":"Hello";
 $("#tlTop").textContent=t.inLang; $("#tlWord").textContent=me.hi; $("#tlWord").dir=me.rtl?"rtl":"ltr";
 $("#trWord").textContent=target; $("#trWord").lang=p.lang;
 $("#mean").textContent=`${target} · ${t.means} ${me.hi}`;
 $("#meanSub").textContent=`${t[p.id+"t"]} · 0${face+1}`;
 $$("#dots button").forEach((b,i)=>b.setAttribute("aria-pressed",i===face));
 $("#cubeLive").textContent=`0${face+1} ${t[p.id+"t"]}`;
}
let rotY=0,targetY=0,tiltX=-12,targetTiltX=-12,tiltY=0,targetTiltY=0,drag=null,lastInteract=0;
function goFace(i,dir){
 const n=PATHS.length; i=((i%n)+n)%n;
 let cur=Math.round(-targetY/90); let delta=((i-((cur%n)+n)%n)+n)%n; if(dir===-1||delta>2) delta-=n;
 targetY=-(cur+delta)*90; face=i; updateCubeText(); lastInteract=performance.now();
 if(openPass!==i){openPass=i;syncPasses();}
}
const stage=$("#stage"),cube=$("#cube");
stage.addEventListener("pointermove",e=>{
 const r=stage.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
 if(drag){targetY=drag.y0+(e.clientX-drag.x)*.5;drag.moved=Math.abs(e.clientX-drag.x)>6;return;}
 targetTiltX=-12-y*26; targetTiltY=x*34;
});
stage.addEventListener("pointerleave",()=>{targetTiltX=-12;targetTiltY=0;});
stage.addEventListener("pointerdown",e=>{drag={x:e.clientX,y0:targetY,moved:false};stage.setPointerCapture(e.pointerId);});
stage.addEventListener("pointerup",e=>{
 if(!drag)return; const moved=drag.moved; drag=null;
 if(moved){const i=Math.round(-targetY/90);targetY=-i*90;face=((i%4)+4)%4;updateCubeText();lastInteract=performance.now();if(openPass!==face){openPass=face;syncPasses();}}
 else goFace(face+1,1);
});
stage.tabIndex=0;
stage.addEventListener("keydown",e=>{
 const rtl=document.documentElement.dir==="rtl";
 if(e.key==="ArrowRight"){e.preventDefault();goFace(face+(rtl?-1:1),rtl?-1:1);}
 if(e.key==="ArrowLeft"){e.preventDefault();goFace(face+(rtl?1:-1),rtl?1:-1);}
 if(e.key==="Enter"){location.hash="";$("#"+PATHS[face].id)?.scrollIntoView();}
});
document.addEventListener("click",e=>{const d=e.target.closest("[data-face]");if(d)goFace(+d.dataset.face);});
function frame(t){
 if(!rm && !drag && t-lastInteract>4500){ targetY-=.08; const i=Math.round(-targetY/90),f=((i%4)+4)%4; if(f!==face && Math.abs(-targetY/90-i)<.05){face=f;updateCubeText();} }
 const k=rm?1:.09; rotY+=(targetY-rotY)*k; tiltX+=(targetTiltX-tiltX)*k; tiltY+=(targetTiltY-tiltY)*k;
 cube.style.transform=`rotateX(${tiltX}deg) rotateY(${rotY+tiltY}deg)`;
 requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
```

## 5. Boarding-pass accordion

```css
.passes{display:flex;gap:16px;height:500px;margin-top:40px}
.pass{position:relative;flex:1;min-width:0;border:1.5px solid var(--ink);border-radius:22px;box-shadow:var(--hard);overflow:hidden;transition:flex .6s var(--ease);cursor:pointer;display:flex}
.pass[data-open="true"]{flex:3.6;cursor:default}
.pass .closed{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:space-between;padding:22px 18px;transition:opacity .3s;background:none;border:0;color:inherit;text-align:start;cursor:pointer;font:inherit}
.pass[data-open="true"] .closed{opacity:0;pointer-events:none}
.pass .vlabel{writing-mode:vertical-rl;font:800 13px/1 var(--body);letter-spacing:.2em;text-transform:uppercase}
.pass .bign{font:800 64px/1 "Unbounded",sans-serif;letter-spacing:-.06em}
.pass .open{flex:1;display:flex;flex-direction:column;opacity:0;transition:opacity .35s .15s;min-width:520px}
.pass[data-open="true"] .open{opacity:1}
.pass:not([data-open="true"]) .open{visibility:hidden}
.strip{display:flex;justify-content:space-between;align-items:center;padding:16px 28px;font:500 12px/1 var(--mono);letter-spacing:.12em;text-transform:uppercase;border-bottom:1.5px dashed currentColor}
.route{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:26px 28px 6px;font:800 clamp(48px,6vw,88px)/1 "Unbounded",sans-serif;letter-spacing:-.04em}
.route .plane{font-size:.55em}
.pass h3{font-size:clamp(24px,2.6vw,34px);letter-spacing:-.03em;padding:14px 28px 4px}
.pass .psub{padding:0 28px;opacity:.82;font-weight:600}
.pfields{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;padding:20px 28px;margin-top:auto}
.pfields small{display:block;font:500 10px/1 var(--mono);letter-spacing:.12em;text-transform:uppercase;opacity:.7;margin-bottom:6px}
.pfields b{font-weight:800;font-size:14px;line-height:1.35;text-transform:none}
.pacts{display:flex;gap:10px;flex-wrap:wrap;padding:0 28px 26px}
.pass.c1{background:var(--violet);color:#fff}.pass.c2{background:var(--coral);color:var(--ink)}.pass.c3{background:var(--ink);color:#fff}.pass.c4{background:var(--lilac);color:var(--ink)}
.pass.c1 .btn-coral,.pass.c3 .btn-coral{color:var(--ink)}
.pass .notch{position:absolute;top:56px;width:22px;height:22px;border-radius:50%;background:var(--cream);border:1.5px solid var(--ink)}
.pass .notch.l{inset-inline-start:-12px}.pass .notch.r{inset-inline-end:-12px}
  .passes{flex-direction:column;height:auto}
  .pass{flex:none!important;min-height:84px}
  .pass .closed{flex-direction:row;align-items:center}
  .pass .vlabel{writing-mode:horizontal-tb}
  .pass .bign{font-size:40px}
  .pass .open{min-width:0}
  .pass:not([data-open="true"]) .open{display:none}
  .pfields{grid-template-columns:1fr}
.pass .route{position:relative}
.pass .pph{width:84px;height:84px;border:2px solid currentColor;box-shadow:0 4px 0 var(--ink)}
```

```js
/* ---------- passes ---------- */
function renderPasses(){
 const t=T[L];
 $("#passes").innerHTML=PATHS.map((p,i)=>{const k=p.id,from=L!==p.lang?L.toUpperCase():"A1",to=p.lang.toUpperCase();
  return `<article class="pass ${p.c}" id="${k}" data-i="${i}" data-open="${i===openPass}" aria-labelledby="${k}-h">
   <span class="notch l" aria-hidden="true"></span><span class="notch r" aria-hidden="true"></span>
   <button class="closed" type="button" data-pass="${i}" aria-expanded="${i===openPass}" aria-controls="${k}-o"><span class="vlabel">${p.lang==="de"?t.tDe:t.tEn} · ${esc(t[k+"t"])}</span><span class="bign">0${i+1}</span></button>
   <div class="open" id="${k}-o">
    <div class="strip"><span>Atlasio · ${esc(t.pass)} · 0${i+1}</span><span>${p.on?t.onsite:t.online}</span></div>
    <div class="route" dir="ltr"><span>${from}</span><span class="plane" aria-hidden="true">✈</span><span class="ph pph ph${i+1}" aria-hidden="true"></span><span>${to}</span></div>
    <h3 id="${k}-h">${esc(t[k+"t"])}</h3><p class="psub">${esc(t[k+"s"])}</p>
    <div class="pfields"><div><small>${t.dLevel}</small><b>${esc(t[k+"l"])}</b></div><div><small>${t.dWhen}</small><b>${tm(t[k+"w"])}</b></div><div><small>${t.dCost}</small><b>${p.on?t.free:esc(t.p4cost)}</b></div></div>
    <div class="pacts"><a class="btn ${p.btn} btn-sm" href="#anmelden" data-pick="${k}">${t.apply} <span class="arrow" aria-hidden="true">→</span></a></div>
   </div></article>`;}).join("");
}
function syncPasses(){$$(".pass").forEach((el,i)=>{el.dataset.open=i===openPass;el.querySelector(".closed").setAttribute("aria-expanded",i===openPass);});}
document.addEventListener("click",e=>{const b=e.target.closest("[data-pass]");if(b){openPass=+b.dataset.pass;syncPasses();goFace(openPass);const o=$("#"+PATHS[openPass].id+"-o a");setTimeout(()=>o&&o.focus({preventScroll:true}),300);}});
```

## 6. Timetable grid

Events are positioned by start and end hour inside a fixed-height column (`H` px for `span` hours).

```js
function renderWeek(){
 const t=T[L],H=340,start=15,span=5,pos=(a,b)=>`top:${(a-start)/span*H}px;height:${(b-a)/span*H-4}px`;
 const ev={1:[[16,18.5,"c","16:00–18:30",t.evB],[18.5,20,"e","18:30–20:00",t.evE]],2:[[15,17.5,"c","15:00–17:30",t.evA]]};
 let h=`<div></div>`+t.days.map(d=>`<div class="dh">${d}</div>`).join("");
 h+=`<div class="hours">${[15,16,17,18,19,20].map((x,i)=>`<span style="top:${i/span*H}px">${x}:00</span>`).join("")}</div>`;
 for(let i=0;i<5;i++) h+=`<div class="tcol">${(ev[i]||[]).map(e=>`<div class="ev ${e[2]}" style="${pos(e[0],e[1])}"><b>${e[3]}</b>${esc(e[4])}</div>`).join("")}</div>`;
 $("#tgrid").innerHTML=h;
}
```

## 7. Chat finder

```js
const BOT='<svg width="34" height="28" aria-hidden="true"><use href="#logo"/></svg>';
let F={fl:"de",fg:"learn",ft:"full",fv:"low"};
function renderChat(){
 const t=T[L];
 const q=(txt,name,opts,hidden)=>`<div class="msg bot"${hidden?" hidden":""}>${BOT}<span>${esc(txt)}</span></div>
  <fieldset class="answers"${hidden?" hidden":""}><legend>${esc(txt)}</legend>${opts.map(([v,l])=>`<label><input type="radio" name="${name}" value="${v}"${F[name]===v?" checked":""}><span>${esc(l)}</span></label>`).join("")}</fieldset>`;
 let h=q(t.b1,"fl",[["de",t.tDe],["en",t.tEn]])+q(t.b2,"fg",[["learn",t.b2a],["talk",t.b2b]])+q(t.b3,"ft",[["full",t.b3a],["week",t.b3b],["flex",t.b3c]])+q(t.b4,"fv",[["low",t.b4a],["mid",t.b4b]],F.fl!=="de");
 let pick,why;
 if(F.fl==="en"){ if(F.ft==="flex"||F.fg==="learn"){pick="p4";why=t.why4}else{pick="p3";why=t.why3} }
 else if(F.ft==="flex"){pick="p1";why=t.why5}
 else if(F.fg==="talk"||F.ft==="week"){pick="p2";why=F.fv==="mid"?t.why2b:t.why2a}
 else {pick="p1";why=t.why1}
 h+=`<div class="result" aria-live="polite"><small>${t.rK}</small><h3>${esc(t[pick+"t"])}</h3><p style="font-weight:700">${tm(t[pick+"w"])}</p><p>${esc(why)}</p>
  <div class="acts"><a class="btn btn-violet btn-sm" href="#anmelden" data-pick="${pick}">${t.rGo} <span class="arrow" aria-hidden="true">→</span></a><a class="btn btn-line btn-sm" href="#${pick}">${t.rSee}</a></div><p class="note">${t.rNote}</p></div>`;
 $("#chat").innerHTML=h;
 if(pick==="p2") $(F.fv==="mid"?"#f-g1":"#f-g2").checked=true;
}
```

## 8. Split-flap FAQ

```css
.qcard{position:relative;background:var(--lilac);border:1.5px solid var(--ink);border-radius:0 22px 22px 22px;box-shadow:var(--hard);padding:40px 30px;margin-top:30px}
.qcard::before{content:"";position:absolute;top:-30px;inset-inline-start:-1.5px;width:45%;height:30px;background:var(--lilac);border:1.5px solid var(--ink);border-bottom:0;border-radius:16px 16px 0 0}
.qcard h2{font-size:clamp(30px,3.4vw,46px);letter-spacing:-.04em;display:flex;align-items:center;gap:12px;flex-wrap:wrap}
.qcard h2 i{font-style:normal;width:48px;height:48px;border-radius:50%;background:var(--ink);color:#fff;display:grid;place-items:center;font-size:26px}
.qcard p{margin-top:16px;font:800 22px/1.2 var(--display);color:var(--violet)}
.qpanel{background:var(--ink);border:1.5px solid var(--ink);border-radius:26px;box-shadow:0 6px 0 var(--violet);padding:14px;display:grid;gap:12px}
.qpanel details{border:0;background:rgba(255,255,255,.06);border-radius:16px;padding:0 18px;color:#fff}
.qpanel summary{font:700 clamp(16px,1.8vw,20px)/1.35 var(--body);padding:18px 0;letter-spacing:0;align-items:center;justify-content:flex-start;gap:14px}
.qpanel summary::after{margin-inline-start:auto;width:16px;height:16px;border-radius:50%;background:transparent;border:1.5px solid rgba(255,255,255,.5);content:"";transform:none!important}
.qpanel details[open] summary::after{background:var(--coral);border-color:var(--coral)}
.flap{display:inline-flex;gap:3px;flex:none}
.flap span{width:26px;height:34px;display:grid;place-items:center;background:#051220;border-radius:5px;font:700 17px/1 var(--mono);color:var(--lilac);position:relative;overflow:hidden}
.flap span::after{content:"";position:absolute;inset-inline:0;top:50%;height:1px;background:rgba(255,255,255,.18)}
.qpanel details p{background:var(--cream);color:var(--ink);border-radius:12px;padding:14px 16px;margin:0 0 16px;font-size:16px}
.qcard.withphoto{margin-top:0;border-radius:0 0 22px 22px}
.qcard.withphoto::before{display:none}
```

```js
function renderFaq(){$("#faqList").innerHTML=T[L].faq.map(([q,a],i)=>`<details${i===0?" open":""}><summary><span class="flap" aria-hidden="true" dir="ltr"><span>0</span><span>${i+1}</span></span><span>${esc(q)}</span></summary><p>${esc(a)}</p></details>`).join("");}
```

## 9. Form endpoint (PHP + SMTP)

The demo sends nothing. In production the form POSTs JSON to a small PHP script that validates, rate-limits, sends the
application to the school and a confirmation in the visitor's language, and stores nothing. Shared hosts often refuse
PHP `mail()` unless the sender is a mailbox on that host, so the script talks SMTP (SSL, `AUTH LOGIN`) to the
organisation's own mail provider (e.g. Google Workspace with an app password). Credentials live in a file **outside
the web root**:

```php
<?php // ../site-mail-config.php (not web-accessible)
return ['host'=>'smtp.gmail.com','port'=>465,'user'=>'no-reply@example.org','pass'=>'APP-PASSWORD','from'=>'no-reply@example.org'];
```

Client side:

```js
fetch("/send.php",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)})
  .then(r=>r.json().then(j=>({ok:r.ok&&j.ok,j})))
  .then(({ok,j})=>{if(!ok)throw 0;showOk(j.ref);})
  .catch(()=>{/* show translated error with the contact address */});
```

Server (`send.php`, addresses are placeholders):

```php
<?php
/**
 * Atlasio – Anmeldeformular
 * Sendet jede Anmeldung an office@example.org und eine Bestätigung an die Person.
 * Speichert keine Anmeldedaten auf dem Server (nur einen anonymisierten Zähler gegen Spam).
 */
declare(strict_types=1);
date_default_timezone_set('Europe/Berlin');

const TO_ADDRESS   = 'office@example.org';
const FROM_ADDRESS = 'office@example.org';
const FROM_NAME    = 'School';
const MAX_PER_HOUR = 5;
const MIN_SECONDS  = 3;

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function out(int $code, array $data): void { http_response_code($code); echo json_encode($data); exit; }
function clean(?string $v, int $max = 200): string {
  $v = trim((string)$v);
  $v = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $v) ?? '';
  return mb_substr($v, 0, $max);
}
function oneLine(string $v): string { return trim(preg_replace('/[\r\n]+/', ' ', $v) ?? ''); }
function mimeHeader(string $v): string { return '=?UTF-8?B?' . base64_encode($v) . '?='; }

/** Minimal SMTP (SSL) client – sends through the Google Workspace account in the config file. */
function smtp_send(array $cfg, string $to, string $subject, string $body, string $headers): bool {
  $fp = @stream_socket_client('ssl://' . $cfg['host'] . ':' . (int)$cfg['port'], $en, $es, 15);
  if (!$fp) return false;
  stream_set_timeout($fp, 20);
  $read = function () use ($fp): string { $d = ''; while (($l = fgets($fp, 515)) !== false) { $d .= $l; if (isset($l[3]) && $l[3] === ' ') break; } return $d; };
  $cmd = function (string $c, array $ok) use ($fp, $read): bool { if ($c !== '') fwrite($fp, $c . "\r\n"); return in_array((int)substr($read(), 0, 3), $ok, true); };
  $ok = $cmd('', [220]) && $cmd('EHLO example.org', [250]) && $cmd('AUTH LOGIN', [334])
     && $cmd(base64_encode($cfg['user']), [334]) && $cmd(base64_encode(preg_replace('/\s+/', '', (string)$cfg['pass'])), [235])
     && $cmd('MAIL FROM:<' . $cfg['from'] . '>', [250]) && $cmd('RCPT TO:<' . $to . '>', [250, 251]) && $cmd('DATA', [354]);
  if ($ok) {
    $msg = "To: <$to>\r\nSubject: $subject\r\nDate: " . date('r') . "\r\nMessage-ID: <" . bin2hex(random_bytes(10)) . "@example.org>\r\n"
         . $headers . "\r\n\r\n" . preg_replace('/\r?\n/', "\r\n", $body);
    $msg = preg_replace('/^\./m', '..', $msg);
    $ok = $cmd($msg . "\r\n.", [250]);
  }
  @fwrite($fp, "QUIT\r\n"); fclose($fp);
  return $ok;
}
$cfg = @include dirname(__DIR__) . '/site-mail-config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') out(405, ['ok' => false, 'error' => 'method']);
if (!is_array($cfg) || empty($cfg['pass']) || str_contains((string)$cfg['pass'], 'HIER')) out(500, ['ok' => false, 'error' => 'config']);

// Same-origin check
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$host   = $_SERVER['HTTP_HOST'] ?? '';
if ($origin !== '' && parse_url($origin, PHP_URL_HOST) !== preg_replace('/:\d+$/', '', $host)) out(403, ['ok' => false, 'error' => 'origin']);

$in = json_decode(file_get_contents('php://input') ?: '', true);
if (!is_array($in)) out(400, ['ok' => false, 'error' => 'payload']);

// Spam: honeypot + minimum fill time
if (clean($in['web'] ?? '') !== '') out(200, ['ok' => true, 'ref' => 'LS-' . date('Y') . '-' . strtoupper(substr(bin2hex(random_bytes(3)), 0, 5))]);
$started = (int)($in['t'] ?? 0);
if ($started > 0 && (time() - intdiv($started, 1000)) < MIN_SECONDS) out(429, ['ok' => false, 'error' => 'fast']);

// Rate limit per IP (anonymised hash, kept 1 hour)
$ipHash = hash('sha256', ($_SERVER['REMOTE_ADDR'] ?? '') . '|site');
$rlFile = sys_get_temp_dir() . '/ls_rl_' . substr($ipHash, 0, 24);
$now = time();
$hits = [];
if (is_file($rlFile)) { $hits = array_filter(array_map('intval', explode(',', (string)file_get_contents($rlFile))), fn($t) => $t > $now - 3600); }
if (count($hits) >= MAX_PER_HOUR) out(429, ['ok' => false, 'error' => 'rate']);

// Fields
$programs = [
  'p1' => 'Deutsch lernen – Deutschkurs (Intensive)',
  'p2' => 'Deutsch sprechen – Sprachcafé',
  'p3' => 'English Speaking Café',
  'p4' => 'English Learning – Online',
];
$levels  = ['l0' => 'Keine Kenntnisse (A0)', 'l1' => 'A1', 'l2' => 'A2', 'l3' => 'B1', 'l4' => 'B2 oder höher', 'l5' => 'Weiß ich nicht'];
$starts  = ['s0' => 'So bald wie möglich', 's1' => 'Nächsten Monat', 's2' => 'Später, bitte informieren'];
$groups  = ['tue' => 'Dienstag 16:00–18:30 (B1+)', 'wed' => 'Mittwoch 15:00–17:30 (A1–A2)'];
$goals   = ['g0' => 'Ausbildung / Studium', 'g1' => 'Arbeit', 'g2' => 'Alltag'];
$devices = ['d0' => 'Laptop / PC', 'd1' => 'Nur Smartphone', 'd2' => 'Keins'];
$langs   = ['de','en','tr','ar','fa','uk','ru','fr'];

$program = clean($in['program'] ?? '', 4);
$first   = oneLine(clean($in['first'] ?? '', 80));
$last    = oneLine(clean($in['last'] ?? '', 80));
$email   = oneLine(clean($in['email'] ?? '', 160));
$phone   = oneLine(clean($in['phone'] ?? '', 40));
$msg     = clean($in['msg'] ?? '', 3000);
$lang    = in_array($in['lang'] ?? '', $langs, true) ? $in['lang'] : 'de';
$consent = ($in['consent'] ?? false) === true;

$errors = [];
if (!isset($programs[$program])) $errors[] = 'program';
if ($first === '') $errors[] = 'first';
if ($last === '') $errors[] = 'last';
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'email';
if (!$consent) $errors[] = 'consent';
if ($program === 'p1' && !isset($levels[$in['level'] ?? ''])) $errors[] = 'level';
if ($program === 'p4' && !isset($goals[$in['goal'] ?? ''])) $errors[] = 'goal';
if ($errors) out(422, ['ok' => false, 'error' => 'invalid', 'fields' => $errors]);

$ref = 'LS-' . date('Y') . '-' . strtoupper(substr(bin2hex(random_bytes(4)), 0, 5));

// --- Mail to Atlasio ---
$lines = [
  "Neue Anmeldung über example.org",
  "",
  "Anmeldenummer: $ref",
  "Angebot:       {$programs[$program]}",
  "Name:          $first $last",
  "E-Mail:        $email",
  "Telefon:       " . ($phone !== '' ? $phone : '–'),
];
if ($program === 'p1') { $lines[] = "Deutschniveau: " . $levels[$in['level']]; $lines[] = "Start:         " . ($starts[$in['start'] ?? ''] ?? '–'); }
if ($program === 'p2') { $lines[] = "Gruppe:        " . ($groups[$in['group'] ?? ''] ?? '–'); }
if ($program === 'p4') { $lines[] = "Ziel:          " . $goals[$in['goal']]; $lines[] = "Gerät:         " . ($devices[$in['device'] ?? ''] ?? '–'); }
$lines[] = "Seitensprache: " . strtoupper($lang);
$lines[] = "";
$lines[] = "Nachricht:";
$lines[] = $msg !== '' ? $msg : '–';
$lines[] = "";
$lines[] = "Einwilligung zur Datenverarbeitung: ja (" . date('d.m.Y H:i') . ")";
$lines[] = "Antworten: einfach auf diese E-Mail antworten (geht an $email).";

$adminHeaders = implode("\r\n", [
  'MIME-Version: 1.0',
  'Content-Type: text/plain; charset=UTF-8',
  'Content-Transfer-Encoding: 8bit',
  'From: ' . mimeHeader(FROM_NAME) . ' <' . $cfg['from'] . '>',
  'Reply-To: ' . mimeHeader("$first $last") . " <$email>",
  'X-Mailer: School',
]);
$adminSubject = mimeHeader("[School] Neue Anmeldung $ref – {$programs[$program]} – $first $last");
$sent = smtp_send($cfg, TO_ADDRESS, $adminSubject, implode("\n", $lines), $adminHeaders);
if (!$sent) out(500, ['ok' => false, 'error' => 'mail']);

// --- Confirmation to applicant (in page language) ---
$C = [
 'de' => ["Deine Anmeldung bei Atlasio – %s", "Hallo %s,\n\ndanke für deine Anmeldung für „%s“.\nDeine Anmeldenummer: %s\n\nDas Atlasio-Team prüft Plätze und Termine und meldet sich bei dir mit allen Details.\nFragen? Antworte einfach auf diese E-Mail."],
 'en' => ["Your Atlasio application – %s", "Hi %s,\n\nthank you for applying for “%s”.\nYour reference number: %s\n\nThe Atlasio team will check places and dates and get back to you with all the details.\nQuestions? Just reply to this email."],
 'tr' => ["Atlasio başvurun – %s", "Merhaba %s,\n\n„%s“ için başvurduğun için teşekkürler.\nBaşvuru numaran: %s\n\nAtlasio ekibi kontenjan ve tarihleri kontrol edip tüm ayrıntılarla sana dönecek.\nSorun mu var? Bu e-postayı yanıtlaman yeterli."],
 'ar' => ["تسجيلك في Atlasio – %s", "مرحبًا %s،\n\nشكرًا لتسجيلك في «%s».\nرقم تسجيلك: %s\n\nسيراجع فريق Atlasio الأماكن والمواعيد ويتواصل معك بكل التفاصيل.\nلديك أسئلة؟ ما عليك سوى الرد على هذه الرسالة."],
 'fa' => ["ثبت‌نام تو در Atlasio – %s", "سلام %s،\n\nممنون که برای «%s» ثبت‌نام کردی.\nشماره ثبت‌نام تو: %s\n\nتیم Atlasio ظرفیت و تاریخ‌ها را بررسی می‌کند و با همه جزئیات با تو تماس می‌گیرد.\nسؤالی داری؟ کافی است به همین ایمیل پاسخ بدهی."],
 'uk' => ["Твоя заявка в Atlasio – %s", "Привіт, %s!\n\nДякуємо за заявку на «%s».\nНомер твоєї заявки: %s\n\nКоманда Atlasio перевірить місця й дати та зв'яжеться з тобою з усіма деталями.\nЄ питання? Просто дай відповідь на цей лист."],
 'ru' => ["Твоя заявка в Atlasio – %s", "Привет, %s!\n\nСпасибо за заявку на «%s».\nНомер твоей заявки: %s\n\nКоманда Atlasio проверит места и даты и свяжется с тобой со всеми подробностями.\nЕсть вопросы? Просто ответь на это письмо."],
 'fr' => ["Ton inscription Atlasio – %s", "Bonjour %s,\n\nmerci pour ton inscription à « %s ».\nTon numéro d'inscription : %s\n\nL'équipe Atlasio vérifie les places et les dates et revient vers toi avec tous les détails.\nDes questions ? Réponds simplement à cet e-mail."],
];
[$subj, $body] = $C[$lang];
$body = sprintf($body, $first, $programs[$program], $ref) . "\n\n—\nSchool · A brand by Atlasio\nMusterstraße 12, 10115 Berlin\noffice@example.org · https://example.org\n";
$userHeaders = implode("\r\n", [
  'MIME-Version: 1.0',
  'Content-Type: text/plain; charset=UTF-8',
  'Content-Transfer-Encoding: 8bit',
  'From: ' . mimeHeader(FROM_NAME) . ' <' . $cfg['from'] . '>',
  'Reply-To: Atlasio <' . TO_ADDRESS . '>',
  'Auto-Submitted: auto-replied',
]);
smtp_send($cfg, $email, mimeHeader(sprintf($subj, $ref)), $body, $userHeaders);

// Count this submission for rate limiting
$hits[] = $now;
@file_put_contents($rlFile, implode(',', $hits), LOCK_EX);

out(200, ['ok' => true, 'ref' => $ref]);
```

## 10. Languages and RTL

All strings live in `T[lang]` (keys shared across languages); HTML defaults are the main language so the page reads
without JS. `applyLang` sets `lang`/`dir`, fills every `[data-i]` and re-renders the dynamic parts.

```js
function applyLang(c,user){
 L=T[c]?c:"de"; const t=T[L], meta=LANGS.find(l=>l.c===L);
 document.documentElement.lang=L; document.documentElement.dir=meta.rtl?"rtl":"ltr";
 $$("[data-i]").forEach(el=>{const v=t[el.dataset.i]; if(typeof v==="string") el.textContent=v;});
 $$("[data-ih]").forEach(el=>{el.innerHTML=t[el.dataset.ih];});
 renderLangUI();renderCube();renderPasses();renderWeek();renderChat();renderForm();renderFaq();
 if($("#okBox")) showOk(lastRef);
 if(user){ try{history.replaceState(null,"","#"+L);}catch(e){} if(consent&&consent.pref){try{localStorage.setItem("ls-lang",L);}catch(e){}} }
}
```

```js
// wrap times so they never flip in RTL
const tm=s=>esc(s).replace(/(\d{1,2}:\d{2}–\d{1,2}:\d{2})/g,'<span class="ltr">$1</span>');
```

## 11. Cookie consent popup

Equal-weight buttons, an unticked optional category, language chips inside the popup, focus trap, `inert` page,
choice + timestamp stored, reopen link in the footer. Only optional features (remembered language, service worker)
depend on consent; there are no trackers.

```html
<div class="ck-back" id="ckBack" hidden>
  <div class="ck" role="dialog" aria-modal="true" aria-labelledby="ckTitle" aria-describedby="ckText">
    <div class="ck-top">
      <h2 id="ckTitle"><svg width="34" height="28" aria-hidden="true"><use href="#logo"/></svg><span data-i="ckT">Deine Privatsphäre</span></h2>
      <div class="ck-langs" id="ckLangs" role="group" aria-label="Language"></div>
    </div>
    <p id="ckText" data-i="ckP"></p>
    <div class="ck-links"><a href="#"><span data-i="privacy">Datenschutz</span> ↗</a><a href="#"><span data-i="imprint">Impressum</span> ↗</a></div>
    <div class="ck-cats" id="ckCats" hidden>
      <div class="ck-cat"><div><b data-i="ckNecT">Notwendig</b><span data-i="ckNecD"></span></div><div style="text-align:center"><label class="sw"><input type="checkbox" checked disabled aria-labelledby="ckNecL"><i></i></label><div class="ck-always" id="ckNecL" data-i="ckAlways">Immer aktiv</div></div></div>
      <div class="ck-cat"><div><b id="ckPrefL" data-i="ckPrefT">Komfort</b><span data-i="ckPrefD"></span></div><label class="sw"><input type="checkbox" id="ckPref" aria-labelledby="ckPrefL"><i></i></label></div>
    </div>
    <div class="ck-btns">
      <button type="button" class="btn btn-ink" id="ckNecBtn" data-i="ckNec">Nur notwendige</button>
      <button type="button" class="btn btn-ink" id="ckAllBtn" data-i="ckAll">Alle akzeptieren</button>
      <button type="button" class="btn btn-out full" id="ckSet" aria-expanded="false" aria-controls="ckCats" data-i="ckSet">Einstellungen</button>
      <button type="button" class="btn btn-violet full" id="ckSave" hidden data-i="ckSave">Auswahl speichern</button>
    </div>
  </div>
</div>
```

```js
/* ---------- consent (DSGVO / TTDSG) ---------- */
function getCk(){try{const c=JSON.parse(localStorage.getItem(CK_KEY));return c&&c.v===CK_V?c:null;}catch(e){return null;}}
function applyCk(c){consent=c;
 if(c&&c.pref){try{localStorage.setItem("ls-lang",L);}catch(e){} enableSW();}
 else{try{localStorage.removeItem("ls-lang");}catch(e){} disableSW();}}
function setCk(pref){const c={v:CK_V,pref:!!pref,ts:new Date().toISOString()};try{localStorage.setItem(CK_KEY,JSON.stringify(c));}catch(e){} applyCk(c);closeCk();}
const ckBack=$("#ckBack");let ckReturn=null;
function renderCkLangs(){$("#ckLangs").innerHTML=LANGS.map(l=>`<button type="button" lang="${l.c}" data-cklang="${l.c}" aria-current="${l.c===L}">${l.n}</button>`).join("");}
function openCk(){ckReturn=document.activeElement;renderCkLangs();$("#ckPref").checked=!!(consent&&consent.pref);$("#ckCats").hidden=true;$("#ckSave").hidden=true;$("#ckSet").setAttribute("aria-expanded","false");
 ckBack.hidden=false;$$("body>header,body>main,body>footer").forEach(el=>el.inert=true);setTimeout(()=>$("#ckNecBtn").focus(),30);}
function closeCk(){ckBack.hidden=true;$$("body>header,body>main,body>footer").forEach(el=>el.inert=false);if(ckReturn&&ckReturn.focus)ckReturn.focus();}
$("#ckAllBtn").onclick=()=>setCk(true);
$("#ckNecBtn").onclick=()=>setCk(false);
$("#ckSave").onclick=()=>setCk($("#ckPref").checked);
$("#ckSet").onclick=()=>{const o=$("#ckCats").hidden;$("#ckCats").hidden=!o;$("#ckSave").hidden=!o;$("#ckSet").setAttribute("aria-expanded",o);};
$("#ckOpen").onclick=openCk;
$("#ckLangs").addEventListener("click",e=>{const b=e.target.closest("[data-cklang]");if(b){applyLang(b.dataset.cklang,true);renderCkLangs();b&&$(`[data-cklang="${b.dataset.cklang}"]`).focus();}});
ckBack.addEventListener("keydown",e=>{if(e.key!=="Tab")return;const f=[...ckBack.querySelectorAll("button:not([hidden]),input,a[href]")].filter(x=>x.offsetParent!==null);const first=f[0],last=f[f.length-1];
 if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}});

const TX={"de":{"appBtn":"App","appT":"Atlasio als App","appP":"Installiere Atlasio auf deinem Handy oder Computer. Dann öffnest du die Seite mit einem Tipp, auch ohne Internet.","appNeed":"Dafür speichert dein Browser Dateien dieser Seite (Einstellung „Komfort“). Mit dem Button unten stimmst du dem zu.","appAllow":"Erlauben und installieren","appInstall":"Jetzt installieren","appHow":"So geht's","appIos":"Tippe in Safari unten auf „Teilen“ (Quadrat mit Pfeil) und dann auf „Zum Home-Bildschirm“.","appAndroid":"Öffne das Browser-Menü (⋮) und tippe auf „App installieren“ oder „Zum Startbildschirm hinzufügen“.","appDesktop":"Klicke in Chrome oder Edge rechts in der Adressleiste auf das Installieren-Symbol oder im Menü (⋮) auf „App installieren“.","appDone":"Atlasio ist auf diesem Gerät schon als App installiert.","close":"Schließen"},"en":{"appBtn":"App","appT":"Atlasio as an app","appP":"Install Atlasio on your phone or computer. Then you open it with one tap, even without internet.","appNeed":"For this, your browser stores files of this site (“Convenience” setting). By using the button below, you agree to this.","appAllow":"Allow and install","appInstall":"Install now","appHow":"How it works","appIos":"In Safari, tap “Share” (square with arrow) at the bottom, then “Add to Home Screen”.","appAndroid":"Open the browser menu (⋮) and tap “Install app” or “Add to Home screen”.","appDesktop":"In Chrome or Edge, click the install icon on the right of the address bar, or open the menu (⋮) and choose “Install app”.","appDone":"Atlasio is already installed as an app on this device.","close":"Close"},"tr":{"appBtn":"Uygulama","appT":"Atlasio uygulaması","appP":"Atlasio'yi telefonuna ya da bilgisayarına kur. Sonra tek dokunuşla, internet olmadan da açabilirsin.","appNeed":"Bunun için tarayıcın bu sitenin dosyalarını saklar („Kolaylık“ ayarı). Aşağıdaki butonla buna onay vermiş olursun.","appAllow":"İzin ver ve kur","appInstall":"Şimdi kur","appHow":"Nasıl yapılır","appIos":"Safari'de alttaki „Paylaş“ simgesine (oklu kare), sonra „Ana Ekrana Ekle“ye dokun.","appAndroid":"Tarayıcı menüsünü (⋮) aç ve „Uygulamayı yükle“ ya da „Ana ekrana ekle“ye dokun.","appDesktop":"Chrome veya Edge'de adres çubuğunun sağındaki yükleme simgesine ya da menüde (⋮) „Uygulamayı yükle“ye tıkla.","appDone":"Atlasio bu cihazda zaten uygulama olarak kurulu.","close":"Kapat"},"ar":{"appBtn":"التطبيق","appT":"Atlasio كتطبيق","appP":"ثبّت Atlasio على هاتفك أو حاسوبك، وافتحه بلمسة واحدة حتى دون إنترنت.","appNeed":"لهذا يحفظ متصفحك ملفات هذا الموقع (إعداد «الراحة»). باستخدام الزر أدناه توافق على ذلك.","appAllow":"السماح والتثبيت","appInstall":"ثبّت الآن","appHow":"طريقة التثبيت","appIos":"في Safari اضغط على «مشاركة» (مربع مع سهم) في الأسفل، ثم على «إضافة إلى الشاشة الرئيسية».","appAndroid":"افتح قائمة المتصفح (⋮) واضغط على «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية».","appDesktop":"في Chrome أو Edge اضغط على رمز التثبيت يمين شريط العنوان، أو اختر «تثبيت التطبيق» من القائمة (⋮).","appDone":"Atlasio مثبّت بالفعل كتطبيق على هذا الجهاز.","close":"إغلاق"},"fa":{"appBtn":"اپ","appT":"Atlasio به‌صورت اپ","appP":"Atlasio را روی گوشی یا کامپیوترت نصب کن تا با یک لمس و حتی بدون اینترنت بازش کنی.","appNeed":"برای این کار مرورگرت فایل‌های این سایت را ذخیره می‌کند (تنظیم «راحتی»). با دکمه زیر با آن موافقت می‌کنی.","appAllow":"اجازه بده و نصب کن","appInstall":"همین حالا نصب کن","appHow":"روش نصب","appIos":"در Safari پایین صفحه روی «اشتراک‌گذاری» (مربع با فلش) و بعد «افزودن به صفحه اصلی» بزن.","appAndroid":"منوی مرورگر (⋮) را باز کن و «نصب برنامه» یا «افزودن به صفحه اصلی» را بزن.","appDesktop":"در Chrome یا Edge روی نماد نصب در سمت راست نوار آدرس کلیک کن یا از منو (⋮) «نصب برنامه» را بزن.","appDone":"Atlasio قبلاً روی این دستگاه به‌صورت اپ نصب شده است.","close":"بستن"},"uk":{"appBtn":"Застосунок","appT":"Atlasio як застосунок","appP":"Встанови Atlasio на телефон або комп'ютер і відкривай одним дотиком, навіть без інтернету.","appNeed":"Для цього браузер зберігає файли сайту (налаштування «Зручність»). Натиснувши кнопку нижче, ти погоджуєшся з цим.","appAllow":"Дозволити й встановити","appInstall":"Встановити зараз","appHow":"Як це зробити","appIos":"У Safari натисни внизу «Поділитися» (квадрат зі стрілкою), а потім «На початковий екран».","appAndroid":"Відкрий меню браузера (⋮) і натисни «Встановити застосунок» або «Додати на головний екран».","appDesktop":"У Chrome чи Edge натисни значок встановлення праворуч в адресному рядку або вибери в меню (⋮) «Встановити застосунок».","appDone":"Atlasio вже встановлено на цьому пристрої як застосунок.","close":"Закрити"},"ru":{"appBtn":"Приложение","appT":"Atlasio как приложение","appP":"Установи Atlasio на телефон или компьютер и открывай одним касанием, даже без интернета.","appNeed":"Для этого браузер сохраняет файлы сайта (настройка «Удобство»). Нажимая кнопку ниже, ты соглашаешься с этим.","appAllow":"Разрешить и установить","appInstall":"Установить сейчас","appHow":"Как это сделать","appIos":"В Safari нажми внизу «Поделиться» (квадрат со стрелкой), затем «На экран „Домой“».","appAndroid":"Открой меню браузера (⋮) и нажми «Установить приложение» или «Добавить на главный экран».","appDesktop":"В Chrome или Edge нажми значок установки справа в адресной строке или выбери в меню (⋮) «Установить приложение».","appDone":"Atlasio уже установлен на этом устройстве как приложение.","close":"Закрыть"},"fr":{"appBtn":"Appli","appT":"Atlasio en appli","appP":"Installe Atlasio sur ton téléphone ou ton ordinateur et ouvre-le d'un seul geste, même sans internet.","appNeed":"Pour cela, ton navigateur enregistre des fichiers du site (réglage « Confort »). En utilisant le bouton ci-dessous, tu acceptes.","appAllow":"Autoriser et installer","appInstall":"Installer maintenant","appHow":"Comment faire","appIos":"Dans Safari, touche « Partager » (carré avec flèche) en bas, puis « Sur l'écran d'accueil ».","appAndroid":"Ouvre le menu du navigateur (⋮) et touche « Installer l'application » ou « Ajouter à l'écran d'accueil ».","appDesktop":"Dans Chrome ou Edge, clique sur l'icône d'installation à droite de la barre d'adresse, ou choisis « Installer l'application » dans le menu (⋮).","appDone":"Atlasio est déjà installé comme appli sur cet appareil.","close":"Fermer"}};
const TX2={"de":{"eSend":"Das hat leider nicht geklappt. Bitte versuche es noch einmal oder schreib an hello@atlasio.example."},"en":{"eSend":"Sorry, that didn't work. Please try again or write to hello@atlasio.example."},"tr":{"eSend":"Maalesef gönderilemedi. Lütfen tekrar dene ya da hello@atlasio.example adresine yaz."},"ar":{"eSend":"عذرًا، لم يتم الإرسال. حاول مرة أخرى أو راسلنا على hello@atlasio.example."},"fa":{"eSend":"متأسفانه ارسال نشد. دوباره امتحان کن یا به hello@atlasio.example ایمیل بزن."},"uk":{"eSend":"На жаль, не вдалося надіслати. Спробуй ще раз або напиши на hello@atlasio.example."},"ru":{"eSend":"К сожалению, отправить не удалось. Попробуй ещё раз или напиши на hello@atlasio.example."},"fr":{"eSend":"Désolé, l'envoi n'a pas fonctionné. Réessaie ou écris à hello@atlasio.example."}};Object.keys(TX2).forEach(l=>Object.assign(T[l],TX2[l]));
```

## 12. Install as app (PWA)

Needs `manifest.webmanifest`, icons (192, 512, maskable) and a service worker over HTTPS. The demo only shows the
dialog. Register the service worker after consent, cache navigations network-first, assets cache-first.

```js
/* ---------- PWA ---------- */
let deferredPrompt=null,appReturn=null;
const isStandalone=()=>matchMedia("(display-mode: standalone)").matches||navigator.standalone===true;
const isIOS=/iphone|ipad|ipod/i.test(navigator.userAgent)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1);
const isAndroid=/android/i.test(navigator.userAgent);
addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredPrompt=e;});
addEventListener("appinstalled",()=>{deferredPrompt=null;closeApp();syncAppBtns();});
function syncAppBtns(){$$("[data-app]").forEach(b=>b.hidden=isStandalone());}
function enableSW(){try{if("serviceWorker" in navigator&&(location.protocol==="https:"||location.hostname==="localhost")){navigator.serviceWorker.register("sw.js").catch(()=>{});}}catch(e){}}
function disableSW(){
 try{if("serviceWorker" in navigator){navigator.serviceWorker.getRegistrations().then(rs=>rs.forEach(r=>r.unregister())).catch(()=>{});}
  if(window.caches){caches.keys().then(k=>k.filter(n=>n.startsWith("atlasio")).forEach(n=>caches.delete(n))).catch(()=>{});}}catch(e){}}
function appView(){const t=T[L];
 if(isStandalone())return `<p>${esc(t.appDone)}</p>`;
 let h=`<p>${esc(t.appP)}</p>`;
 if(!(consent&&consent.pref))h+=`<p class="app-note">${esc(t.appNeed)}</p>`;
 h+=`<div class="app-how"><b>${esc(t.appHow)}</b><p>${esc(isIOS?t.appIos:isAndroid?t.appAndroid:t.appDesktop)}</p></div>`;return h;}
function renderApp(){const t=T[L],need=!(consent&&consent.pref);$("#appBody").innerHTML=appView();const g=$("#appGo");g.textContent=need?t.appAllow:t.appInstall;g.hidden=isStandalone()||(!need&&!deferredPrompt);}
function openApp(){appReturn=document.activeElement;renderApp();$("#appBack").hidden=false;$$("body>header,body>main,body>footer").forEach(el=>el.inert=true);setTimeout(()=>($("#appGo").hidden?$("#appClose"):$("#appGo")).focus(),30);}
function closeApp(){if($("#appBack").hidden)return;$("#appBack").hidden=true;$$("body>header,body>main,body>footer").forEach(el=>el.inert=false);if(appReturn&&appReturn.focus)appReturn.focus();}
async function promptInstall(){if(!deferredPrompt)return false;const p=deferredPrompt;deferredPrompt=null;p.prompt();try{await p.userChoice;}catch(e){}return true;}
$("#appGo").onclick=async()=>{
 if(!(consent&&consent.pref)){const c={v:CK_V,pref:true,ts:new Date().toISOString()};try{localStorage.setItem(CK_KEY,JSON.stringify(c));}catch(e){}applyCk(c);}
 if(!deferredPrompt){const g=$("#appGo");g.disabled=true;await new Promise(r=>{let n=0;const iv=setInterval(()=>{if(deferredPrompt||++n>16){clearInterval(iv);r();}},250);});g.disabled=false;}
 if(deferredPrompt){closeApp();await promptInstall();}else renderApp();};
$("#appClose").onclick=closeApp;
$("#appBack").addEventListener("keydown",e=>{if(e.key==="Escape")closeApp();});
$("#appBack").addEventListener("click",e=>{if(e.target.id==="appBack")closeApp();});
document.addEventListener("click",e=>{if(e.target.closest("[data-app]"))openApp();});
syncAppBtns();
```

```js
// sw.js
const CACHE="site-v1",CORE=["/","/de/","/assets/site.css","/assets/site.js","/manifest.webmanifest"];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(n=>n!==CACHE).map(n=>caches.delete(n)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{const r=e.request,u=new URL(r.url);
  if(r.method!=="GET"||u.origin!==location.origin||u.pathname==="/send.php")return;
  if(r.mode==="navigate"){e.respondWith(fetch(r).then(res=>{const c=res.clone();caches.open(CACHE).then(x=>x.put(r,c));return res;}).catch(()=>caches.match(r).then(x=>x||caches.match("/de/"))));return;}
  e.respondWith(caches.match(r).then(h=>h||fetch(r).then(res=>{if(res.ok){const c=res.clone();caches.open(CACHE).then(x=>x.put(r,c));}return res;})));});
```

## 13. Production: SEO, one URL per language

Hash-based switching (`#tr`) is fine for a demo but Google indexes only one language. For a real site:

1. **Render each language to its own folder** (`/de/index.html`, `/tr/index.html`, …). The simplest way: load the
   single-file page in headless Chrome, call `applyLang(lang)`, save `document.documentElement.outerHTML`, then move
   CSS/JS to cached files and load only that language's strings (`/assets/i18n/<lang>.js`). Language buttons navigate
   to `/<lang>/` instead of re-rendering.
2. **Head per language:**

```html
<title>Free German Course & Language Café in <City> | Brand</title>
<meta name="description" content="…real terms: free German course (A1 to advanced), language café, … Apply now.">
<link rel="canonical" href="https://example.org/en/">
<link rel="alternate" hreflang="de" href="https://example.org/de/">
<link rel="alternate" hreflang="en" href="https://example.org/en/">
<!-- …one per language… -->
<link rel="alternate" hreflang="x-default" href="https://example.org/">
<meta property="og:type" content="website"><meta property="og:url" content="https://example.org/en/">
<meta property="og:title" content="…"><meta property="og:description" content="…">
<meta property="og:image" content="https://example.org/assets/og-image.jpg"><meta property="og:locale" content="en_US">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">{"@context":"https://schema.org","@graph":[
 {"@type":"EducationalOrganization","@id":"https://example.org/#org","name":"…","address":{"@type":"PostalAddress","streetAddress":"…","postalCode":"…","addressLocality":"…","addressCountry":"DE"}},
 {"@type":"Course","name":"Learn German","description":"…","provider":{"@id":"https://example.org/#org"},
  "offers":{"@type":"Offer","price":"0","priceCurrency":"EUR","category":"Free"},"hasCourseInstance":{"@type":"CourseInstance","courseMode":"onsite"}},
 {"@type":"FAQPage","mainEntity":[{"@type":"Question","name":"…","acceptedAnswer":{"@type":"Answer","text":"…"}}]}]}</script>
```

3. **Root `/`** is the `x-default`: a tiny page with links to all languages that redirects by saved preference (only
   with consent) or `navigator.languages` — never by IP.
4. **`sitemap.xml`** lists every language URL with `xhtml:link` alternates; **`robots.txt`** points to it and
   disallows the form endpoint; a 404 page links to every language.
5. **Apache (`.htaccess`)**: HTTPS and non-www redirect, `/de` → `/de/`, compression, long cache for versioned
   assets, `no-cache` for HTML, `sw.js` and the manifest.
