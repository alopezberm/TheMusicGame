import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { PLAYLISTS } from "@/config/playlists";
import { mapWithConcurrency } from "@/lib/spotify";

// Temporary: fetch real track counts + ownership for the whole catalog once,
// so they can be hardcoded into config/playlists.ts (no more live fetching
// needed on /select).
export async function GET() {
  const session = await auth();
  if (!session?.accessToken) {
    return NextResponse.json({ error: "no session" }, { status: 401 });
  }

  const meRes = await fetch("https://api.spotify.com/v1/me", {
    headers: { Authorization: `Bearer ${session.accessToken}` },
  });
  const me = await meRes.json();

  const results = await mapWithConcurrency(PLAYLISTS, 5, async (p) => {
    const res = await fetch(
      `https://api.spotify.com/v1/playlists/${p.spotifyId}?fields=items.total,owner.id`,
      { headers: { Authorization: `Bearer ${session!.accessToken}` } }
    );
    const text = await res.text();
    let json: Record<string, unknown> | null = null;
    try {
      json = JSON.parse(text);
    } catch {
      // ignore
    }
    const owner = (json?.owner ?? null) as { id?: string } | null;
    return {
      name: p.name,
      spotifyId: p.spotifyId,
      status: res.status,
      trackCount: (json?.items as { total?: number } | undefined)?.total ?? null,
      isMine: owner?.id === me.id,
    };
  });

  return NextResponse.json({ results });
}
