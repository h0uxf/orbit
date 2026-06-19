import { useMemo } from 'react';
import { seeded } from './seeded';

interface StarsProps {
  count?: number;
  seed?: number;
  opacity?: number;
  className?: string;
}

export function Stars({ count = 80, seed = 7, opacity = 0.8, className = '' }: StarsProps) {
  const stars = useMemo(() => {
    const r = seeded(seed);
    return Array.from({ length: count }, () => {
      const size = r() * 1.6 + 0.3;
      return {
        x: r() * 100,
        y: r() * 100,
        s: size,
        op: r() * 0.7 + 0.2,
        blink: r() > 0.85,
        delay: r() * 3,
        hue: r() > 0.85 ? 'm' : r() > 0.6 ? 'p' : 'w',
      };
    });
  }, [count, seed]);

  return (
    <svg className={className} viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height: '100%', opacity }}>
      {stars.map((s, i) => (
        <circle
          key={i}
          cx={s.x}
          cy={s.y}
          r={s.s * 0.15}
          fill={s.hue === 'm' ? 'var(--accent-m)' : s.hue === 'p' ? 'var(--accent-p)' : '#fff'}
          opacity={s.op}
          style={s.blink ? { animation: 'blink 2.6s ease-in-out infinite', animationDelay: `${s.delay}s` } : undefined}
        />
      ))}
    </svg>
  );
}
