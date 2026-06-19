import { useEffect, useState } from 'react';
import { Stars, StatusBar } from '../atoms';
import { OBWelcome } from './OBWelcome';
import { OBConnect } from './OBConnect';
import { OBPick } from './OBPick';
import { OBScan } from './OBScan';
import { OBDone } from './OBDone';

interface OnboardingProps {
  onComplete: (picks: string[]) => void;
  /** Skip ahead when the user arrives already authenticated (e.g. resuming after the Spotify redirect). */
  initialStep?: number;
}

export function Onboarding({ onComplete, initialStep = 0 }: OnboardingProps) {
  const [step, setStep] = useState(initialStep); // 0 welcome, 1 connect, 2 pick, 3 scanning, 4 done
  const [scanPct, setScanPct] = useState(0);
  const [picks, setPicks] = useState<string[]>([]);

  useEffect(() => {
    if (step !== 3) return;
    let p = 0;
    const id = setInterval(() => {
      p = Math.min(100, p + 2 + Math.random() * 4);
      setScanPct(Math.round(p));
      if (p >= 100) {
        clearInterval(id);
        setTimeout(() => setStep(4), 500);
      }
    }, 120);
    return () => clearInterval(id);
  }, [step]);

  return (
    <div className="onboard-stage">
      <Stars className="screen-stars" count={120} seed={11} opacity={0.7} />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at 30% 20%, var(--neb-1) 0%, transparent 50%),' +
            'radial-gradient(ellipse at 70% 80%, var(--neb-2) 0%, transparent 50%)',
          pointerEvents: 'none',
        }}
      />
      <StatusBar />
      <div className="ob-stagewrap" style={{ flex: 1, position: 'relative', overflow: 'hidden', width: '100%' }}>
        {step === 0 && <OBWelcome key="w" onNext={() => setStep(1)} />}
        {step === 1 && <OBConnect key="c" onBack={() => setStep(0)} />}
        {step === 2 && <OBPick key="p" picks={picks} setPicks={setPicks} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
        {step === 3 && <OBScan key="s" pct={scanPct} />}
        {step === 4 && <OBDone key="d" picks={picks} onEnter={() => onComplete(picks)} />}
      </div>
    </div>
  );
}
