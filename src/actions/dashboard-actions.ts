"use server";

import { db } from "@/db";
import { exercises, cardio, weightLog, workoutNotes } from "@/db/schema";
import { count, sum, desc, asc, sql } from "drizzle-orm";
import type {
  DashboardStats,
  WeightTrendPoint,
  VolumeTrendPoint,
  RecentActivityEntry,
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
      totalVolume: sql<number>`SUM(${exercises.weightLbs} * ${exercises.reps})`,
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
      date: workoutNotes.date,
      workoutType: workoutNotes.workoutType,
      notes: workoutNotes.notes,
    })
    .from(workoutNotes)
    .orderBy(desc(workoutNotes.date), desc(workoutNotes.id))
    .limit(limit);

  return results;
}
