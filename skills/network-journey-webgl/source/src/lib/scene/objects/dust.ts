import * as THREE from 'three';
import { COLORS, pointsMat, type FrameCtx, type SceneObject } from '../shared';

/** Sparse green dust along the whole camera path. */
export function dust(scene: THREE.Scene, n: number): SceneObject {
  const a = new Float32Array(n * 3);
  for (let k = 0; k < n; k++) {
    a[k * 3] = (Math.random() - 0.5) * 60;
    a[k * 3 + 1] = (Math.random() - 0.4) * 30;
    a[k * 3 + 2] = -75 + Math.random() * 170;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(a, 3));
  const p = new THREE.Points(g, pointsMat(COLORS.primary, 0.07, 0.6));
  scene.add(p);
  return { update: ({ t }: FrameCtx) => void (p.rotation.y = Math.sin(t * 0.02) * 0.02) };
}
