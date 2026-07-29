import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session?.accessToken) {
    return NextResponse.json({ error: "no session" }, { status: 401 });
  }

  const id = "3R2vm6wOGrJfhUFtfKy3EL"; // Todo 60s (150 tracks total)

  async function tryFetch(label: string, url: string) {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${session!.accessToken}` },
    });
    const text = await res.text();
    let parsed: unknown = null;
    try {
      parsed = JSON.parse(text);
    } catch {
      // ignore
    }
    return { label, status: res.status, body: text.slice(0, 500), parsed };
  }

  const page1 = await tryFetch(
    "base endpoint, offset=0",
    `https://api.spotify.com/v1/playlists/${id}?fields=items.total,items.next,items.items(item(id,name))&offset=0&limit=5`
  );
  const page2 = await tryFetch(
    "base endpoint, offset=100",
    `https://api.spotify.com/v1/playlists/${id}?fields=items.total,items.next,items.items(item(id,name))&offset=100&limit=5`
  );

  // If Spotify gave us a `next` URL in the embedded items object, try it directly too.
  const nextUrl =
    page1.parsed &&
    typeof page1.parsed === "object" &&
    "items" in (page1.parsed as Record<string, unknown>)
      ? ((page1.parsed as { items?: { next?: string } }).items?.next ?? null)
      : null;
  const nextResult = nextUrl ? await tryFetch("following items.next url", nextUrl) : null;

  return NextResponse.json({ page1, page2, nextUrl, nextResult });
}
