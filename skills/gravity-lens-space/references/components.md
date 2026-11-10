# Components

Copy-ready building blocks for the gravity-lens space site. Every snippet comes from the working reference in
`../example/index.html`; open it for the complete content, responsive rules and translations.

## Contents

1. [Tokens, fonts, windows](#1-tokens-fonts-windows)
2. [Rolling-letter labels](#2-rolling-letter-labels)
3. [Contextual cursor](#3-contextual-cursor)
4. [Black-hole lens shader (raw WebGL)](#4-black-hole-lens-shader)
5. [Floating video preview list](#5-floating-video-preview-list)
6. [Explorer: tilt, glare, fleeing orbs](#6-explorer)
7. [Time-dilation calculator](#7-time-dilation-calculator)
8. [Tesseract corridor](#8-tesseract-corridor)
9. [Drift finale: floating astronaut over sliding words](#9-drift-finale)
10. [Lazy video and reel dialog](#10-lazy-video-and-reel-dialog)
11. [Mouse-reactive headlines](#11-mouse-reactive-headlines)
12. [Media pipeline](#12-media-pipeline)

---

## 1. Tokens, fonts, windows

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap">
```

```css
:root{
  color-scheme:light;
  --paper:#eff0f6; --paper-2:#e4e6ef; --ink:#0d0e12; --ink-2:#4a4d5a; --muted:#7c8091; --line:rgba(13,14,18,.12);
  --void:#050608; --amber:#f29a3a; --amber-2:#ffcf8a; --ice:#9cc7ff;
  --f-sans:"Inter Tight","Aeonik","Helvetica Neue",Arial,sans-serif; --f-mono:"IBM Plex Mono",ui-monospace,Menlo,monospace;
  --r:28px; --pad:max(20px,4vw);
}
body{background:var(--paper);color:var(--ink);font:400 17px/1.55 var(--f-sans);overflow-x:clip}
.window{position:relative;border-radius:var(--r);overflow:hidden;background:var(--void);color:#fff;isolation:isolate}
.mono{font:500 12px/1.3 var(--f-mono);letter-spacing:.06em;text-transform:uppercase}
.pill{display:inline-flex;align-items:center;gap:10px;height:44px;padding:0 20px;border-radius:999px;border:0;font:500 12px/1 var(--f-mono);text-transform:uppercase}
.pill.dark{background:var(--ink);color:#fff}.pill.light{background:#fff;color:var(--ink)}
```

## 2. Rolling-letter labels

```html
<a class="pill dark" href="#contact"><span class="roll" data-roll>Let's talk</span></a>
```

```css
.roll{display:inline-flex;overflow:hidden;line-height:1.15}
.roll .ch{display:inline-block;position:relative;white-space:pre;transition:transform .45s cubic-bezier(.7,0,.2,1)}
.roll .ch::after{content:attr(data-c);position:absolute;left:0;top:100%}
a:hover .roll .ch,button:hover .roll .ch{transform:translateY(-100%)}
```

```js
// split after translating, keep the plain text as aria-label
function paintRoll(el,text){el.textContent='';[...text].forEach(c=>{const s=document.createElement('span');
  s.className='ch';s.dataset.c=c;s.textContent=c;el.append(s);});el.setAttribute('aria-label',text);}
```

## 3. Contextual cursor

```html
<div class="cur" id="cur" aria-hidden="true"><i></i><span id="cur-label"></span></div>
<div class="window" data-cursor="Drag">…</div>
```

```css
.cur{position:fixed;left:0;top:0;z-index:90;pointer-events:none;display:none}
.cur i{position:absolute;width:12px;height:12px;margin:-6px;border-radius:50%;background:var(--ink);transition:width .3s,height .3s,margin .3s}
.cur span{position:absolute;transform:translate(-50%,-50%);font:500 10px var(--f-mono);opacity:0}
/* frosted-glass ring keeps the media visible; amber only for the play action */
.cur.label i{width:36px;height:36px;margin:-18px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.75);backdrop-filter:blur(6px)}
.cur.label span{opacity:1;color:#fff;font-size:9px;text-shadow:0 1px 6px rgba(0,0,0,.6);transform:translate(26px,-50%)}  /* label beside the ring */
.cur.label.play i{background:var(--amber);border-color:var(--amber)}
.cur.label.play span{color:#111;text-shadow:none}
@media (pointer:fine){.cur{display:block;opacity:0}.cur.on{opacity:1}}
```

```js
document.addEventListener('pointerover',e=>{const h=e.target.closest('[data-cursor]');
  cur.classList.toggle('label',!!h);if(h)label.textContent=WORDS[lang][h.dataset.cursor];});
(function f(){x+=(mouseX-x)*.25;y+=(mouseY-y)*.25;cur.style.transform=`translate(${x}px,${y}px)`;requestAnimationFrame(f);})();
```

## 4. Black-hole lens shader

One full-screen triangle; no library.

```js
const gl=canvas.getContext('webgl');            // null → show the poster/video fallback instead
const vs='attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
// uniforms: uRes, uTime, uM (eased mouse −1…1), uPulse (1 on click, ×0.95 per frame), uShift (x offset on desktop)
```

Fragment shader core (see the example for `h`, `n`, `fbm`, `sky`):

```glsl
vec2 uv=(gl_FragCoord.xy-.5*uRes)/uRes.y;
vec2 cen=vec2(uShift,0.)+uM*vec2(.07,.05);
vec2 p=uv-cen; float r=length(p); float rs=.12*(1.+uPulse*.06);
vec2 dir=p/max(r,1e-4);
float bend=rs*rs*1.9/max(r,rs*.9);                       // push sampling outward: lensing
vec3 col=sky(uv-dir*bend+uM*.04+vec2(uTime*.004,0.));
col*=smoothstep(rs*.98,rs*1.08,r);                        // shadow
float tilt=.16+uM.y*.07;
vec2 q=vec2(p.x,p.y/tilt); float dr=length(q); float ang=atan(q.y,q.x);
float band=smoothstep(rs*1.25,rs*1.75,dr)*smoothstep(rs*4.6,rs*1.9,dr);
float a2=ang-uTime*.35;                                   // periodic noise input: no seam at ±pi
float sw=.55+.45*n(vec2(cos(a2),sin(a2))*2.6+vec2(dr*26.,0.))+.25*sin(dr*90.-uTime*3.);
float dop=1.+.75*(-p.x/(rs*4.));                          // Doppler: approaching side brighter
vec3 disk=mix(vec3(1.,.5,.16),vec3(1.,.92,.78),smoothstep(rs*4.,rs*1.6,dr))*band*sw*dop*1.7;
disk*=(r<rs*1.02&&p.y>0.)?0.:1.;                          // far side hidden behind the hole
col+=disk;
col+=vec3(1.,.72,.42)*exp(-pow((r-rs*1.42)/(rs*.13),2.))*(.55+.75*smoothstep(-.05,.12,p.y)); // lensed far disk
col+=vec3(1.,.88,.66)*exp(-pow((r-rs*1.06)/(rs*.035),2.))*.95;                              // photon ring
col+=vec3(1.,.7,.4)*uPulse*exp(-pow((r-rs*(1.5+(1.-uPulse)*4.))/(rs*.25),2.))*.6;           // click pulse
col*=1.-.35*length(uv*vec2(.7,1.)); col=1.-exp(-col*1.25);
```

HUD values from the same mouse: `distance = 1.35 + |mouse|·1.1` (in R<sub>s</sub>), `factor = 1/√(1−1/distance)`.

## 5. Floating video preview list

```js
const prev=document.createElement('div');prev.className='preview';const pv=document.createElement('video');
pv.muted=true;pv.loop=true;pv.playsInline=true;prev.append(pv);document.body.append(prev);
rows.forEach(b=>{
  b.addEventListener('pointerenter',()=>{pv.src=b.dataset.video;pv.play();prev.classList.add('on');active=true;});
  b.addEventListener('pointerleave',()=>{prev.classList.remove('on');pv.pause();active=false;});
});
(function f(){x+=(mx-x)*.14;y+=(my-y)*.14;rot+=(clamp(vx*.6,-12,12)-rot)*.1;vx*=.85;
  prev.style.transform=`translate(${x}px,${y}px) translate(-50%,-50%) rotate(${rot}deg) scale(${active?1:.6})`;requestAnimationFrame(f);})();
```

`.list:hover .item h3{color:rgba(13,14,18,.35)} .list:hover .item button:hover h3{color:var(--ink)}` dims the other rows.

## 6. Explorer

```css
.explorer .window{perspective:1200px}
.stage3d{position:absolute;inset:-4%;transform-style:preserve-3d}
.stage3d img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transform:translateZ(-60px) scale(1.12)}
.glare{position:absolute;inset:0;mix-blend-mode:screen;background:radial-gradient(260px 260px at var(--gx) var(--gy),rgba(255,207,138,.35),transparent 70%)}
```

```js
stage.style.transform=`rotateY(${nx*8}deg) rotateX(${-ny*6}deg) translate3d(${-nx*20}px,${-ny*14}px,0)`;
glare.style.setProperty('--gx',lx+'px');glare.style.setProperty('--gy',ly+'px');
// orbs: push away inside 160px, spring back to home, damping .92, radial-gradient discs
if(d<160){const k=(1-d/160)*2.2;o.vx+=dx/d*k;o.vy+=dy/d*k;}
o.vx+=(o.hx-o.x)*.004;o.vy+=(o.hy-o.y)*.004;o.vx*=.92;o.vy*=.92;
```

## 7. Time-dilation calculator

```js
// slider 0…1000 → distance 1 + 10^(-9 … +1) R_s (log scale reaches the extreme near the horizon)
const x=1+Math.pow(10,-9+slider.value/1000*10);
const factor=1/Math.sqrt(1-1/x);                 // Schwarzschild, static observer
const digits=x-1>=1?2:Math.min(10,Math.ceil(-Math.log10(x-1))+2);   // show enough decimals near 1
```

Format the Earth duration in seconds / minutes / hours / days / years depending on size; two clocks tick in real time,
the Earth one `factor` times faster. Label the card "illustrative".

## 8. Tesseract corridor

```css
.tess .window{perspective:600px}
.tunnel{position:absolute;inset:0;transform-style:preserve-3d}
.tunnel i{position:absolute;inset:4%;border:1.5px solid rgba(255,207,138,.55);border-radius:6px;
  background:repeating-linear-gradient(90deg,rgba(255,207,138,.10) 0 1px,transparent 1px 8.33%),
             repeating-linear-gradient(0deg,rgba(156,199,255,.06) 0 1px,transparent 1px 12.5%)}
```

```js
for(let i=0;i<14;i++){const f=document.createElement('i');f.style.transform=`translateZ(${-i*260}px)`;
  f.style.opacity=String(Math.pow(1-i/14,1.4));tunnel.append(f);}
// each frame: ease rotateX/rotateY toward the mouse, advance translateZ modulo 260 for endless motion
tunnel.style.transform=`translateZ(${z}px) rotateX(${rx}deg) rotateY(${ry}deg)`;
```

## 9. Drift finale

```css
.drift{position:relative;height:220vh}                       /* scroll room */
.drift .window{position:sticky;top:12px;height:calc(100vh - 24px)}
.words{position:absolute;inset:0;display:grid;align-content:center;pointer-events:none}
.astro{position:absolute;left:50%;top:50%;width:min(340px,46vw);filter:drop-shadow(0 40px 60px rgba(0,0,0,.6))}
```

The astronaut is one inline SVG (helmet with gradient visor and a clipped highlight `#visorHi`, torso, chest panel,
backpack, tether, and `g#armL/#armR/#legL/#legR` groups).

```js
const prog=clamp(-sec.getBoundingClientRect().top/(sec.offsetHeight-innerHeight),0,1);
const tx=inside?(mouseX-cx)*.42:Math.sin(t*.3)*40, ty=inside?(mouseY-cy)*.42:Math.cos(t*.25)*24;
vx+=(tx-x)*.012;vy+=(ty-y)*.012;vx*=.93;vy*=.93;x+=vx;y+=vy;            // spring toward the cursor
rot+=((vx*1.6+Math.sin(t*.6)*6)-rot)*.06;                                 // roll with speed
astro.style.transform=`translate(-50%,-50%) translate(${x}px,${y+Math.sin(t*1.1)*10}px) rotate(${rot}deg) scale(${.72+prog*.55})`;
armL.setAttribute('transform',`rotate(${12+Math.sin(t*1.3)*10} 108 165)`);   // limbs drift
visorHi.setAttribute('transform',`translate(${hx*16} ${hy*12}) rotate(-25 146 94)`); // highlight follows the cursor
win.addEventListener('pointerdown',e=>{/* impulse away from the click */vx+=ux*28;vy+=uy*28;});
```

Star dust: points that parallax with the astronaut and turn into short amber streaks while the page scrolls fast.

### Sliding statement lines

```html
<div class="line" data-speed="-.18">Fall past the horizon</div>
<div class="line" data-speed=".22">and let gravity</div>
```

```js
const p=(innerHeight-r.top)/(innerHeight+r.height);           // 0 → 1 while the section passes
line.style.transform=`translateX(${(p-.5)*line.dataset.speed*100}vw)`;
```

## 10. Lazy video and reel dialog

```html
<video muted loop playsinline preload="none" poster="assets/blackhole.jpg" data-src="assets/blackhole.mp4"></video>
<dialog class="reel"><video controls playsinline></video><button>Close</button></dialog>
```

```js
new IntersectionObserver(es=>es.forEach(e=>{const v=e.target;
  if(e.isIntersecting){if(!v.src)v.src=v.dataset.src;v.play().catch(()=>{});}else v.pause();}),{rootMargin:'200px'});
function openReel(src){video.src=src;dialog.showModal();video.play();}
dialog.addEventListener('close',()=>{video.pause();video.removeAttribute('src');video.load();});
```

## 11. Mouse-reactive headlines

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@300..700&display=swap">
<h2 data-type>Mission chapters</h2>
```

```css
[data-type] .w{display:inline-block;white-space:nowrap}
[data-type] .l{display:inline-block;will-change:transform,font-variation-settings}
```

```js
// keep the source HTML; on each language change restore → translate text nodes → split into .w/.l spans
const heads=[...document.querySelectorAll('[data-type]')].map(el=>({el,src:el.innerHTML,letters:[]}));
// every frame, for headings in view and near the cursor:
const k=d<170?Math.pow(1-d/170,2):0; L.k+=(k-L.k)*.2;
L.el.style.fontVariationSettings=`'wght' ${Math.round(400+300*L.k)}`;
L.el.style.transform=`translate(${ux*L.k*9}px,${uy*L.k*9}px)`;            // step away from the cursor
```

## 12. Media pipeline

```bash
# horizontal loop, trimmed
ffmpeg -ss 18 -i blackhole_src.mp4 -t 12 -an -c:v libx264 -preset slow -crf 27 -pix_fmt yuv420p -movflags +faststart -vf "scale=1280:-2,fps=25" blackhole.mp4
# vertical loop
ffmpeg -i nebula_src.mp4 -an -c:v libx264 -preset slow -crf 30 -pix_fmt yuv420p -movflags +faststart -vf "scale=720:-2" nebula.mp4
# poster
ffmpeg -ss 1 -i blackhole.mp4 -frames:v 1 -q:v 4 blackhole.jpg
```
