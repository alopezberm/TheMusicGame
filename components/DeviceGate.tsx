"use client";

import { motion } from "framer-motion";

export function DeviceGate({
  checking,
  onRetry,
}: {
  checking: boolean;
  onRetry: () => void;
}) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
      <motion.div
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="flex h-20 w-20 items-center justify-center rounded-full bg-[#1ED760]/10 text-4xl"
      >
        🎵
      </motion.div>
      <h1 className="text-2xl font-bold">Activa un dispositivo Spotify</h1>
      <p className="max-w-sm text-white/60">
        Abre la app de Spotify en tu móvil, altavoz u ordenador y dale a
        reproducir cualquier canción un segundo. Luego vuelve aquí — el juego
        la detectará automáticamente y la usará como reproductor.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="rounded-full border border-white/20 px-6 py-3 text-sm font-medium hover:border-white/40"
      >
        {checking ? "Buscando…" : "Reintentar"}
      </button>
    </main>
  );
}
