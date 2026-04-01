"use server";

import { revalidatePath } from "next/cache";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { weightLog } from "@/db/schema";
import { DEFAULT_GOAL_KEYS } from "@/lib/constants";
import { SETTINGS_REVALIDATE_PATHS } from "@/lib/domain";
import { getDateKeyDiff } from "@/lib/date";
import {
  getNumericSetting,
  getNumericSettings,
  upsertNumericSetting,
} from "@/lib/settings-store";
import type { GoalSettingsValues } from "@/lib/validators";
import type {
  UserGoalSettings,
  WeightGoalStatus,
  WeightLossLevel,
} from "@/types";

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

function roundOneDecimal(value: number) {
  return Math.round(value * 10) / 10;
}

export async function getWeightGoal() {
  return getNumericSetting(DEFAULT_GOAL_KEYS.goalWeight);
}

export async function setWeightGoal(goalWeight: number) {
  await upsertNumericSetting(DEFAULT_GOAL_KEYS.goalWeight, goalWeight);
  SETTINGS_REVALIDATE_PATHS.forEach((path) => revalidatePath(path));
  return { success: true };
}

export async function getGoalSettings(): Promise<UserGoalSettings> {
  const settings = await getNumericSettings([
    DEFAULT_GOAL_KEYS.goalWeight,
    DEFAULT_GOAL_KEYS.waterGoalOz,
    DEFAULT_GOAL_KEYS.weeklyWorkoutTarget,
    DEFAULT_GOAL_KEYS.weeklyCardioMinutesTarget,
    DEFAULT_GOAL_KEYS.weeklyWeighInTarget,
    DEFAULT_GOAL_KEYS.dailyStepTarget,
  ] as const);

  return {
    goalWeight: settings.goalWeight,
    waterGoalOz: settings.waterGoalOz,
    weeklyWorkoutTarget: settings.weeklyWorkoutTarget,
    weeklyCardioMinutesTarget: settings.weeklyCardioMinutesTarget,
    weeklyWeighInTarget: settings.weeklyWeighInTarget,
    dailyStepTarget: settings.dailyStepTarget,
  };
}

export async function saveGoalSettings(values: GoalSettingsValues) {
  const updates = Object.entries(values).filter(([, value]) => value !== undefined) as [
    keyof GoalSettingsValues,
    number,
  ][];

  for (const [key, value] of updates) {
    await upsertNumericSetting(key, value);
  }

  SETTINGS_REVALIDATE_PATHS.forEach((path) => revalidatePath(path));
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

  const bestWeight = await db
    .select({ weightLbs: weightLog.weightLbs })
    .from(weightLog)
    .orderBy(asc(weightLog.weightLbs))
    .limit(1);

  const startWeight = firstWeight[0].weightLbs;
  const lowestWeight = bestWeight[0]?.weightLbs ?? startWeight;
  const totalXP = Math.max(0, Math.round((startWeight - lowestWeight) * 10));

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

  let xpBefore = 0;
  for (const threshold of LEVEL_THRESHOLDS) {
    if (threshold.level <= currentLevel.level) {
      xpBefore += threshold.xpNeeded;
    }
  }

  const nextLevel = LEVEL_THRESHOLDS.find((entry) => entry.level === currentLevel.level + 1);
  const currentXP = totalXP - xpBefore;
  const xpForNextLevel = nextLevel?.xpNeeded ?? 0;
  const progressPercent =
    xpForNextLevel > 0
      ? Math.min(100, Math.round((currentXP / xpForNextLevel) * 100))
      : 100;

  return {
    level: currentLevel.level,
    title: currentLevel.title,
    currentXP,
    xpForNextLevel,
    totalXP,
    progressPercent,
  };
}

export async function getGoalStatus(): Promise<WeightGoalStatus> {
  const [goalWeight, weights] = await Promise.all([
    getWeightGoal(),
    db
      .select({
        date: weightLog.date,
        weightLbs: weightLog.weightLbs,
      })
      .from(weightLog)
      .orderBy(asc(weightLog.date), asc(weightLog.id)),
  ]);

  const startWeight = weights[0]?.weightLbs ?? null;
  const currentWeight = weights[weights.length - 1]?.weightLbs ?? null;

  if (!startWeight || !currentWeight || !goalWeight) {
    return {
      goalWeight,
      currentWeight,
      startWeight,
      lostSoFar: 0,
      remaining: 0,
      progressPercent: 0,
      rollingAverage: null,
      weeklyLossRate: null,
      forecastDaysToGoal: null,
    };
  }

  const recentWindow = weights.slice(Math.max(0, weights.length - 7));
  const rollingAverage =
    recentWindow.length > 0
      ? roundOneDecimal(
          recentWindow.reduce((sum, entry) => sum + entry.weightLbs, 0) / recentWindow.length
        )
      : currentWeight;

  const recentRateWindow = weights.slice(Math.max(0, weights.length - 4));
  let weeklyLossRate: number | null = null;

  if (recentRateWindow.length >= 2) {
    const first = recentRateWindow[0];
    const last = recentRateWindow[recentRateWindow.length - 1];
    const days = Math.max(
      1,
      Math.round(getDateKeyDiff(first.date, last.date) / 86400000)
    );
    weeklyLossRate = roundOneDecimal(((first.weightLbs - last.weightLbs) / days) * 7);
  }

  const lostSoFar = roundOneDecimal(startWeight - currentWeight);
  const remaining = roundOneDecimal(currentWeight - goalWeight);
  const totalToLose = startWeight - goalWeight;
  const progressPercent =
    totalToLose > 0
      ? Math.min(100, Math.max(0, Math.round((lostSoFar / totalToLose) * 100)))
      : 0;

  const forecastDaysToGoal =
    weeklyLossRate && weeklyLossRate > 0 && remaining > 0
      ? Math.ceil(remaining / (weeklyLossRate / 7))
      : null;

  return {
    goalWeight,
    currentWeight,
    startWeight,
    lostSoFar,
    remaining,
    progressPercent,
    rollingAverage,
    weeklyLossRate,
    forecastDaysToGoal,
  };
}
