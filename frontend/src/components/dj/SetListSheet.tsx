import type { Station, Track, TonightSet } from '@orbit/shared';
import { AlbumArt, formatLength } from '../atoms';
import { Sheet } from './Sheet';

interface SetListSheetProps {
  open: boolean;
  onClose: () => void;
  tonightSet: TonightSet;
  stations: Station[];
  activeSetStep: number;
  track: Track;
  onJump: (s: Station) => void;
}

export function SetListSheet({ open, onClose, tonightSet, stations, activeSetStep, track, onJump }: SetListSheetProps) {
  const list = tonightSet.trackIds.map((id) => stations.find((s) => s.id === id)).filter((s): s is Station => Boolean(s));
  return (
    <Sheet open={open} onClose={onClose} title={tonightSet.title} height="70%" sub={tonightSet.blurb}>
      <div style={{ position: 'relative', paddingLeft: 22, marginTop: 6 }}>
        <div style={{ position: 'absolute', left: 6, top: 10, bottom: 10, width: 1, background: 'linear-gradient(to bottom, var(--accent-p), var(--accent-m))', opacity: 0.5 }} />
        {list.map((s, i) => {
          const isCurrent = s.id === track.id;
          const done = i < activeSetStep;
          return (
            <button
              key={s.id}
              onClick={() => onJump(s)}
              style={{
                position: 'relative', display: 'flex', alignItems: 'center', gap: 12,
                padding: '8px 0', width: '100%', background: 'none', border: 'none',
                cursor: 'pointer', color: 'var(--text-0)', fontFamily: 'inherit', textAlign: 'left',
                opacity: done ? 0.55 : 1,
              }}
            >
              <div
                style={{
                  position: 'absolute', left: -22, top: '50%', transform: 'translateY(-50%)',
                  width: isCurrent ? 14 : 11, height: isCurrent ? 14 : 11, borderRadius: '50%',
                  background: done || isCurrent ? 'linear-gradient(135deg, var(--accent-p), var(--accent-m))' : 'var(--bg-0)',
                  border: done || isCurrent ? 'none' : '1px solid var(--border-strong)',
                  boxShadow: isCurrent ? '0 0 12px var(--glow-m)' : 'none',
                }}
              />
              <AlbumArt seed={s.seed} size={44} radius={9} />
              <div className="col flex-1" style={{ minWidth: 0 }}>
                <div className="t-mono" style={{ fontSize: 13, color: 'var(--text-0)', fontWeight: 500 }}>{s.title}</div>
                <div className="t-mono" style={{ fontSize: 10, marginTop: 3, color: 'var(--text-3)' }}>{s.artist} · ring {(s.ring + 1).toString().padStart(2, '0')}</div>
              </div>
              {isCurrent ? (
                <div className="eq" style={{ color: 'var(--accent-m)' }}><span /><span /><span /><span /></div>
              ) : (
                <span className="t-mono" style={{ fontSize: 10, color: 'var(--text-4)' }}>{formatLength(s.lengthMs)}</span>
              )}
            </button>
          );
        })}
      </div>
    </Sheet>
  );
}
