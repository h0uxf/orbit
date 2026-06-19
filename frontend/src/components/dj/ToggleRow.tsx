import { Icon, type IconName } from '../atoms/Icon';

interface ToggleRowProps {
  icon: IconName;
  label: string;
  sub: string;
  value: boolean;
  onChange: (v: boolean) => void;
}

export function ToggleRow({ icon, label, sub, value, onChange }: ToggleRowProps) {
  return (
    <button
      onClick={() => onChange(!value)}
      style={{
        display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
        borderRadius: 14, border: '1px solid var(--border)', background: 'var(--surf-1)',
        cursor: 'pointer', textAlign: 'left', color: 'var(--text-0)', fontFamily: 'inherit', width: '100%',
      }}
    >
      <div
        style={{
          width: 32, height: 32, borderRadius: 9, flexShrink: 0,
          background: value ? 'linear-gradient(135deg, var(--accent-p), var(--accent-m))' : 'var(--surf-2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: value ? '#0a0814' : 'var(--text-2)',
        }}
      >
        <Icon name={icon} size={15} />
      </div>
      <div className="col flex-1">
        <div className="t-body" style={{ fontSize: 14, color: 'var(--text-0)' }}>{label}</div>
        <div className="t-mono" style={{ fontSize: 9, color: 'var(--text-3)', marginTop: 2 }}>{sub}</div>
      </div>
      <div
        style={{
          width: 42, height: 24, borderRadius: 999, flexShrink: 0, position: 'relative',
          background: value ? 'var(--accent-p)' : 'var(--surf-strong)',
          border: '1px solid var(--border)', transition: 'background 0.2s',
        }}
      >
        <div
          style={{
            position: 'absolute', top: 2, left: value ? 20 : 2, width: 18, height: 18,
            borderRadius: '50%', background: '#fff', transition: 'left 0.2s',
            boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
          }}
        />
      </div>
    </button>
  );
}
