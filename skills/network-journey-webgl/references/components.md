# Components

Copy-ready building blocks for network-journey-webgl. Every snippet is cut from the LANORA source in `../source/`.

## 1. Tokens

```css
:root {
  color-scheme: dark;
  --void: #050a08;
  --bg: #080b09;
  --fog: #0e1b15;
  --surface: #111713;
  --forest: #173c33;
  --green: #245b48;
  --primary: #2d7659;
  --lime: #c6eea3;
  --signal: #a3ff12;
  --text: #e6eee8;
  --secondary: #d5e2d2;
  --muted: #8a948c;
  --border: #27312a;
  --warning: #dc8b40;
  --critical: #ff4d4d;
  --paper: #f5f7f6;
  --f-display: 'Space Grotesk', 'Arial Narrow', system-ui, sans-serif;
  --f-body: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;
  --f-mono: 'IBM Plex Mono', ui-monospace, Menlo, Consolas, monospace;
  --gl: max(16px, env(safe-area-inset-left, 0px));
  --gr: max(16px, env(safe-area-inset-right, 0px));
}
```

## 2. Camera path: one scroll value, reversible

```ts
import * as THREE from 'three';
import { V, ease } from './shared';

/** [start position, start target, end position, end target] for each chapter (spec §6). */
const K: [THREE.Vector3, THREE.Vector3, THREE.Vector3, THREE.Vector3][] = [
  [V(0, 0.6, 11), V(0, 0, 0), V(0, 0.3, 5.2), V(0, 0, 0)],
  [V(0.2, 0.6, 4.6), V(0, 0, 0), V(1, 0.75, 4), V(0, 0, 0)],
  [V(-7.5, 0.4, -9.4), V(-7.5, 0, -16), V(7.5, 0.4, -9.4), V(7.5, 0, -16)],
  [V(-6, 1.6, -24.5), V(0, 0, -32), V(6, 1.6, -24.5), V(0, 0, -32)],
  [V(-1, 0.8, -26.5), V(0, 0, -32), V(0, 0.4, -28.6), V(0, 0, -32)],
  [V(0, 0, -49.8), V(0, 0, -58), V(0, -0.1, -50.8), V(0, 0, -58)],
  [V(0, 16, 52), V(0, 0, -24), V(0, 24, 64), V(0, 0, -24)],
  [V(0, 5, 97), V(0, -2, 75), V(0, 1, 85), V(0, -2.6, 75)]
];

const TRANSIT = 0.22;

/**
 * Camera position and target for chapter i at progress l. The first 22% of each chapter flies from the
 * previous chapter's end to this one's start; the return value is that transit's intensity (0–1), used
 * for the glitch overlay. Scrolling back runs the same path in reverse.
 */
export function cameraAt(i: number, l: number, pos: THREE.Vector3, target: THREE.Vector3): number {
  const k = K[i];
  if (i > 0 && l < TRANSIT) {
    const t = ease(l / TRANSIT);
    const p = K[i - 1];
    pos.lerpVectors(p[2], k[0], t);
    target.lerpVectors(p[3], k[1], t);
    return Math.sin((Math.PI * l) / TRANSIT);
  }
  const t = ease(i > 0 ? (l - TRANSIT) / (1 - TRANSIT) : l);
  pos.lerpVectors(k[0], k[2], t);
  target.lerpVectors(k[1], k[3], t);
  return 0;
}
```

## 3. Chapter progress: GSAP ScrollTrigger + Lenis

```ts
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { chapter } from './state';

type Options = { smooth: boolean; onChange: (i: number) => void };

export function initScroll(sections: HTMLElement[], opts: Options) {
  gsap.registerPlugin(ScrollTrigger);
  let lenis: Lenis | null = null;
  const raf = (t: number) => lenis?.raf(t * 1000);
  if (opts.smooth) {
    lenis = new Lenis({ lerp: 0.1, anchors: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
  }
  // A chapter is "current" while its top has passed 35% of the viewport and its bottom has not.
  const triggers = sections.map((el, k) =>
    ScrollTrigger.create({
      trigger: el,
      start: 'top 35%',
      end: 'bottom 35%',
      onUpdate: (s) => {
        if (chapter.i === k) chapter.l = s.progress;
      },
      onToggle: (s) => {
        if (s.isActive && chapter.i !== k) {
          chapter.i = k;
          chapter.l = s.progress;
          opts.onChange(k);
        }
      }
    })
  );
  const page = ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (s) => (chapter.prog = s.progress) });
  ScrollTrigger.refresh();
  return {
    destroy() {
      triggers.forEach((t) => t.kill());
      page.kill();
      if (lenis) {
        gsap.ticker.remove(raf);
        lenis.destroy();
      }
    }
  };
}
```

## 4. Quality tiers

```ts
export type Tier = 'full' | 'lite' | 'mobile' | 'static';

export const TIER_SETTINGS = {
  full: { sphereNodes: 280, particles: 2600, dust: 1100, dpr: 1.75, antialias: true, probes: 70 },
  lite: { sphereNodes: 200, particles: 1800, dust: 700, dpr: 1.5, antialias: true, probes: 50 },
  mobile: { sphereNodes: 140, particles: 1200, dust: 450, dpr: 1.5, antialias: false, probes: 40 }
} as const;
export type Settings = (typeof TIER_SETTINGS)[keyof typeof TIER_SETTINGS];

/** Picks the quality tier once at start-up (spec §10). */
export function detectTier(): Tier {
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return 'static';
  if (nav.connection?.saveData) return 'static';
  try {
    const c = document.createElement('canvas');
    if (!c.getContext('webgl2')) return 'static';
  } catch {
    return 'static';
  }
  const w = innerWidth;
  if (w < 768) return 'mobile';
  if (w < 1200 || (nav.deviceMemory ?? 8) < 8 || (navigator.hardwareConcurrency ?? 8) <= 4) return 'lite';
  return 'full';
}
```

## 5. Lazy start-up: nothing 3D before first paint

```ts
  onMount(() => {
    tier = detectTier();
    reduced = tier === 'static' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.documentElement.classList.add('js', `tier-${tier}`);
    const sections = SECTION_IDS.map((id) => document.getElementById(id)!) as HTMLElement[];
    // GSAP, ScrollTrigger and Lenis load right after first paint, in their own chunk (spec §9.1)
    let scroll: { destroy: () => void } | null = null;
    let disposed = false;
    import('$lib/motion/scroll').then(({ initScroll }) => {
      if (!disposed) scroll = initScroll(sections, { smooth: tier !== 'static', onChange: onChapter });
    });

    // light per-frame HUD work that does not need the 3D scene
    let raf = 0;
    const hudLoop = () => {
      document.documentElement.style.setProperty('--prog', chapter.prog.toFixed(4));
      document.documentElement.classList.toggle('end', chapter.i === 7 && chapter.l > 0.45);
      if (tier === 'static') {
        probed = chapter.i >= 1 ? NETWORK.probed : 0;
        found = chapter.i >= 1 ? DEVICES.length : 0;
      }
      raf = requestAnimationFrame(hudLoop);
    };
    raf = requestAnimationFrame(hudLoop);

    // the scene loads after first paint (spec §9.1)
    const idle = (cb: () => void) => ('requestIdleCallback' in window ? requestIdleCallback(cb, { timeout: 1200 }) : setTimeout(cb, 200));
    idle(() => void startStage());

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      scroll?.destroy();
      stage?.destroy();
    };
  });
```

## 6. Building the scene without long tasks

```ts
  // built one object per task so no single long task blocks input (spec §9.1)
  const objects: SceneObject[] = [];
  const builders: (() => SceneObject)[] = [
    () => dust(scene, s.dust),
    () => networkSphere(scene, s.sphereNodes, addTag, o.openDevice, !mobile),
    () => topology(scene, s.probes, addTag, o.openDevice, o.onCount),
    () => crystals(scene, addTag, o.openDevice),
    () => portRings(scene, addTag),
    () => dome(scene, addTag)
  ];
  for (const b of builders) {
    objects.push(b());
    await yieldTask();
  }
  const cloud = particles(scene, s.particles, mobile);
  objects.push(cloud);
  await yieldTask();
```

```ts
  // compile shaders without blocking (parallel compile where the GPU driver supports it)
  cameraAt(0, 0, camPos, camTarget);
  camera.position.copy(camPos);
  camera.lookAt(camTarget);
  try {
    await renderer.compileAsync(scene, camera);
  } catch {
    /* falls back to compiling on the first frame */
  }
  raf = requestAnimationFrame(frame);
```

## 7. HTML tags pinned to 3D points (culled over text and HUD)

```ts
  // HTML labels pinned to 3D points; buttons when they open device details
  const tags: Tag[] = [];
  const addTag = (t: TagSpec) => {
    const el = document.createElement(t.onClick ? 'button' : 'div');
    el.className = 'tag' + (t.warn ? ' warn' : '');
    el.innerHTML = t.html;
    el.tabIndex = -1;
    if (t.onClick) {
      el.addEventListener('click', t.onClick);
      el.insertAdjacentHTML('beforeend', '<span class="sr-only">, open details</span>');
    } else el.setAttribute('aria-hidden', 'true');
    o.tagLayer.appendChild(el);
    const line = document.createElementNS(SVG, 'line');
    const dot = document.createElementNS(SVG, 'circle');
    dot.setAttribute('r', '2.5');
    o.leaders.append(line, dot);
    tags.push({ ...t, el, line, dot, shown: false });
  };
```

```ts
  function placeTags(i: number, l: number) {
    const W = innerWidth, H = innerHeight;
    // keep labels off the header, the bottom HUD and (on wide screens) the text column
    const minX = W > 900 && i !== 7 ? W * (i === 4 ? 0.5 : 0.42) : 0;
    for (const tg of tags) {
      const active = tg.chapters.includes(i) && !(i === 0 && l > 0.45);
      let visible = false;
      if (active) {
        v3.copy(tg.pos()).project(camera);
        const ax = (v3.x * 0.5 + 0.5) * W, ay = (-v3.y * 0.5 + 0.5) * H;
        visible = v3.z <= 1 && ax >= minX && ax <= W - 24 && ay >= 130 && ay <= H - 70;
      }
      if (visible) {
        const sx = (v3.x * 0.5 + 0.5) * W, sy = (-v3.y * 0.5 + 0.5) * H;
        const left = sx > W - 260, dx = left ? -36 : 36, dy = -34;
        tg.el.style.transform = `translate(${sx + dx}px,${sy + dy}px) translate(${left ? '-100%' : '0'},-100%)`;
        tg.line.setAttribute('x1', String(sx));
        tg.line.setAttribute('y1', String(sy));
        tg.line.setAttribute('x2', String(sx + dx));
        tg.line.setAttribute('y2', String(sy + dy));
        tg.dot.setAttribute('cx', String(sx));
        tg.dot.setAttribute('cy', String(sy));
      }
      if (visible !== tg.shown) {
        tg.shown = visible;
        tg.el.classList.toggle('on', visible);
        tg.el.tabIndex = visible && tg.onClick ? 0 : -1;
        tg.line.setAttribute('opacity', visible ? '1' : '0');
        tg.dot.setAttribute('opacity', visible ? '1' : '0');
      }
    }
  }
```

## 8. Particle morph from canvas line drawings

```ts
  function shape(draw: Draw, center: THREE.Vector3, size: number) {
    ctx.clearRect(0, 0, 256, 256);
    ctx.save();
    ctx.strokeStyle = ctx.fillStyle = '#fff';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    draw(ctx);
    ctx.restore();
    const d = ctx.getImageData(0, 0, 256, 256).data;
    const hits: number[] = [];
    for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) if (d[(y * 256 + x) * 4 + 3] > 120) hits.push(x, y);
    const out = new Float32Array(n * 3);
    for (let k = 0; k < n; k++) {
      const h = ((Math.random() * hits.length) / 2) | 0;
      out[k * 3] = center.x + ((hits[h * 2] - 128) / 256) * size + (Math.random() - 0.5) * 0.03;
      out[k * 3 + 1] = center.y - ((hits[h * 2 + 1] - 128) / 256) * size + (Math.random() - 0.5) * 0.03;
      out[k * 3 + 2] = center.z + (Math.random() - 0.5) * 0.25;
    }
    return out;
  }
```

```ts
  pos.set(scatter);
  // shapes are sampled on first use, so start-up stays short on phones
  const cache = new Map<string, Float32Array>();
  const get = (key: string, make: () => Float32Array) => {
    let v = cache.get(key);
    if (!v) cache.set(key, (v = make()));
    return v;
  };
```

## 9. Strict CSP for a static SvelteKit site

```js
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** GitHub Pages serves a project site under /<repo>; the deploy workflow sets BASE_PATH. */
const base = process.env.BASE_PATH ?? '';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({ pages: 'build', assets: 'build', fallback: undefined, strict: true }),
    paths: { base, relative: false },
    // no leading underscore, so Jekyll-based GitHub Pages hosts publish it too
    appDir: 'app',
    prerender: { handleHttpError: 'fail', handleMissingId: 'fail' },
    // Strict CSP as a <meta> tag (GitHub Pages cannot send headers). SvelteKit hashes its own inline scripts.
    csp: {
      mode: 'hash',
      directives: {
        'default-src': ['self'],
        'script-src': ['self'],
        // 'self' plus exactly one inline style: SvelteKit's visually hidden route announcer
        'style-src': ['self', 'unsafe-hashes', 'sha256-S8qMpvofolR8Mpjy4kQvEm7m1q8clzU4dfDH0AmvZjo='],
        'img-src': ['self', 'data:'],
        'font-src': ['self'],
        'connect-src': ['self'],
        'media-src': ['none'],
        'object-src': ['none'],
        'base-uri': ['self'],
        'form-action': ['none']
      }
    }
  }
};

export default config;
```

## 10. Accessibility test that works with a WebGL page

```ts
// The HTML is the same in every tier; audit it without the WebGL loop, which starves axe under software rendering.
test('no accessibility violations (axe, WCAG 2.2 AA)', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto('/');
  await page.waitForTimeout(800);
  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
  const serious = result.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
  expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual([]);
});
```
