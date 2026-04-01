"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import {
  cardio,
  exercises,
  plannedWorkoutItems,
  plannedWorkouts,
  weightLog,
  weeklyCheckIns,
  workoutSessions,
} from "@/db/schema";
import { DASHBOARD_REVALIDATE_PATHS } from "@/lib/domain";
import type {
  CardioEntry,
  ExerciseEntry,
  QuickEntryFormValues,
  WeeklyCheckInValues,
} from "@/lib/validators";

function isPositiveNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function revalidateWorkoutViews() {
  DASHBOARD_REVALIDATE_PATHS.forEach((path) => revalidatePath(path));
}

function normalizeExerciseEntries(entries: ExerciseEntry[]) {
  return entries.filter(
    (entry): entry is ExerciseEntry & {
      exerciseName: string;
      sets: number;
      weightLbs: number;
      reps: number;
    } =>
      Boolean(entry.exerciseName) &&
      isPositiveNumber(entry.sets) &&
      isPositiveNumber(entry.weightLbs) &&
      isPositiveNumber(entry.reps)
  );
}

function normalizeCardioEntries(entries: CardioEntry[]) {
  return entries.filter(
    (entry): entry is CardioEntry & {
      cardioType: string;
      durationMin: number;
    } => Boolean(entry.cardioType) && isPositiveNumber(entry.durationMin)
  );
}

export async function submitWorkoutLog(data: QuickEntryFormValues) {
  const {
    date,
    sessionTitle,
    plannedWorkoutId,
    planCompletionMode,
    workoutType,
    bodyWeight,
    exercises: exerciseEntries,
    cardioEntries,
    notes,
  } = data;

  const sessionStatus = plannedWorkoutId
    ? planCompletionMode === "completed"
      ? "completed"
      : "partial"
    : "unplanned";

  const loggedNames = new Set<string>();
  const normalizedExerciseEntries = normalizeExerciseEntries(exerciseEntries);
  const normalizedCardioEntries = normalizeCardioEntries(cardioEntries);

  normalizedExerciseEntries.forEach((entry) => loggedNames.add(entry.exerciseName));
  normalizedCardioEntries.forEach((entry) => loggedNames.add(entry.cardioType));

  db.transaction((tx) => {
    const plannedWorkout = plannedWorkoutId
      ? tx
          .select({ title: plannedWorkouts.title })
          .from(plannedWorkouts)
          .where(eq(plannedWorkouts.id, plannedWorkoutId))
          .limit(1)
          .get()
      : undefined;

    const session = tx
      .insert(workoutSessions)
      .values({
        date,
        title: sessionTitle || plannedWorkout?.title || null,
        workoutType,
        notes: notes || null,
        plannedWorkoutId: plannedWorkoutId ?? null,
        sessionStatus,
      })
      .returning({ id: workoutSessions.id })
      .get();

    if (normalizedExerciseEntries.length > 0) {
      tx.insert(exercises)
        .values(
          normalizedExerciseEntries.map((entry) => ({
            sessionId: session.id,
            date,
            exerciseName: entry.exerciseName,
            sets: entry.sets,
            weightLbs: entry.weightLbs,
            reps: entry.reps,
          }))
        )
        .run();
    }

    if (normalizedCardioEntries.length > 0) {
      tx.insert(cardio)
        .values(
          normalizedCardioEntries.map((entry) => ({
            sessionId: session.id,
            date,
            cardioType: entry.cardioType,
            durationMin: entry.durationMin,
          }))
        )
        .run();
    }

    if (isPositiveNumber(bodyWeight)) {
      tx.insert(weightLog)
        .values({
          sessionId: session.id,
          date,
          weightLbs: bodyWeight,
        })
        .run();
    }

    if (!plannedWorkoutId) {
      return;
    }

    tx.update(plannedWorkouts)
      .set({
        status: planCompletionMode,
        missReason: null,
      })
      .where(eq(plannedWorkouts.id, plannedWorkoutId))
      .run();

    const planItems = tx
      .select({
        id: plannedWorkoutItems.id,
        exerciseName: plannedWorkoutItems.exerciseName,
      })
      .from(plannedWorkoutItems)
      .where(eq(plannedWorkoutItems.plannedWorkoutId, plannedWorkoutId))
      .all();

    for (const item of planItems) {
      tx.update(plannedWorkoutItems)
        .set({
          completed:
            planCompletionMode === "completed" || loggedNames.has(item.exerciseName),
        })
        .where(eq(plannedWorkoutItems.id, item.id))
        .run();
    }
  });

  revalidateWorkoutViews();
  return { success: true };
}

export async function submitWeeklyCheckIn(values: WeeklyCheckInValues) {
  await db.insert(weeklyCheckIns).values({
    date: values.date,
    waistInches: values.waistInches ?? null,
    energyLevel: values.energyLevel ?? null,
    stepCount: values.stepCount ?? null,
    frontPhotoUrl: values.frontPhotoUrl || null,
    sidePhotoUrl: values.sidePhotoUrl || null,
    notes: values.notes || null,
  });

  revalidatePath("/");
  revalidatePath("/history");
  return { success: true };
}
