import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { PLAYLISTS } from "@/config/playlists";

const EXTRA_TEST_PLAYLISTS = [
  { name: "Top 200 temazos España (copia nueva)", spotifyId: "4wETXPBcj5KtBadKMrA9Cq" },
];

// Temporary: for every configured playlist, report its track count and
// owner, and whether the owner is the signed-in user — to check whether
// only self-owned playlists work.
export async function GET() {
  const session = await auth();
  if (!session?.accessToken) {
    return NextResponse.json({ error: "no session" }, { status: 401 });
  }

  const meRes = await fetch("https://api.spotify.com/v1/me", {
    headers: { Authorization: `Bearer ${session.accessToken}` },
  });
  const me = await meRes.json();

  const results = await Promise.all(
    [...PLAYLISTS, ...EXTRA_TEST_PLAYLISTS].map(async (p) => {
      const res = await fetch(
        `https://api.spotify.com/v1/playlists/${p.spotifyId}?fields=id,name,items.total,owner.id,owner.display_name,public,collaborative`,
        { headers: { Authorization: `Bearer ${session.accessToken}` } }
      );
      const text = await res.text();
      let json: Record<string, unknown> | null = null;
      try {
        json = JSON.parse(text);
      } catch {
        // ignore
      }
      const owner = (json?.owner ?? null) as { id?: string; display_name?: string } | null;
      return {
        name: p.name,
        spotifyId: p.spotifyId,
        status: res.status,
        trackCount: (json?.items as { total?: number } | undefined)?.total ?? null,
        ownerId: owner?.id ?? null,
        ownerName: owner?.display_name ?? null,
        isMine: owner?.id === me.id,
        rawError: res.ok ? null : text.slice(0, 150),
      };
    })
  );

  return NextResponse.json({ myUserId: me.id, results });
}
