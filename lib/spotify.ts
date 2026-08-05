import type { SpotifyDevice, Track } from "@/lib/types";

const API_BASE = "https://api.spotify.com/v1";

class SpotifyApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function spotifyFetch<T>(
  path: string,
  accessToken: string,
  init?: RequestInit,
  retriesLeft = 3
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

  // Spotify's rate limit — back off for the time it tells us and retry,
  // instead of treating a busy moment as "this playlist doesn't exist".
  if (response.status === 429 && retriesLeft > 0) {
    const waitSeconds = Number(response.headers.get("retry-after")) || 1;
    await delay(waitSeconds * 1000);
    return spotifyFetch<T>(path, accessToken, init, retriesLeft - 1);
  }

  if (!response.ok) {
    throw new SpotifyApiError(
      response.status,
      `Spotify API ${path} failed: ${response.status}`
    );
  }

  const text = await response.text();
  return text ? (JSON.parse(text) as T) : null;
}

// Runs async work over `items` with at most `limit` in flight at once —
// firing dozens of Spotify requests in one Promise.all is what triggers the
// rate limit above in the first place.
export async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const current = nextIndex++;
      results[current] = await fn(items[current]);
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

function yearFromReleaseDate(releaseDate: string | undefined): number | null {
  if (!releaseDate) return null;
  const year = parseInt(releaseDate.slice(0, 4), 10);
  return Number.isNaN(year) ? null : year;
}

interface RawPlaylistTrackItem {
  // Likewise, each paging entry's nested track object is now called "item"
  // (it used to be called "track").
  item: {
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
  // The dedicated tracks sub-resource is now called "items", not "tracks".
  let path: string | null = `/playlists/${spotifyId}/items?fields=items(item(id,uri,name,is_local,type,artists(name),external_ids,album(release_date))),next&limit=100`;

  while (path) {
    const page: PlaylistTracksPage | null = await spotifyFetch<PlaylistTracksPage>(
      path,
      accessToken
    );
    if (!page) break;

    for (const entry of page.items) {
      const t = entry.item;
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

// No uris/context in the body — Spotify resumes the current track from
// wherever it was paused, instead of restarting it from the beginning.
export async function resumePlayback(
  accessToken: string,
  deviceId: string
): Promise<void> {
  await spotifyFetch(`/me/player/play?device_id=${deviceId}`, accessToken, {
    method: "PUT",
  });
}
