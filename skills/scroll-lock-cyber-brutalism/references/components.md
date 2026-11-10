# Components

Copy-ready building blocks for scroll-lock cyber brutalism. Every snippet is cut from the working reference in
`../example/index.html` (Kilit Messenger). Replace product facts, links and release data with the client's own.

## 1. Tokens and fonts

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap">
```

```css
:root{
  color-scheme:dark;
  --bg:#0d1117; --surface:#161c26; --raised:#1e2633; --line:#2d3644; --line-2:#3a4556;
  --text:#e8eaed; --muted:#9aa3ae; --dim:#6e7783;
  --amber:#e0a84a; --amber-2:#f0c06a; --on-amber:#1a1305;
  --safe:#3fb68b; --danger:#e5534b;
  --f-head:"Space Grotesk","Manrope",system-ui,sans-serif;
  --f-body:"Inter",system-ui,-apple-system,"Segoe UI",sans-serif;
  --f-mono:"IBM Plex Mono",ui-monospace,Menlo,Consolas,monospace;
  --gl:max(16px,env(safe-area-inset-left,0px)); --gr:max(16px,env(safe-area-inset-right,0px));
}
```

## 2. Technical panel with crosshair corners

```css
/* technical frame: hairline panels with crosshair corners */
.panel{position:relative;border:1px solid var(--line);background:var(--surface)}
.panel::before,.panel::after{content:"";position:absolute;width:11px;height:11px;pointer-events:none;
  background:linear-gradient(var(--amber),var(--amber)) center/100% 1px no-repeat,linear-gradient(var(--amber),var(--amber)) center/1px 100% no-repeat}
.panel::before{top:-6px;left:-6px}
.panel::after{bottom:-6px;right:-6px}
```

## 3. Buttons

```css
/* buttons */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;min-height:48px;padding:12px 22px;border-radius:999px;font:600 15px/1 var(--f-body);text-decoration:none;border:1px solid transparent;transition:background .2s,border-color .2s,color .2s,transform .15s}
.btn svg{width:18px;height:18px;flex:none}
.btn.primary{background:var(--amber);color:var(--on-amber)}
.btn.primary:hover{background:var(--amber-2)}
.btn.ghost{border-color:var(--line-2);color:var(--text)}
.btn.ghost:hover{border-color:var(--amber);color:var(--amber)}
.btn:active{transform:translateY(1px)}
.ico{fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}
```

## 4. Scroll to lock: markup

One sticky stage holds the grid, the canvas, the SVG fallback, the readout, the hero and the final line.

```html
<div id="seq">
  <div class="stick" id="stick">
    <div class="grid-bg" aria-hidden="true"></div>
    <canvas id="lockCanvas" aria-hidden="true"></canvas>
    <svg class="fallback" viewBox="0 0 200 220" aria-hidden="true">
      <defs><linearGradient id="fb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a3240"/><stop offset="1" stop-color="#0f141c"/></linearGradient></defs>
      <path d="M60 100V68a40 40 0 0180 0v32" fill="none" stroke="#3a4556" stroke-width="16" stroke-linecap="round"/>
      <rect x="30" y="96" width="140" height="110" rx="22" fill="url(#fb)" stroke="#e0a84a" stroke-opacity=".5"/>
      <circle cx="100" cy="140" r="12" fill="none" stroke="#e0a84a" stroke-width="4"/><path d="M94 150h12l4 28h-20z" fill="none" stroke="#e0a84a" stroke-width="4" stroke-linejoin="round"/>
    </svg>
    <div class="readout" aria-hidden="true">
      <span>KLT-LOCK / <b id="roP">000</b>%</span>
      <span>pqxdh · kyber1024 · spqr</span>
      <span class="st" id="roS">state: open</span>
    </div>
    <div class="hero">
      <div class="wrap">
        <div class="hero-copy">
          <span class="chip"><i></i><span data-k="chip">Post-quantum · No account · Tor only</span></span>
          <h1 data-k="h1" data-html>Your messages.<br>Your keys.<br><em>Your control.</em></h1>
          <p class="lead" data-k="heroP">Kilit is a messenger and encrypted vault with no account, no phone number and no server of its own. Messages are encrypted on your device and leave it only through Tor.</p>
          <div class="actions">
            <a class="btn primary" href="#download"><svg class="ico" aria-hidden="true"><use href="#i-dl"/></svg><span data-k="ctaDl">Download</span></a>
            <a class="btn ghost" href="https://github.com/smyrna-pergamum/kilit-messenger"><svg class="ico" aria-hidden="true"><use href="#i-gh"/></svg><span data-k="viewGh">View on GitHub</span></a>
          </div>
          <div class="meta"><span>v0.1.5-alpha</span><span>Android 7.0+</span><span>Windows 10+</span><span>GPL-3.0-or-later</span></div>
        </div>
        <div class="phone hero-phone"><img src="assets/01-chats.webp" width="540" height="1170" alt="Kilit's chat list: a group, two contacts and one request, with Tor ready" data-k-alt="altChats"></div>
      </div>
    </div>
    <div class="hint" aria-hidden="true"><span class="mouse"></span><span data-k="hint">scroll to lock</span></div>
    <div class="sealed" aria-live="polite">
      <span class="tag"><b data-k="sealTag">sealed on your device</b></span>
      <p class="big" data-k="seal" data-html>YOUR PRIVACY. <span>YOUR CONTROL.</span></p>
    </div>
  </div>
</div>
```

## 5. Scroll to lock: styles

`--p` (progress) and `--seal` (final line) are written by the script; the hero copy, phone and hint read them.

```css
/* ---------- lock sequence: hero + scroll to lock ---------- */
#seq{position:relative;height:calc(100vh + 140vh);margin-top:-68px}
.stick{position:sticky;top:0;height:100vh;overflow:hidden}
#lockCanvas{position:absolute;inset:0;width:100%;height:100%;display:block}
.fallback{position:absolute;left:50%;top:50%;width:min(300px,50vw);transform:translate(-50%,-50%);display:none}
.no-gl .fallback{display:block}
.grid-bg{position:absolute;inset:0;pointer-events:none;
  background-image:linear-gradient(var(--line) 1px,transparent 1px),linear-gradient(90deg,var(--line) 1px,transparent 1px);
  background-size:80px 80px;opacity:.22;-webkit-mask-image:radial-gradient(70% 60% at 50% 55%,#000 20%,transparent 75%);mask-image:radial-gradient(70% 60% at 50% 55%,#000 20%,transparent 75%)}
.hero{position:absolute;inset:0;padding-top:68px;display:flex;align-items:center;pointer-events:none}
.hero .wrap{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:24px;align-items:center}
.hero-copy{grid-column:1 / span 6;display:grid;gap:26px;pointer-events:auto;opacity:calc(1 - var(--p,0) * 4);transform:translateY(calc(var(--p,0) * -160px))}
.chip{justify-self:start;display:flex;align-items:center;gap:10px;padding:8px 14px;border:1px solid var(--line-2);border-radius:999px;font:500 12px/1 var(--f-mono);color:var(--amber);background:rgba(22,28,38,.7)}
.chip i{width:7px;height:7px;border-radius:50%;background:var(--amber);box-shadow:0 0 10px var(--amber)}
h1{font:600 clamp(42px,5.2vw,80px)/.95 var(--f-head);letter-spacing:-.045em}
h1 em{font-style:italic;color:var(--amber);font-weight:700}
.actions{display:flex;flex-wrap:wrap;gap:12px}
.meta{display:flex;flex-wrap:wrap;gap:6px 18px;font:400 12px/1.4 var(--f-mono);color:var(--dim)}
.meta span::before{content:"/ ";color:var(--line-2)}
.phone{grid-column:10 / span 3;justify-self:end;width:min(250px,100%);aspect-ratio:540/1170;border-radius:34px;padding:9px;background:#05070a;border:1px solid var(--line-2);
  box-shadow:0 40px 80px -30px #000,0 0 0 1px rgba(224,168,74,.08);pointer-events:auto;
  transform:perspective(1200px) rotateY(-14deg) rotateX(4deg) translateY(calc(var(--p,0) * -220px));opacity:calc(1 - var(--p,0) * 3.5)}
.phone img{width:100%;height:100%;border-radius:26px;display:block;object-fit:cover}
.hint{position:absolute;left:50%;bottom:26px;transform:translateX(-50%);display:grid;justify-items:center;gap:8px;font:500 12px var(--f-mono);color:var(--amber);opacity:calc(1 - var(--p,0) * 6)}
.hint .mouse{width:22px;height:34px;border:1.5px solid var(--amber);border-radius:12px;position:relative}
.hint .mouse::after{content:"";position:absolute;left:50%;top:7px;width:2px;height:7px;margin-left:-1px;background:var(--amber);border-radius:2px;animation:wheel 1.6s ease-in-out infinite}
@keyframes wheel{50%{transform:translateY(8px);opacity:.3}}
.sealed{position:absolute;left:0;right:0;bottom:12vh;text-align:center;display:grid;gap:12px;justify-items:center;pointer-events:none;
  opacity:var(--seal,0);transform:translateY(calc((1 - var(--seal,0)) * 24px))}
.sealed .big{font:700 clamp(30px,5vw,68px)/1 var(--f-head);letter-spacing:-.03em}
.sealed .big span{color:var(--amber);display:inline-block}
.readout{position:absolute;right:var(--gr);top:96px;display:grid;gap:4px;text-align:right;font:400 11px/1.5 var(--f-mono);color:var(--dim)}
.readout b{color:var(--amber);font-weight:500}
.readout .st{color:var(--danger)}
.readout .st.ok{color:var(--safe)}
```

## 6. Scroll to lock: the three.js padlock and timeline

Load three.js first: `<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>`.
The lock is built from primitives (extruded rounded body, torus + cylinders for the shackle, shape geometry for the
keyhole), so no model file is needed. Swap in a GLB if the client has one, but keep the same timeline.

```js
/* ---------- scroll to lock ---------- */
const seq=document.getElementById('seq'),stick=document.getElementById('stick'),canvas=document.getElementById('lockCanvas');
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
function seqProgress(){if(reduce)return 1;const r=seq.getBoundingClientRect();const total=seq.offsetHeight-innerHeight;return clamp(-r.top/total)}

let three=null;
function initThree(){
  if(!window.THREE)throw new Error('no three');
  const mobile=innerWidth<768;
  const renderer=new THREE.WebGLRenderer({canvas,antialias:!mobile,alpha:true,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(devicePixelRatio,mobile?1.5:1.75));
  renderer.outputEncoding=THREE.sRGBEncoding;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(34,1,.1,100);camera.position.set(0,.35,9);

  const AMBER=new THREE.Color('#e0a84a');
  // materials: graphite gunmetal body, brushed steel shackle, glowing brass keyhole
  const bodyMat=new THREE.MeshStandardMaterial({color:'#1c222c',metalness:.85,roughness:.32});
  const rimMat=new THREE.MeshStandardMaterial({color:'#b07a1e',metalness:1,roughness:.28,emissive:AMBER,emissiveIntensity:.08});
  const shackleMat=new THREE.MeshStandardMaterial({color:'#5b6575',metalness:1,roughness:.22});
  const keyMat=new THREE.MeshBasicMaterial({color:AMBER,toneMapped:false});

  const lock=new THREE.Group();scene.add(lock);
  // body: rounded rectangle extruded with bevel
  const W=2.4,H=2.0,R=.38;
  const sh=new THREE.Shape();
  sh.moveTo(-W/2+R,-H/2);sh.lineTo(W/2-R,-H/2);sh.quadraticCurveTo(W/2,-H/2,W/2,-H/2+R);sh.lineTo(W/2,H/2-R);sh.quadraticCurveTo(W/2,H/2,W/2-R,H/2);
  sh.lineTo(-W/2+R,H/2);sh.quadraticCurveTo(-W/2,H/2,-W/2,H/2-R);sh.lineTo(-W/2,-H/2+R);sh.quadraticCurveTo(-W/2,-H/2,-W/2+R,-H/2);
  const bodyGeo=new THREE.ExtrudeGeometry(sh,{depth:.9,bevelEnabled:true,bevelThickness:.12,bevelSize:.1,bevelSegments:mobile?3:6,curveSegments:mobile?8:18});
  bodyGeo.translate(0,0,-.45);
  const body=new THREE.Mesh(bodyGeo,bodyMat);lock.add(body);
  // brass band around the top of the body
  const band=new THREE.Mesh(new THREE.BoxGeometry(W+.16,.07,1.16),rimMat);band.position.y=H/2-.32;lock.add(band);
  // keyhole: circle + tapered slot, glowing
  const kh=new THREE.Shape();kh.absarc(0,.12,.2,0,Math.PI*2,false);
  const slot=new THREE.Shape();slot.moveTo(-.08,.02);slot.lineTo(.08,.02);slot.lineTo(.14,-.5);slot.lineTo(-.14,-.5);slot.lineTo(-.08,.02);
  const keyGroup=new THREE.Group();
  [kh,slot].forEach(s=>{const m=new THREE.Mesh(new THREE.ShapeGeometry(s,24),keyMat);m.position.z=.58;keyGroup.add(m)});
  keyGroup.position.y=-.1;lock.add(keyGroup);
  // shackle: two legs + half torus; pivots around the long (right) leg
  const legR=.15,span=1.5,legH=1.0;
  const shackle=new THREE.Group();
  const top=new THREE.Mesh(new THREE.TorusGeometry(span/2,legR,mobile?12:20,mobile?24:48,Math.PI),shackleMat);top.position.y=legH;shackle.add(top);
  const legL=new THREE.Mesh(new THREE.CylinderGeometry(legR,legR,legH,mobile?12:24),shackleMat);legL.position.set(-span/2,legH/2,0);shackle.add(legL);
  const legRm=new THREE.Mesh(new THREE.CylinderGeometry(legR,legR,legH+.5,mobile?12:24),shackleMat);legRm.position.set(span/2,legH/2-.25,0);shackle.add(legRm);
  const pivot=new THREE.Group();pivot.position.set(span/2,H/2-.35,0);shackle.position.x=-span/2;pivot.add(shackle);lock.add(pivot);

  // floor: concentric glow rings + the pulse ring
  const floor=new THREE.Group();floor.position.y=-2.05;floor.rotation.x=-Math.PI/2;scene.add(floor);
  const ringMats=[];
  [[1.1,1.16,.55],[1.6,1.63,.35],[2.3,2.32,.22],[3.2,3.215,.14]].forEach(([a,b,o])=>{
    const m=new THREE.MeshBasicMaterial({color:AMBER,transparent:true,opacity:o,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide,toneMapped:false});
    ringMats.push([m,o]);floor.add(new THREE.Mesh(new THREE.RingGeometry(a,b,96),m))});
  const disc=new THREE.Mesh(new THREE.CircleGeometry(1.05,64),new THREE.MeshBasicMaterial({color:AMBER,transparent:true,opacity:.08,blending:THREE.AdditiveBlending,depthWrite:false,toneMapped:false}));floor.add(disc);
  const pulseMat=new THREE.MeshBasicMaterial({color:AMBER,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide,toneMapped:false});
  const pulse=new THREE.Mesh(new THREE.RingGeometry(.96,1,128),pulseMat);floor.add(pulse);
  // light shaft above the lock
  const shaft=new THREE.Mesh(new THREE.PlaneGeometry(1.3,9),new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,
    uniforms:{c:{value:AMBER},a:{value:.35}},
    vertexShader:'varying vec2 v;void main(){v=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader:'uniform vec3 c;uniform float a;varying vec2 v;void main(){float x=1.-abs(v.x-.5)*2.;float y=smoothstep(0.,.7,v.y)*(1.-smoothstep(.75,1.,v.y));gl_FragColor=vec4(c,pow(x,3.)*y*a);}'}));
  shaft.position.set(0,3.2,-1.2);scene.add(shaft);
  // dust
  const N=mobile?60:140,pos=new Float32Array(N*3);for(let i=0;i<N;i++){pos[i*3]=(Math.random()-.5)*9;pos[i*3+1]=(Math.random()-.4)*6;pos[i*3+2]=(Math.random()-.5)*4}
  const dg=new THREE.BufferGeometry();dg.setAttribute('position',new THREE.BufferAttribute(pos,3));
  const dust=new THREE.Points(dg,new THREE.PointsMaterial({color:AMBER,size:.035,transparent:true,opacity:.7,depthWrite:false,blending:THREE.AdditiveBlending}));scene.add(dust);

  // lights
  scene.add(new THREE.AmbientLight('#8090a8',.25));
  const key=new THREE.DirectionalLight('#dfe6f2',1.3);key.position.set(-4,5,6);scene.add(key);
  const rimL=new THREE.PointLight(AMBER,2,14,2);rimL.position.set(3.5,1.5,-2.5);scene.add(rimL);
  const rimR=new THREE.PointLight(AMBER,1.2,14,2);rimR.position.set(-3.5,.5,-2);scene.add(rimR);
  const under=new THREE.PointLight(AMBER,.8,7,2);under.position.set(0,-1.6,1.4);scene.add(under);

  function resize(){const w=stick.clientWidth,h=stick.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}
  resize();addEventListener('resize',resize);

  let t0=performance.now(),visible=true,raf=0,lastSeal=false,recoilAt=-1;
  new IntersectionObserver(es=>{visible=es[0].isIntersecting;if(visible&&!raf)raf=requestAnimationFrame(frame)}).observe(stick);
  function frame(now){
    raf=0;if(!visible)return;
    const t=(now-t0)/1000,p=seqProgress(),w=innerWidth;
    // phases: approach 0→.55, close .55→.68, confirm .68→1
    // reduced motion: the lock stays in its start place, already closed, no pulse
    const a=reduce?0:ease(clamp(p/.55)),c=reduce?1:ease(clamp((p-.55)/.13)),f=reduce?1:clamp((p-.68)/.32);
    const desk=w>=768;
    const startX=desk?(w>=1200?.6:1.4):0,startY=desk?.55:-1.75,startS=desk?.62:.4;
    lock.position.x=startX*(1-a);
    lock.position.y=startY*(1-a)+(desk?.32:.25)*a+(reduce?0:Math.sin(t*1.2)*.06*(1-c));
    lock.position.z=-1.2*(1-a);
    const endS=desk?.8:.66;const s=startS+(endS-startS)*a;lock.scale.setScalar(s);
    lock.rotation.y=(reduce?0:Math.sin(t*.5)*.18*(1-a))+(-.55*(1-a));
    lock.rotation.x=.08*(1-a);
    // shackle: open = lifted and swung around the long leg
    pivot.position.y=(H/2-.35)+.55*(1-c);
    pivot.rotation.y=-1.0*(1-c);
    // recoil the moment it closes
    if(c>=1&&recoilAt<0)recoilAt=t;if(c<1)recoilAt=-1;
    const rk=recoilAt<0?0:Math.exp(-(t-recoilAt)*9)*Math.sin((t-recoilAt)*38)*.05;
    lock.position.y-=rk;
    // light: keyhole + rings brighten, pulse ring expands once closed
    keyMat.color.copy(AMBER).multiplyScalar(.35+.85*Math.max(a*.5,c));
    rimMat.emissiveIntensity=.06+.5*c;
    ringMats.forEach(([m,o])=>m.opacity=o*(.45+.55*a));
    disc.material.opacity=.05+.14*c;
    pulse.scale.setScalar(1+f*3.6);pulseMat.opacity=c>=1?(1-f)*.85:0;
    shaft.material.uniforms.a.value=.18+.4*a;
    under.intensity=.6+2.2*c;rimL.intensity=1.4+1.6*a;
    dust.rotation.y=t*.02;
    renderer.render(scene,camera);
    // dom
    stick.style.setProperty('--p',reduce?0:p.toFixed(4));
    const seal=reduce?0:clamp((p-.66)/.12);stick.style.setProperty('--seal',seal.toFixed(3));
    document.getElementById('roP').textContent=String(Math.round(p*100)).padStart(3,'0');
    const isLocked=c>=1;if(isLocked!==lastSeal){lastSeal=isLocked;locked=isLocked;const st=document.getElementById('roS');st.textContent=isLocked?I18N[lang].stLocked:I18N[lang].stOpen;st.classList.toggle('ok',isLocked)}
    if(!reduce)raf=requestAnimationFrame(frame);
  }
  raf=requestAnimationFrame(frame);
  return {frame};
}
try{three=initThree()}catch(e){document.body.classList.add('no-gl');three=null}

function onScroll(){
  flowProgress();
  if(!three){const p=reduce?0:seqProgress();stick.style.setProperty('--p',p);stick.style.setProperty('--seal',reduce?0:clamp((p-.66)/.12))}
  else if(reduce)three.frame(performance.now());
}
addEventListener('scroll',onScroll,{passive:true});
```

## 7. Value strip

```css
/* values */
.values{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:0;border:1px solid var(--line)}
.value{padding:30px 26px 34px;display:grid;gap:14px;align-content:start;border-right:1px solid var(--line);background:var(--surface);min-width:0}
.value:last-child{border-right:0}
.value svg{width:30px;height:30px;color:var(--amber)}
.value h3{font:600 20px/1.2 var(--f-head);letter-spacing:-.015em}
.value p{color:var(--muted);font-size:15px}
.value .src{font:400 11px var(--f-mono);color:var(--dim);margin-top:4px}
```

## 8. Encrypt-and-deliver flow

```html
    <div class="flow" id="flow">
      <div class="step"><div class="node"><svg class="ico" aria-hidden="true"><use href="#i-phone"/></svg></div><span class="k">01 / <span data-k="s1k">add</span></span><h3 data-k="s1h">Share your code</h3><p data-k="s1p">Scan their QR code or open their kilit:// link. The first message sets up keys with PQXDH and Kyber1024.</p></div>
      <div class="step"><div class="node"><svg class="ico" aria-hidden="true"><use href="#i-lock"/></svg></div><span class="k">02 / <span data-k="s2k">seal</span></span><h3 data-k="s2h">Encrypt on device</h3><p data-k="s2p">Signal's post-quantum ratchet encrypts the message, then NIP-44/59 wraps it again for the relay.</p></div>
      <div class="step"><div class="node"><svg class="ico" aria-hidden="true"><use href="#i-onion"/></svg></div><span class="k">03 / <span data-k="s3k">carry</span></span><h3 data-k="s3h">Over Tor to a relay</h3><p data-k="s3p">The embedded Tor delivers it to public Nostr relays, under a mailbox tag that changes every day.</p></div>
      <div class="step"><div class="node"><svg class="ico" aria-hidden="true"><use href="#i-relay"/></svg></div><span class="k">04 / <span data-k="s4k">open</span></span><h3 data-k="s4h">Fetched and opened</h3><p data-k="s4p">Their Kilit picks it up over Tor and decrypts it. Two ticks: their phone opened it.</p></div>
    </div>
    <pre class="packet panel" aria-label="What a relay stores"><span data-k="pk1">what the relay sees</span>
<b>mailbox</b>  9f3c…e21a   <span class="c" data-k="pk2">changes every 24 h</span>
<b>time</b>     2026-11-09T21:04Z
<b>size</b>     class M
<b>content</b>  ciphertext (Signal SPQR → NIP-44/59)
<b>ip</b>       <span data-k="pk3">a Tor exit, never yours</span></pre>
```

```css
/* how it works */
.flow{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:24px;position:relative}
.flow::before{content:"";position:absolute;left:12%;right:12%;top:46px;height:1px;background:repeating-linear-gradient(90deg,var(--amber) 0 8px,transparent 8px 16px);opacity:.6}
.step{display:grid;gap:16px;align-content:start;min-width:0}
.node{width:92px;height:92px;display:grid;place-items:center;background:var(--bg);border:1px solid var(--line-2);border-radius:50%;position:relative;z-index:1}
.node svg{width:34px;height:34px;color:var(--amber)}
.step.on .node{border-color:var(--amber);box-shadow:0 0 0 6px rgba(224,168,74,.08),0 0 30px rgba(224,168,74,.25)}
.step .k{font:500 12px var(--f-mono);color:var(--amber)}
.step h3{font:600 21px/1.2 var(--f-head)}
.step p{color:var(--muted);font-size:15px}
.packet{margin-top:44px;padding:18px 20px;font:400 13px/1.7 var(--f-mono);color:var(--muted);overflow-x:auto;white-space:pre}
.packet b{color:var(--amber);font-weight:500}
```

## 9. Security: warning, protects / does not protect, spec table, badges

```html
    <div class="sec">
      <div class="warn" role="note"><svg class="ico" aria-hidden="true"><use href="#i-alert"/></svg><p data-k="warn" data-html><b>Alpha. Not audited.</b> Kilit has had no independent security review. Do not rely on it where your life or freedom depends on it.</p></div>
      <div class="col yes panel">
        <h3><i></i><span data-k="yesH">Protects against</span></h3>
        <dl>
          <div><dt data-k="y1t">Network observers</dt><dd data-k="y1d">Traffic goes through Tor. Your internet provider does not see who you talk to.</dd></div>
          <div><dt data-k="y2t">The relays</dt><dd data-k="y2d">Messages are encrypted twice, with Signal (PQXDH and Triple Ratchet) and NIP-44/59. Relays cannot read them.</dd></div>
          <div><dt data-k="y3t">Future quantum computers</dt><dd data-k="y3d">Key exchanges are hybrid: X25519 and ML-KEM.</dd></div>
          <div><dt data-k="y4t">Malicious files</dt><dd data-k="y4d">Files are opened in a single-use compartment that is destroyed after each job.</dd></div>
          <div><dt data-k="y5t">Copied vault files</dt><dd data-k="y5d">The PIN is MAC'd with the device's hardware key (StrongBox or TEE, TPM 2.0 on Windows), then Argon2id. A copy cannot be tried on another device.</dd></div>
        </dl>
      </div>
      <div class="col no panel">
        <h3><i></i><span data-k="noH">Does not protect against</span></h3>
        <dl>
          <div><dt data-k="n1t">Metadata on public relays</dt><dd data-k="n1d">Someone who knows a mailbox address can see when and how many messages arrive. Addresses change every 24 hours.</dd></div>
          <div><dt data-k="n2t">PIN guessing on a rooted phone</dt><dd data-k="n2d">Argon2id slows each try (about 0.3 s), but a 6-digit PIN can still be found in days. Use a longer PIN.</dd></div>
          <div><dt data-k="n3t">Losing the hardware key</dt><dd data-k="n3d">If app data is wiped or the device reset, the vault cannot be opened again. Encrypted backup is planned.</dd></div>
          <div><dt data-k="n4t">A compromised device or the other person</dt><dd data-k="n4d">An unlocked phone or kernel malware is out of scope. The person you talk to can still screenshot or forward.</dd></div>
          <div><dt data-k="n5t">Global traffic analysis</dt><dd data-k="n5d">There is no cover traffic, so a watcher of much of the network may try to correlate timing.</dd></div>
        </dl>
      </div>
      <div class="spec panel">
        <table>
          <caption class="tag" style="text-align:left;padding:16px 16px 4px" data-k="specCap">cryptography in use</caption>
          <tr><th data-k="t1">First contact</th><td>PQXDH · Kyber1024</td></tr>
          <tr><th data-k="t2">Ongoing messages</th><td>Signal post-quantum ratchet (SPQR)</td></tr>
          <tr><th data-k="t3">Relay wrapping</th><td>Nostr NIP-44 / NIP-59</td></tr>
          <tr><th data-k="t4">Vault and carrier</th><td>.klt · age + X-Wing (KLT1)</td></tr>
          <tr><th data-k="t5">PIN</th><td>HW key MAC → Argon2id</td></tr>
          <tr><th data-k="t6">Network</th><td>Embedded Tor · obfs4 · Snowflake</td></tr>
        </table>
      </div>
      <div class="badges">
        <div class="badge"><span data-k="b1">independent audit</span><span class="v bad" data-k="b1v">none yet</span></div>
        <div class="badge"><span data-k="b2">analytics / crash reports</span><span class="v ok" data-k="b2v">none</span></div>
        <div class="badge"><span data-k="b3">own server</span><span class="v ok" data-k="b3v">none</span></div>
        <div class="badge"><span data-k="b4">builds</span><span class="v ok" data-k="b4v">pinned Docker images</span></div>
        <div class="badge"><span data-k="b5">windows installer</span><span class="v bad" data-k="b5v">not code-signed yet</span></div>
        <div class="badge"><span data-k="b6">vulnerability reports</span><span class="v ok" data-k="b6v">private, 90 days</span></div>
      </div>
    </div>
```

```css
/* security */
.sec{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:24px}
.warn{grid-column:1 / -1;display:flex;gap:16px;align-items:flex-start;padding:18px 22px;border:1px solid rgba(229,83,75,.5);background:rgba(229,83,75,.08);color:var(--text)}
.warn svg{width:22px;height:22px;color:var(--danger);flex:none;margin-top:2px}
.warn b{color:var(--danger)}
.col{grid-column:span 6;padding:28px;display:grid;gap:18px;align-content:start}
.col h3{display:flex;align-items:center;gap:10px;font:600 22px/1.2 var(--f-head)}
.col h3 i{width:10px;height:10px;border-radius:2px}
.col.yes h3 i{background:var(--safe)}
.col.no h3 i{background:var(--danger)}
.col dl{margin:0;display:grid;gap:16px}
.col dt{font:600 15px/1.3 var(--f-body)}
.col dd{margin:4px 0 0;color:var(--muted);font-size:14.5px}
.spec{grid-column:1 / span 7;overflow-x:auto}
.spec table{width:100%;border-collapse:collapse;font:400 13.5px/1.5 var(--f-mono);min-width:520px}
.spec th,.spec td{text-align:left;padding:13px 16px;border-bottom:1px solid var(--line);vertical-align:top}
.spec th{color:var(--muted);font-weight:400;width:36%}
.spec td{color:var(--text)}
.badges{grid-column:8 / span 5;display:grid;gap:10px;align-content:start}
.badge{display:flex;justify-content:space-between;gap:12px;align-items:center;padding:14px 16px;border:1px solid var(--line);background:var(--surface);font:400 13px var(--f-mono)}
.badge span:first-child{color:var(--muted)}
.badge .v{display:flex;align-items:center;gap:8px;text-align:right}
.badge .v::before{content:"";width:8px;height:8px;border-radius:50%;background:var(--muted);flex:none}
.badge .v.ok::before{background:var(--safe)}
.badge .v.bad::before{background:var(--danger)}
```

## 10. App preview tabs

```js
/* ---------- app preview tabs ---------- */
const tabs=document.getElementById('tabs'),shot=document.getElementById('shot');
function buildTabs(){
  const s=I18N[lang].shots;
  tabs.innerHTML=s.map((x,i)=>'<button role="tab" id="tab'+i+'" aria-selected="'+(i===shotIdx)+'" tabindex="'+(i===shotIdx?0:-1)+'"><span class="n">0'+(i+1)+'</span><span><b>'+x[0]+'</b><span>'+x[1]+'</span></span></button>').join('');
  showShot(shotIdx,false);
}
function showShot(i,focus){
  shotIdx=i;shot.src='assets/'+SHOTS[i]+'.webp';shot.alt=I18N[lang].shots[i][2];
  [...tabs.children].forEach((b,j)=>{b.setAttribute('aria-selected',j===i);b.tabIndex=j===i?0:-1});
  if(focus)tabs.children[i].focus();
}
tabs.addEventListener('click',e=>{const b=e.target.closest('[role=tab]');if(b)showShot([...tabs.children].indexOf(b),false)});
tabs.addEventListener('keydown',e=>{const n=SHOTS.length;
  if(e.key==='ArrowDown'||e.key==='ArrowRight'){showShot((shotIdx+1)%n,true);e.preventDefault()}
  if(e.key==='ArrowUp'||e.key==='ArrowLeft'){showShot((shotIdx+n-1)%n,true);e.preventDefault()}});
SHOTS.forEach(s=>{const im=new Image();im.src='assets/'+s+'.webp'});
```

## 11. Download panels and verify terminal

```html
      <div class="term" id="term">
        <div class="term-head"><span class="dots" aria-hidden="true"><i></i><i></i><i></i></span><span>verify · v0.1.5-alpha</span><button class="copy" id="copyBtn" data-k="copy">copy</button></div>
<pre id="termText"><span class="c"># 1. checksum must match the release notes</span>
<span class="p">$</span> sha256sum Kilit-0.1.5-alpha.apk
<span class="h">025c04b4bfa3eccac985e5bdf2b20ca9d815d0e1b18a3ea2be950e2a11a634ed</span>

<span class="c"># 2. the signing certificate must be Kilit's</span>
<span class="p">$</span> apksigner verify --print-certs Kilit-0.1.5-alpha.apk
<span class="h">SHA-256: DE:B8:42:2C:53:F6:FB:C3:34:7C:5C:0B:84:31:61:17:
         D2:C9:4A:53:CD:70:FA:6A:B4:E9:50:16:DA:9D:B1:E1</span>

<span class="c"># windows (PowerShell)</span>
<span class="p">&gt;</span> Get-FileHash Kilit-0.1.5-alpha-windows-setup.exe
<span class="h">351c10562298d118efae338fea64ea880968c6756baa22c1c51bb6f180aa9b02</span></pre>
      </div>
```

```css
/* download */
.dl{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:24px}
.plat{grid-column:span 4;padding:28px;display:grid;gap:16px;align-content:start}
.plat h3{font:600 24px/1.1 var(--f-head)}
.plat p{color:var(--muted);font-size:15px}
.plat .btn{justify-self:start}
.plat .files{font:400 12.5px/1.8 var(--f-mono);color:var(--dim)}
.term{grid-column:1 / -1;background:#080b10;border:1px solid var(--line);min-width:0}
.term-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 14px;border-bottom:1px solid var(--line);font:400 12px var(--f-mono);color:var(--dim)}
.term-head .dots{display:flex;gap:6px}
.term-head .dots i{width:9px;height:9px;border-radius:50%;background:var(--line-2)}
.copy{background:none;border:1px solid var(--line-2);border-radius:8px;padding:6px 10px;min-height:32px;font:500 12px var(--f-mono);color:var(--muted)}
.copy:hover{color:var(--amber);border-color:var(--amber)}
.term pre{margin:0;padding:18px 18px 22px;overflow-x:auto;font:400 13px/1.75 var(--f-mono);color:var(--text)}
.term pre .c{color:var(--dim)}
.term pre .p{color:var(--amber)}
.term pre .h{color:var(--safe)}
```

```js
/* ---------- copy verify commands ---------- */
document.getElementById('copyBtn').onclick=async e=>{
  const b=e.currentTarget,t=document.getElementById('termText').innerText;
  try{await navigator.clipboard.writeText(t);b.textContent=I18N[lang].copied}
  catch(err){const r=document.createRange();r.selectNodeContents(document.getElementById('termText'));const s=getSelection();s.removeAllRanges();s.addRange(r);b.textContent=I18N[lang].copyFail}
  setTimeout(()=>b.textContent=I18N[lang].copy,2000);
};
```
