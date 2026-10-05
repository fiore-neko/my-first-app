"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Plus, Shield } from "lucide-react";
import type { Exercise } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/utils";
import { getMockExercises } from "@/lib/mock-data";

export default function AdminPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("general");
  const [videoUrl, setVideoUrl] = useState("");
  const [duration, setDuration] = useState(45);

  useEffect(() => {
    async function boot() {
      if (!isSupabaseConfigured()) {
        setExercises(getMockExercises());
        setMessage(
          "Modo demo: configurá NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY para auth real."
        );
        return;
      }

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserEmail(user?.email ?? null);

      const { data } = await supabase
        .from("exercises")
        .select("*")
        .order("title");
      setExercises(data?.length ? data : getMockExercises());
    }

    void boot();
  }, []);

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    if (!isSupabaseConfigured()) {
      setMessage("Supabase no está configurado. Usá el modo demo para explorar la UI.");
      return;
    }

    setLoading(true);
    setMessage(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUserEmail(user?.email ?? null);
    router.refresh();
  }

  async function handleLogout() {
    if (!isSupabaseConfigured()) return;
    const supabase = createClient();
    await supabase.auth.signOut();
    setUserEmail(null);
  }

  async function handleCreateExercise(event: React.FormEvent) {
    event.preventDefault();

    const draft: Exercise = {
      id: `local-${Date.now()}`,
      title,
      description,
      category,
      video_url: videoUrl || null,
      duration_seconds: duration,
    };

    if (!isSupabaseConfigured() || !userEmail) {
      setExercises((prev) => [draft, ...prev]);
      setMessage("Ejercicio agregado en memoria (demo). Conectá Supabase para persistir.");
      setTitle("");
      setDescription("");
      setVideoUrl("");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("exercises")
      .insert({
        title,
        description,
        category,
        video_url: videoUrl || null,
        duration_seconds: duration,
      })
      .select()
      .single();
    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setExercises((prev) => [data, ...prev]);
    setTitle("");
    setDescription("");
    setVideoUrl("");
    setMessage("Ejercicio creado.");
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-5 py-8 sm:px-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="inline-flex items-center gap-2 font-display text-sm uppercase tracking-[0.22em] text-ember">
            <Shield className="size-4" />
            Admin
          </p>
          <h1 className="mt-3 font-display text-4xl tracking-tight text-ink">
            Panel GymBarrio
          </h1>
          <p className="mt-2 text-ink/65">
            CRUD básico de ejercicios y punto de partida para armar rutinas.
          </p>
        </div>
        <Link
          href="/"
          className="rounded-full bg-ink/5 px-4 py-2 text-sm font-medium text-ink/70"
        >
          Ir a la app
        </Link>
      </header>

      {message ? (
        <p className="rounded-2xl bg-sand px-4 py-3 text-sm text-ink/80">
          {message}
        </p>
      ) : null}

      {!userEmail ? (
        <form
          onSubmit={handleLogin}
          className="max-w-md space-y-3 rounded-[1.5rem] bg-cream p-6 ring-1 ring-ink/8"
        >
          <h2 className="font-display text-2xl text-ink">Ingresar</h2>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="min-h-12 w-full rounded-xl bg-white px-4 outline-none ring-1 ring-ink/10 focus:ring-2 focus:ring-ember"
          />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            className="min-h-12 w-full rounded-xl bg-white px-4 outline-none ring-1 ring-ink/10 focus:ring-2 focus:ring-ember"
          />
          <button
            type="submit"
            disabled={loading}
            className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-ink font-semibold text-cream disabled:opacity-60"
          >
            {loading ? "Entrando…" : "Entrar con Supabase Auth"}
          </button>
        </form>
      ) : (
        <div className="flex items-center justify-between rounded-[1.25rem] bg-ink px-5 py-4 text-cream">
          <p className="text-sm">Sesión: {userEmail}</p>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-full bg-cream/10 px-3 py-2 text-sm"
          >
            <LogOut className="size-4" />
            Salir
          </button>
        </div>
      )}

      <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <form
          onSubmit={handleCreateExercise}
          className="space-y-3 rounded-[1.5rem] bg-cream p-6 ring-1 ring-ink/8"
        >
          <h2 className="font-display text-2xl text-ink">Nuevo ejercicio</h2>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título"
            className="min-h-12 w-full rounded-xl bg-white px-4 outline-none ring-1 ring-ink/10 focus:ring-2 focus:ring-ember"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descripción / cues"
            rows={3}
            className="w-full rounded-xl bg-white px-4 py-3 outline-none ring-1 ring-ink/10 focus:ring-2 focus:ring-ember"
          />
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Categoría"
            className="min-h-12 w-full rounded-xl bg-white px-4 outline-none ring-1 ring-ink/10 focus:ring-2 focus:ring-ember"
          />
          <input
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="URL de video (YouTube embed o GIF)"
            className="min-h-12 w-full rounded-xl bg-white px-4 outline-none ring-1 ring-ink/10 focus:ring-2 focus:ring-ember"
          />
          <input
            type="number"
            min={1}
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="min-h-12 w-full rounded-xl bg-white px-4 outline-none ring-1 ring-ink/10 focus:ring-2 focus:ring-ember"
          />
          <button
            type="submit"
            disabled={loading}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-ember font-semibold text-ink"
          >
            <Plus className="size-4" />
            Guardar ejercicio
          </button>
        </form>

        <div className="rounded-[1.5rem] bg-cream p-6 ring-1 ring-ink/8">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="font-display text-2xl text-ink">Ejercicios</h2>
            <Link
              href="/admin/routines"
              className="text-sm font-semibold text-ember"
            >
              Creador de rutinas →
            </Link>
          </div>
          <ul className="space-y-3">
            {exercises.map((exercise) => (
              <li
                key={exercise.id}
                className="rounded-2xl bg-white/80 p-4 ring-1 ring-ink/5"
              >
                <p className="font-display text-lg text-ink">{exercise.title}</p>
                <p className="mt-1 text-sm text-ink/55">
                  {exercise.category} · {exercise.duration_seconds}s
                </p>
                {exercise.video_url ? (
                  <p className="mt-2 truncate text-xs text-ink/40">
                    {exercise.video_url}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
