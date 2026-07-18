"use client";

import { motion } from "framer-motion";

export function LoadingState({ label }: { label: string }) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
        className="h-16 w-16 rounded-full border-4 border-white/10 border-t-accent"
      />
      <p className="text-white/60">{label}</p>
    </main>
  );
}
