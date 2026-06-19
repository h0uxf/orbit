import { randomUUID } from 'crypto';
import { Router } from 'express';
import { asc, eq } from 'drizzle-orm';
import type { DjEvent, PersonaId } from '@orbit/shared';
import { db } from '../db/client.js';
import { chatMessages, tracks } from '../db/schema.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { narrateEvent, replyToChat } from '../services/djScript.js';

export const djRouter = Router();
djRouter.use(requireAuth);

async function loadTrack(id?: string) {
  if (!id) return undefined;
  const row = await db.query.tracks.findFirst({ where: eq(tracks.id, id) });
  if (!row) return undefined;
  return {
    id: row.id,
    spotifyTrackId: row.spotifyTrackId,
    spotifyUri: row.spotifyUri,
    title: row.title,
    artist: row.artist,
    genre: row.genre,
    ring: row.ring,
    radius: row.radius,
    seed: row.seed,
    lengthMs: row.lengthMs,
    freq: row.freq,
    isNew: row.isNew,
  };
}

async function persistMessage(userId: string, who: 'me' | 'dj', text: string) {
  await db.insert(chatMessages).values({ id: randomUUID(), userId, who, text });
}

interface NarrateBody {
  event: DjEvent;
  trackId?: string;
  prevTrackId?: string;
  fromRing?: number;
  toRing?: number;
  direction?: 'out' | 'in' | 'lateral';
  persona?: PersonaId;
  mood?: string;
  name?: string;
}

djRouter.post('/narrate', async (req, res) => {
  const body = req.body as NarrateBody;
  const track = await loadTrack(body.trackId);
  const prevTrack = await loadTrack(body.prevTrackId);

  const text = narrateEvent(body.event, {
    track,
    prevTrack,
    fromRing: body.fromRing,
    toRing: body.toRing,
    direction: body.direction,
    persona: body.persona,
    mood: body.mood,
    name: body.name,
  });

  await persistMessage(req.userId!, 'dj', text);
  res.json({ text });
});

interface ChatBody {
  text: string;
  trackId: string;
  radius: number;
}

djRouter.post('/chat', async (req, res) => {
  const body = req.body as ChatBody;
  const track = await loadTrack(body.trackId);
  if (!track) {
    res.status(400).json({ error: 'Unknown trackId' });
    return;
  }

  await persistMessage(req.userId!, 'me', body.text);
  const result = replyToChat(body.text, { track, radius: body.radius });
  await persistMessage(req.userId!, 'dj', result.text);

  res.json(result);
});

djRouter.get('/messages', async (req, res) => {
  const rows = await db
    .select()
    .from(chatMessages)
    .where(eq(chatMessages.userId, req.userId!))
    .orderBy(asc(chatMessages.createdAt));
  res.json({ messages: rows.map((r) => ({ who: r.who, text: r.text })) });
});
