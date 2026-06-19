import type { Persona, PersonaId } from '@orbit/shared';
import { Icon } from '../atoms';
import { Sheet } from './Sheet';
import { ToggleRow } from './ToggleRow';

interface SettingsSheetProps {
  open: boolean;
  onClose: () => void;
  personas: Record<string, Persona>;
  persona: PersonaId;
  setPersona: (id: PersonaId) => void;
  sleep: boolean;
  setSleep: (v: boolean) => void;
  autoAdvance: boolean;
  setAutoAdvance: (v: boolean) => void;
  onResetOnboarding: () => void;
}

export function SettingsSheet({ open, onClose, personas, persona, setPersona, sleep, setSleep, autoAdvance, setAutoAdvance, onResetOnboarding }: SettingsSheetProps) {
  return (
    <Sheet open={open} onClose={onClose} title="Studio" height="76%" sub="Shape who's on air and how the night runs">
      <div className="h-section" style={{ marginBottom: 12 }}>Your DJ</div>
      <div className="col gap-3">
        {Object.values(personas).map((pn) => {
          const active = pn.id === persona;
          return (
            <button
              key={pn.id}
              onClick={() => setPersona(pn.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                borderRadius: 16, cursor: 'pointer', textAlign: 'left',
                border: active ? '1px solid var(--border-strong)' : '1px solid var(--border)',
                background: active ? `linear-gradient(135deg, oklch(0.4 0.14 ${pn.hue} / 0.3), var(--surf-1))` : 'var(--surf-1)',
                color: 'var(--text-0)', fontFamily: 'inherit',
              }}
            >
              <div
                style={{
                  width: 42, height: 42, borderRadius: '50%', flexShrink: 0, position: 'relative',
                  background: `radial-gradient(circle, oklch(0.6 0.18 ${pn.hue}), oklch(0.32 0.12 ${pn.hue}))`,
                  border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
                </svg>
              </div>
              <div className="col flex-1">
                <div className="row gap-2" style={{ alignItems: 'baseline' }}>
                  <span className="h-card" style={{ fontSize: 16 }}>{pn.name}</span>
                  <span className="t-mono" style={{ fontSize: 9, color: 'var(--text-3)' }}>{pn.tag}</span>
                </div>
                <div className="t-body" style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 3 }}>{pn.blurb}</div>
              </div>
              {active && <Icon name="check" size={18} color="var(--accent-m)" />}
            </button>
          );
        })}
      </div>

      <div className="h-section" style={{ margin: '24px 0 12px' }}>The night</div>
      <div className="col gap-2">
        <ToggleRow icon="moon" label="Sleep mode" sub="Radius eases inward over time, winding you down" value={sleep} onChange={setSleep} />
        <ToggleRow icon="play" label="Auto-advance" sub="Roll into a neighbouring station when a track ends" value={autoAdvance} onChange={setAutoAdvance} />
      </div>

      <button onClick={onResetOnboarding} className="btn" style={{ width: '100%', marginTop: 20, fontSize: 13 }}>
        Replay onboarding
      </button>
    </Sheet>
  );
}
