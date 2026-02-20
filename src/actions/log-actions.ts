"use server";

import { db } from "@/db";
import { exercises, cardio, weightLog, workoutNotes } from "@/db/schema";
import { revalidatePath } from "next/cache";
import type { QuickEntryFormValues } from "@/lib/validators";

export async function submitWorkoutLog(data: QuickEntryFormValues) {
  const { date, workoutType, bodyWeight, exercises: exerciseEntries, cardioEntries, notes } = data;

  if (exerciseEntries && exerciseEntries.length > 0) {
    for (const ex of exerciseEntries) {
      if (
        ex.exerciseName &&
        typeof ex.weightLbs === "number" &&
        typeof ex.reps === "number"
      ) {
        await db.insert(exercises).values({
          date,
          exerciseName: ex.exerciseName,
          weightLbs: ex.weightLbs,
          reps: ex.reps,
        });
      }
    }
  }

  if (cardioEntries && cardioEntries.length > 0) {
    for (const c of cardioEntries) {
      if (c.cardioType && typeof c.durationMin === "number") {
        await db.insert(cardio).values({
          date,
          cardioType: c.cardioType,
          durationMin: c.durationMin,
        });
      }
    }
  }

  if (bodyWeight && typeof bodyWeight === "number" && bodyWeight > 0) {
    await db.insert(weightLog).values({
      date,
      weightLbs: bodyWeight,
    });
  }

  await db.insert(workoutNotes).values({
    date,
    workoutType,
    notes: notes || null,
  });

  revalidatePath("/");
  revalidatePath("/history");

  return { success: true };
}
