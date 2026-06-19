import 'dotenv/config';
import { SEED_TRACKS, TONIGHT_SET } from '@orbit/shared';
import { db, pool } from './client.js';
import { tonightSetTracks, tracks } from './schema.js';
import { fetchClientCredentialsToken, searchTrack } from '../services/spotifyClient.js';

async function main() {
  console.log(`Seeding ${SEED_TRACKS.length} catalog tracks...`);

  let token: string | null = null;
  try {
    token = await fetchClientCredentialsToken();
  } catch (err) {
    console.warn('Could not get a Spotify client-credentials token — seeding without spotifyTrackId/uri.', err);
  }

  for (const t of SEED_TRACKS) {
    let spotifyTrackId: string | null = null;
    let spotifyUri: string | null = null;

    if (token) {
      try {
        const match = await searchTrack(token, t.title, t.artist);
        if (match) {
          spotifyTrackId = match.id;
          spotifyUri = match.uri;
        } else {
          console.warn(`No Spotify match for "${t.title}" by ${t.artist}`);
        }
      } catch (err) {
        console.warn(`Search failed for "${t.title}" by ${t.artist}`, err);
      }
    }

    await db
      .insert(tracks)
      .values({ ...t, spotifyTrackId, spotifyUri })
      .onConflictDoUpdate({
        target: tracks.id,
        set: { ...t, spotifyTrackId, spotifyUri },
      });
  }

  await db.delete(tonightSetTracks);
  for (let i = 0; i < TONIGHT_SET.trackIds.length; i++) {
    await db.insert(tonightSetTracks).values({ trackId: TONIGHT_SET.trackIds[i], position: i });
  }

  console.log('Seed complete.');
  await pool.end();
}

main().catch((err) => {
  console.error('Seed failed', err);
  process.exit(1);
});
