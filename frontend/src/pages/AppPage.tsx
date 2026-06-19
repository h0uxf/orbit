import { useEffect, useState } from 'react';
import { Onboarding } from '../components/onboarding';
import { MainApp } from './MainApp';
import { useAuth } from '../lib/useAuth';
import { api } from '../lib/api';

function PhoneShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="stage">
      <div className="phone">{children}</div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <PhoneShell>
      <div className="screen" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <span className="t-mono" style={{ color: 'var(--text-3)' }}>tuning in…</span>
      </div>
    </PhoneShell>
  );
}

export function AppPage() {
  const { user, checked } = useAuth();
  const [onboarded, setOnboarded] = useState<boolean | null>(null);

  useEffect(() => {
    if (!user) {
      setOnboarded(null);
      return;
    }
    let cancelled = false;
    api.get<{ onboarded: boolean }>('/api/state').then((s) => {
      if (!cancelled) setOnboarded(s.onboarded);
    });
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (!checked) return <LoadingScreen />;

  // Not signed in yet — onboarding starts at Welcome; the Connect step is
  // the only place that triggers real Spotify auth (full navigation away).
  if (!user) {
    return (
      <PhoneShell>
        <Onboarding initialStep={0} onComplete={() => {}} />
      </PhoneShell>
    );
  }

  if (onboarded === null) return <LoadingScreen />;

  // Already authenticated (e.g. just landed back from the Spotify redirect)
  // but hasn't finished onboarding — resume at Pick, skipping Welcome/Connect.
  if (!onboarded) {
    return (
      <PhoneShell>
        <Onboarding
          initialStep={2}
          onComplete={async (picks) => {
            await api.patch('/api/state', { onboarded: true, onboardingPicks: picks });
            setOnboarded(true);
          }}
        />
      </PhoneShell>
    );
  }

  return <MainApp />;
}
