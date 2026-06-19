import { Router } from 'express';
import { asc } from 'drizzle-orm';
import { stationsFromTracks, TONIGHT_SET } from '@orbit/shared';
import { db } from '../db/client.js';
import { tracks } from '../db/schema.js';

export const stationsRouter = Router();

stationsRouter.get('/', async (_req, res) => {
  const rows = await db.select().from(tracks).orderBy(asc(tracks.radius));
  const catalog = rows.map((r) => ({
    id: r.id,
    spotifyTrackId: r.spotifyTrackId,
    spotifyUri: r.spotifyUri,
    title: r.title,
    artist: r.artist,
    genre: r.genre,
    ring: r.ring,
    radius: r.radius,
    seed: r.seed,
    lengthMs: r.lengthMs,
    freq: r.freq,
    isNew: r.isNew,
  }));
  res.json({ stations: stationsFromTracks(catalog), tonightSet: TONIGHT_SET });
});
