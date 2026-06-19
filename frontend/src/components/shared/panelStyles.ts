import type { CSSProperties } from 'react';

export function pillBtn(): CSSProperties {
  return {
    background: 'rgba(20,16,40,0.6)',
    border: '1px solid var(--border)',
    borderRadius: 999,
    width: 34,
    height: 34,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-1)',
    cursor: 'pointer',
  };
}

export function glassPanel(strong?: boolean): CSSProperties {
  return {
    background: 'rgba(14,11,28,0.62)',
    backdropFilter: 'blur(18px) saturate(160%)',
    WebkitBackdropFilter: 'blur(18px) saturate(160%)',
    border: `1px solid ${strong ? 'var(--border-strong)' : 'var(--border)'}`,
    borderRadius: 16,
  };
}
