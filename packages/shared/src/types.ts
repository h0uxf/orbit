export type PersonaId = 'mira' | 'ash' | 'vera';

export interface Track {
  id: string;
  spotifyTrackId: string | null;
  spotifyUri: string | null;
  title: string;
  artist: string;
  genre: string;
  ring: number; // 0..4
  radius: number; // 0..100, position along the discovery spiral
  seed: number; // deterministic seed for procedural album art / stars
  lengthMs: number;
  freq: string; // display label e.g. "88.2"
  isNew: boolean;
}

export interface Station extends Track {
  x: number;
  y: number;
  r: number;
  ang: number;
  size: number;
}

export interface Persona {
  id: PersonaId;
  name: string;
  tag: string;
  blurb: string;
  hue: number;
  accent: string;
}

export interface Mood {
  id: string;
  label: string;
  startTrackId: string;
  hue: number;
}

export interface TonightSet {
  title: string;
  blurb: string;
  trackIds: string[];
}

export interface CourageState {
  maxRingSession: number;
  streakDays: number;
}

export interface UserState {
  radius: number;
  personaId: PersonaId;
  sleep: boolean;
  autoAdvance: boolean;
  presets: string[];
  saved: string[];
  courage: CourageState;
  onboarded: boolean;
  onboardingPicks: string[];
  currentTrackId: string | null;
}

export type ChatRole = 'me' | 'dj';

export interface ChatMessage {
  who: ChatRole;
  text: string;
}
