import { useState } from 'react';
import { Icon } from '../atoms';

interface Provider {
  id: string;
  name: string;
  sub: string;
  hue: number;
}

const PROVIDERS: Provider[] = [
  { id: 'streamA', name: 'Streaming service', sub: '8,420 songs · 12 playlists', hue: 142 },
  { id: 'streamB', name: 'Music library', sub: 'iCloud, local files', hue: 200 },
  { id: 'manual', name: 'Manual setup', sub: 'List 5 artists to begin', hue: 280 },
];

export function OBConnect({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [provider, setProvider] = useState<string | null>(null);

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
        We need a starting point to map your orbit. Nothing leaves your device unencrypted.
      </p>
      <div className="col gap-3" style={{ flex: 1 }}>
        {PROVIDERS.map((p) => (
          <button
            key={p.id}
            onClick={() => setProvider(p.id)}
            className="card"
            style={{
              padding: '16px 18px', cursor: 'pointer',
              borderColor: provider === p.id ? 'var(--accent-p)' : 'var(--border)',
              background: provider === p.id ? 'linear-gradient(135deg, var(--surf-strong), var(--surf-2))' : 'linear-gradient(180deg, var(--surf-2), var(--surf-1))',
              transition: 'all 0.18s', textAlign: 'left', color: 'var(--text-0)', fontFamily: 'inherit',
            }}
          >
            <div className="row gap-3">
              <div
                style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: `radial-gradient(circle, oklch(0.6 0.18 ${p.hue}), oklch(0.35 0.12 ${p.hue}))`,
                  border: '1px solid var(--border)', flexShrink: 0, position: 'relative',
                }}
              >
                {provider === p.id && (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                    <Icon name="check" size={20} />
                  </div>
                )}
              </div>
              <div className="col flex-1">
                <div className="h-card" style={{ fontSize: 16 }}>{p.name}</div>
                <div className="t-mono" style={{ fontSize: 10, marginTop: 2 }}>{p.sub}</div>
              </div>
              <Icon name="arrow" size={16} color="var(--text-3)" />
            </div>
          </button>
        ))}
      </div>
      <button className="btn btn-primary" disabled={!provider} style={{ width: '100%', marginTop: 16, opacity: provider ? 1 : 0.4 }} onClick={onNext}>
        Continue
      </button>
    </div>
  );
}
