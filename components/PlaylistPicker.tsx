"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export interface PlaylistOption {
  spotifyId: string;
  name: string;
  trackCount: number | null;
}

// Starting a game fetches every selected playlist's full tracklist from
// Spotify at once — capping the selection keeps that burst reasonable and
// avoids tripping the API's rate limit.
const MAX_SELECTED = 12;

export function PlaylistPicker({ playlists }: { playlists: PlaylistOption[] }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const router = useRouter();
  const atLimit = selected.size >= MAX_SELECTED;

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else if (next.size < MAX_SELECTED) {
        next.add(id);
      }
      return next;
    });
  }

  function start() {
    const ids = Array.from(selected).join(",");
    router.push(`/play?playlists=${encodeURIComponent(ids)}`);
  }

  return (
    <>
      <div className="flex flex-col gap-3">
        {playlists.map((p) => {
          const isSelected = selected.has(p.spotifyId);
          const isMissing = p.trackCount === null;
          const isDisabled = isMissing || (!isSelected && atLimit);
          return (
            <motion.button
              key={p.spotifyId}
              type="button"
              disabled={isDisabled}
              whileTap={{ scale: isDisabled ? 1 : 0.98 }}
              onClick={() => toggle(p.spotifyId)}
              className={`flex items-center justify-between rounded-2xl border px-5 py-4 text-left transition-colors ${
                isDisabled
                  ? "border-white/5 bg-white/[0.02] opacity-40"
                  : isSelected
                  ? "border-accent bg-accent/10"
                  : "border-white/10 bg-white/[0.03] hover:border-white/20"
              }`}
            >
              <span>
                <span className="block font-medium">{p.name}</span>
                <span className="block text-xs text-white/40">
                  {isMissing
                    ? "No se encontró esta playlist en Spotify"
                    : `${p.trackCount} canciones`}
                </span>
              </span>
              <span
                className={`h-5 w-5 shrink-0 rounded-full border-2 ${
                  isSelected ? "border-accent bg-accent" : "border-white/20"
                }`}
              />
            </motion.button>
          );
        })}
      </div>

      <p className="text-center text-xs text-white/40">
        {selected.size} / {MAX_SELECTED} seleccionadas
      </p>

      <motion.button
        type="button"
        disabled={selected.size === 0}
        whileTap={{ scale: 0.97 }}
        onClick={start}
        className="mt-auto w-full rounded-full bg-accent px-6 py-4 text-lg font-semibold text-white shadow-[0_0_40px_-10px_#a855f7] disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/30 disabled:shadow-none"
      >
        Empezar partida
      </motion.button>
    </>
  );
}
