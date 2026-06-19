import { useNavigate } from 'react-router-dom';
import { Icon } from '../atoms';

export function OBWelcome({ onNext }: { onNext: () => void }) {
  const navigate = useNavigate();
  return (
    <div className="fade-in" style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', padding: '0 28px 32px' }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'relative', width: 220, height: 220 }} className="float-y">
          <svg viewBox="-1 -1 2 2" width="100%" height="100%">
            <defs>
              <radialGradient id="ob-core" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="var(--accent-p)" stopOpacity="0.8" />
                <stop offset="40%" stopColor="var(--accent-m)" stopOpacity="0.4" />
                <stop offset="100%" stopColor="var(--accent-m)" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="0" cy="0" r="1" fill="url(#ob-core)" />
            {[0.35, 0.55, 0.75, 0.92].map((r, i) => (
              <circle key={i} cx="0" cy="0" r={r} fill="none" stroke="var(--border-strong)" strokeWidth="0.006" strokeDasharray={i % 2 ? '0.015 0.02' : '0'} opacity={0.7 - i * 0.12} />
            ))}
            <circle cx="0" cy="0" r="0.05" fill="var(--text-0)" />
            <g style={{ transformOrigin: 'center', animation: 'ring-rotate 30s linear infinite' }}>
              <circle cx="0.55" cy="0" r="0.028" fill="var(--accent-m)" style={{ filter: 'drop-shadow(0 0 0.02px var(--accent-m))' }} />
            </g>
            <g style={{ transformOrigin: 'center', animation: 'ring-rotate 50s linear infinite reverse' }}>
              <circle cx="-0.75" cy="0.1" r="0.022" fill="var(--accent-p)" />
            </g>
            <g style={{ transformOrigin: 'center', animation: 'ring-rotate 80s linear infinite' }}>
              <circle cx="0.35" cy="-0.2" r="0.018" fill="#fff" opacity="0.8" />
            </g>
          </svg>
        </div>
      </div>
      <div style={{ paddingBottom: 8 }}>
        <div className="t-meta" style={{ marginBottom: 14 }}>v1.0 — preview</div>
        <h1 className="h-display" style={{ fontSize: 40, marginBottom: 14 }}>
          Music discovery,<br />
          <span style={{ color: 'var(--accent-m)', fontStyle: 'italic' }}>at your pace.</span>
        </h1>
        <p className="t-body" style={{ color: 'var(--text-2)', marginBottom: 24, maxWidth: 320 }}>
          Orbit grows your taste outward — one familiar step at a time. No shuffled feeds. No genre cliffs.
        </p>
        <button className="btn btn-primary" style={{ width: '100%' }} onClick={onNext}>
          Begin <Icon name="arrow" size={16} />
        </button>
        <button className="btn btn-ghost" style={{ width: '100%', marginTop: 8 }} onClick={() => navigate('/login')}>
          I already have an account
        </button>
      </div>
    </div>
  );
}
