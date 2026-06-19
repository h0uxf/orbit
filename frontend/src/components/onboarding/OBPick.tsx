import { useState } from 'react';
import { Icon } from '../atoms';

interface SeedArtist {
  name: string;
  hue: number;
}

const SEED_ARTISTS: SeedArtist[] = [
  { name: 'Lumen Hollow', hue: 280 }, { name: 'Saintwave', hue: 260 },
  { name: 'Vatra', hue: 40 }, { name: 'Glasshouse', hue: 220 },
  { name: 'Quiet Tide', hue: 300 }, { name: 'North Mirror', hue: 200 },
  { name: 'Mira Tashi', hue: 50 }, { name: 'Solenne', hue: 330 },
  { name: 'Cobalt Hours', hue: 250 }, { name: 'Cinema 8', hue: 190 },
  { name: 'Ash & Halo', hue: 320 }, { name: 'Mossroom', hue: 150 },
];

interface OBPickProps {
  picks: string[];
  setPicks: (picks: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export function OBPick({ picks, setPicks, onNext, onBack }: OBPickProps) {
  const toggle = (name: string) => setPicks(picks.includes(name) ? picks.filter((x) => x !== name) : [...picks, name]);
  const enough = picks.length >= 3;

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
        These become the center of your orbit. Choose at least three — everything else grows outward from here.
      </p>
      <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {SEED_ARTISTS.map((a) => {
            const on = picks.includes(a.name);
            return (
              <button
                key={a.name}
                onClick={() => toggle(a.name)}
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
                    width: 30, height: 30, borderRadius: '50%', flexShrink: 0, position: 'relative',
                    background: `radial-gradient(circle at 35% 35%, oklch(0.7 0.16 ${a.hue}), oklch(0.34 0.12 ${a.hue}))`,
                    border: '1px solid var(--border)',
                  }}
                >
                  {on && (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                      <Icon name="check" size={14} />
                    </div>
                  )}
                </div>
                <span className="t-mono" style={{ fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.name}</span>
              </button>
            );
          })}
        </div>
      </div>
      <button className="btn btn-primary" disabled={!enough} style={{ width: '100%', marginTop: 14, opacity: enough ? 1 : 0.4 }} onClick={onNext}>
        {enough ? `Map my orbit · ${picks.length} picked` : `Pick ${3 - picks.length} more`}
      </button>
    </div>
  );
}
