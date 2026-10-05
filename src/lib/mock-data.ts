import type {
  Exercise,
  Gym,
  Routine,
  RoutineExercise,
  RoutineWithExercises,
} from "@/lib/types";

export const MOCK_GYMS: Gym[] = [
  {
    id: "gym-1",
    name: "Barrio Los Castores",
    slug: "barrio-los-castores",
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "gym-2",
    name: "Barrio Santa Clara",
    slug: "barrio-santa-clara",
    created_at: "2026-01-01T00:00:00Z",
  },
];

export const MOCK_EXERCISES: Exercise[] = [
  {
    id: "ex-1",
    title: "Sentadilla goblet",
    description:
      "Mantén el torso erguido y baja hasta que los muslos queden paralelos al piso.",
    category: "piernas",
    video_url: "https://www.youtube.com/embed/MeIiIdhvXT4",
    duration_seconds: 45,
  },
  {
    id: "ex-2",
    title: "Press de pecho con mancuernas",
    description: "Controlá la bajada y empujá sin bloquear los codos.",
    category: "pecho",
    video_url: "https://www.youtube.com/embed/VmB1G1K7v94",
    duration_seconds: 40,
  },
  {
    id: "ex-3",
    title: "Remo unilateral",
    description: "Apoyá una rodilla en el banco y llevá el codo hacia atrás.",
    category: "espalda",
    video_url: "https://www.youtube.com/embed/roCP6wCXPqo",
    duration_seconds: 40,
  },
  {
    id: "ex-4",
    title: "Plancha frontal",
    description:
      "Activá el core y mantené una línea recta de cabeza a talones.",
    category: "core",
    video_url: "https://www.youtube.com/embed/ASdvN_XEl_c",
    duration_seconds: 30,
  },
  {
    id: "ex-5",
    title: "Burpees",
    description: "Movimiento completo: sentadilla, plancha, flexión y salto.",
    category: "cardio",
    video_url: "https://www.youtube.com/embed/auBLPXO8Fww",
    duration_seconds: 30,
  },
  {
    id: "ex-6",
    title: "Movilidad de cadera 90/90",
    description:
      "Alterná la rotación interna y externa de cadera de forma controlada.",
    category: "movilidad",
    video_url: "https://www.youtube.com/embed/4BQLE_RrTSU",
    duration_seconds: 60,
  },
];

const MOCK_ROUTINES: Routine[] = [
  {
    id: "rt-1",
    gym_id: "gym-1",
    title: "Fuerza Full Body",
    objective: "fuerza",
    level: "intermedio",
  },
  {
    id: "rt-2",
    gym_id: "gym-1",
    title: "Cardio Explosivo",
    objective: "cardio",
    level: "principiante",
  },
  {
    id: "rt-3",
    gym_id: "gym-1",
    title: "Movilidad Matutina",
    objective: "movilidad",
    level: "principiante",
  },
  {
    id: "rt-4",
    gym_id: "gym-1",
    title: "Express 20 min",
    objective: "express",
    level: "intermedio",
  },
  {
    id: "rt-5",
    gym_id: "gym-2",
    title: "Fuerza Upper",
    objective: "fuerza",
    level: "avanzado",
  },
];

const MOCK_ROUTINE_EXERCISES: RoutineExercise[] = [
  {
    id: "re-1",
    routine_id: "rt-1",
    exercise_id: "ex-1",
    sets: 4,
    reps: 10,
    rest_seconds: 90,
    order_index: 0,
  },
  {
    id: "re-2",
    routine_id: "rt-1",
    exercise_id: "ex-2",
    sets: 3,
    reps: 12,
    rest_seconds: 75,
    order_index: 1,
  },
  {
    id: "re-3",
    routine_id: "rt-1",
    exercise_id: "ex-3",
    sets: 3,
    reps: 10,
    rest_seconds: 75,
    order_index: 2,
  },
  {
    id: "re-4",
    routine_id: "rt-1",
    exercise_id: "ex-4",
    sets: 3,
    reps: 45,
    rest_seconds: 45,
    order_index: 3,
  },
  {
    id: "re-5",
    routine_id: "rt-2",
    exercise_id: "ex-5",
    sets: 4,
    reps: 12,
    rest_seconds: 45,
    order_index: 0,
  },
  {
    id: "re-6",
    routine_id: "rt-2",
    exercise_id: "ex-1",
    sets: 3,
    reps: 15,
    rest_seconds: 40,
    order_index: 1,
  },
  {
    id: "re-7",
    routine_id: "rt-3",
    exercise_id: "ex-6",
    sets: 2,
    reps: 8,
    rest_seconds: 20,
    order_index: 0,
  },
  {
    id: "re-8",
    routine_id: "rt-3",
    exercise_id: "ex-4",
    sets: 2,
    reps: 30,
    rest_seconds: 15,
    order_index: 1,
  },
  {
    id: "re-9",
    routine_id: "rt-4",
    exercise_id: "ex-1",
    sets: 3,
    reps: 10,
    rest_seconds: 40,
    order_index: 0,
  },
  {
    id: "re-10",
    routine_id: "rt-4",
    exercise_id: "ex-2",
    sets: 3,
    reps: 10,
    rest_seconds: 40,
    order_index: 1,
  },
  {
    id: "re-11",
    routine_id: "rt-4",
    exercise_id: "ex-5",
    sets: 3,
    reps: 8,
    rest_seconds: 30,
    order_index: 2,
  },
  {
    id: "re-12",
    routine_id: "rt-5",
    exercise_id: "ex-2",
    sets: 4,
    reps: 8,
    rest_seconds: 90,
    order_index: 0,
  },
  {
    id: "re-13",
    routine_id: "rt-5",
    exercise_id: "ex-3",
    sets: 4,
    reps: 10,
    rest_seconds: 75,
    order_index: 1,
  },
];

function attachExercise(item: RoutineExercise): RoutineExercise {
  return {
    ...item,
    exercise: MOCK_EXERCISES.find((exercise) => exercise.id === item.exercise_id),
  };
}

export function getMockGyms(): Gym[] {
  return MOCK_GYMS;
}

export function getMockGymBySlug(slug: string): Gym | undefined {
  return MOCK_GYMS.find((gym) => gym.slug === slug);
}

export function getMockRoutinesByGym(gymId: string): Routine[] {
  return MOCK_ROUTINES.filter((routine) => routine.gym_id === gymId);
}

export function getMockRoutineWithExercises(
  routineId: string
): RoutineWithExercises | undefined {
  const routine = MOCK_ROUTINES.find((item) => item.id === routineId);
  if (!routine) return undefined;

  return {
    ...routine,
    routine_exercises: MOCK_ROUTINE_EXERCISES.filter(
      (item) => item.routine_id === routineId
    )
      .sort((a, b) => a.order_index - b.order_index)
      .map(attachExercise),
  };
}

export function getMockExercises(): Exercise[] {
  return MOCK_EXERCISES;
}
