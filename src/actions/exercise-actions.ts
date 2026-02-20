"use server";

import { db } from "@/db";
import { exerciseList } from "@/db/schema";
import { asc } from "drizzle-orm";

export async function getExerciseList() {
  return await db
    .select()
    .from(exerciseList)
    .orderBy(asc(exerciseList.category), asc(exerciseList.name));
}

export async function getExerciseNames() {
  const results = await db
    .select({ name: exerciseList.name, category: exerciseList.category })
    .from(exerciseList)
    .orderBy(asc(exerciseList.name));
  return results;
}

export async function getExercisesByCategory() {
  const all = await getExerciseList();
  const grouped: Record<string, typeof all> = {};
  for (const exercise of all) {
    if (!grouped[exercise.category]) {
      grouped[exercise.category] = [];
    }
    grouped[exercise.category].push(exercise);
  }
  return grouped;
}
