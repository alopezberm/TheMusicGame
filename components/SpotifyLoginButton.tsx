"use client";

import { motion } from "framer-motion";
import { signIn } from "next-auth/react";

export function SpotifyLoginButton() {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      whileHover={{ scale: 1.03 }}
      onClick={() => signIn("spotify", { callbackUrl: "/select" })}
      className="flex items-center gap-3 rounded-full bg-[#1ED760] px-8 py-4 text-lg font-semibold text-black shadow-[0_0_40px_-10px_#1ED760] transition-shadow hover:shadow-[0_0_55px_-5px_#1ED760]"
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden>
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.52 17.34a.75.75 0 0 1-1.03.25c-2.82-1.72-6.37-2.11-10.55-1.16a.75.75 0 1 1-.33-1.46c4.58-1.04 8.5-.6 11.66 1.34.36.22.47.68.25 1.03zm1.47-3.27a.94.94 0 0 1-1.29.31c-3.23-1.98-8.15-2.56-11.97-1.4a.94.94 0 1 1-.55-1.8c4.37-1.32 9.8-.68 13.5 1.6.44.27.58.85.31 1.29zm.13-3.4C15.7 8.5 8.4 8.27 4.58 9.44a1.13 1.13 0 1 1-.66-2.16c4.38-1.33 12.4-1.06 17.3 1.86a1.13 1.13 0 0 1-1.1 1.97z" />
      </svg>
      Conectar con Spotify
    </motion.button>
  );
}
