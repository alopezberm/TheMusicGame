import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session?.accessToken) {
    return NextResponse.json({ error: "no session" }, { status: 401 });
  }

  const id = "3R2vm6wOGrJfhUFtfKy3EL"; // Todo 60s (150 tracks total)

  const res = await fetch(
    `https://api.spotify.com/v1/playlists/${id}/items?fields=items(item(id,name)),next&limit=5&offset=100`,
    { headers: { Authorization: `Bearer ${session.accessToken}` } }
  );
  const text = await res.text();

  return NextResponse.json({ status: res.status, body: text.slice(0, 500) });
}
