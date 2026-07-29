import { NextResponse } from "next/server";
import { auth } from "@/auth";

// Temporary: verify the fixed fields= param works against the dedicated
// /playlists/{id}/tracks endpoint too (not just the embedded one).
export async function GET() {
  const session = await auth();
  if (!session?.accessToken) {
    return NextResponse.json({ error: "no session" }, { status: 401 });
  }

  const id = "3R2vm6wOGrJfhUFtfKy3EL"; // Todo 60s
  const res = await fetch(
    `https://api.spotify.com/v1/playlists/${id}/tracks?fields=items(item(id,uri,name,is_local,type,artists(name),external_ids,album(release_date))),next&limit=3`,
    { headers: { Authorization: `Bearer ${session.accessToken}` } }
  );
  const json = await res.json();

  return NextResponse.json({
    status: res.status,
    topLevelKeys: Object.keys(json),
    itemsLength: Array.isArray(json.items) ? json.items.length : null,
    firstItem: json.items?.[0] ?? null,
    next: json.next ?? null,
  });
}
