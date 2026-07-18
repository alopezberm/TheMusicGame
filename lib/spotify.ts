import type { PlaylistMeta, SpotifyDevice, Track } from "@/lib/types";

const API_BASE = "https://api.spotify.com/v1";

class SpotifyApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function spotifyFetch<T>(
  path: string,
  accessToken: string,
  init?: RequestInit
): Promise<T | null> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (response.status === 204) return null;

  if (!response.ok) {
    throw new SpotifyApiError(
      response.status,
      `Spotify API ${path} failed: ${response.status}`
    );
  }

  const text = await response.text();
  return text ? (JSON.parse(text) as T) : null;
}

function yearFromReleaseDate(releaseDate: string | undefined): number | null {
  if (!releaseDate) return null;
  const year = parseInt(releaseDate.slice(0, 4), 10);
  return Number.isNaN(year) ? null : year;
}

export async function getPlaylistMeta(
  spotifyId: string,
  accessToken: string
): Promise<PlaylistMeta | null> {
  const data = await spotifyFetch<{ id: string; name: string; tracks: { total: number } }>(
    `/playlists/${spotifyId}?fields=id,name,tracks.total`,
    accessToken
  );
  if (!data) return null;
  return { id: data.id, name: data.name, trackCount: data.tracks.total };
}

interface RawPlaylistTrackItem {
  track: {
    id: string | null;
    uri: string;
    name: string;
    is_local: boolean;
    type: string;
    artists: { name: string }[];
    external_ids?: { isrc?: string };
    album?: { release_date?: string };
  } | null;
}

interface PlaylistTracksPage {
  items: RawPlaylistTrackItem[];
  next: string | null;
}

export async function getAllPlaylistTracks(
  spotifyId: string,
  accessToken: string
): Promise<Track[]> {
  const tracks: Track[] = [];
  let path: string | null = `/playlists/${spotifyId}/tracks?fields=items(track(id,uri,name,is_local,type,artists(name),external_ids,album(release_date))),next&limit=100`;

  while (path) {
    const page: PlaylistTracksPage | null = await spotifyFetch<PlaylistTracksPage>(
      path,
      accessToken
    );
    if (!page) break;

    for (const item of page.items) {
      const t = item.track;
      if (!t || t.is_local || t.type !== "track" || !t.id) continue;
      tracks.push({
        id: t.id,
        uri: t.uri,
        name: t.name,
        artists: t.artists.map((a) => a.name).join(", "),
        isrc: t.external_ids?.isrc ?? null,
        albumYear: yearFromReleaseDate(t.album?.release_date),
      });
    }

    path = page.next ? page.next.replace(API_BASE, "") : null;
  }

  return tracks;
}

export async function getDevices(accessToken: string): Promise<SpotifyDevice[]> {
  const data = await spotifyFetch<{ devices: SpotifyDevice[] }>(
    "/me/player/devices",
    accessToken
  );
  return data?.devices ?? [];
}

export async function playTrackOnDevice(
  accessToken: string,
  deviceId: string,
  trackUri: string
): Promise<void> {
  await spotifyFetch(`/me/player/play?device_id=${deviceId}`, accessToken, {
    method: "PUT",
    body: JSON.stringify({ uris: [trackUri] }),
  });
}

export async function pausePlayback(
  accessToken: string,
  deviceId: string
): Promise<void> {
  await spotifyFetch(`/me/player/pause?device_id=${deviceId}`, accessToken, {
    method: "PUT",
  });
}
