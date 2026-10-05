"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  RotateCcw,
} from "lucide-react";
import type { RoutineExercise } from "@/lib/types";
import { cn, formatSeconds } from "@/lib/utils";

interface WorkoutPlayerProps {
  routineTitle: string;
  items: RoutineExercise[];
  onExitHref?: string;
}

export function WorkoutPlayer({
  routineTitle,
  items,
  onExitHref = "..",
}: WorkoutPlayerProps) {
  const ordered = useMemo(
    () => [...items].sort((a, b) => a.order_index - b.order_index),
    [items]
  );

  const [index, setIndex] = useState(0);
  const [restRemaining, setRestRemaining] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [completed, setCompleted] = useState(false);

  const current = ordered[index];
  const exercise = current?.exercise;
  const progress = ordered.length
    ? ((index + (completed ? 1 : 0)) / ordered.length) * 100
    : 0;

  useEffect(() => {
    if (!isResting || isPaused || restRemaining <= 0) return;

    const timer = window.setInterval(() => {
      setRestRemaining((value) => {
        if (value <= 1) {
          setIsResting(false);
          setIsPaused(false);
          return 0;
        }
        return value - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isResting, isPaused, restRemaining]);

  function startRest() {
    if (!current) return;
    setRestRemaining(current.rest_seconds);
    setIsResting(true);
    setIsPaused(false);
  }

  function togglePause() {
    if (!isResting) return;
    setIsPaused((value) => !value);
  }

  function resetRest() {
    if (!current) return;
    setRestRemaining(current.rest_seconds);
    setIsResting(true);
    setIsPaused(false);
  }

  function goNext() {
    if (index >= ordered.length - 1) {
      setCompleted(true);
      setIsResting(false);
      return;
    }
    setIndex((value) => value + 1);
    setIsResting(false);
    setIsPaused(false);
    setRestRemaining(0);
  }

  function goPrev() {
    if (index === 0) return;
    setIndex((value) => value - 1);
    setCompleted(false);
    setIsResting(false);
    setIsPaused(false);
    setRestRemaining(0);
  }

  if (!ordered.length) {
    return (
      <div className="rounded-3xl bg-cream/80 p-8 text-center text-ink/70">
        Esta rutina aún no tiene ejercicios.
      </div>
    );
  }

  if (completed) {
    return (
      <section className="flex min-h-[70vh] flex-col items-center justify-center gap-6 rounded-[2rem] bg-ink px-6 py-12 text-center text-cream">
        <CheckCircle2 className="size-16 text-volt" strokeWidth={1.5} />
        <div>
          <p className="font-display text-sm uppercase tracking-[0.25em] text-volt">
            Entrenamiento completo
          </p>
          <h2 className="mt-3 font-display text-4xl tracking-tight sm:text-5xl">
            ¡Buen trabajo!
          </h2>
          <p className="mt-3 text-cream/70">{routineTitle}</p>
        </div>
        <a
          href={onExitHref}
          className="inline-flex min-h-14 items-center justify-center rounded-2xl bg-volt px-8 text-lg font-semibold text-ink transition hover:brightness-110"
        >
          Volver a la rutina
        </a>
      </section>
    );
  }

  const videoSrc = exercise?.video_url ?? null;
  const isEmbed = videoSrc?.includes("youtube.com") || videoSrc?.includes("youtu.be");

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-5">
      <header className="flex items-center justify-between gap-4">
        <div>
          <p className="font-display text-xs uppercase tracking-[0.22em] text-ink/50">
            {routineTitle}
          </p>
          <h1 className="mt-1 font-display text-2xl tracking-tight text-ink sm:text-3xl">
            {exercise?.title ?? "Ejercicio"}
          </h1>
        </div>
        <p className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-cream">
          {index + 1} / {ordered.length}
        </p>
      </header>

      <div className="h-2 overflow-hidden rounded-full bg-ink/10">
        <div
          className="h-full rounded-full bg-ember transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="overflow-hidden rounded-[1.75rem] bg-ink shadow-[0_24px_60px_-28px_rgba(11,31,51,0.55)]">
        <div className="relative aspect-video w-full bg-ink">
          {videoSrc ? (
            isEmbed ? (
              <iframe
                key={videoSrc}
                src={videoSrc}
                title={exercise?.title ?? "Video del ejercicio"}
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={videoSrc}
                alt={exercise?.title ?? "Demo del ejercicio"}
                className="absolute inset-0 h-full w-full object-cover"
              />
            )
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_30%_20%,#1f3b57,transparent_45%),linear-gradient(160deg,#0b1f33,#16324d)]">
              <p className="font-display text-2xl text-cream/80">Sin video</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[1.5rem] bg-cream/90 p-6 ring-1 ring-ink/5">
          <div className="flex flex-wrap items-end gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-ink/45">
                Series × Reps
              </p>
              <p className="mt-2 font-display text-5xl tracking-tight text-ink">
                {current.sets}
                <span className="mx-2 text-ember">×</span>
                {current.reps}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-ink/45">
                Descanso
              </p>
              <p className="mt-2 font-display text-3xl text-ink">
                {current.rest_seconds}s
              </p>
            </div>
          </div>
          {exercise?.description ? (
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink/70">
              {exercise.description}
            </p>
          ) : null}
        </div>

        <div
          className={cn(
            "rounded-[1.5rem] p-6 transition-colors",
            isResting ? "bg-ember text-ink" : "bg-ink text-cream"
          )}
        >
          <p className="text-xs uppercase tracking-[0.18em] opacity-70">
            Temporizador de descanso
          </p>
          <p className="mt-3 font-display text-6xl tracking-tight tabular-nums">
            {formatSeconds(isResting ? restRemaining : current.rest_seconds)}
          </p>

          <div className="mt-6 grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={isResting ? togglePause : startRest}
              className={cn(
                "inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl text-sm font-semibold transition",
                isResting
                  ? "bg-ink text-cream hover:bg-ink/90"
                  : "bg-volt text-ink hover:brightness-110"
              )}
            >
              {isResting ? (
                isPaused ? (
                  <>
                    <Play className="size-4" /> Play
                  </>
                ) : (
                  <>
                    <Pause className="size-4" /> Pause
                  </>
                )
              ) : (
                <>
                  <Play className="size-4" /> Iniciar
                </>
              )}
            </button>
            <button
              type="button"
              onClick={resetRest}
              className={cn(
                "inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl text-sm font-semibold transition",
                isResting
                  ? "bg-ink/15 text-ink hover:bg-ink/25"
                  : "bg-cream/10 text-cream hover:bg-cream/20"
              )}
            >
              <RotateCcw className="size-4" /> Reset
            </button>
            <button
              type="button"
              onClick={goNext}
              className={cn(
                "inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl text-sm font-semibold transition",
                isResting
                  ? "bg-ink text-cream hover:bg-ink/90"
                  : "bg-cream text-ink hover:bg-white"
              )}
            >
              Siguiente
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={goPrev}
          disabled={index === 0}
          className="inline-flex min-h-16 flex-1 items-center justify-center gap-2 rounded-2xl bg-cream text-lg font-semibold text-ink ring-1 ring-ink/10 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="size-5" />
          Anterior
        </button>
        <button
          type="button"
          onClick={goNext}
          className="inline-flex min-h-16 flex-[1.4] items-center justify-center gap-2 rounded-2xl bg-ember text-lg font-semibold text-ink transition hover:brightness-105"
        >
          {index >= ordered.length - 1
            ? "Finalizar entrenamiento"
            : "Siguiente ejercicio"}
          <ChevronRight className="size-5" />
        </button>
      </div>
    </section>
  );
}
