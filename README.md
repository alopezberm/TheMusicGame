# The Music Game

Clon personal de Hitster: inicia sesión con Spotify Premium, elige playlists y
juega a adivinar el año, el artista y el título de cada canción mientras el
audio suena en tu propio dispositivo Spotify (móvil, altavoz, ordenador…).

## Cómo funciona (arquitectura, resumida)

- **Reproducción — Spotify Connect como mando a distancia.** La app nunca
  reproduce audio en el navegador (el Web Playback SDK no funciona de forma
  fiable en móviles). En su lugar, envía comandos `play`/`next` a través de la
  Web API de Spotify a un dispositivo ya activo — normalmente la propia app
  nativa de Spotify en tu móvil. Antes de jugar, abre Spotify una vez y dale a
  reproducir cualquier cosa para "activarlo" como dispositivo; el juego lo
  detecta solo.
- **Sesión sin caducar.** Auth.js (NextAuth) gestiona el login OAuth2 con
  Spotify y renueva el token de acceso en segundo plano usando el refresh
  token, todo en una cookie cifrada — sin base de datos.
- **Año real de la canción.** Para cada canción se busca su ISRC en
  MusicBrainz y se toma la fecha de lanzamiento más antigua entre todas sus
  publicaciones, para no mostrar el año de un recopilatorio de "Grandes
  Éxitos". El resultado se cachea de forma indefinida (los años no cambian).

## Configurar tus playlists

Edita [`config/playlists.ts`](config/playlists.ts) — es un array sencillo con
el nombre que quieras mostrar y el ID de la playlist de Spotify (la parte de
la URL después de `/playlist/`).

## Puesta en marcha

1. Instala dependencias: `npm install`
2. Crea una app en el [Spotify Developer Dashboard](https://developer.spotify.com/dashboard):
   - Añade `http://localhost:3000/api/auth/callback/spotify` como Redirect URI
     (y también la URL de producción cuando despliegues, p. ej.
     `https://tu-app.vercel.app/api/auth/callback/spotify`).
   - En "Users and Access", añade tu propia cuenta de Spotify — la app se
     queda en modo Development, así que solo las cuentas añadidas ahí pueden
     iniciar sesión.
3. Copia `.env.local.example` a `.env.local` y rellena:
   - `AUTH_SPOTIFY_ID` / `AUTH_SPOTIFY_SECRET` — del dashboard de Spotify.
   - `AUTH_SECRET` — genera uno con `npx auth secret`.
   - `AUTH_URL` — `http://localhost:3000` en local.
4. `npm run dev` y abre [http://localhost:3000](http://localhost:3000).

Necesitas una cuenta **Spotify Premium** (la Web API de control de
reproducción no funciona con cuentas gratuitas) y tener la app de Spotify
abierta en algún dispositivo durante la partida.

## Desplegar en Vercel

Despliega el repo normalmente en Vercel y configura las mismas variables de
entorno ahí (con `AUTH_URL` apuntando a tu dominio de Vercel). Añade también
esa URL de callback como Redirect URI en el dashboard de Spotify.
