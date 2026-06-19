import type { CourageState, Persona, Station, TonightSet, Track } from '@orbit/shared';
import { modeForRadius } from '@orbit/shared';
import { Icon } from '../atoms';
import { HomeMapCanvas } from '../map/HomeMapCanvas';
import { MiniPlayer } from '../player/MiniPlayer';
import { glassPanel, pillBtn } from '../shared/panelStyles';
import { CourageGauge } from './CourageGauge';
import { TuningDial } from './TuningDial';

interface OrbitHomeProps {
  radius: number;
  setRadius: (v: number) => void;
  previewRadius: number | null;
  setPreviewRadius: (v: number | null) => void;
  track: Track;
  isTuning: boolean;
  persona: Persona;
  courage: CourageState;
  stations: Station[];
  tonightSet: TonightSet;
  activeSetStep: number;
  onSelectStation: (s: Station) => void;
  onOpenSettings: () => void;
  onOpenMood: () => void;
  onOpenSet: () => void;
  presets: string[];
  playing: boolean;
  onTogglePlay: () => void;
  progress: number;
  onExpandPlayer: () => void;
}

export function OrbitHome({
  radius, setRadius, previewRadius, setPreviewRadius,
  track, isTuning, persona, courage, stations, tonightSet, activeSetStep,
  onSelectStation, onOpenSettings, onOpenMood, onOpenSet,
  presets, playing, onTogglePlay, progress, onExpandPlayer,
}: OrbitHomeProps) {
  const mode = modeForRadius(radius);
  const reachedStations = stations.filter((s) => s.radius <= radius + 4).length;

  return (
    <div className="content" style={{ padding: 0, position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <HomeMapCanvas
          radius={radius}
          previewRadius={previewRadius}
          track={track}
          isTuning={isTuning}
          stations={stations}
          tonightSet={tonightSet}
          onSelectStation={onSelectStation}
        />
      </div>

      <div style={{ position: 'relative', zIndex: 3, padding: '8px 22px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div className="col">
          <div className="t-mono" style={{ fontSize: 10, color: persona.accent, letterSpacing: '0.15em' }}>ORBIT · LATE HOURS</div>
          <div className="t-mono" style={{ fontSize: 9, marginTop: 3, color: 'var(--text-3)' }}>{reachedStations}/{stations.length} stations in reach</div>
        </div>
        <button onClick={onOpenSettings} style={pillBtn()}>
          <Icon name="settings" size={15} />
        </button>
      </div>

      <div className="oh-courage-wrap" style={{ position: 'relative', zIndex: 3, padding: '12px 18px 0' }}>
        <CourageGauge courage={courage} radius={radius} stations={stations} />
      </div>

      <div style={{ flex: 1 }} />

      <div className="oh-controls" style={{ position: 'relative', zIndex: 3, padding: '0 16px' }}>
        <div className="row gap-2" style={{ marginBottom: 10 }}>
          <button
            onClick={onOpenSet}
            style={{ ...glassPanel(), flex: 1, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left', cursor: 'pointer', color: 'var(--text-0)', fontFamily: 'inherit' }}
          >
            <div
              style={{
                width: 30, height: 30, borderRadius: 9, flexShrink: 0,
                background: 'linear-gradient(135deg, var(--accent-p), var(--accent-m))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Icon name="queue" size={15} color="#0a0814" strokeWidth={2} />
            </div>
            <div className="col" style={{ minWidth: 0 }}>
              <div className="t-meta" style={{ fontSize: 8, color: 'var(--accent-p)' }}>TONIGHT'S SET</div>
              <div className="t-mono" style={{ fontSize: 11, color: 'var(--text-0)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {activeSetStep + 1}/{tonightSet.trackIds.length} · soft departure
              </div>
            </div>
          </button>
          <button
            onClick={onOpenMood}
            style={{ ...glassPanel(), width: 46, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-1)' }}
          >
            <Icon name="wave" size={18} />
          </button>
        </div>

        {presets.length > 0 && (
          <div style={{ display: 'flex', gap: 6, marginBottom: 10, overflowX: 'auto', scrollbarWidth: 'none' }}>
            {presets.map((pid) => {
              const st = stations.find((s) => s.id === pid);
              if (!st) return null;
              const active = st.id === track.id;
              return (
                <button
                  key={pid}
                  onClick={() => setRadius(st.radius)}
                  style={{
                    flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6,
                    padding: '6px 10px', borderRadius: 999,
                    background: active ? 'linear-gradient(135deg, var(--accent-p), var(--accent-m))' : 'rgba(20,16,40,0.6)',
                    border: active ? 'none' : '1px solid var(--border)',
                    cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 10,
                    color: active ? '#0a0814' : 'var(--text-2)',
                  }}
                >
                  <span style={{ fontWeight: 600 }}>{st.freq}</span>
                  <span style={{ opacity: 0.7, maxWidth: 70, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{st.artist}</span>
                </button>
              );
            })}
          </div>
        )}

        <TuningDial
          radius={radius} setRadius={setRadius}
          previewRadius={previewRadius} setPreviewRadius={setPreviewRadius}
          track={track} mode={mode} persona={persona} stations={stations}
        />

        <MiniPlayer track={track} isTuning={isTuning} playing={playing} onTogglePlay={onTogglePlay} progress={progress} onExpand={onExpandPlayer} />
      </div>
    </div>
  );
}
