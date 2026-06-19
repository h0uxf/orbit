import { trackForRadius } from '@orbit/shared';
import type { CourageState, Station } from '@orbit/shared';
import { glassPanel } from '../shared/panelStyles';

export function CourageGauge({ courage, radius, stations }: { courage: CourageState; radius: number; stations: Station[] }) {
  const curRing = trackForRadius(stations, radius).ring;
  const maxRing = Math.max(courage.maxRingSession, curRing);
  return (
    <div style={{ ...glassPanel(), padding: '9px 13px', display: 'flex', alignItems: 'center', gap: 12 }}>
      <div className="col" style={{ flexShrink: 0 }}>
        <div className="t-meta" style={{ fontSize: 8, color: 'var(--accent-m)' }}>COURAGE</div>
        <div className="t-mono" style={{ fontSize: 10, color: 'var(--text-0)', marginTop: 2 }}>
          ring {(maxRing + 1).toString().padStart(2, '0')}
        </div>
      </div>
      <div className="row gap-2" style={{ flex: 1, justifyContent: 'center' }}>
        {[0, 1, 2, 3, 4].map((r) => {
          const reached = r <= maxRing;
          const current = r === curRing;
          return (
            <div key={r} style={{ position: 'relative' }}>
              <div
                style={{
                  width: current ? 9 : 7,
                  height: current ? 9 : 7,
                  borderRadius: '50%',
                  background: reached ? 'linear-gradient(135deg, var(--accent-p), var(--accent-m))' : 'var(--surf-strong)',
                  border: current ? '1.5px solid var(--text-0)' : '1px solid var(--border)',
                  boxShadow: reached ? '0 0 8px var(--glow-p)' : 'none',
                  transition: 'all 0.3s',
                }}
              />
            </div>
          );
        })}
      </div>
      <div className="t-mono" style={{ fontSize: 8, color: 'var(--text-3)', flexShrink: 0, textAlign: 'right', lineHeight: 1.3 }}>
        longest<br />in {courage.streakDays}d
      </div>
    </div>
  );
}
