export function StaticOverlay() {
  return (
    <div style={{ position: 'absolute', inset: 0, mixBlendMode: 'screen', opacity: 0.5, pointerEvents: 'none' }}>
      <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 100">
        <defs>
          <filter id="noise-p">
            <feTurbulence type="fractalNoise" baseFrequency={2.5} numOctaves={3} stitchTiles="stitch">
              <animate attributeName="seed" from="0" to="20" dur="0.4s" repeatCount="indefinite" />
            </feTurbulence>
            <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.5 0" />
          </filter>
        </defs>
        <rect width="100" height="100" filter="url(#noise-p)" />
      </svg>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          height: 2,
          background: 'linear-gradient(90deg, transparent, var(--accent-m), transparent)',
          opacity: 0.8,
          animation: 'scan-line-p 0.9s ease-in-out infinite',
        }}
      />
      <style>{`@keyframes scan-line-p { 0% { top: 0%; } 100% { top: 100%; } }`}</style>
    </div>
  );
}
