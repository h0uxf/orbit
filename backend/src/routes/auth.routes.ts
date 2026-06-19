import { randomUUID } from 'crypto';
import { Router } from 'express';
import { eq } from 'drizzle-orm';
import { db } from '../db/client.js';
import { users } from '../db/schema.js';
import {
  buildAuthorizeUrl,
  exchangeCodeForTokens,
  fetchProfile,
  refreshAccessToken,
} from '../services/spotifyClient.js';
import { codeChallengeFromVerifier, generateCodeVerifier, generateState } from '../utils/pkce.js';
import { decrypt, encrypt } from '../utils/crypto.js';
import {
  PKCE_COOKIE,
  SESSION_COOKIE,
  createSessionToken,
  pkceCookieOptions,
  sessionCookieOptions,
} from '../auth/session.js';
import { env } from '../config/env.js';
import { requireAuth } from '../middleware/requireAuth.js';

export const authRouter = Router();

authRouter.get('/login', (req, res) => {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = codeChallengeFromVerifier(codeVerifier);
  res.cookie(PKCE_COOKIE, JSON.stringify({ state, codeVerifier }), pkceCookieOptions);
  res.redirect(buildAuthorizeUrl(state, codeChallenge));
});

authRouter.get('/callback', async (req, res) => {
  const { code, state, error } = req.query as Record<string, string | undefined>;
  const raw = req.cookies?.[PKCE_COOKIE];
  res.clearCookie(PKCE_COOKIE, pkceCookieOptions);

  if (error || !code || !raw) {
    res.redirect(`${env.FRONTEND_URL}/login?error=spotify_denied`);
    return;
  }

  const { state: expectedState, codeVerifier } = JSON.parse(raw) as { state: string; codeVerifier: string };
  if (state !== expectedState) {
    res.redirect(`${env.FRONTEND_URL}/login?error=state_mismatch`);
    return;
  }

  try {
    const tokens = await exchangeCodeForTokens(code, codeVerifier);
    const profile = await fetchProfile(tokens.access_token);
    if (!tokens.refresh_token) throw new Error('Spotify did not return a refresh token');

    const existing = await db.query.users.findFirst({ where: eq(users.spotifyId, profile.id) });
    const refreshTokenEnc = encrypt(tokens.refresh_token);

    let userId: string;
    if (existing) {
      userId = existing.id;
      await db.update(users)
        .set({ displayName: profile.display_name, email: profile.email, refreshTokenEnc })
        .where(eq(users.id, userId));
    } else {
      userId = randomUUID();
      await db.insert(users).values({
        id: userId,
        spotifyId: profile.id,
        displayName: profile.display_name,
        email: profile.email,
        refreshTokenEnc,
      });
    }

    res.cookie(SESSION_COOKIE, createSessionToken(userId), sessionCookieOptions);
    res.redirect(`${env.FRONTEND_URL}/`);
  } catch (err) {
    console.error('Spotify OAuth callback failed', err);
    res.redirect(`${env.FRONTEND_URL}/login?error=callback_failed`);
  }
});

authRouter.post('/logout', (_req, res) => {
  res.clearCookie(SESSION_COOKIE, sessionCookieOptions);
  res.status(204).end();
});

authRouter.get('/me', requireAuth, async (req, res) => {
  const user = await db.query.users.findFirst({ where: eq(users.id, req.userId!) });
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  res.json({ id: user.id, displayName: user.displayName, email: user.email });
});

// Mints a short-lived Spotify access token for the Web Playback SDK. The
// refresh token never leaves the server.
authRouter.get('/token', requireAuth, async (req, res) => {
  const user = await db.query.users.findFirst({ where: eq(users.id, req.userId!) });
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  try {
    const refreshToken = decrypt(user.refreshTokenEnc);
    const tokens = await refreshAccessToken(refreshToken);
    if (tokens.refresh_token) {
      await db.update(users).set({ refreshTokenEnc: encrypt(tokens.refresh_token) }).where(eq(users.id, user.id));
    }
    res.json({ accessToken: tokens.access_token, expiresIn: tokens.expires_in });
  } catch (err) {
    console.error('Failed to mint Spotify access token', err);
    res.status(502).json({ error: 'Failed to refresh Spotify token' });
  }
});
