export interface PlaylistConfigEntry {
  name: string;
  spotifyId: string;
}

export interface PlaylistMeta {
  id: string;
  name: string;
  trackCount: number;
}

export interface Track {
  id: string;
  uri: string;
  name: string;
  artists: string;
  isrc: string | null;
  albumYear: number | null;
}

export interface ResolvedTrack extends Track {
  year: number | null;
  yearApprox: boolean;
}

export interface SpotifyDevice {
  id: string | null;
  name: string;
  type: string;
  is_active: boolean;
}
