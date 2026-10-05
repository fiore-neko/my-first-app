import Link from "next/link";
import { ArrowRight, Dumbbell } from "lucide-react";
import { OBJECTIVE_META, type Routine } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ObjectiveCardsProps {
  gymSlug: string;
  routines: Routine[];
}

export function ObjectiveCards({ gymSlug, routines }: ObjectiveCardsProps) {
  if (!routines.length) {
    return (
      <p className="rounded-2xl bg-cream/80 p-6 text-ink/60">
        Todavía no hay rutinas cargadas para este gimnasio.
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {routines.map((routine) => {
        const meta = OBJECTIVE_META[routine.objective];
        return (
          <Link
            key={routine.id}
            href={`/gym/${gymSlug}/routine/${routine.id}`}
            className="group flex min-h-44 flex-col justify-between rounded-[1.75rem] bg-cream p-6 ring-1 ring-ink/8 transition hover:-translate-y-0.5 hover:shadow-[0_22px_44px_-28px_rgba(11,31,51,0.5)]"
          >
            <div>
              <span
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em]",
                  meta.accent
                )}
              >
                <Dumbbell className="size-3.5" />
                {meta.label}
              </span>
              <h3 className="mt-4 font-display text-2xl tracking-tight text-ink sm:text-3xl">
                {routine.title}
              </h3>
              <p className="mt-2 text-ink/60">{meta.description}</p>
            </div>
            <div className="mt-6 flex items-center justify-between text-sm">
              <span className="capitalize text-ink/50">{routine.level}</span>
              <span className="inline-flex items-center gap-2 font-semibold text-ink transition group-hover:gap-3">
                Ver rutina
                <ArrowRight className="size-4 text-ember" />
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
