import { motion } from 'framer-motion';
import type { Persona, Station, Track } from '@orbit/shared';
import { modeForRadius, trackForRadius } from '@orbit/shared';
import { AlbumArt, Icon, Sparkline, formatLength } from '../atoms';
import { glassPanel, pillBtn } from '../shared/panelStyles';
import { DJAvatar } from '../dj/DJAvatar';
import { AlbumStack } from './AlbumStack';
import { ScrambleText } from './ScrambleText';
import { Stars } from '../atoms/Stars';

interface FullPlayerSheetProps {
  open: boolean;
  onClose: () => void;
  radius: number;
  setRadius: (v: number) => void;
  previewRadius: number | null;
  setPreviewRadius: (v: number | null) => void;
  track: Track;
  prevTrack: Track | null;
  isTuning: boolean;
  playing: boolean;
  onTogglePlay: () => void;
  progress: number;
  persona: Persona;
  onOpenChat: () => void;
  onNotForMe: (track: Track) => void;
  saved: string[];
  onToggleSave: (id: string) => void;
  presets: string[];
  onTogglePreset: (id: string) => void;
  stations: Station[];
}

export function FullPlayerSheet({
  open, onClose, radius, setRadius, previewRadius, setPreviewRadius,
  track, prevTrack, isTuning, playing, onTogglePlay, progress,
  persona, onOpenChat, onNotForMe, saved, onToggleSave, presets, onTogglePreset, stations,
}: FullPlayerSheetProps) {
  if (!open) return null;
  const mode = modeForRadius(radius);
  const isPreset = presets.includes(track.id);
  const elapsed = fmtTime(progress * (track.lengthMs / 1000));

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 65 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(7,6,14,0.6)', backdropFilter: 'blur(6px)' }} />
      <motion.div
        className="om-fullcol"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'absolute', left: 0, right: 0, bottom: 0, top: 0,
          display: 'flex', flexDirection: 'column',
          background: `radial-gradient(ellipse at 50% 18%, oklch(0.32 0.16 ${persona.hue}) 0%, transparent 55%), rgba(8,6,16,0.96)`,
          backdropFilter: 'blur(30px) saturate(160%)',
          WebkitBackdropFilter: 'blur(30px) saturate(160%)',
        }}
      >
        <Stars count={50} seed={track.seed} opacity={0.4} />

        <div style={{ position: 'relative', zIndex: 2, padding: '12px 22px 0' }}>
          <div className="row between">
            <button onClick={onClose} style={pillBtn()}>
              <Icon name="arrow" size={16} color="var(--text-1)" />
            </button>
            <div className="col" style={{ alignItems: 'center' }}>
              <div className="t-meta" style={{ fontSize: 8 }}>NOW PLAYING</div>
              <div className="t-mono" style={{ fontSize: 10, marginTop: 2, color: persona.accent }}>{track.freq} KHZ · {mode}</div>
            </div>
            <button
              onClick={() => onTogglePreset(track.id)}
              style={{ ...pillBtn(), color: isPreset ? 'var(--accent-m)' : 'var(--text-2)', borderColor: isPreset ? 'var(--border-strong)' : 'var(--border)' }}
              title="Pin as preset"
            >
              <Icon name={isPreset ? 'check' : 'plus'} size={15} />
            </button>
          </div>
        </div>

        <div style={{ position: 'relative', zIndex: 2, padding: '20px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <AlbumStack track={track} prevTrack={prevTrack} isTuning={isTuning} size="74%" />
        </div>

        <div style={{ position: 'relative', zIndex: 2, padding: '20px 24px 0', textAlign: 'center' }}>
          <ScrambleText text={track.title} isScrambling={isTuning} className="h-display" style={{ fontSize: 26, lineHeight: 1.1 }} />
          <div className="row gap-2" style={{ marginTop: 7, justifyContent: 'center', alignItems: 'center' }}>
            <ScrambleText text={track.artist} isScrambling={isTuning} className="t-mono" style={{ fontSize: 12, color: 'var(--text-1)' }} />
            <span style={{ color: 'var(--text-4)' }}>·</span>
            <span className="t-mono" style={{ fontSize: 10, color: 'var(--text-3)' }}>{track.genre}</span>
            {track.isNew && <span className="chip chip-glow" style={{ fontSize: 8, padding: '2px 7px' }}>FIRST LISTEN</span>}
          </div>
        </div>

        <div style={{ position: 'relative', zIndex: 2, padding: '18px 24px 0' }}>
          <div style={{ opacity: isTuning ? 0.3 : 1, transition: 'opacity 0.2s' }}>
            <Sparkline seed={track.seed} width={340} height={26} progress={progress} color="var(--accent-p)" />
          </div>
          <div className="row between" style={{ marginTop: 5 }}>
            <span className="t-mono" style={{ fontSize: 10 }}>{elapsed}</span>
            <span className="t-mono" style={{ fontSize: 10, color: 'var(--text-3)' }}>-{formatLength(track.lengthMs)}</span>
          </div>
        </div>

        <div style={{ position: 'relative', zIndex: 2, padding: '14px 24px 0' }}>
          <div className="row" style={{ justifyContent: 'space-around', alignItems: 'center' }}>
            <button onClick={() => onToggleSave(track.id)} style={ctlBtn(38)} title="Save">
              <Icon name="heart" size={18} color={saved.includes(track.id) ? 'var(--accent-m)' : 'var(--text-1)'} />
            </button>
            <button onClick={() => setRadius(Math.max(0, radius - 8))} style={ctlBtn(44)} title="Inward">
              <Icon name="back" size={18} strokeWidth={0} />
            </button>
            <button
              onClick={onTogglePlay}
              style={{
                width: 62, height: 62, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent-p), var(--accent-m))',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0a0814',
                boxShadow: '0 0 28px var(--glow-p), inset 0 0 0 1px rgba(255,255,255,0.2)',
              }}
            >
              <Icon name={playing ? 'pause' : 'play'} size={20} strokeWidth={0} />
            </button>
            <button onClick={() => setRadius(Math.min(100, radius + 8))} style={ctlBtn(44)} title="Outward">
              <Icon name="skip" size={18} strokeWidth={0} />
            </button>
            <button onClick={() => onNotForMe(track)} style={ctlBtn(38)} title="Not for me">
              <Icon name="close" size={16} />
            </button>
          </div>
          <div className="row" style={{ justifyContent: 'space-around', marginTop: 6 }}>
            {['save', 'inward', 'play / pause', 'outward', 'not for me'].map((l, i) => (
              <span key={i} className="t-mono" style={{ fontSize: 7, color: 'var(--text-4)', width: 56, textAlign: 'center' }}>{l}</span>
            ))}
          </div>
        </div>

        <div style={{ position: 'relative', zIndex: 2, padding: '16px 20px 0' }}>
          <FullSheetDial radius={radius} setRadius={setRadius} previewRadius={previewRadius} setPreviewRadius={setPreviewRadius} track={track} stations={stations} />
        </div>

        <div style={{ flex: 1 }} />

        <div style={{ position: 'relative', zIndex: 2, padding: '0 20px 22px' }}>
          <button
            onClick={onOpenChat}
            style={{ width: '100%', textAlign: 'left', padding: '11px 13px', ...glassPanel(), cursor: 'pointer', color: 'var(--text-0)', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 10 }}
          >
            <DJAvatar size={30} pulsing />
            <div className="col flex-1" style={{ minWidth: 0 }}>
              <div className="t-meta" style={{ fontSize: 8, color: persona.accent }}>{persona.name.toUpperCase()} · ON AIR</div>
              <div className="t-body" style={{ fontSize: 12, color: 'var(--text-1)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {whyShort(track)}
              </div>
            </div>
            <Icon name="chat" size={15} color="var(--text-3)" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function ctlBtn(size: number): React.CSSProperties {
  return {
    width: size, height: size, borderRadius: '50%',
    background: 'transparent', border: 'none', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-1)',
  };
}

function whyShort(track: Track): string {
  return [
    'Right at the center of your taste.',
    'One step out — same warmth, softer textures.',
    'A meaningful stretch. Trades guitar for piano.',
    'A real reach. Trust the first minute.',
    'Deep space — familiar in places.',
  ][track.ring];
}

function fmtTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

interface FullSheetDialProps {
  radius: number;
  setRadius: (v: number) => void;
  previewRadius: number | null;
  setPreviewRadius: (v: number | null) => void;
  track: Track;
  stations: Station[];
}

function FullSheetDial({ radius, setRadius, previewRadius, setPreviewRadius, track, stations }: FullSheetDialProps) {
  const val = previewRadius != null ? previewRadius : radius;
  const previewTrack = previewRadius != null ? trackForRadius(stations, previewRadius) : null;
  const showPreview = previewTrack && previewTrack.id !== track.id;
  return (
    <div style={{ ...glassPanel(true), padding: '11px 15px' }}>
      <div className="row between" style={{ marginBottom: 8, alignItems: 'baseline' }}>
        <span className="t-meta" style={{ color: 'var(--accent-p)' }}>TUNE</span>
        <span className="t-mono" style={{ fontSize: 12, color: 'var(--text-0)' }}>{showPreview ? `→ ${previewTrack!.artist}` : `${val}%`}</span>
      </div>
      <div style={{ position: 'relative', height: 12, marginBottom: 2 }}>
        {stations.map((s) => {
          const isCurrent = s.id === track.id;
          return (
            <div key={s.id} style={{ position: 'absolute', left: `${s.radius}%`, top: 0, transform: 'translateX(-50%)', pointerEvents: 'none' }}>
              <div style={{ width: isCurrent ? 2 : 1, height: isCurrent ? 12 : 6, background: isCurrent ? 'var(--accent-m)' : 'var(--text-4)', boxShadow: isCurrent ? '0 0 6px var(--glow-m)' : 'none' }} />
            </div>
          );
        })}
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={val}
        onChange={(e) => setPreviewRadius(parseInt(e.target.value, 10))}
        onMouseUp={(e) => { setRadius(parseInt((e.target as HTMLInputElement).value, 10)); setPreviewRadius(null); }}
        onTouchEnd={(e) => { setRadius(parseInt((e.target as HTMLInputElement).value, 10)); setPreviewRadius(null); }}
        className="radius-slider"
        style={{ '--val': `${val}%` } as React.CSSProperties}
      />
    </div>
  );
}
