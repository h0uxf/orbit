import type { PersonaId, Track } from './types.js';

// Ported verbatim from the design's dj-host.jsx (djLine / djReply). This is
// the one seam where a future LLM call can replace the template logic
// without touching any caller — narrateEvent/replyToChat are the only two
// exports the rest of the app depends on.
export type DjEvent =
  | 'now-playing'
  | 'tuning-out'
  | 'tuning-in'
  | 'auto-advance'
  | 'courage'
  | 'safety'
  | 'not-for-me'
  | 'mood'
  | 'welcome';

export interface DjEventPayload {
  track?: Track;
  prevTrack?: Track;
  fromRing?: number;
  toRing?: number;
  direction?: 'out' | 'in' | 'lateral';
  persona?: PersonaId;
  mood?: string;
  name?: string;
}

function V(persona: PersonaId | undefined, mira: string, ash: string, vera: string): string {
  const p = persona || 'mira';
  return { mira, ash, vera }[p];
}

export function narrateEvent(event: DjEvent, payload: DjEventPayload = {}): string {
  const { track, prevTrack, fromRing = 0, toRing = 0, persona } = payload;

  if (event === 'now-playing' && track) {
    if (track.ring === 0) {
      return V(persona,
        `"${track.title}" by ${track.artist} — right at the center of your sky. Settle in.`,
        `Up: "${track.title}" — ${track.artist}. Core of your taste graph. Slow attack, vocal-forward.`,
        `Here's "${track.title}" by ${track.artist}. This one's home base — nothing to brace for.`);
    }
    if (track.ring === 1) {
      return V(persona,
        `"${track.title}" drifts one ring out, but the warmth carries over.`,
        `"${track.title}" — ${track.artist}. One ring out. Same vocal layering, new texture underneath.`,
        `"${track.title}" is just a step past your usual. You've got this.`);
    }
    if (track.ring === 2) {
      return V(persona,
        `"${track.title}" — a little further from shore. Same weather, different instruments.`,
        `"${track.title}" sits two rings out. Piano where you'd expect guitar. Worth the stretch.`,
        `"${track.title}" is a real step out — but I think you'll like where it lands.`);
    }
    if (track.ring === 3) {
      return V(persona,
        `"${track.title}" — deep water now. Let the first minute open up.`,
        `"${track.title}" — three rings out. Unfamiliar arrangement, but rooted in your top 50.`,
        `"${track.title}" is a reach. Trust me on this one — hold through the intro.`);
    }
    return V(persona,
      `"${track.title}" — the far edge of your sky. Familiar in places, if you listen.`,
      `"${track.title}" — deep space. High novelty, but the cadence echoes your core.`,
      `"${track.title}" is way out there. No pressure — I'll pull us back whenever you want.`);
  }

  if (event === 'tuning-out') {
    if (toRing >= 3 && fromRing < 3) {
      return V(persona,
        `We're leaving the harbor. Stay with me — this is where it gets beautiful.`,
        `Crossing into ring ${toRing + 1}. Mostly first-listens from here. Eyes open.`,
        `Going further than usual now. I'm right here if it's too much.`);
    }
    if (toRing - fromRing >= 2) {
      return V(persona,
        `A long drift outward. Breathe — I'll narrate the way.`,
        `Big jump — skipping to ${toRing === 4 ? 'deep space' : 'the edge'}. Recalibrating.`,
        `That's a big leap. Brave. Let's see how it feels.`);
    }
    return V(persona, `Drifting outward, gently.`, `Nudging out one ring. Adjacent sonics.`, `One step further. Easy does it.`);
  }

  if (event === 'tuning-in') {
    if (toRing === 0 && track) {
      return V(persona,
        `Coming home. ${track.artist} is waiting — familiar ground.`,
        `Back to core. ${track.artist} up — lowest novelty in your graph.`,
        `Pulling you all the way back. ${track.artist} — safe and warm.`);
    }
    return V(persona, `Easing inward, back toward the known.`, `Stepping in a ring. More familiar territory.`, `Bringing you back closer. No rush out there.`);
  }

  if (event === 'auto-advance' && track && prevTrack) {
    return V(persona,
      `That was "${prevTrack.title}." Next, ${track.artist} — same orbit, new shape.`,
      `"${prevTrack.title}" done. Queuing ${track.artist} — neighboring cluster.`,
      `Loved that? Here's ${track.artist} next — same neighborhood.`);
  }

  if (event === 'courage') {
    return V(persona,
      `You've gone further tonight than you usually do. That's the whole point. I'm proud of your ears.`,
      `New session record: ring ${toRing + 1}. Your reachable graph just expanded.`,
      `Look at you — past your comfort zone and still here. Keep going, or pull back. Your call.`);
  }

  if (event === 'safety') {
    return V(persona,
      `I noticed you slipping past a couple of these. Want me to bring us back toward calmer water?`,
      `Two skips in a row out here. Want me to drop the radius back to familiar ground?`,
      `That's a couple you weren't feeling. No shame — want me to pull us back in?`);
  }

  if (event === 'not-for-me') {
    return V(persona,
      `Noted — I'll steer around that. Trying a gentler neighbor.`,
      `Logged as a miss. Adjusting the vector — next pick is closer to home.`,
      `Got it, not your thing. I'll find something kinder.`);
  }

  if (event === 'mood') {
    return V(persona,
      `Reading the room: ${payload.mood}. Starting somewhere that fits the light.`,
      `Mood vector set: "${payload.mood}." Matching attack, low-end, vocal distance.`,
      `"${payload.mood}" — I know exactly where to start. Here we go.`);
  }

  if (event === 'welcome') {
    return V(persona,
      `Welcome to Late Hours. I'm ${payload.name}. Pull the dial when you're ready to drift — I'll meet you out there.`,
      `${payload.name} on the board. The dial traces a spiral out from your core. Tune anywhere; I'll explain what we hit.`,
      `Hey — ${payload.name} here. Think of me as a friend with the aux. Drift whenever; I've got you.`);
  }

  return 'One moment — listening.';
}

export interface DjChatContext {
  track: Track;
  radius: number;
}

export interface DjChatResult {
  text: string;
  /** If set, the caller should apply this new radius (mirrors the design's setRadius side-effect). */
  newRadius?: number;
}

export function replyToChat(text: string, ctx: DjChatContext): DjChatResult {
  const t = text.toLowerCase();
  const { track, radius } = ctx;

  if (t.includes('why')) {
    const why = track.ring === 0
      ? 'It matches your replay pattern exactly — slow, vocal-forward, atmospheric.'
      : track.ring === 1
      ? 'It keeps the dreamy vocal layering you replay, but introduces softer electronic textures underneath.'
      : track.ring === 2
      ? 'It shares pace and emotional weather with Lumen Hollow, but trades guitar for piano.'
      : track.ring === 3
      ? 'It uses three sounds from tracks in your top 50, just in unfamiliar arrangements.'
      : "It's far out, yes — but the vocal cadence echoes what you listen to most. Worth one minute.";
    return { text: `"${track.title}" sits ${track.ring + 1} ring${track.ring === 0 ? '' : 's'} from your core. ${why}` };
  }

  if (t.includes('further') || t.includes('out') || t.includes('adventurous')) {
    const newRadius = Math.min(100, radius + 18);
    return { text: `Raising your radius. We'll move into ${newRadius > 80 ? 'deep space' : 'edge territory'} — I'll narrate as we go.`, newRadius };
  }

  if (t.includes('back') || t.includes('pull') || t.includes('safe') || t.includes('familiar')) {
    const newRadius = Math.max(0, radius - 18);
    return { text: `Pulling you back inward. Returning to ${newRadius < 25 ? 'your inner circle' : 'adjacent ground'}.`, newRadius };
  }

  if (t.includes('region') || t.includes('where')) {
    const regions = ['Dream pop core', 'Shoegaze edges', 'Ambient jazz neighborhood', 'IDM / drone region', 'Deep experimental space'];
    return { text: `You're in ${regions[track.ring]}. Other listeners who orbit here tend to drift toward ${track.ring < 4 ? 'the next ring out' : 'lower-case experimental work'} eventually.` };
  }

  if (t.includes('how') && t.includes('adventurous')) {
    const pct = Math.min(100, (track.ring / 4) * 100);
    return { text: `On a scale of comfort to chaos, this is at ${pct}%. ${pct < 25 ? 'Comfort listening.' : pct < 50 ? 'Adjacent — gentle stretch.' : pct < 80 ? "A real expansion of your map." : 'Far past your usual orbit.'}` };
  }

  if (t.includes('mood') || t.includes('feel')) {
    return { text: `Reading the current track's atmosphere: slow attack, distant vocals, warm low-end. Want me to build a queue around that feeling instead?` };
  }

  return { text: `Listening. Try: "why this song?", "take me further", or "pull me back".` };
}
