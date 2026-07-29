import { NextResponse } from "next/server";
import { auth } from "@/auth";

// Temporary: inspect the actual current shape of Spotify's playlist response
// — the "tracks" wrapper we assumed no longer seems to exist, and "items" at
// the top level turned out not to be an array — probably the paging object
// itself (renamed from "tracks" to "items"). Drilling one level deeper.
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

  const wrapper = json.items;
  const innerItems = wrapper?.items ?? null;

  return NextResponse.json({
    typeOfTopLevelItems: typeof wrapper,
    wrapperKeys: wrapper && typeof wrapper === "object" ? Object.keys(wrapper) : null,
    wrapperTotal: wrapper?.total ?? null,
    innerItemsIsArray: Array.isArray(innerItems),
    innerItemsLength: Array.isArray(innerItems) ? innerItems.length : null,
    firstInnerItemKeys:
      Array.isArray(innerItems) && innerItems[0] ? Object.keys(innerItems[0]) : null,
    firstInnerItemSample: Array.isArray(innerItems) ? innerItems[0] : null,
  });
}
