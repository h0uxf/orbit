import { PERSONAS } from '@orbit/shared';
import { Stars } from '../components/atoms';
import { StatusBar } from '../components/atoms';
import { Onboarding } from '../components/onboarding';
import { OrbitHome } from '../components/home';
import { FullPlayerSheet } from '../components/player';
import {
  DJPopup, DJChatSheet, MoodSheet, SetListSheet, SettingsSheet, StationSheet,
} from '../components/dj';
import { useOrbitState } from '../state/useOrbitState';

export function AppPage() {
  const o = useOrbitState();

  if (!o.loaded || !o.currentTrack) {
    return (
      <div className="stage">
        <div className="phone">
          <div className="screen" style={{ alignItems: 'center', justifyContent: 'center' }}>
            <span className="t-mono" style={{ color: 'var(--text-3)' }}>tuning in…</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="stage">
      <Stars className="stage-stars" count={140} seed={2} opacity={0.5} />
      <div className="stage-meta">orbit · the map is the player</div>
      <div className="stage-meta-r">
        {o.currentTrack.freq} KHZ · RING.{(o.currentTrack.ring + 1).toString().padStart(2, '0')} · {o.persona.name}
      </div>

      <div className="phone">
        {!o.onboarded ? (
          <Onboarding onComplete={o.finishOnboarding} />
        ) : (
          <div className="screen">
            <StatusBar />

            <OrbitHome
              radius={o.radius} setRadius={o.setRadius}
              previewRadius={o.previewRadius} setPreviewRadius={o.setPreviewRadius}
              track={o.currentTrack} isTuning={o.isTuning}
              persona={o.persona}
              courage={o.courage} stations={o.stations} tonightSet={o.tonightSet} activeSetStep={o.activeSetStep}
              onSelectStation={o.selectStation}
              onOpenSettings={() => o.setSettingsOpen(true)}
              onOpenMood={() => o.setMoodOpen(true)}
              onOpenSet={() => o.setSetOpen(true)}
              presets={o.presets}
              playing={o.playback.playing} onTogglePlay={o.playback.togglePlay} progress={o.playback.progress}
              onExpandPlayer={() => o.setPlayerOpen(true)}
            />

            <StationSheet
              station={o.selectedStation} onClose={() => o.setSelectedStation(null)}
              onTune={o.tuneToStation} onOpenChat={() => { o.setSelectedStation(null); o.setChatOpen(true); }}
              persona={o.persona} saved={o.saved} onToggleSave={o.toggleSave} note={o.stationNote}
            />

            <FullPlayerSheet
              open={o.playerOpen} onClose={() => o.setPlayerOpen(false)}
              radius={o.radius} setRadius={o.setRadius}
              previewRadius={o.previewRadius} setPreviewRadius={o.setPreviewRadius}
              track={o.currentTrack} prevTrack={o.prevTrack} isTuning={o.isTuning}
              playing={o.playback.playing} onTogglePlay={o.playback.togglePlay} progress={o.playback.progress}
              persona={o.persona}
              onOpenChat={() => o.setChatOpen(true)}
              onNotForMe={o.handleNotForMe}
              saved={o.saved} onToggleSave={o.toggleSave}
              presets={o.presets} onTogglePreset={o.togglePreset}
              stations={o.stations}
            />

            <MoodSheet open={o.moodOpen} onClose={() => o.setMoodOpen(false)} onPick={o.handleMood} moods={o.moods} />
            <SetListSheet
              open={o.setOpen} onClose={() => o.setSetOpen(false)}
              tonightSet={o.tonightSet} stations={o.stations} activeSetStep={o.activeSetStep} track={o.currentTrack}
              onJump={(s) => { o.setSetOpen(false); o.setRadius(s.radius); }}
            />
            <SettingsSheet
              open={o.settingsOpen} onClose={() => o.setSettingsOpen(false)}
              personas={PERSONAS} persona={o.personaId} setPersona={o.changePersona}
              sleep={o.sleep} setSleep={o.setSleep}
              autoAdvance={o.autoAdvance} setAutoAdvance={o.setAutoAdvance}
              onResetOnboarding={() => { o.setSettingsOpen(false); o.setOnboarded(false); }}
            />

            <DJPopup popup={o.djPopup} onDismiss={o.dismissPopup} onOpenChat={() => o.setChatOpen(true)} />
            <DJChatSheet open={o.chatOpen} onClose={() => o.setChatOpen(false)} messages={o.djMessages} onSend={o.handleSend} persona={o.persona} />
          </div>
        )}
      </div>
    </div>
  );
}
