import { useMemo } from 'react';
import { spiralPoint, type Station, type Track, type TonightSet } from '@orbit/shared';
import { seeded } from '../atoms/seeded';

interface HomeMapCanvasProps {
  radius: number;
  previewRadius: number | null;
  track: Track;
  isTuning: boolean;
  stations: Station[];
  tonightSet: TonightSet;
  onSelectStation: (s: Station) => void;
}

export function HomeMapCanvas({ radius, previewRadius, track, isTuning, stations, tonightSet, onSelectStation }: HomeMapCanvasProps) {
  const headRadius = previewRadius != null ? previewRadius : radius;
  const head = spiralPoint(headRadius);
  const reachR = head.r;

  const spiralPts = useMemo(() => {
    const pts: string[] = [];
    for (let i = 0; i <= 200; i++) {
      const p = spiralPoint(i / 2);
      pts.push(`${p.x.toFixed(4)},${p.y.toFixed(4)}`);
    }
    return pts.join(' ');
  }, []);

  const tunedPts = useMemo(() => {
    const pts: string[] = [];
    const steps = Math.max(2, Math.round(headRadius * 2));
    for (let i = 0; i <= steps; i++) {
      const p = spiralPoint((i / steps) * headRadius);
      pts.push(`${p.x.toFixed(4)},${p.y.toFixed(4)}`);
    }
    return pts.join(' ');
  }, [headRadius]);

  const setStations = tonightSet.trackIds.map((id) => stations.find((s) => s.id === id)).filter((s): s is Station => Boolean(s));
  const setPath = setStations.map((s) => `${s.x.toFixed(4)},${s.y.toFixed(4)}`).join(' ');

  const rings = [0.12, 0.26, 0.4, 0.54, 0.67];

  const ambient = useMemo(() => {
    return Array.from({ length: 70 }, (_, i) => {
      const r = seeded(i * 31 + 5)();
      const r2 = seeded(i * 17 + 11)();
      const ang = r * Math.PI * 2;
      const dist = 0.06 + r2 * 0.74;
      return { x: Math.cos(ang) * dist, y: Math.sin(ang) * dist, s: 0.0022 + r * 0.0032, op: 0.2 + r2 * 0.35 };
    });
  }, []);

  return (
    <svg viewBox="-0.8 -0.8 1.6 1.6" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" style={{ display: 'block' }}>
      <defs>
        <radialGradient id="home-reach" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--accent-p)" stopOpacity="0.16" />
          <stop offset="65%" stopColor="var(--accent-p)" stopOpacity="0.05" />
          <stop offset="100%" stopColor="var(--accent-p)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="home-center" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="head-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--accent-m)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="var(--accent-m)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="radar-sweep" cx="0%" cy="50%" r="100%">
          <stop offset="0%" stopColor="var(--accent-p)" stopOpacity="0.30" />
          <stop offset="55%" stopColor="var(--accent-p)" stopOpacity="0.10" />
          <stop offset="100%" stopColor="var(--accent-p)" stopOpacity="0" />
        </radialGradient>
        {[280, 300, 220, 200, 40, 260].map((hue, i) => (
          <radialGradient key={i} id={`home-cl-${i}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={`oklch(0.6 0.18 ${hue})`} stopOpacity="0.28" />
            <stop offset="100%" stopColor={`oklch(0.6 0.18 ${hue})`} stopOpacity="0" />
          </radialGradient>
        ))}
      </defs>

      {[
        { x: -0.04, y: -0.06, r: 0.16, i: 0 },
        { x: 0.2, y: 0.22, r: 0.18, i: 1 },
        { x: -0.3, y: 0.08, r: 0.16, i: 2 },
        { x: 0.08, y: -0.34, r: 0.15, i: 3 },
        { x: 0.34, y: -0.22, r: 0.18, i: 4 },
        { x: -0.42, y: -0.36, r: 0.16, i: 5 },
      ].map((c, k) => (
        <circle key={k} cx={c.x} cy={c.y} r={c.r} fill={`url(#home-cl-${c.i})`} />
      ))}

      {ambient.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.s} fill="#fff" opacity={s.op} />
      ))}

      {rings.map((r, i) => (
        <circle key={i} cx="0" cy="0" r={r} fill="none" stroke="var(--border)" strokeWidth="0.002" strokeDasharray={i === 0 ? '0' : '0.006 0.012'} opacity={0.5 - i * 0.06} />
      ))}

      <line x1="-0.7" y1="0" x2="0.7" y2="0" stroke="var(--border)" strokeWidth="0.0016" opacity="0.5" />
      <line x1="0" y1="-0.7" x2="0" y2="0.7" stroke="var(--border)" strokeWidth="0.0016" opacity="0.5" />
      {[45, 135].map((deg, i) => {
        const a = (deg * Math.PI) / 180;
        return (
          <line key={i} x1={-Math.cos(a) * 0.7} y1={-Math.sin(a) * 0.7} x2={Math.cos(a) * 0.7} y2={Math.sin(a) * 0.7} stroke="var(--border)" strokeWidth="0.0012" opacity="0.28" strokeDasharray="0.004 0.012" />
        );
      })}
      <circle cx="0" cy="0" r="0.7" fill="none" stroke="var(--accent-p)" strokeWidth="0.0028" opacity="0.30" />
      {Array.from({ length: 24 }).map((_, i) => {
        const a = (i / 24) * Math.PI * 2;
        const major = i % 6 === 0;
        const r1 = major ? 0.665 : 0.682;
        const r2 = 0.7;
        return (
          <line key={i} x1={Math.cos(a) * r1} y1={Math.sin(a) * r1} x2={Math.cos(a) * r2} y2={Math.sin(a) * r2} stroke={major ? 'var(--accent-p)' : 'var(--border-strong)'} strokeWidth={major ? 0.0028 : 0.0016} opacity={major ? 0.6 : 0.4} />
        );
      })}

      <g style={{ transformOrigin: 'center', animation: 'ring-rotate 7s linear infinite' }}>
        <path d="M 0 0 L 0.7 0 A 0.7 0.7 0 0 0 0.495 -0.495 Z" fill="url(#radar-sweep)" opacity="0.9" />
        <line x1="0" y1="0" x2="0.7" y2="0" stroke="var(--accent-p)" strokeWidth="0.0035" opacity="0.75" style={{ filter: 'drop-shadow(0 0 0.01px var(--glow-p))' }} />
        <circle cx="0.7" cy="0" r="0.008" fill="var(--accent-p)" style={{ filter: 'drop-shadow(0 0 0.01px var(--glow-p))' }} />
      </g>

      <polyline points={spiralPts} fill="none" stroke="var(--accent-p)" strokeWidth="0.0025" opacity="0.14" strokeLinecap="round" />
      <circle cx="0" cy="0" r={Math.max(0.05, reachR)} fill="url(#home-reach)" style={{ transition: 'r 0.3s ease' }} />
      <polyline points={setPath} fill="none" stroke="var(--accent-m)" strokeWidth="0.004" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="0.012 0.01" opacity="0.45" />
      <polyline points={tunedPts} fill="none" stroke="var(--accent-p)" strokeWidth="0.005" opacity="0.7" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 0.01px var(--glow-p))', transition: 'all 0.2s' }} />

      <circle cx="0" cy="0" r="0.06" fill="url(#home-center)" />
      <circle cx="0" cy="0" r="0.02" fill="var(--text-0)" />
      <circle cx="0" cy="0" r="0.032" fill="none" stroke="var(--text-0)" strokeWidth="0.0025" opacity="0.4">
        <animate attributeName="r" from="0.02" to="0.09" dur="3.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" from="0.5" to="0" dur="3.5s" repeatCount="indefinite" />
      </circle>

      {stations.map((s) => {
        const inReach = s.radius <= headRadius + 3;
        const isCurrent = s.id === track.id;
        const inSet = tonightSet.trackIds.includes(s.id);
        const color = isCurrent ? 'var(--accent-m)' : inReach ? 'var(--accent-p)' : s.isNew ? 'var(--accent-m)' : 'var(--text-3)';
        return (
          <g key={s.id} style={{ cursor: 'pointer' }} onClick={() => onSelectStation(s)}>
            {(isCurrent || inReach) && (
              <circle
                cx={s.x}
                cy={s.y}
                r={s.size * (isCurrent ? 4 : 2.6)}
                fill={color}
                opacity={isCurrent ? 0.4 : 0.14}
                style={isCurrent ? { animation: 'pulse-glow 1.8s ease-in-out infinite' } : undefined}
              />
            )}
            {inSet && !isCurrent && <circle cx={s.x} cy={s.y} r={s.size * 2} fill="none" stroke="var(--accent-m)" strokeWidth="0.0022" opacity="0.5" />}
            <circle cx={s.x} cy={s.y} r="0.045" fill="transparent" />
            <circle
              cx={s.x}
              cy={s.y}
              r={s.size}
              fill={color}
              stroke={isCurrent ? '#fff' : 'none'}
              strokeWidth={isCurrent ? 0.004 : 0}
              style={{
                filter: inReach ? `drop-shadow(0 0 0.01px ${color === 'var(--accent-m)' ? 'var(--glow-m)' : 'var(--glow-p)'})` : 'none',
                transition: 'all 0.3s ease',
              }}
            />
            {(isCurrent || inReach) && (
              <text x={s.x} y={s.y + s.size + 0.028} fontFamily="var(--font-mono)" fontSize="0.019" fill={isCurrent ? 'var(--text-0)' : 'var(--text-1)'} textAnchor="middle" opacity={isCurrent ? 1 : 0.75}>
                {s.artist}
              </text>
            )}
          </g>
        );
      })}

      <g style={{ transition: 'all 0.2s ease' }}>
        <circle cx={head.x} cy={head.y} r="0.05" fill="url(#head-glow)" opacity={isTuning ? 1 : 0.7} />
        {isTuning && (
          <circle cx={head.x} cy={head.y} r="0.02" fill="none" stroke="var(--accent-m)" strokeWidth="0.003">
            <animate attributeName="r" from="0.01" to="0.06" dur="0.8s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.9" to="0" dur="0.8s" repeatCount="indefinite" />
          </circle>
        )}
        <line x1="0" y1="0" x2={head.x} y2={head.y} stroke="var(--accent-m)" strokeWidth="0.0022" opacity={isTuning ? 0.5 : 0.25} strokeDasharray="0.008 0.008" />
      </g>
    </svg>
  );
}
