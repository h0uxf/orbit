import { api } from './api';

const SDK_URL = 'https://sdk.scdn.co/spotify-player.js';

let sdkLoadPromise: Promise<void> | null = null;

function loadSdk(): Promise<void> {
  if (sdkLoadPromise) return sdkLoadPromise;
  sdkLoadPromise = new Promise((resolve) => {
    if (window.Spotify) {
      resolve();
      return;
    }
    window.onSpotifyWebPlaybackSDKReady = () => resolve();
    const script = document.createElement('script');
    script.src = SDK_URL;
    script.async = true;
    document.body.appendChild(script);
  });
  return sdkLoadPromise;
}

interface TokenResponse {
  accessToken: string;
  expiresIn: number;
}

let cachedToken: { value: string; expiresAt: number } | null = null;

async function getFreshAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 10_000) {
    return cachedToken.value;
  }
  const { accessToken, expiresIn } = await api.get<TokenResponse>('/api/auth/token');
  cachedToken = { value: accessToken, expiresAt: Date.now() + expiresIn * 1000 };
  return accessToken;
}

export async function createOrbitPlayer(): Promise<{ player: Spotify.Player; deviceId: string }> {
  await loadSdk();
  const player = new window.Spotify.Player({
    name: 'Orbit',
    getOAuthToken: (cb) => {
      getFreshAccessToken().then(cb);
    },
    volume: 0.8,
  });

  const deviceId = await new Promise<string>((resolve, reject) => {
    player.addListener('ready', ({ device_id }) => resolve(device_id));
    player.addListener('initialization_error', (e) => reject(new Error(e.message)));
    player.addListener('authentication_error', (e) => reject(new Error(e.message)));
    player.addListener('account_error', (e) => reject(new Error(`Spotify account error: ${e.message} (Premium required)`)));
  });

  await player.connect();
  return { player, deviceId };
}

export async function playUri(deviceId: string, uri: string): Promise<void> {
  const accessToken = await getFreshAccessToken();
  const res = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ uris: [uri] }),
  });
  if (!res.ok && res.status !== 204) {
    throw new Error(`Failed to start playback: ${res.status} ${await res.text()}`);
  }
}
