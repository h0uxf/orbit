import { eq } from 'drizzle-orm';
import { db } from '../db/client.js';
import { users } from '../db/schema.js';
import { decrypt, encrypt } from '../utils/crypto.js';
import { refreshAccessToken } from './spotifyClient.js';

export interface FreshToken {
  accessToken: string;
  expiresIn: number;
}

// Mints a short-lived Spotify access token from a user's stored refresh
// token. The refresh token never leaves the server; any rotated refresh
// token Spotify returns is re-encrypted and persisted.
export async function getFreshAccessToken(userId: string): Promise<FreshToken> {
  const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
  if (!user) throw new Error('User not found');

  const refreshToken = decrypt(user.refreshTokenEnc);
  const tokens = await refreshAccessToken(refreshToken);
  if (tokens.refresh_token) {
    await db.update(users).set({ refreshTokenEnc: encrypt(tokens.refresh_token) }).where(eq(users.id, user.id));
  }
  return { accessToken: tokens.access_token, expiresIn: tokens.expires_in };
}
