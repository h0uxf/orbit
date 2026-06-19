import { useMemo } from 'react';
import { seeded } from './seeded';

interface MiniOrbitProps {
  size?: number;
  radiusPct?: number;
}

export function MiniOrbit({ size = 120, radiusPct = 30 }: MiniOrbitProps) {
  const stars = useMemo(() => {
    const r = seeded(42);
    return Array.from({ length: 16 }, () => {
      const ring = Math.floor(r() * 3);
      const radii = [0.22, 0.36, 0.48];
      const angle = r() * Math.PI * 2;
      return { r: radii[ring], angle, size: 0.018 + r() * 0.014 };
    });
  }, []);
  const reach = radiusPct / 100;

  return (
    <svg viewBox="-0.5 -0.5 1 1" width={size} height={size}>
      <defs>
        <radialGradient id="mini-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--accent-p)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="var(--accent-p)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="0" cy="0" r={Math.max(0.05, reach * 0.5)} fill="url(#mini-glow)" />
      {[0.22, 0.36, 0.48].map((r, i) => (
        <circle key={i} cx="0" cy="0" r={r} fill="none" stroke="var(--border)" strokeWidth="0.004" strokeDasharray={i === 0 ? '0' : '0.01 0.012'} />
      ))}
      <circle cx="0" cy="0" r="0.025" fill="var(--text-0)" />
      <circle cx="0" cy="0" r="0.04" fill="none" stroke="var(--text-0)" strokeWidth="0.004" opacity="0.4" />
      {stars.map((s, i) => {
        const x = Math.cos(s.angle) * s.r;
        const y = Math.sin(s.angle) * s.r;
        const inside = s.r <= reach * 0.5;
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={s.size}
            fill={inside ? 'var(--accent-p)' : 'var(--text-3)'}
            opacity={inside ? 0.9 : 0.35}
          />
        );
      })}
    </svg>
  );
}
