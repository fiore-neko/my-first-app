import {
  getMockExercises,
  getMockGymBySlug,
  getMockGyms,
  getMockRoutineWithExercises,
  getMockRoutinesByGym,
} from "@/lib/mock-data";
import type { Exercise, Gym, Routine, RoutineWithExercises } from "@/lib/types";
import { isSupabaseConfigured } from "@/lib/utils";

/**
 * Con Supabase configurado no hacemos fallback a mock:
 * mezclar UUIDs reales con ids tipo "rt-1" provoca 404
 * (gym.id !== routine.gym_id).
 */
export async function listGyms(): Promise<Gym[]> {
  if (!isSupabaseConfigured()) return getMockGyms();

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("gyms")
    .select("*")
    .order("name");

  if (error) {
    console.error("[listGyms]", error.message);
    return [];
  }
  return data ?? [];
}

export async function getGymBySlug(slug: string): Promise<Gym | null> {
  if (!isSupabaseConfigured()) {
    return getMockGymBySlug(slug) ?? null;
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("gyms")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("[getGymBySlug]", error.message);
    return null;
  }
  return data;
}

export async function listRoutinesByGym(gymId: string): Promise<Routine[]> {
  if (!isSupabaseConfigured()) return getMockRoutinesByGym(gymId);

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("routines")
    .select("*")
    .eq("gym_id", gymId)
    .order("title");

  if (error) {
    console.error("[listRoutinesByGym]", error.message);
    return [];
  }
  return data ?? [];
}

export async function getRoutineWithExercises(
  routineId: string
): Promise<RoutineWithExercises | null> {
  if (!isSupabaseConfigured()) {
    return getMockRoutineWithExercises(routineId) ?? null;
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("routines")
    .select(
      `
      *,
      routine_exercises (
        *,
        exercise:exercises (*)
      )
    `
    )
    .eq("id", routineId)
    .maybeSingle();

  if (error) {
    console.error("[getRoutineWithExercises]", error.message);
    return null;
  }
  if (!data) return null;

  const routine_exercises = [...(data.routine_exercises ?? [])].sort(
    (a, b) => a.order_index - b.order_index
  );

  return { ...data, routine_exercises };
}

export async function listExercises(): Promise<Exercise[]> {
  if (!isSupabaseConfigured()) return getMockExercises();

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("exercises")
    .select("*")
    .order("title");

  if (error) {
    console.error("[listExercises]", error.message);
    return [];
  }
  return data ?? [];
}
