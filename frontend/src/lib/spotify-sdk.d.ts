// Minimal ambient types for Spotify's Web Playback SDK (no official @types package).
declare namespace Spotify {
  interface PlayerInit {
    name: string;
    getOAuthToken(cb: (token: string) => void): void;
    volume?: number;
  }

  interface Track {
    uri: string;
    id: string | null;
    name: string;
    duration_ms: number;
  }

  interface WebPlaybackState {
    paused: boolean;
    position: number;
    duration: number;
    track_window: { current_track: Track };
  }

  interface Error {
    message: string;
  }

  class Player {
    constructor(init: PlayerInit);
    connect(): Promise<boolean>;
    disconnect(): void;
    addListener(event: 'ready' | 'not_ready', cb: (data: { device_id: string }) => void): void;
    addListener(event: 'player_state_changed', cb: (state: WebPlaybackState | null) => void): void;
    addListener(event: 'initialization_error' | 'authentication_error' | 'account_error' | 'playback_error', cb: (data: Error) => void): void;
    getCurrentState(): Promise<WebPlaybackState | null>;
    togglePlay(): Promise<void>;
    pause(): Promise<void>;
    resume(): Promise<void>;
    seek(positionMs: number): Promise<void>;
  }
}

interface Window {
  onSpotifyWebPlaybackSDKReady: () => void;
  Spotify: typeof Spotify;
}
