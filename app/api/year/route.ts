import { NextRequest, NextResponse } from "next/server";
import { resolveReleaseYear } from "@/lib/musicbrainz";

export async function GET(request: NextRequest) {
  const isrc = request.nextUrl.searchParams.get("isrc");
  const fallbackParam = request.nextUrl.searchParams.get("fallback");
  const fallbackYear = fallbackParam ? parseInt(fallbackParam, 10) : null;

  if (!isrc) {
    return NextResponse.json({ error: "Missing isrc" }, { status: 400 });
  }

  const resolution = await resolveReleaseYear(
    isrc,
    Number.isNaN(fallbackYear) ? null : fallbackYear
  );
  return NextResponse.json(resolution);
}
