import type { ReactNode } from 'react';

export type IconName =
  | 'home' | 'orbit' | 'discover' | 'play' | 'pause' | 'skip' | 'back' | 'heart' | 'sparkle'
  | 'arrow' | 'arrowback' | 'close' | 'search' | 'queue' | 'chat' | 'info' | 'settings'
  | 'galaxy' | 'moon' | 'wave' | 'plus' | 'check';

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

const PATHS: Record<IconName, ReactNode> = {
  home: <path d="M3 11l9-7 9 7v9a2 2 0 0 1-2 2h-4v-7h-6v7H5a2 2 0 0 1-2-2v-9z" />,
  orbit: (
    <>
      <circle cx="12" cy="12" r="2" />
      <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(30 12 12)" />
      <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(-30 12 12)" />
    </>
  ),
  discover: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9 9l6 2-2 6-6-2 2-6z" fill="currentColor" stroke="none" opacity="0.5" />
      <path d="M9 9l6 2-2 6-6-2 2-6z" />
    </>
  ),
  play: <path d="M6 4l14 8-14 8V4z" fill="currentColor" stroke="none" />,
  pause: (
    <>
      <rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor" stroke="none" />
      <rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor" stroke="none" />
    </>
  ),
  skip: (
    <>
      <path d="M5 4l10 8-10 8V4z" fill="currentColor" stroke="none" />
      <rect x="17" y="4" width="2" height="16" fill="currentColor" stroke="none" />
    </>
  ),
  back: (
    <>
      <path d="M19 4L9 12l10 8V4z" fill="currentColor" stroke="none" />
      <rect x="5" y="4" width="2" height="16" fill="currentColor" stroke="none" />
    </>
  ),
  heart: <path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.5-7 10-7 10z" />,
  sparkle: (
    <>
      <path d="M12 3l1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6L12 3z" />
      <path d="M19 17l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7L19 17z" />
    </>
  ),
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  arrowback: <path d="M19 12H5M11 6l-6 6 6 6" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </>
  ),
  queue: (
    <>
      <path d="M4 6h16M4 12h12M4 18h8" />
      <circle cx="19" cy="17" r="2.5" fill="currentColor" stroke="none" opacity="0.8" />
    </>
  ),
  chat: <path d="M21 11a8 8 0 0 1-3.5 6.6L18 21l-4-2.5a8 8 0 1 1 7-7.5z" />,
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v.01M11 12h1v5h1" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M2 12h3M19 12h3M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12" />
    </>
  ),
  galaxy: (
    <>
      <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
      <path d="M4 12a8 8 0 0 1 8-8c2 4 2 12 0 16a8 8 0 0 1-8-8z" opacity="0.6" />
      <path d="M20 12a8 8 0 0 1-8 8c-2-4-2-12 0-16a8 8 0 0 1 8 8z" opacity="0.6" />
    </>
  ),
  moon: <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />,
  wave: <path d="M2 12c2-4 4-4 6 0s4 4 6 0 4-4 6 0" />,
  plus: <path d="M12 5v14M5 12h14" />,
  check: <path d="M5 12l5 5 9-11" />,
};

export function Icon({ name, size = 20, color = 'currentColor', strokeWidth = 1.5 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      {PATHS[name]}
    </svg>
  );
}
