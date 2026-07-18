"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ResolvedTrack, SpotifyDevice } from "@/lib/types";

interface Props {
  track: ResolvedTrack | null;
  onNext: () => void;
  devices: SpotifyDevice[];
  selectedDeviceId: string | null;
  onSelectDevice: (deviceId: string) => void;
  errorMsg: string | null;
}

// Keyed by track id from the parent, so a new track remounts this component
// and resets `revealed` for free — no effect needed to reset it manually.
export function GameStage({
  track,
  onNext,
  devices,
  selectedDeviceId,
  onSelectDevice,
  errorMsg,
}: Props) {
  const [revealed, setRevealed] = useState(false);
  const selectedDevice = devices.find((d) => d.id === selectedDeviceId);

  return (
    <main className="flex flex-1 flex-col items-center justify-between px-6 py-10">
      <div className="flex items-center gap-2 text-xs text-white/40">
        <span className="h-2 w-2 rounded-full bg-[#1ED760]" />
        {devices.length > 1 ? (
          <select
            value={selectedDeviceId ?? ""}
            onChange={(e) => onSelectDevice(e.target.value)}
            className="rounded bg-transparent text-white/60"
          >
            {devices.map((d) => (
              <option key={d.id ?? d.name} value={d.id ?? ""} className="bg-black">
                {d.name}
              </option>
            ))}
          </select>
        ) : (
          <span>Sonando en {selectedDevice?.name ?? "tu dispositivo"}</span>
        )}
      </div>

      {errorMsg ? (
        <div className="mt-3 max-w-sm rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-center text-xs text-red-200">
          {errorMsg}
        </div>
      ) : null}

      <div className="flex flex-1 flex-col items-center justify-center gap-10">
        <button
          type="button"
          onClick={() => setRevealed((r) => !r)}
          aria-label={revealed ? "Ocultar" : "Revelar canción"}
          className="relative flex h-56 w-56 items-center justify-center rounded-full bg-gradient-to-b from-white/10 to-white/[0.02] shadow-[0_0_80px_-20px_#a855f7]"
        >
          <motion.span
            animate={revealed ? {} : { rotate: 360 }}
            transition={{ repeat: revealed ? 0 : Infinity, duration: 8, ease: "linear" }}
            className="absolute inset-4 rounded-full border border-dashed border-white/10"
          />
          <span className="text-5xl">{revealed ? "🔍" : "?"}</span>
        </button>

        <AnimatePresence mode="wait">
          {revealed && track ? (
            <motion.div
              key={track.id}
              initial={{ rotateX: -90, opacity: 0 }}
              animate={{ rotateX: 0, opacity: 1 }}
              exit={{ rotateX: 90, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-6 text-center"
            >
              {track.year ? (
                <p className="text-4xl font-bold text-accent-2">
                  {track.year}
                  {track.yearApprox ? (
                    <span className="ml-2 align-middle text-xs font-normal text-white/30">
                      aprox.
                    </span>
                  ) : null}
                </p>
              ) : (
                <div className="mx-auto h-9 w-24 animate-pulse rounded bg-white/10" />
              )}
              <p className="mt-2 text-xl font-semibold">{track.name}</p>
              <p className="text-white/50">{track.artists}</p>
            </motion.div>
          ) : (
            <motion.p key="hint" className="text-sm text-white/30">
              Toca el disco para revelar
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <button
        type="button"
        onClick={onNext}
        className="w-full max-w-sm rounded-full bg-white/5 px-6 py-4 text-base font-semibold transition-colors hover:bg-white/10"
      >
        Siguiente canción →
      </button>
    </main>
  );
}
