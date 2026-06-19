import { useMemo } from 'react';
import { seeded } from './seeded';

interface SparklineProps {
  seed?: number;
  width?: number;
  height?: number;
  color?: string;
  progress?: number;
}

export function Sparkline({ seed = 3, width = 200, height = 32, color = 'currentColor', progress = 0.4 }: SparklineProps) {
  const bars = useMemo(() => {
    const r = seeded(seed);
    return Array.from({ length: 64 }, () => 0.15 + r() * 0.85);
  }, [seed]);
  const barW = width / bars.length;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {bars.map((b, i) => {
        const h = b * height;
        const x = i * barW;
        const y = (height - h) / 2;
        const past = i / bars.length < progress;
        return <rect key={i} x={x + 0.4} y={y} width={Math.max(1, barW - 1)} height={h} rx="1" fill={color} opacity={past ? 0.9 : 0.28} />;
      })}
    </svg>
  );
}
