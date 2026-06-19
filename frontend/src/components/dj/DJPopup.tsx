import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon } from '../atoms';
import { DJAvatar } from './DJAvatar';

export interface DjPopupData {
  text: string;
  label?: string;
  duration?: number;
  action?: { label: string; onClick: () => void };
}

interface DJPopupProps {
  popup: DjPopupData | null;
  onDismiss: () => void;
  onOpenChat?: () => void;
}

export function DJPopup({ popup, onDismiss, onOpenChat }: DJPopupProps) {
  useEffect(() => {
    if (!popup) return;
    const id = setTimeout(onDismiss, popup.duration || 6000);
    return () => clearTimeout(id);
  }, [popup, onDismiss]);

  return (
    <AnimatePresence>
      {popup && (
        <motion.div
          onClick={() => { onDismiss(); onOpenChat?.(); }}
          className="om-popup"
          initial={{ opacity: 0, y: -12, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.97 }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'absolute', top: 12, left: 12, right: 12,
            padding: '10px 12px 10px 10px',
            background: 'rgba(15,11,30,0.92)',
            backdropFilter: 'blur(24px) saturate(160%)',
            WebkitBackdropFilter: 'blur(24px) saturate(160%)',
            border: '1px solid var(--border-strong)',
            borderRadius: 16,
            zIndex: 60,
            boxShadow: '0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(167,139,250,0.18), 0 0 40px rgba(167,139,250,0.18)',
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <DJAvatar size={36} pulsing />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.14em', color: 'var(--accent-m)', textTransform: 'uppercase' }}>
                  {popup.label || 'YOUR DJ'}
                </span>
                <span style={{ color: 'var(--text-4)' }}>·</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>ON AIR</span>
              </div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, lineHeight: 1.4, color: 'var(--text-0)' }}>{popup.text}</div>
              {popup.action && (
                <button
                  onClick={(e) => { e.stopPropagation(); popup.action!.onClick(); onDismiss(); }}
                  style={{
                    marginTop: 9, padding: '7px 14px', borderRadius: 999,
                    background: 'linear-gradient(135deg, var(--accent-p), var(--accent-m))',
                    border: 'none', color: '#0a0814', cursor: 'pointer',
                    fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 600,
                  }}
                >
                  {popup.action.label}
                </button>
              )}
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onDismiss(); }}
              style={{
                background: 'var(--surf-1)', border: '1px solid var(--border)',
                borderRadius: '50%', width: 22, height: 22,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--text-2)', cursor: 'pointer', flexShrink: 0,
              }}
            >
              <Icon name="close" size={11} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
