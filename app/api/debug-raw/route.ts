import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session?.accessToken) {
    return NextResponse.json({ error: "no session" }, { status: 401 });
  }

  const id = "3R2vm6wOGrJfhUFtfKy3EL"; // Todo 60s

  async function tryFetch(label: string, url: string) {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${session!.accessToken}` },
    });
    const text = await res.text();
    return { label, status: res.status, body: text.slice(0, 400) };
  }

  const results = await Promise.all([
    tryFetch("no fields", `https://api.spotify.com/v1/playlists/${id}/tracks?limit=2`),
    tryFetch(
      "simple fields",
      `https://api.spotify.com/v1/playlists/${id}/tracks?fields=items&limit=2`
    ),
    tryFetch(
      "nested item() fields",
      `https://api.spotify.com/v1/playlists/${id}/tracks?fields=items(item(id,name)),next&limit=2`
    ),
  ]);

  return NextResponse.json({ results });
}
