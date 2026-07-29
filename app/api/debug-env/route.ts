import { NextResponse } from "next/server";

// Temporary, safe-to-expose diagnostic: reports only presence/length of each
// required env var, never the actual secret values. Removed once the
// production "Configuration" error is diagnosed.
export async function GET() {
  const id = process.env.AUTH_SPOTIFY_ID ?? "";
  const secret = process.env.AUTH_SPOTIFY_SECRET ?? "";
  const authSecret = process.env.AUTH_SECRET ?? "";
  const authUrl = process.env.AUTH_URL ?? "";

  return NextResponse.json({
    AUTH_SPOTIFY_ID_present: id.length > 0,
    AUTH_SPOTIFY_ID_length: id.length,
    AUTH_SPOTIFY_SECRET_present: secret.length > 0,
    AUTH_SPOTIFY_SECRET_length: secret.length,
    AUTH_SECRET_present: authSecret.length > 0,
    AUTH_SECRET_length: authSecret.length,
    AUTH_URL: authUrl || null,
  });
}
