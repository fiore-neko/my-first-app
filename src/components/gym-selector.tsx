"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import type { Gym } from "@/lib/types";

interface GymSelectorProps {
  gyms: Gym[];
}

export function GymSelector({ gyms }: GymSelectorProps) {
  const router = useRouter();
  const [code, setCode] = useState("");

  function goToSlug(slug: string) {
    router.push(`/gym/${slug}`);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const normalized = code.trim().toLowerCase().replace(/\s+/g, "-");
    if (!normalized) return;
    goToSlug(normalized);
  }

  return (
    <div className="space-y-10">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 sm:flex-row"
      >
        <label className="relative flex-1">
          <span className="sr-only">Código o slug del gimnasio</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-ink/40" />
          <input
            value={code}
            onChange={(event) => setCode(event.target.value)}
            placeholder="Ej: barrio-los-castores"
            className="min-h-16 w-full rounded-2xl border-0 bg-cream pl-12 pr-4 text-lg text-ink outline-none ring-1 ring-ink/10 placeholder:text-ink/35 focus:ring-2 focus:ring-ember"
          />
        </label>
        <button
          type="submit"
          className="inline-flex min-h-16 items-center justify-center gap-2 rounded-2xl bg-ink px-7 text-lg font-semibold text-cream transition hover:bg-ink/90"
        >
          Entrar
          <ArrowRight className="size-5" />
        </button>
      </form>

      <div className="grid gap-4 sm:grid-cols-2">
        {gyms.map((gym) => (
          <button
            key={gym.id}
            type="button"
            onClick={() => goToSlug(gym.slug)}
            className="group rounded-[1.75rem] bg-cream p-7 text-left ring-1 ring-ink/8 transition hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-24px_rgba(11,31,51,0.45)]"
          >
            <p className="font-display text-xs uppercase tracking-[0.2em] text-ink/45">
              Gimnasio
            </p>
            <h2 className="mt-3 font-display text-3xl tracking-tight text-ink">
              {gym.name}
            </h2>
            <p className="mt-2 text-ink/55">/{gym.slug}</p>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-ember transition group-hover:gap-3">
              Seleccionar
              <ArrowRight className="size-4" />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
