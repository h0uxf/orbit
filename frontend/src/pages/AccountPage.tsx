import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon, Stars, Wordmark } from '../components/atoms';
import { api } from '../lib/api';
import { useAuth } from '../lib/useAuth';

export function AccountPage() {
  const { user, checked } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  async function logout() {
    setLoggingOut(true);
    await api.post('/api/auth/logout');
    window.location.href = '/login';
  }

  if (!checked) return null;

  return (
    <div className="stage">
      <Stars className="stage-stars" count={140} seed={2} opacity={0.5} />
      <div className="phone">
        <div className="screen" style={{ padding: '0 28px', display: 'flex', flexDirection: 'column' }}>
          <div className="row between" style={{ padding: '20px 0' }}>
            <button
              onClick={() => navigate('/')}
              style={{ background: 'none', border: 'none', color: 'var(--text-1)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase' }}
            >
              <Icon name="arrowback" size={16} /> back
            </button>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <Wordmark size={28} />
            {user ? (
              <>
                <div className="h-display" style={{ fontSize: 24, marginTop: 24 }}>{user.displayName}</div>
                <div className="t-mono" style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 6 }}>{user.email}</div>
              </>
            ) : (
              <div className="t-body" style={{ color: 'var(--text-2)', marginTop: 16 }}>Not signed in.</div>
            )}
          </div>

          <button onClick={logout} disabled={loggingOut} className="btn" style={{ width: '100%', marginBottom: 28, opacity: loggingOut ? 0.6 : 1 }}>
            {loggingOut ? 'Logging out…' : 'Log out'}
          </button>
        </div>
      </div>
    </div>
  );
}
