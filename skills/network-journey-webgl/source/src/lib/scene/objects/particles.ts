import * as THREE from 'three';
import { COLORS, pointsMat, STATION, type FrameCtx, type SceneObject } from '../shared';

export type ReportShape = 'pdf' | 'xlsx' | 'json' | 'csv';
export type FinalShape = 'github' | 'docs' | 'releases' | 'issues';
type Draw = (x: CanvasRenderingContext2D) => void;

/** 06 Reports + 08 Final: one particle cloud that morphs between line drawings sampled from a 2D canvas. */
export function particles(
  scene: THREE.Scene,
  n: number,
  mobile: boolean
): SceneObject & { setReport: (s: ReportShape) => void; setFinal: (s: FinalShape) => void } {
  const pos = new Float32Array(n * 3);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const cloud = new THREE.Points(geo, pointsMat(COLORS.lime, mobile ? 0.07 : 0.055, 0.95));
  scene.add(cloud);

  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 256;
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;

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
  const line = (x: CanvasRenderingContext2D, pts: number[]) => {
    x.beginPath();
    x.moveTo(pts[0], pts[1]);
    for (let k = 2; k < pts.length; k += 2) x.lineTo(pts[k], pts[k + 1]);
    x.stroke();
  };
  const dot = (x: CanvasRenderingContext2D, cx: number, cy: number, r: number) => {
    x.beginPath();
    x.arc(cx, cy, r, 0, Math.PI * 2);
    x.fill();
  };

  const R = STATION.report;
  const F = STATION.final;
  const scatter = new Float32Array(n * 3);
  for (let k = 0; k < n; k++) {
    const v = new THREE.Vector3().randomDirection().multiplyScalar(4 + Math.random() * 7);
    scatter.set([R.x + v.x, R.y + v.y, R.z + v.z], k * 3);
  }

  const bars = [24, 40, 18, 32];
  const reportDraw: Record<ReportShape, () => Float32Array> = {
    pdf: () => shape((x) => {
      x.strokeRect(68, 28, 120, 170);
      line(x, [160, 28, 188, 56]);
      x.fillRect(84, 52, 60, 9);
      for (let k = 0; k < 5; k++) x.fillRect(84, 80 + k * 15, k % 2 ? 76 : 88, 4);
      bars.forEach((b, k) => x.fillRect(90 + k * 20, 184 - b, 10, b));
    }, R, 6.2),
    xlsx: () => shape((x) => {
      x.strokeRect(36, 52, 184, 132);
      for (let k = 1; k < 5; k++) line(x, [36 + k * 37, 52, 36 + k * 37, 184]);
      for (let k = 1; k < 6; k++) line(x, [36, 52 + k * 22, 220, 52 + k * 22]);
      x.fillRect(36, 52, 184, 22);
      [0, 1, 2].forEach((k) => x.strokeRect(36 + k * 44, 190, 40, 16));
    }, R, 6.2),
    json: () => shape((x) => {
      x.strokeRect(30, 48, 196, 150);
      line(x, [30, 72, 226, 72]);
      [0, 1, 2].forEach((k) => dot(x, 44 + k * 12, 60, 3));
      x.font = 'bold 30px monospace';
      x.fillText('{ }', 96, 140);
      for (let k = 0; k < 3; k++) x.fillRect(50, 156 + k * 12, 60 + k * 30, 4);
    }, R, 6.2),
    csv: () => shape((x) => {
      x.strokeRect(30, 48, 196, 150);
      line(x, [30, 72, 226, 72]);
      x.font = 'bold 22px monospace';
      x.fillText('>_', 46, 104);
      for (let k = 0; k < 5; k++) {
        x.fillRect(46, 120 + k * 14, 40, 4);
        x.fillRect(96, 120 + k * 14, 50, 4);
        x.fillRect(156, 120 + k * 14, 46, 4);
      }
    }, R, 6.2)
  };

  const shield = new Path2D('M256 100 384 151v94c0 76-56 129-128 166-72-37-128-90-128-166v-94Z');
  const check = new Path2D('m190 251 48 49 88-96');
  const finalDraw: Record<FinalShape, () => Float32Array> = {
    github: () => shape((x) => {
      x.translate(0, -6);
      x.scale(0.5, 0.5);
      x.lineWidth = 12;
      x.stroke(shield);
      x.stroke(check);
      [[190, 251], [238, 300], [326, 204]].forEach(([a, b]) => dot(x, a, b, 14));
    }, F, 6),
    docs: () => shape((x) => {
      x.beginPath();
      x.moveTo(128, 70);
      x.quadraticCurveTo(84, 52, 40, 64);
      x.lineTo(40, 190);
      x.quadraticCurveTo(84, 178, 128, 196);
      x.quadraticCurveTo(172, 178, 216, 190);
      x.lineTo(216, 64);
      x.quadraticCurveTo(172, 52, 128, 70);
      x.lineTo(128, 196);
      x.stroke();
      for (let k = 0; k < 5; k++) {
        x.fillRect(56, 92 + k * 18, 54, 3);
        x.fillRect(146, 92 + k * 18, 54, 3);
      }
    }, F, 6),
    releases: () => shape((x) => {
      line(x, [128, 40, 128, 160]);
      line(x, [82, 116, 128, 162, 174, 116]);
      line(x, [52, 170, 52, 206, 204, 206, 204, 170]);
    }, F, 6),
    issues: () => shape((x) => {
      x.beginPath();
      x.moveTo(56, 52);
      x.lineTo(200, 52);
      x.quadraticCurveTo(220, 52, 220, 72);
      x.lineTo(220, 150);
      x.quadraticCurveTo(220, 170, 200, 170);
      x.lineTo(110, 170);
      x.lineTo(76, 206);
      x.lineTo(80, 170);
      x.lineTo(56, 170);
      x.quadraticCurveTo(36, 170, 36, 150);
      x.lineTo(36, 72);
      x.quadraticCurveTo(36, 52, 56, 52);
      x.stroke();
      [0, 1, 2].forEach((k) => dot(x, 92 + k * 36, 112, 9));
    }, F, 6)
  };
  pos.set(scatter);
  // shapes are sampled on first use, so start-up stays short on phones
  const cache = new Map<string, Float32Array>();
  const get = (key: string, make: () => Float32Array) => {
    let v = cache.get(key);
    if (!v) cache.set(key, (v = make()));
    return v;
  };
  let rep: ReportShape = 'pdf';
  let fin: FinalShape = 'github';

  const platform = new THREE.Group();
  platform.position.set(0, -2.9, F.z);
  [3.2, 4.4, 5.8].forEach((r, k) => {
    const m = new THREE.Mesh(
      new THREE.RingGeometry(r, r + 0.04, 128),
      new THREE.MeshBasicMaterial({ color: k ? COLORS.green : COLORS.lime, transparent: true, opacity: k ? 0.6 : 0.7, side: THREE.DoubleSide })
    );
    m.rotation.x = Math.PI / 2;
    platform.add(m);
  });
  platform.add(
    new THREE.Mesh(new THREE.CylinderGeometry(3, 3.2, 0.25, 64), new THREE.MeshStandardMaterial({ color: 0x111713, metalness: 0.8, roughness: 0.4 }))
  );
  scene.add(platform);

  return {
    setReport: (s) => (rep = s),
    setFinal: (s) => (fin = s),
    update({ i, t, dt }: FrameCtx) {
      if (i === 4) get('r:' + rep, reportDraw[rep]); // sample the report shape one chapter early
      if (i === 6) get('f:' + fin, finalDraw[fin]);
      const target = i < 5 ? scatter : i === 5 ? get('r:' + rep, reportDraw[rep]) : get('f:' + fin, finalDraw[fin]);
      const k = Math.min(1, dt * 3.2);
      for (let j = 0; j < pos.length; j++) pos[j] += (target[j] - pos[j]) * k;
      geo.attributes.position.needsUpdate = true;
      (cloud.material as THREE.PointsMaterial).opacity = i >= 5 ? 0.95 : 0.35;
      platform.rotation.y = t * 0.05;
      platform.visible = i >= 6;
    }
  };
}
