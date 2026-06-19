import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  modeForRadius,
  PERSONAS,
  MOODS,
  trackForRadius,
  type ChatMessage,
  type CourageState,
  type DjEvent,
  type Mood,
  type PersonaId,
  type Station,
  type TonightSet,
  type Track,
  type UserState,
} from '@orbit/shared';
import { api } from '../lib/api';
import { useSpotifyPlayback } from '../lib/useSpotifyPlayback';
import type { DjPopupData } from '../components/dj/DJPopup';

interface NarrateOpts {
  trackId?: string;
  prevTrackId?: string;
  fromRing?: number;
  toRing?: number;
  direction?: 'out' | 'in' | 'lateral';
  persona?: PersonaId;
  mood?: string;
  name?: string;
}

export function useOrbitState() {
  const [loaded, setLoaded] = useState(false);
  const [stations, setStations] = useState<Station[]>([]);
  const [tonightSet, setTonightSet] = useState<TonightSet>({ title: '', blurb: '', trackIds: [] });

  const [radius, setRadiusRaw] = useState(14);
  const [previewRadius, setPreviewRadius] = useState<number | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Station | null>(null);
  const [prevTrack, setPrevTrack] = useState<Station | null>(null);
  const [isTuning, setIsTuning] = useState(false);

  const [personaId, setPersonaId] = useState<PersonaId>('mira');
  const [sleep, setSleep] = useState(false);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [presets, setPresets] = useState<string[]>(['t1', 't4', 't7']);
  const [saved, setSaved] = useState<string[]>([]);
  const [courage, setCourage] = useState<CourageState>({ maxRingSession: 0, streakDays: 9 });
  const [onboarded, setOnboarded] = useState(false);

  const [playerOpen, setPlayerOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [moodOpen, setMoodOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [setOpen, setSetOpen] = useState(false);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [stationNote, setStationNote] = useState<string | null>(null);

  const [djPopup, setDjPopup] = useState<DjPopupData | null>(null);
  const [djMessages, setDjMessages] = useState<ChatMessage[]>([]);

  const playback = useSpotifyPlayback();

  const tuneTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const popupQueueRef = useRef<DjPopupData[]>([]);
  const isFirstMountRef = useRef(true);
  const personaRef = useRef(personaId);
  useEffect(() => { personaRef.current = personaId; }, [personaId]);
  const missStreakRef = useRef(0);

  const persona = PERSONAS[personaId];

  const narrate = useCallback(async (event: DjEvent, opts: NarrateOpts = {}): Promise<string> => {
    const { text } = await api.post<{ text: string }>('/api/dj/narrate', { event, persona: personaRef.current, ...opts });
    return text;
  }, []);

  // ── initial load: stations + persisted user state + chat history ──
  useEffect(() => {
    (async () => {
      const [stationsRes, stateRes, messagesRes] = await Promise.all([
        api.get<{ stations: Station[]; tonightSet: TonightSet }>('/api/stations'),
        api.get<UserState>('/api/state'),
        api.get<{ messages: ChatMessage[] }>('/api/dj/messages'),
      ]);
      setStations(stationsRes.stations);
      setTonightSet(stationsRes.tonightSet);
      setRadiusRaw(stateRes.radius);
      setPersonaId(stateRes.personaId);
      setSleep(stateRes.sleep);
      setAutoAdvance(stateRes.autoAdvance);
      setPresets(stateRes.presets);
      setSaved(stateRes.saved);
      setCourage(stateRes.courage);
      setOnboarded(stateRes.onboarded);
      setDjMessages(messagesRes.messages);

      const initialTrack = stateRes.currentTrackId
        ? stationsRes.stations.find((s) => s.id === stateRes.currentTrackId) ?? trackForRadius(stationsRes.stations, stateRes.radius)
        : trackForRadius(stationsRes.stations, stateRes.radius);
      setCurrentTrack(initialTrack);
      setLoaded(true);
    })();
  }, []);

  // ── persist relevant state, debounced ──
  useEffect(() => {
    if (!loaded) return;
    const id = setTimeout(() => {
      api.patch('/api/state', {
        radius,
        personaId,
        sleep,
        autoAdvance,
        presets,
        saved,
        courage,
        onboarded,
        currentTrackId: currentTrack?.id ?? null,
      }).catch(() => {});
    }, 400);
    return () => clearTimeout(id);
  }, [loaded, radius, personaId, sleep, autoAdvance, presets, saved, courage, onboarded, currentTrack?.id]);

  const activeSetStep = currentTrack ? Math.max(0, tonightSet.trackIds.indexOf(currentTrack.id)) : 0;

  function setRadius(v: number) {
    setRadiusRaw(Math.max(0, Math.min(100, Math.round(v))));
  }

  // ── sleep mode: ease radius inward over time ──
  useEffect(() => {
    if (!sleep) return;
    const id = setInterval(() => setRadiusRaw((r) => (r > 6 ? Math.max(6, r - 3) : r)), 4000);
    return () => clearInterval(id);
  }, [sleep]);

  // ── debounced tuning on radius change ──
  useEffect(() => {
    if (!loaded || stations.length === 0 || !currentTrack) return;
    if (isFirstMountRef.current) { isFirstMountRef.current = false; return; }
    const desired = trackForRadius(stations, radius);
    if (desired.id === currentTrack.id) return;
    clearTimeout(tuneTimerRef.current);
    tuneTimerRef.current = setTimeout(() => tuneTo(desired, { reason: 'radius' }), 260);
    return () => clearTimeout(tuneTimerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [radius, loaded, stations]);

  function tuneTo(newTrack: Station, { reason }: { reason: 'radius' | 'auto' }) {
    if (!currentTrack) return;
    setPrevTrack(currentTrack);
    setIsTuning(true);
    const from = currentTrack;
    setTimeout(async () => {
      const fromRing = from.ring;
      const toRing = newTrack.ring;
      const direction: 'out' | 'in' | 'lateral' = toRing > fromRing ? 'out' : toRing < fromRing ? 'in' : 'lateral';
      setCurrentTrack(newTrack);
      setIsTuning(false);
      setPrevTrack(null);
      playback.play(newTrack.spotifyUri ?? '').catch(() => {});

      setCourage((c) => ({ ...c, maxRingSession: Math.max(c.maxRingSession, toRing) }));

      const event: DjEvent = reason === 'auto' ? 'auto-advance' : direction === 'out' ? 'tuning-out' : direction === 'in' ? 'tuning-in' : 'now-playing';
      const text = await narrate(event, { trackId: newTrack.id, prevTrackId: from.id, fromRing, toRing, direction });
      pushPopup({ text, label: reason === 'auto' ? 'NOW PLAYING' : 'TUNING' });
      setDjMessages((m) => [...m, { who: 'dj', text }]);

      if (toRing >= 3 && fromRing <= 1 && toRing > courage.maxRingSession) {
        setTimeout(async () => {
          const ct = await narrate('courage', { trackId: newTrack.id, toRing });
          pushPopup({ text: ct, label: persona.name.toUpperCase() });
          setDjMessages((m) => [...m, { who: 'dj', text: ct }]);
        }, 6800);
      }
    }, 800);
  }

  function handleAutoAdvance() {
    if (!autoAdvance || !currentTrack) { return; }
    const candidates = stations.filter((tr) => tr.id !== currentTrack.id && Math.abs(tr.ring - currentTrack.ring) <= 1);
    const next = candidates[Math.floor(Math.random() * candidates.length)] || stations[0];
    if (!next) return;
    setRadiusRaw(next.radius);
    tuneTo(next, { reason: 'auto' });
  }

  function registerMiss() {
    missStreakRef.current += 1;
    if (missStreakRef.current >= 2) {
      missStreakRef.current = 0;
      narrate('safety', { trackId: currentTrack?.id }).then((text) => {
        pushPopup({
          text, label: persona.name.toUpperCase(), duration: 9000,
          action: { label: 'Pull me back', onClick: () => setRadius(Math.max(6, radius - 30)) },
        });
        setDjMessages((m) => [...m, { who: 'dj', text }]);
      });
    }
  }

  function handleNotForMe(track: Track) {
    narrate('not-for-me', { trackId: track.id }).then((text) => {
      pushPopup({ text, label: persona.name.toUpperCase() });
      setDjMessages((m) => [...m, { who: 'dj', text }]);
    });
    if (track.ring >= 2) registerMiss();
    setRadius(Math.max(0, radius - 6));
  }

  function pushPopup(p: DjPopupData) {
    popupQueueRef.current.push(p);
    setDjPopup((cur) => cur ?? drainPopup());
  }
  function drainPopup(): DjPopupData | null {
    return popupQueueRef.current.shift() ?? null;
  }
  function dismissPopup() {
    setDjPopup(null);
    setTimeout(() => setDjPopup(drainPopup()), 220);
  }

  function handleSend(text: string) {
    if (!currentTrack) return;
    setDjMessages((m) => [...m, { who: 'me', text }]);
    api.post<{ text: string; newRadius?: number }>('/api/dj/chat', { text, trackId: currentTrack.id, radius }).then((reply) => {
      setDjMessages((m) => [...m, { who: 'dj', text: reply.text }]);
      if (reply.newRadius !== undefined) setRadius(reply.newRadius);
    });
  }

  function changePersona(id: PersonaId) {
    setPersonaId(id);
    const pn = PERSONAS[id];
    narrate('welcome', { persona: id, name: pn.name }).then((text) => {
      setDjMessages((m) => [...m, { who: 'dj', text }]);
      pushPopup({ text: `${pn.name} is on the air now.`, label: 'STUDIO' });
    });
  }

  function handleMood(mood: Mood) {
    setMoodOpen(false);
    const st = stations.find((s) => s.id === mood.startTrackId) || stations[0];
    if (!st) return;
    setRadiusRaw(st.radius);
    setTimeout(() => tuneTo(st, { reason: 'radius' }), 60);
    setTimeout(async () => {
      const text = await narrate('mood', { trackId: st.id, mood: mood.label });
      pushPopup({ text, label: persona.name.toUpperCase() });
      setDjMessages((m) => [...m, { who: 'dj', text }]);
    }, 1000);
  }

  function togglePreset(id: string) {
    setPresets((ps) => (ps.includes(id) ? ps.filter((x) => x !== id) : [...ps, id].slice(-6)));
  }
  function toggleSave(id: string) {
    setSaved((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }

  function selectStation(st: Station) {
    setSelectedStation(st);
    setStationNote(null);
    narrate('now-playing', { trackId: st.id }).then(setStationNote);
  }
  function tuneToStation(st: Station) {
    setSelectedStation(null);
    setRadius(st.radius);
  }

  function finishOnboarding(_picks: string[]) {
    setOnboarded(true);
    setTimeout(async () => {
      if (!currentTrack) return;
      const text = await narrate('now-playing', { trackId: currentTrack.id });
      pushPopup({ text, label: 'COMING UP' });
      setDjMessages((m) => [...m, { who: 'dj', text }]);
    }, 800);
  }

  const mode = useMemo(() => modeForRadius(radius), [radius]);

  return {
    loaded,
    stations,
    tonightSet,
    moods: MOODS,
    radius, setRadius, previewRadius, setPreviewRadius,
    currentTrack, prevTrack, isTuning,
    persona, personaId, changePersona,
    sleep, setSleep, autoAdvance, setAutoAdvance,
    presets, togglePreset, saved, toggleSave,
    courage,
    onboarded, setOnboarded, finishOnboarding,
    playerOpen, setPlayerOpen, chatOpen, setChatOpen,
    moodOpen, setMoodOpen, settingsOpen, setSettingsOpen,
    setOpen, setSetOpen,
    selectedStation, setSelectedStation, stationNote, selectStation, tuneToStation,
    djPopup, dismissPopup, djMessages, handleSend,
    handleAutoAdvance, handleNotForMe, handleMood,
    activeSetStep, mode,
    playback,
  };
}

export type OrbitState = ReturnType<typeof useOrbitState>;
