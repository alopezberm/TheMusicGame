const MB_BASE = "https://musicbrainz.org/ws/2";
const USER_AGENT = "TheMusicGame/1.0 (personal Hitster-style app)";

interface MusicBrainzRecording {
  "first-release-date"?: string;
}

interface MusicBrainzIsrcResponse {
  recordings?: MusicBrainzRecording[];
}

export interface YearResolution {
  year: number | null;
  approx: boolean;
}

// Real release years, keyed by ISRC, never change — force-cache lets Next.js's
// Data Cache persist this on Vercel indefinitely, so a track only ever hits
// MusicBrainz once across every future game.
export async function resolveReleaseYear(
  isrc: string,
  fallbackYear: number | null
): Promise<YearResolution> {
  try {
    const response = await fetch(`${MB_BASE}/isrc/${isrc}?fmt=json`, {
      headers: { "User-Agent": USER_AGENT },
      cache: "force-cache",
    });

    if (!response.ok) {
      return { year: fallbackYear, approx: true };
    }

    const data = (await response.json()) as MusicBrainzIsrcResponse;
    // A single ISRC can map to several recordings (e.g. a studio version and a
    // music video) — each already carries MusicBrainz's own earliest known
    // release date, so we just take the minimum across them.
    const years = (data.recordings ?? [])
      .map((recording) => recording["first-release-date"])
      .map((date) => (date ? parseInt(date.slice(0, 4), 10) : NaN))
      .filter((year) => !Number.isNaN(year));

    if (years.length === 0) {
      return { year: fallbackYear, approx: true };
    }

    return { year: Math.min(...years), approx: false };
  } catch {
    return { year: fallbackYear, approx: true };
  }
}
