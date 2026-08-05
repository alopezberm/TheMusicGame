export function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Merges several playlists' tracks so every playlist gets equal turns,
// regardless of size — a 700-track playlist otherwise drowns out a 50-track
// one in a plain flat shuffle. Builds it round by round: shuffle each
// playlist's own tracks, shuffle the order playlists go in this round, then
// take one track from every playlist still holding cards. A playlist that
// runs out simply stops being picked in later rounds.
export function buildBalancedQueue<T extends { id: string }>(perSource: T[][]): T[] {
  // Shared across sources: a track already claimed by an earlier playlist
  // is skipped in the rest, so the same song picked twice never plays twice.
  const seen = new Set<string>();
  const buckets = perSource
    .map((list) => {
      const unique = list.filter((item) => {
        if (seen.has(item.id)) return false;
        seen.add(item.id);
        return true;
      });
      return shuffle(unique);
    })
    .filter((bucket) => bucket.length > 0);

  const cursors = new Array(buckets.length).fill(0);
  const queue: T[] = [];
  let remaining = buckets.reduce((sum, bucket) => sum + bucket.length, 0);

  while (remaining > 0) {
    const activeIndexes = buckets
      .map((_, i) => i)
      .filter((i) => cursors[i] < buckets[i].length);
    for (const i of shuffle(activeIndexes)) {
      queue.push(buckets[i][cursors[i]]);
      cursors[i]++;
      remaining--;
    }
  }

  return queue;
}
