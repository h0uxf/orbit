import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { ChatMessage, Persona } from '@orbit/shared';
import { Icon } from '../atoms';
import { DJAvatar } from './DJAvatar';

interface DJChatSheetProps {
  open: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  onSend: (text: string) => void;
  persona: Persona;
}

const QUICK_REPLIES = ['Why this song?', 'Take me further', 'Pull me back', 'What region am I in?', 'How adventurous is this?'];

export function DJChatSheet({ open, onClose, messages, onSend, persona }: DJChatSheetProps) {
  const [draft, setDraft] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  function send(text?: string) {
    const t = (text || draft).trim();
    if (!t) return;
    onSend(t);
    setDraft('');
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          style={{ position: 'absolute', inset: 0, zIndex: 70, display: 'flex', flexDirection: 'column' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(7,6,14,0.7)', backdropFilter: 'blur(8px)' }} />
          <motion.div
            className="om-sheet"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'absolute', left: 0, right: 0, bottom: 0, height: '72%',
              background: 'rgba(12,10,24,0.94)',
              backdropFilter: 'blur(24px) saturate(160%)',
              WebkitBackdropFilter: 'blur(24px) saturate(160%)',
              border: '1px solid var(--border-strong)',
              borderTopLeftRadius: 28, borderTopRightRadius: 28,
              boxShadow: '0 -24px 80px rgba(0,0,0,0.6)',
              display: 'flex', flexDirection: 'column',
            }}
          >
            <div style={{ padding: '12px 20px 0' }}>
              <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--text-3)', margin: '0 auto' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14 }}>
                <DJAvatar size={36} pulsing />
                <div className="col">
                  <div className="t-meta" style={{ color: persona.accent }}>{persona.name.toUpperCase()}</div>
                  <div className="t-mono" style={{ fontSize: 10, marginTop: 2, color: 'var(--text-3)' }}>Orbit · Late Hours · on air now</div>
                </div>
                <div style={{ flex: 1 }} />
                <button
                  onClick={onClose}
                  style={{
                    background: 'var(--surf-2)', border: '1px solid var(--border)',
                    borderRadius: '50%', width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--text-1)', cursor: 'pointer',
                  }}
                >
                  <Icon name="close" size={13} />
                </button>
              </div>
            </div>

            <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '16px 20px 4px', scrollbarWidth: 'none' }}>
              {messages.map((m, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: m.who === 'me' ? 'flex-end' : 'flex-start', marginBottom: 10 }}>
                  <div
                    style={{
                      maxWidth: '82%', padding: '10px 13px', borderRadius: 14,
                      background: m.who === 'me' ? 'linear-gradient(135deg, var(--accent-p), var(--accent-m))' : 'var(--surf-2)',
                      border: m.who === 'me' ? 'none' : '1px solid var(--border)',
                      color: m.who === 'me' ? '#0a0814' : 'var(--text-0)',
                      fontFamily: 'var(--font-sans)', fontSize: 13, lineHeight: 1.5,
                    }}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 6, padding: '6px 20px 8px', overflowX: 'auto', scrollbarWidth: 'none' }}>
              {QUICK_REPLIES.map((q) => (
                <button key={q} className="chip" onClick={() => send(q)} style={{ background: 'var(--surf-strong)', cursor: 'pointer', flexShrink: 0, fontSize: 10, padding: '6px 11px' }}>
                  {q}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 8, padding: '8px 20px 20px', borderTop: '1px solid var(--border)', alignItems: 'center' }}>
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder="Ask your DJ…"
                style={{
                  flex: 1, background: 'var(--surf-1)', border: '1px solid var(--border)', borderRadius: 999,
                  padding: '10px 14px', color: 'var(--text-0)', fontFamily: 'var(--font-sans)', fontSize: 13, outline: 'none',
                }}
              />
              <button
                onClick={() => send()}
                style={{
                  width: 38, height: 38, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--accent-p), var(--accent-m))',
                  border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0a0814',
                  opacity: draft.trim() ? 1 : 0.4,
                }}
              >
                <Icon name="arrow" size={14} />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
