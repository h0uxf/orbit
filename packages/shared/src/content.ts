import type { Mood, Persona, TonightSet } from './types.js';

// Fixed copy/content — ported verbatim from the design's data.jsx. Not
// user-editable yet, so these live as code constants rather than DB tables.
export const PERSONAS: Record<string, Persona> = {
  mira: {
    id: 'mira',
    name: 'Mira',
    tag: 'calm · poetic',
    blurb: 'Speaks softly. Frames music like weather and light.',
    hue: 280,
    accent: 'var(--accent-p)',
  },
  ash: {
    id: 'ash',
    name: 'Ash',
    tag: 'technical · curious',
    blurb: 'Nerds out on textures, time signatures, sonic lineage.',
    hue: 200,
    accent: '#67e8f9',
  },
  vera: {
    id: 'vera',
    name: 'Vera',
    tag: 'warm · grounded',
    blurb: 'Like a friend with great taste. Reassuring, direct.',
    hue: 330,
    accent: 'var(--accent-m)',
  },
};

export const MOODS: Mood[] = [
  { id: 'rain', label: 'Rainy train rides', startTrackId: 't2', hue: 220 },
  { id: 'nostal', label: 'Warm and nostalgic', startTrackId: 't3', hue: 40 },
  { id: 'city', label: 'Late-night city', startTrackId: 't4', hue: 280 },
  { id: 'wine', label: 'Closing a wine bar', startTrackId: 't8', hue: 330 },
  { id: 'unsettle', label: 'Quiet but unsettled', startTrackId: 't9', hue: 260 },
  { id: 'window', label: 'Staring out a window', startTrackId: 't7', hue: 200 },
];

export const TONIGHT_SET: TonightSet = {
  title: "Tonight · Soft departure",
  blurb: 'Seven tracks. Starts home, ends two rings out.',
  trackIds: ['t1', 't2', 't3', 't4', 't5', 't6', 't7'],
};

// Seed catalog — same 12 ring/radius positions as the design's RADIO_TRACKS,
// but with real, released tracks (the design's titles/artists were invented
// for the mockup and don't exist on Spotify, so Search can't resolve audio
// for them). Same genre/ring/radius placement, real song+artist pairs.
// lengthMs are approximate; spotifyTrackId is resolved at seed-time via
// Spotify Search (see backend/src/db/seed.ts) and is null here until then.
export const SEED_TRACKS = [
  { id: 't1', title: 'Space Song', artist: 'Beach House', genre: 'dream pop', ring: 0, radius: 6, seed: 3, lengthMs: 322_000, freq: '88.2', isNew: false },
  { id: 't2', title: "An Ending (Ascent)", artist: 'Brian Eno', genre: 'ambient', ring: 0, radius: 14, seed: 13, lengthMs: 273_000, freq: '88.9', isNew: false },
  { id: 't3', title: 'Skinny Love', artist: 'Bon Iver', genre: 'indie folk', ring: 0, radius: 22, seed: 23, lengthMs: 238_000, freq: '89.4', isNew: false },
  { id: 't4', title: 'Midnight City', artist: 'M83', genre: 'electronic', ring: 1, radius: 33, seed: 7, lengthMs: 243_000, freq: '90.7', isNew: true },
  { id: 't5', title: 'Only Shallow', artist: 'My Bloody Valentine', genre: 'shoegaze', ring: 1, radius: 42, seed: 29, lengthMs: 257_000, freq: '91.5', isNew: false },
  { id: 't6', title: 'Svefn-g-englar', artist: 'Sigur Rós', genre: 'post-rock', ring: 1, radius: 50, seed: 31, lengthMs: 589_000, freq: '92.3', isNew: true },
  { id: 't7', title: 'Blue in Green', artist: 'Miles Davis', genre: 'ambient jazz', ring: 2, radius: 60, seed: 11, lengthMs: 337_000, freq: '93.6', isNew: true },
  { id: 't8', title: 'Nuvole Bianche', artist: 'Ludovico Einaudi', genre: 'neo-classical', ring: 2, radius: 68, seed: 37, lengthMs: 358_000, freq: '94.4', isNew: true },
  { id: 't9', title: "Don't Bother They're Here", artist: 'Stars of the Lid', genre: 'drone', ring: 3, radius: 76, seed: 41, lengthMs: 510_000, freq: '95.7', isNew: true },
  { id: 't10', title: 'Windowlicker', artist: 'Aphex Twin', genre: 'idm', ring: 3, radius: 84, seed: 19, lengthMs: 367_000, freq: '96.9', isNew: true },
  { id: 't11', title: 'Frontier Psychiatrist', artist: 'The Avalanches', genre: 'experimental', ring: 4, radius: 91, seed: 47, lengthMs: 251_000, freq: '98.2', isNew: true },
  { id: 't12', title: 'Gantz Graf', artist: 'Autechre', genre: 'glitch', ring: 4, radius: 97, seed: 53, lengthMs: 272_000, freq: '99.4', isNew: true },
] as const;
