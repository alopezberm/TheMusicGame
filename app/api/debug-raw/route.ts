import { NextResponse } from "next/server";
import { auth } from "@/auth";

// Temporary: fetch a couple of failing playlists WITHOUT the fields= filter
// to see the raw shape Spotify actually returns.
export async function GET() {
  const session = await auth();
  if (!session?.accessToken) {
    return NextResponse.json({ error: "no session" }, { status: 401 });
  }

  const ids = ["20kxyNTykQPlbmt15fiPqY", "3R2vm6wOGrJfhUFtfKy3EL"]; // Hitster Temazos, 60s
  const results = await Promise.all(
    ids.map(async (id) => {
      const filtered = await fetch(
        `https://api.spotify.com/v1/playlists/${id}?fields=id,name,tracks.total`,
        { headers: { Authorization: `Bearer ${session.accessToken}` } }
      );
      const filteredBody = await filtered.text();

      const raw = await fetch(`https://api.spotify.com/v1/playlists/${id}`, {
        headers: { Authorization: `Bearer ${session.accessToken}` },
      });
      const rawBody = await raw.text();
      const rawJson = JSON.parse(rawBody);

      return {
        id,
        filteredStatus: filtered.status,
        filteredBody: filteredBody.slice(0, 300),
        rawStatus: raw.status,
        rawKeys: Object.keys(rawJson),
        rawTracksField: rawJson.tracks
          ? { total: rawJson.tracks.total, hasItems: !!rawJson.tracks.items }
          : "MISSING",
      };
    })
  );

  return NextResponse.json({ results });
}
