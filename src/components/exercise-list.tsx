import Link from "next/link";
import { Play } from "lucide-react";
import type { RoutineExercise } from "@/lib/types";

interface ExerciseListProps {
  gymSlug: string;
  routineId: string;
  items: RoutineExercise[];
}

export function ExerciseList({
  gymSlug,
  routineId,
  items,
}: ExerciseListProps) {
  const ordered = [...items].sort((a, b) => a.order_index - b.order_index);

  return (
    <div className="space-y-6">
      <ol className="space-y-3">
        {ordered.map((item, index) => (
          <li
            key={item.id}
            className="flex items-start gap-4 rounded-[1.25rem] bg-cream p-4 ring-1 ring-ink/8 sm:p-5"
          >
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-ink font-display text-lg text-cream">
              {index + 1}
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="font-display text-xl tracking-tight text-ink">
                {item.exercise?.title ?? "Ejercicio"}
              </h3>
              {item.exercise?.description ? (
                <p className="mt-1 line-clamp-2 text-sm text-ink/60">
                  {item.exercise.description}
                </p>
              ) : null}
              <p className="mt-3 text-sm font-medium text-ink/80">
                {item.sets} series × {item.reps} reps · descanso {item.rest_seconds}s
              </p>
            </div>
          </li>
        ))}
      </ol>

      <Link
        href={`/gym/${gymSlug}/routine/${routineId}/play`}
        className="inline-flex min-h-16 w-full items-center justify-center gap-3 rounded-2xl bg-ember text-lg font-semibold text-ink transition hover:brightness-105 sm:text-xl"
      >
        <Play className="size-5 fill-current" />
        Comenzar entrenamiento
      </Link>
    </div>
  );
}
