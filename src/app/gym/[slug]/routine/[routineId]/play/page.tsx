import Link from "next/link";
import { notFound } from "next/navigation";
import { X } from "lucide-react";
import { WorkoutPlayer } from "@/components/workout-player";
import { getGymBySlug, getRoutineWithExercises } from "@/lib/data";

interface PlayPageProps {
  params: Promise<{ slug: string; routineId: string }>;
}

export default async function PlayPage({ params }: PlayPageProps) {
  const { slug, routineId } = await params;
  const gym = await getGymBySlug(slug);
  const routine = await getRoutineWithExercises(routineId);

  if (!gym || !routine || routine.gym_id !== gym.id) notFound();

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-6 sm:px-8 sm:py-8">
      <div className="mb-5 flex items-center justify-between">
        <p className="font-display text-sm uppercase tracking-[0.22em] text-ember">
          GymBarrio · Modo guiado
        </p>
        <Link
          href={`/gym/${slug}/routine/${routineId}`}
          className="inline-flex size-11 items-center justify-center rounded-full bg-ink/5 text-ink transition hover:bg-ink/10"
          aria-label="Salir del entrenamiento"
        >
          <X className="size-5" />
        </Link>
      </div>

      <WorkoutPlayer
        routineTitle={routine.title}
        items={routine.routine_exercises}
        onExitHref={`/gym/${slug}/routine/${routineId}`}
      />
    </main>
  );
}
