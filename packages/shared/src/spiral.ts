import type { Station, Track } from './types.js';

// Ported verbatim from the design's data.jsx — the discovery spiral that
// places every station on the orbit map. Frontend (rendering) and backend
// (seeding) must agree on this exact math.
export const SPIRAL = { turns: 2.15, r0: 0.12, rGain: 0.55, rot: -Math.PI / 2 };

export interface SpiralPoint {
  x: number;
  y: number;
  ang: number;
  r: number;
  t: number;
}

export function spiralPoint(radiusVal: number): SpiralPoint {
  const t = Math.max(0, Math.min(100, radiusVal)) / 100;
  const ang = SPIRAL.rot + t * SPIRAL.turns * Math.PI * 2;
  const r = SPIRAL.r0 + t * SPIRAL.rGain;
  return { x: Math.cos(ang) * r, y: Math.sin(ang) * r, ang, r, t };
}

export function stationsFromTracks(tracks: Track[]): Station[] {
  return tracks.map((tr) => {
    const p = spiralPoint(tr.radius);
    return {
      ...tr,
      x: p.x,
      y: p.y,
      r: p.r,
      ang: p.ang,
      size: 0.016 + (tr.ring === 0 ? 0.01 : 0) - tr.ring * 0.001,
    };
  });
}

export function trackForRadius<T extends Track>(tracks: T[], r: number): T {
  let best = tracks[0];
  let bestD = Infinity;
  for (const t of tracks) {
    const d = Math.abs(t.radius - r);
    if (d < bestD) {
      bestD = d;
      best = t;
    }
  }
  return best;
}

export function ringLabel(ring: number): string {
  return ['Inner circle', 'One step out', 'Two steps out', 'Three steps out', 'Deep space'][ring];
}

export function modeForRadius(r: number): 'STAY CLOSE' | 'DRIFT' | 'EDGE' | 'DEEP SPACE' {
  return r < 22 ? 'STAY CLOSE' : r < 55 ? 'DRIFT' : r < 80 ? 'EDGE' : 'DEEP SPACE';
}
