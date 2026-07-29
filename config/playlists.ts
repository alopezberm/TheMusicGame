import type { PlaylistConfigEntry } from "@/lib/types";

// ---------------------------------------------------------------------------
// THE MUSIC GAME — catalogo de playlists
// ---------------------------------------------------------------------------
// Edita este array para anadir, quitar o renombrar las playlists que
// aparecen en la pantalla de seleccion del juego. El ORDEN del array es el
// orden en que se muestran en la app.
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
// OJO — IMPORTANTE: Spotify solo devuelve el contenido completo (numero de
// canciones, tracklist) de las playlists que son TUYAS (creadas por tu
// cuenta). Las de otros usuarios (aunque sean publicas y las seas) responden
// bien pero sin datos, y la app las trata como vacias. Para usar una
// playlist que no es tuya: abrela, selecciona todas las canciones (Ctrl+A en
// el escritorio) y anadelas a una playlist nueva tuya; usa el ID de esa
// copia aqui.
//
// Guarda el archivo y listo, no hace falta tocar nada mas.
// ---------------------------------------------------------------------------

export const PLAYLISTS: PlaylistConfigEntry[] = [
  // --- Generales: décadas (todas copias propias) ---------------------------
  { name: "60s", spotifyId: "3R2vm6wOGrJfhUFtfKy3EL" },
  { name: "70s", spotifyId: "4dQKdsRBcgkBf7pHeHIqmV" },
  { name: "80s", spotifyId: "1ZUF6yc07BAAub0N5gNT7o" },
  { name: "90s", spotifyId: "2V0IhSDAgqIEw7Uvjbc6sm" },
  { name: "2000s", spotifyId: "1ofO5TzI5x4A82z2MLYHaw" },
  { name: "2010s", spotifyId: "5gFgkG2j8kf8LRRc3XlvW4" },
  { name: "2020s", spotifyId: "4dY9hw3ef6fGI2jiY2KKmO" },

  // --- España ---------------------------------------------------------------
  { name: "Top 200 Temazos España de Siempre", spotifyId: "4wETXPBcj5KtBadKMrA9Cq" },

  // --- Género -----------------------------------------------------------
  { name: "Rock Español", spotifyId: "6AD1HeEUnZ3UQuN5eJw2Tz" },
  { name: "Mix Rock", spotifyId: "5W2RZZe2gIphtFMdlPIVfN" },
  { name: "Rap Tranquilo", spotifyId: "3QCRydncYscMQwAGMgSV6Z" },

  // --- Fiesta / ambiente --------------------------------------------------
  { name: "Caseta (Feria)", spotifyId: "1uesUIRBzbSHIsH3O7I2iS" },
  { name: "De Trankis", spotifyId: "5owsQN6049lhhHsrmxID7p" },
];
