"use server";

import { revalidatePath } from "next/cache";
import { asc, count, desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  cardio,
  exercises,
  plannedWorkouts,
  weeklyCheckIns,
  weightLog,
  workoutSessions,
} from "@/db/schema";
import type {
  DashboardStats,
  RecentActivityEntry,
  StrengthProgressionPoint,
  VolumeTrendPoint,
  WeightTrendPoint,
  WeeklyCheckInInsight,
} from "@/types";
import { getDayDiff, formatDateKey } from "@/lib/date";
import { getAdherenceSummary } from "./plan-actions";

function roundOneDecimal(value: number) {
  return Math.round(value * 10) / 10;
}

export async function getStats(): Promise<DashboardStats> {
  const [{ count: exerciseCount }, { count: cardioCount }, { count: sessionCount }] =
    await Promise.all([
      db.select({ count: count() }).from(exercises).then((rows) => rows[0]),
      db.select({ count: count() }).from(cardio).then((rows) => rows[0]),
      db.select({ count: count() }).from(workoutSessions).then((rows) => rows[0]),
    ]);

  const [{ total }] = await db
    .select({ total: sql<number>`SUM(${cardio.durationMin})` })
    .from(cardio);

  const latestWeight = await db
    .select({ date: weightLog.date, weightLbs: weightLog.weightLbs })
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
      ? roundOneDecimal(currentWeight - startingWeight)
      : null;

  const adherence = await getAdherenceSummary();
  const daysSinceLastWeighIn = latestWeight[0]
    ? getDayDiff(latestWeight[0].date, formatDateKey(new Date()))
    : null;

  return {
    totalExerciseEntries: exerciseCount,
    totalCardioEntries: cardioCount,
    totalCardioMinutes: Number(total) || 0,
    totalSessions: sessionCount,
    currentWeight,
    startingWeight,
    weightChange,
    plannedThisWeek: adherence.plannedThisWeek,
    completedThisWeek: adherence.completedThisWeek,
    completionRate: adherence.completionRate,
    currentStreak: adherence.currentStreak,
    daysSinceLastWeighIn,
  };
}

export async function getWeightTrend(): Promise<WeightTrendPoint[]> {
  const results = await db
    .select({
      date: weightLog.date,
      weightLbs: weightLog.weightLbs,
    })
    .from(weightLog)
    .orderBy(asc(weightLog.date), asc(weightLog.id));

  return results.map((entry, index) => {
    const window = results.slice(Math.max(0, index - 6), index + 1);
    const rollingAvgWeight =
      window.length > 0
        ? roundOneDecimal(
            window.reduce((sum, item) => sum + item.weightLbs, 0) / window.length
          )
        : entry.weightLbs;

    return {
      date: entry.date,
      weightLbs: entry.weightLbs,
      rollingAvgWeight,
    };
  });
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

  return results.map((result) => ({
    date: result.date,
    totalVolume: Number(result.totalVolume) || 0,
  }));
}

export async function getRecentActivity(limit: number = 5): Promise<RecentActivityEntry[]> {
  const sessions = await db
    .select({
      id: workoutSessions.id,
      date: workoutSessions.date,
      workoutType: workoutSessions.workoutType,
      notes: workoutSessions.notes,
      title: workoutSessions.title,
      sessionStatus: workoutSessions.sessionStatus,
      plannedWorkoutId: workoutSessions.plannedWorkoutId,
    })
    .from(workoutSessions)
    .orderBy(desc(workoutSessions.date), desc(workoutSessions.id))
    .limit(limit);

  return sessions.map((session) => ({
    ...session,
    workoutType: session.workoutType as RecentActivityEntry["workoutType"],
    sessionStatus: session.sessionStatus as RecentActivityEntry["sessionStatus"],
  }));
}

export async function deleteActivityLog(id: number) {
  await db.delete(exercises).where(eq(exercises.sessionId, id));
  await db.delete(cardio).where(eq(cardio.sessionId, id));
  await db.delete(weightLog).where(eq(weightLog.sessionId, id));

  const session = await db
    .select({ plannedWorkoutId: workoutSessions.plannedWorkoutId })
    .from(workoutSessions)
    .where(eq(workoutSessions.id, id))
    .limit(1);

  if (session[0]?.plannedWorkoutId) {
    await db
      .update(plannedWorkouts)
      .set({ status: "pending" })
      .where(eq(plannedWorkouts.id, session[0].plannedWorkoutId));
  }

  await db.delete(workoutSessions).where(eq(workoutSessions.id, id));

  revalidatePath("/");
  revalidatePath("/history");
  revalidatePath("/log");
  return { success: true };
}

export async function getStrengthProgression(
  exerciseName?: string
): Promise<StrengthProgressionPoint[]> {
  const allExerciseNames = await db
    .selectDistinct({ exerciseName: exercises.exerciseName })
    .from(exercises)
    .orderBy(asc(exercises.exerciseName));

  const selectedExercise =
    exerciseName || allExerciseNames[0]?.exerciseName || undefined;

  if (!selectedExercise) {
    return [];
  }

  const results = await db
    .select({
      date: exercises.date,
      exerciseName: exercises.exerciseName,
      weightLbs: exercises.weightLbs,
    })
    .from(exercises)
    .where(eq(exercises.exerciseName, selectedExercise))
    .orderBy(asc(exercises.date), asc(exercises.id));

  let changeSum = 0;
  let changeCount = 0;

  return results.map((entry, index) => {
    if (index === 0) {
      return {
        date: entry.date,
        exerciseName: entry.exerciseName,
        weightLbs: entry.weightLbs,
        weightChange: null,
        percentChange: null,
        runningAvgChange: null,
      };
    }

    const previous = results[index - 1];
    const weightChange = roundOneDecimal(entry.weightLbs - previous.weightLbs);
    const percentChange =
      previous.weightLbs !== 0
        ? roundOneDecimal(((entry.weightLbs - previous.weightLbs) / previous.weightLbs) * 100)
        : 0;

    changeSum += weightChange;
    changeCount += 1;

    return {
      date: entry.date,
      exerciseName: entry.exerciseName,
      weightLbs: entry.weightLbs,
      weightChange,
      percentChange,
      runningAvgChange: roundOneDecimal(changeSum / changeCount),
    };
  });
}

export async function getStrengthProgressionOptions() {
  const rows = await db
    .selectDistinct({ exerciseName: exercises.exerciseName })
    .from(exercises)
    .orderBy(asc(exercises.exerciseName));

  return rows.map((row) => row.exerciseName);
}

export async function getWeeklyCheckInInsight(): Promise<WeeklyCheckInInsight> {
  const latest = await db
    .select({
      id: weeklyCheckIns.id,
      date: weeklyCheckIns.date,
      waistInches: weeklyCheckIns.waistInches,
      energyLevel: weeklyCheckIns.energyLevel,
      stepCount: weeklyCheckIns.stepCount,
      frontPhotoUrl: weeklyCheckIns.frontPhotoUrl,
      sidePhotoUrl: weeklyCheckIns.sidePhotoUrl,
      notes: weeklyCheckIns.notes,
    })
    .from(weeklyCheckIns)
    .orderBy(desc(weeklyCheckIns.date), desc(weeklyCheckIns.id))
    .limit(1);

  const [countRow] = await db
    .select({ count: count() })
    .from(weeklyCheckIns);

  return {
    latest: latest[0] ?? null,
    count: countRow.count,
  };
}
