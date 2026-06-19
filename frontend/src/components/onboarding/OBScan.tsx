import { seeded } from '../atoms/seeded';

const PHASES = [
  { at: 0, label: 'Reading library' },
  { at: 20, label: 'Extracting sonic features' },
  { at: 50, label: 'Computing embeddings' },
  { at: 75, label: 'Clustering taste regions' },
  { at: 95, label: 'Drawing your orbit' },
];

export function OBScan({ pct }: { pct: number }) {
  const active = PHASES.filter((p) => pct >= p.at).slice(-1)[0] || PHASES[0];

  return (
    <div className="fade-in" style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', padding: '0 28px 32px', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'relative', width: 240, height: 240, marginBottom: 40 }}>
        <svg viewBox="-1 -1 2 2" width="100%" height="100%">
          <defs>
            <linearGradient id="scan-line" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--accent-p)" stopOpacity="0" />
              <stop offset="80%" stopColor="var(--accent-p)" stopOpacity="0.7" />
              <stop offset="100%" stopColor="var(--accent-m)" stopOpacity="1" />
            </linearGradient>
          </defs>
          {[0.3, 0.5, 0.7, 0.9].map((r, i) => (
            <circle key={i} cx="0" cy="0" r={r} fill="none" stroke="var(--border)" strokeWidth="0.005" />
          ))}
          <circle cx="0" cy="0" r="0.04" fill="var(--text-0)" />
          <g style={{ transformOrigin: 'center', animation: 'ring-rotate 2s linear infinite' }}>
            <path d="M 0 0 L 0.9 0 A 0.9 0.9 0 0 1 -0.2 0.88 Z" fill="url(#scan-line)" opacity="0.18" />
            <line x1="0" y1="0" x2="0.9" y2="0" stroke="var(--accent-m)" strokeWidth="0.01" />
          </g>
          {Array.from({ length: 24 }).map((_, i) => {
            const r = seeded(i + 1)();
            const a = r * Math.PI * 2;
            const d = 0.2 + r * 0.7;
            const visible = i / 24 < pct / 100;
            return <circle key={i} cx={Math.cos(a) * d} cy={Math.sin(a) * d} r={0.012 + r * 0.012} fill={visible ? 'var(--accent-p)' : 'var(--text-4)'} opacity={visible ? 0.9 : 0.3} />;
          })}
        </svg>
      </div>

      <div className="t-meta" style={{ marginBottom: 8 }}>Scanning your taste · {pct}%</div>
      <div style={{ width: '100%', height: 2, background: 'var(--surf-2)', borderRadius: 2, overflow: 'hidden', marginBottom: 16 }}>
        <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(to right, var(--accent-p), var(--accent-m))', transition: 'width 0.3s ease', boxShadow: '0 0 12px var(--glow-p)' }} />
      </div>
      <div className="t-mono" style={{ color: 'var(--text-1)', textAlign: 'center', minHeight: 16 }}>› {active.label}</div>
    </div>
  );
}
