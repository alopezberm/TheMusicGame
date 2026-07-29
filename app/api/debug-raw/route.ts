import { NextResponse } from "next/server";
import { auth } from "@/auth";

// Temporary: inspect the actual current shape of Spotify's playlist response
// — the "tracks" wrapper we assumed no longer seems to exist. Keeps the
// output small (no full track list) so it's easy to copy-paste.
export async function GET() {
  const session = await auth();
  if (!session?.accessToken) {
    return NextResponse.json({ error: "no session" }, { status: 401 });
  }

  const id = "3R2vm6wOGrJfhUFtfKy3EL"; // Todo 60s
  const raw = await fetch(`https://api.spotify.com/v1/playlists/${id}`, {
    headers: { Authorization: `Bearer ${session.accessToken}` },
  });
  const json = await raw.json();

  const items = json.items ?? json.tracks?.items ?? null;

  return NextResponse.json({
    topLevelKeys: Object.keys(json),
    hasTracksWrapper: "tracks" in json,
    tracksWrapperKeys: json.tracks ? Object.keys(json.tracks) : null,
    itemsIsArray: Array.isArray(items),
    itemsLength: Array.isArray(items) ? items.length : null,
    firstItemKeys:
      Array.isArray(items) && items[0] ? Object.keys(items[0]) : null,
    firstItemSample: Array.isArray(items) ? items[0] : null,
    paginationHints: {
      next: json.next ?? null,
      previous: json.previous ?? null,
      total: json.total ?? null,
      limit: json.limit ?? null,
      offset: json.offset ?? null,
    },
  });
}
