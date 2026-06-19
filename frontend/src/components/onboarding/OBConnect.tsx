import { Icon } from '../atoms';
import { API_BASE } from '../../lib/api';

export function OBConnect({ onBack }: { onBack: () => void }) {
  return (
    <div className="fade-in" style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', padding: '0 28px 32px' }}>
      <button
        onClick={onBack}
        style={{ background: 'none', border: 'none', color: 'var(--text-2)', display: 'flex', alignItems: 'center', gap: 6, padding: '8px 0', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase' }}
      >
        <Icon name="arrowback" size={14} /> back
      </button>
      <div className="t-meta mt-6">step 02 / 04</div>
      <h1 className="h-display mt-3" style={{ fontSize: 30 }}>
        Connect your<br />music universe.
      </h1>
      <p className="t-body" style={{ color: 'var(--text-2)', marginTop: 10, marginBottom: 24 }}>
        Orbit maps your taste from your real Spotify listening history — your top artists and tracks. We never post or modify your library.
      </p>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div
          className="float-y"
          style={{
            width: 100, height: 100, borderRadius: '50%',
            background: 'radial-gradient(circle, oklch(0.62 0.18 142), oklch(0.32 0.12 142))',
            border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Icon name="wave" size={36} color="#fff" />
        </div>
      </div>
      <a
        href={`${API_BASE}/api/auth/login`}
        className="btn btn-primary"
        style={{ width: '100%', textDecoration: 'none' }}
      >
        Continue with Spotify <Icon name="arrow" size={16} />
      </a>
    </div>
  );
}
