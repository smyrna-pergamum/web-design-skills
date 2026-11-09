# Components

Copy-ready building blocks for the portal WebGL studio site. Every snippet comes from the working reference in
`../example/index.html`; open it for the complete content, responsive rules and translations.

## Contents

1. [Tokens, font and atmosphere layers](#1-tokens-font-and-atmosphere)
2. [Preloader](#2-preloader)
3. [Corner UI and sound chip](#3-corner-ui-and-sound-chip)
4. [Portal scene (three.js)](#4-portal-scene)
5. [Glass coverflow gallery](#5-glass-coverflow-gallery)
6. [Generative panel art](#6-generative-panel-art)
7. [Ask-me-anything terminal](#7-ask-me-anything-terminal)
8. [Ambient sound](#8-ambient-sound)
9. [Cursor and film grain](#9-cursor-and-film-grain)

---

## 1. Tokens, font and atmosphere

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@300;400;500&display=swap">
<canvas id="gl" aria-hidden="true"></canvas>
<div class="leak" aria-hidden="true"></div>
<div class="grain" id="grain" aria-hidden="true"></div>
```

```css
:root{
  color-scheme:dark;
  --bg:#05070b; --glass:rgba(255,255,255,.045); --line:rgba(232,241,242,.12);
  --ink:#e8f1f2; --muted:#8a97a0; --teal:#3fd0c9; --teal-2:#1f7f80; --violet:#b49cff; --magenta:#ff5fae;
  --mono:"Geist Mono","JetBrains Mono",ui-monospace,Menlo,monospace;
}
body{background:var(--bg);color:var(--ink);font:400 15px/1.6 var(--mono);overflow-x:clip}
#gl{position:fixed;inset:0;width:100%;height:100%;z-index:0}
main{position:relative;z-index:2}
.leak{position:fixed;inset:0;z-index:1;pointer-events:none;
  background:radial-gradient(60% 50% at 0% 0%,rgba(63,208,201,.18),transparent 70%),
             radial-gradient(50% 40% at 100% 100%,rgba(180,156,255,.08),transparent 70%)}
.big{font-weight:300;font-size:clamp(34px,5.4vw,84px);line-height:1;letter-spacing:.02em;text-transform:uppercase}
.big em{font-style:normal;color:var(--teal)}
```

## 2. Preloader

```html
<div class="loader" id="loader" aria-hidden="true"><div class="slashes" id="slashes"></div><div class="count" id="count">/0</div></div>
```

```js
(function(){
  const loader=document.getElementById('loader'),sl=document.getElementById('slashes'),ct=document.getElementById('count');
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){loader.classList.add('done');return}
  const chars='//////////01/9';const start=performance.now();
  (function tick(now){
    const p=Math.min(100,Math.round((now-start)/12));
    let s='';for(let i=0;i<150;i++)s+=chars[Math.random()*chars.length|0];
    sl.textContent=s;ct.textContent='/'+p;
    if(p<100)requestAnimationFrame(tick);else setTimeout(()=>loader.classList.add('done'),150);
  })(start);
})();
```

`.loader{position:fixed;inset:0;z-index:100;background:#000;display:grid;place-items:center;align-content:center;gap:28px;transition:opacity .6s}`
`.loader.done{opacity:0;pointer-events:none}`

## 3. Corner UI and sound chip

```html
<header class="ui">
  <a class="brand" href="#top">ATLASIO<i>.</i></a>
  <nav aria-label="Main">
    <button class="chip" id="sound" aria-pressed="false"><span class="bars" aria-hidden="true"><i></i><i></i><i></i></span><span class="lbl">Sound</span></button>
    <a href="#work">Work</a><a href="#contact">Contact</a>
    <div class="lang" role="group" aria-label="Language"><button id="lang-en" aria-pressed="true">EN</button><button id="lang-tr" aria-pressed="false">TR</button></div>
  </nav>
</header>
```

```css
header.ui{position:fixed;top:0;left:0;right:0;z-index:50;display:flex;justify-content:space-between;padding:22px 24px;pointer-events:none}
header.ui > *{pointer-events:auto}
.brand{font-weight:500;font-size:13px;letter-spacing:.32em;text-decoration:none}
.chip{background:none;border:1px solid var(--line);border-radius:999px;padding:7px 12px;color:var(--muted);font-size:11px;letter-spacing:.14em;text-transform:uppercase}
.chip[aria-pressed="true"]{color:var(--bg);background:var(--teal);border-color:var(--teal)}
.bars{display:inline-flex;gap:2px;align-items:flex-end;height:10px}
.bars i{width:2px;height:3px;background:currentColor}
.chip[aria-pressed="true"] .bars i{animation:eq .9s ease-in-out infinite}
@keyframes eq{50%{height:10px}}
```

## 4. Portal scene

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
```

```js
const canvas=document.getElementById('gl');let renderer;
try{renderer=new THREE.WebGLRenderer({canvas,antialias:true});}
catch(e){canvas.remove();/* add a CSS .fallback ring */}
renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));renderer.setClearColor(0x05070b,1);
const scene=new THREE.Scene();scene.fog=new THREE.FogExp2(0x05070b,.06);
const camera=new THREE.PerspectiveCamera(45,1,.1,100);camera.position.z=9;
const portal=new THREE.Group();scene.add(portal);
const TEAL=new THREE.Color('#3fd0c9');

// ring
portal.add(new THREE.Mesh(new THREE.TorusGeometry(1.6,.022,24,240),
  new THREE.MeshBasicMaterial({color:TEAL,transparent:true,blending:THREE.AdditiveBlending})));

// ASCII disc: redraw the canvas every ~160ms and set texture.needsUpdate=true
const asc=document.createElement('canvas');asc.width=asc.height=512;const ascTex=new THREE.CanvasTexture(asc);
portal.add(new THREE.Mesh(new THREE.CircleGeometry(1.57,96),new THREE.MeshBasicMaterial({map:ascTex,transparent:true})));

// light arms: alpha fades along each tube and pulses with time
const armMat=new THREE.ShaderMaterial({transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,
  uniforms:{uTime:{value:0},uColor:{value:TEAL}},
  vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
  fragmentShader:'varying vec2 vUv;uniform vec3 uColor;uniform float uTime;void main(){float a=sin(vUv.x*3.1416)*.85;a*=.55+.45*sin(uTime*1.3+vUv.x*6.);gl_FragColor=vec4(uColor,a*.8);}'});
for(let i=0;i<16;i++){
  const ang=i/16*Math.PI*2,r1=2.05,r2=3.1+Math.random()*.6,bend=.45+Math.random()*.3;
  const curve=new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(Math.cos(ang)*r1,Math.sin(ang)*r1,0),
    new THREE.Vector3(Math.cos(ang+bend)*((r1+r2)/2+.4),Math.sin(ang+bend)*((r1+r2)/2+.4),-.4),
    new THREE.Vector3(Math.cos(ang+bend*.4)*r2,Math.sin(ang+bend*.4)*r2,-.8));
  portal.add(new THREE.Mesh(new THREE.TubeGeometry(curve,40,.035,6,false),armMat));
}

// particles: position = spiral from far edge (k=0) into the ring (k=1), recomputed every frame
// pos.x = cos(a)*r, pos.y = sin(a)*r*.6, r=(1-k)*6+1.65, k=(seed*7.3 + t*.08*(.5+seed)) % 1
```

Per frame: advance `uTime`, rotate the arms slowly, update particles, ease the camera toward the pointer
(`camera.position.x += (pointer.x*.6 - camera.position.x)*.04`), push the portal back with scroll
(`portal.position.z = -min(1,scrollY/innerHeight)*3`) and fade the canvas.
Place the portal right of the copy on desktop (`x=2.3`) and above it on phones (`y=.9`, scale `.72`).

## 5. Glass coverflow gallery

```css
.stage{position:relative;height:min(64vh,560px);perspective:1600px}
.panel{position:absolute;left:50%;top:50%;width:min(560px,70vw);aspect-ratio:16/10;
  margin:calc(min(560px,70vw) * -.3125) 0 0 calc(min(560px,70vw) / -2);border-radius:18px;overflow:hidden;
  background:var(--glass);border:1px solid var(--line);backdrop-filter:blur(6px);
  transition:transform .8s cubic-bezier(.2,.7,.1,1),opacity .6s,filter .6s}
.panel[data-o="0"]{transform:none;z-index:5}
.panel[data-o="1"]{transform:translateX(62%) translateZ(-320px) rotateY(-28deg);opacity:.55;z-index:4}
.panel[data-o="-1"]{transform:translateX(-62%) translateZ(-320px) rotateY(28deg);opacity:.55;z-index:4}
.panel[data-o="2"]{transform:translateX(110%) translateZ(-700px) rotateY(-36deg);opacity:.2}
.panel[data-o="-2"]{transform:translateX(-110%) translateZ(-700px) rotateY(36deg);opacity:.2}
.panel[data-o="far"]{transform:translateZ(-1200px);opacity:0;pointer-events:none}
/* keep side titles from colliding with the centre title */
.panel[data-o="1"] .t,.panel[data-o="-1"] .t{opacity:.35}
.panel[data-o="2"] .t,.panel[data-o="-2"] .t,.panel[data-o="far"] .t{opacity:0}
```

```js
// filter → visible list → offsets relative to the current panel
const visible=()=>panels.filter(p=>filter==='all'||p.dataset.cat===filter);
function layoutPanels(){
  const vis=visible();if(!vis.includes(panels[cur]))cur=panels.indexOf(vis[0]);
  const vi=vis.indexOf(panels[cur]),n=vis.length;
  panels.forEach(p=>{const i=vis.indexOf(p);if(i<0){p.dataset.o='far';return}
    let d=i-vi;if(d>n/2)d-=n;if(d<-n/2)d+=n;p.dataset.o=Math.abs(d)<=2?String(d):'far';});
}
```

Filters are `<button data-f="web" aria-pressed>` styled as `-> Websites` in violet; the active one turns teal.

## 6. Generative panel art

```js
// <article class="panel" data-seed="3" data-hue="teal"><canvas></canvas>…</article>
const c=p.querySelector('canvas');const w=c.width=720,h=c.height=450;const g=c.getContext('2d');
let s=+p.dataset.seed;const rnd=()=>(s=(s*16807)%2147483647)/2147483647;
const hues={teal:['#3fd0c9','#1f7f80','#b49cff'],violet:['#b49cff','#6b4fd1','#3fd0c9'],magenta:['#ff5fae','#b49cff','#3fd0c9']}[p.dataset.hue];
g.fillStyle='#070b12';g.fillRect(0,0,w,h);
const f1=1+rnd()*3,f2=1+rnd()*3,ph=rnd()*6;
for(let i=0;i<260;i++){
  let x=rnd()*w,y=rnd()*h;g.strokeStyle=hues[i%3];g.globalAlpha=.08+rnd()*.25;g.lineWidth=.6+rnd()*1.4;
  g.beginPath();g.moveTo(x,y);
  for(let k=0;k<60;k++){const a=Math.sin(x/w*f1*6+ph)*2+Math.cos(y/h*f2*6)*2;x+=Math.cos(a)*4;y+=Math.sin(a)*4;g.lineTo(x,y);}
  g.stroke();
}
```

Replace with real project stills when available; keep the canvas as the loading state.

## 7. Ask-me-anything terminal

A glass box with an `aria-live` log, a pill input and suggestion chips. Answers are matched by regular expressions per
language from a local list; anything else gets a polite fallback pointing to the email. Type the answer in 3 characters
per 16ms for the "live" feel (instant with reduced motion). Always show a one-line note that the answers are canned,
or route to a real model through your own server (never expose an API key in the page).

## 8. Ambient sound

```js
let ctx,gain;
btn.addEventListener('click',()=>{
  const on=btn.getAttribute('aria-pressed')!=='true';btn.setAttribute('aria-pressed',String(on));
  if(!ctx){ctx=new AudioContext();gain=ctx.createGain();gain.gain.value=0;gain.connect(ctx.destination);
    [55,82.4,110.2,164.8].forEach((f,i)=>{const o=ctx.createOscillator();o.type=i%2?'sine':'triangle';o.frequency.value=f;
      const lfo=ctx.createOscillator(),lg=ctx.createGain();lfo.frequency.value=.05+i*.03;lg.gain.value=f*.006;
      lfo.connect(lg).connect(o.frequency);const g=ctx.createGain();g.gain.value=.06/(i+1);o.connect(g).connect(gain);o.start();lfo.start();});}
  ctx.resume();gain.gain.setTargetAtTime(on?.35:0,ctx.currentTime,.6);
});
```

## 9. Cursor and film grain

```js
// grain: one random noise tile, moved by a stepped CSS animation
const c=document.createElement('canvas');c.width=c.height=160;const g=c.getContext('2d');const d=g.createImageData(160,160);
for(let i=0;i<d.data.length;i+=4){const v=Math.random()*255;d.data[i]=d.data[i+1]=d.data[i+2]=v;d.data[i+3]=255;}
g.putImageData(d,0,0);grain.style.backgroundImage=`url(${c.toDataURL()})`;
// cursor: hidden until the pointer moves; grows over links, buttons and panels
addEventListener('pointermove',e=>{cur.classList.add('on');cur.style.transform=`translate(${e.clientX}px,${e.clientY}px)`;});
document.addEventListener('pointerover',e=>cur.classList.toggle('big',!!e.target.closest('a,button,.panel,input')));
```

```css
.grain{position:fixed;inset:-50%;z-index:90;pointer-events:none;opacity:.07;animation:grain 1s steps(6) infinite}
.cursor{position:fixed;left:0;top:0;z-index:95;width:34px;height:34px;margin:-17px 0 0 -17px;border:1px solid var(--teal);
  border-radius:50%;pointer-events:none;mix-blend-mode:screen;display:none}
@media (pointer:fine){.cursor{display:block;opacity:0}.cursor.on{opacity:1}}
```
