import type { Track } from '@orbit/shared';
import { AlbumArt } from '../atoms/AlbumArt';
import { StaticOverlay } from './StaticOverlay';

interface AlbumStackProps {
  track: Track;
  prevTrack: Track | null;
  isTuning: boolean;
  size?: string;
}

export function AlbumStack({ track, prevTrack, isTuning, size = '64%' }: AlbumStackProps) {
  return (
    <div style={{ position: 'relative', width: size, aspectRatio: 1, maxWidth: 260 }}>
      <div
        style={{
          position: 'absolute',
          inset: '-14%',
          background: 'radial-gradient(circle, var(--glow-p) 0%, transparent 60%)',
          opacity: 0.45,
          filter: 'blur(24px)',
        }}
      />
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          borderRadius: 20,
          overflow: 'hidden',
          border: '1px solid var(--border-strong)',
          boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
        }}
      >
        {prevTrack && (
          <div key={`prev-${prevTrack.id}`} style={{ position: 'absolute', inset: 0, opacity: isTuning ? 0.3 : 0, transition: 'opacity 0.5s ease' }}>
            <AlbumArt seed={prevTrack.seed} size="100%" radius={0} />
          </div>
        )}
        <div
          key={`cur-${track.id}`}
          style={{ position: 'absolute', inset: 0, opacity: isTuning ? 0.6 : 1, transition: 'opacity 0.5s ease', animation: !isTuning ? 'fade-in 0.5s ease-out' : undefined }}
        >
          <AlbumArt seed={track.seed} size="100%" radius={0} />
        </div>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: 'repeating-radial-gradient(circle at 50% 50%, transparent 0, transparent 6px, rgba(0,0,0,0.06) 6px, rgba(0,0,0,0.06) 7px)',
          }}
        />
        {isTuning && <StaticOverlay />}
      </div>
    </div>
  );
}
