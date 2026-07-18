"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { PLAYLISTS } from "@/config/playlists";
import { getPlaylistMeta } from "@/lib/spotify";
import { PlaylistPicker, type PlaylistOption } from "@/components/PlaylistPicker";
import { LoadingState } from "@/components/LoadingState";

export default function SelectPage() {
  const { data: session, status } = useSession();
  const [playlists, setPlaylists] = useState<PlaylistOption[] | null>(null);

  useEffect(() => {
    if (status !== "authenticated" || !session?.accessToken) return;
    let cancelled = false;

    (async () => {
      const metas = await Promise.all(
        PLAYLISTS.map(async (p) => {
          const meta = await getPlaylistMeta(p.spotifyId, session.accessToken!).catch(
            () => null
          );
          return {
            spotifyId: p.spotifyId,
            name: p.name,
            trackCount: meta?.trackCount ?? null,
          };
        })
      );
      if (!cancelled) setPlaylists(metas);
    })();

    return () => {
      cancelled = true;
    };
  }, [status, session?.accessToken]);

  if (status === "loading" || !playlists) {
    return <LoadingState label="Cargando tus playlists…" />;
  }

  if (PLAYLISTS.length === 0) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-2xl font-bold">No hay playlists configuradas</h1>
        <p className="max-w-sm text-white/50">
          Añade alguna en <code className="text-accent-2">config/playlists.ts</code>{" "}
          para poder empezar a jugar.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-8 px-6 py-12">
      <header className="space-y-2 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-accent-2">Paso 1</p>
        <h1 className="text-3xl font-bold">Elige tus playlists</h1>
        <p className="text-sm text-white/50">
          Puedes seleccionar varias — se mezclarán todas las canciones.
        </p>
      </header>

      <PlaylistPicker playlists={playlists} />

      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/" })}
        className="text-center text-xs text-white/30 underline-offset-4 hover:underline"
      >
        Cerrar sesión
      </button>
    </main>
  );
}
