import * as THREE from 'three';
import { COLORS, clamp, lineMat, pointsMat, type FrameCtx, type SceneObject, type TagSpec } from '../shared';
import { DEVICES } from '$lib/content/sample-network';

/** 01 Hero: a fibonacci sphere of nodes, each tied to its 3 nearest neighbours, around a glass core. It opens as the hero scrolls. */
export function networkSphere(
  scene: THREE.Scene,
  count: number,
  addTag: (t: TagSpec) => void,
  openDevice: (id: string) => void,
  withTags: boolean
): SceneObject {
  const R0 = 3;
  const base: THREE.Vector3[] = [];
  for (let k = 0; k < count; k++) {
    const y = 1 - (2 * (k + 0.5)) / count;
    const r = Math.sqrt(1 - y * y);
    const t = k * 2.39996323;
    base.push(new THREE.Vector3(Math.cos(t) * r, y, Math.sin(t) * r));
  }
  const pos = new Float32Array(count * 3);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const points = new THREE.Points(geo, pointsMat(COLORS.lime, 0.16, 1));
  scene.add(points);

  const pairs: [number, number][] = [];
  for (let a = 0; a < count; a++) {
    const d: [number, number][] = [];
    for (let b = 0; b < count; b++) if (a !== b) d.push([base[a].distanceToSquared(base[b]), b]);
    d.sort((x, y) => x[0] - y[0]);
    for (let j = 0; j < 3; j++) if (a < d[j][1]) pairs.push([a, d[j][1]]);
  }
  const ePos = new Float32Array(pairs.length * 6);
  const eGeo = new THREE.BufferGeometry();
  eGeo.setAttribute('position', new THREE.BufferAttribute(ePos, 3));
  const edges = new THREE.LineSegments(eGeo, lineMat(COLORS.primary, 0.55));
  scene.add(edges);

  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.15, 1),
    new THREE.MeshStandardMaterial({
      color: COLORS.forest,
      emissive: 0x0e2a20,
      metalness: 0.2,
      roughness: 0.15,
      transparent: true,
      opacity: 0.55,
      flatShading: true
    })
  );
  const wire = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.17, 1)), lineMat(COLORS.lime, 0.45));
  scene.add(core, wire);
  const halos = [1, 1.45].map((s) => {
    const m = new THREE.Mesh(
      new THREE.RingGeometry(3.6, 3.62, 128),
      new THREE.MeshBasicMaterial({ color: COLORS.primary, transparent: true, opacity: 0.5, side: THREE.DoubleSide })
    );
    m.rotation.x = Math.PI / 2;
    m.position.y = -3.4;
    m.scale.setScalar(s);
    scene.add(m);
    return m;
  });

  if (withTags) {
    [17, 121, 233].forEach((idx, k) => {
      const d = DEVICES[k];
      const n = Math.min(idx, count - 1);
      addTag({
        html: `${d.name}<small>${d.ip}</small>`,
        pos: () => new THREE.Vector3(pos[n * 3], pos[n * 3 + 1], pos[n * 3 + 2]),
        chapters: [0],
        onClick: () => openDevice(d.id),
        label: `${d.name}, ${d.ip}, open details`
      });
    });
  }

  return {
    update({ i, l, t }: FrameCtx) {
      const open = i === 0 ? clamp((l - 0.35) / 0.65) : 1;
      const spin = t * 0.06;
      const c = Math.cos(spin);
      const s = Math.sin(spin);
      const rr = R0 * (1 + open * 1.6);
      const visible = i <= 1;
      points.visible = edges.visible = visible;
      if (visible) {
        for (let n = 0; n < count; n++) {
          const b = base[n];
          pos[n * 3] = (b.x * c - b.z * s) * rr;
          pos[n * 3 + 1] = b.y * rr;
          pos[n * 3 + 2] = (b.x * s + b.z * c) * rr;
        }
        geo.attributes.position.needsUpdate = true;
        pairs.forEach(([a, b], n) => {
          ePos[n * 6] = pos[a * 3];
          ePos[n * 6 + 1] = pos[a * 3 + 1];
          ePos[n * 6 + 2] = pos[a * 3 + 2];
          ePos[n * 6 + 3] = pos[b * 3];
          ePos[n * 6 + 4] = pos[b * 3 + 1];
          ePos[n * 6 + 5] = pos[b * 3 + 2];
        });
        eGeo.attributes.position.needsUpdate = true;
        const fade = i === 0 ? 1 - open * 0.85 : 0.12;
        (points.material as THREE.PointsMaterial).opacity = fade;
        (edges.material as THREE.LineBasicMaterial).opacity = 0.55 * fade;
      }
      core.visible = wire.visible = i === 0;
      core.rotation.y = wire.rotation.y = spin * 2;
      core.scale.setScalar(1 - open * 0.6);
      wire.scale.copy(core.scale);
      halos.forEach((h) => (h.visible = i === 0));
    }
  };
}
