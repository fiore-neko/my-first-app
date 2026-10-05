import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ObjectiveCards } from "@/components/objective-cards";
import { getGymBySlug, listRoutinesByGym } from "@/lib/data";

interface GymPageProps {
  params: Promise<{ slug: string }>;
}

export default async function GymPage({ params }: GymPageProps) {
  const { slug } = await params;
  const gym = await getGymBySlug(slug);
  if (!gym) notFound();

  const routines = await listRoutinesByGym(gym.id);

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-5 py-8 sm:px-8 sm:py-10">
      <Link
        href="/"
        className="inline-flex w-fit items-center gap-2 text-sm font-medium text-ink/60 transition hover:text-ink"
      >
        <ArrowLeft className="size-4" />
        Cambiar gimnasio
      </Link>

      <header className="animate-rise mt-6">
        <p className="font-display text-sm uppercase tracking-[0.28em] text-ember">
          GymBarrio
        </p>
        <h1 className="mt-3 font-display text-4xl tracking-tight text-ink sm:text-5xl">
          {gym.name}
        </h1>
        <p className="mt-3 max-w-xl text-lg text-ink/65">
          Elegí el objetivo de tu entrenamiento. Las tarjetas están pensadas
          para uso rápido en tablet o celular.
        </p>
      </header>

      <section className="animate-rise-delay mt-10">
        <ObjectiveCards gymSlug={gym.slug} routines={routines} />
      </section>
    </main>
  );
}
