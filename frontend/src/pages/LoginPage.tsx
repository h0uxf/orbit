import { Stars, Wordmark } from '../components/atoms';
import { API_BASE } from '../lib/api';

export function LoginPage() {
  return (
    <div className="stage">
      <Stars className="stage-stars" count={140} seed={2} opacity={0.5} />
      <div className="phone">
        <div
          className="screen"
          style={{ alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 28px' }}
        >
          <div style={{ marginBottom: 24 }}>
            <Wordmark size={32} />
          </div>
          <h1 className="h-display" style={{ fontSize: 32, marginBottom: 14 }}>
            Music discovery,<br />
            <span style={{ color: 'var(--accent-m)', fontStyle: 'italic' }}>at your pace.</span>
          </h1>
          <p className="t-body" style={{ color: 'var(--text-2)', marginBottom: 28, maxWidth: 320 }}>
            Sign in with Spotify to map your comfort zone and start drifting outward.
          </p>
          <a href={`${API_BASE}/api/auth/login`} className="btn btn-primary" style={{ width: '100%', maxWidth: 320, textDecoration: 'none' }}>
            Continue with Spotify
          </a>
        </div>
      </div>
    </div>
  );
}
