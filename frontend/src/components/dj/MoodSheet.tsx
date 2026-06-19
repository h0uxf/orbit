import type { Mood } from '@orbit/shared';
import { Stars } from '../atoms/Stars';
import { Sheet } from './Sheet';

interface MoodSheetProps {
  open: boolean;
  onClose: () => void;
  onPick: (mood: Mood) => void;
  moods: Mood[];
}

export function MoodSheet({ open, onClose, onPick, moods }: MoodSheetProps) {
  return (
    <Sheet open={open} onClose={onClose} title="Tune by feeling" height="62%" sub="I'll find a starting point and drift outward from there">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {moods.map((m) => (
          <button
            key={m.id}
            onClick={() => onPick(m)}
            style={{ padding: 0, borderRadius: 16, overflow: 'hidden', cursor: 'pointer', border: '1px solid var(--border)', background: 'var(--surf-1)', color: 'var(--text-0)', fontFamily: 'inherit', textAlign: 'left' }}
          >
            <div
              style={{
                height: 64, position: 'relative',
                background: `radial-gradient(ellipse at 35% 40%, oklch(0.55 0.18 ${m.hue}) 0%, transparent 65%), radial-gradient(ellipse at 75% 70%, oklch(0.4 0.16 ${(m.hue + 50) % 360}) 0%, transparent 70%), var(--bg-2)`,
              }}
            >
              <Stars count={14} seed={m.hue} opacity={0.6} />
            </div>
            <div style={{ padding: '10px 12px 12px' }}>
              <div className="t-body" style={{ fontSize: 13, color: 'var(--text-0)', lineHeight: 1.3 }}>{m.label}</div>
            </div>
          </button>
        ))}
      </div>
    </Sheet>
  );
}
