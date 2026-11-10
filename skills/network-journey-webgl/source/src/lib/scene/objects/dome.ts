import * as THREE from 'three';
import { COLORS, lineMat, STATION, V, type FrameCtx, type SceneObject, type TagSpec } from '../shared';

/** 07 Local-first: one dome named 127.0.0.1 around the whole network. Nothing crosses it. */
export function dome(scene: THREE.Scene, addTag: (t: TagSpec) => void): SceneObject {
  const mesh = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(40, 2)), lineMat(COLORS.primary, 0));
  mesh.position.copy(STATION.dome);
  scene.add(mesh);
  addTag({ html: '127.0.0.1 · Local mode<small>Interface boundary</small>', pos: () => V(36, 6, STATION.dome.z), chapters: [6] });
  const m = mesh.material as THREE.LineBasicMaterial;
  return {
    update({ i }: FrameCtx) {
      const target = i === 6 ? 0.35 : i === 7 ? 0.12 : 0;
      m.opacity += (target - m.opacity) * 0.08;
      mesh.visible = m.opacity > 0.005;
    }
  };
}
