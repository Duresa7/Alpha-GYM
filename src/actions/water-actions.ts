"use server";

import { db } from "@/db";
import { waterIntake, userSettings } from "@/db/schema";
import { eq, gte, desc, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { format, subDays } from "date-fns";
import type { WaterIntakeStatus } from "@/types";

export async function addWaterIntake(amountOz: number) {
  const today = format(new Date(), "yyyy-MM-dd");
  await db.insert(waterIntake).values({ date: today, amountOz });
  revalidatePath("/");
  return { success: true };
}

export async function deleteWaterEntry(id: number) {
  await db.delete(waterIntake).where(eq(waterIntake.id, id));
  revalidatePath("/");
  return { success: true };
}

export async function getWaterGoal(): Promise<number | null> {
  const result = await db
    .select({ value: userSettings.value })
    .from(userSettings)
    .where(eq(userSettings.key, "waterGoalOz"))
    .limit(1);
  return result[0] ? Number(result[0].value) : null;
}

export async function setWaterGoal(goalOz: number) {
  const existing = await db
    .select({ id: userSettings.id })
    .from(userSettings)
    .where(eq(userSettings.key, "waterGoalOz"))
    .limit(1);

  if (existing[0]) {
    await db
      .update(userSettings)
      .set({ value: String(goalOz) })
      .where(eq(userSettings.key, "waterGoalOz"));
  } else {
    await db
      .insert(userSettings)
      .values({ key: "waterGoalOz", value: String(goalOz) });
  }

  revalidatePath("/");
  return { success: true };
}

export async function getWaterIntakeStatus(): Promise<WaterIntakeStatus> {
  const today = format(new Date(), "yyyy-MM-dd");
  const sevenDaysAgo = format(subDays(new Date(), 6), "yyyy-MM-dd");

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

  const todayTotal =
    Math.round(todayEntries.reduce((sum, e) => sum + e.amountOz, 0) * 10) / 10;

  const progressPercent =
    goalOz && goalOz > 0
      ? Math.min(100, Math.round((todayTotal / goalOz) * 100))
      : 0;

  // Build 7-day array (fill in missing days with 0)
  const weeklyData: { date: string; totalOz: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = format(subDays(new Date(), i), "yyyy-MM-dd");
    const found = weeklyEntries.find((e) => e.date === d);
    weeklyData.push({ date: d, totalOz: found ? found.totalOz : 0 });
  }

  return { todayTotal, goalOz, progressPercent, weeklyData };
}

export async function getTodayWaterEntries() {
  const today = format(new Date(), "yyyy-MM-dd");
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
