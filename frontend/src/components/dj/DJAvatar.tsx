export function DJAvatar({ size = 32, pulsing = false }: { size?: number; pulsing?: boolean }) {
  return (
    <div
      style={{
        width: size, height: size, borderRadius: '50%',
        background: 'linear-gradient(135deg, rgba(167,139,250,0.25), rgba(232,121,249,0.10))',
        border: '1px solid var(--border-strong)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', flexShrink: 0,
      }}
    >
      {pulsing && (
        <svg width={size} height={size} viewBox="0 0 32 32" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <circle cx="16" cy="16" r="10" fill="none" stroke="var(--accent-p)" strokeWidth="0.5" opacity="0.6">
            <animate attributeName="r" from="6" to="18" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.6" to="0" dur="2s" repeatCount="indefinite" />
          </circle>
        </svg>
      )}
      <svg width={size * 0.45} height={size * 0.45} viewBox="0 0 24 24" fill="none" stroke="var(--accent-m)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="9" y="3" width="6" height="11" rx="3" />
        <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
      </svg>
    </div>
  );
}
