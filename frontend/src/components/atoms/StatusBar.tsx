export function StatusBar({ time = '9:41' }: { time?: string }) {
  return (
    <div className="statusbar">
      <span>{time}</span>
      <div className="statusbar-right">
        <svg width="16" height="11" viewBox="0 0 16 11" fill="none">
          <rect x="0" y="6.5" width="2.5" height="4.5" rx="0.5" fill="currentColor" />
          <rect x="4" y="4" width="2.5" height="7" rx="0.5" fill="currentColor" />
          <rect x="8" y="2" width="2.5" height="9" rx="0.5" fill="currentColor" />
          <rect x="12" y="0" width="2.5" height="11" rx="0.5" fill="currentColor" />
        </svg>
        <svg width="22" height="11" viewBox="0 0 22 11" fill="none" style={{ marginLeft: 4 }}>
          <rect x="0.5" y="0.5" width="18" height="10" rx="2.5" stroke="currentColor" strokeOpacity="0.5" fill="none" />
          <rect x="2" y="2" width="13" height="7" rx="1" fill="currentColor" />
          <path d="M20 3.5V7.5C20.6 7.3 21 6.7 21 6C21 5.3 20.6 4.7 20 4.5V3.5Z" fill="currentColor" fillOpacity="0.5" />
        </svg>
      </div>
    </div>
  );
}
