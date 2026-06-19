import type { Track } from '@orbit/shared';
import { AlbumArt, Icon } from '../atoms';
import { glassPanel } from '../shared/panelStyles';
import { ScrambleText } from './ScrambleText';
import { StaticOverlay } from './StaticOverlay';

interface MiniPlayerProps {
  track: Track;
  isTuning: boolean;
  playing: boolean;
  onTogglePlay: () => void;
  progress: number;
  onExpand: () => void;
}

export function MiniPlayer({ track, isTuning, playing, onTogglePlay, progress, onExpand }: MiniPlayerProps) {
  return (
    <button
      onClick={onExpand}
      style={{
        width: '100%',
        marginBottom: 12,
        ...glassPanel(true),
        padding: '8px 10px',
        display: 'flex',
        alignItems: 'center',
        gap: 11,
        cursor: 'pointer',
        color: 'var(--text-0)',
        fontFamily: 'inherit',
        textAlign: 'left',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: 2,
          width: `${progress * 100}%`,
          background: 'linear-gradient(to right, var(--accent-p), var(--accent-m))',
          transition: 'width 0.2s linear',
          opacity: 0.8,
        }}
      />
      <div style={{ width: 42, height: 42, borderRadius: 10, overflow: 'hidden', flexShrink: 0, border: '1px solid var(--border)', position: 'relative' }}>
        <AlbumArt seed={track.seed} size={42} radius={0} />
        {isTuning && <StaticOverlay />}
      </div>
      <div className="col flex-1" style={{ minWidth: 0 }}>
        <ScrambleText text={track.title} isScrambling={isTuning} className="t-mono" style={{ fontSize: 13, color: 'var(--text-0)', fontWeight: 500 }} />
        <div className="row gap-2" style={{ marginTop: 2, alignItems: 'center' }}>
          <span className="t-mono" style={{ fontSize: 9, color: 'var(--text-3)' }}>{track.freq} KHZ</span>
          <span style={{ color: 'var(--text-4)' }}>·</span>
          <span className="t-mono" style={{ fontSize: 9, color: 'var(--text-3)' }}>RING.{(track.ring + 1).toString().padStart(2, '0')}</span>
        </div>
      </div>
      <div className="eq" style={{ color: 'var(--accent-m)', marginRight: 4, opacity: playing && !isTuning ? 1 : 0.3 }}>
        <span /><span /><span /><span />
      </div>
      <div
        onClick={(e) => { e.stopPropagation(); onTogglePlay(); }}
        style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          flexShrink: 0,
          background: 'linear-gradient(135deg, var(--accent-p), var(--accent-m))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#0a0814',
        }}
      >
        <Icon name={playing ? 'pause' : 'play'} size={14} strokeWidth={0} />
      </div>
    </button>
  );
}
