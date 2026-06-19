export function Wordmark({ size = 22 }: { size?: number }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="2.5" fill="var(--text-0)" />
        <ellipse cx="12" cy="12" rx="10" ry="4" stroke="var(--accent-p)" strokeWidth="1" transform="rotate(-20 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4" stroke="var(--accent-m)" strokeWidth="1" transform="rotate(40 12 12)" opacity="0.7" />
        <circle cx="20" cy="6" r="1" fill="var(--accent-m)" />
      </svg>
      <span
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 500,
          fontSize: size * 0.85,
          letterSpacing: '-0.01em',
          color: 'var(--text-0)',
        }}
      >
        orbit
      </span>
    </div>
  );
}
