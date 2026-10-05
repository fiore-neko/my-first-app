export type RoutineObjective = "fuerza" | "cardio" | "movilidad" | "express";
export type RoutineLevel = "principiante" | "intermedio" | "avanzado";

export interface Gym {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface Exercise {
  id: string;
  title: string;
  description: string | null;
  category: string;
  video_url: string | null;
  duration_seconds: number;
  created_at?: string;
}

export interface Routine {
  id: string;
  gym_id: string;
  title: string;
  objective: RoutineObjective;
  level: RoutineLevel;
  created_at?: string;
}

export interface RoutineExercise {
  id: string;
  routine_id: string;
  exercise_id: string;
  sets: number;
  reps: number;
  rest_seconds: number;
  order_index: number;
  exercise?: Exercise;
}

export interface RoutineWithExercises extends Routine {
  routine_exercises: RoutineExercise[];
}

export const OBJECTIVE_META: Record<
  RoutineObjective,
  { label: string; description: string; accent: string }
> = {
  fuerza: {
    label: "Fuerza",
    description: "Cargas controladas y progresión.",
    accent: "bg-ember text-ink",
  },
  cardio: {
    label: "Cardio",
    description: "Ritmo alto y quema activa.",
    accent: "bg-volt text-ink",
  },
  movilidad: {
    label: "Movilidad",
    description: "Articulaciones libres y control.",
    accent: "bg-sky-wash text-ink",
  },
  express: {
    label: "Express",
    description: "Sesión corta, máxima eficiencia.",
    accent: "bg-ink text-cream",
  },
};
