import Link from "next/link";
import { GymSelector } from "@/components/gym-selector";
import { listGyms } from "@/lib/data";

export default async function HomePage() {
  const gyms = await listGyms();

  return (
    <main className="relative flex min-h-full flex-1 flex-col overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent_40%,rgba(11,31,51,0.04)_40%,rgba(11,31,51,0.04)_60%,transparent_60%)]"
      />

      <div className="relative mx-auto flex w-full max-w-5xl flex-1 flex-col px-5 py-8 sm:px-8 sm:py-12">
        <header className="animate-rise flex items-start justify-between gap-4">
          <div>
            <p className="font-display text-sm uppercase tracking-[0.28em] text-ember">
              GymBarrio
            </p>
            <h1 className="mt-4 max-w-xl font-display text-5xl leading-[0.95] tracking-tight text-ink sm:text-6xl lg:text-7xl">
              Entrená en tu barrio, sin complicaciones.
            </h1>
            <p className="mt-5 max-w-lg text-lg text-ink/65">
              Elegí tu gimnasio o ingresá el código del barrio para ver rutinas
              guiadas con video y descansos.
            </p>
          </div>
          <Link
            href="/admin"
            className="shrink-0 rounded-full bg-ink/5 px-4 py-2 text-sm font-medium text-ink/70 transition hover:bg-ink/10"
          >
            Admin
          </Link>
        </header>

        <section className="animate-rise-delay mt-12 flex-1">
          <h2 className="mb-5 font-display text-xl tracking-tight text-ink">
            Modo kiosco · Selección de gym
          </h2>
          <GymSelector gyms={gyms} />
        </section>
      </div>
    </main>
  );
}
