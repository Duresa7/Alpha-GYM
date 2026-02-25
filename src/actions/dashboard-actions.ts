"use server";

import { db } from "@/db";
import { exercises, cardio, weightLog, workoutNotes } from "@/db/schema";
import { count, sum, desc, asc, sql, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type {
  DashboardStats,
  WeightTrendPoint,
  VolumeTrendPoint,
  RecentActivityEntry,
  WeightProgressionPoint,
} from "@/types";

export async function getStats(): Promise<DashboardStats> {
  const [exerciseCount] = await db
    .select({ count: count() })
    .from(exercises);

  const [cardioCount] = await db
    .select({ count: count() })
    .from(cardio);

  const [cardioMinutes] = await db
    .select({ total: sum(cardio.durationMin) })
    .from(cardio);

  const latestWeight = await db
    .select({ weightLbs: weightLog.weightLbs })
    .from(weightLog)
    .orderBy(desc(weightLog.date), desc(weightLog.id))
    .limit(1);

  const firstWeight = await db
    .select({ weightLbs: weightLog.weightLbs })
    .from(weightLog)
    .orderBy(asc(weightLog.date), asc(weightLog.id))
    .limit(1);

  const currentWeight = latestWeight[0]?.weightLbs ?? null;
  const startingWeight = firstWeight[0]?.weightLbs ?? null;
  const weightChange =
    currentWeight !== null && startingWeight !== null
      ? Math.round((currentWeight - startingWeight) * 10) / 10
      : null;

  return {
    totalExercises: exerciseCount.count,
    totalCardioSessions: cardioCount.count,
    totalCardioMinutes: Number(cardioMinutes.total) || 0,
    currentWeight,
    startingWeight,
    weightChange,
  };
}

export async function getWeightTrend(): Promise<WeightTrendPoint[]> {
  const results = await db
    .select({
      date: weightLog.date,
      weightLbs: weightLog.weightLbs,
    })
    .from(weightLog)
    .orderBy(asc(weightLog.date));

  return results;
}

export async function getVolumeTrend(): Promise<VolumeTrendPoint[]> {
  const results = await db
    .select({
      date: exercises.date,
      totalVolume: sql<number>`SUM(${exercises.weightLbs} * ${exercises.reps} * ${exercises.sets})`,
    })
    .from(exercises)
    .groupBy(exercises.date)
    .orderBy(asc(exercises.date));

  return results.map((r) => ({
    date: r.date,
    totalVolume: Number(r.totalVolume) || 0,
  }));
}

export async function getRecentActivity(
  limit: number = 5
): Promise<RecentActivityEntry[]> {
  const results = await db
    .select({
      id: workoutNotes.id,
      date: workoutNotes.date,
      workoutType: workoutNotes.workoutType,
      notes: workoutNotes.notes,
    })
    .from(workoutNotes)
    .orderBy(desc(workoutNotes.date), desc(workoutNotes.id))
    .limit(limit);

  return results;
}

export async function deleteActivityLog(id: number) {
  await db.delete(workoutNotes).where(eq(workoutNotes.id, id));
  revalidatePath("/");
  return { success: true };
}

export async function getWeightProgression(): Promise<WeightProgressionPoint[]> {
  const results = await db
    .select({
      date: exercises.date,
      exerciseName: exercises.exerciseName,
      weightLbs: exercises.weightLbs,
    })
    .from(exercises)
    .orderBy(asc(exercises.date), asc(exercises.id));

  if (results.length === 0) return [];

  let changeSum = 0;
  let changeCount = 0;

  return results.map((entry, i) => {
    if (i === 0) {
      return {
        date: entry.date,
        exerciseName: entry.exerciseName,
        weightLbs: entry.weightLbs,
        weightChange: null,
        percentChange: null,
        runningAvgChange: null,
      };
    }

    const prev = results[i - 1];
    const weightChange = Math.round((entry.weightLbs - prev.weightLbs) * 10) / 10;
    const percentChange =
      prev.weightLbs !== 0
        ? Math.round(((entry.weightLbs - prev.weightLbs) / prev.weightLbs) * 1000) / 10
        : 0;

    changeSum += weightChange;
    changeCount++;
    const runningAvgChange = Math.round((changeSum / changeCount) * 10) / 10;

    return {
      date: entry.date,
      exerciseName: entry.exerciseName,
      weightLbs: entry.weightLbs,
      weightChange,
      percentChange,
      runningAvgChange,
    };
  });
}
