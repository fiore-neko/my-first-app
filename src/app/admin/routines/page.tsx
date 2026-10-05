"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUp, ArrowDown, Plus, Save } from "lucide-react";
import type { Exercise, Gym, RoutineObjective } from "@/lib/types";
import { getMockExercises, getMockGyms } from "@/lib/mock-data";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/utils";

interface DraftItem {
  exerciseId: string;
  sets: number;
  reps: number;
  restSeconds: number;
}

const OBJECTIVES: RoutineObjective[] = [
  "fuerza",
  "cardio",
  "movilidad",
  "express",
];

export default function AdminRoutinesPage() {
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [gymId, setGymId] = useState("");
  const [title, setTitle] = useState("");
  const [objective, setObjective] = useState<RoutineObjective>("fuerza");
  const [level, setLevel] = useState("intermedio");
  const [items, setItems] = useState<DraftItem[]>([]);
  const [selectedExercise, setSelectedExercise] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function boot() {
      if (!isSupabaseConfigured()) {
        const mockGyms = getMockGyms();
        const mockExercises = getMockExercises();
        setGyms(mockGyms);
        setExercises(mockExercises);
        setGymId(mockGyms[0]?.id ?? "");
        setSelectedExercise(mockExercises[0]?.id ?? "");
        return;
      }

      const supabase = createClient();
      const [{ data: gymData }, { data: exerciseData }] = await Promise.all([
        supabase.from("gyms").select("*").order("name"),
        supabase.from("exercises").select("*").order("title"),
      ]);

      const nextGyms = gymData?.length ? gymData : getMockGyms();
      const nextExercises = exerciseData?.length
        ? exerciseData
        : getMockExercises();

      setGyms(nextGyms);
      setExercises(nextExercises);
      setGymId(nextGyms[0]?.id ?? "");
      setSelectedExercise(nextExercises[0]?.id ?? "");
    }

    void boot();
  }, []);

  const exerciseMap = useMemo(
    () => new Map(exercises.map((exercise) => [exercise.id, exercise])),
    [exercises]
  );

  function addExercise() {
    if (!selectedExercise) return;
    setItems((prev) => [
      ...prev,
      {
        exerciseId: selectedExercise,
        sets: 3,
        reps: 10,
        restSeconds: 60,
      },
    ]);
  }

  function moveItem(index: number, direction: -1 | 1) {
    setItems((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function updateItem(index: number, patch: Partial<DraftItem>) {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...patch } : item))
    );
  }

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    if (!title || !gymId || !items.length) {
      setMessage("Completá título, gym y al menos un ejercicio.");
      return;
    }

    if (!isSupabaseConfigured()) {
      setMessage(
        "Rutina armada en demo. Conectá Supabase Auth + DB para guardarla."
      );
      return;
    }

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("Iniciá sesión en /admin para guardar rutinas.");
      return;
    }

    const { data: routine, error } = await supabase
      .from("routines")
      .insert({
        gym_id: gymId,
        title,
        objective,
        level,
      })
      .select()
      .single();

    if (error || !routine) {
      setMessage(error?.message ?? "No se pudo crear la rutina.");
      return;
    }

    const rows = items.map((item, index) => ({
      routine_id: routine.id,
      exercise_id: item.exerciseId,
      sets: item.sets,
      reps: item.reps,
      rest_seconds: item.restSeconds,
      order_index: index,
    }));

    const { error: linkError } = await supabase
      .from("routine_exercises")
      .insert(rows);

    if (linkError) {
      setMessage(linkError.message);
      return;
    }

    setMessage(`Rutina "${title}" guardada.`);
    setTitle("");
    setItems([]);
  }

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-5 py-8 sm:px-8">
      <header>
        <Link href="/admin" className="text-sm font-medium text-ink/60">
          ← Volver al admin
        </Link>
        <h1 className="mt-4 font-display text-4xl tracking-tight text-ink">
          Creador de rutinas
        </h1>
        <p className="mt-2 text-ink/65">
          Seleccioná ejercicios, definí series/reps y ordenalos.
        </p>
      </header>

      {message ? (
        <p className="rounded-2xl bg-sand px-4 py-3 text-sm text-ink/80">
          {message}
        </p>
      ) : null}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid gap-3 sm:grid-cols-2">
          <select
            value={gymId}
            onChange={(e) => setGymId(e.target.value)}
            className="min-h-12 rounded-xl bg-cream px-4 outline-none ring-1 ring-ink/10"
          >
            {gyms.map((gym) => (
              <option key={gym.id} value={gym.id}>
                {gym.name}
              </option>
            ))}
          </select>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título de la rutina"
            className="min-h-12 rounded-xl bg-cream px-4 outline-none ring-1 ring-ink/10"
          />
          <select
            value={objective}
            onChange={(e) => setObjective(e.target.value as RoutineObjective)}
            className="min-h-12 rounded-xl bg-cream px-4 outline-none ring-1 ring-ink/10"
          >
            {OBJECTIVES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="min-h-12 rounded-xl bg-cream px-4 outline-none ring-1 ring-ink/10"
          >
            <option value="principiante">principiante</option>
            <option value="intermedio">intermedio</option>
            <option value="avanzado">avanzado</option>
          </select>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <select
            value={selectedExercise}
            onChange={(e) => setSelectedExercise(e.target.value)}
            className="min-h-12 flex-1 rounded-xl bg-cream px-4 outline-none ring-1 ring-ink/10"
          >
            {exercises.map((exercise) => (
              <option key={exercise.id} value={exercise.id}>
                {exercise.title}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={addExercise}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-ink px-5 font-semibold text-cream"
          >
            <Plus className="size-4" />
            Agregar
          </button>
        </div>

        <ul className="space-y-3">
          {items.map((item, index) => (
            <li
              key={`${item.exerciseId}-${index}`}
              className="rounded-2xl bg-cream p-4 ring-1 ring-ink/8"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-display text-lg text-ink">
                  {index + 1}. {exerciseMap.get(item.exerciseId)?.title}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => moveItem(index, -1)}
                    className="rounded-lg bg-ink/5 p-2"
                    aria-label="Subir"
                  >
                    <ArrowUp className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveItem(index, 1)}
                    className="rounded-lg bg-ink/5 p-2"
                    aria-label="Bajar"
                  >
                    <ArrowDown className="size-4" />
                  </button>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                <label className="text-xs text-ink/50">
                  Series
                  <input
                    type="number"
                    min={1}
                    value={item.sets}
                    onChange={(e) =>
                      updateItem(index, { sets: Number(e.target.value) })
                    }
                    className="mt-1 min-h-11 w-full rounded-xl bg-white px-3"
                  />
                </label>
                <label className="text-xs text-ink/50">
                  Reps
                  <input
                    type="number"
                    min={1}
                    value={item.reps}
                    onChange={(e) =>
                      updateItem(index, { reps: Number(e.target.value) })
                    }
                    className="mt-1 min-h-11 w-full rounded-xl bg-white px-3"
                  />
                </label>
                <label className="text-xs text-ink/50">
                  Descanso (s)
                  <input
                    type="number"
                    min={0}
                    value={item.restSeconds}
                    onChange={(e) =>
                      updateItem(index, {
                        restSeconds: Number(e.target.value),
                      })
                    }
                    className="mt-1 min-h-11 w-full rounded-xl bg-white px-3"
                  />
                </label>
              </div>
            </li>
          ))}
        </ul>

        <button
          type="submit"
          className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-ember text-lg font-semibold text-ink"
        >
          <Save className="size-5" />
          Guardar rutina
        </button>
      </form>
    </main>
  );
}
