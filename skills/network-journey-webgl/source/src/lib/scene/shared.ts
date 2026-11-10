import * as THREE from 'three';

export const COLORS = {
  bg: 0x080b09, fog: 0x0b140f, forest: 0x173c33, green: 0x245b48, primary: 0x2d7659,
  lime: 0xc6eea3, signal: 0xa3ff12, muted: 0x5d665f, warning: 0xdc8b40
};

/** Everything a scene object needs each frame. */
export type FrameCtx = { i: number; l: number; t: number; dt: number; camera: THREE.PerspectiveCamera };

/** A label pinned to a 3D point; rendered as HTML (a button when it opens details). */
export type TagSpec = { html: string; pos: () => THREE.Vector3; chapters: number[]; warn?: boolean; onClick?: () => void; label?: string };

export type SceneObject = { update: (ctx: FrameCtx) => void; dispose?: () => void };

export const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

let sprite: THREE.Texture | null = null;
/** Soft round dot used by every point cloud. */
export function dotTexture() {
  if (sprite) return sprite;
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const x = c.getContext('2d')!;
  const g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.35, 'rgba(255,255,255,.85)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  x.fillStyle = g;
  x.fillRect(0, 0, 64, 64);
  sprite = new THREE.CanvasTexture(c);
  sprite.colorSpace = THREE.SRGBColorSpace;
  return sprite;
}

export const pointsMat = (color: number, size: number, opacity: number) =>
  new THREE.PointsMaterial({ color, size, map: dotTexture(), transparent: true, opacity, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true });

export const lineMat = (color: number, opacity: number) =>
  new THREE.LineBasicMaterial({ color, transparent: true, opacity, depthWrite: false, blending: THREE.AdditiveBlending });

export const glassMat = () =>
  new THREE.MeshStandardMaterial({ color: COLORS.green, emissive: 0x0b1f17, metalness: 0.1, roughness: 0.08, transparent: true, opacity: 0.42, flatShading: true });

/** Places of the stations along the journey. */
export const STATION = {
  sphere: V(0, 0, 0),
  devicesZ: -16,
  pc: V(0, 0, -32),
  report: V(0, 0, -58),
  dome: V(0, 0, -24),
  final: V(0, 0.4, 75)
};
