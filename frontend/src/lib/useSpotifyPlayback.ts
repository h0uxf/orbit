import { useCallback, useEffect, useRef, useState } from 'react';
import { createOrbitPlayer, playUri } from './spotifyPlayer';

export interface SpotifyPlaybackState {
  ready: boolean;
  error: string | null;
  playing: boolean;
  /** 0..1 fraction through the current track, matching the design's progress prop. */
  progress: number;
  play: (uri: string) => Promise<void>;
  togglePlay: () => void;
}

const POLL_MS = 500;

export function useSpotifyPlayback(): SpotifyPlaybackState {
  const playerRef = useRef<Spotify.Player | null>(null);
  const deviceIdRef = useRef<string | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let cancelled = false;
    createOrbitPlayer()
      .then(({ player, deviceId }) => {
        if (cancelled) return;
        playerRef.current = player;
        deviceIdRef.current = deviceId;
        setReady(true);
      })
      .catch((err) => setError(err.message));
    return () => {
      cancelled = true;
      playerRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    const id = setInterval(async () => {
      const state = await playerRef.current?.getCurrentState();
      if (!state) return;
      setPlaying(!state.paused);
      setProgress(state.duration > 0 ? state.position / state.duration : 0);
    }, POLL_MS);
    return () => clearInterval(id);
  }, [ready]);

  const play = useCallback(async (uri: string) => {
    if (!deviceIdRef.current) return;
    await playUri(deviceIdRef.current, uri);
  }, []);

  const togglePlay = useCallback(() => {
    playerRef.current?.togglePlay();
  }, []);

  return { ready, error, playing, progress, play, togglePlay };
}
