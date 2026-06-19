import { useMemo } from 'react';
import { seeded } from './seeded';

interface AlbumArtProps {
  seed?: number;
  size?: number | string;
  radius?: number;
  label?: string;
}

export function AlbumArt({ seed = 1, size = 56, radius = 12, label = '' }: AlbumArtProps) {
  const grad = useMemo(() => {
    const r = seeded(seed * 31 + 7);
    const h1 = Math.floor(r() * 360);
    const h2 = (h1 + 30 + Math.floor(r() * 90)) % 360;
    const h3 = (h1 + 180 + Math.floor(r() * 60)) % 360;
    return { h1, h2, h3 };
  }, [seed]);
  const id = `g${seed}`;

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        overflow: 'hidden',
        position: 'relative',
        flexShrink: 0,
        border: '1px solid var(--border)',
      }}
    >
      <svg viewBox="0 0 100 100" width="100%" height="100%" preserveAspectRatio="none">
        <defs>
          <radialGradient id={`${id}a`} cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor={`oklch(0.78 0.15 ${grad.h1})`} />
            <stop offset="100%" stopColor={`oklch(0.35 0.12 ${grad.h2})`} />
          </radialGradient>
          <radialGradient id={`${id}b`} cx="75%" cy="75%" r="55%">
            <stop offset="0%" stopColor={`oklch(0.65 0.20 ${grad.h3})`} stopOpacity="0.85" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <rect width="100" height="100" fill={`url(#${id}a)`} />
        <rect width="100" height="100" fill={`url(#${id}b)`} />
        <g opacity="0.08">
          {Array.from({ length: 20 }).map((_, i) => (
            <line key={i} x1="0" y1={i * 5} x2="100" y2={i * 5} stroke="#000" strokeWidth="0.4" />
          ))}
        </g>
      </svg>
      {label && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'flex-end',
            padding: 6,
            fontFamily: 'var(--font-mono)',
            fontSize: 8,
            color: 'rgba(255,255,255,0.8)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
}
