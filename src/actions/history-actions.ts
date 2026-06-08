"use server";

import { revalidatePath } from "next/cache";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { cardio, exercises, weightLog } from "@/db/schema";
import { buildPersonalRecords } from "@/lib/personal-records";

export async function getExerciseLogs() {
  return db
    .select({
      id: exercises.id,
      sessionId: exercises.sessionId,
      date: exercises.date,
      exerciseName: exercises.exerciseName,
      sets: exercises.sets,
      weightLbs: exercises.weightLbs,
      reps: exercises.reps,
    })
    .from(exercises)
    .orderBy(desc(exercises.date), desc(exercises.id));
}

export async function getCardioLogs() {
  return db
    .select({
      id: cardio.id,
      sessionId: cardio.sessionId,
      date: cardio.date,
      cardioType: cardio.cardioType,
      durationMin: cardio.durationMin,
    })
    .from(cardio)
    .orderBy(desc(cardio.date), desc(cardio.id));
}

export async function getWeightLogs() {
  return db
    .select({
      id: weightLog.id,
      sessionId: weightLog.sessionId,
      date: weightLog.date,
      weightLbs: weightLog.weightLbs,
    })
    .from(weightLog)
    .orderBy(desc(weightLog.date), desc(weightLog.id));
}

export async function getPersonalRecords() {
  const rows = await db
    .select({
      date: exercises.date,
      exerciseName: exercises.exerciseName,
      sets: exercises.sets,
      weightLbs: exercises.weightLbs,
      reps: exercises.reps,
    })
    .from(exercises);

  return buildPersonalRecords(rows);
}

export async function deleteExerciseLog(id: number) {
  await db.delete(exercises).where(eq(exercises.id, id));
  revalidatePath("/history");
  revalidatePath("/");
  return { success: true };
}

export async function deleteCardioLog(id: number) {
  await db.delete(cardio).where(eq(cardio.id, id));
  revalidatePath("/history");
  revalidatePath("/");
  return { success: true };
}

export async function deleteWeightLog(id: number) {
  await db.delete(weightLog).where(eq(weightLog.id, id));
  revalidatePath("/history");
  revalidatePath("/");
  return { success: true };
}

export async function updateExerciseLog(
  id: number,
  data: {
    date: string;
    exerciseName: string;
    sets: number;
    weightLbs: number;
    reps: number;
  }
) {
  await db
    .update(exercises)
    .set({
      date: data.date,
      exerciseName: data.exerciseName,
      sets: data.sets,
      weightLbs: data.weightLbs,
      reps: data.reps,
    })
    .where(eq(exercises.id, id));

  revalidatePath("/history");
  revalidatePath("/");
  return { success: true };
}

export async function updateCardioLog(
  id: number,
  data: {
    date: string;
    cardioType: string;
    durationMin: number;
  }
) {
  await db
    .update(cardio)
    .set({
      date: data.date,
      cardioType: data.cardioType,
      durationMin: data.durationMin,
    })
    .where(eq(cardio.id, id));

  revalidatePath("/history");
  revalidatePath("/");
  return { success: true };
}

export async function updateWeightLog(
  id: number,
  data: {
    date: string;
    weightLbs: number;
  }
) {
  await db
    .update(weightLog)
    .set({
      date: data.date,
      weightLbs: data.weightLbs,
    })
    .where(eq(weightLog.id, id));

  revalidatePath("/history");
  revalidatePath("/");
  return { success: true };
}
