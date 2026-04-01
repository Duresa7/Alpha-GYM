"use server";

import { revalidatePath } from "next/cache";
import { and, asc, eq, gte, inArray, isNull, lte, ne } from "drizzle-orm";
import { addDays } from "date-fns";
import { db } from "@/db";
import {
  plannedWorkoutItems,
  plannedWorkouts,
  workoutTemplateItems,
  workoutTemplates,
} from "@/db/schema";
import { formatDateKey, getCurrentWeekRange, parseDateKey } from "@/lib/date";
import type {
  PlannedWorkoutValues,
  WorkoutTemplateValues,
} from "@/lib/validators";
import type {
  AdherenceSummary,
  PlannedWorkout,
  TodayFocusData,
  WorkoutTemplate,
} from "@/types";

const PLAN_REVALIDATE_PATHS = ["/", "/log", "/plan"] as const;

const STARTER_TEMPLATE_BY_DAY: Record<number, string> = {
  1: "Upper A",
  2: "Lower A",
  3: "Conditioning",
  4: "Upper A",
  5: "Lower A",
  6: "Quick 30",
  0: "Recovery",
};

function calculateCompletionRate(completed: number, total: number) {
  return total > 0 ? Math.round((completed / total) * 100) : 0;
}

function calculateCurrentStreak(completedDates: string[], pendingToday: boolean) {
  if (pendingToday) {
    return 0;
  }

  const distinctDates = [...new Set(completedDates)].sort((a, b) => b.localeCompare(a));
  let streak = 0;
  let cursor = new Date();

  for (const date of distinctDates) {
    const cursorKey = formatDateKey(cursor);
    if (date !== cursorKey) {
      if (streak === 0 && formatDateKey(addDays(cursor, -1)) === date) {
        streak = 1;
        cursor = addDays(cursor, -1);
        continue;
      }
      break;
    }

    streak += 1;
    cursor = addDays(cursor, -1);
  }

  return streak;
}

function revalidatePlanViews() {
  PLAN_REVALIDATE_PATHS.forEach((path) => revalidatePath(path));
}

async function cloneTemplateItemsToPlannedWorkout(
  templateId: number,
  plannedWorkoutId: number
) {
  const items = await db
    .select()
    .from(workoutTemplateItems)
    .where(eq(workoutTemplateItems.templateId, templateId))
    .orderBy(asc(workoutTemplateItems.orderIndex));

  if (!items.length) {
    return;
  }

  await db.insert(plannedWorkoutItems).values(
    items.map((item) => ({
      plannedWorkoutId,
      templateItemId: item.id,
      itemType: item.itemType,
      exerciseName: item.exerciseName,
      instruction: item.instruction,
      target: item.target,
      section: item.section,
      isRequired: item.isRequired,
      orderIndex: item.orderIndex,
    }))
  );
}

function mapTemplates<
  TTemplate extends {
    id: number;
    name: string;
    description: string | null;
    goalFocus: string | null;
    estimatedDurationMin: number | null;
    isArchived: boolean;
  },
  TItem extends {
    id: number;
    templateId: number;
    itemType: string;
    exerciseName: string;
    instruction: string | null;
    target: string | null;
    section: string;
    isRequired: boolean;
    orderIndex: number;
  },
>(templates: TTemplate[], items: TItem[]): WorkoutTemplate[] {
  return templates.map((template) => ({
    ...template,
    items: items
      .filter((item) => item.templateId === template.id)
      .map((item) => ({
        ...item,
        itemType: item.itemType as "exercise" | "cardio" | "mobility",
      })),
  }));
}

function mapPlannedWorkouts<
  TWorkout extends {
    id: number;
    date: string;
    templateId: number | null;
    title: string;
    notes: string | null;
    status: string;
    missReason: string | null;
    carriedFromDate: string | null;
    estimatedDurationMin: number | null;
  },
  TItem extends {
    id: number;
    plannedWorkoutId: number;
    templateItemId: number | null;
    itemType: string;
    exerciseName: string;
    instruction: string | null;
    target: string | null;
    section: string;
    isRequired: boolean;
    completed: boolean;
    orderIndex: number;
  },
>(workouts: TWorkout[], items: TItem[]): PlannedWorkout[] {
  return workouts.map((workout) => ({
    ...workout,
    status: workout.status as PlannedWorkout["status"],
    items: items
      .filter((item) => item.plannedWorkoutId === workout.id)
      .map((item) => ({
        ...item,
        itemType: item.itemType as "exercise" | "cardio" | "mobility",
      })),
  }));
}

export async function ensureStarterPlannedWorkouts() {
  const today = new Date();
  const dates = Array.from({ length: 7 }, (_, index) => formatDateKey(addDays(today, index)));

  const existing = await db
    .select({ date: plannedWorkouts.date })
    .from(plannedWorkouts)
    .where(and(gte(plannedWorkouts.date, dates[0]), lte(plannedWorkouts.date, dates[dates.length - 1])));

  const existingDates = new Set(existing.map((entry) => entry.date));
  const templates = await db
    .select({
      id: workoutTemplates.id,
      name: workoutTemplates.name,
      estimatedDurationMin: workoutTemplates.estimatedDurationMin,
    })
    .from(workoutTemplates)
    .where(eq(workoutTemplates.isArchived, false));

  const templateByName = new Map(templates.map((template) => [template.name, template]));

  for (let index = 0; index < dates.length; index += 1) {
    const targetDate = addDays(today, index);
    const date = formatDateKey(targetDate);
    if (existingDates.has(date)) {
      continue;
    }

    const templateName = STARTER_TEMPLATE_BY_DAY[targetDate.getDay()];
    const template = templateByName.get(templateName);
    if (!template) {
      continue;
    }

    const [plannedWorkout] = await db
      .insert(plannedWorkouts)
      .values({
        date,
        templateId: template.id,
        title: template.name,
        estimatedDurationMin: template.estimatedDurationMin,
      })
      .returning({ id: plannedWorkouts.id });

    await cloneTemplateItemsToPlannedWorkout(template.id, plannedWorkout.id);
  }
}

export async function getWorkoutTemplates(): Promise<WorkoutTemplate[]> {
  const templates = await db
    .select({
      id: workoutTemplates.id,
      name: workoutTemplates.name,
      description: workoutTemplates.description,
      goalFocus: workoutTemplates.goalFocus,
      estimatedDurationMin: workoutTemplates.estimatedDurationMin,
      isArchived: workoutTemplates.isArchived,
    })
    .from(workoutTemplates)
    .orderBy(asc(workoutTemplates.name));

  const items = await db
    .select({
      id: workoutTemplateItems.id,
      templateId: workoutTemplateItems.templateId,
      itemType: workoutTemplateItems.itemType,
      exerciseName: workoutTemplateItems.exerciseName,
      instruction: workoutTemplateItems.instruction,
      target: workoutTemplateItems.target,
      section: workoutTemplateItems.section,
      isRequired: workoutTemplateItems.isRequired,
      orderIndex: workoutTemplateItems.orderIndex,
    })
    .from(workoutTemplateItems)
    .orderBy(asc(workoutTemplateItems.orderIndex));

  return mapTemplates(templates, items);
}

export async function createWorkoutTemplate(data: WorkoutTemplateValues) {
  const [template] = await db
    .insert(workoutTemplates)
    .values({
      name: data.name,
      description: data.description || null,
      goalFocus: data.goalFocus || null,
      estimatedDurationMin: data.estimatedDurationMin ?? null,
    })
    .returning({ id: workoutTemplates.id });

  await db.insert(workoutTemplateItems).values(
    data.items.map((item, index) => ({
      templateId: template.id,
      itemType: item.itemType,
      exerciseName: item.exerciseName,
      instruction: item.instruction || null,
      target: item.target || null,
      section: item.section,
      isRequired: item.isRequired,
      orderIndex: index + 1,
    }))
  );

  revalidatePlanViews();
  return { success: true };
}

export async function duplicateWorkoutTemplate(templateId: number) {
  const templates = await getWorkoutTemplates();
  const template = templates.find((entry) => entry.id === templateId);
  if (!template) {
    throw new Error("Template not found");
  }

  return createWorkoutTemplate({
    name: `${template.name} Copy`,
    description: template.description || "",
    goalFocus: template.goalFocus || "",
    estimatedDurationMin: template.estimatedDurationMin ?? undefined,
    items: template.items.map((item) => ({
      itemType: item.itemType,
      exerciseName: item.exerciseName,
      instruction: item.instruction || "",
      target: item.target || "",
      section: item.section,
      isRequired: item.isRequired,
    })),
  });
}

export async function createPlannedWorkout(data: PlannedWorkoutValues) {
  const [plannedWorkout] = await db
    .insert(plannedWorkouts)
    .values({
      date: data.date,
      templateId: data.templateId ?? null,
      title: data.title,
      notes: data.notes || null,
      estimatedDurationMin: data.estimatedDurationMin ?? null,
    })
    .returning({ id: plannedWorkouts.id });

  if (data.templateId) {
    await cloneTemplateItemsToPlannedWorkout(data.templateId, plannedWorkout.id);
  }

  revalidatePlanViews();
  return { success: true };
}

export async function getPlannedWorkoutsForRange(dateFrom: string, dateTo: string) {
  await ensureStarterPlannedWorkouts();

  const workouts = await db
    .select({
      id: plannedWorkouts.id,
      date: plannedWorkouts.date,
      templateId: plannedWorkouts.templateId,
      title: plannedWorkouts.title,
      notes: plannedWorkouts.notes,
      status: plannedWorkouts.status,
      missReason: plannedWorkouts.missReason,
      carriedFromDate: plannedWorkouts.carriedFromDate,
      estimatedDurationMin: plannedWorkouts.estimatedDurationMin,
    })
    .from(plannedWorkouts)
    .where(and(gte(plannedWorkouts.date, dateFrom), lte(plannedWorkouts.date, dateTo)))
    .orderBy(asc(plannedWorkouts.date), asc(plannedWorkouts.id));

  const items = workouts.length
    ? await db
        .select({
          id: plannedWorkoutItems.id,
          plannedWorkoutId: plannedWorkoutItems.plannedWorkoutId,
          templateItemId: plannedWorkoutItems.templateItemId,
          itemType: plannedWorkoutItems.itemType,
          exerciseName: plannedWorkoutItems.exerciseName,
          instruction: plannedWorkoutItems.instruction,
          target: plannedWorkoutItems.target,
          section: plannedWorkoutItems.section,
          isRequired: plannedWorkoutItems.isRequired,
          completed: plannedWorkoutItems.completed,
          orderIndex: plannedWorkoutItems.orderIndex,
        })
        .from(plannedWorkoutItems)
        .where(inArray(plannedWorkoutItems.plannedWorkoutId, workouts.map((workout) => workout.id)))
        .orderBy(asc(plannedWorkoutItems.orderIndex))
    : [];

  return mapPlannedWorkouts(workouts, items);
}

export async function getTodayFocusData(): Promise<TodayFocusData> {
  const today = formatDateKey(new Date());
  const { start, end } = getCurrentWeekRange();
  const [todayWorkouts, carriedForward, weeklySummary] = await Promise.all([
    getPlannedWorkoutsForRange(today, today),
    getPlannedWorkoutsForRange("1900-01-01", today),
    getAdherenceSummary(),
  ]);

  const backlog = carriedForward.filter(
    (workout) =>
      workout.date < today &&
      (workout.status === "pending" || workout.status === "carried_forward")
  );

  const thisWeek = await getPlannedWorkoutsForRange(formatDateKey(start), formatDateKey(end));
  const todaysWorkout =
    todayWorkouts.find((workout) => workout.status === "pending") ||
    todayWorkouts.find((workout) => workout.status !== "skipped") ||
    null;

  return {
    workout: todaysWorkout,
    carriedForward: backlog.slice(0, 3),
    weeklySummary: {
      ...weeklySummary,
      plannedThisWeek: thisWeek.length,
    },
  };
}

export async function getAdherenceSummary(): Promise<AdherenceSummary> {
  await ensureStarterPlannedWorkouts();

  const { start, end } = getCurrentWeekRange();
  const dateFrom = formatDateKey(start);
  const dateTo = formatDateKey(end);

  const weekly = await db
    .select({
      date: plannedWorkouts.date,
      status: plannedWorkouts.status,
    })
    .from(plannedWorkouts)
    .where(and(gte(plannedWorkouts.date, dateFrom), lte(plannedWorkouts.date, dateTo)));

  const completedThisWeek = weekly.filter(
    (entry) => entry.status === "completed" || entry.status === "partial"
  ).length;
  const skippedThisWeek = weekly.filter((entry) => entry.status === "skipped").length;
  const carriedForwardThisWeek = weekly.filter(
    (entry) => entry.status === "carried_forward"
  ).length;

  const completionRate = calculateCompletionRate(completedThisWeek, weekly.length);

  const recentCompletions = await db
    .select({
      date: plannedWorkouts.date,
    })
    .from(plannedWorkouts)
    .where(
      and(
        ne(plannedWorkouts.status, "pending"),
        ne(plannedWorkouts.status, "skipped")
      )
    )
    .orderBy(asc(plannedWorkouts.date));

  const pendingToday = weekly.some(
    (entry) => entry.date === formatDateKey(new Date()) && entry.status === "pending"
  );

  return {
    plannedThisWeek: weekly.length,
    completedThisWeek,
    skippedThisWeek,
    carriedForwardThisWeek,
    completionRate,
    currentStreak: calculateCurrentStreak(
      recentCompletions.map((entry) => entry.date),
      pendingToday
    ),
  };
}

export async function skipPlannedWorkout(id: number, reason: string) {
  await db
    .update(plannedWorkouts)
    .set({
      status: "skipped",
      missReason: reason,
    })
    .where(eq(plannedWorkouts.id, id));

  revalidatePlanViews();
  return { success: true };
}

export async function carryForwardPlannedWorkout(id: number) {
  db.transaction((tx) => {
    const current = tx
      .select()
      .from(plannedWorkouts)
      .where(eq(plannedWorkouts.id, id))
      .limit(1)
      .get();

    if (!current) {
      throw new Error("Workout not found");
    }

    const tomorrow = formatDateKey(addDays(parseDateKey(current.date), 1));

    const existingTomorrow = tx
      .select({ id: plannedWorkouts.id })
      .from(plannedWorkouts)
      .where(
        and(
          eq(plannedWorkouts.date, tomorrow),
          eq(plannedWorkouts.title, current.title),
          current.templateId
            ? eq(plannedWorkouts.templateId, current.templateId)
            : isNull(plannedWorkouts.templateId)
        )
      )
      .limit(1)
      .get();

    if (!existingTomorrow) {
      const newWorkout = tx
        .insert(plannedWorkouts)
        .values({
          date: tomorrow,
          templateId: current.templateId,
          title: current.title,
          notes: current.notes,
          status: "pending",
          carriedFromDate: current.date,
          estimatedDurationMin: current.estimatedDurationMin,
        })
        .returning({ id: plannedWorkouts.id })
        .get();

      const items = tx
        .select()
        .from(plannedWorkoutItems)
        .where(eq(plannedWorkoutItems.plannedWorkoutId, id))
        .orderBy(asc(plannedWorkoutItems.orderIndex))
        .all();

      if (items.length) {
        tx.insert(plannedWorkoutItems)
          .values(
            items.map((item) => ({
              plannedWorkoutId: newWorkout.id,
              templateItemId: item.templateItemId,
              itemType: item.itemType,
              exerciseName: item.exerciseName,
              instruction: item.instruction,
              target: item.target,
              section: item.section,
              isRequired: item.isRequired,
              completed: false,
              orderIndex: item.orderIndex,
            }))
          )
          .run();
      }
    }

    tx.update(plannedWorkouts)
      .set({
        status: "carried_forward",
      })
      .where(eq(plannedWorkouts.id, id))
      .run();
  });

  revalidatePlanViews();
  return { success: true };
}
