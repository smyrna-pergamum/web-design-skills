import * as THREE from 'three';
import { cameraAt } from './cameraPath';
import { COLORS, STATION, V, type FrameCtx, type SceneObject, type TagSpec } from './shared';
import { TIER_SETTINGS, type Tier } from './quality';
import { networkSphere } from './objects/networkSphere';
import { topology } from './objects/topology';
import { crystals } from './objects/crystals';
import { portRings } from './objects/portRings';
import { particles, type FinalShape, type ReportShape } from './objects/particles';
import { dome } from './objects/dome';
import { dust } from './objects/dust';

type Options = {
  canvas: HTMLCanvasElement;
  tagLayer: HTMLElement;
  leaders: SVGSVGElement;
  tier: Exclude<Tier, 'static'>;
  chapter: { i: number; l: number };
  openDevice: (id: string) => void;
  onCount: (probed: number, found: number) => void;
  onGlitch: (g: number) => void;
  onLost: () => void;
};

type Tag = TagSpec & { el: HTMLElement; line: SVGLineElement; dot: SVGCircleElement; shown: boolean };

const SVG = 'http://www.w3.org/2000/svg';

/** The WebGL layer (spec §8): one scene, one camera path, decoration only. All content lives in HTML. */
export async function createStage(o: Options) {
  const yieldTask = () => new Promise<void>((r) => setTimeout(r, 0));
  const s = TIER_SETTINGS[o.tier];
  const mobile = o.tier === 'mobile';
  const renderer = new THREE.WebGLRenderer({ canvas: o.canvas, antialias: s.antialias, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, s.dpr));
  renderer.setClearColor(COLORS.bg, 1);
  const scene = new THREE.Scene();
  const fog = new THREE.FogExp2(COLORS.fog, 0.03);
  scene.fog = fog;
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 400);

  scene.add(new THREE.HemisphereLight(0x9fd9b6, 0x050a08, 1.6));
  const key = new THREE.DirectionalLight(0xdff5e6, 2.4);
  key.position.set(-6, 10, 8);
  scene.add(key);
  const glow = new THREE.PointLight(COLORS.signal, 40, 14, 2);
  scene.add(glow);

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

  const pos = new THREE.Vector3(), target = new THREE.Vector3(), camPos = new THREE.Vector3(), camTarget = new THREE.Vector3();
  let first = true, mx = 0, my = 0;
  const onPointer = (e: PointerEvent) => {
    mx = e.clientX / innerWidth - 0.5;
    my = e.clientY / innerHeight - 0.5;
  };
  addEventListener('pointermove', onPointer, { passive: true });

  function resize() {
    const w = innerWidth, h = innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = w < 768 ? 62 : 50;
    camera.updateProjectionMatrix();
    o.leaders.setAttribute('viewBox', `0 0 ${w} ${h}`);
  }
  resize();
  addEventListener('resize', resize);

  const glowAt = [STATION.sphere, STATION.sphere, V(0, 0, -14), STATION.pc, STATION.pc, STATION.report, STATION.final, STATION.final];
  const v3 = new THREE.Vector3();
  let raf = 0, last = performance.now(), running = true, fpsAcc = 0, fpsN = 0, lowered = false;

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

  function frame(now: number) {
    if (!running) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const t = now / 1000;
    const { i, l } = o.chapter;
    const g = cameraAt(i, l, pos, target);
    if (first) {
      camPos.copy(pos);
      camTarget.copy(target);
      first = false;
    }
    camPos.lerp(pos, 0.12);
    camTarget.lerp(target, 0.12);
    camera.position.copy(camPos);
    camera.position.x += mx * 0.35;
    camera.position.y -= my * 0.25;
    camera.lookAt(camTarget);
    o.onGlitch(g * 0.9);

    const ctx: FrameCtx = { i, l, t, dt, camera };
    for (const ob of objects) ob.update(ctx);
    glow.position.lerp(glowAt[i], 0.08);
    const fd = i >= 6 ? 0.006 : i === 5 ? 0.02 : 0.03;
    fog.density += (fd - fog.density) * 0.08;

    renderer.render(scene, camera);
    placeTags(i, l);

    // quality guard: drop the pixel ratio when the frame rate stays under ~40 fps
    fpsAcc += dt;
    if (++fpsN === 90) {
      if (!lowered && fpsAcc / fpsN > 1 / 40) {
        lowered = true;
        renderer.setPixelRatio(1);
        resize();
      }
      fpsAcc = 0;
      fpsN = 0;
    }
    raf = requestAnimationFrame(frame);
  }

  const onVisibility = () => {
    if (document.hidden) {
      running = false;
      cancelAnimationFrame(raf);
    } else if (!running) {
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
  };
  document.addEventListener('visibilitychange', onVisibility);
  const onLost = (e: Event) => {
    e.preventDefault();
    o.onLost();
  };
  o.canvas.addEventListener('webglcontextlost', onLost);
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

  return {
    setReport: (v: ReportShape) => cloud.setReport(v),
    setFinal: (v: FinalShape) => cloud.setFinal(v),
    destroy() {
      running = false;
      cancelAnimationFrame(raf);
      removeEventListener('pointermove', onPointer);
      removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
      o.canvas.removeEventListener('webglcontextlost', onLost);
      tags.forEach((tg) => {
        tg.el.remove();
        tg.line.remove();
        tg.dot.remove();
      });
      scene.traverse((ob) => {
        const m = ob as THREE.Mesh;
        m.geometry?.dispose();
        const mat = m.material as THREE.Material | THREE.Material[] | undefined;
        (Array.isArray(mat) ? mat : mat ? [mat] : []).forEach((x) => x.dispose());
      });
      renderer.dispose();
    }
  };
}

export type Stage = Awaited<ReturnType<typeof createStage>>;
