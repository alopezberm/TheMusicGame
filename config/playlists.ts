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
// cuenta). Las de otros usuarios (aunque sean publicas y las sigas) responden
// bien pero sin datos, y la app las trata como vacias. Para usar una
// playlist que no es tuya: abrela, selecciona todas las canciones (Ctrl+A en
// el escritorio) y anadelas a una playlist nueva tuya; usa el ID de esa
// copia aqui.
//
// Guarda el archivo y listo, no hace falta tocar nada mas.
// ---------------------------------------------------------------------------

export const PLAYLISTS: PlaylistConfigEntry[] = [
  // --- Décadas --------------------------------------------------------------
  { name: "60s", spotifyId: "3R2vm6wOGrJfhUFtfKy3EL" },
  { name: "70s", spotifyId: "4dQKdsRBcgkBf7pHeHIqmV" },
  { name: "80s", spotifyId: "1ZUF6yc07BAAub0N5gNT7o" },
  { name: "90s", spotifyId: "2V0IhSDAgqIEw7Uvjbc6sm" },
  { name: "2000s", spotifyId: "1ofO5TzI5x4A82z2MLYHaw" },
  { name: "2010s", spotifyId: "5gFgkG2j8kf8LRRc3XlvW4" },
  { name: "2020s", spotifyId: "4dY9hw3ef6fGI2jiY2KKmO" },

  // --- Hitster (hechas para el juego) ----------------------------------------
  { name: "Hitster", spotifyId: "2WBXjLXb5vtZob7G2GEBav" },
  { name: "Hitster Temazos", spotifyId: "1EOcfLmcvPtFtNEvNnCtDs" },
  { name: "Hitster Español", spotifyId: "3ABKp21jRz4EjsqoRRfZ54" },
  { name: "Hitster Español (100%)", spotifyId: "55PFeP9CtG5R3WMp0aGxUo" },
  { name: "Hitster Español (Temazos)", spotifyId: "4l5qfdvW6Zzm4Fjr9A08us" },
  { name: "Hitster Español (Summer Party)", spotifyId: "05PL4PYPgTLGbH4iyNM0uc" },
  { name: "Hitster Español (Bingo)", spotifyId: "5QgAqNBNO1bxN3Dp2oNJhJ" },
  { name: "Hitster (Platinum Edition)", spotifyId: "6dKmxQKdEmPePZZwwd4sqZ" },
  { name: "Hitster US", spotifyId: "4mghwHrxT3Myfb2zeVg2Pa" },

  // --- España, por época ------------------------------------------------
  { name: "España — Top 200 de Siempre", spotifyId: "4wETXPBcj5KtBadKMrA9Cq" },
  { name: "España — 2010", spotifyId: "4FKFnsnUwb6FfbERESm2Ge" },

  // --- Rock -----------------------------------------------------------------
  { name: "Rock Español", spotifyId: "6AD1HeEUnZ3UQuN5eJw2Tz" },
  { name: "Rock (Mix)", spotifyId: "5W2RZZe2gIphtFMdlPIVfN" },
  { name: "Rock Clásico", spotifyId: "4yKPGfitWrJkQCYuKYGFE6" },
  { name: "Hitster Rock Español", spotifyId: "4Rep0d8GhXJsDErKyYvgUX" },
  { name: "Hitster Rock (Edition)", spotifyId: "4BVI7DEjKnZRnnXVEcySIJ" },

  // --- Pop --------------------------------------------------------------
  { name: "Pop en Inglés (Top 100)", spotifyId: "2cOX0EEUUM3kQl1GKNeDY0" },
  { name: "Pop Internacional (2000-2026)", spotifyId: "4Rx5ceo1eu3UI0nBjLXrpM" },
  { name: "Pop Punk 2000s", spotifyId: "46JFc6qJlSjCWJAbQVqCg0" },

  // --- Indie ------------------------------------------------------------
  { name: "Indie (Variado)", spotifyId: "7jgdZ6aeJSgke9jwxrHVc4" },
  { name: "Indie España (Tops)", spotifyId: "29fik7OKHVXJfGy92xR8AR" },

  // --- Rap / Reggaetón ----------------------------------------------------
  { name: "Rap Español (Míticas y Nuevas)", spotifyId: "77KGsy9PBz41YDPU6LbK3F" },
  { name: "Rap Español (Temazos)", spotifyId: "05L0hk7RcKbtG1BcN5FQqb" },
  { name: "Rap Tranquilo", spotifyId: "3QCRydncYscMQwAGMgSV6Z" },
  { name: "Reggaetón (Top 50)", spotifyId: "12giGkTcQa0hZFx0Vc22CR" },
  { name: "Reggaetón (Variado)", spotifyId: "1zboorQGMUZDPWVn5SlwVP" },

  // --- Bandas sonoras -----------------------------------------------------
  { name: "Bandas Sonoras y Películas", spotifyId: "2F2ejuYpIHm2yQNuPbkrPg" },

  // --- Fiesta / ambiente --------------------------------------------------
  { name: "Caseta (Feria)", spotifyId: "1uesUIRBzbSHIsH3O7I2iS" },
  { name: "De Trankis", spotifyId: "5owsQN6049lhhHsrmxID7p" },
  { name: "Verbena (Mix)", spotifyId: "5ZOFcPMTs7y2YNlJ9ErJK4" },
  { name: "Verbena de Pueblo", spotifyId: "3PobPyF4k0qW7uxtTFkuKu" },
];
