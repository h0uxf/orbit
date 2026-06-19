import { AnimatePresence, motion } from 'framer-motion';
import type { Persona, Station } from '@orbit/shared';
import { ringLabel } from '@orbit/shared';
import { AlbumArt, Icon } from '../atoms';

interface StationSheetProps {
  station: Station | null;
  onClose: () => void;
  onTune: (s: Station) => void;
  onOpenChat: () => void;
  persona: Persona;
  saved: string[];
  onToggleSave: (id: string) => void;
  note: string | null;
}

export function StationSheet({ station, onClose, onTune, onOpenChat, persona, saved, onToggleSave, note }: StationSheetProps) {
  return (
    <AnimatePresence>
      {station && (
        <motion.div
          className="om-sheet"
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 24, opacity: 0 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          style={{
            position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 55,
            background: 'rgba(12,10,24,0.95)',
            backdropFilter: 'blur(24px) saturate(160%)',
            WebkitBackdropFilter: 'blur(24px) saturate(160%)',
            borderTop: '1px solid var(--border-strong)', borderTopLeftRadius: 28, borderTopRightRadius: 28,
            padding: '14px 22px 26px', boxShadow: '0 -20px 60px rgba(0,0,0,0.5)',
          }}
        >
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--text-3)', margin: '0 auto 14px' }} />
          <div className="row between" style={{ marginBottom: 14 }}>
            <div className="row gap-3">
              <AlbumArt seed={station.seed} size={56} radius={12} />
              <div className="col gap-2">
                <div className="row gap-2" style={{ alignItems: 'baseline' }}>
                  <span className="t-meta" style={{ color: 'var(--accent-p)', fontSize: 8 }}>{ringLabel(station.ring)}</span>
                  {station.isNew && <span className="chip chip-glow" style={{ fontSize: 8 }}>NEW</span>}
                </div>
                <div className="h-display" style={{ fontSize: 22 }}>{station.artist}</div>
                <div className="t-mono" style={{ fontSize: 10 }}>{station.freq} KHZ · {station.genre}</div>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'var(--surf-2)', border: '1px solid var(--border)',
                borderRadius: '50%', width: 30, height: 30, display: 'flex', alignItems: 'center',
                justifyContent: 'center', color: 'var(--text-1)', cursor: 'pointer', flexShrink: 0,
              }}
            >
              <Icon name="close" size={13} />
            </button>
          </div>

          <div
            style={{
              padding: '11px 13px', borderRadius: 14, marginBottom: 14,
              background: 'linear-gradient(135deg, rgba(167,139,250,0.12), rgba(232,121,249,0.06))',
              border: '1px solid var(--border)',
            }}
          >
            <div className="row gap-2" style={{ marginBottom: 6 }}>
              <Icon name="sparkle" size={11} color="var(--accent-m)" strokeWidth={2} />
              <span className="t-meta" style={{ color: 'var(--accent-m)', fontSize: 8 }}>{persona.name.toUpperCase()} · NOTE</span>
            </div>
            <div className="t-body" style={{ fontSize: 13 }}>{note ?? '…'}</div>
          </div>

          <div className="row gap-2">
            <button onClick={() => onToggleSave(station.id)} className="btn" style={{ padding: '11px 14px', fontSize: 13 }}>
              <Icon name="heart" size={14} color={saved.includes(station.id) ? 'var(--accent-m)' : 'currentColor'} />
            </button>
            <button onClick={onOpenChat} className="btn" style={{ flex: 1, padding: '11px 14px', fontSize: 13 }}>
              <Icon name="chat" size={14} /> Ask {persona.name}
            </button>
            <button onClick={() => onTune(station)} className="btn btn-primary" style={{ flex: 1.4, padding: '11px 14px', fontSize: 13 }}>
              <Icon name="play" size={11} strokeWidth={0} /> Tune in
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
