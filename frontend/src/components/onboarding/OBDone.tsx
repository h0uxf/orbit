export function OBDone({ picks, onEnter }: { picks: string[]; onEnter: () => void }) {
  return (
    <div className="fade-in" style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', padding: '0 28px 32px', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'relative', width: 160, height: 160, marginBottom: 40 }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'radial-gradient(circle, var(--accent-p) 0%, transparent 70%)', opacity: 0.4, filter: 'blur(20px)' }} />
        <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ position: 'relative' }}>
          <circle cx="50" cy="50" r="40" fill="none" stroke="var(--accent-p)" strokeWidth="1" opacity="0.5" />
          <circle cx="50" cy="50" r="28" fill="none" stroke="var(--accent-m)" strokeWidth="0.8" opacity="0.5" />
          <circle cx="50" cy="50" r="6" fill="var(--text-0)" />
          <circle cx="50" cy="50" r="6" fill="none" stroke="var(--accent-p)" strokeWidth="0.5">
            <animate attributeName="r" from="6" to="40" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="1" to="0" dur="2s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>

      <div className="t-meta" style={{ marginBottom: 12 }}>orbit calibrated</div>
      <h1 className="h-display" style={{ fontSize: 30, textAlign: 'center', marginBottom: 14 }}>
        Your map<br />is ready.
      </h1>
      <p className="t-body" style={{ color: 'var(--text-2)', textAlign: 'center', maxWidth: 280, marginBottom: 32 }}>
        From your {picks.length || 3} picks we charted <span style={{ color: 'var(--text-0)' }}>247 stars</span> across <span style={{ color: 'var(--text-0)' }}>8 regions</span>. Begin where you're comfortable — drift outward when ready.
      </p>
      <button className="btn btn-primary" style={{ width: '100%' }} onClick={onEnter}>
        Enter orbit
      </button>
    </div>
  );
}
