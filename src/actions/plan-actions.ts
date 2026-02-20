"use server";

import { db } from "@/db";
import { weeklyPlan } from "@/db/schema";
import { asc } from "drizzle-orm";
import type { WeeklyPlanItem } from "@/types";

const DAY_ORDER = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export async function getWeeklyPlan(): Promise<
  Record<string, WeeklyPlanItem[]>
> {
  const results = await db
    .select()
    .from(weeklyPlan)
    .orderBy(asc(weeklyPlan.orderIndex));

  const grouped: Record<string, WeeklyPlanItem[]> = {};
  for (const day of DAY_ORDER) {
    grouped[day] = [];
  }

  for (const item of results) {
    if (grouped[item.dayOfWeek]) {
      grouped[item.dayOfWeek].push(item);
    }
  }

  return grouped;
}
