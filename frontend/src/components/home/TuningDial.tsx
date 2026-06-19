import { useRef } from 'react';
import { trackForRadius, type Persona, type Station, type Track } from '@orbit/shared';
import { glassPanel } from '../shared/panelStyles';

interface TuningDialProps {
  radius: number;
  setRadius: (v: number) => void;
  previewRadius: number | null;
  setPreviewRadius: (v: number | null) => void;
  track: Track;
  mode: string;
  persona: Persona;
  stations: Station[];
}

export function TuningDial({ radius, setRadius, previewRadius, setPreviewRadius, track, mode, persona, stations }: TuningDialProps) {
  const trackRef = useRef<HTMLInputElement>(null);
  const previewTrack = previewRadius != null ? trackForRadius(stations, previewRadius) : null;
  const showPreview = previewRadius != null && previewTrack && previewTrack.id !== track.id;

  function commitTune(value: number) {
    setRadius(value);
    setPreviewRadius(null);
  }

  return (
    <div style={{ ...glassPanel(true), padding: '12px 16px 12px', marginBottom: 12 }}>
      <div className="row between" style={{ marginBottom: 9, alignItems: 'baseline' }}>
        <div className="row gap-2" style={{ alignItems: 'baseline' }}>
          <span className="t-meta" style={{ color: 'var(--accent-p)' }}>TUNING</span>
          <span className="t-mono" style={{ fontSize: 10, color: 'var(--text-3)' }}>· {mode.toLowerCase()}</span>
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 17, fontWeight: 500, color: 'var(--text-0)', textShadow: '0 0 14px var(--glow-p)' }}>
          {(previewRadius != null ? previewRadius : radius).toString().padStart(2, '0')}
          <span style={{ color: 'var(--text-3)', fontSize: 12 }}>%</span>
        </span>
      </div>

      <div style={{ position: 'relative', height: 16, marginBottom: 2 }}>
        {stations.map((s) => {
          const isCurrent = s.id === track.id;
          return (
            <div key={s.id} style={{ position: 'absolute', left: `${s.radius}%`, top: 0, transform: 'translateX(-50%)', pointerEvents: 'none' }}>
              <div
                style={{
                  width: isCurrent ? 2 : 1,
                  height: isCurrent ? 16 : s.ring === 0 ? 11 : s.ring < 3 ? 8 : 6,
                  background: isCurrent ? 'var(--accent-m)' : s.ring === 0 ? 'var(--text-2)' : s.ring < 3 ? 'var(--text-3)' : 'var(--text-4)',
                  boxShadow: isCurrent ? '0 0 8px var(--glow-m)' : 'none',
                  transition: 'all 0.3s',
                }}
              />
            </div>
          );
        })}
        {showPreview && previewTrack && (
          <div
            style={{
              position: 'absolute',
              bottom: 20,
              left: `${previewRadius}%`,
              transform: 'translateX(-50%)',
              padding: '6px 10px',
              borderRadius: 10,
              background: 'rgba(15,11,30,0.96)',
              border: '1px solid var(--border-strong)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.5), 0 0 20px rgba(232,121,249,0.2)',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              zIndex: 5,
              animation: 'fade-in 0.12s ease-out',
            }}
          >
            <div className="t-meta" style={{ fontSize: 7, color: 'var(--accent-m)' }}>TUNE TO</div>
            <div className="t-mono" style={{ fontSize: 11, color: 'var(--text-0)', marginTop: 1 }}>{previewTrack.artist}</div>
            <div
              style={{
                position: 'absolute',
                bottom: -4,
                left: '50%',
                transform: 'translateX(-50%) rotate(45deg)',
                width: 8,
                height: 8,
                background: 'rgba(15,11,30,0.96)',
                borderRight: '1px solid var(--border-strong)',
                borderBottom: '1px solid var(--border-strong)',
              }}
            />
          </div>
        )}
      </div>

      <input
        ref={trackRef}
        type="range"
        min="0"
        max="100"
        value={previewRadius != null ? previewRadius : radius}
        onChange={(e) => setPreviewRadius(parseInt(e.target.value, 10))}
        onMouseUp={(e) => commitTune(parseInt((e.target as HTMLInputElement).value, 10))}
        onTouchEnd={(e) => commitTune(parseInt((e.target as HTMLInputElement).value, 10))}
        className="radius-slider"
        style={{ '--val': `${previewRadius != null ? previewRadius : radius}%` } as React.CSSProperties}
      />

      <div className="row between" style={{ marginTop: 8 }}>
        {[{ l: 'STAY', val: 8 }, { l: 'DRIFT', val: 40 }, { l: 'EDGE', val: 68 }, { l: 'DEEP', val: 92 }].map((b) => {
          const active = mode.startsWith(b.l);
          return (
            <button
              key={b.l}
              onClick={() => setRadius(b.val)}
              style={{
                background: 'none',
                border: 'none',
                fontFamily: 'var(--font-mono)',
                fontSize: 9,
                fontWeight: active ? 600 : 400,
                letterSpacing: '0.12em',
                color: active ? 'var(--text-0)' : 'var(--text-3)',
                cursor: 'pointer',
                padding: 2,
              }}
            >
              {b.l}
            </button>
          );
        })}
      </div>
    </div>
  );
}
