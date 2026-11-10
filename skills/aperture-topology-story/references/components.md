# aperture-topology-story · components

Copy-ready pieces from `example/index.html`. Replace the hex values with the product's own tokens; keep the roles.

## 1. Tokens and grounds

```css
:root{
  /* dark ground = the app's dark scheme */
  --void:#110b08; --bg:#1a120e; --bg-2:#140d09;
  --surface:#231a16; --surface-2:#271e1a; --surface-3:#322824;
  --line:rgba(255,219,201,.07); --line-2:rgba(255,219,201,.12); --line-3:rgba(255,219,201,.2);
  --fg:#fcefe8; --fg-2:#d8c2b8; --muted:#a8948a;
  /* brand: icon colour, dark primary, primary container */
  --brand:#e8590c; --brand-2:#ffb68f; --brand-3:#ffdbc9;
  --brand-soft:rgba(255,182,143,.12); --brand-glow:rgba(232,89,12,.4);
  /* signals: one meaning each */
  --teal:#52d5ad; --gold:#d8c86f;
  /* paper workspace = the app's light scheme */
  --paper:#fffbf8; --paper-2:#fff4ee; --paper-line:#eadfd7;
  --ink:#34251e; --ink-2:#53433c; --ink-muted:#79685e;
  --brand-ink:#c2410c; --teal-ink:#0d7a70; --gold-ink:#7a5a12;
  --display:"Rajdhani","Geist",ui-sans-serif,system-ui,sans-serif;
  --font:"Geist",ui-sans-serif,system-ui,sans-serif;
  --mono:"Geist Mono",ui-monospace,Consolas,monospace;
  --ease:cubic-bezier(.22,1,.36,1); --nav-h:64px;
}
body{background:var(--bg-2);color:var(--fg);font:16px/1.6 var(--font);
  background-image:linear-gradient(var(--line) 1px,transparent 1px),linear-gradient(90deg,var(--line) 1px,transparent 1px);
  background-size:36px 36px}
.hero-title{font:700 clamp(2.6rem,6.2vw,5.2rem)/.86 var(--display);color:#fff6f1;
  text-shadow:0 0 2px rgba(255,255,255,.86),0 0 18px rgba(255,182,143,.36),0 0 48px rgba(82,213,173,.14),0 18px 52px rgba(0,0,0,.6)}
.stage-light{background:var(--paper);color:var(--ink);
  background-image:radial-gradient(38% 44% at 50% 55%,rgba(255,219,201,.55),transparent 72%),
    linear-gradient(rgba(52,37,30,.055) 1px,transparent 1px),linear-gradient(90deg,rgba(52,37,30,.055) 1px,transparent 1px);
  background-size:100% 100%,34px 34px,34px 34px}
```

Google Fonts:

```html
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600&family=Rajdhani:wght@600;700&display=swap" rel="stylesheet">
```

## 2. Topology graph (SVG, packets out and back)

```html
<svg id="heroGraph" viewBox="0 0 1200 520" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Sample: one target and the sources it is sent to"></svg>
```

```css
.g-edge{fill:none;stroke:rgba(255,219,201,.22);stroke-width:1.3;stroke-dasharray:5 7}
.g-node{fill:#1d1410;stroke-width:1.6}
.g-node.free{stroke:var(--teal)} .g-node.key{stroke:var(--gold)} .g-node.target{stroke:var(--brand-2);fill:#2a1810}
.g-ico{color:var(--fg-2);fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}
.g-label{font:600 13px var(--mono);fill:var(--fg-2);text-anchor:middle}
.g-sub{font:500 10.5px var(--mono);fill:var(--muted);text-anchor:middle}
.g-ring{fill:none;stroke:var(--brand-2);stroke-opacity:.35}
.g-pkt-out{fill:var(--brand-2)} .g-pkt-in{fill:var(--teal)}
@media (max-width:760px){.g-label{font-size:18px}.g-sub{display:none}}
```

```js
const NODES = [
  {id:'t', x:600,y:250, icon:'i-globe', label:'example.org', sub:'target · sample', kind:'target'},
  {id:'dns', x:265,y:265, icon:'i-dns', label:'google dns', sub:'key-free', kind:'free'},
  // … 5–7 sources; keep x within 220–980 so the mobile viewBox crop keeps them
];
function buildGraph(svg){
  const t = NODES[0], gE = el('g',{},svg), gP = el('g',{},svg), gN = el('g',{},svg), paths = [];
  NODES.slice(1).forEach((n,i)=>{                         // curved edge, alternate bend side
    const mx=(t.x+n.x)/2, my=(t.y+n.y)/2, dx=n.x-t.x, dy=n.y-t.y, len=Math.hypot(dx,dy), b=(i%2?1:-1)*len*.22;
    paths.push(el('path',{d:`M${t.x},${t.y} Q${mx-dy/len*b},${my+dx/len*b} ${n.x},${n.y}`,class:'g-edge'},gE));
  });
  NODES.forEach(n=>{ /* halo circle (radial gradient), node circle, <use href="#icon">, label, sub-label */ });
  return {paths, lens:paths.map(p=>p.getTotalLength()), layer:gP, pk:[], spawn:0, last:0};
}
function tickGraph(G, now){                              // rAF; only while visible and motion allowed
  const dt = Math.min(64, now-(G.last||now)); G.last = now; G.spawn -= dt;
  if (G.spawn<=0 && G.pk.length<9){ const c=el('circle',{r:3.2,class:'g-pkt-out'},G.layer);
    G.pk.push({i:Math.random()*G.paths.length|0, t:0, dir:1, c, v:.00042+Math.random()*.00018}); G.spawn=420+Math.random()*380; }
  for (let k=G.pk.length-1;k>=0;k--){ const p=G.pk[k]; p.t+=p.v*dt;
    if (p.t>=1){ if(p.dir===1){p.dir=-1;p.t=0;p.c.setAttribute('class','g-pkt-in');} else {p.c.remove();G.pk.splice(k,1);continue;} }
    const pt=G.paths[p.i].getPointAtLength((p.dir===1?p.t:1-p.t)*G.lens[p.i]);
    p.c.setAttribute('cx',pt.x); p.c.setAttribute('cy',pt.y); p.c.setAttribute('opacity',Math.min(1,Math.sin(p.t*Math.PI)*2)); }
}
// mobile crop: svg.setAttribute('viewBox', innerWidth<760 ? '150 40 900 480' : '0 0 1200 520')
```

Do **not** give the `<use>` inside the graph a class that sets CSS `width/height` (e.g. `.icon`): CSS geometry beats the
`width`/`height` attributes and every icon becomes the same size.

## 3. Aperture stage

```html
<section class="story" id="how">
  <ol class="sr-only"><li>…step 1…</li><li>…</li></ol>
  <div class="stage" id="stage">
    <div class="stage-dark" aria-hidden="true">
      <svg id="stageGraph" viewBox="0 0 1200 520"></svg>
      <div class="stage-hint">scroll · follow one target</div>
      <div class="stage-close"><div><h2>Every claim,<br>back to its source.</h2><p>passive · source-first · no verdict</p></div></div>
    </div>
    <div class="stage-light" aria-hidden="true">
      <div class="story-head"></div>   <!-- 4 × h3, one .on -->
      <div class="board-wrap"></div>   <!-- the scaled logical board -->
      <div class="rail"></div>         <!-- 01 target · 02 findings · … -->
    </div>
  </div>
</section>
```

```css
.story{position:relative;height:640vh}
.stage{position:sticky;top:0;height:100svh;overflow:hidden}
.stage-light{position:absolute;inset:0;clip-path:circle(0px at 50% 50%)}
.story-head h3{position:absolute;left:0;right:0;opacity:0;filter:blur(8px);transform:translateY(10px);
  transition:opacity .6s var(--ease),filter .6s var(--ease),transform .6s var(--ease)}
.story-head h3.on{opacity:1;filter:none;transform:none}
.board{position:absolute;left:50%;top:50%;transform-origin:0 0}
.b-el{position:absolute;left:0;top:0;transform-origin:0 0;will-change:transform,opacity}
```

```js
const ease = t => t<.5 ? 4*t*t*t : 1-Math.pow(-2*t+2,3)/2;
const seg = (p,a,b) => Math.max(0, Math.min(1, (p-a)/(b-a)));
function kf(frames, p){                     // frames: [[p, {x,y,s,o}], …]
  if (p<=frames[0][0]) return frames[0][1];
  for (let i=1;i<frames.length;i++) if (p<=frames[i][0]){
    const [pa,a]=frames[i-1], [pb,b]=frames[i], t=ease((p-pa)/(pb-pa||1)), o={...a};
    for (const k in b) o[k] = (a[k]??b[k]) + (b[k]-(a[k]??b[k]))*t; return o; }
  return frames.at(-1)[1];
}
const place = (n,s) => { n.style.transform=`translate(${s.x}px,${s.y}px) scale(${s.s??1})`; n.style.opacity=s.o??1; };

function onScroll(){
  const r = story.getBoundingClientRect(), p = clamp(-r.top/(story.offsetHeight-innerHeight),0,1);
  const tp = centreOf(stageGraph.querySelector('[data-node="t"] .g-node'));   // aperture origin = target node
  const maxR = Math.hypot(Math.max(tp.x,W-tp.x), Math.max(tp.y,H-tp.y)) + 4;
  const R = maxR * ease(seg(p,.015,.1)) * (1-ease(seg(p,.915,.975)));
  light.style.clipPath = R>=maxR-1 ? 'none' : `circle(${R}px at ${tp.x}px ${tp.y}px)`;
  closeLine.style.opacity = seg(p,.95,.99);
  renderBoard(board, p);                     // every card: place(el, kf(frames, p))
  setPhase(p<.33?0 : p<.56?1 : p<.79?2 : 3); // toggles .on on heading + rail
}
addEventListener('scroll', () => requestAnimationFrame(onScroll), {passive:true});

// fit the logical board into the free area
const s = Math.min(wrap.clientWidth/L.W, wrap.clientHeight/L.H, 1.15);
board.style.transform = `translate(${-L.W*s/2}px,${-L.H*s/2}px) scale(${s})`;
```

Chips that have landed in a moving card follow its transform instead of their own keyframes:

```js
if (p < land) place(chip, kf([[st, from],[st+.015,{...from,s:.7,o:1}],[land, slot]], p));
else place(chip, {x: nb.x + slot.x*nb.s, y: nb.y + (slot.y + i*slot.dy)*nb.s, s: nb.s, o: nb.o});
```

Connectors (wide layout only) are cubic paths drawn with a growing dash:

```js
path.setAttribute('d', `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`);
const d = seg(p, .66+i*.03, .7+i*.03); path.style.strokeDasharray = d<1 ? `${400*d} 400` : '4 5';
```

Two layouts: `wide {W:1120,H:560}` and `narrow {W:360,H:640}`; rebuild the board when the breakpoint flips. Reduced
motion: build four boards, `renderBoard(E, .30 / .55 / .78 / 1)`, scale each to the column and stack them as frames.

## 4. Paper cards

```css
.pc{background:#fff;border:1px solid var(--paper-line);border-radius:14px;
  box-shadow:0 1px 0 rgba(255,255,255,.9) inset,0 14px 34px -14px rgba(58,33,15,.22)}
.chip{display:inline-flex;align-items:center;gap:5px;height:20px;padding:0 7px;border-radius:999px;font:600 10px var(--mono);border:1px solid var(--paper-line)}
.chip.free{color:var(--teal-ink);background:#e7f5f0;border-color:#bfe3d7}
.chip.key{color:var(--gold-ink);background:#fbf3d9;border-color:#ecd99a}
.chip.brand{color:var(--brand-ink);background:#fff1e7;border-color:#f3c3a3}
.fchip{display:grid;grid-template-columns:6px 40px 1fr auto;align-items:center;gap:8px;padding:0 10px;border-radius:9px;
  background:#fff;border:1px solid #e9dcd2;font:500 11.5px var(--mono)}
.fchip i{width:6px;height:18px;border-radius:999px;background:linear-gradient(var(--c),rgba(232,89,12,.25))}
.obs{padding:12px 14px;border-left:4px solid var(--c);border-radius:12px}
.obs.info{--c:var(--teal-ink);background:#f3fbf8} .obs.att{--c:var(--brand);background:#fff6ee} .obs.miss{--c:#c9a227;background:#fffaee}
```

```html
<div class="b-el fchip"><i style="--c:#e8590c"></i><b>F-01</b>
  <span class="v">DMARC p=none<small>google dns · sha-256 3f9a…</small></span><span class="status">not reviewed</span></div>
<div class="b-el pc obs att"><div class="h"><svg class="icon"><use href="#i-alert"/></svg>Attention</div>
  <p>DMARC policy is p=none: spoofed mail is not rejected.</p><div class="based">based on F-01</div></div>
```

## 5. Architecture diagram (HTML nodes over SVG)

```html
<div class="diagram">
  <svg viewBox="0 0 100 100" preserveAspectRatio="none">
    <path class="ln o" vector-effect="non-scaling-stroke" d="M30,50 C55,50 55,18 80,18"/>
  </svg>
  <div class="dnode hub" style="left:30%;top:50%;--c:var(--brand-2)"><small>your phone</small><b>OSINT-Book</b><span>data stays here</span></div>
</div>
```

```css
.diagram{position:relative;aspect-ratio:640/380;border:1px solid var(--line);border-radius:12px;
  background-image:linear-gradient(var(--line) 1px,transparent 1px),linear-gradient(90deg,var(--line) 1px,transparent 1px);background-size:24px 24px}
.diagram svg{position:absolute;inset:0;width:100%;height:100%}
.ln{fill:none;stroke-width:1.5;stroke-dasharray:5 6;animation:dash 1.4s linear infinite}
@keyframes dash{to{stroke-dashoffset:-22}}
.dnode{position:absolute;transform:translate(-50%,-50%);padding:8px 11px;border-radius:9px;border:1px solid var(--line-2);background:#1c130f}
.dnode.hub{border-color:var(--brand);box-shadow:0 0 0 4px rgba(232,89,12,.12),0 0 28px var(--brand-glow)}
```

`preserveAspectRatio="none"` + `vector-effect="non-scaling-stroke"` lets the path use the same 0–100 % coordinates as
the HTML nodes without distorting the stroke.

## 6. Puzzle-tab blocks

```css
.blk{position:relative;border:1px solid var(--bc);border-radius:12px;padding:16px;background:var(--bb)}
.blk::before,.blk::after{content:"";position:absolute;top:-9px;width:30px;height:9px;border:1px solid var(--bc);
  border-bottom:0;border-radius:6px 6px 0 0;background:var(--bg-2)}
.blk::before{left:22%} .blk::after{right:22%}
.blk.local{--bc:rgba(82,213,173,.55);--bb:rgba(82,213,173,.05)}
.blk.cloud{--bc:rgba(216,200,111,.55);--bb:rgba(216,200,111,.05)}
.blk.queue{--bc:rgba(255,182,143,.6);--bb:linear-gradient(180deg,rgba(232,89,12,.12),rgba(232,89,12,.03))}
```

## 7. Catalog table

Data as rows `[id, name, typeLetters, auth, quota{en,tr}, note{en,tr}]`; filter by search text (id, name, quota, note,
translated type names), `auth` select and type select; 8 rows a page; pager buttons with `aria-current="page"`;
footer text `Showing 1–8 of 20 sources · API_REGISTRY.md, checked 2026-10-27`. Access dots: teal = not needed,
pale teal = optional, gold = your key.

## 8. Terminal

```css
.term{border:1px solid var(--line-2);border-radius:14px;background:#0d0806;overflow:hidden}
.term-bar{display:flex;align-items:center;gap:12px;height:48px;padding:0 12px 0 16px;border-bottom:1px solid var(--line)}
.term pre{margin:0;padding:24px 28px;font:500 13.5px/1.85 var(--mono);overflow-x:auto;white-space:pre}
.term .c{color:#8a766c} .term .p{color:var(--teal)} .term .f{color:var(--brand-2)} .term .h{color:var(--gold)}
.term-foot .live::before{content:"";display:inline-block;width:7px;height:7px;border-radius:50%;background:var(--teal);box-shadow:0 0 10px var(--teal)}
```

Lines are data (`['c', comment] ['cmd', prompt, command, comment?] ['o', output] ['url', label, url, comment?]`);
`COPY` joins only the `cmd` entries. Tabs use roving tabindex and ←/→.

## 9. i18n helper

```js
const EN = {};                                   // English = the HTML itself
function applyStatic(){
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const k = el.dataset.i18n; if (!(k in EN)) EN[k] = el.innerHTML;
    el.innerHTML = lang==='tr' && TR[k] ? TR[k] : EN[k];
  });
}
const T = o => typeof o==='string' ? o : (o[lang] || o.en);   // for strings built in JS
```
