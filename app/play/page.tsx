"use client";

import { Suspense } from "react";
import { PlayScreen } from "./PlayScreen";
import { LoadingState } from "@/components/LoadingState";

export default function PlayPage() {
  return (
    <Suspense fallback={<LoadingState label="Cargando…" />}>
      <PlayScreen />
    </Suspense>
  );
}
