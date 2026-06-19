import type { ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon } from '../atoms';

interface SheetProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  height?: string;
  title?: string;
  sub?: string;
}

export function Sheet({ open, onClose, children, height = '64%', title, sub }: SheetProps) {
  return (
    <AnimatePresence>
      {open && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 70 }}>
          <motion.div
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'absolute', inset: 0, background: 'rgba(7,6,14,0.7)', backdropFilter: 'blur(8px)' }}
          />
          <motion.div
            className="om-sheet"
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'absolute', left: 0, right: 0, bottom: 0, height,
              background: 'rgba(12,10,24,0.95)',
              backdropFilter: 'blur(24px) saturate(160%)',
              WebkitBackdropFilter: 'blur(24px) saturate(160%)',
              border: '1px solid var(--border-strong)',
              borderTopLeftRadius: 28, borderTopRightRadius: 28,
              boxShadow: '0 -24px 80px rgba(0,0,0,0.6)',
              display: 'flex', flexDirection: 'column',
            }}
          >
            <div style={{ padding: '12px 22px 0' }}>
              <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--text-3)', margin: '0 auto 14px' }} />
              {title && (
                <div className="row between" style={{ marginBottom: 6 }}>
                  <div className="col">
                    <div className="h-display" style={{ fontSize: 22 }}>{title}</div>
                    {sub && <div className="t-mono" style={{ fontSize: 10, marginTop: 4, color: 'var(--text-3)' }}>{sub}</div>}
                  </div>
                  <button
                    onClick={onClose}
                    style={{
                      background: 'var(--surf-2)', border: '1px solid var(--border)', borderRadius: '50%',
                      width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--text-1)', cursor: 'pointer', flexShrink: 0,
                    }}
                  >
                    <Icon name="close" size={13} />
                  </button>
                </div>
              )}
            </div>
            <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none', padding: '8px 22px 24px' }}>{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
