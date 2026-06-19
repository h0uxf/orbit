import type { Track } from '@orbit/shared';
import { AlbumArt } from './AlbumArt';
import { Icon } from './Icon';

interface TrackRowProps {
  track: Track;
  onPlay: () => void;
  showRing?: boolean;
  compact?: boolean;
}

export function TrackRow({ track, onPlay, showRing = true, compact = false }: TrackRowProps) {
  const ringLabel = ['core', 'near', 'mid', 'far', 'deep'][track.ring];
  return (
    <button
      onClick={onPlay}
      className="row gap-3"
      style={{
        background: 'var(--surf-1)',
        border: '1px solid var(--border)',
        borderRadius: 14,
        padding: compact ? 10 : 12,
        cursor: 'pointer',
        color: 'var(--text-0)',
        fontFamily: 'inherit',
        textAlign: 'left',
        width: '100%',
      }}
    >
      <AlbumArt seed={track.seed} size={compact ? 42 : 52} radius={10} />
      <div className="col flex-1" style={{ minWidth: 0 }}>
        <div className="row gap-2" style={{ alignItems: 'baseline' }}>
          <div className="h-card" style={{ fontSize: compact ? 14 : 15, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {track.title}
          </div>
          {track.isNew && <div className="dot" style={{ width: 4, height: 4, flexShrink: 0 }} />}
        </div>
        <div className="row gap-2" style={{ marginTop: 4 }}>
          <span className="t-mono" style={{ fontSize: 10 }}>{track.artist}</span>
          {showRing && (
            <>
              <span style={{ color: 'var(--text-4)' }}>·</span>
              <span className="t-mono" style={{ fontSize: 10, color: track.ring > 1 ? 'var(--accent-m)' : 'var(--text-3)' }}>
                {ringLabel}
              </span>
            </>
          )}
        </div>
      </div>
      <div className="col" style={{ alignItems: 'flex-end', gap: 6 }}>
        <span className="t-mono" style={{ fontSize: 10 }}>{formatLength(track.lengthMs)}</span>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            border: '1px solid var(--border-strong)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-0)',
          }}
        >
          <Icon name="play" size={11} strokeWidth={0} />
        </div>
      </div>
    </button>
  );
}

export function formatLength(ms: number): string {
  const totalSec = Math.round(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}
