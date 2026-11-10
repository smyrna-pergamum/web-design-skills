import * as THREE from 'three';
import { COLORS, glassMat, lineMat, STATION, type FrameCtx, type SceneObject, type TagSpec } from '../shared';
import { DEVICES } from '$lib/content/sample-network';

export const crystalGeometry = () => {
  const g = new THREE.OctahedronGeometry(1, 0);
  g.scale(0.85, 1.45, 0.85);
  return g;
};

/** 03 Devices: four glass crystals on a rail, each with a HUD label (igloo's portfolio crystals). */
export function crystals(scene: THREE.Scene, addTag: (t: TagSpec) => void, openDevice: (id: string) => void): SceneObject {
  const geo = crystalGeometry();
  const edges = new THREE.EdgesGeometry(geo);
  const picks = [DEVICES[0], DEVICES[1], DEVICES[2], DEVICES[3]];
  const items = picks.map((d, k) => {
    const x = -7.5 + k * 5;
    const g = new THREE.Group();
    g.position.set(x, 0, STATION.devicesZ);
    const shell = new THREE.Mesh(geo, glassMat());
    const wire = new THREE.LineSegments(edges, lineMat(COLORS.lime, 0.7));
    const inner = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.12, 0),
      new THREE.MeshBasicMaterial({ color: d.ports.length ? COLORS.signal : COLORS.muted })
    );
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(1.3, 1.32, 64),
      new THREE.MeshBasicMaterial({ color: COLORS.primary, transparent: true, opacity: 0.6, side: THREE.DoubleSide })
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -1.9;
    g.add(shell, wire, inner, ring);
    scene.add(g);
    addTag({
      html: `Device_0${k + 1} / ${d.name}<small>IP ${d.ip}</small><small>Vendor ${d.vendor}</small><small>Type ${d.type}</small><small>Click to inspect</small>`,
      pos: () => new THREE.Vector3(x + 0.4, 1.2, STATION.devicesZ),
      chapters: [2],
      onClick: () => openDevice(d.id),
      label: `${d.name}, ${d.ip}, open details`
    });
    return { group: g, shell, wire, inner, k };
  });
  return {
    update({ i, t }: FrameCtx) {
      items.forEach(({ group, shell, wire, inner, k }) => {
        group.visible = i >= 1 && i <= 6;
        shell.rotation.y = wire.rotation.y = t * 0.25 + k;
        inner.rotation.y = -t;
      });
    }
  };
}
