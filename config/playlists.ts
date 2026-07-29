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
// OJO: las playlists "editoriales" oficiales de Spotify (las que tienen un
// ID largo con el prefijo "37i9dQZF1DX...") NO funcionan aqui — la API de
// Spotify las bloquea para apps normales (da igual el token o el codigo,
// siempre devuelve 404). Si quieres una de esas, primero tienes que
// duplicarla en una playlist tuya (seleccionar todas las canciones -> anadir
// a una playlist nueva) y usar el ID de tu copia, que si es un ID normal.
//
// Guarda el archivo y listo, no hace falta tocar nada mas.
// ---------------------------------------------------------------------------

export const PLAYLISTS: PlaylistConfigEntry[] = [
  // --- Generales: primera eleccion, valen para cualquier grupo -------------
  { name: "Hitster España (temazos variados)", spotifyId: "1C3NDNNfg6c0SlPhyikGVU" },
  { name: "Hitster Temazos", spotifyId: "20kxyNTykQPlbmt15fiPqY" },
  { name: "Hitster US (100%)", spotifyId: "6lEEWbPCGtS3425Z9ub1pn" },
  { name: "60s", spotifyId: "3R2vm6wOGrJfhUFtfKy3EL" }, // copia propia
  { name: "70s", spotifyId: "4dQKdsRBcgkBf7pHeHIqmV" }, // copia propia
  { name: "80s", spotifyId: "1ZUF6yc07BAAub0N5gNT7o" }, // copia propia
  { name: "90s", spotifyId: "2V0IhSDAgqIEw7Uvjbc6sm" }, // copia propia
  { name: "2000s", spotifyId: "1ofO5TzI5x4A82z2MLYHaw" }, // copia propia
  { name: "2010s", spotifyId: "5gFgkG2j8kf8LRRc3XlvW4" }, // copia propia
  { name: "2020s", spotifyId: "4dY9hw3ef6fGI2jiY2KKmO" }, // copia propia

  // --- Específicas: España por época -----------------------------------
  { name: "España — Grandes Éxitos de Siempre (Top 200)", spotifyId: "7FcjbxLUFb3xUHUUXZbV4n" },
  { name: "España — Top 2000", spotifyId: "0n0JVWNy6uFhHpL0GNiReL" },
  // { name: "España — Clásicos 2000", spotifyId: "37i9dQZF1DX7alvT6zKWrM" }, // editorial, ver nota
  { name: "España — 2010", spotifyId: "6O8n2zKuiKEThRM2gQcFY3" },

  // --- Específicas: género -----------------------------------------------
  { name: "Pop en Inglés", spotifyId: "4Xwv0G0uD9WK6YCyq7MKw7" },
  { name: "Pop Punk 2000s", spotifyId: "1jQx9cBFAsfnMV0tckNMQz" },
  { name: "Rock Español", spotifyId: "6AD1HeEUnZ3UQuN5eJw2Tz" },
  { name: "Mix Rock", spotifyId: "5W2RZZe2gIphtFMdlPIVfN" },
  { name: "Indie España (Tops)", spotifyId: "6KjqKC4kLWUHaczO1zBkVd" },
  { name: "Indie España 2026", spotifyId: "0FRtJINEiR9aBhfKD1OM47" },
  { name: "Rap Español (Míticas y Nuevas)", spotifyId: "2UktWVOkzrX0732If5Tjc2" },
  { name: "Rap Temazos", spotifyId: "3Sy73vREOP0IRlXKNJsDtB" },
  { name: "Rap Tranquilo", spotifyId: "3QCRydncYscMQwAGMgSV6Z" },
  // { name: "Clásicos Hip Hop Latino", spotifyId: "37i9dQZF1DX7oE1ZquUHSd" }, // editorial, ver nota
  { name: "Reggaetón (Top 50)", spotifyId: "7jxz5GHDsfOa6rDAHMp5VO" },

  // --- Específicas: fiesta / ambiente --------------------------------------
  { name: "Hitster Español Summer Party", spotifyId: "0UY3oVANXRqflE5QjHhaH4" },
  { name: "Verbena", spotifyId: "1eRhuNzRHhwZLkOrYpxStj" },
  { name: "Fiestas de Pueblo", spotifyId: "7xcdrzs58PmLIZa4P5Qk3s" },
  { name: "Caseta (Feria)", spotifyId: "1uesUIRBzbSHIsH3O7I2iS" },
  { name: "De Trankis", spotifyId: "5owsQN6049lhhHsrmxID7p" },
  { name: "Inglés Tranki", spotifyId: "7BOBmVzKyN5pIxRsL8ul4k" },
];
