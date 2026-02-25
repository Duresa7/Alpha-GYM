"use server";

import { db } from "@/db";
import { userSettings, weightLog } from "@/db/schema";
import { eq, asc, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type { WeightLossLevel, WeightGoalStatus } from "@/types";

const LEVEL_THRESHOLDS = [
  { level: 1, xpNeeded: 0, title: "Starting Out" },
  { level: 2, xpNeeded: 50, title: "Getting Started" },
  { level: 3, xpNeeded: 100, title: "Building Momentum" },
  { level: 4, xpNeeded: 200, title: "Consistent" },
  { level: 5, xpNeeded: 300, title: "Dedicated" },
  { level: 6, xpNeeded: 500, title: "Warrior" },
  { level: 7, xpNeeded: 750, title: "Elite" },
  { level: 8, xpNeeded: 1000, title: "Champion" },
  { level: 9, xpNeeded: 1500, title: "Legend" },
  { level: 10, xpNeeded: 2000, title: "Alpha" },
];

export async function getWeightGoal(): Promise<number | null> {
  const result = await db
    .select({ value: userSettings.value })
    .from(userSettings)
    .where(eq(userSettings.key, "goalWeight"))
    .limit(1);

  return result[0] ? Number(result[0].value) : null;
}

export async function setWeightGoal(goalWeight: number) {
  const existing = await db
    .select({ id: userSettings.id })
    .from(userSettings)
    .where(eq(userSettings.key, "goalWeight"))
    .limit(1);

  if (existing[0]) {
    await db
      .update(userSettings)
      .set({ value: String(goalWeight) })
      .where(eq(userSettings.key, "goalWeight"));
  } else {
    await db
      .insert(userSettings)
      .values({ key: "goalWeight", value: String(goalWeight) });
  }

  revalidatePath("/");
  return { success: true };
}

export async function getWeightLossLevel(): Promise<WeightLossLevel> {
  const firstWeight = await db
    .select({ weightLbs: weightLog.weightLbs })
    .from(weightLog)
    .orderBy(asc(weightLog.date), asc(weightLog.id))
    .limit(1);

  if (!firstWeight[0]) {
    return {
      level: 1,
      title: "Starting Out",
      currentXP: 0,
      xpForNextLevel: 50,
      totalXP: 0,
      progressPercent: 0,
    };
  }

  // Find the lowest weight ever recorded (best progress)
  const allWeights = await db
    .select({ weightLbs: weightLog.weightLbs })
    .from(weightLog)
    .orderBy(asc(weightLog.weightLbs))
    .limit(1);

  const startWeight = firstWeight[0].weightLbs;
  const bestWeight = allWeights[0]?.weightLbs ?? startWeight;

  // Each 0.1 lb lost = 1 XP (only gains from loss, never negative)
  const totalXP = Math.max(
    0,
    Math.round((startWeight - bestWeight) * 10)
  );

  // Find current level
  let cumulativeXP = 0;
  let currentLevel = LEVEL_THRESHOLDS[0];

  for (const threshold of LEVEL_THRESHOLDS) {
    cumulativeXP += threshold.xpNeeded;
    if (totalXP >= cumulativeXP) {
      currentLevel = threshold;
    } else {
      break;
    }
  }

  // Calculate XP within current level
  let xpBefore = 0;
  for (const threshold of LEVEL_THRESHOLDS) {
    if (threshold.level <= currentLevel.level) {
      xpBefore += threshold.xpNeeded;
    }
  }

  const nextLevel = LEVEL_THRESHOLDS.find(
    (t) => t.level === currentLevel.level + 1
  );
  const xpIntoLevel = totalXP - xpBefore;
  const xpForNextLevel = nextLevel?.xpNeeded ?? 0;
  const progressPercent =
    xpForNextLevel > 0
      ? Math.min(100, Math.round((xpIntoLevel / xpForNextLevel) * 100))
      : 100;

  return {
    level: currentLevel.level,
    title: currentLevel.title,
    currentXP: xpIntoLevel,
    xpForNextLevel,
    totalXP,
    progressPercent,
  };
}

export async function getGoalStatus(): Promise<WeightGoalStatus> {
  const goalWeight = await getWeightGoal();

  const firstWeight = await db
    .select({ weightLbs: weightLog.weightLbs })
    .from(weightLog)
    .orderBy(asc(weightLog.date), asc(weightLog.id))
    .limit(1);

  const latestWeight = await db
    .select({ weightLbs: weightLog.weightLbs })
    .from(weightLog)
    .orderBy(desc(weightLog.date), desc(weightLog.id))
    .limit(1);

  const startWeight = firstWeight[0]?.weightLbs ?? null;
  const currentWeight = latestWeight[0]?.weightLbs ?? null;

  if (!startWeight || !currentWeight || !goalWeight) {
    return {
      goalWeight,
      currentWeight,
      startWeight,
      lostSoFar: 0,
      remaining: 0,
      progressPercent: 0,
    };
  }

  const totalToLose = startWeight - goalWeight;
  const lostSoFar = Math.round((startWeight - currentWeight) * 10) / 10;
  const remaining = Math.round((currentWeight - goalWeight) * 10) / 10;
  const progressPercent =
    totalToLose > 0
      ? Math.min(100, Math.max(0, Math.round((lostSoFar / totalToLose) * 100)))
      : 0;

  return {
    goalWeight,
    currentWeight,
    startWeight,
    lostSoFar,
    remaining,
    progressPercent,
  };
}
