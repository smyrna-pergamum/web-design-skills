# Components

Copy-ready building blocks for the point cloud matrix tech site. Every snippet comes from the working reference in
`../example/index.html`; open it for complete content, responsive rules and translations.

## Contents

1. [Tokens, fonts and the framed sheet](#1-tokens-fonts-and-the-framed-sheet)
2. [Section header and cells](#2-section-header-and-cells)
3. [Matrix rain](#3-matrix-rain)
4. [Magnetic cursor and magnetic elements](#4-magnetic-cursor)
5. [Point-cloud hero with cursor attraction](#5-point-cloud-hero)
6. [Isometric voxel field](#6-isometric-voxel-field)
7. [Twin view (grid + wireframes)](#7-twin-view)
8. [Render settings panel wired to the effects](#8-render-settings-panel)
9. [Industry tabs](#9-industry-tabs)

---

## 1. Tokens, fonts and the framed sheet

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;700&family=Space+Mono:wght@400;700&display=swap">
```

```css
:root{
  color-scheme:dark;
  --bg:#11161a; --line:rgba(255,255,255,.08); --line-2:rgba(255,255,255,.16);
  --text:#fff; --soft:#c9d6dd; --muted:#8fa9b8; --dim:#5d7180; --lime:#c6f432; --cyan:#5fe1e7;
  --f-sans:"Space Grotesk","Struve","Helvetica Neue",Arial,sans-serif;
  --f-mono:"Space Mono",ui-monospace,Menlo,monospace;
  --frame:min(1360px,calc(100% - 32px));
}
html,body{overflow-x:clip}
.frame{position:relative;z-index:1;width:var(--frame);margin:0 auto;border-left:1px solid var(--line);border-right:1px solid var(--line)}
section{border-bottom:1px solid var(--line);background:rgba(17,22,26,.78)}   /* quiets the rain behind text */
section.hero{background:none}
header.top{position:sticky;top:0;z-index:40;width:var(--frame);margin:0 auto;height:64px;display:flex;align-items:center;
  background:rgba(17,22,26,.82);backdrop-filter:blur(10px);border:1px solid var(--line);border-top:0}
.btn{display:inline-flex;gap:12px;padding:13px 18px;font:400 12px/1 var(--f-mono);letter-spacing:.06em;text-transform:uppercase}
.btn.light{background:#fff;color:#11161a}.btn.light:hover{background:var(--lime)}
.btn.dark{background:#1b2329;color:var(--lime);border:1px solid var(--line-2)}
```

## 2. Section header and cells

```html
<div class="sec-label"><b>02</b><span>What we do</span></div>
<h2 class="sec-title">Our technologies</h2>
<div class="grid tech">
  <div class="cell"><h3>Rendering engine</h3><p>…</p>
    <ul class="feat"><li>LOD and streaming</li><li>Real-time rendering</li><li>Full input control</li></ul></div>
  …
</div>
```

```css
.sec-label{display:flex;gap:10px;padding:22px 28px 0;font:400 11px var(--f-mono);text-transform:uppercase;color:var(--muted)}
.sec-label b{color:var(--lime);font-weight:400}
.sec-title{font-weight:400;font-size:clamp(34px,4vw,58px);letter-spacing:-.025em;padding:18px 28px 40px;border-bottom:1px solid var(--line)}
.cell{padding:28px;border-right:1px solid var(--line);display:flex;flex-direction:column}
.cell:last-child{border-right:0}
.feat{list-style:none;margin:auto 0 0;padding:28px 0 0;display:grid;gap:6px;font:400 10.5px/1.4 var(--f-mono);text-transform:uppercase;color:var(--dim)}
```

## 3. Matrix rain

```html
<canvas id="rain" aria-hidden="true"></canvas>  <!-- first element in body -->
```

```css
#rain{position:fixed;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;opacity:.55}
```

```js
const c=document.getElementById('rain'),g=c.getContext('2d');
const glyphs='01アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEF{}[]<>/\\=+*#$%LATLONXYZ';
let cols,drops,speed,fs,W,H;
function size(){const dpr=Math.min(devicePixelRatio,1.5);W=innerWidth;H=innerHeight;c.width=W*dpr;c.height=H*dpr;g.setTransform(dpr,0,0,dpr,0,0);
  fs=W<640?13:15;cols=Math.ceil(W/fs);drops=Array.from({length:cols},()=>Math.random()*-H/fs);
  speed=Array.from({length:cols},()=>.35+Math.random()*.7);g.fillStyle='#11161a';g.fillRect(0,0,W,H);}
function draw(){
  g.fillStyle='rgba(17,22,26,.12)';g.fillRect(0,0,W,H);           // trail
  g.font=`${fs}px "Space Mono",monospace`;
  for(let i=0;i<cols;i++){
    const x=i*fs,y=drops[i]*fs,near=Math.max(0,1-Math.hypot(x-mouse.x,y-mouse.y)/180);  // brighter near the cursor
    g.fillStyle=near>0?`rgba(${198+57*near|0},${244+11*near|0},${50+205*near|0},${.55+.45*near})`:'rgba(198,244,50,.55)';
    g.fillText(glyphs[Math.random()*glyphs.length|0],x,y);
    drops[i]+=speed[i];
    if(y>H&&Math.random()>.975)drops[i]=Math.random()*-20;
  }
}
size();addEventListener('resize',size);
if(reduce){for(let k=0;k<160;k++)draw();}             // one still frame
else{let last=0;(function loop(t){if(t-last>33){draw();last=t;}requestAnimationFrame(loop);})(0);}
```

## 4. Magnetic cursor

```html
<div class="cur" id="cur" aria-hidden="true"><span class="ring"></span><span class="dot"></span></div>
<a class="btn light" href="#contact" data-magnet>Request a demo</a>
```

```css
.cur{position:fixed;left:0;top:0;z-index:100;pointer-events:none;display:none}
.cur .dot{position:absolute;width:6px;height:6px;margin:-3px;background:var(--lime);border-radius:50%}
.cur .ring{position:absolute;width:38px;height:38px;margin:-19px;border:1px solid rgba(198,244,50,.7);border-radius:50%;
  transition:width .25s,height .25s,margin .25s,border-radius .25s}
.cur.snap .ring{border-radius:6px}
@media (pointer:fine){.cur{display:block;opacity:0}.cur.on{opacity:1}}
[data-magnet]{transition:transform .35s cubic-bezier(.2,.8,.2,1)}
```

```js
const mags=[...document.querySelectorAll('[data-magnet], header.top nav a, .lang button')];
let rx=0,ry=0,strength=.7;
function frame(){
  let tx=mouse.x,ty=mouse.y,snap=null;
  mags.forEach(el=>{
    const r=el.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,dx=mouse.x-cx,dy=mouse.y-cy;
    const reach=Math.max(r.width,r.height)*.9+40,d=Math.hypot(dx,dy);
    if(el.hasAttribute('data-magnet')){
      if(d<reach){const k=(1-d/reach)*strength;el.style.transform=`translate(${dx*k*.35}px,${dy*k*.45}px)`;
        if(d<reach*.6){snap=el;tx=cx+dx*.2;ty=cy+dy*.2;}}
      else el.style.transform='';
    }else if(d<Math.max(r.width,r.height)*.6){snap=el;tx=cx;ty=cy;}
  });
  rx+=(tx-rx)*.22;ry+=(ty-ry)*.22;
  if(snap){const r=snap.getBoundingClientRect();ring.style.width=r.width+14+'px';ring.style.height=r.height+12+'px';
    ring.style.margin=`${-(r.height+12)/2}px 0 0 ${-(r.width+14)/2}px`;cur.classList.add('snap');}
  else{ring.style.width=ring.style.height='38px';ring.style.margin='-19px';cur.classList.remove('snap');}
  ring.style.transform=`translate(${rx}px,${ry}px)`;dot.style.transform=`translate(${mouse.x}px,${mouse.y}px)`;
  requestAnimationFrame(frame);
}
if(matchMedia('(pointer:fine)').matches&&!reduce)requestAnimationFrame(frame);
```

## 5. Point-cloud hero

```js
// 1) generate points from simple shapes with a seeded random
const P=[];let s=7;const rnd=()=>(s=(s*16807)%2147483647)/2147483647;
for(let i=0;i<5200;i++)P.push((rnd()-.5)*12,-.02*rnd(),(rnd()-.5)*6);                 // ground
towers.forEach(([cx,cz,w,d,h])=>{for(let i=0;i<h*620;i++){const f=rnd()*4|0,y=rnd()*h;  // tower faces
  const x=f<2?cx+(f?w:-w)/2:cx+(rnd()-.5)*w, z=f<2?cz+(rnd()-.5)*d:cz+(f===2?d:-d)/2; P.push(x,y,z);}});
for(let i=0;i<1500;i++){const t=rnd();P.push(-5+t*10,Math.sin(t*Math.PI)*1.2+.25,2.2+(rnd()-.5)*.25);} // bridge arch
// 2) Points with vertex colours; keep an untouched copy as "base"
const base=new Float32Array(P),pos=new Float32Array(P);
const cloud=new THREE.Points(geo,new THREE.PointsMaterial({size:.016,vertexColors:true,transparent:true,depthWrite:false}));
// 3) every frame: cursor → ray → plane through the city → local coordinates → attract
ndc.set((mouse.x-r.left)/r.width*2-1,-((mouse.y-r.top)/r.height*2-1));ray.setFromCamera(ndc,camera);
if(ray.ray.intersectPlane(plane,hit)){local.copy(hit);cloud.worldToLocal(local);}
for(let i=0;i<N;i++){const j=i*3;let tx=base[j],ty=base[j+1],tz=base[j+2];
  const dx=local.x-tx,dy=local.y-ty,d=Math.hypot(dx,dy);
  if(d<1.6){const k=(1-d/1.6)**2*strength;tx+=dx*k;ty+=dy*k;tz+=.6*k;}           // squared falloff
  pos[j]+=(tx-pos[j])*.18;pos[j+1]+=(ty-pos[j+1])*.18;pos[j+2]+=(tz-pos[j+2])*.18;}
geo.attributes.position.needsUpdate=true;
```

Only update while the hero is on screen (`IntersectionObserver`). Density works by hiding points with a stable hash
(`(i*2654435761%1000)/1000 > density`), so changing it does not reshuffle the city.

Readability: `.hero::before{background:linear-gradient(90deg,rgba(17,22,26,.92) 0,rgba(17,22,26,.6) 30%,transparent 55%)}`.

## 6. Isometric voxel field

```js
function voxels(canvas,seed,lit){
  const g=canvas.getContext('2d');/* size canvas to clientWidth × dpr */
  let s=seed;const rnd=()=>(s=(s*16807)%2147483647)/2147483647;const S=30;
  for(let r=0;r<rows;r++)for(let q=0;q<cols;q++){
    const x=(q-r)*S*.866+W/2,y=(q+r)*S*.5-H*.6,h=(1+rnd()*3|0)*S*.45,glow=rnd()<lit;
    const [top,left,right]=glow?['#c6f432','#7fa21a','#a4cf22']:['#2a343b','#1a2227','#222c33'];
    // left face, right face, top face as three polygons; add shadowBlur glow on lit cubes
  }
}
```

## 7. Twin view

Perspective floor: vertical lines from a vanishing row at 38% height fanning to the bottom, horizontal lines spaced by
`pow(k/14,1.8)`. Seven wireframe boxes (front rect + offset top/side edges), the first in lime with a mono ID label.
Regenerate with a new seed when the industry tab changes.

## 8. Render settings panel

```html
<div class="slider"><label for="s1">Point size</label><input id="s1" type="range" min="1" max="40" value="16"><output for="s1">16</output></div>
```

```js
const bind=(id,fn)=>{const el=document.getElementById(id),out=el.nextElementSibling;
  el.addEventListener('input',()=>{out.textContent=el.value;fn(+el.value);});};
bind('s1',v=>cloudCfg.size=.006+v*.0006);         // point size
bind('s2',v=>cloudCfg.density=v/100);             // point density
bind('s3',v=>rain.style.opacity=String(v/100));   // rain
bind('s4',v=>strength=v/100);                     // magnet
```

A demo panel that *does* something is the best product explanation; keep the labels in the product's language.

## 9. Industry tabs

`<ul role="tablist">` of mono buttons with `aria-selected`; Arrow Up/Down move the selection; the right panel's heading
and text come from a per-language array and the twin canvas is redrawn with the tab index as its seed.
