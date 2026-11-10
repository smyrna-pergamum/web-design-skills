export type Tier = 'full' | 'lite' | 'mobile' | 'static';

export const TIER_SETTINGS = {
  full: { sphereNodes: 280, particles: 2600, dust: 1100, dpr: 1.75, antialias: true, probes: 70 },
  lite: { sphereNodes: 200, particles: 1800, dust: 700, dpr: 1.5, antialias: true, probes: 50 },
  mobile: { sphereNodes: 140, particles: 1200, dust: 450, dpr: 1.5, antialias: false, probes: 40 }
} as const;
export type Settings = (typeof TIER_SETTINGS)[keyof typeof TIER_SETTINGS];

/** Picks the quality tier once at start-up (spec §10). */
export function detectTier(): Tier {
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return 'static';
  if (nav.connection?.saveData) return 'static';
  try {
    const c = document.createElement('canvas');
    if (!c.getContext('webgl2')) return 'static';
  } catch {
    return 'static';
  }
  const w = innerWidth;
  if (w < 768) return 'mobile';
  if (w < 1200 || (nav.deviceMemory ?? 8) < 8 || (navigator.hardwareConcurrency ?? 8) <= 4) return 'lite';
  return 'full';
}
