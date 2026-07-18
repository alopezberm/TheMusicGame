import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { SpotifyLoginButton } from "@/components/SpotifyLoginButton";

export default async function HomePage() {
  const session = await auth();
  if (session) redirect("/select");

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-10 px-6 text-center">
      <div className="space-y-4">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-accent-2">
          Noche de juego
        </p>
        <h1 className="text-4xl font-bold sm:text-5xl">The Music Game</h1>
        <p className="mx-auto max-w-sm text-white/60">
          Adivina el año, el artista y el título de cada canción. Conecta tu
          cuenta de Spotify Premium para empezar.
        </p>
      </div>
      <SpotifyLoginButton />
      <p className="max-w-xs text-xs text-white/30">
        Necesitas Spotify Premium y tener la app de Spotify abierta en algún
        dispositivo (móvil, altavoz, ordenador) durante la partida.
      </p>
    </main>
  );
}
