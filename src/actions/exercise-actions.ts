"use server";

import { db } from "@/db";
import { exerciseList } from "@/db/schema";
import { asc } from "drizzle-orm";
import type { ExerciseListItem, ExerciseTrackingMode } from "@/types";

export async function getExerciseList(): Promise<ExerciseListItem[]> {
  const rows = await db
    .select()
    .from(exerciseList)
    .orderBy(asc(exerciseList.category), asc(exerciseList.name));

  return rows.map((row) => ({
    ...row,
    trackingMode: row.trackingMode as ExerciseTrackingMode,
  }));
}

export async function getExerciseNames() {
  const rows = await db
    .select({
      name: exerciseList.name,
      category: exerciseList.category,
      trackingMode: exerciseList.trackingMode,
    })
    .from(exerciseList)
    .orderBy(asc(exerciseList.name));

  return rows.map((row) => ({
    ...row,
    trackingMode: row.trackingMode as ExerciseTrackingMode,
  }));
}
