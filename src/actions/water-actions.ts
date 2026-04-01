"use server";

import { revalidatePath } from "next/cache";
import { desc, eq, gte, sql } from "drizzle-orm";
import { db } from "@/db";
import { waterIntake } from "@/db/schema";
import { DEFAULT_GOAL_KEYS } from "@/lib/constants";
import { SETTINGS_REVALIDATE_PATHS } from "@/lib/domain";
import { formatDateKey, getDateKeyOffset } from "@/lib/date";
import { getNumericSetting, upsertNumericSetting } from "@/lib/settings-store";
import type { WaterIntakeStatus } from "@/types";

export async function addWaterIntake(amountOz: number) {
  await db.insert(waterIntake).values({
    date: formatDateKey(new Date()),
    amountOz,
  });

  revalidatePath("/");
  return { success: true };
}

export async function deleteWaterEntry(id: number) {
  await db.delete(waterIntake).where(eq(waterIntake.id, id));
  revalidatePath("/");
  return { success: true };
}

export async function getWaterGoal() {
  return getNumericSetting(DEFAULT_GOAL_KEYS.waterGoalOz);
}

export async function setWaterGoal(goalOz: number) {
  await upsertNumericSetting(DEFAULT_GOAL_KEYS.waterGoalOz, goalOz);
  SETTINGS_REVALIDATE_PATHS.forEach((path) => revalidatePath(path));
  return { success: true };
}

export async function getWaterIntakeStatus(): Promise<WaterIntakeStatus> {
  const currentDate = new Date();
  const today = formatDateKey(currentDate);
  const sevenDaysAgo = getDateKeyOffset(currentDate, -6);

  const [goalOz, todayEntries, weeklyEntries] = await Promise.all([
    getWaterGoal(),
    db
      .select({ amountOz: waterIntake.amountOz })
      .from(waterIntake)
      .where(eq(waterIntake.date, today)),
    db
      .select({
        date: waterIntake.date,
        totalOz: sql<number>`SUM(${waterIntake.amountOz})`,
      })
      .from(waterIntake)
      .where(gte(waterIntake.date, sevenDaysAgo))
      .groupBy(waterIntake.date)
      .orderBy(waterIntake.date),
  ]);

  const todayTotal = Math.round(todayEntries.reduce((sum, entry) => sum + entry.amountOz, 0) * 10) / 10;
  const progressPercent =
    goalOz && goalOz > 0 ? Math.min(100, Math.round((todayTotal / goalOz) * 100)) : 0;

  const weeklyData = Array.from({ length: 7 }, (_, index) => {
    const date = getDateKeyOffset(currentDate, index - 6);
    const entry = weeklyEntries.find((row) => row.date === date);
    return {
      date,
      totalOz: entry ? Number(entry.totalOz) : 0,
    };
  });

  return {
    todayTotal,
    goalOz,
    progressPercent,
    weeklyData,
  };
}

export async function getTodayWaterEntries() {
  const today = formatDateKey(new Date());
  return db
    .select({
      id: waterIntake.id,
      date: waterIntake.date,
      amountOz: waterIntake.amountOz,
    })
    .from(waterIntake)
    .where(eq(waterIntake.date, today))
    .orderBy(desc(waterIntake.id));
}
