import * as THREE from 'three';
import { COLORS, glassMat, lineMat, STATION, type FrameCtx, type SceneObject, type TagSpec } from '../shared';
import { PORT_RINGS } from '$lib/content/sample-network';
import { crystalGeometry } from './crystals';

/** 04 Ports + 05 Security: "This computer" with its ports as orbiting rings. Open is lime, open|filtered dashed, closed grey. */
export function portRings(scene: THREE.Scene, addTag: (t: TagSpec) => void): SceneObject {
  const center = new THREE.Group();
  center.position.copy(STATION.pc);
  scene.add(center);
  const geo = crystalGeometry();
  const shell = new THREE.Mesh(geo, glassMat());
  const wire = new THREE.LineSegments(new THREE.EdgesGeometry(geo), lineMat(COLORS.lime, 0.8));
  center.add(shell, wire);

  const rings = PORT_RINGS.map((P, k) => {
    const g = new THREE.Group();
    g.rotation.set(P.tilt[0], P.tilt[1], P.tilt[2]);
    center.add(g);
    const pts: THREE.Vector3[] = [];
    for (let a = 0; a <= 128; a++) {
      const t = (a / 128) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(t) * P.radius, 0, Math.sin(t) * P.radius));
    }
    const lg = new THREE.BufferGeometry().setFromPoints(pts);
    const mat =
      P.state === 'open'
        ? lineMat(COLORS.signal, 0.85)
        : P.state === 'closed'
          ? new THREE.LineBasicMaterial({ color: 0x4a524c, transparent: true, opacity: 0.6 })
          : new THREE.LineDashedMaterial({ color: COLORS.lime, dashSize: 0.18, gapSize: 0.14, transparent: true, opacity: 0.8 });
    const line = new THREE.Line(lg, mat);
    if (P.state === 'open|filtered') line.computeLineDistances();
    g.add(line);
    const marker = new THREE.Mesh(
      new THREE.SphereGeometry(0.09, 16, 16),
      new THREE.MeshBasicMaterial({ color: P.state === 'closed' ? COLORS.muted : COLORS.signal })
    );
    g.add(marker);
    addTag({
      html: `${P.port} · ${P.service}<small>${P.state}</small>`,
      pos: () => marker.getWorldPosition(new THREE.Vector3()),
      chapters: [3]
    });
    return { marker, P, a: k * 1.3, speed: 0.25 + k * 0.06 };
  });
  const smb = rings.find((r) => r.P.finding) ?? rings[0];
  addTag({
    html: 'R04 · Medium<small>File sharing (SMB)</small>',
    pos: () => smb.marker.getWorldPosition(new THREE.Vector3()),
    chapters: [4],
    warn: true
  });
  const warn = new THREE.Color(COLORS.warning);
  const signal = new THREE.Color(COLORS.signal);

  return {
    update({ i, t, dt }: FrameCtx) {
      center.visible = i >= 2 && i <= 6;
      shell.rotation.y = wire.rotation.y = t * 0.2;
      rings.forEach((r) => {
        r.a += dt * r.speed;
        r.marker.position.set(Math.cos(r.a) * r.P.radius, 0, Math.sin(r.a) * r.P.radius);
      });
      (smb.marker.material as THREE.MeshBasicMaterial).color.copy(i >= 4 ? warn : signal);
    }
  };
}
