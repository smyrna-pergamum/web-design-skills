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
