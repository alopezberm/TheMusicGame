import type { PlaylistConfigEntry } from "@/lib/types";

// ---------------------------------------------------------------------------
// THE MUSIC GAME — catalogo de playlists
// ---------------------------------------------------------------------------
// Edita este array para anadir, quitar o renombrar las playlists que
// aparecen en la pantalla de seleccion del juego.
//
//   name       -> lo que se muestra en la app (puedes ponerle el nombre que
//                 quieras, no tiene por que coincidir con el de Spotify).
//   spotifyId  -> el identificador de la playlist en Spotify. Es la parte de
//                 la URL/enlace que va despues de "/playlist/" y antes de
//                 cualquier "?", por ejemplo:
//
//                 https://open.spotify.com/playlist/37i9dQZF1DX4o1oenSJRJd
//                                                    ^^^^^^^^^^^^^^^^^^^^^^
//                                                    esto es el spotifyId
//
// Guarda el archivo y listo, no hace falta tocar nada mas.
// ---------------------------------------------------------------------------

export const PLAYLISTS: PlaylistConfigEntry[] = [
  { name: "Fiesta 2000s", spotifyId: "37i9dQZF1DX4o1oenSJRJd" },
  { name: "Grandes Exitos 80s", spotifyId: "37i9dQZF1DXb57FjYWz00c" },
  { name: "Rock Clasico", spotifyId: "37i9dQZF1DWXRqgorJj26U" },
];
