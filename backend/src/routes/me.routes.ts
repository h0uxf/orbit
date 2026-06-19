import { Router } from 'express';
import type { TopArtist } from '@orbit/shared';
import { requireAuth } from '../middleware/requireAuth.js';
import { getFreshAccessToken } from '../services/userTokens.js';
import { fetchTopArtists } from '../services/spotifyClient.js';

export const meRouter = Router();
meRouter.use(requireAuth);

meRouter.get('/top-artists', async (req, res) => {
  try {
    const { accessToken } = await getFreshAccessToken(req.userId!);
    const artists = await fetchTopArtists(accessToken, 20);
    const result: TopArtist[] = artists.map((a) => ({ id: a.id, name: a.name, imageUrl: a.images[0]?.url ?? null }));
    res.json({ artists: result });
  } catch (err) {
    console.error('Failed to fetch Spotify top artists', err);
    res.status(502).json({ error: 'Failed to fetch Spotify top artists' });
  }
});
