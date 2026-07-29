import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { PLAYLISTS } from "@/config/playlists";

// Temporary diagnostic: checks every configured playlist against Spotify
// using the caller's own session, to map out which ones fail and why.
export async function GET() {
  const session = await auth();
  if (!session?.accessToken) {
    return NextResponse.json(
      { error: "No hay sesión o accessToken", sessionError: session?.error ?? null },
      { status: 401 }
    );
  }

  const results = await Promise.all(
    PLAYLISTS.map(async (p) => {
      const res = await fetch(
        `https://api.spotify.com/v1/playlists/${p.spotifyId}?fields=id,name,tracks.total`,
        { headers: { Authorization: `Bearer ${session.accessToken}` } }
      );
      const body = await res.text();
      return {
        name: p.name,
        spotifyId: p.spotifyId,
        status: res.status,
        body: res.ok ? undefined : body.slice(0, 200),
      };
    })
  );

  return NextResponse.json({ results });
}
