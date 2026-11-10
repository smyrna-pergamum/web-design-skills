import * as THREE from 'three';
import { COLORS, clamp, lineMat, pointsMat, V, type FrameCtx, type SceneObject, type TagSpec } from '../shared';
import { DEVICES, NETWORK } from '$lib/content/sample-network';

/** 02 Discovery: the gateway at the centre, devices appearing in discovery order, empty probed addresses as dim dust. */
export function topology(
  scene: THREE.Scene,
  probes: number,
  addTag: (t: TagSpec) => void,
  openDevice: (id: string) => void,
  onCount: (probed: number, found: number) => void
): SceneObject {
  const group = new THREE.Group();
  scene.add(group);
  const gw = new THREE.Mesh(new THREE.IcosahedronGeometry(0.07, 1), new THREE.MeshBasicMaterial({ color: COLORS.signal }));
  group.add(gw);
  const others = DEVICES.slice(1);
  const dPos = others.map((_, k) => {
    const a = (k / others.length) * Math.PI * 2 + 0.4;
    return V(Math.cos(a) * 1.75, Math.sin(a * 2) * 0.45, Math.sin(a) * 1.75);
  });
  const nodes = dPos.map((p) => {
    const m = new THREE.Mesh(new THREE.IcosahedronGeometry(0.035, 1), new THREE.MeshBasicMaterial({ color: COLORS.lime }));
    m.position.copy(p);
    m.visible = false;
    group.add(m);
    return m;
  });
  const lPos = new Float32Array(dPos.length * 6);
  dPos.forEach((p, k) => lPos.set([0, 0, 0, p.x, p.y, p.z], k * 6));
  const lGeo = new THREE.BufferGeometry();
  lGeo.setAttribute('position', new THREE.BufferAttribute(lPos, 3));
  lGeo.setDrawRange(0, 0);
  group.add(new THREE.LineSegments(lGeo, lineMat(COLORS.lime, 0.8)));

  const dust = new Float32Array(probes * 3);
  for (let k = 0; k < probes; k++) {
    const v = new THREE.Vector3().randomDirection().multiplyScalar(2.1 + Math.random() * 0.6);
    dust.set([v.x, v.y * 0.6, v.z], k * 3);
  }
  const dGeo = new THREE.BufferGeometry();
  dGeo.setAttribute('position', new THREE.BufferAttribute(dust, 3));
  group.add(new THREE.Points(dGeo, pointsMat(COLORS.green, 0.06, 0.9)));

  addTag({
    html: 'Gateway<small>192.168.2.1 · ICMP · ARP</small>',
    pos: () => V(0, 0, 0),
    chapters: [1],
    onClick: () => openDevice('gw'),
    label: 'Gateway, 192.168.2.1, open details'
  });
  const hidden = V(0, 0, 999);
  others.forEach((d, k) =>
    addTag({
      html: `${d.name}<small>${d.ip}</small>`,
      pos: () => (nodes[k].visible ? dPos[k] : hidden),
      chapters: [1],
      onClick: () => openDevice(d.id),
      label: `${d.name}, ${d.ip}, open details`
    })
  );

  let lastShown = -1;
  return {
    update({ i, l, t }: FrameCtx) {
      group.visible = i >= 1 && i <= 2;
      const shown = i < 1 ? 0 : i > 1 ? others.length : Math.ceil(clamp((l - 0.2) / 0.55) * others.length);
      if (shown !== lastShown) {
        nodes.forEach((m, n) => (m.visible = n < shown));
        lGeo.setDrawRange(0, shown * 2);
        lastShown = shown;
      }
      gw.scale.setScalar(1 + Math.sin(t * 3) * 0.15);
      if (i === 1) onCount(Math.round(clamp((l - 0.1) / 0.6) * NETWORK.probed), shown + 1);
      else if (i > 1) onCount(NETWORK.probed, DEVICES.length);
    }
  };
}
