import { NextResponse } from "next/server";
import { auth } from "@/auth";

// Temporary diagnostic: uses the caller's own session to check why playlist
// lookups are failing. Tests a known-public Spotify-owned playlist so a
// failure here means an auth/token problem, not a bad playlist ID.
export async function GET() {
  const session = await auth();
  if (!session?.accessToken) {
    return NextResponse.json(
      { error: "No hay sesión o accessToken", sessionError: session?.error ?? null },
      { status: 401 }
    );
  }

  const testId = "37i9dQZF1DX4o1oenSJRJd"; // Spotify's own official "All Out 2000s"
  const res = await fetch(
    `https://api.spotify.com/v1/playlists/${testId}?fields=id,name,tracks.total`,
    { headers: { Authorization: `Bearer ${session.accessToken}` } }
  );
  const body = await res.text();

  return NextResponse.json({
    spotifyStatus: res.status,
    spotifyBody: body.slice(0, 800),
    sessionError: session.error ?? null,
  });
}
