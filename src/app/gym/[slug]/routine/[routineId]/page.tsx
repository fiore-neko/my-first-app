import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ExerciseList } from "@/components/exercise-list";
import { getGymBySlug, getRoutineWithExercises } from "@/lib/data";
import { OBJECTIVE_META } from "@/lib/types";

interface RoutinePageProps {
  params: Promise<{ slug: string; routineId: string }>;
}

export default async function RoutinePage({ params }: RoutinePageProps) {
  const { slug, routineId } = await params;
  const gym = await getGymBySlug(slug);
  const routine = await getRoutineWithExercises(routineId);

  if (!gym || !routine || routine.gym_id !== gym.id) notFound();

  const meta = OBJECTIVE_META[routine.objective];

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-5 py-8 sm:px-8 sm:py-10">
      <Link
        href={`/gym/${slug}`}
        className="inline-flex w-fit items-center gap-2 text-sm font-medium text-ink/60 transition hover:text-ink"
      >
        <ArrowLeft className="size-4" />
        Volver a objetivos
      </Link>

      <header className="animate-rise mt-6">
        <span className="inline-flex rounded-full bg-ink px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-cream">
          {meta.label}
        </span>
        <h1 className="mt-4 font-display text-4xl tracking-tight text-ink sm:text-5xl">
          {routine.title}
        </h1>
        <p className="mt-3 text-ink/65">
          Nivel {routine.level} · {routine.routine_exercises.length} ejercicios
        </p>
      </header>

      <section className="animate-rise-delay mt-8">
        <ExerciseList
          gymSlug={slug}
          routineId={routine.id}
          items={routine.routine_exercises}
        />
      </section>
    </main>
  );
}
