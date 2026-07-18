"use client";

import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { getAllPlaylistTracks, getDevices, playTrackOnDevice } from "@/lib/spotify";
import { shuffle } from "@/lib/shuffle";
import type { ResolvedTrack, SpotifyDevice, Track } from "@/lib/types";
import { LoadingState } from "@/components/LoadingState";
import { DeviceGate } from "@/components/DeviceGate";
import { GameStage } from "@/components/GameStage";

interface YearInfo {
  year: number | null;
  approx: boolean;
}

interface StoredGameState {
  queue: Track[];
  index: number;
}

async function resolveYear(track: Track): Promise<YearInfo> {
  if (!track.isrc) return { year: track.albumYear, approx: true };
  try {
    const res = await fetch(
      `/api/year?isrc=${encodeURIComponent(track.isrc)}&fallback=${track.albumYear ?? ""}`
    );
    if (!res.ok) return { year: track.albumYear, approx: true };
    return (await res.json()) as YearInfo;
  } catch {
    return { year: track.albumYear, approx: true };
  }
}

function readStoredGameState(storageKey: string): StoredGameState | null {
  if (typeof window === "undefined") return null;
  const stored = sessionStorage.getItem(storageKey);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as StoredGameState;
  } catch {
    return null;
  }
}

// Resolved years never change once fetched, so this cache lives at module
// scope (not in a ref) — it's plain data, not something render should treat
// as a ref, and it happily survives across GameStage remounts.
const yearCache = new Map<string, YearInfo>();

export function PlayScreen() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const playlistIds = useMemo(
    () => (searchParams.get("playlists") ?? "").split(",").filter(Boolean),
    [searchParams]
  );
  const storageKey = `tmg:queue:${playlistIds.join(",")}`;

  // Restore an in-progress game synchronously on first render so a refresh
  // never causes a fresh shuffle or an extra loading flash.
  const [initialGameState] = useState(() => readStoredGameState(storageKey));
  const [tracksLoading, setTracksLoading] = useState(!initialGameState);
  const [queue, setQueue] = useState<Track[]>(initialGameState?.queue ?? []);
  const [queueIndex, setQueueIndex] = useState(initialGameState?.index ?? 0);

  const [devices, setDevices] = useState<SpotifyDevice[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [deviceChecking, setDeviceChecking] = useState(true);
  const [deviceCheckTrigger, setDeviceCheckTrigger] = useState(0);
  const deviceLockedRef = useRef(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [, bumpYearVersion] = useReducer((n: number) => n + 1, 0);

  const accessToken = session?.accessToken;

  // Redirect back if this page was reached without any playlist selected.
  useEffect(() => {
    if (status === "authenticated" && playlistIds.length === 0) {
      router.replace("/select");
    }
  }, [status, playlistIds.length, router]);

  // Poll for an active Spotify Connect device until the user has one ready.
  useEffect(() => {
    if (status !== "authenticated" || !accessToken) return;
    let cancelled = false;

    async function check() {
      setDeviceChecking(true);
      try {
        const found = await getDevices(accessToken!);
        if (cancelled) return;
        setDevices(found);
        if (!deviceLockedRef.current) {
          const preferred = found.find((d) => d.is_active) ?? found[0];
          if (preferred?.id) {
            setSelectedDeviceId(preferred.id);
          }
        }
      } catch {
        // Spotify API hiccup — the interval will retry.
      } finally {
        if (!cancelled) setDeviceChecking(false);
      }
    }

    check();
    const timer = setInterval(check, 3000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [status, accessToken, deviceCheckTrigger]);

  // Build the shuffled queue, unless it was already restored from sessionStorage.
  useEffect(() => {
    if (!tracksLoading) return;
    if (status !== "authenticated" || !accessToken || playlistIds.length === 0) return;
    let cancelled = false;

    (async () => {
      const perPlaylist = await Promise.all(
        playlistIds.map((id) => getAllPlaylistTracks(id, accessToken).catch(() => []))
      );
      const merged = new Map<string, Track>();
      for (const list of perPlaylist) for (const t of list) merged.set(t.id, t);
      const shuffled = shuffle(Array.from(merged.values()));
      if (!cancelled) {
        setQueue(shuffled);
        setQueueIndex(0);
        setTracksLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [tracksLoading, status, accessToken, playlistIds]);

  // Keep the in-progress game persisted across accidental refreshes.
  useEffect(() => {
    if (queue.length > 0) {
      sessionStorage.setItem(storageKey, JSON.stringify({ queue, index: queueIndex }));
    }
  }, [queue, queueIndex, storageKey]);

  const currentTrack = queue[queueIndex] ?? null;

  // Load + secretly play whatever track is now current.
  useEffect(() => {
    if (!currentTrack || !selectedDeviceId || !accessToken) return;

    playTrackOnDevice(accessToken, selectedDeviceId, currentTrack.uri)
      .then(() => setErrorMsg(null))
      .catch(() => {
        setErrorMsg(
          "No se pudo reproducir en Spotify. Comprueba que el dispositivo siga activo."
        );
      });

    if (!yearCache.has(currentTrack.id)) {
      resolveYear(currentTrack).then((info) => {
        yearCache.set(currentTrack.id, info);
        bumpYearVersion();
      });
    }

    const upcoming = queue[queueIndex + 1];
    if (upcoming && !yearCache.has(upcoming.id)) {
      resolveYear(upcoming).then((info) => yearCache.set(upcoming.id, info));
    }
  }, [currentTrack, selectedDeviceId, accessToken, queue, queueIndex]);

  function nextTrack() {
    const nextIndex = queueIndex + 1;
    if (nextIndex >= queue.length) {
      let reshuffled = shuffle(queue);
      if (reshuffled.length > 1 && reshuffled[0].id === queue[queue.length - 1]?.id) {
        reshuffled = [reshuffled[1], reshuffled[0], ...reshuffled.slice(2)];
      }
      setQueue(reshuffled);
      setQueueIndex(0);
      return;
    }
    setQueueIndex(nextIndex);
  }

  function selectDevice(deviceId: string) {
    deviceLockedRef.current = true;
    setSelectedDeviceId(deviceId);
  }

  if (status === "loading") {
    return <LoadingState label="Conectando con Spotify…" />;
  }

  if (session?.error === "RefreshAccessTokenError") {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-xl font-bold">Tu sesión de Spotify ha caducado</h1>
        <button
          type="button"
          onClick={() => signIn("spotify", { callbackUrl: "/select" })}
          className="rounded-full bg-accent px-6 py-3 font-semibold"
        >
          Volver a iniciar sesión
        </button>
      </main>
    );
  }

  if (playlistIds.length === 0) return null;

  if (tracksLoading) {
    return <LoadingState label="Barajando las canciones…" />;
  }

  if (queue.length === 0) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-xl font-bold">No se encontraron canciones</h1>
        <p className="text-white/50">
          Revisa que las playlists seleccionadas tengan canciones disponibles.
        </p>
      </main>
    );
  }

  if (!selectedDeviceId) {
    return (
      <DeviceGate
        checking={deviceChecking}
        onRetry={() => setDeviceCheckTrigger((n) => n + 1)}
      />
    );
  }

  const yearInfo = currentTrack ? yearCache.get(currentTrack.id) ?? null : null;
  const resolved: ResolvedTrack | null = currentTrack
    ? {
        ...currentTrack,
        year: yearInfo?.year ?? null,
        yearApprox: yearInfo?.approx ?? false,
      }
    : null;

  return (
    <GameStage
      key={currentTrack?.id ?? "none"}
      track={resolved}
      onNext={nextTrack}
      devices={devices}
      selectedDeviceId={selectedDeviceId}
      onSelectDevice={selectDevice}
      errorMsg={errorMsg}
    />
  );
}
