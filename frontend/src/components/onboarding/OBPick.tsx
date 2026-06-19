import { useEffect, useState } from 'react';
import type { TopArtist } from '@orbit/shared';
import { Icon } from '../atoms';
import { api } from '../../lib/api';

interface OBPickProps {
  picks: string[];
  setPicks: (picks: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export function OBPick({ picks, setPicks, onNext, onBack }: OBPickProps) {
  const [artists, setArtists] = useState<TopArtist[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    api.get<{ artists: TopArtist[] }>('/api/me/top-artists')
      .then((res) => setArtists(res.artists))
      .catch(() => setError(true));
  }, []);

  const toggle = (id: string) => setPicks(picks.includes(id) ? picks.filter((x) => x !== id) : [...picks, id]);

  const noHistory = artists !== null && artists.length === 0;
  const minPicks = artists ? Math.min(3, artists.length) : 3;
  const enough = picks.length >= minPicks;
  const canSkip = error || noHistory;
  const canProceed = enough || canSkip;

  return (
    <div className="fade-in" style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', padding: '0 28px 28px' }}>
      <button
        onClick={onBack}
        style={{ background: 'none', border: 'none', color: 'var(--text-2)', display: 'flex', alignItems: 'center', gap: 6, padding: '8px 0', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase' }}
      >
        <Icon name="arrowback" size={14} /> back
      </button>
      <div className="t-meta mt-3">step 03 / 04</div>
      <h1 className="h-display mt-3" style={{ fontSize: 28 }}>
        Pick a few you<br />already love.
      </h1>
      <p className="t-body" style={{ color: 'var(--text-2)', marginTop: 10, marginBottom: 16 }}>
        Pulled from your Spotify listening history. Choose at least three — everything else grows outward from here.
      </p>
      <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none' }}>
        {artists === null && !error && (
          <div className="t-mono" style={{ color: 'var(--text-3)', textAlign: 'center', marginTop: 40 }}>reading your library…</div>
        )}
        {error && (
          <div className="t-body" style={{ color: 'var(--text-2)', textAlign: 'center', marginTop: 40 }}>
            Couldn't reach Spotify. You can skip this step — Orbit will learn as you go.
          </div>
        )}
        {noHistory && (
          <div className="t-body" style={{ color: 'var(--text-2)', textAlign: 'center', marginTop: 40 }}>
            Not enough Spotify listening history yet. Skip ahead — Orbit will learn as you go.
          </div>
        )}
        {artists && artists.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {artists.map((a) => {
              const on = picks.includes(a.id);
              return (
                <button
                  key={a.id}
                  onClick={() => toggle(a.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                    borderRadius: 14, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
                    border: on ? '1px solid var(--accent-p)' : '1px solid var(--border)',
                    background: on ? 'linear-gradient(135deg, var(--surf-strong), var(--surf-1))' : 'var(--surf-1)',
                    color: 'var(--text-0)',
                  }}
                >
                  <div
                    style={{
                      width: 30, height: 30, borderRadius: '50%', flexShrink: 0, position: 'relative', overflow: 'hidden',
                      background: a.imageUrl ? 'var(--surf-2)' : 'linear-gradient(135deg, var(--accent-p), var(--accent-m))',
                      border: '1px solid var(--border)',
                    }}
                  >
                    {a.imageUrl && (
                      <img src={a.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    )}
                    {on && (
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', background: 'rgba(0,0,0,0.35)' }}>
                        <Icon name="check" size={14} />
                      </div>
                    )}
                  </div>
                  <span className="t-mono" style={{ fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.name}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
      <button className="btn btn-primary" disabled={!canProceed} style={{ width: '100%', marginTop: 14, opacity: canProceed ? 1 : 0.4 }} onClick={onNext}>
        {canSkip ? 'Skip for now' : enough ? `Map my orbit · ${picks.length} picked` : `Pick ${minPicks - picks.length} more`}
      </button>
    </div>
  );
}
