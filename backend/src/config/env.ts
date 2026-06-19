import 'dotenv/config';

function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

export const env = {
  PORT: Number(process.env.PORT) || 4000,
  DATABASE_URL: required('DATABASE_URL'),
  SESSION_SECRET: required('SESSION_SECRET'),
  TOKEN_ENCRYPTION_KEY: required('TOKEN_ENCRYPTION_KEY'),
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  SPOTIFY_CLIENT_ID: required('SPOTIFY_CLIENT_ID'),
  SPOTIFY_CLIENT_SECRET: required('SPOTIFY_CLIENT_SECRET'),
  SPOTIFY_REDIRECT_URI: required('SPOTIFY_REDIRECT_URI'),
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  isProduction: process.env.NODE_ENV === 'production',
};
